import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { siteContent } from "@/content/siteContent";

const DUST_PARTICLES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  x: (i * 19 + 7) % 100,
  y: (i * 23 + 11) % 100,
  size: (i % 3) * 1.4 + 1.6,
  duration: 3 + (i % 4),
  delay: (i * 0.25) % 2.5,
}));

const STEAM_CLOUDS = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  left: `${i * 18 - 10}%`,
  bottom: `${(i % 3) * 10 - 5}%`,
  size: 300 + (i % 3) * 80,
  delay: i * 0.8,
  duration: 8 + (i % 4),
}));

type PlatformStage = "card-reading" | "card-fading" | "wall-ready" | "running" | "passing-through" | "emerged";

export function PlatformExperience() {
  const navigate = useNavigate();
  const c = siteContent.platform;

  const [stage, setStage] = useState<PlatformStage>("card-reading");
  const [showLetter, setShowLetter] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize authentic magical soundscape (rushing wind, barrier chime, steam whistle)
  const playTransitionSoundscape = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // 1. Rushing Wind / Whoosh Noise
      const bufferSize = ctx.sampleRate * 2.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1.2);
      filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 2.5);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.8);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start();

      // 2. Barrier Shimmer Chimes
      const chimes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      chimes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + 1.4 + idx * 0.12;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1.5);
      });

      // 3. Soft Hogwarts Express Steam Whistle on Emergence
      setTimeout(() => {
        if (!ctx || ctx.state === "closed") return;
        const whistleOsc = ctx.createOscillator();
        const whistleGain = ctx.createGain();
        whistleOsc.type = "sine";
        whistleOsc.frequency.setValueAtTime(698.46, ctx.currentTime); // F5 note
        whistleOsc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.6);

        whistleGain.gain.setValueAtTime(0, ctx.currentTime);
        whistleGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.3);
        whistleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

        whistleOsc.connect(whistleGain);
        whistleGain.connect(ctx.destination);
        whistleOsc.start();
        whistleOsc.stop(ctx.currentTime + 1.9);
      }, 2600);
    } catch {
      // Audio context fallback
    }
  }, []);

  // STEP 1, 2, 3: Automatic timing sequence on initial load
  useEffect(() => {
    // 5.5 Seconds reading time pause for instruction card
    const t1 = setTimeout(() => {
      setStage("card-fading");
    }, 5500);

    // 800ms card fade-out -> Wall becomes ready & interactive at 6.3s
    const t2 = setTimeout(() => {
      setStage("wall-ready");
    }, 6300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // STEP 5: Handle user tapping the wall AFTER it becomes interactive
  const handleWallTap = () => {
    // Strictly forbid clicks while instruction card is visible or fading!
    if (stage !== "wall-ready") return;

    setStage("running");
    playTransitionSoundscape();

    const t1 = setTimeout(() => {
      setStage("passing-through");
    }, 1800);

    const t2 = setTimeout(() => {
      setStage("emerged");
    }, 2600);

    const t3 = setTimeout(() => {
      setShowLetter(true);
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const handleContinue = () => {
    navigate({ to: "/celebration" });
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#080507] text-parchment overflow-hidden flex flex-col items-center justify-center select-none">
      {/* 1. FULL-SCREEN CENTERED BRICK WALL & CAMERA CANVAS */}
      {stage !== "emerged" && (
        <div
          onClick={handleWallTap}
          className={`fixed inset-0 z-30 flex items-center justify-center overflow-hidden ${
            stage === "wall-ready" ? "cursor-pointer" : "cursor-default pointer-events-none"
          }`}
          style={{ perspective: "1200px" }}
        >
          {/* Centered Solid Brick Wall */}
          <motion.div
            initial={{ scale: 1, z: 0 }}
            animate={{
              scale: stage === "running" ? 2.8 : stage === "passing-through" ? 4.5 : 1,
              z: stage === "running" ? 400 : stage === "passing-through" ? 800 : 0,
              x: stage === "running" ? [0, -3, 3, -2, 0] : 0,
              y: stage === "running" ? [0, -2, 2, -1, 0] : 0,
            }}
            transition={{
              scale: { duration: stage === "running" ? 1.8 : 0.9, ease: [0.33, 1, 0.68, 1] },
              z: { duration: stage === "running" ? 1.8 : 0.9, ease: [0.33, 1, 0.68, 1] },
              x: { duration: 1.8, repeat: Infinity, ease: "linear" },
              y: { duration: 1.8, repeat: Infinity, ease: "linear" },
            }}
            className="brick-wall absolute inset-0 w-full h-full flex items-center justify-center"
            style={{ willChange: "transform" }}
          >
            {/* Dark Ambient Lighting Vignette on Brick Wall */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(201,168,92,0.15) 0%, rgba(20,10,12,0.7) 60%, rgba(5,3,4,0.95) 100%)",
              }}
            />

            {/* STEP 4: Soft Magical Shimmer Sweep when Wall Becomes Ready */}
            {stage === "wall-ready" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.7, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255,223,130,0.3) 0%, rgba(201,168,92,0.15) 45%, transparent 75%)",
                }}
              />
            )}

            {/* Shimmering Golden Particle Sweep as Camera Approaches Wall */}
            {(stage === "running" || stage === "passing-through") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: stage === "passing-through" ? 0.95 : 0.6 }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255,223,130,0.4) 0%, rgba(201,168,92,0.2) 40%, transparent 75%)",
                }}
              />
            )}
          </motion.div>

          {/* Impact Refraction & Motion Blur Layer when Passing Through Barrier */}
          <AnimatePresence>
            {stage === "passing-through" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center bg-gold/20 backdrop-blur-md"
                style={{
                  backdropFilter: "blur(12px) contrast(1.2)",
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255,235,160,0.6) 0%, rgba(201,168,92,0.3) 50%, rgba(10,5,8,0.85) 100%)",
                }}
              >
                {/* Floating Magical Dust Explosion at Impact */}
                <div className="absolute inset-0 overflow-hidden">
                  {DUST_PARTICLES.map((p) => (
                    <motion.span
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 2, 3],
                        x: [(p.x - 50) * 2, (p.x - 50) * 8],
                        y: [(p.y - 50) * 2, (p.y - 50) * 8],
                      }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="absolute w-2 h-2 rounded-full bg-gold shadow-[0_0_12px_rgba(255,223,130,1)]"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STEP 1 & 2: TOP-CENTER FLOATING INSTRUCTION OVERLAY (Non-clickable, stays for 5.5s) */}
          <AnimatePresence>
            {(stage === "card-reading" || stage === "card-fading") && (
              <motion.div
                key="instruction-card"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: stage === "card-fading" ? 0 : 1, y: stage === "card-fading" ? -25 : 0 }}
                transition={{
                  opacity: { duration: 0.8 },
                  y: { duration: 0.8 },
                }}
                className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-[85%] max-w-[700px] rounded-2xl sm:rounded-3xl border border-gold/50 sm:border-2 border-gold/60 bg-[#0d0709]/75 backdrop-blur-md px-6 py-6 sm:px-10 sm:py-7 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(201,168,92,0.25)] text-center text-parchment flex flex-col items-center justify-center pointer-events-none"
              >
                {/* 🪄 Magic Icon Badge */}
                <div className="mb-2 sm:mb-3 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-maroon/20 border border-gold/50 text-xl sm:text-2xl shadow-inner text-gold">
                  🪄
                </div>

                {/* RUN STRAIGHT THROUGH THE WALL Heading */}
                <h1 className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-gold tracking-widest drop-shadow-[0_0_15px_rgba(201,168,92,0.8)] uppercase">
                  RUN STRAIGHT THROUGH THE WALL
                </h1>

                <div className="my-2 sm:my-3 h-px w-28 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

                {/* Body Quote */}
                <p className="font-body text-base sm:text-lg md:text-xl italic leading-relaxed text-amber-100/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-xl">
                  &ldquo;The barrier between Platforms Nine and Ten only opens for those who truly believe.&rdquo;
                </p>

                {/* Hint Text */}
                <div className="mt-4 pt-3 border-t border-gold/25 font-display text-xs sm:text-sm uppercase tracking-[0.25em] text-gold/80">
                  Read carefully before the barrier opens
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STEP 4: WALL IS NOW READY & CLICKABLE HINT BADGE */}
          <AnimatePresence>
            {stage === "wall-ready" && (
              <motion.div
                key="wall-ready-hint"
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8 }}
                className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center justify-center"
              >
                <div className="px-8 py-3.5 rounded-full border-2 border-gold/80 bg-[#120a0d]/90 backdrop-blur-md text-gold font-display text-sm sm:text-base tracking-widest uppercase shadow-[0_0_30px_rgba(201,168,92,0.6)] animate-pulse text-glow-gold">
                  ✨ Tap the brick wall to run through! ✨
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 2. PLATFORM 9¾ STATION ENVIRONMENT & REVEAL */}
      {stage === "emerged" && (
        <main className="relative z-20 w-full min-h-[100dvh] flex flex-col items-center justify-start px-4 py-8 overflow-x-hidden">
          {/* Station Ambient Warm Lighting */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 50% 20%, rgba(201,168,92,0.25), rgba(122,31,43,0.15) 50%, rgba(5,3,4,0.95) 90%)",
            }}
          />

          {/* Drifting Steam / Fog Clouds */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            {STEAM_CLOUDS.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{
                  opacity: [0.1, 0.45, 0.1],
                  x: [0, 100, 200],
                }}
                transition={{
                  duration: s.duration,
                  repeat: Infinity,
                  delay: s.delay,
                  ease: "easeInOut",
                }}
                className="absolute rounded-full blur-3xl bg-amber-100/15"
                style={{
                  left: s.left,
                  bottom: s.bottom,
                  width: `${s.size}px`,
                  height: `${s.size * 0.6}px`,
                }}
              />
            ))}
          </div>

          {/* Floating Gold Particles */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            {DUST_PARTICLES.map((p) => (
              <motion.span
                key={p.id}
                className="absolute rounded-full bg-gold/60"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  boxShadow: `0 0 ${p.size * 3}px rgba(201,168,92,0.85)`,
                }}
                animate={{
                  y: [0, -25, 0],
                  x: [0, 8, -5, 0],
                  opacity: [0.15, 0.85, 0.15],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Platform 9¾ Station Header Banner */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-30 flex flex-col items-center text-center mt-4 mb-8"
          >
            {/* Vintage Platform 9¾ Hanging Sign */}
            <div className="relative inline-flex flex-col items-center px-8 py-4 rounded-xl border-2 border-gold/70 bg-[#120a0d]/90 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(201,168,92,0.3)]">
              <span className="font-display text-xs uppercase tracking-[0.35em] text-gold/70 mb-1">
                Hogwarts Express • Track 9¾
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gold tracking-widest drop-shadow-[0_0_25px_rgba(201,168,92,0.8)]">
                PLATFORM 9¾
              </h1>
              <div className="mt-2 h-px w-32 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            </div>
          </motion.header>

          {/* DEAREST UMEMA BIRTHDAY LETTER */}
          <AnimatePresence>
            {showLetter && (
              <motion.article
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="parchment-bg relative z-30 w-full max-w-2xl px-6 py-10 sm:px-14 sm:py-14 rounded-2xl border-2 border-gold/60 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(201,168,92,0.3)] my-4 text-[#2a1810]"
              >
                <div className="space-y-6 font-body text-lg leading-[1.9] text-[#2a1810] sm:text-xl max-h-[60vh] overflow-y-auto pr-2 sm:pr-4 custom-scrollbar">
                  <p className="first-line:font-display first-line:tracking-wide">
                    <span
                      className="float-left mr-3 mt-1 font-display text-6xl leading-none text-gold sm:text-7xl"
                      style={{ textShadow: "1px 1px 0 rgba(122,31,43,0.3)" }}
                    >
                      {c.letter.dropCap}
                    </span>
                    {c.letter.firstLine}
                  </p>

                  {c.letter.paragraphs.map((paragraph, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.4 }}
                    >
                      {paragraph}
                    </motion.p>
                  ))}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.6 }}
                    className="pt-6 border-t border-maroon/20"
                  >
                    <p className="italic text-maroon/90 font-medium">{c.letter.signoff}</p>
                    <p className="mt-2 font-display text-xl uppercase tracking-[0.3em] text-maroon font-semibold">
                      {c.letter.signer}
                    </p>
                  </motion.div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>

          {/* ONE LAST THING CTA BUTTON */}
          {showLetter && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2 }}
              className="relative z-30 mt-8 mb-12"
            >
              <motion.button
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 40px rgba(201, 168, 92, 0.85), 0 0 20px rgba(122, 31, 43, 0.7)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="group relative inline-flex items-center gap-3 rounded-full border-2 border-gold/80 bg-gradient-to-r from-[#7a1f2b] via-[#5a1520] to-[#7a1f2b] px-8 py-3.5 sm:px-10 sm:py-4 font-display text-base sm:text-lg font-medium text-gold shadow-[0_0_30px_rgba(201,168,92,0.45)] backdrop-blur-md cursor-pointer"
              >
                <span className="relative z-10 tracking-wide font-semibold text-glow-gold">
                  {c.continueCta}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/30 via-transparent to-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </motion.button>
            </motion.div>
          )}
        </main>
      )}
    </div>
  );
}
