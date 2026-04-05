import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { ExamQuestionRenderer } from "@/components/exam/ExamQuestionRenderer";
import { useSupabaseQuestionsByTopic } from "@/hooks/useSupabaseQuestions";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";
import { useSaveAnswer } from "@/hooks/useSaveAnswer";
import type { Difficulty, Question } from "@/data/questions";

const difficultyLabels: Record<Difficulty, string> = {
  easy: "קל",
  medium: "בינוני",
  hard: "קשה",
};

const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-success/10 text-success border-success/30 hover:bg-success/20",
  medium: "bg-warning/10 text-warning border-warning/30 hover:bg-warning/20",
  hard: "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20",
};

const typeLabels: Record<string, string> = {
  quiz: "רב-ברירה",
  tracing: "מעקב קוד",
  coding: "כתיבת קוד",
  "fill-blank": "השלמה",
};

function getQuestionTitle(q: Question): string {
  if (q.type === "coding" || q.type === "fill-blank") return q.title;
  return q.question;
}

const PracticePage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { answerQuestion } = useProgress();
  const { saveAnswer } = useSaveAnswer();

  const { questions: allQuestions, loading: questionsLoading } = useSupabaseQuestionsByTopic(topicId);
  const { topics } = useSupabaseTopics();
  const topic = topics.find((t) => t.id === topicId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { answer: string; correct: boolean }>>({});
  const [finished, setFinished] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | null>(null);
  const [reviewMistakesMode, setReviewMistakesMode] = useState(false);

  const filteredQuestions = useMemo(() => {
    let qs = allQuestions;
    if (difficultyFilter) {
      qs = qs.filter((q) => q.difficulty === difficultyFilter);
    }
    return qs;
  }, [allQuestions, difficultyFilter]);

  // In review-mistakes mode, only show incorrect questions from last run
  const [mistakeQuestions, setMistakeQuestions] = useState<Question[]>([]);
  const activeQuestions = reviewMistakesMode ? mistakeQuestions : filteredQuestions;

  if (questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-2xl px-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!topicId || allQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold text-foreground">לא נמצאו שאלות לנושא זה.</p>
          <Button onClick={() => navigate("/dashboard")} className="rounded-sm">חזרה לדשבורד</Button>
        </div>
      </div>
    );
  }

  if (activeQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold text-foreground">
            {reviewMistakesMode
              ? "אין שאלות שגויות לחזור עליהן."
              : "לא נמצאו שאלות ברמה זו."}
          </p>
          <Button
            onClick={() => {
              if (reviewMistakesMode) {
                setReviewMistakesMode(false);
                setFinished(false);
                setCurrentIndex(0);
                setAnswers({});
              } else {
                setDifficultyFilter(null);
              }
            }}
            className="rounded-sm"
          >
            {reviewMistakesMode ? "חזרה לתרגול" : "הצג את כל השאלות"}
          </Button>
        </div>
      </div>
    );
  }

  const current = activeQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPct = activeQuestions.length > 0
    ? Math.round((answeredCount / activeQuestions.length) * 100)
    : 0;

  const handleAnswer = (index: number, answer: string, correct: boolean) => {
    setAnswers((prev) => ({ ...prev, [index]: { answer, correct } }));
    const q = activeQuestions[index];
    answerQuestion(q.id, correct);
    if (topicId) {
      saveAnswer(q.id, topicId, correct);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= activeQuestions.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setFinished(false);
    setReviewMistakesMode(false);
  };

  const handleReviewMistakes = () => {
    const incorrectIndices = Object.entries(answers)
      .filter(([, a]) => !a.correct)
      .map(([idx]) => Number(idx));
    const mistakes = incorrectIndices.map((idx) => activeQuestions[idx]);
    setMistakeQuestions(mistakes);
    setReviewMistakesMode(true);
    setCurrentIndex(0);
    setAnswers({});
    setFinished(false);
  };

  const handleDifficultyChange = (d: Difficulty | null) => {
    setDifficultyFilter(d);
    setCurrentIndex(0);
    setAnswers({});
    setFinished(false);
    setReviewMistakesMode(false);
  };

  if (finished) {
    const correct = Object.values(answers).filter((a) => a.correct).length;
    const total = activeQuestions.length;
    const pct = Math.round((correct / total) * 100);
    const mistakes = Object.entries(answers)
      .filter(([, a]) => !a.correct)
      .map(([idx]) => ({ index: Number(idx), question: activeQuestions[Number(idx)] }));

    return (
      <div className="min-h-screen bg-background px-4 pb-24 pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto space-y-6"
        >
          <div className="text-center space-y-4">
            <div className="text-6xl">{pct >= 70 ? "🎉" : "📚"}</div>
            <h2 className="text-3xl font-bold text-foreground">
              {reviewMistakesMode ? "סיום חזרה על טעויות" : "סיימת את התרגול!"}
            </h2>
            <p className="text-muted-foreground text-lg">
              ענית נכון על <strong className="text-foreground">{correct}</strong> מתוך{" "}
              <strong className="text-foreground">{total}</strong> שאלות ({pct}%)
            </p>
            <Progress value={pct} className="h-3 max-w-xs mx-auto" />
          </div>

          {/* Mistakes list */}
          {mistakes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-destructive">
                ❌ שאלות שטעית בהן ({mistakes.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mistakes.map(({ question: q }) => (
                  <Card key={q.id} className="border-destructive/20">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium line-clamp-2">{getQuestionTitle(q)}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{typeLabels[q.type]}</span>
                        <span>•</span>
                        <span>{difficultyLabels[q.difficulty]}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {mistakes.length > 0 && (
              <Button className="w-full rounded-sm gap-2" onClick={handleReviewMistakes}>
                <RotateCcw className="h-4 w-4" />
                חזור על טעויות ({mistakes.length})
              </Button>
            )}
            <Button
              variant={mistakes.length > 0 ? "outline" : "default"}
              className="w-full rounded-sm"
              onClick={handleRetry}
            >
              נסה שוב את הכל
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
            שאלה {currentIndex + 1} מתוך {activeQuestions.length}
          </div>
        </div>

        {topic && (
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-primary">
              {topic.icon ?? "📖"} {topic.name}
              {reviewMistakesMode && (
                <span className="text-destructive ms-2 text-xs">(חזרה על טעויות)</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{answeredCount}/{activeQuestions.length} נענו</p>
          </div>
        )}

        {/* Difficulty filter */}
        {!reviewMistakesMode && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">רמת קושי:</span>
            <Badge
              variant="outline"
              className={`cursor-pointer text-xs ${
                difficultyFilter === null
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "hover:bg-muted"
              }`}
              onClick={() => handleDifficultyChange(null)}
            >
              הכל
            </Badge>
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
              const count = allQuestions.filter((q) => q.difficulty === d).length;
              return (
                <Badge
                  key={d}
                  variant="outline"
                  className={`cursor-pointer text-xs ${
                    difficultyFilter === d
                      ? difficultyColors[d]
                      : "hover:bg-muted"
                  }`}
                  onClick={() => handleDifficultyChange(d)}
                >
                  {difficultyLabels[d]} ({count})
                </Badge>
              );
            })}
          </div>
        )}

        {reviewMistakesMode && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground gap-1"
            onClick={handleRetry}
          >
            <XIcon className="h-3 w-3" />
            יציאה מחזרה על טעויות
          </Button>
        )}

        <Progress value={progressPct} className="h-2" />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${reviewMistakesMode}-${currentIndex}`}
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
            {currentIndex + 1 === activeQuestions.length ? "סיום" : "הבא"}
            <ChevronLeft className="h-4 w-4 ms-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
