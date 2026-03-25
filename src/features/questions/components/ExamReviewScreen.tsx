import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import { topics, type Question, type QuizQuestion, type TracingQuestion, type CodingQuestion, type FillBlankQuestion } from "@/data/questions";

interface Props {
  examQuestions: Question[];
  answers: Record<number, { answer: string; correct: boolean }>;
  onBack: () => void;
}

function ReviewItem({ q, answer, index }: { q: Question; answer?: { answer: string; correct: boolean }; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isCorrect = answer?.correct ?? false;
  const topic = topics.find(t => t.id === q.topic);

  return (
    <div className={`rounded-xl border p-4 space-y-2 ${isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCorrect ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-destructive" />}
          <span className="text-sm font-semibold">שאלה {index + 1}</span>
          <span className="text-xs text-muted-foreground">{topic?.icon} {topic?.name}</span>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary hover:underline">
          {expanded ? "הסתר" : "הצג פרטים"}
        </button>
      </div>

      <p className="text-sm text-foreground">
        {q.type === "coding" ? (q as CodingQuestion).title : q.type === "fill-blank" ? (q as FillBlankQuestion).title : (q as QuizQuestion | TracingQuestion).question}
      </p>

      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2 pt-2 border-t border-border">
          {(q as Question & { code?: string }).code && <PythonCodeBlock code={(q as Question & { code?: string }).code!} />}

          {q.type === "quiz" && (
            <div className="space-y-1">
              {(q as QuizQuestion).options.map((opt, i) => (
                <p key={i} className={`text-sm px-2 py-1 rounded ${i === (q as QuizQuestion).correctIndex ? "bg-success/10 text-success font-semibold" : "text-muted-foreground"}`}>
                  {String.fromCharCode(1488 + i)}. {opt}
                </p>
              ))}
            </div>
          )}

          {q.type === "tracing" && (
            <p className="text-sm font-mono">תשובה נכונה: <span className="text-success font-bold">{(q as TracingQuestion).correctAnswer}</span></p>
          )}

          {q.type === "coding" && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">פתרון מוצע:</p>
              <PythonCodeBlock code={(q as CodingQuestion).solution} />
            </div>
          )}

          {q.type === "fill-blank" && (
            <div className="space-y-1">
              {(q as FillBlankQuestion).blanks.map((b, i) => (
                <p key={i} className="text-sm font-mono">חור {i + 1}: <span className="text-success font-bold">{b.answer}</span></p>
              ))}
            </div>
          )}

          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-semibold mb-1">💡 הסבר:</p>
            <p className="text-xs text-muted-foreground">
              {q.type === "quiz" ? (q as QuizQuestion).explanation :
               q.type === "tracing" ? (q as TracingQuestion).explanation :
               q.type === "coding" ? (q as CodingQuestion).solutionExplanation :
               (q as FillBlankQuestion).solutionExplanation}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function ExamReviewScreen({ examQuestions, answers, onBack }: Props) {
  return (
    <div className="min-h-screen pb-24 pt-4">
      <div className="mx-auto max-w-lg px-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">סקירת מבחן</h1>
        </div>

        <div className="space-y-3">
          {examQuestions.map((q, i) => (
            <ReviewItem key={q.id} q={q} answer={answers[i]} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
