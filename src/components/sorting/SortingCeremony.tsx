import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useExperience } from "@/context/ExperienceContext";

const AUDIO_SRC = "/media/sortinghat.mp3";

type DialogueItem = {
  id: number;
  startTime: number;
  text: string;
  type: "hat" | "house" | "twist";
};

const CEREMONY_DIALOGUE: DialogueItem[] = [
  { id: 0, startTime: 2.0, text: "Hmm... difficult. Very difficult.", type: "hat" },
  { id: 1, startTime: 9.2, text: "Plenty of courage here, I see.", type: "hat" },
  { id: 2, startTime: 13.4, text: "Sharp mind too...", type: "hat" },
  { id: 3, startTime: 16.5, text: "Always insists she's Hermione...", type: "hat" },
  { id: 4, startTime: 22.0, text: "But wait...", type: "hat" },
  { id: 5, startTime: 29.3, text: "A new number...", type: "hat" },
  { id: 6, startTime: 32.4, text: "A fake name within the hour...", type: "hat" },
  { id: 7, startTime: 38.8, text: "Insults before introductions were even finished...", type: "hat" },
  { id: 8, startTime: 42.0, text: "Difficult...", type: "hat" },
  { id: 9, startTime: 44.4, text: "Very difficult indeed...", type: "hat" },
  { id: 10, startTime: 49.0, text: "Better be...", type: "hat" },
  { id: 11, startTime: 51.3, text: "GRYFFINDOR!", type: "house" },
  { id: 12, startTime: 54.5, text: "...officially, at least.", type: "twist" },
  { id: 13, startTime: 56.5, text: "Unofficially? Exhibit A for Slytherin.", type: "twist" },
];

const DUST_PARTICLES = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  x: (i * 17 + 7) % 100,
  y: (i * 23 + 11) % 100,
  size: (i % 3) + 1.5,
  delay: (i * 0.4) % 3,
}));

