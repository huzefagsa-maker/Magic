import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ScrollIndicator } from "@/components/layout/ScrollIndicator";
import { siteContent } from "@/content/siteContent";
import { ContinueButton } from "@/components/ui/ContinueButton";

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: "Platform 9¾ — A Birthday for Umema" },
      { name: "description", content: "Run at the wall. Trust me." },
    ],
  }),
  component: PlatformPage,
});

function PlatformPage() {
  const c = siteContent.platform;
  const [through, setThrough] = useState(false);
  const [flashing, setFlashing] = useState(false);

  const runThrough = () => {
    setFlashing(true);
    setTimeout(() => {
      setThrough(true);
      setFlashing(false);
    }, 700);
  };

  return (
    <main className="relative min-h-screen">
      <AnimatePresence>
        {flashing && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(30px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 z-40 bg-parchment/90"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!through ? (
          <motion.button
            key="wall"
            onClick={runThrough}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="brick-wall flex min-h-screen w-full cursor-pointer flex-col items-center justify-center px-6 py-12"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-sm border border-gold/40 bg-ink/70 px-8 py-6 backdrop-blur-sm"
            >
              <p className="font-display text-lg leading-snug text-parchment sm:text-xl">
                {c.wallPrompt}
              </p>
              <p className="mt-3 font-display text-xs uppercase tracking-[0.4em] text-gold/60">
                {c.wallHint}
              </p>
            </motion.div>
          </motion.button>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mx-auto flex min-h-screen max-w-2xl flex-col items-center px-4 py-16"
          >
            <motion.article
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top" }}
              className="parchment-bg relative w-full px-8 py-14 shadow-2xl sm:px-16 sm:py-20"
            >
              <div className="space-y-6 font-body text-lg leading-[1.9] text-[#2a1810] sm:text-xl">
                <p className="first-line:font-display first-line:tracking-wide">
                  <span className="float-left mr-3 mt-1 font-display text-6xl leading-none text-gold sm:text-7xl" style={{ textShadow: "1px 1px 0 rgba(122,31,43,0.3)" }}>
                    {c.letter.dropCap}
                  </span>
                  {c.letter.firstLine}
                </p>
                {c.letter.paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + i * 0.4 }}
                  >
                    {p}
                  </motion.p>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3 }}
                  className="pt-6"
                >
                  <p className="italic">{c.letter.signoff}</p>
                  <p className="mt-2 font-display text-xl uppercase tracking-[0.3em] text-maroon">
                    {c.letter.signer}
                  </p>
                </motion.div>
              </div>
            </motion.article>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.6 }}
              className="mt-12"
            >
              <ContinueButton to="/celebration">{c.continueCta}</ContinueButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ScrollIndicator watchKey={through ? "platform-open" : "platform-wall"} />
    </main>
  );
}
