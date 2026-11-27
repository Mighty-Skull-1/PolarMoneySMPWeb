// "Who will win?" predictions. Keep the two times in step with api/predict.ts.

/** Voting opened after the bidding (Fri 27 Nov, 6:40pm UK). */
export const PREDICTIONS_OPEN_AT = '2026-11-27T18:40:00Z';
/** Voting locks when the server starts. */
export const PREDICTIONS_CLOSE_AT = '2026-12-26T00:00:00Z';

export type PredictionTeam = 'red' | 'blue' | 'green' | 'pink';

/** Shown until the live feed has the real teams. */
export const PREDICTION_TEAMS: { key: PredictionTeam; label: string; color: string; captain: string }[] = [
  { key: 'red', label: 'Team Red', color: '#ef4444', captain: 'ThuulBot' },
  { key: 'blue', label: 'Team Blue', color: '#3b82f6', captain: 'Willysmannen' },
  { key: 'green', label: 'Team Green', color: '#22c55e', captain: 'Valdfilt' },
  { key: 'pink', label: 'Team Pink', color: '#ec4899', captain: 'NightDay_' },
];
