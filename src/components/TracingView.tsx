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
  const [attempts, setAttempts] = useState(0);
  const correctTrimmed = q.correctAnswer.trim();
  const answerTrimmed = answer.trim();
  const isCorrect = answerTrimmed === correctTrimmed;

  const isPartial = !isCorrect && answerTrimmed.length > 0 && (
    correctTrimmed.includes(answerTrimmed) ||
    answerTrimmed.includes(correctTrimmed.slice(0, Math.max(1, Math.floor(correctTrimmed.length / 2)))) ||
    answerTrimmed.split("").filter(c => correctTrimmed.includes(c)).length >= correctTrimmed.length * 0.4
  );

  const getHint = (): string => {
    const correct = correctTrimmed;
    if (correct.length <= 2) {
      return `התשובה מכילה ${correct.length} תווים`;
    }
    // Show first character(s) as hint
    const revealCount = Math.max(1, Math.ceil(correct.length * 0.3));
    const revealed = correct.slice(0, revealCount);
    return `התשובה מתחילה ב: ${revealed}...  (אורך: ${correct.length} תווים)`;
  };

  const handleSubmit = () => {
    if (!answerTrimmed) return;
    if (isPartial && attempts < 2) {
      setAttempts(a => a + 1);
      return;
    }
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
          <Button onClick={handleSubmit} className="w-full gradient-primary text-primary-foreground" disabled={!answerTrimmed}>
            {isPartial && attempts < 2 ? "נסה שוב" : "בדוק תשובה"}
          </Button>
        )}
      </div>

      {/* Partial answer hint */}
      {!submitted && isPartial && attempts > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3 bg-warning/10 border border-warning/30"
        >
          <p className="text-sm font-semibold mb-1">🤏 קרוב! אבל לא מדויק</p>
          <p className="text-sm text-muted-foreground">{getHint()}</p>
          {attempts >= 2 && (
            <p className="text-xs text-muted-foreground mt-1">לחץ "בדוק תשובה" כדי לראות את התשובה המלאה</p>
          )}
        </motion.div>
      )}

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