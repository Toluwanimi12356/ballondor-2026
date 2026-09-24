"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";

const SOUND_KEY = "ballondor2026_profile_video_sound";
const CHANNEL_NAME = "ballondor2026-profile-audio";

type PlayerVideoProps = { playerName: string; src: string; poster: string };

export function PlayerVideo({ playerName, src, poster }: PlayerVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const userPaused = useRef(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    try { setSoundEnabled(sessionStorage.getItem(SOUND_KEY) === "on"); }
    catch { setSoundEnabled(false); }
  }, []);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;
    channel.onmessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.data?.type !== "sound-requested") return;
      const video = videoRef.current;
      if (video) video.muted = true;
      setSoundEnabled(false);
    };
    return () => { channel.close(); channelRef.current = null; };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    video.muted = !soundEnabled;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (visible && !document.hidden && !reduceMotion && !userPaused.current) {
        void video.play().catch(() => setPlaying(false));
      } else {
        video.pause();
        setPlaying(false);
      }
    }, { threshold: 0.35 });
    observer.observe(video);
    const onVisibilityChange = () => {
      if (document.hidden) { video.pause(); setPlaying(false); }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      video.pause();
    };
  }, [soundEnabled, src]);

  function toggleSound() {
    const video = videoRef.current;
    const next = !soundEnabled;
    if (video) video.muted = !next;
    setSoundEnabled(next);
    try { sessionStorage.setItem(SOUND_KEY, next ? "on" : "off"); }
    catch { /* Storage is optional; this mounted instance still updates. */ }
    if (next) channelRef.current?.postMessage({ type: "sound-requested" });
  }

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  function toggleFullscreen() {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (video.requestFullscreen) void video.requestFullscreen();
    else if ("webkitEnterFullscreen" in video) (video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen?.();
  }

  return <section className={`player-video ${playing ? "is-playing" : ""}`} aria-label={`${playerName} nominee presentation video`}>
    <video
      ref={videoRef} src={src} poster={poster} muted={!soundEnabled} playsInline preload="none"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
      onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      aria-label={`${playerName} from the official Ballon d'Or nominee presentation`}
    />
    <div className="player-video-caption"><span>OFFICIAL NOMINEE PRESENTATION · {playerName.toUpperCase()}</span></div>
    <div className="player-video-controls" aria-label={`${playerName} video controls`}>
      <button type="button" onClick={togglePlayback} aria-label={playing ? `Pause ${playerName} video` : `Play ${playerName} video`}>
        {playing ? <Pause size={15} aria-hidden="true"/> : <Play size={15} aria-hidden="true"/>}
      </button>
      <label className="video-seek-label"><span className="sr-only">Seek through {playerName} video</span><input type="range" min={0} max={duration || 1} step="0.1" value={Math.min(currentTime, duration || 0)} onChange={(event) => { if (videoRef.current) videoRef.current.currentTime = Number(event.target.value); }}/></label>
      <span className="video-time" aria-live="off">{formatTime(currentTime)} / {formatTime(duration)}</span>
      <button type="button" onClick={toggleSound} aria-pressed={soundEnabled} aria-label={soundEnabled ? `Mute ${playerName} video` : `Enable sound for ${playerName} video`}>
        {soundEnabled ? <Volume2 size={15} aria-hidden="true"/> : <VolumeX size={15} aria-hidden="true"/>}
        {soundEnabled ? "SOUND ON" : "MUTED"}
      </button>
      <button type="button" onClick={toggleFullscreen} aria-label={`View ${playerName} video fullscreen`}><Maximize2 size={15} aria-hidden="true"/></button>
    </div>
  </section>;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
