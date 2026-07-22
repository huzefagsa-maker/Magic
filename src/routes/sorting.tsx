import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { MagicalWarningScreen } from "@/components/sorting/MagicalWarningScreen";
import { MemoryQuiz } from "@/components/sorting/MemoryQuiz";
import { SortingCeremony } from "@/components/sorting/SortingCeremony";
import { PensieveMemories } from "@/components/sorting/PensieveMemories";
import { siteContent } from "@/content/siteContent";

export const Route = createFileRoute("/sorting")({
  head: () => ({
    meta: [
      { title: "The Sorting — A Birthday for Umema" },
      { name: "description", content: "The Sorting Hat's actual test." },
    ],
  }),
  component: SortingHatPage,
});

type SortingPhase = "warning" | "quiz" | "ceremony" | "memories";

function SortingHatPage() {
  const c = siteContent.sorting;
  const [phase, setPhase] = useState<SortingPhase>("warning");

  return (
    <AnimatePresence mode="wait">
      {phase === "warning" && (
        <MagicalWarningScreen
          key="warning"
          title={c.warning.title}
          body={c.warning.body}
          cta={c.warning.cta}
          onBegin={() => setPhase("quiz")}
        />
      )}

      {phase === "quiz" && (
        <MemoryQuiz
          key="quiz"
          title={c.quizIntro.title}
          subtitle={c.quizIntro.subtitle}
          questions={c.questions}
          onComplete={() => setPhase("ceremony")}
        />
      )}

      {phase === "ceremony" && (
        <SortingCeremony
          key="ceremony"
          onComplete={() => setPhase("memories")}
        />
      )}

      {phase === "memories" && <PensieveMemories key="memories" />}
    </AnimatePresence>
  );
}
