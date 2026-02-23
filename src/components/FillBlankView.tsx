import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FillBlankQuestion } from "@/data/questions";

export function FillBlankView({ q, onAnswer }: { q: FillBlankQuestion; onAnswer: (correct: boolean) => void }) {
  const [answers, setAnswers] = useState<string[]>(new Array(q.blanks.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const results = answers.map((a, i) => a.trim() === q.blanks[i].answer.trim());
  const allCorrect = results.every(Boolean);
  const hasPartial = !allCorrect && results.some(Boolean);

  const getHintForBlank = (i: number): string => {
    const correct = q.blanks[i].answer.trim();
    if (correct.length <= 2) return `אורך: ${correct.length} תווים`;
    const revealCount = Math.max(1, Math.ceil(correct.length * 0.3));
    return `מתחיל ב: ${correct.slice(0, revealCount)}… (${correct.length} תווים)`;
  };

  const handleSubmit = () => {
    if (answers.some(a => !a.trim())) return;
    if (hasPartial && attempts < 2) {
      setAttempts(a => a + 1);
      return;
    }
    setSubmitted(true);
    onAnswer(allCorrect);
  };

  // Build code display with blanks
  const renderCode = () => {
    let codeStr = q.code;
    const parts: (string | { blankIndex: number })[] = [];
    let remaining = codeStr;
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
  };

  const codeParts = renderCode();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground">{q.title}</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{q.description}</p>

      {/* Code with blanks */}
      <div className="rounded-xl bg-[#1e1e2e] p-4 font-mono text-sm overflow-x-auto" dir="ltr">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-xs text-white/40 ml-2">השלם את החלקים החסרים</span>
        </div>
        <pre className="whitespace-pre-wrap leading-relaxed">
          {codeParts.map((part, i) => {
            if (typeof part === "string") {
              return <span key={i} className="text-white/90">{part}</span>;
            }
            const bi = part.blankIndex;
            const blank = q.blanks[bi];
            return (
              <span key={i} className="inline-flex items-center mx-1">
                {submitted ? (
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-bold ${
                    results[bi] ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                  }`}>
                    {answers[bi] || "___"}
                    {results[bi] ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                ) : (
                  <Input
                    dir="ltr"
                    value={answers[bi]}
                    onChange={e => {
                      const newAnswers = [...answers];
                      newAnswers[bi] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    placeholder={blank.hint || "___"}
                    className="inline-block w-24 h-7 text-xs font-mono bg-primary/10 border-primary/30 text-center px-1 text-foreground"
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
          className="w-full gradient-primary text-primary-foreground" 
          disabled={answers.some(a => !a.trim())}
        >
          {hasPartial && attempts < 2 ? "נסה שוב" : "בדוק תשובה"}
        </Button>
      )}

      {/* Partial answer hints */}
      {!submitted && hasPartial && attempts > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3 bg-warning/10 border border-warning/30 space-y-1"
        >
          <p className="text-sm font-semibold mb-1">🤏 חלק מהתשובות נכונות, אבל לא הכל!</p>
          {results.map((r, i) => !r && (
            <p key={i} className="text-sm text-muted-foreground">
              חור {i + 1}: {getHintForBlank(i)}
            </p>
          ))}
          {attempts >= 2 && (
            <p className="text-xs text-muted-foreground mt-1">לחץ "בדוק תשובה" כדי לראות את התשובות המלאות</p>
          )}
        </motion.div>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 ${allCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}
        >
          <p className="text-sm font-semibold mb-2">{allCorrect ? "✅ מצוין! כל החורים מולאו נכון!" : "❌ יש טעויות"}</p>
          {!allCorrect && (
            <div className="space-y-1 mb-2">
              {q.blanks.map((blank, i) => (
                !results[i] && (
                  <p key={i} className="text-sm font-mono">
                    חור {i + 1}: <span className="text-destructive line-through">{answers[i]}</span> → <span className="text-success font-bold">{blank.answer}</span>
                  </p>
                )
              ))}
            </div>
          )}
          <p className="text-sm text-muted-foreground">{q.solutionExplanation}</p>
        </motion.div>
      )}
    </div>
  );
}