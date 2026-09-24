import type { PlayerSnapshot, RawAppearance } from "./types";

export function aggregateAppearances(playerId: string, appearances: RawAppearance[], period: { from: string; to: string }, includeFriendlies = false): PlayerSnapshot {
  const rows = appearances.filter((x) => x.playerId === playerId && (includeFriendlies || !x.friendly));
  const groups = new Map<string, RawAppearance[]>();
  for (const row of rows) groups.set(row.competitionId, [...(groups.get(row.competitionId) ?? []), row]);
  let needsReview = false;
  const competitions = [...groups.entries()].map(([competitionId, matches]) => {
    const unique = new Map<string, RawAppearance[]>();
    for (const row of matches) unique.set(row.matchId, [...(unique.get(row.matchId) ?? []), row]);
    let conflict = false;
    const canonical = [...unique.values()].map((sources) => {
      const values = new Set(sources.map((m) => `${m.goals ?? "unknown"}:${m.assists ?? "unknown"}`));
      if (values.size > 1) { conflict = true; needsReview = true; return null; }
      return sources[0];
    }).filter((m): m is RawAppearance => m !== null);
    const sourceValues = new Set(canonical.map((m) => m.sourceName));
    const verified = !conflict && canonical.length === unique.size && canonical.length > 0 && canonical.every((m) => m.verified) && sourceValues.size === 1;
    const goals = !conflict && canonical.every((m) => m.goals !== null) ? canonical.reduce((n, m) => n + (m.goals ?? 0), 0) : null;
    const assists = !conflict && canonical.every((m) => m.assists !== null) ? canonical.reduce((n, m) => n + (m.assists ?? 0), 0) : null;
    return { competitionId, competitionName: matches[0].competitionName, team: matches[0].team, matches: unique.size, goals, assists, goalContributions: goals === null || assists === null ? null : goals + assists, source: { name: canonical[0]?.sourceName ?? matches[0].sourceName, url: canonical[0]?.sourceUrl ?? matches[0].sourceUrl }, verified };
  });
  const totals = { matches: competitions.reduce((n, x) => n + x.matches, 0), goals: competitions.every((x) => x.goals !== null) ? competitions.reduce((n, x) => n + (x.goals ?? 0), 0) : null, assists: competitions.every((x) => x.assists !== null) ? competitions.reduce((n, x) => n + (x.assists ?? 0), 0) : null, goalContributions: null as number | null };
  totals.goalContributions = totals.assists === null || totals.goals === null ? null : totals.goals + totals.assists;
  return { playerId, period, competitions, totals, verified: competitions.length > 0 && competitions.every((x) => x.verified) && !needsReview, partiallyVerified: competitions.some((x) => x.verified) && !competitions.every((x) => x.verified), needsReview, lastUpdated: null };
}
