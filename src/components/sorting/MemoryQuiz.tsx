import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollIndicator } from "@/components/layout/ScrollIndicator";
import {
  pickSortingResponse,
  sortingCorrectResponses,
  sortingIncorrectResponses,
} from "@/content/sortingResponses";

const DUST_PARTICLES = [
  { x: 10, y: 14, size: 2, delay: 0 },
  { x: 28, y: 32, size: 1.5, delay: 0.5 },
  { x: 45, y: 10, size: 2, delay: 1.0 },
  { x: 62, y: 38, size: 1.5, delay: 0.3 },
  { x: 78, y: 18, size: 2, delay: 0.8 },
  { x: 90, y: 52, size: 1.5, delay: 1.2 },
  { x: 18, y: 58, size: 2, delay: 0.2 },
  { x: 52, y: 68, size: 1.5, delay: 0.7 },
  { x: 70, y: 44, size: 2, delay: 1.1 },
  { x: 35, y: 82, size: 1.5, delay: 0.4 },
] as const;

const SPARKLE_OFFSETS = [
  { x: -24, y: -8 },
  { x: 20, y: -12 },
  { x: -16, y: 14 },
  { x: 28, y: 10 },
  { x: 0, y: -18 },
  { x: -32, y: 4 },
] as const;

const WRONG_REVEAL_MS = 1000;
const POST_EXPLANATION_MS = 2000;
const QUIZ_EXIT_MS = 900;

type QuizQuestion = {
  prompt: string;
  answers: readonly string[];
  correctIndex: number;
  explanation: string;
};

type AnswerFeedback = {
  selectedIndex: number;
  isCorrect: boolean;
  hatLine: string;
  showCorrectHighlight: boolean;
  showExplanation: boolean;
};

type MemoryQuizProps = {
  title: string;
  subtitle: readonly string[];
  questions: readonly QuizQuestion[];
  onComplete: () => void;
};

