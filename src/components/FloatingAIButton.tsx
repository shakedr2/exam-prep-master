import { useState, useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/shared/integrations/supabase/client";
import type { Question } from "@/data/questions";

interface FloatingAIButtonProps {
  question: Question;
  userAnswer?: string;
}

function getQuestionText(q: Question): string {
  if (q.type === "quiz" || q.type === "tracing") return q.question;
  return q.title + "\n" + q.description;
}

function getCodeSnippet(q: Question): string | undefined {
  if (q.type === "tracing" || q.type === "fill-blank") return q.code;
  if (q.type === "quiz") return q.code;
  return undefined;
}

function getCorrectAnswer(q: Question): string {
  switch (q.type) {
    case "quiz":
      return q.options[q.correctIndex];
    case "tracing":
      return q.correctAnswer;
    case "coding":
      return q.solution;
    case "fill-blank":
      return q.blanks.map((b) => b.answer).join(", ");
  }
}

export function FloatingAIButton({ question, userAnswer }: FloatingAIButtonProps) {
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestCounts, setRequestCounts] = useState<Record<string, number>>({});

  const questionId = question.id;
  const usedCount = requestCounts[questionId] ?? 0;
  const isLimited = usedCount >= 3;

  // Reset explanation when question changes
  useEffect(() => {
    setExplanation(null);
    setError(null);
    setLoading(false);
  }, [questionId]);

  const fetchExplanation = useCallback(async () => {
    if (isLimited || loading) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("explain", {
        body: {
          question_text: getQuestionText(question),
          code_snippet: getCodeSnippet(question),
          user_answer: userAnswer ?? "לא נענתה",
          correct_answer: getCorrectAnswer(question),
        },
      });

      if (fnError) throw fnError;

      if (data?.error === "rate_limit") {
        setError(data.message);
        return;
      }

      if (data?.error) throw new Error(data.error);

      setExplanation(data.explanation);
      setRequestCounts((prev) => ({
        ...prev,
        [questionId]: (prev[questionId] ?? 0) + 1,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה בקבלת ההסבר");
    } finally {
      setLoading(false);
    }
  }, [question, questionId, userAnswer, isLimited, loading]);

  const handleOpen = () => {
    setOpen(true);
    if (!explanation && !loading && !isLimited) {
      fetchExplanation();
    }
  };

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
          disabled={isLimited && !explanation}
          className="fixed bottom-20 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25 transition-shadow hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="הסבר AI"
        >
          <Sparkles className="h-6 w-6" />
          {usedCount > 0 && usedCount < 3 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-bold text-foreground border border-border">
              {3 - usedCount}
            </span>
          )}
        </motion.button>
      </AnimatePresence>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] overflow-y-auto rounded-t-2xl"
          dir="rtl"
        >
          <SheetHeader className="text-right">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              הסבר AI
            </SheetTitle>
            <SheetDescription>
              הסבר מפורט לשאלה הנוכחית ({usedCount}/3 שימושים)
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            {loading && (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {explanation && !loading && (
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-right leading-relaxed"
                dir="rtl"
              >
                <ExplanationRenderer text={explanation} />
              </div>
            )}

            {isLimited && !explanation && !loading && (
              <div className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-warning text-center">
                הגעת למגבלת 3 הסברים לשאלה זו
              </div>
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
