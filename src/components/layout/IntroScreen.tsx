import { AnimatePresence, motion } from "motion/react";
import { useExperience } from "@/context/ExperienceContext";

export function IntroScreen() {
  const { hasEntered, enter } = useExperience();

  return (
    <AnimatePresence>
      {!hasEntered && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink px-6"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,92,0.18), transparent 70%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(122,31,43,0.12), transparent 60%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-w-md flex-col items-center text-center"
          >
            <div className="mt-10 space-y-4 font-body text-lg text-parchment/90 sm:text-xl">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                For the best experience, please enable sound.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.7 }}
                className="text-parchment/70"
              >
                Headphones recommended.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.7 }}
                className="hidden text-sm text-parchment/45 sm:block"
              >
                Best viewed on a laptop or desktop.
              </motion.p>
            </div>

            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => void enter()}
              className="group relative mt-14 border border-gold/60 bg-ink/60 px-10 py-4 font-display text-sm uppercase tracking-[0.35em] text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink"
            >
              <span
                aria-hidden
                className="absolute inset-0 -z-10 opacity-0 blur-2xl transition-opacity group-hover:opacity-70"
                style={{
                  background: "radial-gradient(circle, rgba(201,168,92,0.55), transparent 70%)",
                }}
              />
              ✨ Begin the Journey
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
