import type { RawAppearance } from "./types";

/** Provider adapters map their response into this stable internal shape. Keep each source attached. */
export type ProviderAppearance = {
  playerId: string; matchId: string; competitionId: string; competitionName: string; team: string;
  goals: number; assists: number | null; sourceName: string; sourceUrl: string; verified: boolean; friendly?: boolean;
};

export function normalizeAppearances(input: ProviderAppearance[]): RawAppearance[] {
  return input.map((row) => ({
    ...row,
    goals: row.goals !== null && Number.isFinite(row.goals) && row.goals >= 0 ? row.goals : null,
    assists: row.assists === null ? null : Number.isFinite(row.assists) && row.assists >= 0 ? row.assists : null,
    verified: Boolean(row.verified && row.sourceName && row.sourceUrl),
  }));
}
