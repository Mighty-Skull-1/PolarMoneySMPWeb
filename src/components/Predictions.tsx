import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Lock, Trophy, Users } from 'lucide-react';
import { skinUrl } from '../lib/skins';
import { PREDICTIONS_CLOSE_AT, PREDICTIONS_OPEN_AT, PREDICTION_TEAMS, type PredictionTeam } from '../data/predictions';
import type { TeamData } from '../types/tournament';

interface Summary {
  open: boolean;
  total: number;
  counts: Record<PredictionTeam, number>;
  voters: Record<PredictionTeam, string[]>;
}

type View = 'all' | 'viewers' | 'players';
const MY_VOTE_KEY = 'polar_prediction_v1';

function loadMyVote(): { name: string; team: PredictionTeam; token?: string } | null {
  try {
    const v = JSON.parse(localStorage.getItem(MY_VOTE_KEY) ?? 'null');
    return v && typeof v.name === 'string' && typeof v.team === 'string' ? v : null;
  } catch {
    return null;
  }
}

function saveMyVote(v: { name: string; team: PredictionTeam; token?: string }) {
  try {
    localStorage.setItem(MY_VOTE_KEY, JSON.stringify(v));
  } catch {
    // private mode: the vote still counts, we just can't remember it here
  }
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

/** "Who will win Polar Money SMP?" - viewers and players pick a team before the season starts. */
export const Predictions: React.FC<{ liveTeams: TeamData[] }> = ({ liveTeams }) => {
  const [now, setNow] = useState(() => Date.now());
  const [summary, setSummary] = useState<Summary | null>(null);
  const [myVote, setMyVote] = useState(loadMyVote);
  const [name, setName] = useState(() => loadMyVote()?.name ?? '');
  const [picked, setPicked] = useState<PredictionTeam | null>(() => loadMyVote()?.team ?? null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [view, setView] = useState<View>('all');

  const opensAt = Date.parse(PREDICTIONS_OPEN_AT);
  const closesAt = Date.parse(PREDICTIONS_CLOSE_AT);
  const beforeOpen = now < opensAt;
  const locked = now >= closesAt;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch('/api/predict');
      if (r.ok) setSummary(await r.json());
    } catch {
      // offline: keep what we have
    }
  }, []);

  useEffect(() => {
    if (beforeOpen) return;
    refresh();
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, 60_000);
    return () => clearInterval(id);
  }, [beforeOpen, refresh]);

  // Real teams from the server once they exist (captain, colour, players); the fixed list before that.
  const teams = useMemo(
    () =>
      PREDICTION_TEAMS.map((t) => {
        const live = liveTeams.find((lt) => lt.name.toLowerCase().includes(t.key));
        return {
          ...t,
          label: live ? live.name.replace(/^team\s*/i, 'Team ').replace(/^Team(\S)/, 'Team $1') : t.label,
          captain: live?.captainName || t.captain,
          members: live?.members.map((m) => m.name) ?? [],
        };
      }),
    [liveTeams],
  );

  const playerNames = useMemo(() => new Set(teams.flatMap((t) => [t.captain, ...t.members]).map((n) => n.toLowerCase())), [teams]);

  const counts = useMemo(() => {
    const out: Record<PredictionTeam, number> = { red: 0, blue: 0, green: 0, pink: 0 };
    if (!summary) return out;
    for (const t of PREDICTION_TEAMS) {
      if (view === 'all') out[t.key] = summary.counts[t.key] ?? 0;
      else
        out[t.key] = (summary.voters[t.key] ?? []).filter((n) => playerNames.has(n.toLowerCase()) === (view === 'players')).length;
    }
    return out;
  }, [summary, view, playerNames]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const vote = async () => {
    if (!picked || busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), team: picked, token: myVote?.token }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) {
        setMsg({ ok: false, text: body.error ?? 'Something went wrong. Try again.' });
      } else {
        const v = { name: body.name as string, team: body.team as PredictionTeam, token: (body.token as string) ?? myVote?.token };
        saveMyVote(v);
        setMyVote(v);
        setSummary(body);
        const label = teams.find((t) => t.key === v.team)?.label ?? v.team;
        setMsg({ ok: true, text: myVote ? `Changed! You now think ${label} will win.` : `Locked in! You think ${label} will win.` });
      }
    } catch {
      setMsg({ ok: false, text: 'No connection. Try again.' });
    } finally {
      setBusy(false);
    }
  };

  // Hidden until voting opens, so it can't give away the team colours before they're announced.
  if (beforeOpen) return null;

  return (
    <section
      aria-labelledby="predict-heading"
      className="mt-10 rounded-2xl border border-sky-400/20 bg-[#08111f]/80 backdrop-blur-sm px-4 py-6 sm:px-8 sm:py-8"
    >
      <div className="text-center">
        <p className="text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase text-sky-300 pl-[0.3em]">Predictions</p>
        <h2 id="predict-heading" className="mt-1 text-2xl sm:text-3xl font-black text-white">
          Who will win Polar Money SMP?
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          {beforeOpen
            ? `Voting opens after the draft, ${fmt(PREDICTIONS_OPEN_AT)}.`
            : locked
              ? 'Voting is locked. The season has started - good luck to every team!'
              : `Pick the team you think will finish on top. You can change your pick until ${fmt(PREDICTIONS_CLOSE_AT)}.`}
        </p>
      </div>

      {!beforeOpen && (
        <div className="mt-4 flex justify-center">
          <div className="inline-flex rounded-xl bg-[#0a1a2e] border border-sky-400/15 p-1 text-xs font-bold">
            {(['all', 'viewers', 'players'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg capitalize ${view === v ? 'bg-sky-400 text-[#04101f]' : 'text-slate-300 hover:text-white'}`}
              >
                {v === 'all' ? 'Everyone' : v}
              </button>
            ))}
          </div>
        </div>
      )}

      <ul className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {teams.map((t) => {
          const c = counts[t.key];
          const pct = total ? Math.round((c / total) * 100) : 0;
          const selected = picked === t.key;
          const mine = myVote?.team === t.key;
          const canPick = !beforeOpen && !locked;
          return (
            <li key={t.key}>
              <button
                type="button"
                disabled={!canPick}
                onClick={() => setPicked(t.key)}
                aria-pressed={selected}
                className="group relative w-full rounded-2xl border-2 p-3 sm:p-4 text-left transition disabled:cursor-default"
                style={{
                  borderColor: selected ? t.color : `${t.color}40`,
                  background: `linear-gradient(180deg, ${t.color}${selected ? '33' : '1a'}, #0a1424)`,
                  boxShadow: selected ? `0 0 24px ${t.color}55` : undefined,
                }}
              >
                {mine && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black uppercase text-[#04101f]">
                    <Check className="w-3 h-3" strokeWidth={3} /> Your pick
                  </span>
                )}
                <p className="font-black text-white text-sm sm:text-base">{t.label}</p>
                <div className="mt-2 h-28 sm:h-36 flex items-end justify-center">
                  <img
                    src={skinUrl(t.captain)}
                    alt={`${t.captain}, captain of ${t.label}`}
                    loading="lazy"
                    className="h-full w-auto object-contain drop-shadow-[0_0_12px_rgba(0,0,0,0.6)] group-hover:scale-105 transition"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <p className="mt-2 text-center text-xs text-slate-300 truncate">Captain {t.captain}</p>
                {!beforeOpen && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span style={{ color: t.color }}>{pct}%</span>
                      <span className="text-slate-400">
                        {c} vote{c === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: t.color }} />
                    </div>
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {!beforeOpen && !locked && (
        <form
          className="mt-5 mx-auto max-w-xl flex flex-col sm:flex-row gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            vote();
          }}
        >
          <label htmlFor="predict-name" className="sr-only">
            Your Minecraft or Discord name
          </label>
          <input
            id="predict-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Minecraft or Discord name"
            maxLength={32}
            autoComplete="nickname"
            className="flex-1 rounded-xl bg-[#04101f] border border-sky-400/30 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-300"
          />
          <button
            type="submit"
            disabled={!picked || name.trim().length < 2 || busy}
            className="rounded-xl px-5 py-3 font-black bg-sky-400 text-[#04101f] hover:bg-sky-300 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            {busy ? 'Saving...' : myVote ? 'Change my pick' : 'Lock in my pick'}
          </button>
        </form>
      )}

      {msg && (
        <p role="status" className={`mt-3 text-center text-sm font-bold ${msg.ok ? 'text-emerald-300' : 'text-rose-300'}`}>
          {msg.text}
        </p>
      )}

      {!beforeOpen && (
        <p className="mt-4 text-center text-xs text-slate-500 inline-flex w-full items-center justify-center gap-1.5">
          {locked ? <Lock className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
          {total} {view === 'all' ? '' : view === 'players' ? 'player ' : 'viewer '}
          prediction{total === 1 ? '' : 's'} so far
          {!locked && ' · one vote per name'}
        </p>
      )}
    </section>
  );
};
