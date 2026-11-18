// Season 2 (Polar Money SMP) announcements shown on the homepage.
//
// To reveal the next tier, add the players' names to that tier below and push.
// A player's picture is public/skins/<name>.png if it exists, otherwise their live Minecraft skin.

export type Season2Tier = 'S' | 'A' | 'B' | 'C' | 'D';

/** Tiers in the order they're shown (best first). */
export const SEASON2_TIER_ORDER: Season2Tier[] = ['S', 'A', 'B', 'C', 'D'];

/** Revealed players per tier. An empty list shows as "revealing soon". */
export const SEASON2_TIERS: Record<Season2Tier, string[]> = {
  S: ['Valdfilt', 'Willysmannen', 'NightDay_', 'ThuulBot'],
  A: ['Toniqp', 'MarkusAllard', 'sleepycatsz', 'Secretlife__'],
  B: ['JetCreature', 'HopperNot', 'bobu2032', 'ablec'],
  C: ['galexyworld', 'Myn0x_', 'NaudxNeo', 'itzghuly'],
  D: ['LwkLucky', 'osama_343', 'Slimeprince_', '0ensar'],
};

/**
 * Substitutes: players who can step in for anyone, whatever their tier.
 * Leave empty to show "Revealing soon" until the list is confirmed.
 */
export const SEASON2_SUBS: string[] = ['m_gamer11', 'Arshzas', 'AuroraTiles', 'ex1l_', 'Vryqs'];

/** A tier that's still being revealed one player at a time (shows a "more coming" slot). */
export const SEASON2_TIER_IN_PROGRESS: Season2Tier | null = null;

/**
 * When the captains' bidding starts, as an ISO time with its UK offset,
 * e.g. '2026-12-05T19:00:00Z' (GMT, winter) or '2027-04-10T19:00:00+01:00' (BST, summer).
 * Leave null to show "Date coming soon" on the countdown.
 */
// Friday 27 November, 8pm US Central (CST). Shown on the site as CT, EST and UK time (2am Saturday).
export const SEASON2_BIDDING_AT: string | null = '2026-11-28T02:00:00Z';

/**
 * When the Season 2 server opens. 26 December 2026 (GMT, so 'Z').
 * The start time isn't fixed yet, so this is midnight that day and the site says "start time TBA".
 * When the time is known, put it here (e.g. '2026-12-26T19:00:00Z') and set SEASON2_START_TIME_KNOWN to true.
 */
export const SEASON2_START_AT: string | null = '2026-12-26T00:00:00Z';
export const SEASON2_START_TIME_KNOWN = false;

/** What's changed since Season 1. */
export const SEASON2_CHANGES: { title: string; detail: string }[] = [
  { title: '4 teams', detail: 'Down from 5 in Season 1.' },
  { title: 'S, A, B, C & D tiers', detail: 'A new tier list, revealed one tier at a time.' },
  { title: 'Item bidding', detail: 'Captains bid with inventory items. No bid timer.' },
  { title: 'Capture points', detail: 'Replace airdrops. Hold them to earn for your team.' },
  { title: 'KOTH removed', detail: 'King of the Hill is gone for Season 2.' },
  { title: 'No trackers', detail: 'The tracker compass is gone.' },
];

/**
 * Live updates sent before this moment are Season 1 data, so the live board stays hidden
 * until the plugin sends something newer (after the Season 2 reset).
 */
export const SEASON2_DATA_FROM = Date.UTC(2026, 10, 2, 3, 0, 0);
