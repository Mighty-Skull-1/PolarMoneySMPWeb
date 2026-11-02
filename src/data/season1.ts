// Final Season 1 standings (Willy Money SMP), frozen from the last update the plugin sent
// on 30 Oct 2026. This never changes, so it lives in the code rather than coming from the server.

export interface Season1Player {
  name: string;
  tier: 'CAPTAIN' | 'A' | 'B' | 'C';
  credits: number;
  kills: number;
  deaths: number;
}

export interface Season1Team {
  name: string;
  hex: string;
  credits: number;
  members: Season1Player[];
}

export const SEASON1_FINAL_AT = '2026-10-30T21:30:41Z';

export const SEASON1_TEAMS: Season1Team[] = [
  {
    name: 'Team Purple',
    hex: '#a855f7',
    credits: 1157,
    members: [
      { name: 'NightDay_', tier: 'CAPTAIN', credits: 547, kills: 8, deaths: 1 },
      { name: 'ThuulBot', tier: 'A', credits: 250, kills: 5, deaths: 0 },
      { name: 'ablec', tier: 'B', credits: 125, kills: 0, deaths: 2 },
      { name: 'osama_343', tier: 'C', credits: 235, kills: 5, deaths: 2 },
    ],
  },
  {
    name: 'Team Yellow',
    hex: '#eab308',
    credits: 842,
    members: [
      { name: 'm_gamer11', tier: 'CAPTAIN', credits: 437, kills: 9, deaths: 2 },
      { name: 'JetCreature', tier: 'A', credits: 115, kills: 0, deaths: 1 },
      { name: 'AuroraTiles', tier: 'B', credits: 125, kills: 1, deaths: 1 },
      { name: 'galexyworld', tier: 'C', credits: 165, kills: 4, deaths: 0 },
    ],
  },
  {
    name: 'Team Green',
    hex: '#22c55e',
    credits: 705,
    members: [
      { name: 'Valdfilt', tier: 'CAPTAIN', credits: 405, kills: 0, deaths: 2 },
      { name: 'Arshzas', tier: 'A', credits: 50, kills: 1, deaths: 3 },
      { name: 'HopperNot', tier: 'B', credits: 105, kills: 0, deaths: 3 },
      { name: '0ensar', tier: 'C', credits: 145, kills: 1, deaths: 2 },
    ],
  },
  {
    name: 'Team Blue',
    hex: '#3b82f6',
    credits: 678,
    members: [
      { name: 'Willysmannen', tier: 'CAPTAIN', credits: 253, kills: 1, deaths: 2 },
      { name: 'Bird_3', tier: 'A', credits: 165, kills: 4, deaths: 1 },
      { name: 'bobu2032', tier: 'B', credits: 135, kills: 1, deaths: 2 },
      { name: 'Myn0x_', tier: 'C', credits: 125, kills: 0, deaths: 0 },
    ],
  },
  {
    name: 'Team Red',
    hex: '#ef4444',
    credits: 315,
    members: [
      { name: 'MarkusAllard', tier: 'CAPTAIN', credits: 85, kills: 0, deaths: 6 },
      { name: 'Secretlife__', tier: 'A', credits: 40, kills: 0, deaths: 4 },
      { name: 'NaudxNeo', tier: 'B', credits: 90, kills: 0, deaths: 4 },
      { name: 'LwkLucky', tier: 'C', credits: 100, kills: 0, deaths: 1 },
    ],
  },
];
