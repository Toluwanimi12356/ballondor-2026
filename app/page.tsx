"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Menu, X } from "lucide-react";
import { players, stats } from "@/data/players";
import { BrandLockup } from "@/components/BrandMark";
import { getAnonymousVoterId } from "@/lib/anonymous-user";
import { isFirebaseConfigured } from "@/lib/firebase";
import { emptyVoteTotals, getExistingVote, subscribeToResults, submitVote, type VoteTotals } from "@/lib/voting";

function HeroTrophy() {
  return <div className="trophy-scene">
    <div className="trophy-halo" aria-hidden="true" />
    <picture className="trophy-image-stage">
      <source media="(max-width: 700px)" srcSet="/images/branding/ballondor-trophy-mobile.webp" />
      <Image
        src="/images/branding/ballondor-trophy-hero-desktop.png"
        alt="The Ballon d’Or trophy on a gold-lit plinth"
        width={1507}
        height={1044}
        sizes="(min-width: 1400px) 650px, (min-width: 701px) 47vw, 100vw"
        priority
        className="hero-trophy-image"
      />
    </picture>
  </div>;
}

export default function Home() {
  const [pick, setPick] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [isScrolled, setIsScrolled] = useState(false);
  const [navIndicator, setNavIndicator] = useState({ left: 0, width: 0, visible: false });
  const navLinksRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [voterId, setVoterId] = useState<string | null>(null);
  const [voteReady, setVoteReady] = useState(false);
  const [voteUnavailable, setVoteUnavailable] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [voteError, setVoteError] = useState(false);
  const [results, setResults] = useState<VoteTotals>(emptyVoteTotals);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [resultsError, setResultsError] = useState(false);
  const [resultsRetry, setResultsRetry] = useState(0);
  const selected = players.find((p) => p.id === pick);
  useEffect(() => {
    const sectionIds = ["top", "criteria", "candidates", "compare", "vote", ...(recorded ? ["results"] : [])];
    const sections = sectionIds
      .map((id) => ({ id, element: document.getElementById(id) }))
      .filter((section): section is { id: string; element: HTMLElement } => section.element instanceof HTMLElement);
    const nav = document.querySelector<HTMLElement>(".nav");
    const activationLine = (nav?.getBoundingClientRect().height ?? 76) + 26;
    const updateSection = () => {
      const current = sections.find(({ element }) => {
        const rect = element.getBoundingClientRect();
        return rect.top <= activationLine && rect.bottom > activationLine;
      }) ?? sections.filter(({ element }) => element.getBoundingClientRect().top <= activationLine).at(-1);
      if (current) setActiveSection(current.id === "results" ? "vote" : current.id);
      else if (window.scrollY < activationLine) setActiveSection("top");
    };
    const observer = new IntersectionObserver(updateSection, {
      rootMargin: `-${activationLine}px 0px -85% 0px`,
      threshold: 0,
    });
    sections.forEach(({ element }) => observer.observe(element));
    updateSection();
    window.addEventListener("resize", updateSection, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSection);
    };
  }, [recorded]);
  useEffect(() => {
    let previous = window.scrollY > 12;
    setIsScrolled(previous);
    const updateHeader = () => {
      const next = window.scrollY > 12;
      if (next !== previous) {
        previous = next;
        setIsScrolled(next);
      }
    };
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);
  useLayoutEffect(() => {
    const container = navLinksRef.current;
    const activeLink = container?.querySelector<HTMLElement>(`[data-section-nav="${activeSection}"]`);
    if (!container || !activeLink) {
      setNavIndicator((current) => current.visible ? { ...current, visible: false } : current);
      return;
    }
    const measure = () => setNavIndicator({ left: activeLink.offsetLeft, width: activeLink.offsetWidth, visible: true });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(activeLink);
    return () => observer.disconnect();
  }, [activeSection]);
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    const trophy = hero?.querySelector<HTMLElement>(".hero-trophy-image");
    const light = hero?.querySelector<HTMLElement>(".trophy-halo");
    const copy = hero?.querySelector<HTMLElement>(".hero-copy");
    if (!hero || !trophy || !light || !copy) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        trophy.style.transform = "none";
        light.style.opacity = "";
        copy.style.transform = "none";
        copy.style.opacity = "1";
        return;
      }
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
      trophy.style.transform = `translate3d(0, ${-28 * progress}px, 0) scale(${1 - 0.06 * progress})`;
      light.style.opacity = String(1 - 0.58 * progress);
      copy.style.transform = `translate3d(0, ${-12 * progress}px, 0)`;
      copy.style.opacity = String(1 - 0.14 * progress);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    reducedMotion.addEventListener("change", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    if (!confirm) return;
    const modal = document.querySelector<HTMLElement>(".confirm-modal");
    if (!modal) return;
    const dialog = modal;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ));
    getFocusable()[0]?.focus();
    function handleModalKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!submitting) setConfirm(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    }
    document.addEventListener("keydown", handleModalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleModalKeyDown);
      previouslyFocused?.focus();
    };
  }, [confirm, submitting]);
  useEffect(() => {
    let active = true;
    async function initializeBallot() {
      if (!isFirebaseConfigured) { setVoteUnavailable(true); return; }
      try {
        const id = getAnonymousVoterId();
        if (!active) return;
        setVoterId(id);
        const vote = await getExistingVote(id);
        if (!active) return;
        if (vote) {
          localStorage.setItem("ballondor2026_has_voted", "true");
          localStorage.setItem("ballondor2026_vote_candidate", vote.candidateId);
          setPick(vote.candidateId);
          setRecorded(true);
        } else {
          localStorage.removeItem("ballondor2026_has_voted");
          localStorage.removeItem("ballondor2026_vote_candidate");
          setRecorded(false);
        }
        setVoteReady(true);
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("Unable to initialize the community ballot.", error);
        if (active) setVoteUnavailable(true);
      }
    }
    void initializeBallot();
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!recorded || !voteReady) return;
    setResultsLoading(true); setResultsError(false);
    const unsubscribe = subscribeToResults((next) => { setResults(next); setResultsLoading(false); setResultsError(false); }, (error) => {
      if (process.env.NODE_ENV === "development") console.error("Unable to retrieve community results.", error);
      setResultsLoading(false); setResultsError(true);
    });
    return unsubscribe;
  }, [recorded, voteReady, resultsRetry]);
  async function castVote() {
    if (!pick || !voterId || !voteReady || submitting) return;
    setSubmitting(true); setVoteError(false);
    try {
      const vote = await submitVote(pick, voterId);
      try {
        localStorage.setItem("ballondor2026_has_voted", "true");
        localStorage.setItem("ballondor2026_vote_candidate", vote.candidateId);
        localStorage.setItem("ballondor2026_voter_id", voterId);
      } catch {
        // Firestore is authoritative; storage failure must not turn a committed vote into a UI error.
      }
      setPick(vote.candidateId); setRecorded(true); setConfirm(false);
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("Unable to record the community ballot.", error);
      setVoteError(true);
    } finally { setSubmitting(false); }
  }
  async function sharePick() {
    if (!selected) return;
    const message = `My 2026 Ballon d'Or vote goes to ${selected.name} 🏆\n\nEight candidates.\nOne winner.\n\nCast your vote: ${window.location.origin}`;
    await navigator.clipboard.writeText(message);
    setCopied(true);
  }
  function toggleCompare(id: string) {
    setCompareIds((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 3 ? [...current, id] : current);
  }
  const navigationItems = [
    { id: "criteria", label: "The criteria" },
    { id: "candidates", label: "Candidates" },
    { id: "compare", label: "Compare" },
    { id: "vote", label: "The ballot" },
  ];
  const links = navigationItems.map(({ id, label }) => (
    <a
      href={`#${id}`}
      key={id}
      data-section-nav={id}
      className={activeSection === id ? "active" : undefined}
      aria-current={activeSection === id ? "location" : undefined}
      onClick={() => setMobileOpen(false)}
    >
      {label}
    </a>
  ));
  return <main>
    <nav className={`nav${isScrolled ? " is-scrolled" : ""}`} aria-label="Primary navigation"><BrandLockup home/><div className="navlinks" ref={navLinksRef}>{links}<span className={`nav-indicator${navIndicator.visible ? " is-visible" : ""}`} style={{ width: navIndicator.width, transform: `translateX(${navIndicator.left}px)` }} aria-hidden="true"/></div><a className={`nav-cta${activeSection === "vote" ? " is-active" : ""}`} href="#vote">CAST YOUR VOTE <ArrowUpRight size={14}/></a><button ref={menuButtonRef} type="button" aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} aria-controls="site-navigation-menu" className="menu-toggle" onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X/> : <Menu/>}</button><div id="site-navigation-menu" className="mobile-menu" hidden={!mobileOpen}>{links}<a className={`mobile-menu-cta${activeSection === "vote" ? " active" : ""}`} aria-current={activeSection === "vote" ? "location" : undefined} href="#vote" onClick={() => setMobileOpen(false)}>CAST YOUR VOTE <ArrowRight size={14}/></a></div></nav>
    <section className="hero" id="top"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-copy"><p className="eyebrow"><span className="live-dot"/> THE COMMUNITY JOURNALIST BALLOT</p><h1><span className="hero-title-line">WHO</span><span className="hero-title-line">DESERVES</span><span className="hero-title-the">THE</span><span className="hero-title-accent"><span>BALLON</span><span>D&apos;OR?</span></span><span className="hero-year">2026</span></h1><p className="hero-desc">8 CANDIDATES · 3 CRITERIA · 1 TROPHY<br/><span>Study the evidence. Make your decision.</span></p><div className="hero-actions"><a className="button button-gold" href="#vote">ENTER THE BALLOT <ArrowRight size={16}/></a><a className="text-link" href="#candidates">MEET THE CANDIDATES <ArrowDown size={14}/></a></div><div className="hero-meta"><span>AN INDEPENDENT COMMUNITY VOTE</span><span>01 — 08</span></div></div><HeroTrophy/><div className="hero-bottom"><span>JUDGE THE SEASON</span><span>SCROLL TO EXPLORE ↓</span></div></section>
    <section className="manifesto" id="criteria"><div className="section-kicker">01 / THE JOURNALIST’S BRIEF</div><div className="manifesto-grid"><h2>YOU’RE THE<br/><em>JOURNALIST.</em></h2><div className="manifesto-intro"><p>For this vote, you are not choosing your favourite player. You are judging the season as a Ballon d’Or journalist.</p><span>THREE CRITERIA. ONE CONSIDERED DECISION.</span></div></div><div className="criteria-list">{[{n:"01",title:"INDIVIDUAL PERFORMANCE",body:"Decisive and impressive performances during the evaluation period."},{n:"02",title:"COLLECTIVE SUCCESS",body:"Team achievements and trophies won."},{n:"03",title:"CLASS & FAIR PLAY",body:"Sporting behaviour and conduct."}].map((c)=><article className="criterion" key={c.n}><span className="criterion-n">{c.n}</span><h3>{c.title}</h3><p>{c.body}</p><span className="criterion-mark">✳</span></article>)}</div></section>
    <section className="candidates" id="candidates"><div className="section-kicker">02 / THE FIELD — 08 CANDIDATES</div><div className="section-heading"><h2>THE EIGHT<br/><em>CANDIDATES.</em></h2><div><p>Eight candidates. Eight cases. One trophy.</p><span>Statistics provide context, not a final ranking. Different positions contribute in different ways.</span></div></div><div className="candidate-grid">{players.map((player, index)=>{const s=stats(player);return <Link className={`candidate candidate-${index+1}`} href={`/player/${player.slug}`} key={player.id}><div className="candidate-art"><Image src={`/images/video-posters/${player.id}.jpg`} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" className="candidate-poster"/><div className="portrait-figure"><div className="portrait-head"/><div className="portrait-body"/><span>{String(index+1).padStart(2,"0")}</span></div><div className="candidate-index">CANDIDATE {String(index+1).padStart(2,"0")} / 08</div><div className="candidate-arrow"><ArrowUpRight/></div><div className="candidate-name"><h3>{player.firstName}<br/><em>{player.lastName}</em></h3><div className="candidate-club"><span className="shirt-mark">✦</span>{player.club} <b>·</b> {player.country}</div></div></div><div className="candidate-stats"><span>MATCHES <b>{s.matches ?? "—"}</b></span><span>GOALS <b>{s.goals ?? "—"}</b></span><span>ASSISTS <b>{s.assists ?? "—"}</b></span></div><div className="view-case">VIEW CASE <ArrowRight size={14}/></div></Link>})}</div><div className="field-note"><span>08 PROFILES</span><span>OFFICIAL NOMINEE TOTALS · SOURCE CUTOFF NOT STATED</span><span>03 JUDGING CRITERIA</span></div></section>
    <section className="compare" id="compare"><div className="section-kicker">03 / PUT THE CASES SIDE BY SIDE</div><div className="compare-head"><h2>COMPARE<br/><em>THE CASES.</em></h2><p>Official Ballon d&apos;Or nominee totals are shown as published; the source does not state a statistical cutoff.</p></div><div className="compare-select">{players.map((p)=><button className={compareIds.includes(p.id)?"selected":""} onClick={()=>toggleCompare(p.id)} key={p.id} aria-pressed={compareIds.includes(p.id)}><span>{p.firstName[0]}{p.lastName[0]}</span>{p.name}</button>)}</div><p className="compare-hint">SELECT 2–3 CANDIDATES TO COMPARE</p><div className="comparison-table"><div className="comparison-row comparison-labels" style={{gridTemplateColumns:`minmax(135px,1fr) repeat(${Math.max(compareIds.length,1)}, minmax(135px,1fr))`}}><span>OFFICIAL NOMINEE TOTAL</span>{compareIds.length?compareIds.map(id=><span key={id}>{players.find(p=>p.id===id)?.name}</span>):<span>SELECT CANDIDATES ABOVE</span>}</div>{[["Matches","matches"],["Goals","goals"],["Assists","assists"],["Goal contributions","contributions"]].map(([label,key])=><div className="comparison-row" key={label} style={{gridTemplateColumns:`minmax(135px,1fr) repeat(${Math.max(compareIds.length,1)}, minmax(135px,1fr))`}}><span>{label}</span>{compareIds.length?compareIds.map(id=>{const p=players.find(candidate=>candidate.id===id)!;return <b key={id}>{stats(p)[key as keyof ReturnType<typeof stats>] ?? "—"}</b>}):<b>—</b>}</div>)}{[["Team trophies","trophies"],["Individual honours","individualAwards"]].map(([label,key])=><div className="comparison-row" key={label} style={{gridTemplateColumns:`minmax(135px,1fr) repeat(${Math.max(compareIds.length,1)}, minmax(135px,1fr))`}}><span>{label}</span>{compareIds.length?compareIds.map(id=>{const p=players.find(candidate=>candidate.id===id)!;const entries=key==="trophies"?p.trophies:p.individualAwards;return <b key={id}>{entries.filter(a=>a.verified).length || "—"}</b>}):<b>—</b>}</div>)}</div></section>
    <section className="vote" id="vote"><div className="vote-light"/><div className="section-kicker">04 / YOUR DECISION</div><div className="vote-heading"><h2>{recorded?<>BALLOT<br/><em>RECORDED.</em></>:<>YOU’VE SEEN<br/><em>THE EVIDENCE.</em></>}</h2><p>{recorded?`Your vote for ${selected?.name ?? "your candidate"} has been recorded in the community ballot.`:"Now cast your ballot. Choose the player whose season makes the strongest case."}</p></div>{!voteReady&&!voteUnavailable&&<p className="vote-state" role="status">CHECKING YOUR BALLOT…</p>}{voteUnavailable&&<p className="vote-error" role="alert">LIVE VOTING IS CURRENTLY UNAVAILABLE. Candidate profiles remain available.</p>}<div className="ballot-options">{players.map((p,i)=><button key={p.id} className={`ballot-option ${pick===p.id?"chosen":""}`} onClick={()=>voteReady&&!recorded&&setPick(p.id)} disabled={!voteReady||recorded}><span className="ballot-num">{String(i+1).padStart(2,"0")}</span><span className="ballot-avatar">{p.firstName[0]}{p.lastName[0]}</span><span className="ballot-name">{p.name}<small>{p.club} · {p.country}</small></span><span className="ballot-check">{pick===p.id&&<Check size={17}/>}</span></button>)}</div>{!recorded?<button className="button button-gold cast-button" disabled={!pick||!voteReady} onClick={()=>{setVoteError(false);setConfirm(true);}}>CAST MY VOTE <ArrowRight size={16}/></button>:<><a className="button button-gold cast-button" href="#results">VIEW COMMUNITY RESULTS <ArrowRight size={16}/></a><div className="share-actions"><span>SHARE YOUR PICK</span><a target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`My 2026 Ballon d'Or vote goes to ${selected?.name} 🏆\n\nEight candidates.\nOne winner.\n\nCast your vote: ${typeof window !== "undefined" ? window.location.origin : ""}`)}`}>WHATSAPP ↗</a><a target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`My 2026 Ballon d'Or vote goes to ${selected?.name} 🏆\n\nEight candidates. One winner.`)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}`}>POST TO X ↗</a><button onClick={sharePick}>{copied?"COPIED":"COPY LINK"}</button></div></>}<p className="vote-note">ONE BALLOT PER ANONYMOUS DEVICE ID · UNOFFICIAL COMMUNITY POLL</p></section>
    {recorded&&<section className="results" id="results" aria-live="polite"><div className="section-kicker">05 / THE COMMUNITY</div><h2>COMMUNITY<br/><em>RESULTS.</em></h2>{resultsLoading&&<p className="vote-state" role="status">RETRIEVING COMMUNITY BALLOTS…</p>}{resultsError&&<div className="results-error"><p>Live community results are temporarily unavailable.</p><button className="text-link" onClick={()=>{setResultsError(false);setResultsLoading(true);setResultsRetry((value)=>value+1);}}>TRY AGAIN <ArrowRight size={14}/></button></div>}{!resultsError&&<><p className="total-ballots">TOTAL BALLOTS <strong>{results.totalVotes.toLocaleString("en-US")}</strong></p>{results.totalVotes===0&&!resultsLoading?<p className="empty-state">You could be the first journalist on the board.</p>:<div className="results-list">{results.candidates.map(({candidateId,votes,percentage})=>{const player=players.find((candidate)=>candidate.id===candidateId);if(!player)return null;return <div className="result-line" key={candidateId}><span>{player.name}<small>{percentage.toFixed(1)}%</small></span><div><i style={{width:`${percentage}%`}}/></div><b>{votes.toLocaleString("en-US")}</b></div>;})}</div>}</>}</section>}
    <footer className="footer"><a className="wordmark" href="#top">BALLON D’OR <span>2026</span></a><div className="footer-links"><a href="#candidates">Candidates</a><a href="#criteria">Criteria</a><a href="#compare">Compare</a><a href="#vote">Vote</a></div><p>An independent community Ballon d’Or voting experience. Not affiliated with France Football, L’Équipe, UEFA, FIFA, or the official Ballon d’Or awards.</p><small>COMMUNITY JOURNALIST BALLOT · PARIS / 2026</small></footer>
    {confirm&&selected&&<div className="modal-backdrop" role="presentation" onClick={()=>!submitting&&setConfirm(false)}><section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={e=>e.stopPropagation()}><button className="modal-close" aria-label="Close" onClick={()=>!submitting&&setConfirm(false)} disabled={submitting}><X/></button><p className="eyebrow">CONFIRM YOUR BALLOT</p><h2 id="confirm-title">You are voting for<br/><em>{selected.name}</em></h2><p>as your 2026 Ballon d’Or winner.</p>{voteError&&<div className="submission-error" role="alert"><p>Your ballot couldn’t be recorded. Please try again.</p><button className="text-link" onClick={castVote} disabled={submitting}>TRY AGAIN <ArrowRight size={14}/></button></div>}<button className="button button-gold" onClick={castVote} disabled={submitting}>{submitting?"RECORDING BALLOT…":<>CONFIRM VOTE <Check size={16}/></>}</button><button className="text-link" onClick={()=>setConfirm(false)} disabled={submitting}>CHANGE MY PICK</button></section></div>}
  </main>;
}
