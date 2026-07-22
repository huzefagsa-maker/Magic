import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/media/recording.mp4";

const DUST_PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  x: (i * 19 + 5) % 100,
  y: (i * 29 + 13) % 100,
  size: (i % 3) + 1.5,
  delay: (i * 0.5) % 3,
}));

const INTRO_LINES = [
  "Every friendship leaves behind a trail of moments...",
  "Some are funny.",
  "Some are chaotic.",
  "Some become unforgettable.",
  "Let's turn back a few pages...",
];

const REACTION_MOMENTS = [
  { triggerTime: 3, emoji: "✨", side: "top-8 left-6 sm:left-12" },
  { triggerTime: 9, emoji: "😂", side: "top-12 right-6 sm:right-12" },
  { triggerTime: 15, emoji: "🙈", side: "bottom-16 left-8 sm:left-16" },
  { triggerTime: 21, emoji: "🤣", side: "top-16 left-10 sm:left-20" },
  { triggerTime: 26, emoji: "😭", side: "bottom-20 right-8 sm:right-16" },
  { triggerTime: 29, emoji: "💀", side: "top-10 right-14 sm:right-24" },
];

type MemoryStage = "intro" | "playback" | "outro";

export function PensieveMemories() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<MemoryStage>("intro");
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoTime, setVideoTime] = useState(0);

  // Intro sequential line reveal
  useEffect(() => {
    if (stage !== "intro") return;

    const intervals: number[] = [];
    INTRO_LINES.forEach((_, index) => {
      const id = window.setTimeout(() => {
        setVisibleLines((prev) => Math.max(prev, index + 1));
      }, 600 + index * 1300);
      intervals.push(id);
    });

    const totalIntroTime = 600 + INTRO_LINES.length * 1300 + 2500;
    const finishIntroId = window.setTimeout(() => {
      setStage("playback");
    }, totalIntroTime);
    intervals.push(finishIntroId);

    return () => {
      intervals.forEach((id) => window.clearTimeout(id));
    };
  }, [stage]);

  // Video time tracking
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoTime(videoRef.current.currentTime);
    }
  };

  // Video end -> move to outro
  const handleVideoEnded = () => {
    setStage("outro");
  };

  // Outro -> navigate to /map automatically after 2.8 seconds
  useEffect(() => {
    if (stage !== "outro") return;

    const timer = window.setTimeout(() => {
      navigate({ to: "/map" });
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [stage, navigate]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-6 select-none"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(201,168,92,0.15), transparent 65%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(122,31,43,0.12), transparent 60%)",
        }}
      />

      {/* Floating Dust Particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {DUST_PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-gold/50"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              boxShadow: `0 0 ${p.size * 3}px rgba(201,168,92,0.6)`,
            }}
            animate={{ y: [0, -16, 0], opacity: [0.2, 0.75, 0.2] }}
            transition={{
              duration: 4 + (p.delay % 2),
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Stage 1: The Pensieve Intro Card */}
        {stage === "intro" && (
          <motion.article
            key="intro"
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.97 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl"
          >
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-3xl blur-3xl opacity-50"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, rgba(201,168,92,0.22), transparent 70%)",
              }}
            />

            <div className="relative rounded-3xl border border-gold/30 bg-[#0d070b]/45 backdrop-blur-xl px-6 py-12 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(201,168,92,0.15)] sm:px-10 sm:py-16 text-center border-t-gold/50">
              <header className="mb-8">
                <h1 className="font-display text-2xl font-semibold tracking-wider text-gold sm:text-3xl md:text-4xl drop-shadow-[0_0_20px_rgba(201,168,92,0.7)]">
                  📜 The Pensieve
                </h1>
                <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              </header>

              <div className="min-h-[180px] sm:min-h-[220px] flex flex-col items-center justify-center space-y-4 px-2">
                {INTRO_LINES.map((line, i) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: visibleLines > i ? 1 : 0, y: visibleLines > i ? 0 : 8 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={`font-body text-base italic leading-relaxed sm:text-lg ${
                      i === INTRO_LINES.length - 1
                        ? "text-gold font-semibold drop-shadow-[0_0_10px_rgba(201,168,92,0.5)]"
                        : "text-amber-100/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                    }`}
                  >
                    &ldquo;{line}&rdquo;
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.article>
        )}

        {/* Stage 2: Screen Recording Video Playback */}
        {stage === "playback" && (
          <motion.div
            key="playback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center justify-center max-w-4xl w-full"
          >
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-3xl blur-3xl opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(201,168,92,0.3), rgba(122,31,43,0.2) 60%, transparent 80%)",
              }}
            />

            <div className="relative rounded-2xl border border-gold/40 bg-black/60 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(201,168,92,0.25)] overflow-hidden max-h-[80vh] w-full flex items-center justify-center">
              <video
                ref={videoRef}
                src={VIDEO_SRC}
                autoPlay
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                className="h-full w-full max-h-[78vh] object-contain rounded-2xl"
              />

              {REACTION_MOMENTS.map((reaction, i) => {
                const isActive =
                  videoTime >= reaction.triggerTime && videoTime < reaction.triggerTime + 2.5;

                return (
                  <AnimatePresence key={i}>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 15 }}
                        animate={{ opacity: 1, scale: 1.2, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -25 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`pointer-events-none absolute ${reaction.side} z-20 text-3xl sm:text-4xl drop-shadow-[0_0_12px_rgba(201,168,92,0.8)]`}
                      >
                        {reaction.emoji}
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Stage 3: Outro / Transition to Marauder's Map */}
        {stage === "outro" && (
          <motion.div
            key="outro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl text-center px-4"
          >
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-full blur-3xl opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(201,168,92,0.35), transparent 70%)",
              }}
            />

            <motion.p
              animate={{ opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="font-display text-xl sm:text-3xl italic tracking-wide text-gold drop-shadow-[0_0_25px_rgba(201,168,92,0.8)] leading-relaxed"
            >
              &ldquo;Some memories never lose their magic...&rdquo;
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
