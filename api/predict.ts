// "Who will win Polar Money SMP?" predictions.
// GET  /api/predict          -> vote totals and who picked which team
// POST /api/predict {name, team} -> cast or change a vote
//
// Votes live in one JSON file in the site's Vercel Blob store (polar-predictions).
// Writes use the file's ETag, so two people voting at the same moment can't overwrite each other.
import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import { createHmac, randomBytes } from 'node:crypto';

// Preview deployments use their own file and are always open, so voting can be tested without touching real votes.
const IS_PROD = process.env.VERCEL_ENV === 'production';
const PATH = IS_PROD ? 'predictions/state.json' : 'predictions/test-state.json';
const TEAMS = ['red', 'blue', 'green', 'pink'] as const;
type TeamKey = (typeof TEAMS)[number];

// Keep these two in step with src/data/predictions.ts.
const OPENS_AT = IS_PROD ? Date.parse('2026-11-27T19:30:00Z') : 0; // Fri 27 Nov, 7:30pm UK (after the bidding)
const CLOSES_AT = Date.parse('2026-12-26T00:00:00Z'); // the day the server starts

/** One device/connection can vote for at most this many different names (stops ballot stuffing). */
const MAX_NAMES_PER_IP = 3;
const NAME_RE = /^[A-Za-z0-9_.]{2,32}$/;

interface Vote { name: string; team: TeamKey; ip: string; tok?: string; at: number }
interface State { votes: Record<string, Vote>; updatedAt: number }

function json(body: unknown, status = 200, cache = 'no-store') {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': cache },
  });
}

async function load(fresh: boolean): Promise<{ state: State; etag?: string }> {
  try {
    const r = await get(PATH, { access: 'public', useCache: !fresh });
    if (r && r.statusCode === 200) {
      const state = JSON.parse(await new Response(r.stream).text()) as State;
      return { state: { votes: state.votes ?? {}, updatedAt: state.updatedAt ?? 0 }, etag: r.blob.etag };
    }
  } catch (e) {
    if ((e as Error)?.name !== 'BlobNotFoundError') throw e;
  }
  return { state: { votes: {}, updatedAt: 0 } };
}

function summary(state: State) {
  const counts: Record<TeamKey, number> = { red: 0, blue: 0, green: 0, pink: 0 };
  const voters: Record<TeamKey, string[]> = { red: [], blue: [], green: [], pink: [] };
  for (const v of Object.values(state.votes)) {
    if (!TEAMS.includes(v.team)) continue;
    counts[v.team]++;
    voters[v.team].push(v.name);
  }
  for (const t of TEAMS) voters[t].sort((a, b) => a.localeCompare(b));
  const now = Date.now();
  return {
    opensAt: OPENS_AT,
    closesAt: CLOSES_AT,
    open: now >= OPENS_AT && now < CLOSES_AT,
    total: Object.keys(state.votes).length,
    counts,
    voters,
    updatedAt: state.updatedAt,
  };
}

function keyed(value: string): string {
  return createHmac('sha256', process.env.BLOB_READ_WRITE_TOKEN ?? 'polar').update(value).digest('hex').slice(0, 16);
}

function clientKey(request: Request): string {
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
  // Only a keyed hash is stored, never the address itself.
  return createHmac('sha256', process.env.BLOB_READ_WRITE_TOKEN ?? 'polar').update(ip).digest('hex').slice(0, 16);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (!IS_PROD && url.searchParams.has('testvote')) {
    // Preview-only: /api/predict?testvote=<name>&team=<team> behaves like a POST.
    const fake = new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ name: url.searchParams.get('testvote'), team: url.searchParams.get('team'), token: url.searchParams.get('token') ?? undefined }),
    });
    return POST(fake);
  }
  try {
    const { state } = await load(false);
    return json(summary(state), 200, 'public, s-maxage=20, stale-while-revalidate=60');
  } catch {
    return json({ error: 'Could not load the votes right now.' }, 503);
  }
}

export async function POST(request: Request) {
  const now = Date.now();
  if (now < OPENS_AT) return json({ error: 'Predictions open after the draft.' }, 403);
  if (now >= CLOSES_AT) return json({ error: 'Predictions are locked - the season has started.' }, 403);

  let body: { name?: unknown; team?: unknown; token?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Bad request.' }, 400);
  }
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const team = body.team as TeamKey;
  if (!NAME_RE.test(name)) return json({ error: 'Type your Minecraft or Discord name (letters, numbers, _ and . only).' }, 400);
  if (!TEAMS.includes(team)) return json({ error: 'Pick a team.' }, 400);

  const key = name.toLowerCase();
  const ip = clientKey(request);
  // The browser keeps a secret token from its first vote, so people can change their pick even if their IP changes.
  const sentToken = typeof body.token === 'string' && /^[a-f0-9]{32}$/.test(body.token) ? body.token : null;
  const token = sentToken ?? randomBytes(16).toString('hex');

  for (let attempt = 0; attempt < 6; attempt++) {
    const { state, etag } = await load(true);
    const existing = state.votes[key];
    const sameVoter = !!existing && (existing.ip === ip || (!!sentToken && existing.tok === keyed(sentToken)));
    if (existing && !sameVoter) {
      return json({ error: `${existing.name} has already voted. If that's you, change your vote on the device you voted from.` }, 409);
    }
    if (!existing) {
      const fromThisIp = Object.values(state.votes).filter((v) => v.ip === ip).length;
      if (fromThisIp >= MAX_NAMES_PER_IP) return json({ error: 'Too many votes from this connection.' }, 429);
    }
    state.votes[key] = { name, team, ip, tok: keyed(token), at: now };
    state.updatedAt = now;
    try {
      await put(PATH, JSON.stringify(state), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        cacheControlMaxAge: 60,
        ...(etag ? { ifMatch: etag } : { allowOverwrite: false }),
      });
      return json({ ok: true, name, team, token, changed: !!existing && existing.team !== team, ...summary(state) });
    } catch (e) {
      // Someone else voted at the same moment: reload and try again.
      if (e instanceof BlobPreconditionFailedError || /already exists|precondition/i.test(String((e as Error)?.message))) {
        await new Promise((r) => setTimeout(r, 80 + Math.random() * 200));
        continue;
      }
      return json({ error: 'Could not save your vote. Try again in a minute.' }, 500);
    }
  }
  return json({ error: 'Lots of people voting right now - try again.' }, 503);
}
