import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, memo } from "react";

export interface MemoryItem {
  id: string;
  photo: string;
  landmark: string;
  title: string;
  caption: string;
  oneWord: string;
  symbol: string;
  x: number;
  y: number;
}

interface MemoryModalProps {
  memory: MemoryItem | null;
  onClose: () => void;
}

export const MemoryModal = memo(function MemoryModal({ memory, onClose }: MemoryModalProps) {
  const [isImageRevealed, setIsImageRevealed] = useState(false);

  useEffect(() => {
    if (!memory) {
      setIsImageRevealed(false);
      return;
    }
    setIsImageRevealed(false);
    const timer = setTimeout(() => {
      setIsImageRevealed(true);
    }, 750);
    return () => clearTimeout(timer);
  }, [memory]);

  if (!memory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4 py-6"
      >
        <motion.div
          initial={{ scale: 0.75, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 24, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="parchment-bg relative w-full max-w-xl sm:max-w-2xl md:max-w-3xl rounded-2xl p-6 sm:p-10 border-2 border-gold/60 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(201,168,92,0.35)] text-center text-[#2a1810]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-maroon/20 hover:bg-maroon/40 text-maroon font-display text-xl transition-colors cursor-pointer shadow-md"
            aria-label="Close memory modal"
          >
            ×
          </button>

          {/* One Word Badge */}
          <div className="mb-2 inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#7a1f2b] text-gold font-display text-sm sm:text-base font-semibold shadow-md tracking-wider">
            {memory.oneWord}
          </div>

          <span className="block font-display text-xs sm:text-sm uppercase tracking-widest text-maroon/80 font-bold mt-1">
            📍 {memory.landmark}
          </span>

          <h3 className="mt-1 font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-maroon drop-shadow-sm">
            {memory.title}
          </h3>

          <div className="mx-auto my-3 h-px w-28 bg-gradient-to-r from-transparent via-maroon/50 to-transparent" />

          {/* PHOTO CONTAINER: Preserves complete image (object-fit: contain) with magical reveal burst */}
          <div className="relative w-full min-h-[220px] max-h-[52vh] my-4 rounded-2xl border-2 border-gold/70 shadow-2xl overflow-hidden flex items-center justify-center p-3 bg-[#120a0d]">
            {/* Soft Parchment Blurred Background derived from the photo */}
            <img
              src={memory.photo}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
            />

            {/* Golden Sparkles & Magic Dust Burst Layer during reveal */}
            <AnimatePresence>
              {!isImageRevealed && (
                <motion.div
                  key="magic-burst"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#170e11]/90 backdrop-blur-sm p-4 text-center"
                >
                  {/* Expanding Light Aura */}
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0.9 }}
                    animate={{ scale: [0.4, 1.8, 2.2], opacity: [0.9, 0.4, 0] }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-gold via-amber-300 to-gold shadow-[0_0_50px_rgba(255,223,130,0.9)]"
                  />

                  {/* Bursting Gold Sparkles */}
                  <div className="relative z-10 flex items-center gap-2 text-xl sm:text-2xl text-gold">
                    <motion.span animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 180] }} transition={{ duration: 0.8 }}>✨</motion.span>
                    <span className="font-display text-xs sm:text-sm tracking-widest uppercase text-glow-gold font-semibold">Revealing Secret Memory</span>
                    <motion.span animate={{ scale: [1, 1.5, 1], rotate: [0, -90, -180] }} transition={{ duration: 0.8 }}>✨</motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Photograph: Preserves complete image with object-fit contain, zero cropping */}
            <motion.img
              src={memory.photo}
              alt={memory.title}
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{
                opacity: isImageRevealed ? 1 : 0,
                scale: isImageRevealed ? 1 : 0.96,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 max-h-[48vh] w-auto max-w-full object-contain rounded-xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)] border border-gold/40"
            />
          </div>

          <p className="font-body text-base sm:text-lg md:text-xl leading-relaxed text-[#2a1810]/95 italic max-w-xl mx-auto">
            &ldquo;{memory.caption}&rdquo;
          </p>

          <button
            onClick={onClose}
            className="mt-6 inline-flex items-center px-8 py-2.5 rounded-full bg-maroon text-parchment font-display text-sm sm:text-base tracking-wider uppercase hover:bg-maroon/90 transition-colors cursor-pointer shadow-lg font-semibold"
          >
            Close Memory
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});
