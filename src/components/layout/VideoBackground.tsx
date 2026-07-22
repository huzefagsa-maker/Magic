import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
const videoSrc = "/media/hogwarts-bg.mp4";

// Per-route ambiance tuning: overlay color/opacity + video filter
const AMBIANCE: Record<string, { overlay: string; filter: string }> = {
  "/": {
    overlay: "rgba(10,8,18,0.45)",
    filter: "brightness(0.92) contrast(1.05) saturate(0.9)",
  },
  "/sorting": {
    overlay: "rgba(8,6,16,0.42)",
    filter: "brightness(0.95) contrast(1.1) saturate(0.95)",
  },
  "/map": {
    overlay: "rgba(20,14,8,0.30)",
    filter: "brightness(1.0) contrast(1.05) sepia(0.15)",
  },
  "/platform": {
    overlay: "rgba(8,6,10,0.48)",
    filter: "brightness(0.85) contrast(1.1)",
  },
  "/celebration": {
    overlay: "rgba(10,8,20,0.25)",
    filter: "brightness(1.05) contrast(1.1) saturate(1.15)",
  },
};

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cfg = AMBIANCE[pathname] ?? AMBIANCE["/"];

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-1000"
        style={{ filter: cfg.filter }}
      />
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{ backgroundColor: cfg.overlay }}
      />
    </div>
  );
}
