import { useState, useEffect, useCallback } from "react";
import { Sparkles, Lightbulb, ChevronDown, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/shared/integrations/supabase/client";
import type { Question } from "@/data/questions";

type HintLevel = 1 | 2 | 3;

interface HintEntry {
  level: HintLevel;
  text: string;
}

interface FloatingAIButtonProps {
  question: Question;
  userAnswer?: string;
}

function buildExplainBody(q: Question, userAnswer: string | undefined, hintLevel: HintLevel) {
  if (q.type === "quiz") {
    const userAnswerIndex =
      userAnswer !== undefined ? q.options.indexOf(userAnswer) : undefined;
    return {
      type: "explain" as const,
      questionText: q.question,
      choices: q.options,
      correctIndex: q.correctIndex,
      userAnswerIndex: userAnswerIndex !== undefined && userAnswerIndex >= 0 ? userAnswerIndex : undefined,
      topic: q.topic,
      hintLevel,
    };
  }

  if (q.type === "tracing") {
    const questionText = `${q.question}\n\nקוד:\n${q.code}`;
    return {
      type: "explain" as const,
      questionText,
      choices: [q.correctAnswer],
      correctIndex: 0,
      userAnswerIndex: userAnswer === q.correctAnswer ? 0 : undefined,
      topic: q.topic,
      hintLevel,
    };
  }

  if (q.type === "coding") {
    const questionText = `${q.title}\n\n${q.description}`;
    return {
      type: "explain" as const,
      questionText,
      choices: [q.solution],
      correctIndex: 0,
      userAnswerIndex: undefined,
      topic: q.topic,
      hintLevel,
    };
  }

  // fill-blank
  const correctAnswer = q.blanks.map((blank) => blank.answer).join(", ");
  const questionText = `${q.title}\n\n${q.description}\n\nקוד:\n${q.code}`;
  return {
    type: "explain" as const,
    questionText,
    choices: [correctAnswer],
    correctIndex: 0,
    userAnswerIndex: undefined,
    topic: q.topic,
    hintLevel,
  };
}

const HINT_LABELS: Record<HintLevel, string> = {
  1: "💡 רמז",
  2: "➕ עזרה נוספת",
  3: "📖 הצג תשובה",
};

const HINT_LEVEL_LABELS: Record<HintLevel, string> = {
  1: "רמז כללי",
  2: "רמז ספציפי",
  3: "הסבר מלא",
};

export function FloatingAIButton({ question, userAnswer }: FloatingAIButtonProps) {
  const [open, setOpen] = useState(false);
  const [hints, setHints] = useState<HintEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questionId = question.id;
  const currentLevel: HintLevel = hints.length === 0 ? 1 : hints.length === 1 ? 2 : hints.length === 2 ? 3 : 3;
  const allLevelsShown = hints.length >= 3;

  // Reset hints when question changes
  useEffect(() => {
    setHints([]);
    setError(null);
    setLoading(false);
  }, [questionId]);

  const fetchHint = useCallback(async (level: HintLevel) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const body = buildExplainBody(question, userAnswer, level);
      const { data, error: fnError } = await supabase.functions.invoke("ai-explain", {
        body,
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      const text: string =
        level < 3
          ? (data.hint ?? "")
          : [data.explanation, data.tip ? `\n\n💡 **טיפ לזכירה:** ${data.tip}` : ""].join("");

      setHints((prev) => [...prev, { level, text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה בקבלת הרמז");
    } finally {
      setLoading(false);
    }
  }, [question, userAnswer, loading]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleNextHint = () => {
    if (!loading && currentLevel <= 3 && hints.length < 3) {
      fetchHint(currentLevel);
    }
  };

  const nextButtonLabel = HINT_LABELS[currentLevel];

  return (
    <>
      <AnimatePresence>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className="fixed bottom-20 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25 transition-shadow hover:shadow-xl hover:shadow-purple-500/30"
          aria-label="עזרת AI"
        >
          <Sparkles className="h-6 w-6" />
          {hints.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-bold text-foreground border border-border">
              {hints.length}
            </span>
          )}
        </motion.button>
      </AnimatePresence>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto rounded-t-2xl"
          dir="rtl"
        >
          <SheetHeader className="text-right">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              מדריך AI
            </SheetTitle>
            <SheetDescription>
              {allLevelsShown
                ? "הסבר מלא"
                : `רמה ${hints.length}/3 — לחץ/י על הכפתור לעזרה הדרגתית`}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-3">
            {/* Displayed hints */}
            <AnimatePresence>
              {hints.map((entry) => (
                <motion.div
                  key={entry.level}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg border p-4 ${
                    entry.level === 1
                      ? "border-yellow-300/40 bg-yellow-50 dark:bg-yellow-950/20"
                      : entry.level === 2
                      ? "border-orange-300/40 bg-orange-50 dark:bg-orange-950/20"
                      : "border-blue-300/40 bg-blue-50 dark:bg-blue-950/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {entry.level === 1 && <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 shrink-0" />}
                    {entry.level === 2 && <ChevronDown className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0" />}
                    {entry.level === 3 && <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                    <span className={`text-xs font-semibold ${
                      entry.level === 1
                        ? "text-yellow-700 dark:text-yellow-300"
                        : entry.level === 2
                        ? "text-orange-700 dark:text-orange-300"
                        : "text-blue-700 dark:text-blue-300"
                    }`}>
                      {HINT_LEVEL_LABELS[entry.level]}
                    </span>
                  </div>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-right leading-relaxed"
                    dir="rtl"
                  >
                    <ExplanationRenderer text={entry.text} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading skeleton */}
            {loading && (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Next hint button */}
            {!allLevelsShown && !loading && (
              <Button
                onClick={handleNextHint}
                variant="outline"
                className={`w-full gap-2 ${
                  currentLevel === 1
                    ? "border-yellow-300/50 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
                    : currentLevel === 2
                    ? "border-orange-300/50 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                    : "border-blue-300/50 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                }`}
              >
                {nextButtonLabel}
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function ExplanationRenderer({ text }: { text: string }) {
  // Split text into segments: code blocks and regular text
  const segments = text.split(/(```[\s\S]*?```)/g);

  return (
    <>
      {segments.map((segment, i) => {
        if (segment.startsWith("```")) {
          const match = segment.match(/```(\w*)\n?([\s\S]*?)```/);
          const code = match?.[2]?.trim() ?? segment;
          return (
            <pre
              key={i}
              dir="ltr"
              className="rounded-lg bg-secondary p-3 text-sm font-mono overflow-x-auto border border-border"
            >
              <code>{code}</code>
            </pre>
          );
        }
        // Render markdown-like bold and line breaks
        return (
          <div key={i} className="whitespace-pre-wrap">
            {segment.split("\n").map((line, j) => {
              const formatted = line.replace(
                /\*\*(.*?)\*\*/g,
                '<strong>$1</strong>'
              );
              return (
                <p
                  key={j}
                  className="mb-1"
                  dangerouslySetInnerHTML={{ __html: formatted }}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}
