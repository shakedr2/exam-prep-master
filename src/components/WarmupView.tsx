import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Lightbulb, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import type { WarmupQuestion } from "@/data/questions";

interface WarmupViewProps {
  warmupQuestions: WarmupQuestion[];
  onComplete: () => void;
}

export function WarmupView({ warmupQuestions, onComplete }: WarmupViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const wq = warmupQuestions[currentIndex];
  const totalSteps = warmupQuestions.length + 1; // warmups + main question
  const progressPct = ((currentIndex + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentIndex < warmupQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-4">
      {/* Warmup progress */}
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-primary">
          שאלת הכנה {currentIndex + 1}/{warmupQuestions.length}
        </span>
        <Progress value={progressPct} className="h-1.5 flex-1" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 15 }}
          className="rounded-2xl border border-primary/30 bg-card p-5 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              💡 שאלת הכנה
            </span>
          </div>

          <p className="text-base font-semibold text-card-foreground">{wq.question}</p>
          {wq.code && <PythonCodeBlock code={wq.code} />}

          <div className="space-y-2">
            {wq.options.map((opt, i) => (
              <motion.button
                key={i}
                whileTap={!answered ? { scale: 0.98 } : {}}
                onClick={() => {
                  if (answered) return;
                  setSelected(i);
                }}
                className={`w-full rounded-xl border p-3 text-right transition-all ${
                  !answered
                    ? "border-primary/20 bg-secondary hover:border-primary/40 text-foreground"
                    : i === wq.correctIndex
                    ? "border-success bg-success/10 text-success"
                    : i === selected
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border bg-secondary opacity-40 text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-foreground">
                    {String.fromCharCode(1488 + i)}
                  </span>
                  <span className="text-sm font-medium">{opt}</span>
                  {answered && i === wq.correctIndex && <Check className="mr-auto h-4 w-4 text-success" />}
                  {answered && i === selected && i !== wq.correctIndex && <X className="mr-auto h-4 w-4 text-destructive" />}
                </div>
              </motion.button>
            ))}
          </div>

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-3 ${
                selected === wq.correctIndex
                  ? "bg-success/10 border border-success/30"
                  : "bg-destructive/10 border border-destructive/30"
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {selected === wq.correctIndex ? "✅ נכון!" : "❌ לא נכון"}
              </p>
              <p className="text-xs text-muted-foreground">{wq.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {answered && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button
            onClick={handleNext}
            className="w-full gap-2 gradient-primary text-primary-foreground"
          >
            {currentIndex < warmupQuestions.length - 1 ? "שאלת הכנה הבאה" : "🚀 עכשיו אתה מוכן! לשאלה המלאה"}
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
