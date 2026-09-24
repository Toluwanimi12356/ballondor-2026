import type { Player } from "@/types/player";

const NOMINEE_SOURCE = "Official Ballon d'Or nominee presentation";
const NOMINEE_SOURCE_URL = "https://ballondor.com/news/posts/mens-ballon-dor-discover-the-ballon-dor-2026-nominees";

const headlineStats = (matches: number, goals: number, assists: number): NonNullable<Player["headlineStats"]> => ({
  matches, goals, assists, sourceName: NOMINEE_SOURCE, sourceUrl: NOMINEE_SOURCE_URL,
  sourcePublishedAt: "2026-09-08", cutoffDate: null, verified: true,
});

const trophy = (name: string, competition: string, season: string, sourceName: string, sourceUrl: string): Player["trophies"][number] => ({
  name, competition, season, dateWon: null, sourceName, sourceUrl, verified: true,
});
const award = (name: string, competition: string, season: string, sourceName: string, sourceUrl: string, importance: "major" | "secondary" = "major"): Player["individualAwards"][number] => ({
  name, competition, season, date: season, sourceName, sourceUrl, verified: true, importance,
});
const source = (name: string, url: string) => ({ name, url });
const details = (trophies: Player["trophies"], individualAwards: Player["individualAwards"], caseFacts: Player["caseFacts"]) => ({
  competitions: [] as Player["competitions"], trophies, individualAwards, caseFacts,
  sources: [source(NOMINEE_SOURCE, NOMINEE_SOURCE_URL), ...[...trophies, ...individualAwards].map((item) => source(item.sourceName, item.sourceUrl))]
    .filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index),
});

const url = {
  kaneStats: NOMINEE_SOURCE_URL,
  kaneNumbers: "https://www.bundesliga.com/en/bundesliga/news/harry-kane-2025-26-numbers-england-bauern-munich-goals-records-messi-38301",
  kaneShoe: "https://www.bundesliga.com/en/bundesliga/news/harry-kane-wins-golden-shoe-2025-26-bayern-munich-england-37552",
  kaneScorer: "https://www.bundesliga.com/en/bundesliga/news/harry-kane-top-scorer-2025-26-third-time-bayern-munich-37407",
  kaneYear: "https://www.bundesliga.com/en/bundesliga/news/harry-kane-bayern-munich-germany-footballer-of-the-year-2026-38757/",
  city: "https://www.mancity.com/news/mens/manchester-city-players-review-202526-midfielders-63916784",
  fifaAwards: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/award-winners",
  fifaSpain: "https://inside.fifa.com/organisation/news/new-york-jersey-stadium-spain-world-champions-mbappe-haaland",
  pichichi: "https://www.realmadrid.com/en-US/news/football/first-team/latest-news/mbappe-gana-el-trofeo-pichichi-2025-26-23-05-2026",
  mahou: "https://www.realmadrid.com/en-US/news/football/first-team/latest-news/mbappe-jugador-mahou-cinco-estrellas-de-la-temporada-27-05-2026",
  barcaLeague: "https://www.fcbarcelona.com/en/laliga-champions-2025-2026",
  supercopa: "https://rfef.es/es/noticias/el-rey-no-cede-su-trono-3-2",
  fifaWomenMen: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/spain-men-women-first-simultaneous-champions",
  zarra: "https://www.fcbarcelona.com/en/football/first-team/news/4509422/lamine-yamal-and-ferran-torres-win-zarra-trophy",
  afe: "https://www.fcbarcelona.com/en/news/4570293/lamine-yamal-and-patri-guijarro-win-202526-season-afe-awards/amp",
  laureus: "https://www.fcbarcelona.com/en/football/first-team/news/4490538/lamine-yamal-laureus-young-sportsperson-of-the-year",
  mlsCup: "https://www.mlssoccer.com/news/inter-miami-cf-win-2025-mls-cup-presented-by-audi",
  mlsGolden: "https://www.mlssoccer.com/news/inter-miami-cf-forward-lionel-messi-wins-2025-mls-golden-boot-presented-by-audi",
  mlsMvp: "https://www.mlssoccer.com/news/inter-miami-cf-forward-lionel-messi-named-2025-landon-donovan-mls-most-valuable-player-for-second-consecutive-season",
  mlsCupMvp: "https://www.mlssoccer.com/playoffs/2025/news/inter-miami-s-lionel-messi-named-mls-cup-2025-mvp-pres-by-audi",
  psgUcl: "https://www.psg.fr/en/content/paris-saint-germain-wins-the-champions-league-for-the-second-consecutive-season-uefa-champions-league-arsenal-2025-2025",
  psgSuccessive: "https://www.psg.fr/en/content/pr-paris-saint-germain-win-the-champions-league-for-the-second-successive-season",
  psgLeague: "https://www.psg.fr/en/content/pr-paris-saint-germain-crowned-as-french-champions-for-fifth-time-in-a-row",
  uefaSuper: "https://www.uefa.com/uefasupercup/history/2025/",
  fifaIntercontinental: "https://www.fifa.com/en/tournaments/mens/intercontinentalcup/2025/articles/vitinha-named-aramco-player-of-the-tournament",
  trophée: "https://www.psg.fr/en/content/paris-saint-germain-wins-the-2025-trophee-des-champions-in-kuwait-city",
  psgAwards: "https://www.psg.fr/en/content/paris-saint-germain-shine-at-unfp-awards-2026-psg-news",
  uefaPlayer: "https://www.uefa.com/uefachampionsleague/news/02a5-20c1d7bf915e-f9e703cf0108-1000/",
  dfbLeague: "https://www.dfb.de/news/neuendorf-gratuliert-dem-fc-bayern-zur-meisterschaft-beeindruckende-konstanz-und-dominanz",
  supercup: "https://www.bundesliga.com/en/bundesliga/news/stuttgart-bayern-munich-supercup-live-blog-luis-diaz-kane-33508/",
  oliseAward: "https://www.bundesliga.com/en/bundesliga/news/player-of-the-month-2025-26-vote-winners-ea-sports-olise-34233",
};

