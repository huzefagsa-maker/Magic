import { motion } from "motion/react";
import { ScrollIndicator } from "@/components/layout/ScrollIndicator";

const DUST_PARTICLES = [
  { x: 8, y: 12, size: 2, delay: 0 },
  { x: 22, y: 28, size: 1.5, delay: 0.4 },
  { x: 38, y: 8, size: 2.5, delay: 0.8 },
  { x: 55, y: 35, size: 1.5, delay: 1.2 },
  { x: 72, y: 15, size: 2, delay: 0.2 },
  { x: 88, y: 42, size: 1.5, delay: 0.6 },
  { x: 15, y: 55, size: 2, delay: 1.0 },
  { x: 48, y: 62, size: 1.5, delay: 1.4 },
  { x: 65, y: 48, size: 2, delay: 0.3 },
  { x: 82, y: 70, size: 1.5, delay: 0.7 },
  { x: 30, y: 78, size: 2, delay: 1.1 },
  { x: 92, y: 22, size: 2, delay: 0.5 },
] as const;

type MagicalWarningScreenProps = {
  title: string;
  body: readonly string[];
  cta: string;
  onBegin: () => void;
};

export function MagicalWarningScreen({ title, body, cta, onBegin }: MagicalWarningScreenProps) {
  return (
    <motion.section
      key="warning"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-16 sm:px-6"
    >
      {/* Candlelight ambience */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(201,168,92,0.12), transparent 65%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(122,31,43,0.08), transparent 60%)",
        }}
      />

      {/* Floating golden dust — outside parchment */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {DUST_PARTICLES.map((p) => (
          <motion.span
            key={`${p.x}-${p.y}`}
            className="absolute rounded-full bg-gold/50"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              boxShadow: `0 0 ${p.size * 3}px rgba(201,168,92,0.6)`,
            }}
            animate={{
              y: [0, -14, 0],
              opacity: [0.25, 0.7, 0.25],
            }}
            transition={{
              duration: 4.5 + (p.delay % 2),
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Parchment page */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg"
      >
        <div
          aria-hidden
          className="absolute -inset-3 -z-10 blur-2xl opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(201,168,92,0.2), transparent 70%)",
          }}
        />

        <div className="parchment-bg relative border border-maroon/15 px-6 py-10 shadow-[0_20px_50px_rgba(0,0,0,0.45)] sm:px-10 sm:py-12">
          {/* Inner texture overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(at 20% 20%, rgba(122,31,43,0.06) 0, transparent 50%), radial-gradient(at 80% 80%, rgba(13,13,20,0.05) 0, transparent 50%)",
            }}
          />

          <div className="relative text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="font-display text-xl text-maroon text-glow-gold sm:text-2xl"
            >
              ⚠️ {title}
            </motion.h1>

            <div className="mx-auto mt-6 h-px w-16 bg-maroon/25" />

            <div className="mx-auto mt-8 max-w-md space-y-4">
              {body.map((paragraph, i) => (
                <motion.p
                  key={paragraph}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.22, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="font-body text-base leading-relaxed text-[#2a1810]/90 sm:text-lg"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-10 flex justify-center"
            >
              <motion.button
                type="button"
                onClick={onBegin}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative border border-gold/60 bg-[#f0e6d2]/80 px-8 py-3 font-display text-xs uppercase tracking-[0.3em] text-maroon shadow-[0_0_20px_rgba(201,168,92,0.15)] transition-colors hover:border-gold hover:bg-gold/20 hover:text-[#2a1810] sm:text-sm"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 opacity-0 blur-xl transition-opacity group-hover:opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(201,168,92,0.55), transparent 70%)",
                  }}
                />
                🪄 {cta}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.article>

      <ScrollIndicator watchKey="warning" label="↓ Continue the Journey" />
    </motion.section>
  );
}
