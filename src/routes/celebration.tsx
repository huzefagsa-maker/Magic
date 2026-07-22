import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ScrollIndicator } from "@/components/layout/ScrollIndicator";
import confetti from "canvas-confetti";
import { siteContent } from "@/content/siteContent";

export const Route = createFileRoute("/celebration")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Umema" },
      { name: "description", content: "Catch the snitch." },
    ],
  }),
  component: CelebrationPage,
});

function CelebrationPage() {
  const c = siteContent.celebration;
  const [caught, setCaught] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-12">
      {!caught ? (
        <>
          <div className="mt-16 text-center">
            <p className="font-display text-xs uppercase tracking-[0.4em] text-gold/60">
              {c.catchHint}
            </p>
          </div>
          <Snitch onCatch={() => setCaught(true)} />
        </>
      ) : (
        <FinalMessage headline={c.headline} message={c.message} replayCta={c.replayCta} />
      )}
      <ScrollIndicator watchKey={caught ? "celebration-done" : "celebration-snitch"} />
    </main>
  );
}

function Snitch({ onCatch }: { onCatch: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const pos = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 300,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 300,
    vx: 3,
    vy: 2,
  });
  const [, force] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      pos.current.vx += (Math.random() - 0.5) * 0.6;
      pos.current.vy += (Math.random() - 0.5) * 0.6;
      // clamp speed
      const speed = Math.hypot(pos.current.vx, pos.current.vy);
      const max = 5;
      if (speed > max) {
        pos.current.vx = (pos.current.vx / speed) * max;
        pos.current.vy = (pos.current.vy / speed) * max;
      }
      pos.current.x += pos.current.vx;
      pos.current.y += pos.current.vy;
      const pad = 60;
      if (pos.current.x < pad || pos.current.x > w - pad) pos.current.vx *= -1;
      if (pos.current.y < pad + 80 || pos.current.y > h - pad) pos.current.vy *= -1;
      pos.current.x = Math.max(pad, Math.min(w - pad, pos.current.x));
      pos.current.y = Math.max(pad + 80, Math.min(h - pad, pos.current.y));
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x - 30}px, ${pos.current.y - 30}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onResize = () => force((n) => n + 1);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleCatch = () => {
    confetti({
      particleCount: 180,
      spread: 90,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#c9a85c", "#7a1f2b", "#f0e6d2", "#1b4332"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 120,
        origin: { x: 0.2, y: 0.6 },
        colors: ["#c9a85c", "#7a1f2b"],
      });
      confetti({
        particleCount: 120,
        spread: 120,
        origin: { x: 0.8, y: 0.6 },
        colors: ["#c9a85c", "#f0e6d2"],
      });
    }, 200);
    onCatch();
  };

  return (
    <button
      ref={ref}
      onClick={handleCatch}
      aria-label="Catch the snitch"
      className="fixed left-0 top-0 z-30 cursor-crosshair"
      style={{ transform: "translate3d(-100px,-100px,0)" }}
    >
      <SnitchSvg />
    </button>
  );
}

function SnitchSvg() {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 -z-10 blur-xl"
        style={{ background: "radial-gradient(circle, rgba(201,168,92,0.6), transparent 70%)" }}
      />
      <svg width="60" height="60" viewBox="0 0 60 60" className="drop-shadow-[0_0_10px_rgba(201,168,92,0.8)]">
        <defs>
          <radialGradient id="ballGrad" cx="0.35" cy="0.35">
            <stop offset="0%" stopColor="#f7e7b0" />
            <stop offset="60%" stopColor="#c9a85c" />
            <stop offset="100%" stopColor="#7a5a20" />
          </radialGradient>
        </defs>
        {/* Left wing */}
        <motion.g
          animate={{ scaleX: [1, 0.3, 1] }}
          transition={{ duration: 0.15, repeat: Infinity }}
          style={{ transformOrigin: "30px 30px" }}
        >
          <path
            d="M30 30 Q10 18 2 26 Q6 32 12 32 Q4 36 6 42 Q16 40 30 30 Z"
            fill="#f0e6d2"
            opacity="0.85"
            stroke="#c9a85c"
            strokeWidth="0.5"
          />
        </motion.g>
        {/* Right wing */}
        <motion.g
          animate={{ scaleX: [1, 0.3, 1] }}
          transition={{ duration: 0.15, repeat: Infinity, delay: 0.05 }}
          style={{ transformOrigin: "30px 30px" }}
        >
          <path
            d="M30 30 Q50 18 58 26 Q54 32 48 32 Q56 36 54 42 Q44 40 30 30 Z"
            fill="#f0e6d2"
            opacity="0.85"
            stroke="#c9a85c"
            strokeWidth="0.5"
          />
        </motion.g>
        {/* Body */}
        <circle cx="30" cy="30" r="12" fill="url(#ballGrad)" stroke="#7a5a20" strokeWidth="0.6" />
        <path d="M18 30 Q30 26 42 30" stroke="#7a5a20" strokeWidth="0.6" fill="none" />
      </svg>
    </div>
  );
}

function FinalMessage({
  headline,
  message,
  replayCta,
}: {
  headline: string;
  message: string;
  replayCta: string;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center text-center"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <SnitchSvg />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-display text-5xl leading-tight text-gold text-glow-gold sm:text-7xl"
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 max-w-md text-lg leading-relaxed text-parchment/90 sm:text-xl"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="mt-14"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 border border-gold/40 px-6 py-2 font-display text-xs uppercase tracking-[0.3em] text-gold/80 transition-colors hover:border-gold hover:text-gold"
          >
            ↺ {replayCta}
          </Link>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
