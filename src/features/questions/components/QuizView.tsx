import { useState, memo } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import { QuestionText, FormattedOptionText } from "@/components/QuestionText";
import { CommonMistakeWarning } from "@/features/questions/components/CommonMistakeWarning";
import type { QuizQuestion } from "@/data/questions";

export const QuizView = memo(function QuizView({ q, onAnswer }: { q: QuizQuestion; onAnswer: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const answered = submitted;

  return (
    <div className="space-y-4">
      <QuestionText text={q.question} className="text-lg font-semibold text-card-foreground" />
      {q.code && <PythonCodeBlock code={q.code} />}
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={!answered ? { scale: 0.98 } : {}}
            onClick={() => {
              if (answered) return;
              setSelected(i);
            }}
            className={`w-full rounded-sm border p-3 sm:p-4 text-right transition-all touch-manipulation min-h-[44px] ${
              answered
                ? i === q.correctIndex
                  ? "border-success bg-success/10 text-success"
                  : i === selected
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border bg-white dark:bg-secondary opacity-50 text-foreground"
                : i === selected
                ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                : "border-border bg-white dark:bg-secondary hover:border-primary/50 hover:bg-primary/5 text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 border border-border/50 text-sm font-bold text-foreground">
                {String.fromCharCode(1488 + i)}
              </span>
              <FormattedOptionText text={opt} className="text-sm font-medium" />
              {answered && i === q.correctIndex && <Check className="ms-auto h-5 w-5 text-success" />}
              {answered && i === selected && i !== q.correctIndex && <X className="ms-auto h-5 w-5 text-destructive" />}
            </div>
          </motion.button>
        ))}
      </div>
      {selected !== null && !answered && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            onClick={() => {
              setSubmitted(true);
              onAnswer(selected === q.correctIndex);
            }}
            className="w-full gradient-primary text-primary-foreground"
          >
            בדוק תשובה
          </Button>
        </motion.div>
      )}
      {answered && (
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 ${selected === q.correctIndex ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}
          >
            <p className="text-sm font-semibold mb-1">{selected === q.correctIndex ? "✅ נכון!" : "❌ לא נכון"}</p>
            <QuestionText text={q.explanation} className="text-sm text-muted-foreground" />
          </motion.div>
          {selected !== q.correctIndex && (
            <CommonMistakeWarning mistake={q.commonMistake} />
          )}
        </div>
      )}
    </div>
  );
});
