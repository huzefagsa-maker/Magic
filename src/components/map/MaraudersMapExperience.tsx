import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { siteContent } from "@/content/siteContent";
import { MemoryModal, type MemoryItem } from "./MemoryModal";

const COVER_IMAGE = "/media/marauders-map.png";
const INNER_MAP_IMAGE = "/media/marauders-map-inner.png";

const DUST_PARTICLES = Array.from({ length: 35 }).map((_, i) => ({
  id: i,
  x: (i * 17 + 9) % 100,
  y: (i * 23 + 7) % 100,
  size: (i % 3) * 1.3 + 1.5,
  duration: 3.5 + (i % 4),
  delay: (i * 0.3) % 2.5,
}));

// Memory Locations on the Inner Map
const MEMORY_LOCATIONS: MemoryItem[] = [
  {
    id: "loc-1",
    photo: siteContent.map.locations[0].photo,
    landmark: siteContent.map.locations[0].landmark,
    title: siteContent.map.locations[0].title,
    caption: siteContent.map.locations[0].caption,
    oneWord: siteContent.map.locations[0].oneWord,
    symbol: "📜",
    x: 28,
    y: 56,
  },
  {
    id: "loc-2",
    photo: siteContent.map.locations[1].photo,
    landmark: siteContent.map.locations[1].landmark,
    title: siteContent.map.locations[1].title,
    caption: siteContent.map.locations[1].caption,
    oneWord: siteContent.map.locations[1].oneWord,
    symbol: "✨",
    x: 48,
    y: 74,
  },
  {
    id: "loc-3",
    photo: siteContent.map.locations[2].photo,
    landmark: siteContent.map.locations[2].landmark,
    title: siteContent.map.locations[2].title,
    caption: siteContent.map.locations[2].caption,
    oneWord: siteContent.map.locations[2].oneWord,
    symbol: "📸",
    x: 27,
    y: 22,
  },
  {
    id: "loc-4",
    photo: siteContent.map.locations[3].photo,
    landmark: siteContent.map.locations[3].landmark,
    title: siteContent.map.locations[3].title,
    caption: siteContent.map.locations[3].caption,
    oneWord: siteContent.map.locations[3].oneWord,
    symbol: "🗺️",
    x: 64,
    y: 48,
  },
  {
    id: "loc-5",
    photo: siteContent.map.locations[4].photo,
    landmark: siteContent.map.locations[4].landmark,
    title: siteContent.map.locations[4].title,
    caption: siteContent.map.locations[4].caption,
    oneWord: siteContent.map.locations[4].oneWord,
    symbol: "🌙",
    x: 76,
    y: 24,
  },
];

// Waypoint steps along curved magical paths for footprint walking
const FOOTPRINT_PATH_STEPS = [
  // Path 1: Great Hall -> Kitchens
  [
    { x: 31, y: 59, angle: 40 },
    { x: 36, y: 64, angle: 45 },
    { x: 41, y: 69, angle: 30 },
    { x: 45, y: 72, angle: 10 },
  ],
  // Path 2: Kitchens -> Clock Tower
  [
    { x: 51, y: 70, angle: -45 },
    { x: 55, y: 63, angle: -50 },
    { x: 59, y: 56, angle: -40 },
    { x: 62, y: 51, angle: -20 },
  ],
  // Path 3: Clock Tower -> Gryffindor Tower
  [
    { x: 60, y: 44, angle: -120 },
    { x: 50, y: 38, angle: -140 },
    { x: 40, y: 31, angle: -130 },
    { x: 31, y: 25, angle: -110 },
  ],
  // Path 4: Gryffindor Tower -> Astronomy Tower
  [
    { x: 33, y: 20, angle: 10 },
    { x: 44, y: 19, angle: 0 },
    { x: 56, y: 20, angle: 5 },
    { x: 68, y: 22, angle: 15 },
  ],
];

type ExperienceStage = "black-fade" | "cover-static" | "cover-opening" | "interactive-map";

