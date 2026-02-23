import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import { TraceTable } from "@/components/TraceTable";
import type { TracingQuestion } from "@/data/questions";

export function TracingView({ q, onAnswer }: { q: TracingQuestion; onAnswer: (correct: boolean) => void }) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = answer.trim() === q.correctAnswer.trim();

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitted(true);
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-card-foreground">{q.question}</p>
      <PythonCodeBlock code={q.code} />
      <div className="space-y-2">
        <Input
          dir="ltr"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="הקלד את התשובה..."
          className="font-mono text-foreground"
          disabled={submitted}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
        />
        {!submitted && (
          <Button onClick={handleSubmit} className="w-full gradient-primary text-primary-foreground" disabled={!answer.trim()}>
            בדוק תשובה
          </Button>
        )}
      </div>
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 space-y-3 ${isCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}
        >
          <p className="text-sm font-semibold mb-1">{isCorrect ? "✅ מצוין!" : "❌ לא מדויק"}</p>
          {!isCorrect && <p className="text-sm font-mono mb-2">תשובה נכונה: {q.correctAnswer}</p>}
          <p className="text-sm text-muted-foreground">{q.explanation}</p>
          {q.traceTable && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">📊 טבלת מעקב שלב-אחר-שלב:</p>
              <TraceTable headers={q.traceTable.headers} rows={q.traceTable.rows} />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}