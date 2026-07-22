import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const LABELS = [
  "↓ Continue the Journey",
  "↓ Scroll to Continue",
  "↓ More Awaits Below",
  "↓ Turn the Next Page",
] as const;

type ScrollIndicatorProps = {
  /** Re-evaluate when content changes (e.g. quiz phase) */
  watchKey?: string | number;
  /** Override rotating label */
  label?: string;
};

export function ScrollIndicator({ watchKey, label: labelOverride }: ScrollIndicatorProps) {
  const [visible, setVisible] = useState(false);
  const watchIndex = typeof watchKey === "number" ? watchKey : 0;
  const label = labelOverride ?? LABELS[watchIndex % LABELS.length]!;

  useEffect(() => {
    let userHasScrolled = false;

    const check = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled) {
        userHasScrolled = true;
        setVisible(false);
        return;
      }

      if (userHasScrolled) {
        setVisible(false);
        return;
      }

      const hasBelow =
        document.documentElement.scrollHeight > window.innerHeight + 30 ||
        window.innerHeight < 700;

      setVisible(hasBelow);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("touchmove", check, { passive: true });
    window.addEventListener("resize", check);
    const t = window.setTimeout(check, 300);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", check);
      window.removeEventListener("touchmove", check);
      window.removeEventListener("resize", check);
    };
  }, [watchKey]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2"
        >
          <motion.p
            animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="font-display text-[10px] uppercase tracking-[0.3em] text-gold/80 sm:text-xs drop-shadow-[0_0_10px_rgba(201,168,92,0.4)]"
          >
            {label}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
