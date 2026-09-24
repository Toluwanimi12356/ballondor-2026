import type { Player } from "@/types/player";

const NOMINEE_SOURCE = "Official Ballon d'Or 2026 men's nominees";
const NOMINEE_SOURCE_URL = "https://ballondor.com/news/posts/mens-ballon-dor-discover-the-ballon-dor-2026-nominees";

const headlineStats = (matches: number, goals: number, assists: number): NonNullable<Player["headlineStats"]> => ({
  matches,
  goals,
  assists,
  sourceName: NOMINEE_SOURCE,
  sourceUrl: NOMINEE_SOURCE_URL,
  sourcePublishedAt: "2026-09-08",
  cutoffDate: null,
  verified: true,
});

const trophies = (names: string[]): Player["trophies"] => names.map((name) => ({
  name,
  competition: name,
  dateWon: null,
  season: null,
  sourceName: NOMINEE_SOURCE,
  sourceUrl: NOMINEE_SOURCE_URL,
  verified: true,
}));

const emptyDetails = () => ({
  competitions: [] as Player["competitions"],
  individualAwards: [] as Player["individualAwards"],
  sources: [{ name: NOMINEE_SOURCE, url: NOMINEE_SOURCE_URL }],
  caseFacts: [] as Player["caseFacts"],
});

export const players: Player[] = [
  { id: "harry-kane", slug: "harry-kane", name: "Harry Kane", firstName: "Harry", lastName: "Kane", club: "Bayern Munich", country: "England", position: "Forward", image: "/images/players/harry-kane.png", clubLogo: "/images/clubs/bayern-munich.png", flag: "/images/flags/england.png", headlineStats: headlineStats(65, 73, 8), trophies: trophies(["Bundesliga", "German Cup", "German Super Cup"]), ...emptyDetails() },
  { id: "rodri", slug: "rodri", name: "Rodri", firstName: "Rodri", lastName: "Hernández", club: "Manchester City", country: "Spain", position: "Midfielder", image: "/images/players/rodri.png", clubLogo: "/images/clubs/manchester-city.png", flag: "/images/flags/spain.png", headlineStats: headlineStats(46, 2, 0), trophies: trophies(["World Cup", "FA Cup", "EFL Cup"]), ...emptyDetails() },
  { id: "kylian-mbappe", slug: "kylian-mbappe", name: "Kylian Mbappé", firstName: "Kylian", lastName: "Mbappé", club: "Real Madrid", country: "France", position: "Forward", image: "/images/players/kylian-mbappe.png", clubLogo: "/images/clubs/real-madrid.png", flag: "/images/flags/france.png", headlineStats: headlineStats(60, 58, 13), trophies: trophies([]), ...emptyDetails() },
  { id: "lamine-yamal", slug: "lamine-yamal", name: "Lamine Yamal", firstName: "Lamine", lastName: "Yamal", club: "FC Barcelona", country: "Spain", position: "Winger", image: "/images/players/lamine-yamal.png", clubLogo: "/images/clubs/fc-barcelona.png", flag: "/images/flags/spain.png", headlineStats: headlineStats(57, 25, 20), trophies: trophies(["World Cup", "Liga", "Spanish Super Cup"]), ...emptyDetails() },
  { id: "lionel-messi", slug: "lionel-messi", name: "Lionel Messi", firstName: "Lionel", lastName: "Messi", club: "Inter Miami", country: "Argentina", position: "Forward", image: "/images/players/lionel-messi.png", clubLogo: "/images/clubs/inter-miami.png", flag: "/images/flags/argentina.png", headlineStats: headlineStats(49, 45, 30), trophies: trophies(["MLS"]), ...emptyDetails() },
  { id: "ousmane-dembele", slug: "ousmane-dembele", name: "Ousmane Dembélé", firstName: "Ousmane", lastName: "Dembélé", club: "Paris Saint-Germain", country: "France", position: "Forward", image: "/images/players/ousmane-dembele.png", clubLogo: "/images/clubs/paris-saint-germain.png", flag: "/images/flags/france.png", headlineStats: headlineStats(51, 26, 14), trophies: trophies(["Champions League", "Intercontinental Cup", "European Super Cup", "Ligue 1", "French Super Cup"]), ...emptyDetails() },
  { id: "khvicha-kvaratskhelia", slug: "khvicha-kvaratskhelia", name: "Khvicha Kvaratskhelia", firstName: "Khvicha", lastName: "Kvaratskhelia", club: "Paris Saint-Germain", country: "Georgia", position: "Winger", image: "/images/players/khvicha-kvaratskhelia.png", clubLogo: "/images/clubs/paris-saint-germain.png", flag: "/images/flags/georgia.png", headlineStats: headlineStats(57, 24, 10), trophies: trophies(["Champions League", "Intercontinental Cup", "European Super Cup", "Ligue 1", "French Super Cup"]), ...emptyDetails() },
  { id: "michael-olise", slug: "michael-olise", name: "Michael Olise", firstName: "Michael", lastName: "Olise", club: "Bayern Munich", country: "France", position: "Winger", image: "/images/players/michael-olise.png", clubLogo: "/images/clubs/bayern-munich.png", flag: "/images/flags/france.png", headlineStats: headlineStats(69, 27, 35), trophies: trophies(["Bundesliga", "German Cup", "German Super Cup"]), ...emptyDetails() },
];

export const getPlayer = (slug: string) => players.find((player) => player.slug === slug);

export const stats = (player: Player) => {
  const official = player.headlineStats;
  if (official?.verified && official.matches !== null && official.goals !== null && official.assists !== null) {
    return { matches: official.matches, goals: official.goals, assists: official.assists, contributions: official.goals + official.assists };
  }
  const rows = player.competitions;
  const sum = (key: "matches" | "goals" | "assists") => rows.length > 0 && rows.every((row) => row.verified && row[key] !== null)
    ? rows.reduce((total, row) => total + (row[key] ?? 0), 0)
    : null;
  const goals = sum("goals");
  const assists = sum("assists");
  return { matches: sum("matches"), goals, assists, contributions: goals !== null && assists !== null ? goals + assists : null };
};
