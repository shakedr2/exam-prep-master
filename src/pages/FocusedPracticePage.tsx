import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Bot, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AIExplanationDrawer } from "@/features/questions/components/AIExplanationDrawer";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { useAIExplanation } from "@/features/ai/hooks/useAIExplanation";
import { questions } from "@/data/questions";
import type { QuizQuestion } from "@/data/questions";

interface LocationState {
  questionIds?: string[];
}

const FocusedPracticePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { answerQuestion } = useProgress();
  const { explanation, loading: aiLoading, fetchExplanation, reset: resetAI } = useAIExplanation();

  const state = (location.state as LocationState) ?? {};
  const questionIds: string[] = state.questionIds ?? [];

  const allQuestions: QuizQuestion[] = questionIds
    .map((id) => questions.find((q) => q.id === id))
    .filter((q): q is QuizQuestion => q !== undefined && q.type === "quiz");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sessionAnswers, setSessionAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  if (allQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold text-foreground">No focused practice questions available.</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const current = allQuestions[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / allQuestions.length) * 100);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedIndex(idx);
    setAnswered(true);
    const isCorrect = idx === current.correctIndex;
    answerQuestion(current.id, isCorrect);
    setSessionAnswers((prev) => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= allQuestions.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedIndex(null);
    setAnswered(false);
    resetAI();
    setDrawerOpen(false);
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
    setSelectedIndex(null);
    setAnswered(false);
    resetAI();
    setDrawerOpen(false);
  };

  const handleAI = () => {
    if (!answered) return;
    fetchExplanation(
      current.question,
      current.options,
      current.correctIndex,
      selectedIndex ?? undefined
    );
    setDrawerOpen(true);
  };

  if (finished) {
    const correct = sessionAnswers.filter(Boolean).length;
    const pct = Math.round((correct / allQuestions.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full text-center space-y-6"
        >
          <div className="text-6xl">{pct >= 70 ? "🎉" : "📚"}</div>
          <h2 className="text-3xl font-bold text-foreground">Focused Practice Complete!</h2>
          <p className="text-muted-foreground text-lg">
            You got <strong className="text-foreground">{correct}</strong> of{" "}
            <strong className="text-foreground">{allQuestions.length}</strong> correct ({pct}%)
          </p>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full"
              onClick={() => {
                setCurrentIndex(0);
                setSelectedIndex(null);
                setAnswered(false);
                setSessionAnswers([]);
                setFinished(false);
                resetAI();
              }}
            >
              Try Again
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="mx-auto max-w-2xl px-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            ← Back
          </Button>
          <div className="text-sm text-muted-foreground font-medium">
            Question {currentIndex + 1} of {allQuestions.length}
          </div>
        </div>

        <p className="text-sm font-semibold text-primary">🎯 Focused Practice</p>

        <Progress value={progressPct} className="h-2" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <p className="text-lg font-semibold text-foreground leading-relaxed mb-6">
                  {current.question}
                </p>

                <div className="space-y-3">
                  {current.options.map((option, idx) => {
                    let extra = "";
                    if (answered) {
                      if (idx === current.correctIndex) {
                        extra = "bg-green-900/50 border-green-500 text-green-100";
                      } else if (idx === selectedIndex) {
                        extra = "bg-red-900/50 border-red-500 text-red-100";
                      }
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={answered}
                        className={`w-full text-start rounded-sm border px-4 py-3 text-sm transition-all
                          ${answered ? "cursor-default" : "hover:bg-accent cursor-pointer"}
                          ${extra || "border-border bg-background text-foreground"}
                        `}
                      >
                        <span className="font-semibold me-2">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {option}
                        {answered && idx === current.correctIndex && (
                          <CheckCircle2 className="inline ms-2 h-4 w-4 text-green-400" />
                        )}
                        {answered && idx === selectedIndex && idx !== current.correctIndex && (
                          <XCircle className="inline ms-2 h-4 w-4 text-red-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {answered && current.explanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-lg bg-muted p-4 text-sm text-muted-foreground"
                  >
                    {current.explanation}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 me-1" />
            הקודם
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAI}
            disabled={!answered}
            className="gap-1.5"
          >
            <Bot className="h-4 w-4" />
            הסבר AI
          </Button>

          <Button size="sm" onClick={handleNext} disabled={!answered}>
            {currentIndex + 1 === allQuestions.length ? "סיום" : "הבא"}
            <ChevronRight className="h-4 w-4 ms-1" />
          </Button>
        </div>
      </div>

      <AIExplanationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        content={
          explanation
            ? [explanation.explanation, explanation.tip ? `💡 ${explanation.tip}` : ""]
                .filter(Boolean)
                .join("\n\n")
            : ""
        }
        loading={aiLoading}
      />
    </div>
  );
};

export default FocusedPracticePage;
