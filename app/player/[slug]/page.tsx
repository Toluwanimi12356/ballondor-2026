import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPlayer, players, stats } from "@/data/players";
import { STAT_PERIOD_START, STAT_PERIOD_END } from "@/lib/football/config";
import { PlayerVideo } from "@/components/PlayerVideo";
import { BrandLockup } from "@/components/BrandMark";

export const revalidate = 3600;
export function generateStaticParams() { return players.map((player) => ({ slug: player.slug })); }

export default async function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = getPlayer(slug);
  if (!player) notFound();
  const values = stats(player);
  const verifiedFacts = player.caseFacts.filter((fact) => fact.verified);
  const trophies = player.trophies.filter((item) => item.verified);
  const awards = player.individualAwards.filter((item) => item.verified);
  const candidateNo = String(players.indexOf(player) + 1).padStart(2, "0");
  const date = (value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase();

  return <main className="profile-page">
    <nav className="nav profile-nav"><BrandLockup/><Link className="nav-cta" href="/#vote">CAST YOUR VOTE →</Link></nav>
    <header className="profile-hero">
      <Link className="back-link" href="/#candidates"><ArrowLeft size={15}/> ALL CANDIDATES</Link>
      <div className="profile-mark" aria-hidden="true">{player.firstName[0]}{player.lastName[0]}</div>
      <div className="profile-copy"><p className="eyebrow">CANDIDATE {candidateNo} / 08 · {player.position.toUpperCase()}</p><h1>{player.firstName}<br/><em>{player.lastName}</em></h1><p>{player.club} <i>·</i> {player.country}</p></div>
    </header>
    <section className="profile-stats" aria-label="Verified headline statistics">
      {[[values.matches, "MATCHES"], [values.goals, "GOALS"], [values.assists, "ASSISTS"], [values.contributions, "GOAL CONTRIBUTIONS"]].map(([value, label]) => <div key={String(label)}><strong>{value ?? "—"}</strong><span>{label}</span></div>)}
    </section>
    <PlayerVideo playerName={player.name} src={`/videos/players/${player.id}.mp4`} poster={`/images/video-posters/${player.id}.jpg`} />
    <p className="profile-pending">OFFICIAL NOMINEE TOTALS · SOURCE PUBLISHED 08 SEP 2026 · STATISTICAL CUTOFF NOT SPECIFIED · <a href={player.headlineStats?.sourceUrl} target="_blank" rel="noopener noreferrer">VIEW SOURCE ↗</a></p>
    <p className="profile-pending">PROJECT EVALUATION WINDOW: {date(STAT_PERIOD_START)} — {date(STAT_PERIOD_END())}. SOURCE TOTALS ARE SHOWN AS PUBLISHED AND ARE NOT RECOMPUTED FOR THIS WINDOW.</p>

    <section className="profile-section">
      <p className="eyebrow">THE SEASON BY COMPETITION</p><h2>THE SEASON<br/><em>IN CONTEXT.</em></h2>
      {player.competitions.length ? <div className="stats-rows">{player.competitions.map((competition) => <div key={competition.competitionId}><b>{competition.competitionName}</b><span>{competition.matches ?? "—"} matches</span><span>{competition.goals ?? "—"} goals</span><span>{competition.assists ?? "—"} assists</span><small>{competition.verified ? <a href={competition.sourceUrl} target="_blank" rel="noopener noreferrer">{competition.sourceName} ↗</a> : "PENDING VERIFICATION"}</small></div>)}</div> : <p className="empty-state">Competition records will appear when verified statistics are available.</p>}
    </section>

    <section className="profile-section profile-split">
      <div><p className="eyebrow">THE CASE FOR {player.lastName.toUpperCase()}</p><h2>THE CASE<br/><em>FOR {player.lastName.toUpperCase()}.</em></h2>{verifiedFacts.map((fact, index) => <article className="case-fact" key={`${fact.text}-${index}`}><p>{fact.text}</p>{fact.sourceName && fact.sourceUrl && <a href={fact.sourceUrl} target="_blank" rel="noopener noreferrer">{fact.sourceName} <ArrowUpRight size={13}/></a>}</article>)}</div>
      <div><p className="eyebrow">THE SILVERWARE</p><h2>TEAM<br/><em>HONOURS.</em></h2>{trophies.length ? trophies.map((item, index) => <article className="honour-line" key={`${item.name}-${index}`}><b>{item.name}</b><span>{item.competition} · {item.season ?? item.dateWon ?? ""}</span><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.sourceName} ↗</a></article>) : <p className="empty-state">NO MAJOR TEAM TROPHY RECORDED FOR THIS PERIOD</p>}
        <p className="eyebrow individual-label">INDIVIDUAL HONOURS</p>{awards.map((item, index) => <article className={`honour-line${item.importance === "secondary" ? " is-secondary" : ""}`} key={`${item.name}-${index}`}><b>{item.name}</b><span>{item.competition ? `${item.competition} · ` : ""}{item.season ?? item.date ?? ""}</span><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.sourceName} ↗</a></article>)}
      </div>
    </section>

    <section className="profile-section"><p className="eyebrow">SOURCES</p><ul className="source-list">{player.sources.map((item) => <li key={`${item.name}:${item.url}`}><a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}<ArrowUpRight size={14}/></a></li>)}</ul></section>
    <footer className="footer"><Link href="/#candidates">← BACK TO ALL EIGHT CANDIDATES</Link><p>Independent community ballot. Not affiliated with the official awards.</p></footer>
  </main>;
}