export function SortingCeremony({ onComplete }: { onComplete?: () => void }) {
  const { duckBgm, restoreBgm } = useExperience();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const hasDuckedRef = useRef(false);
  const hasRestoredRef = useRef(false);
  const hasCompletedRef = useRef(false);

  // Sync audio progress continuously & handle background music ducking & completion
  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current) {
        const time = audioRef.current.currentTime;
        const ended = audioRef.current.ended;
        setCurrentTime(time);
        setIsPlaying(!audioRef.current.paused && !ended);

        // Smoothly duck BGM to 20% over 1.5s when voiceover starts
        if (time > 0.3 && !hasDuckedRef.current) {
          hasDuckedRef.current = true;
          duckBgm(0.2, 1500);
        }

        // Smoothly restore BGM to normalized reference level when voiceover finishes
        if ((time >= 58.5 || ended) && !hasRestoredRef.current) {
          hasRestoredRef.current = true;
          restoreBgm(1500);
        }

        // Trigger onComplete to transition to memories phase
        if ((time >= 58.8 || ended) && !hasCompletedRef.current) {
          hasCompletedRef.current = true;
          if (onComplete) {
            onComplete();
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(updateTime);
    };

    animFrameRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      restoreBgm(1000);
    };
  }, [duckBgm, restoreBgm, onComplete]);

  // Auto-play audio on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, []);

  const handleUserClick = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    }
  };

  // Find active dialogue item based on current audio time
  const currentDialogueIndex = CEREMONY_DIALOGUE.reduce((acc, item, index) => {
    if (currentTime >= item.startTime) return index;
    return acc;
  }, -1);

  const activeItem = currentDialogueIndex >= 0 ? CEREMONY_DIALOGUE[currentDialogueIndex] : null;

  const isHouseRevealed = currentTime >= 51.3;
  const showTwistLine1 = currentTime >= 54.5;
  const showTwistLine2 = currentTime >= 56.5;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleUserClick}
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 select-none"
    >
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />

      {/* Ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{
          background: isHouseRevealed
            ? "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,92,0.25), rgba(122,31,43,0.18) 60%, transparent 85%)"
            : "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(201,168,92,0.14), transparent 65%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(122,31,43,0.12), transparent 60%)",
        }}
      />

      {/* Floating Dust Particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {DUST_PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-gold/60"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: isHouseRevealed ? p.size * 1.5 : p.size,
              height: isHouseRevealed ? p.size * 1.5 : p.size,
              boxShadow: `0 0 ${p.size * 4}px rgba(201,168,92,0.8)`,
            }}
            animate={{
              y: [0, isHouseRevealed ? -30 : -16, 0],
              opacity: isHouseRevealed ? [0.4, 0.95, 0.4] : [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: isHouseRevealed ? 2.5 + (p.delay % 2) : 4 + (p.delay % 2),
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Glassmorphism Ceremonial Card */}
      <article className="relative w-full max-w-2xl">
        <div
          aria-hidden
          className="absolute -inset-4 -z-10 rounded-3xl blur-3xl opacity-60 transition-all duration-1000"
          style={{
            background: isHouseRevealed
              ? "radial-gradient(ellipse at 50% 40%, rgba(201,168,92,0.35), rgba(122,31,43,0.3) 50%, transparent 75%)"
              : "radial-gradient(ellipse at 50% 30%, rgba(201,168,92,0.22), transparent 70%)",
          }}
        />

        <div className="relative rounded-3xl border border-gold/30 bg-[#0d070b]/45 backdrop-blur-xl px-6 py-12 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(201,168,92,0.15)] sm:px-10 sm:py-16 text-center border-t-gold/50">
          {/* Real Sorting Hat Asset */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="mb-6 flex justify-center"
          >
            <div aria-hidden className="relative flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.75, 0.35] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 rounded-full bg-gold/25 blur-xl"
              />
              <img
                src="/media/sorting-hat.png"
                alt="The Sorting Hat"
                className="relative h-28 w-auto max-w-[140px] object-contain drop-shadow-[0_0_18px_rgba(201,168,92,0.45)] sm:h-36 sm:max-w-[180px]"
              />
            </div>
          </motion.div>

          <header className="mb-8">
            <h1 className="font-display text-sm uppercase tracking-[0.35em] text-gold/75 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-base">
              The Sorting Ceremony
            </h1>
            <div className="mx-auto mt-3 h-px w-20 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          </header>

          {/* Dialogue Section */}
          <div className="min-h-[160px] sm:min-h-[180px] flex flex-col items-center justify-center px-2">
            {!isHouseRevealed ? (
              <AnimatePresence mode="wait">
                {activeItem && activeItem.type === "hat" && (
                  <motion.div
                    key={activeItem.id}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-3"
                  >
                    <p className="font-display text-lg sm:text-xl md:text-2xl italic leading-relaxed text-amber-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] text-shadow-[0_0_15px_rgba(201,168,92,0.3)]">
                      &ldquo;{activeItem.text}&rdquo;
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              /* Majestic House Reveal with Real Gryffindor Crest */
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.4, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.175, 0.885, 0.32, 1.275],
                  }}
                  className="relative flex flex-col items-center justify-center space-y-4"
                >
                  <div aria-hidden className="relative flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.95, 0.55] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -inset-6 rounded-full bg-gold/30 blur-2xl"
                    />
                    <img
                      src="/media/gryffindor-crest.png"
                      alt="Gryffindor Crest"
                      className="relative h-32 w-auto max-w-[160px] object-contain drop-shadow-[0_0_25px_rgba(201,168,92,0.65)] sm:h-44 sm:max-w-[220px]"
                    />
                  </div>

                  <h2 className="font-display text-3xl font-extrabold tracking-widest text-gold sm:text-5xl md:text-6xl drop-shadow-[0_0_35px_rgba(201,168,92,0.9),0_0_70px_rgba(201,168,92,0.6)]">
                    GRYFFINDOR!
                  </h2>
                </motion.div>

                {/* Twist Lines */}
                {showTwistLine1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="font-body text-base italic text-amber-100/90 sm:text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                  >
                    &ldquo;...officially, at least.&rdquo;
                  </motion.p>
                )}

                {showTwistLine2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="font-body text-base italic text-amber-200/95 sm:text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                  >
                    &ldquo;Unofficially? Exhibit A for Slytherin.&rdquo;
                  </motion.p>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </motion.section>
  );
}
