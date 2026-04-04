import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import type { QuizQuestion } from "@/data/questions";

export function QuizView({ q, onAnswer }: { q: QuizQuestion; onAnswer: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const answered = submitted;

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-card-foreground">{q.question}</p>
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
            className={`w-full rounded-sm border p-4 text-right transition-all ${
              answered
                ? i === q.correctIndex
                  ? "border-success bg-success/10 text-success"
                  : i === selected
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border bg-secondary opacity-50 text-foreground"
                : i === selected
                ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                : "border-border bg-secondary hover:border-primary/50 text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-foreground">
                {String.fromCharCode(1488 + i)}
              </span>
              <span className="text-sm font-medium">{opt}</span>
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 ${selected === q.correctIndex ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}
        >
          <p className="text-sm font-semibold mb-1">{selected === q.correctIndex ? "✅ נכון!" : "❌ לא נכון"}</p>
          <p className="text-sm text-muted-foreground">{q.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
