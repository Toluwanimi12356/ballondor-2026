"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const SOUND_KEY = "ballondor2026_profile_video_sound";
const CHANNEL_NAME = "ballondor2026-profile-audio";

type PlayerVideoProps = {
  playerName: string;
  src: string;
  poster: string;
};

export function PlayerVideo({ playerName, src, poster }: PlayerVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    try {
      setSoundEnabled(sessionStorage.getItem(SOUND_KEY) === "on");
    } catch {
      setSoundEnabled(false);
    }
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
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    video.muted = !soundEnabled;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (visible && !document.hidden && !reduceMotion) {
        void video.play().catch(() => setPlaying(false));
      } else {
        video.pause();
        setPlaying(false);
      }
    }, { threshold: 0.35 });
    observer.observe(video);
    const onVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        setPlaying(false);
      }
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
    try {
      sessionStorage.setItem(SOUND_KEY, next ? "on" : "off");
    } catch {
      // The preference remains active for this mounted video if storage is unavailable.
    }
    if (next) channelRef.current?.postMessage({ type: "sound-requested" });
  }

  return <section className={`player-video ${playing ? "is-playing" : ""}`} aria-label={`${playerName} nominee presentation video`}>
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted={!soundEnabled}
      playsInline
      controls
      preload="none"
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onVolumeChange={(event) => setSoundEnabled(!event.currentTarget.muted)}
      aria-label={`${playerName} from the official Ballon d'Or nominee presentation`}
    />
    <div className="player-video-caption">
      <span>OFFICIAL NOMINEE PRESENTATION · {playerName.toUpperCase()}</span>
      <button type="button" onClick={toggleSound} aria-pressed={soundEnabled} aria-label={soundEnabled ? `Mute ${playerName} video` : `Enable sound for ${playerName} video`}>
        {soundEnabled ? <Volume2 size={15} aria-hidden="true"/> : <VolumeX size={15} aria-hidden="true"/>}
        {soundEnabled ? "SOUND ON" : "MUTED"}
      </button>
    </div>
  </section>;
}
