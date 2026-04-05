import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { ExamQuestionRenderer } from "@/components/exam/ExamQuestionRenderer";
import { getQuestionsByTopic, topics } from "@/data/questions";
import type { TopicId } from "@/data/questions";

const PracticePage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { answerQuestion } = useProgress();

  const allQuestions = topicId
    ? getQuestionsByTopic(topicId as TopicId)
    : [];
  const topic = topics.find((t) => t.id === topicId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { answer: string; correct: boolean }>>({});
  const [finished, setFinished] = useState(false);

  if (!topicId || allQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          {topicId ? (
            <>
              <p className="text-xl font-semibold text-foreground">לא נמצאו שאלות לנושא זה.</p>
              <Button onClick={() => navigate("/dashboard")} className="rounded-sm">חזרה לדשבורד</Button>
            </>
          ) : (
            <Skeleton className="h-64 w-96" />
          )}
        </div>
      </div>
    );
  }

  const current = allQuestions[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / allQuestions.length) * 100);
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (index: number, answer: string, correct: boolean) => {
    setAnswers((prev) => ({ ...prev, [index]: { answer, correct } }));
    answerQuestion(allQuestions[index].id, correct);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= allQuestions.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
  };

  if (finished) {
    const correct = Object.values(answers).filter((a) => a.correct).length;
    const pct = Math.round((correct / allQuestions.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full text-center space-y-6"
        >
          <div className="text-6xl">{pct >= 70 ? "🎉" : "📚"}</div>
          <h2 className="text-3xl font-bold text-foreground">סיימת את התרגול!</h2>
          <p className="text-muted-foreground text-lg">
            ענית נכון על <strong className="text-foreground">{correct}</strong> מתוך{" "}
            <strong className="text-foreground">{allQuestions.length}</strong> שאלות ({pct}%)
          </p>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full rounded-sm"
              onClick={() => {
                setCurrentIndex(0);
                setAnswers({});
                setFinished(false);
              }}
            >
              נסה שוב
            </Button>
            <Button variant="outline" className="w-full rounded-sm" onClick={() => navigate("/dashboard")}>
              חזרה לדשבורד
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
            ← חזרה
          </Button>
          <div className="text-sm text-muted-foreground font-medium font-mono">
            שאלה {currentIndex + 1} מתוך {allQuestions.length}
          </div>
        </div>

        {topic && (
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-primary">{topic.icon} {topic.name}</p>
            <p className="text-xs text-muted-foreground">{answeredCount}/{allQuestions.length} נענו</p>
          </div>
        )}

        <Progress value={progressPct} className="h-2" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ExamQuestionRenderer
              question={current}
              currentAnswer={answers[currentIndex]}
              onAnswer={(answer, correct) => handleAnswer(currentIndex, answer, correct)}
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronRight className="h-4 w-4 me-1" />
            הקודם
          </Button>

          <Button className="flex-1" onClick={handleNext} disabled={!answers[currentIndex]}>
            {currentIndex + 1 === allQuestions.length ? "סיום" : "הבא"}
            <ChevronLeft className="h-4 w-4 ms-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
