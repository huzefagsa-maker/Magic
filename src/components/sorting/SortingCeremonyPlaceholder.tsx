import { motion } from "motion/react";

/** Placeholder — full ceremony implemented in the next step. */
export function SortingCeremonyPlaceholder() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-[100dvh] w-full items-center justify-center"
      aria-hidden
    />
  );
}
