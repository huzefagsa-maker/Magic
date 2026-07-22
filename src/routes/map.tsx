import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ScrollIndicator } from "@/components/layout/ScrollIndicator";
import { siteContent } from "@/content/siteContent";
import { ContinueButton } from "@/components/ui/ContinueButton";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "The Marauder's Map — A Birthday for Umema" },
      { name: "description", content: "I solemnly swear that I am up to no good." },
    ],
  }),
  component: MapPage,
});

// hand-placed marker coords (percent of map)
const MARKERS = [
  { x: 18, y: 30 },
  { x: 42, y: 20 },
  { x: 68, y: 38 },
  { x: 30, y: 62 },
  { x: 78, y: 72 },
];

function MapPage() {
  const c = siteContent.map;
  const [unlocked, setUnlocked] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-4 py-12">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.button
            key="lock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            onClick={() => setUnlocked(true)}
            className="mt-24 flex flex-col items-center gap-4 text-center"
          >
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="max-w-md font-display text-xl italic leading-relaxed text-gold sm:text-2xl"
            >
              "{c.unlockPhrase}"
            </motion.p>
            <span className="font-display text-xs uppercase tracking-[0.4em] text-gold/50">
              {c.unlockHint}
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="parchment-bg relative aspect-[4/3] w-full overflow-hidden rounded-sm border-2 border-[#8b6f3a]/40 shadow-2xl">
              <MapDecor />

              {/* Dotted path connecting markers */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <motion.path
                  d={`M ${MARKERS[0]!.x} ${MARKERS[0]!.y} ${MARKERS.slice(1)
                    .map((m) => `L ${m.x} ${m.y}`)
                    .join(" ")}`}
                  fill="none"
                  stroke="#5a1520"
                  strokeWidth="0.4"
                  strokeDasharray="1 1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              </svg>

              {MARKERS.map((m, i) => (
                <Marker
                  key={i}
                  x={m.x}
                  y={m.y}
                  index={i}
                  onClick={() => setOpenIdx(i)}
                />
              ))}
            </div>

            <p className="mt-6 text-center font-display text-sm italic tracking-wide text-gold/70">
              Tap a footprint to see a memory
            </p>

            <div className="mt-10 flex justify-center">
              <ContinueButton to="/platform">{c.continueCta}</ContinueButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MemoryModal openIdx={openIdx} onClose={() => setOpenIdx(null)} />
      <ScrollIndicator watchKey={unlocked ? "map-open" : "map-locked"} />
    </main>
  );
}

function MapDecor() {
  return (
    <>
      {/* corner scrolls & compass */}
      <div className="absolute left-4 top-4 font-display text-[10px] uppercase tracking-widest text-[#5a1520]/60 sm:text-xs">
        Umema's Cartography
      </div>
      <div className="absolute right-4 top-4 font-display text-[10px] uppercase tracking-widest text-[#5a1520]/60 sm:text-xs">
        Est. Long Ago
      </div>
      <div className="absolute bottom-4 right-4">
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#5a1520]/60">
          <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M20 4 L23 20 L20 36 L17 20 Z" fill="currentColor" />
          <text x="20" y="14" textAnchor="middle" fontSize="6" fontFamily="Cinzel, serif" fill="currentColor">N</text>
        </svg>
      </div>
      {/* faux buildings */}
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <g stroke="#5a1520" strokeWidth="0.2" fill="none">
          <rect x="10" y="25" width="8" height="6" />
          <rect x="38" y="15" width="10" height="8" />
          <rect x="64" y="33" width="9" height="7" />
          <rect x="26" y="57" width="8" height="8" />
          <rect x="74" y="67" width="10" height="8" />
          <path d="M15 40 Q25 45 40 42 Q55 40 70 48" />
          <path d="M20 70 Q35 65 50 68 Q65 72 80 66" strokeDasharray="0.5 0.5" />
        </g>
      </svg>
    </>
  );
}

function Marker({ x, y, index, onClick }: { x: number; y: number; index: number; onClick: () => void }) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.3 + index * 0.15, type: "spring", stiffness: 200 }}
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={`Memory ${index + 1}`}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-maroon/40"
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
      />
      <svg width="28" height="28" viewBox="0 0 28 28" className="relative">
        {/* footprint */}
        <ellipse cx="14" cy="17" rx="6" ry="8" fill="#5a1520" />
        <ellipse cx="14" cy="7" rx="3" ry="2.5" fill="#5a1520" />
        <ellipse cx="9" cy="9" rx="1.5" ry="1.5" fill="#5a1520" />
        <ellipse cx="19" cy="9" rx="1.5" ry="1.5" fill="#5a1520" />
      </svg>
    </motion.button>
  );
}

function MemoryModal({ openIdx, onClose }: { openIdx: number | null; onClose: () => void }) {
  const loc = openIdx !== null ? siteContent.map.locations[openIdx] : null;
  return (
    <AnimatePresence>
      {loc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top" }}
            onClick={(e) => e.stopPropagation()}
            className="parchment-bg relative w-full max-w-md p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 font-display text-xl text-maroon/60 hover:text-maroon"
              aria-label="Close"
            >
              ×
            </button>
            {/* photo slot */}
            <div
              className="aspect-[4/3] w-full border border-[#8b6f3a]/40"
              style={{
                background:
                  "linear-gradient(135deg, #7a1f2b 0%, #c9a85c 50%, #1b4332 100%)",
              }}
            >
              <div className="flex h-full items-center justify-center font-display text-xs uppercase tracking-widest text-parchment/80">
                Photo goes here
              </div>
            </div>
            <h3 className="mt-5 font-display text-xl text-maroon">{loc.title}</h3>
            <p className="mt-2 font-body text-base leading-relaxed text-[#2a1810]">{loc.caption}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
