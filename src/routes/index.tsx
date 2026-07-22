import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, lazy, Suspense } from "react";
import { ScrollIndicator } from "@/components/layout/ScrollIndicator";
import { ContinueButton } from "@/components/ui/ContinueButton";
import { useExperience } from "@/context/ExperienceContext";
import { siteContent } from "@/content/siteContent";

const EnvelopeReveal = lazy(() =>
  import("@/components/landing/EnvelopeReveal").then((m) => ({ default: m.EnvelopeReveal }))
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Letter — A Birthday for Umema" },
      { name: "description", content: "You've been accepted. Open the envelope." },
      { property: "og:title", content: "The Letter — A Birthday for Umema" },
      { property: "og:description", content: "You've been accepted. Open the envelope." },
    ],
  }),
  component: Landing,
});

/** Delay after entering before the envelope appears (10–13 s range). */
const ENVELOPE_REVEAL_DELAY_MS = 11500;

function Landing() {
  const [opened, setOpened] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const { enteredAt } = useExperience();
  const c = siteContent.landing;

  useEffect(() => {
    if (!enteredAt) return;

    const elapsed = Date.now() - enteredAt;
    const remaining = Math.max(0, ENVELOPE_REVEAL_DELAY_MS - elapsed);
    const timer = window.setTimeout(() => setShowEnvelope(true), remaining);
    return () => window.clearTimeout(timer);
  }, [enteredAt]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <AnimatePresence mode="wait">
        {!opened ? (
          showEnvelope ? (
            <Suspense fallback={null}>
              <EnvelopeReveal key="envelope" onOpen={() => setOpened(true)} />
            </Suspense>
          ) : null
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-2xl"
          >
            <motion.article
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top" }}
              className="parchment-bg relative px-8 py-12 shadow-2xl sm:px-14 sm:py-16"
            >
              <div className="text-center">
                <p className="font-display text-xs uppercase tracking-[0.4em] text-maroon/70">
                  {c.envelopeTo}
                </p>
                <h1 className="mt-6 font-display text-2xl leading-tight text-maroon sm:text-3xl">
                  {c.letterHeader}
                </h1>
                <div className="mx-auto mt-4 h-px w-24 bg-maroon/40" />
              </div>

              <div className="mt-10 space-y-5 font-body text-lg leading-relaxed text-[#2a1810]">
                <p className="font-medium">{c.letterGreeting}</p>
                {c.letterBody.map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + i * 0.3 }}
                  >
                    {p}
                  </motion.p>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="pt-4"
                >
                  <p className="italic">{c.letterSignoff}</p>
                  <p className="mt-1 font-display text-base uppercase tracking-widest text-maroon">
                    {c.letterSigner}
                  </p>
                  <p className="mt-1 font-display text-base uppercase tracking-widest text-maroon">
                    {c.letterSignerName}
                  </p>
                </motion.div>
              </div>
            </motion.article>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              className="mt-10 flex justify-center"
            >
              <ContinueButton to="/sorting">{c.beginCta}</ContinueButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {opened && <ScrollIndicator watchKey="letter" />}
    </main>
  );
}