export function MemoryQuiz({ title, subtitle, questions, onComplete }: MemoryQuizProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const timers = useRef<number[]>([]);

  const current = questions[questionIndex];
  const isComplete = questionIndex >= questions.length;

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  const advanceQuiz = () => {
    setFeedback(null);
    setSelectedIndex(null);
    setLocked(false);
    setQuestionIndex((i) => i + 1);
  };

  const finishQuiz = () => {
    setIsExiting(true);
    schedule(onComplete, QUIZ_EXIT_MS);
  };

  const handleSelect = (index: number) => {
    if (locked || !current || isComplete) return;

    const isCorrect = index === current.correctIndex;

    if (isCorrect) {
      const hatLine = pickSortingResponse(sortingCorrectResponses);

      setSelectedIndex(index);
      setLocked(true);
      setFeedback({
        selectedIndex: index,
        isCorrect: true,
        hatLine,
        showCorrectHighlight: true,
        showExplanation: true,
      });

      const isLast = questionIndex >= questions.length - 1;
      schedule(() => {
        if (isLast) finishQuiz();
        else advanceQuiz();
      }, POST_EXPLANATION_MS);
    } else {
      const hatLine = pickSortingResponse(sortingIncorrectResponses);

      setSelectedIndex(index);
      setFeedback({
        selectedIndex: index,
        isCorrect: false,
        hatLine,
        showCorrectHighlight: true,
        showExplanation: false,
      });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: isExiting ? QUIZ_EXIT_MS / 1000 : 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-16 sm:px-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 15%, rgba(201,168,92,0.12), transparent 65%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(122,31,43,0.12), transparent 60%)",
        }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {DUST_PARTICLES.map((p) => (
          <motion.span
            key={`${p.x}-${p.y}`}
            className="absolute rounded-full bg-gold/50"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              boxShadow: `0 0 ${p.size * 4}px rgba(201,168,92,0.6)`,
            }}
            animate={{ y: [0, -16, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: 4 + (p.delay % 2),
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <article className="relative w-full max-w-2xl">
        <div
          aria-hidden
          className="absolute -inset-4 -z-10 rounded-3xl blur-2xl opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(201,168,92,0.22), transparent 70%)",
          }}
        />

        <div className="relative rounded-3xl border border-gold/30 bg-[#0d070b]/40 backdrop-blur-xl px-6 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(201,168,92,0.12)] sm:px-10 sm:py-12 border-t-gold/40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-15"
            style={{
              background:
                "radial-gradient(at 15% 20%, rgba(201,168,92,0.15) 0, transparent 50%), radial-gradient(at 85% 80%, rgba(122,31,43,0.15) 0, transparent 50%)",
            }}
          />

          <div className="relative">
            <QuizHeading title={title} subtitle={subtitle} />

            <div className="mt-10" style={{ perspective: 1200 }}>
              <AnimatePresence mode="wait">
                {current && !isComplete && (
                  <QuizQuestionCard
                    key={questionIndex}
                    prompt={current.prompt}
                    answers={current.answers}
                    correctIndex={current.correctIndex}
                    explanation={current.explanation}
                    selectedIndex={selectedIndex}
                    locked={locked}
                    feedback={feedback}
                    onSelect={handleSelect}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </article>

      {!isExiting && (
        <ScrollIndicator watchKey={questionIndex} label="↓ Turn the Next Page" />
      )}
    </motion.section>
  );
}

function QuizHeading({ title, subtitle }: { title: string; subtitle: readonly string[] }) {
  const [visibleChars, setVisibleChars] = useState(0);
  const titleComplete = visibleChars >= title.length;

  useEffect(() => {
    if (titleComplete) return;
    const t = window.setTimeout(() => setVisibleChars((n) => n + 1), 42);
    return () => window.clearTimeout(t);
  }, [visibleChars, title.length, titleComplete]);

  return (
    <header className="text-center">
      <h1 className="min-h-[2rem] font-display text-lg leading-snug text-gold sm:text-xl md:text-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] tracking-wide">
        {title.slice(0, visibleChars)}
        {!titleComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.55, repeat: Infinity }}
            className="text-gold"
          >
            |
          </motion.span>
        )}
      </h1>

      <div className="mx-auto mt-4 space-y-1">
        {subtitle.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0 }}
            animate={{ opacity: titleComplete ? 1 : 0 }}
            transition={{ delay: 0.2 + i * 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-sm italic text-amber-100/80 sm:text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: titleComplete ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-6 h-px w-24 origin-center bg-gradient-to-r from-transparent via-gold/50 to-transparent"
      />
    </header>
  );
}

function QuizQuestionCard({
  prompt,
  answers,
  correctIndex,
  explanation,
  selectedIndex,
  locked,
  feedback,
  onSelect,
}: {
  prompt: string;
  answers: readonly string[];
  correctIndex: number;
  explanation: string;
  selectedIndex: number | null;
  locked: boolean;
  feedback: AnswerFeedback | null;
  onSelect: (index: number) => void;
}) {
  const sparkleKey = useMemo(
    () => `${feedback?.selectedIndex ?? -1}-${feedback?.isCorrect ?? false}`,
    [feedback?.selectedIndex, feedback?.isCorrect],
  );

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 12 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: -12 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
    >
      <h2 className="text-center font-display text-base leading-relaxed text-amber-100 sm:text-lg md:text-xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] tracking-wide">
        {prompt}
      </h2>

      <div className="mt-8 grid gap-3.5 sm:gap-4">
        {answers.map((answer, i) => {
          const isSelected = selectedIndex === i;
          const isCorrectAnswer = i === correctIndex;

          const isFullyCorrect = feedback && feedback.isCorrect && isCorrectAnswer;
          const isGuideGlowing = feedback && !feedback.isCorrect && isCorrectAnswer;
          const isMuted = locked && !isCorrectAnswer;

          return (
            <div key={answer} className="relative">
              {isFullyCorrect && (
                <AnswerSparkles sparkleKey={sparkleKey} show={true} />
              )}

              <motion.button
                type="button"
                disabled={locked}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.5 }}
                whileHover={locked ? undefined : { scale: 1.018, y: -2 }}
                whileTap={locked ? undefined : { scale: 0.99 }}
                onClick={() => onSelect(i)}
                className={`group relative w-full rounded-2xl border px-5 py-4 text-left font-body text-sm transition-all duration-300 backdrop-blur-md sm:px-6 sm:py-4.5 sm:text-base ${
                  isFullyCorrect
                    ? "scale-[1.02] border-gold/90 bg-gradient-to-r from-gold/25 via-amber-500/20 to-gold/25 text-amber-50 shadow-[0_0_25px_rgba(201,168,92,0.45),inset_0_0_15px_rgba(201,168,92,0.2)]"
                    : isGuideGlowing
                      ? "animate-pulse border-gold/70 bg-gold/15 text-amber-100 shadow-[0_0_22px_rgba(201,168,92,0.4)] cursor-pointer hover:scale-[1.02]"
                      : isSelected
                        ? "border-gold/40 bg-gold/10 text-amber-100/90 shadow-[0_0_12px_rgba(201,168,92,0.15)]"
                        : isMuted
                          ? "cursor-default border-white/10 bg-black/20 text-amber-100/35 shadow-none"
                          : "cursor-pointer border-gold/25 bg-black/35 text-amber-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-gold/60 hover:bg-gold/15 hover:text-white hover:shadow-[0_0_25px_rgba(201,168,92,0.3)]"
                }`}
              >
                <span
                  className={`mr-3.5 font-display text-xs sm:text-sm font-semibold tracking-wider ${
                    isFullyCorrect || isGuideGlowing || isSelected
                      ? "text-gold drop-shadow-[0_0_8px_rgba(201,168,92,0.6)]"
                      : "text-gold/60 group-hover:text-gold"
                  }`}
                >
                  {String.fromCharCode(65 + i)}.
                </span>
                <span className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{answer}</span>
              </motion.button>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 text-center"
          >
            <p className="font-display text-base italic text-gold sm:text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              &ldquo;{feedback.hatLine}&rdquo;
            </p>

            {feedback.showExplanation && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mt-4 max-w-md font-body text-sm italic leading-relaxed text-amber-100/90 sm:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              >
                {renderFormattedText(explanation)}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold not-italic text-gold drop-shadow-[0_0_8px_rgba(201,168,92,0.5)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function AnswerSparkles({ sparkleKey, show }: { sparkleKey: string; show: boolean }) {
  if (!show) return null;

  return (
    <>
      {SPARKLE_OFFSETS.map((s, i) => (
        <motion.span
          key={`${sparkleKey}-${i}`}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-gold"
          style={{ boxShadow: "0 0 6px rgba(201,168,92,0.9)" }}
          initial={{ x: s.x, y: s.y, opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: s.y - 16 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      ))}
    </>
  );
}
