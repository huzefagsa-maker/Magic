import { motion } from "motion/react";
import { useMemo } from "react";
import { siteAssets } from "@/content/siteAssets";

interface ConvergenceParticle {
  id: number;
  startX: number;
  startY: number;
  size: number;
  delay: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  repeatDelay: number;
}

function useConvergenceParticles(count: number) {
  return useMemo<ConvergenceParticle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        startX: (Math.random() - 0.5) * 420,
        startY: (Math.random() - 0.5) * 320,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 0.4,
      })),
    [count],
  );
}

function useSparkles(count: number) {
  return useMemo<Sparkle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 280,
        y: (Math.random() - 0.5) * 200,
        size: Math.random() * 3 + 1,
        delay: 1.8 + Math.random() * 2,
        repeatDelay: 1.5 + Math.random() * 2,
      })),
    [count],
  );
}

type EnvelopeRevealProps = {
  onOpen: () => void;
};

export function EnvelopeReveal({ onOpen }: EnvelopeRevealProps) {
  const particles = useConvergenceParticles(48);
  const sparkles = useSparkles(16);
  const envelopeSrc = siteAssets.envelope;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, y: -40 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-8"
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-xs uppercase tracking-[0.5em] text-gold/60"
      >
        Tap the seal
      </motion.p>

      <button
        type="button"
        onClick={onOpen}
        aria-label="Open the letter"
        className="group relative cursor-pointer"
      >
        <div className="relative flex items-center justify-center">
          {/* Pre-materialization glow */}
          <motion.div
            aria-hidden
            className="absolute rounded-full blur-3xl"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: [0, 0.85, 0.55],
              scale: [0.4, 1.3, 1.05],
            }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: 360,
              height: 260,
              background:
                "radial-gradient(ellipse, rgba(201,168,92,0.45) 0%, rgba(201,120,60,0.15) 45%, transparent 70%)",
            }}
          />

          {/* Golden convergence particles */}
          {particles.map((p) => (
            <motion.span
              key={p.id}
              aria-hidden
              className="pointer-events-none absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: "rgba(201,168,92,0.9)",
                boxShadow: `0 0 ${p.size * 4}px rgba(201,168,92,0.8)`,
              }}
              initial={{ x: p.startX, y: p.startY, opacity: 0, scale: 0 }}
              animate={{
                x: [p.startX, p.startX * 0.15, 0],
                y: [p.startY, p.startY * 0.15, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0.2],
              }}
              transition={{
                duration: 2,
                delay: p.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}

          {/* Envelope with cinematic reveal + float */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.72, filter: "blur(12px)" }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              y: [0, -6, 0, 6, 0],
            }}
            transition={{
              opacity: { duration: 1.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 1.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] },
              filter: { duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 5, delay: 2.4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <motion.div
              aria-hidden
              className="absolute inset-0 -z-10 blur-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.4, duration: 1.2 }}
              style={{
                background:
                  "radial-gradient(circle, rgba(201,168,92,0.35), transparent 65%)",
              }}
            />

            <motion.img
              src={envelopeSrc}
              alt="Hogwarts invitation envelope"
              draggable={false}
              className="relative w-[min(88vw,400px)] drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)] transition-transform duration-500 group-hover:scale-[1.04]"
              initial={{ rotate: -2 }}
              animate={{ rotate: [-2, 1, -1, 0] }}
              transition={{
                duration: 2.4,
                delay: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </motion.div>

          {/* Ambient sparkles after reveal */}
          {sparkles.map((s) => (
            <motion.span
              key={s.id}
              aria-hidden
              className="pointer-events-none absolute rounded-full bg-gold/80"
              style={{
                width: s.size,
                height: s.size,
                left: "50%",
                top: "50%",
                marginLeft: s.x,
                marginTop: s.y,
                boxShadow: "0 0 6px rgba(201,168,92,0.9)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2.2,
                delay: s.delay,
                repeat: Infinity,
                repeatDelay: s.repeatDelay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Subtle parchment dust */}
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={`feather-${i}`}
              aria-hidden
              className="pointer-events-none absolute h-3 w-1 rounded-full bg-parchment/30"
              style={{
                left: "50%",
                top: "50%",
                rotate: 20 + i * 35,
              }}
              initial={{ x: -20 + i * 14, y: 40, opacity: 0 }}
              animate={{
                x: [-20 + i * 14, -20 + i * 14 + (i % 2 ? 18 : -18)],
                y: [40, -60 - i * 10],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 4 + i * 0.5,
                delay: 2.2 + i * 0.35,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </button>
    </motion.div>
  );
}