const bundesliga = "Bundesliga";
const city = "Manchester City";
const fifa = "FIFA";
const madrid = "Real Madrid";
const barca = "FC Barcelona";
const mls = "MLS";
const psg = "Paris Saint-Germain";
const uefa = "UEFA";

export const players: Player[] = [
  {
    id: "harry-kane", slug: "harry-kane", name: "Harry Kane", firstName: "Harry", lastName: "Kane", club: "Bayern Munich", country: "England", position: "Forward", image: "/images/players/harry-kane.png", clubLogo: "/images/clubs/bayern-munich.png", flag: "/images/flags/england.png",
    headlineStats: headlineStats(65, 73, 8),
    ...details([
      trophy("Bundesliga", "Bundesliga", "2025/26", bundesliga, url.kaneNumbers),
      trophy("DFB-Pokal", "DFB-Pokal", "2025/26", bundesliga, url.kaneNumbers),
      trophy("Franz Beckenbauer Supercup", "Franz Beckenbauer Supercup", "2025", bundesliga, url.kaneNumbers),
    ], [
      award("European Golden Shoe", "European Golden Shoe", "2025/26", bundesliga, url.kaneShoe),
      award("Bundesliga Torjägerkanone · Top Scorer", "Bundesliga", "2025/26", bundesliga, url.kaneScorer),
      award("Germany's Footballer of the Year", "German Footballer of the Year", "2026", bundesliga, url.kaneYear),
    ], [
      { text: "Won three trophies with Bayern while collecting the European Golden Shoe and Bundesliga top-scorer award.", verified: true, sourceName: bundesliga, sourceUrl: url.kaneNumbers },
      { text: "His listed individual honours also include Germany's Footballer of the Year for 2026.", verified: true, sourceName: bundesliga, sourceUrl: url.kaneYear },
    ]),
  },
  {
    id: "rodri", slug: "rodri", name: "Rodri", firstName: "Rodri", lastName: "Hernández", club: "Manchester City", country: "Spain", position: "Midfielder", image: "/images/players/rodri.png", clubLogo: "/images/clubs/manchester-city.png", flag: "/images/flags/spain.png",
    headlineStats: headlineStats(46, 2, 0),
    ...details([
      trophy("FIFA World Cup", "FIFA World Cup · Spain", "2026", fifa, url.fifaSpain),
      trophy("FA Cup", "FA Cup", "2025/26", city, url.city),
      trophy("Carabao Cup / EFL Cup", "EFL Cup", "2025/26", city, url.city),
    ], [award("FIFA World Cup Golden Ball", "FIFA World Cup", "2026", fifa, url.fifaAwards)], [
      { text: "Won the FA Cup and EFL Cup with Manchester City in 2025/26.", verified: true, sourceName: city, sourceUrl: url.city },
      { text: "Spain won the 2026 World Cup, where Rodri received the tournament's Golden Ball.", verified: true, sourceName: fifa, sourceUrl: url.fifaAwards },
    ]),
  },
  {
    id: "kylian-mbappe", slug: "kylian-mbappe", name: "Kylian Mbappé", firstName: "Kylian", lastName: "Mbappé", club: "Real Madrid", country: "France", position: "Forward", image: "/images/players/kylian-mbappe.png", clubLogo: "/images/clubs/real-madrid.png", flag: "/images/flags/france.png",
    headlineStats: headlineStats(60, 58, 13),
    ...details([], [
      award("LaLiga Pichichi Trophy", "LaLiga", "2025/26", madrid, url.pichichi),
      award("UEFA Champions League Top Scorer", "UEFA Champions League", "2025/26", madrid, url.mahou),
      award("Real Madrid Mahou Five Star Player of the Season", "Club / sponsor award", "2025/26", madrid, url.mahou, "secondary"),
      award("FIFA World Cup Golden Boot", "FIFA World Cup", "2026", fifa, url.fifaAwards),
      award("FIFA World Cup Bronze Ball", "FIFA World Cup", "2026", fifa, url.fifaAwards),
    ], [
      { text: "The supplied dataset lists no major team trophy for this period; the empty trophy state is intentional.", verified: true, sourceName: madrid, sourceUrl: url.pichichi },
      { text: "Collected five individual honours, including the FIFA World Cup Golden Boot and Bronze Ball.", verified: true, sourceName: fifa, sourceUrl: url.fifaAwards },
    ]),
  },
  {
    id: "lamine-yamal", slug: "lamine-yamal", name: "Lamine Yamal", firstName: "Lamine", lastName: "Yamal", club: "FC Barcelona", country: "Spain", position: "Winger", image: "/images/players/lamine-yamal.png", clubLogo: "/images/clubs/fc-barcelona.png", flag: "/images/flags/spain.png",
    headlineStats: headlineStats(57, 25, 20),
    ...details([
      trophy("FIFA World Cup", "FIFA World Cup · Spain", "2026", fifa, url.fifaWomenMen),
      trophy("LaLiga", "LaLiga", "2025/26", barca, url.barcaLeague),
      trophy("Spanish Super Cup", "Spanish Super Cup", "2026", "RFEF", url.supercopa),
    ], [
      award("Zarra Trophy", "LaLiga", "2025/26", barca, url.zarra),
      award("AFE Primera División Player of the Season", "Primera División", "2025/26", barca, url.afe),
      award("Laureus World Young Sportsperson of the Year", "Laureus World Sports Awards", "2026", barca, url.laureus),
    ], [
      { text: "The supplied honours include LaLiga and the 2026 Spanish Super Cup; no Copa del Rey is listed.", verified: true, sourceName: barca, sourceUrl: url.barcaLeague },
      { text: "His individual honours span the Zarra Trophy, AFE Primera División Player of the Season and Laureus Young Sportsperson award.", verified: true, sourceName: barca, sourceUrl: url.laureus },
    ]),
  },
  {
    id: "lionel-messi", slug: "lionel-messi", name: "Lionel Messi", firstName: "Lionel", lastName: "Messi", club: "Inter Miami", country: "Argentina", position: "Forward", image: "/images/players/lionel-messi.png", clubLogo: "/images/clubs/inter-miami.png", flag: "/images/flags/argentina.png",
    headlineStats: headlineStats(49, 45, 30),
    ...details([trophy("MLS Cup", "MLS Cup", "2025", mls, url.mlsCup)], [
      award("MLS Golden Boot", "MLS", "2025", mls, url.mlsGolden),
      award("Landon Donovan MLS MVP", "MLS", "2025", mls, url.mlsMvp),
      award("MLS Cup MVP", "MLS Cup", "2025", mls, url.mlsCupMvp),
      award("FIFA World Cup Silver Ball", "FIFA World Cup", "2026", fifa, url.fifaAwards),
      award("FIFA World Cup Silver Boot", "FIFA World Cup", "2026", fifa, url.fifaAwards),
    ], [
      { text: "Led Inter Miami to the 2025 MLS Cup; the team title is recorded as MLS Cup, not a generic MLS honour.", verified: true, sourceName: mls, sourceUrl: url.mlsCup },
      { text: "Added five individual honours across MLS and the 2026 FIFA World Cup.", verified: true, sourceName: fifa, sourceUrl: url.fifaAwards },
    ]),
  },
  {
    id: "ousmane-dembele", slug: "ousmane-dembele", name: "Ousmane Dembélé", firstName: "Ousmane", lastName: "Dembélé", club: "Paris Saint-Germain", country: "France", position: "Forward", image: "/images/players/ousmane-dembele.png", clubLogo: "/images/clubs/paris-saint-germain.png", flag: "/images/flags/france.png",
    headlineStats: headlineStats(51, 26, 14),
    ...details([
      trophy("UEFA Champions League", "UEFA Champions League", "2025/26", psg, url.psgUcl),
      trophy("Ligue 1", "Ligue 1", "2025/26", psg, url.psgLeague),
      trophy("UEFA Super Cup", "UEFA Super Cup", "2025", uefa, url.uefaSuper),
      trophy("FIFA Intercontinental Cup", "FIFA Intercontinental Cup", "2025", fifa, url.fifaIntercontinental),
      trophy("Trophée des Champions", "Trophée des Champions · 2025 edition, played Jan 2026", "2025 edition · played Jan 2026", psg, url.trophée),
    ], [
      award("Ligue 1 Player of the Season", "Ligue 1", "2025/26", psg, url.psgAwards),
      award("Ligue 1 Goal of the Season", "Ligue 1", "2025/26", psg, url.psgAwards),
    ], [
      { text: "Paris Saint-Germain's supplied record lists five team trophies, including the 2025 Trophée des Champions edition played in January 2026.", verified: true, sourceName: psg, sourceUrl: url.trophée },
      { text: "The listed individual honours are Ligue 1 Player of the Season and Ligue 1 Goal of the Season.", verified: true, sourceName: psg, sourceUrl: url.psgAwards },
    ]),
  },
  {
    id: "khvicha-kvaratskhelia", slug: "khvicha-kvaratskhelia", name: "Khvicha Kvaratskhelia", firstName: "Khvicha", lastName: "Kvaratskhelia", club: "Paris Saint-Germain", country: "Georgia", position: "Winger", image: "/images/players/khvicha-kvaratskhelia.png", clubLogo: "/images/clubs/paris-saint-germain.png", flag: "/images/flags/georgia.png",
    headlineStats: headlineStats(57, 24, 10),
    ...details([
      trophy("UEFA Champions League", "UEFA Champions League", "2025/26", psg, url.psgUcl),
      trophy("Ligue 1", "Ligue 1", "2025/26", psg, url.psgLeague),
      trophy("UEFA Super Cup", "UEFA Super Cup", "2025", uefa, url.uefaSuper),
      trophy("FIFA Intercontinental Cup", "FIFA Intercontinental Cup", "2025", fifa, url.fifaIntercontinental),
      trophy("Trophée des Champions", "Trophée des Champions", "2025 edition · relevant cycle", psg, url.psgUcl),
    ], [award("UEFA Champions League Player of the Season", "UEFA Champions League", "2025/26", uefa, url.uefaPlayer)], [
      { text: "The supplied record lists five team trophies with Paris Saint-Germain across the 2025/26 cycle.", verified: true, sourceName: psg, sourceUrl: url.psgUcl },
      { text: "UEFA named him Champions League Player of the Season for 2025/26.", verified: true, sourceName: uefa, sourceUrl: url.uefaPlayer },
    ]),
  },
  {
    id: "michael-olise", slug: "michael-olise", name: "Michael Olise", firstName: "Michael", lastName: "Olise", club: "Bayern Munich", country: "France", position: "Winger", image: "/images/players/michael-olise.png", clubLogo: "/images/clubs/bayern-munich.png", flag: "/images/flags/france.png",
    headlineStats: headlineStats(69, 27, 35),
    ...details([
      trophy("Bundesliga", "Bundesliga", "2025/26", "DFB", url.dfbLeague),
      trophy("DFB-Pokal", "DFB-Pokal", "2025/26", "DFB", url.dfbLeague),
      trophy("Franz Beckenbauer Supercup", "Franz Beckenbauer Supercup", "2025", bundesliga, url.supercup),
    ], [award("Bundesliga Player of the Season", "Bundesliga", "2025/26", bundesliga, url.oliseAward)], [
      { text: "Won three team trophies with Bayern Munich: the Bundesliga, DFB-Pokal and Franz Beckenbauer Supercup.", verified: true, sourceName: "DFB", sourceUrl: url.dfbLeague },
      { text: "The supplied dataset lists Bundesliga Player of the Season as his individual honour; his assist total is kept as a statistic, not an award.", verified: true, sourceName: bundesliga, sourceUrl: url.oliseAward },
    ]),
  },
];

if (process.env.NODE_ENV !== "production") {
  const expected = [["harry-kane", 3, 3], ["rodri", 3, 1], ["kylian-mbappe", 0, 5], ["lamine-yamal", 3, 3], ["lionel-messi", 1, 5], ["ousmane-dembele", 5, 2], ["khvicha-kvaratskhelia", 5, 1], ["michael-olise", 3, 1]] as const;
  if (players.length !== expected.length) throw new Error(`Expected ${expected.length} candidates, received ${players.length}.`);
  for (const [id, trophyCount, awardCount] of expected) {
    const player = players.find((candidate) => candidate.id === id);
    if (!player || player.trophies.length !== trophyCount || player.individualAwards.length !== awardCount) {
      throw new Error(`Achievement count mismatch for ${id}: expected ${trophyCount} team trophies and ${awardCount} individual honours.`);
    }
    const official = player.headlineStats;
    if (!official || official.matches === null || official.goals === null || official.assists === null) throw new Error(`Official nominee totals are incomplete for ${id}.`);
  }
}

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
