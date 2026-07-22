import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof Link>;

export function ContinueButton(props: LinkProps & { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      <Link
        {...props}
        className="group relative inline-flex items-center gap-3 border border-gold/60 bg-transparent px-8 py-3 font-display text-sm uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-ink"
      >
        <span className="absolute inset-0 -z-10 opacity-0 blur-xl transition-opacity group-hover:opacity-60" style={{ background: "radial-gradient(circle, rgba(201,168,92,0.6), transparent 70%)" }} />
        {props.children}
        <span aria-hidden>→</span>
      </Link>
    </motion.div>
  );
}