export function MaraudersMapExperience() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<ExperienceStage>("black-fade");
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [hoveredMemoryId, setHoveredMemoryId] = useState<string | null>(null);
  const [walkingStep, setWalkingStep] = useState<number>(0);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const [openedMemoryIds, setOpenedMemoryIds] = useState<Set<string>>(() => new Set());
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const preloadedImagesRef = useRef<Set<string>>(new Set());

  // Play subtle magical chime synth when cover opens
  const playMagicalChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.16;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.06, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1.6);
      });
    } catch {
      // Audio context blocked or uninitialized
    }
  }, []);

  // Play spell reveal chime when clicking a memory marker
  const playSpellRevealSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const notes = [587.33, 739.99, 880, 1174.66, 1479.98];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.11;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1.3);
      });
    } catch {
      // Audio context blocked
    }
  }, []);

  // Stage timeline controller
  useEffect(() => {
    // 1. Initial fade to black (1.0s) -> Cover Static
    const t1 = setTimeout(() => {
      setStage("cover-static");
    }, 1000);

    // 2. Hold Cover static for 2.2 seconds -> Start Magical Cover Opening
    const t2 = setTimeout(() => {
      setStage("cover-opening");
      playMagicalChime();
    }, 3200);

    // 3. Remove cover completely & reveal interactive map (at 5.2s)
    const t3 = setTimeout(() => {
      setStage("interactive-map");
    }, 5200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [playMagicalChime]);

  // Footprint walking animation loop (pauses when tab is hidden)
  useEffect(() => {
    if (stage !== "interactive-map") return;
    const interval = setInterval(() => {
      if (document.hidden) return;
      setWalkingStep((prev) => (prev + 1) % 16);
    }, 750);
    return () => clearInterval(interval);
  }, [stage]);

  // Handle memory selection, lazy preloading & ALL FIVE MEMORIES UNLOCK LOGIC
  const handleMarkerClick = useCallback((loc: MemoryItem) => {
    setSelectedMemory(loc);
    playSpellRevealSound();

    // Track opened memories
    setOpenedMemoryIds((prev) => {
      const next = new Set(prev);
      next.add(loc.id);

      // If all 5 memories have been opened at least once!
      if (next.size === 5 && !showNextButton) {
        setTimeout(() => {
          setShowNextButton(true);
        }, 1200);
      }
      return next;
    });

    // Lazy Preload Next Un-opened Memory Image in Background
    const unopened = MEMORY_LOCATIONS.find((m) => m.id !== loc.id && !preloadedImagesRef.current.has(m.photo));
    if (unopened) {
      preloadedImagesRef.current.add(unopened.photo);
      const img = new Image();
      img.src = unopened.photo;
    }
  }, [playSpellRevealSound, showNextButton]);

  const handleNextChapter = useCallback(() => {
    navigate({ to: "/platform" });
  }, [navigate]);

  const handleCloseModal = useCallback(() => {
    setSelectedMemory(null);
  }, []);

  // Compute remaining unopened count hint if needed
  const remainingCount = useMemo(() => {
    return Math.max(0, 5 - openedMemoryIds.size);
  }, [openedMemoryIds.size]);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#050407] text-parchment overflow-hidden flex flex-col items-center justify-center select-none px-3 py-6 sm:px-6 sm:py-10">
      {/* Warm Candlelit Ambient Background Glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        animate={{
          opacity: [0.65, 0.9, 0.72, 0.95, 0.68],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(201,168,92,0.22), rgba(122,31,43,0.14) 55%, transparent 88%)",
        }}
      />

      {/* Floating Magical Dust Particles */}
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
              willChange: "transform, opacity",
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 8, -6, 0],
              opacity: [0.1, 0.85, 0.1],
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

      {/* 1. Initial Black Fade Overlay */}
      <AnimatePresence>
        {stage === "black-fade" && (
          <motion.div
            key="black-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          />
        )}
      </AnimatePresence>

      {/* 2 & 3. COVER IMAGE STAGE (Introduction Only) */}
      <AnimatePresence>
        {(stage === "cover-static" || stage === "cover-opening") && (
          <motion.div
            key="cover-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex items-center justify-center px-4 py-8 bg-black/90 backdrop-blur-sm"
            style={{ perspective: "1600px" }}
          >
            {/* Soft Golden Aura behind Cover */}
            <div
              aria-hidden
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(201,168,92,0.3) 0%, rgba(122,31,43,0.15) 50%, transparent 80%)",
              }}
            />

            {/* Split Gatefold Cover Opening Effect */}
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg aspect-[3/5] max-h-[82vh] rounded-lg shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(201,168,92,0.3)] border-2 border-gold/40 overflow-hidden flex">
              {/* Left Flap of Cover */}
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: stage === "cover-opening" ? -110 : 0 }}
                transition={{ duration: 1.8, ease: [0.33, 1, 0.68, 1] }}
                style={{ transformOrigin: "left center", willChange: "transform" }}
                className="w-1/2 h-full overflow-hidden relative shadow-2xl"
              >
                <img
                  src={COVER_IMAGE}
                  alt="Marauder's Map Cover Left"
                  loading="eager"
                  decoding="async"
                  className="absolute top-0 left-0 h-full w-[200%] max-w-none object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-black/40"
                />
              </motion.div>

              {/* Right Flap of Cover */}
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: stage === "cover-opening" ? 110 : 0 }}
                transition={{ duration: 1.8, ease: [0.33, 1, 0.68, 1] }}
                style={{ transformOrigin: "right center", willChange: "transform" }}
                className="w-1/2 h-full overflow-hidden relative shadow-2xl"
              >
                <img
                  src={COVER_IMAGE}
                  alt="Marauder's Map Cover Right"
                  loading="eager"
                  decoding="async"
                  className="absolute top-0 right-0 h-full w-[200%] max-w-none object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gold/10 to-black/40"
                />
              </motion.div>

              {/* Light Sweep & Magical Energy Burst during opening */}
              {stage === "cover-opening" && (
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 2] }}
                  transition={{ duration: 1.6 }}
                  className="absolute inset-0 z-30 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(255,235,160,0.9) 0%, rgba(201,168,92,0.5) 45%, transparent 75%)",
                  }}
                />
              )}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-6 font-display text-xs sm:text-sm tracking-[0.3em] uppercase text-gold/70 text-center"
            >
              {stage === "cover-static"
                ? "Messrs. Moony, Wormtail, Padfoot & Prongs..."
                : "✨ Opening the Marauder's Map..."}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. REVEAL THE INTERACTIVE MARAUDER'S MAP SCREEN */}
      {stage === "interactive-map" && (
        <main className="relative z-20 flex flex-col items-center justify-center w-full max-w-5xl mx-auto my-auto">
          {/* Inner Map Parchment Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: [1, 1.003, 1], y: [0, -3, 0] }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            }}
            className="relative w-full max-w-lg sm:max-w-2xl md:max-w-3xl rounded-xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(201,168,92,0.25)] border-2 border-[#8b6f3a]/50 parchment-bg"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Soft Edge Glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-30 rounded-xl shadow-[inset_0_0_35px_rgba(201,168,92,0.4),0_0_25px_rgba(122,31,43,0.35)]"
            />

            {/* Inner Map Image Canvas */}
            <div className="relative w-full flex items-center justify-center p-2 sm:p-4 bg-[#ebdcc1]">
              <img
                src={INNER_MAP_IMAGE}
                alt="Interactive Marauder's Map"
                loading="eager"
                decoding="async"
                className="w-full h-auto object-contain rounded drop-shadow-md max-h-[68vh] contrast-[1.05] brightness-[1.0] sepia-[0.05]"
              />

              {/* 5. SVG ENCHANTED MOVING PATHS & FOOTPRINTS */}
              <svg
                className="absolute inset-0 h-full w-full pointer-events-none z-15"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="0.6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Path 1: Great Hall -> Kitchens */}
                <path
                  d="M 28 56 Q 36 68 48 74"
                  fill="none"
                  stroke="#7a1f2b"
                  strokeWidth="0.5"
                  strokeDasharray="1.2 1.8"
                  filter="url(#gold-glow)"
                  className="opacity-75"
                />

                {/* Path 2: Kitchens -> Clock Tower */}
                <path
                  d="M 48 74 Q 58 64 64 48"
                  fill="none"
                  stroke="#7a1f2b"
                  strokeWidth="0.5"
                  strokeDasharray="1.2 1.8"
                  filter="url(#gold-glow)"
                  className="opacity-75"
                />

                {/* Path 3: Clock Tower -> Gryffindor Tower */}
                <path
                  d="M 64 48 Q 45 32 27 22"
                  fill="none"
                  stroke="#7a1f2b"
                  strokeWidth="0.5"
                  strokeDasharray="1.2 1.8"
                  filter="url(#gold-glow)"
                  className="opacity-75"
                />

                {/* Path 4: Gryffindor Tower -> Astronomy Tower */}
                <path
                  d="M 27 22 Q 50 16 76 24"
                  fill="none"
                  stroke="#7a1f2b"
                  strokeWidth="0.5"
                  strokeDasharray="1.2 1.8"
                  filter="url(#gold-glow)"
                  className="opacity-75"
                />
              </svg>

              {/* Animated Footprint Trails stepping along paths */}
              <div className="absolute inset-0 pointer-events-none z-20">
                {FOOTPRINT_PATH_STEPS.map((path, pathIdx) =>
                  path.map((pt, stepIdx) => {
                    const globalStep = (pathIdx * 4 + stepIdx) % 16;
                    const isVisible = walkingStep >= globalStep && walkingStep < globalStep + 3;
                    return (
                      <div
                        key={`${pathIdx}-${stepIdx}`}
                        className="absolute transition-opacity duration-700"
                        style={{
                          left: `${pt.x}%`,
                          top: `${pt.y}%`,
                          transform: `translate(-50%, -50%) rotate(${pt.angle}deg)`,
                          opacity: isVisible ? 0.85 : 0,
                          willChange: "opacity",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          className="fill-[#4a121a] drop-shadow-[0_0_4px_rgba(201,168,92,0.8)]"
                        >
                          <g transform={stepIdx % 2 === 0 ? "translate(-2, 0)" : "translate(4, -4)"}>
                            <ellipse cx="12" cy="14" rx="3.5" ry="5.5" />
                            <ellipse cx="12" cy="6" rx="1.8" ry="1.6" />
                            <ellipse cx="8.5" cy="7" rx="0.9" ry="0.9" />
                            <ellipse cx="15.5" cy="7" rx="0.9" ry="0.9" />
                          </g>
                        </svg>
                      </div>
                    );
                  })
                )}
              </div>

              {/* 6. MAGICAL PLACEHOLDER EMOJI MARKERS */}
              <div className="absolute inset-0 z-30">
                {MEMORY_LOCATIONS.map((loc) => {
                  const isHovered = hoveredMemoryId === loc.id;
                  const isOpened = openedMemoryIds.has(loc.id);
                  return (
                    <div
                      key={loc.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                      onMouseEnter={() => setHoveredMemoryId(loc.id)}
                      onMouseLeave={() => setHoveredMemoryId(null)}
                      onClick={() => handleMarkerClick(loc)}
                    >
                      {/* Multi-layered Soft Outer Pulse Rings */}
                      <motion.span
                        className="absolute -inset-3 sm:-inset-4 rounded-full bg-gold/40 pointer-events-none"
                        animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.span
                        className="absolute -inset-1.5 sm:-inset-2 rounded-full bg-[#7a1f2b]/40 pointer-events-none"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      />

                      {/* Glowing Circular Marker Button with Emoji Placeholder Icon */}
                      <motion.button
                        whileHover={{
                          scale: 1.25,
                          boxShadow: "0 0 35px rgba(201, 168, 92, 0.95), 0 0 20px rgba(122, 31, 43, 0.9)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full border-3 ${
                          isOpened ? "border-amber-300 bg-gradient-to-br from-[#8a2f3b] via-[#6a1520] to-[#4a0d14]" : "border-gold bg-gradient-to-br from-[#7a1f2b] via-[#5a1520] to-[#3a0d14]"
                        } text-gold shadow-[0_0_24px_rgba(201,168,92,0.9),0_0_12px_rgba(122,31,43,0.95)] backdrop-blur-md cursor-pointer overflow-hidden`}
                        aria-label={`Open memory: ${loc.title}`}
                      >
                        <span className="text-xl sm:text-2xl md:text-3xl drop-shadow-[0_0_10px_rgba(201,168,92,0.9)]">
                          {loc.symbol}
                        </span>

                        {/* Opened Checkmark Badge */}
                        {isOpened && (
                          <span className="absolute bottom-1 right-1 text-[10px] sm:text-xs text-amber-200 bg-[#7a1f2b] rounded-full px-1 border border-gold/60">
                            ✓
                          </span>
                        )}

                        {/* Magical Dashed Orbit Border */}
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border border-gold/40 border-dashed pointer-events-none"
                        />

                        {/* Hover Sparkle Icon */}
                        {isHovered && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.4 }}
                            animate={{ opacity: 1, scale: 1.4 }}
                            className="absolute -top-1.5 -right-1.5 text-sm sm:text-base drop-shadow-[0_0_10px_rgba(255,223,130,1)] z-10"
                          >
                            ✨
                          </motion.span>
                        )}
                      </motion.button>

                      {/* Hover Tooltip Label */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.9 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 rounded-xl border border-gold/60 bg-[#120a0d]/95 backdrop-blur-md text-center whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_15px_rgba(201,168,92,0.4)] z-40"
                          >
                            <p className="font-display text-xs sm:text-sm text-gold font-semibold tracking-wider">
                              {loc.title}
                            </p>
                            <span className="font-body text-[11px] text-amber-200/90 italic">
                              📍 {loc.landmark} {isOpened ? "(Discovered)" : ""}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* USER HINT NOTIFICATION */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0.75, 1, 0.75], y: 0 }}
            transition={{
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 0.8 },
            }}
            className="mt-4 flex items-center gap-2 font-display text-xs sm:text-sm tracking-wider text-gold drop-shadow-[0_0_12px_rgba(201,168,92,0.6)] uppercase text-center px-4 z-30"
          >
            <span>🪄</span>
            <span>
              {remainingCount > 0
                ? `Tap a magical marker to reveal its secret (${openedMemoryIds.size}/5 discovered)`
                : "All 5 memories discovered! The final chapter is now unlocked ✨"}
            </span>
            <span>✨</span>
          </motion.div>

          {/* INTRO TEXT SECTION */}
          <motion.header
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 flex flex-col items-center text-center px-4 z-30"
          >
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-gold tracking-widest drop-shadow-[0_0_20px_rgba(201,168,92,0.7)]">
              The Marauder's Map
            </h1>
            <div className="my-2 h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            <p className="font-body text-lg sm:text-xl italic text-amber-100/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-xl">
              &ldquo;Every memory leaves behind a magical trail...&rdquo;
            </p>
          </motion.header>

          {/* FINAL CHAPTER CTA BUTTON (UNLOCKED ONLY WHEN ALL 5 MEMORIES ARE REVEALED) */}
          <div className="min-h-[70px] flex items-center justify-center mt-6 z-30">
            <AnimatePresence>
              {showNextButton && (
                <motion.div
                  key="next-chapter-btn"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.button
                    whileHover={{
                      scale: 1.06,
                      boxShadow: "0 0 40px rgba(201, 168, 92, 0.85), 0 0 20px rgba(122, 31, 43, 0.7)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextChapter}
                    className="group relative inline-flex items-center gap-3 rounded-full border-2 border-gold/80 bg-gradient-to-r from-[#7a1f2b] via-[#5a1520] to-[#7a1f2b] px-8 py-3.5 sm:px-10 sm:py-4 font-display text-base sm:text-lg font-medium text-gold shadow-[0_0_30px_rgba(201,168,92,0.45)] backdrop-blur-md cursor-pointer"
                  >
                    <span className="relative z-10 tracking-wide font-semibold text-glow-gold">
                      ✨ Reveal the Final Chapter
                    </span>
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/30 via-transparent to-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      )}

      {/* EXPANDED PREVIEW MODAL */}
      <MemoryModal memory={selectedMemory} onClose={handleCloseModal} />
    </div>
  );
}
