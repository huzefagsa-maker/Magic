import { motion } from "motion/react";
import { memo, useEffect, useMemo, useState } from "react";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
}

export const ParticleBackground = memo(function ParticleBackground({
  variant = "ember",
}: {
  variant?: "ember" | "dust";
}) {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const particles = useMemo<Particle[]>(() => {
    const count = 45;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 12,
      delay: Math.random() * -20,
      drift: (Math.random() - 0.5) * 40,
      color:
        variant === "ember"
          ? Math.random() > 0.5
            ? "rgba(201,168,92,0.8)"
            : "rgba(201,120,60,0.6)"
          : "rgba(240,230,210,0.5)",
    }));
  }, [variant]);

  if (isPaused) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: variant === "ember" ? `0 0 ${p.size * 3}px ${p.color}` : undefined,
            willChange: "transform, opacity",
          }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.9, 0.9, 0],
            x: [0, p.drift, -p.drift, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
});
