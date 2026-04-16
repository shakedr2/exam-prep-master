import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionText } from "@/components/QuestionText";
import { CommonMistakeWarning } from "@/features/questions/components/CommonMistakeWarning";
import { gradeBlankAnswer, type GradeResult } from "@/lib/grading";
import type { FillBlankQuestion } from "@/data/questions";

export const FillBlankView = memo(function FillBlankView({ q, onAnswer }: { q: FillBlankQuestion; onAnswer: (correct: boolean) => void }) {
  const [answers, setAnswers] = useState<string[]>(new Array(q.blanks.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [grades, setGrades] = useState<GradeResult[]>([]);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, [q.id]);

  const preGrades = answers.map((a, i) => gradeBlankAnswer(a.trim(), q.blanks[i].answer.trim()));
  const allCorrectPre = preGrades.every(g => g.score === "correct");
  const hasPartialPre = !allCorrectPre && preGrades.some(g => g.score === "correct" || g.score === "partial");

  const getHintForBlank = (i: number): string => {
    const correct = q.blanks[i].answer.trim();
    if (correct.length <= 2) return `אורך: ${correct.length} תווים`;
    const revealCount = Math.max(1, Math.ceil(correct.length * 0.3));
    return `מתחיל ב: ${correct.slice(0, revealCount)}… (${correct.length} תווים)`;
  };

  const handleSubmit = () => {
    if (answers.some(a => !a.trim())) return;
    const results = answers.map((a, i) => gradeBlankAnswer(a.trim(), q.blanks[i].answer.trim()));
    const allCorrect = results.every(g => g.score === "correct");
    const hasPartial = results.some(g => g.score === "partial");

    if (!allCorrect && attempts < 2) {
      setAttempts(a => a + 1);
      return;
    }

    setGrades(results);
    setSubmitted(true);
    // Partial credit: if most blanks are correct/partial, count as correct for progress
    const correctCount = results.filter(g => g.score === "correct").length;
    const partialCount = results.filter(g => g.score === "partial").length;
    const score = (correctCount + partialCount * 0.5) / results.length;
    onAnswer(score >= 0.5);
  };

  const codeParts = (() => {
    const parts: (string | { blankIndex: number })[] = [];
    let remaining = q.code;
    let blankIdx = 0;
    while (remaining.includes("___")) {
      const pos = remaining.indexOf("___");
      if (pos > 0) parts.push(remaining.slice(0, pos));
      parts.push({ blankIndex: blankIdx });
      remaining = remaining.slice(pos + 3);
      blankIdx++;
    }
    if (remaining) parts.push(remaining);
    return parts;
  })();

  const getBlankIcon = (i: number) => {
    if (!submitted) return null;
    const g = grades[i];
    if (g.score === "correct") return <Check className="h-3 w-3" />;
    if (g.score === "partial") return <AlertCircle className="h-3 w-3" />;
    return <X className="h-3 w-3" />;
  };

  const getBlankColor = (i: number) => {
    if (!submitted) return "";
    const g = grades[i];
    if (g.score === "correct") return "bg-success/20 text-success";
    if (g.score === "partial") return "bg-warning/20 text-warning";
    return "bg-destructive/20 text-destructive";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground">{q.title}</h3>
      <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">{q.description}</p>

      {/* Code with blanks */}
      <div className="rounded-xl bg-slate-100 dark:bg-[#1e1e2e] p-4 font-mono text-base overflow-x-auto border border-border/60" dir="ltr">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground ml-2">השלם את החלקים החסרים</span>
        </div>
        <pre className="whitespace-pre-wrap leading-loose text-slate-900 dark:text-slate-100">
          {codeParts.map((part, i) => {
            if (typeof part === "string") {
              return <span key={i}>{part}</span>;
            }
            const bi = part.blankIndex;
            const blank = q.blanks[bi];
            return (
              <span key={i} className="inline-flex items-center mx-1">
                {submitted ? (
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-bold ${getBlankColor(bi)}`}>
                    {answers[bi] || "___"}
                    {getBlankIcon(bi)}
                  </span>
                ) : (
                  <Input
                    ref={bi === 0 ? firstInputRef : undefined}
                    dir="ltr"
                    value={answers[bi]}
                    onChange={e => {
                      const newAnswers = [...answers];
                      newAnswers[bi] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    placeholder="הקלד תשובה"
                    className="inline-block w-28 h-9 text-sm font-mono font-semibold bg-background border-2 border-primary/60 text-center px-2 text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                    disabled={submitted}
                  />
                )}
              </span>
            );
          })}
        </pre>
      </div>

      {/* Hints */}
      {!submitted && (
        <div className="rounded-xl bg-muted/50 p-3 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">💡 רמזים:</p>
          {q.blanks.map((blank, i) => (
            <p key={i} className="text-xs text-muted-foreground">
              חור {i + 1}: {blank.hint}
            </p>
          ))}
        </div>
      )}

      {!submitted && (
        <Button
          onClick={handleSubmit}
          className="w-full gradient-primary text-primary-foreground gap-2"
          disabled={answers.some(a => !a.trim())}
        >
          {hasPartialPre && attempts > 0 && attempts < 2 ? "נסה שוב" : "בדוק תשובה"}
          {hasPartialPre && attempts > 0 && attempts < 2 && (
            <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-bold">
              {2 - attempts} ניסיונות נותרו
            </span>
          )}
        </Button>
      )}

      {/* Retry hints */}
      {!submitted && !allCorrectPre && attempts > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3 bg-warning/10 border border-warning/30 space-y-1"
        >
          <p className="text-sm font-semibold mb-1">🤏 חלק מהתשובות נכונות, אבל לא הכל!</p>
          {preGrades.map((g, i) => g.score !== "correct" && (
            <p key={i} className="text-sm text-muted-foreground">
              חור {i + 1}: {g.score === "partial" ? "קרוב מאוד! " : ""}{getHintForBlank(i)}
            </p>
          ))}
        </motion.div>
      )}

      {submitted && grades.length > 0 && !grades.every(g => g.score === "correct") && (
        <CommonMistakeWarning mistake={q.commonMistake} />
      )}
      {submitted && grades.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 ${
            grades.every(g => g.score === "correct")
              ? "bg-success/10 border border-success/30"
              : grades.some(g => g.score === "partial")
              ? "bg-warning/10 border border-warning/30"
              : "bg-destructive/10 border border-destructive/30"
          }`}
        >
          {grades.every(g => g.score === "correct") ? (
            <p className="text-sm font-semibold mb-2">✅ מצוין! כל החורים מולאו נכון!</p>
          ) : grades.every(g => g.score === "incorrect") ? (
            <p className="text-sm font-semibold mb-2">❌ יש טעויות</p>
          ) : (
            <p className="text-sm font-semibold mb-2">🟡 ציון חלקי — ההבנה הכללית טובה</p>
          )}

          <div className="space-y-1 mb-2">
            {q.blanks.map((blank, i) => {
              const g = grades[i];
              if (g.score === "correct") return null;
              return (
                <p key={i} className="text-sm font-mono">
                  חור {i + 1}:{" "}
                  <span className={g.score === "partial" ? "text-warning" : "text-destructive"}>
                    {g.score === "partial" ? "≈" : "✗"} {answers[i]}
                  </span>
                  {" → "}
                  <span className="text-success font-bold">{blank.answer}</span>
                  {g.score === "partial" && g.message && (
                    <span className="text-xs text-muted-foreground ml-2">({g.message})</span>
                  )}
                </p>
              );
            })}
          </div>
          <QuestionText text={q.solutionExplanation} className="text-sm text-muted-foreground" />
        </motion.div>
      )}
    </div>
  );
});
