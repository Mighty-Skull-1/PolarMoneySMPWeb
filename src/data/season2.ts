// Season 2 (Polar Money SMP) announcements shown on the homepage.
//
// To reveal the next tier, add the players' names to that tier below and push.
// A player's picture is public/skins/<name>.png if it exists, otherwise their live Minecraft skin.

export type Season2Tier = 'S' | 'A' | 'B' | 'C' | 'D';

/** Tiers in the order they're shown (best first). */
export const SEASON2_TIER_ORDER: Season2Tier[] = ['S', 'A', 'B', 'C', 'D'];

/** Revealed players per tier. An empty list shows as "revealing soon". */
export const SEASON2_TIERS: Record<Season2Tier, string[]> = {
  S: [],
  A: ['Toniqp', 'MarkusAllard', 'sleepycatsz', 'Secretlife__'],
  B: ['JetCreature', 'HopperNot', 'bobu2032', 'ablec'],
  C: ['galexyworld', 'Myn0x_', 'NaudxNeo', 'itzghuly'],
  D: ['LwkLucky', 'osama_343', 'Slimeprince_', '0ensar'],
};

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
