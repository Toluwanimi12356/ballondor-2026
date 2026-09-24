import type { RawAppearance } from "./types";

export function detectSourceConflicts(records: RawAppearance[]) {
  const keys = new Map<string, RawAppearance[]>();
  for (const record of records) {
    const key = `${record.playerId}:${record.matchId}:${record.competitionId}`;
    keys.set(key, [...(keys.get(key) ?? []), record]);
  }
  return [...keys.entries()].flatMap(([key, rows]) => {
    const values = new Set(rows.map((row) => `${row.goals}:${row.assists ?? "unknown"}`));
    return values.size > 1 ? [{ key, status: "needsReview" as const, sources: rows.map(({ sourceName, sourceUrl }) => ({ sourceName, sourceUrl })) }] : [];
  });
}
