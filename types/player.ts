export type CompetitionStats = {
  competitionId: string;
  competitionName: string;
  competitionLogo?: string;
  team: string;
  matches: number | null;
  goals: number | null;
  assists: number | null;
  sourceName: string;
  sourceUrl: string;
  verified: boolean;
};

export type Player = {
  id: string;
  slug: string;
  name: string;
  firstName: string;
  lastName: string;
  club: string;
  country: string;
  position: string;
  image: string;
  clubLogo: string;
  flag: string;
  headlineStats: {
    matches: number | null;
    goals: number | null;
    assists: number | null;
    sourceName: string;
    sourceUrl: string;
    sourcePublishedAt: string | null;
    cutoffDate: string | null;
    verified: boolean;
  } | null;
  competitions: CompetitionStats[];
  trophies: { name: string; competition: string; dateWon: string | null; season: string | null; sourceName: string; sourceUrl: string; verified: boolean }[];
  individualAwards: {
    name: string;
    competition?: string;
    date: string | null;
    season: string | null;
    sourceName: string;
    sourceUrl: string;
    verified: boolean;
    importance?: "major" | "secondary";
  }[];
  sources: { name: string; url: string }[];
  caseFacts: { text: string; verified: boolean; sourceName?: string; sourceUrl?: string }[];
};
