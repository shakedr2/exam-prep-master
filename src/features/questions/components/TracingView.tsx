import { useState, memo } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import { TraceTable } from "@/components/TraceTable";
import { CommonMistakeWarning } from "@/features/questions/components/CommonMistakeWarning";
import { gradeTracingAnswer, type GradeResult } from "@/lib/grading";
import type { TracingQuestion } from "@/data/questions";

export const TracingView = memo(function TracingView({ q, onAnswer }: { q: TracingQuestion; onAnswer: (correct: boolean) => void }) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [grade, setGrade] = useState<GradeResult | null>(null);

  const correctTrimmed = q.correctAnswer.trim();
  const answerTrimmed = answer.trim();

  // Pre-check for partial hint (before submit)
  const preGrade = answerTrimmed ? gradeTracingAnswer(answerTrimmed, correctTrimmed) : null;
  const isPartialPreview = preGrade?.score === "partial" || preGrade?.score === "incorrect";

  const getHint = (): string => {
    const correct = correctTrimmed;
    if (correct.length <= 2) {
      return `התשובה מכילה ${correct.length} תווים`;
    }
    const revealCount = Math.max(1, Math.ceil(correct.length * 0.3));
    const revealed = correct.slice(0, revealCount);
    return `התשובה מתחילה ב: ${revealed}...  (אורך: ${correct.length} תווים)`;
  };

  const handleSubmit = () => {
    if (!answerTrimmed) return;
    const result = gradeTracingAnswer(answerTrimmed, correctTrimmed);
    
    // Allow retry for partial answers
    if (result.score === "partial" && attempts < 2) {
      setAttempts(a => a + 1);
      return;
    }

    // For incorrect but close, also allow retry
    if (result.score === "incorrect" && isPartialPreview && attempts < 2) {
      setAttempts(a => a + 1);
      return;
    }

    setGrade(result);
    setSubmitted(true);
    // Partial credit counts as correct for progress
    onAnswer(result.score === "correct" || result.score === "partial");
  };

  const gradeColors = {
    correct: "bg-success/10 border border-success/30",
    partial: "bg-warning/10 border border-warning/30",
    incorrect: "bg-destructive/10 border border-destructive/30",
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
          <Button onClick={handleSubmit} className="w-full gradient-primary text-primary-foreground gap-2" disabled={!answerTrimmed}>
            {isPartialPreview && attempts > 0 && attempts < 2 ? "נסה שוב" : "בדוק תשובה"}
            {isPartialPreview && attempts > 0 && attempts < 2 && (
              <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-bold">
                {2 - attempts} ניסיונות נותרו
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Partial answer hint */}
      {!submitted && isPartialPreview && attempts > 0 && (
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

      {submitted && grade && (
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 space-y-3 ${gradeColors[grade.score]}`}
          >
            <p className="text-sm font-semibold mb-1">{grade.message}</p>
            {grade.score === "partial" && (
              <div className="space-y-1">
                <p className="text-sm font-mono">התשובה שלך: {answer}</p>
                <p className="text-sm font-mono">תשובה מדויקת: {q.correctAnswer}</p>
                <p className="text-xs text-muted-foreground">💡 קיבלת ציון חלקי — ההבנה הכללית נכונה</p>
              </div>
            )}
            {grade.score === "incorrect" && <p className="text-sm font-mono mb-2">תשובה נכונה: {q.correctAnswer}</p>}
            <p className="text-sm text-muted-foreground">{q.explanation}</p>
            {q.traceTable && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-muted-foreground mb-2">📊 טבלת מעקב שלב-אחר-שלב:</p>
                <TraceTable headers={q.traceTable.headers} rows={q.traceTable.rows} />
              </div>
            )}
          </motion.div>
          {grade.score === "incorrect" && (
            <CommonMistakeWarning mistake={q.commonMistake} />
          )}
        </div>
      )}
    </div>
  );
});