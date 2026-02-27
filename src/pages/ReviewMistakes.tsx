import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizView } from "@/components/QuizView";
import { TracingView } from "@/components/TracingView";
import { CodingView } from "@/components/CodingView";
import { FillBlankView } from "@/components/FillBlankView";
import { useProgress } from "@/hooks/useProgress";
import type { Question } from "@/data/questions";

const ReviewMistakes = () => {
  const navigate = useNavigate();
  const { getIncorrectQuestions, answerQuestion } = useProgress();
  const [mistakeQuestions] = useState<Question[]>(() => getIncorrectQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);

  const q = mistakeQuestions[currentIndex] ?? null;
  const isLast = currentIndex >= mistakeQuestions.length - 1;
  const progressPct = Math.round(((currentIndex + (answered ? 1 : 0)) / Math.max(mistakeQuestions.length, 1)) * 100);

  const handleAnswer = useCallback((correct: boolean) => {
    if (!q) return;
    answerQuestion(q.id, correct);
    setAnswered(true);
  }, [q, answerQuestion]);

  const handleNext = () => {
    if (isLast) {
      navigate("/progress");
      return;
    }
    setCurrentIndex(i => i + 1);
    setAnswered(false);
  };

  if (mistakeQuestions.length === 0 || !q) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-4">
        <CheckCircle className="h-16 w-16 text-success" />
        <h1 className="text-2xl font-bold">אין טעויות! 🎉</h1>
        <p className="text-muted-foreground">ענית נכון על כל השאלות</p>
        <Button onClick={() => navigate("/progress")} variant="outline" className="gap-2">
          <ArrowRight className="h-4 w-4" /> חזרה להתקדמות
        </Button>
      </div>
    );
  }

  const renderQuestion = () => {
    switch (q.type) {
      case "quiz": return <QuizView q={q} onAnswer={handleAnswer} />;
      case "tracing": return <TracingView q={q} onAnswer={handleAnswer} />;
      case "coding": return <CodingView q={q} onAnswer={handleAnswer} />;
      case "fill-blank": return <FillBlankView q={q} onAnswer={handleAnswer} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="mx-auto max-w-lg px-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button onClick={() => navigate("/progress")} variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <ArrowRight className="h-4 w-4" /> חזרה
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            {currentIndex + 1} / {mistakeQuestions.length}
          </span>
        </div>

        <Progress value={progressPct} className="h-2" />
        <h2 className="text-lg font-bold">🔄 חזרה על טעויות</h2>

        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          {renderQuestion()}
        </motion.div>

        {answered && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Button onClick={handleNext} className="w-full gradient-primary text-primary-foreground">
              {isLast ? "סיום — חזרה להתקדמות" : "שאלה הבאה ←"}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReviewMistakes;
