import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, X as XIcon, Lightbulb } from "lucide-react";
import { FloatingAIButton } from "@/components/FloatingAIButton";
import { TopicTutorial } from "@/components/TopicTutorial";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { ExamQuestionRenderer } from "@/components/exam/ExamQuestionRenderer";
import { useSupabaseQuestionsByTopic, useSupabaseQuestionCount } from "@/hooks/useSupabaseQuestions";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";
import { useSaveAnswer } from "@/hooks/useSaveAnswer";
import { getTutorialByTopicId } from "@/data/topicTutorials";
import {
  selectNextQuestion,
  type SelectableQuestion,
} from "@/features/progress/lib/adaptiveSelection";
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

const encouragingMessages = [
  "כל הכבוד! 🎯",
  "מצוין! ממשיכים! 💪",
  "נכון מאוד! אתה על הדרך הנכונה! ⭐",
  "יופי! הבנת את זה מעולה! 🌟",
  "תשובה נכונה! אלוף/ה! 🏆",
  "בול! תמשיך/י ככה! 🔥",
  "מדהים! ההבנה שלך מתחזקת! 💡",
  "נהדר! עוד צעד לקראת המבחן! 📚",
  "אחלה! את/ה שולט/ת בחומר! ✨",
  "יפה מאוד! ההשקעה משתלמת! 🎉",
];

function getQuestionTitle(q: Question): string {
  if (q.type === "coding" || q.type === "fill-blank") return q.title;
  return q.question;
}

function getHintForQuestion(q: Question): string | null {
  if (q.type === "quiz") {
    if (q.code) return "קרא/י את הקוד שורה אחר שורה ועקוב/י אחרי הערכים המשתנים.";
    return "נסה/י לפסול תשובות שבוודאות לא נכונות כדי לצמצם את האפשרויות.";
  }
  if (q.type === "tracing") {
    return "בנה/י טבלת מעקב: רשום/י את ערכי המשתנים בכל שלב של הלולאה.";
  }
  if (q.type === "coding") {
    return "התחל/י מלכתוב את חתימת הפונקציה, אחר כך חשוב/י על המקרה הפשוט ביותר.";
  }
  if (q.type === "fill-blank") {
    const blanks = q.blanks;
    if (blanks.length > 0 && blanks[0].hint) return blanks[0].hint;
    return "קרא/י את הקוד סביב החלקים החסרים כדי להבין מה צריך להשלים.";
  }
  return null;
}

const PracticePage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { answerQuestion, progress } = useProgress();
  const { saveAnswer } = useSaveAnswer();

  const { questions: allQuestions, loading: questionsLoading } = useSupabaseQuestionsByTopic(topicId);
  const { topics } = useSupabaseTopics();
  const topic = topics.find((t) => t.id === topicId);
  const questionCount = useSupabaseQuestionCount(topicId);

  const tutorial = topicId ? getTutorialByTopicId(topicId) : undefined;
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer: string; correct: boolean }>>({});
  const [finished, setFinished] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | null>(null);
  const [reviewMistakesMode, setReviewMistakesMode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [lastFeedbackIdx, setLastFeedbackIdx] = useState(-1);

  // Adaptive ordering: use selectNextQuestion to pick the first question
  // based on the learner's current progress, then keep the rest in the
  // existing order. Computed once per topic load so it doesn't shuffle on
  // every answer.
  const adaptiveQuestions = useMemo(() => {
    if (!topicId || allQuestions.length === 0) return allQuestions;
    const pool = allQuestions as unknown as SelectableQuestion[];
    const first = selectNextQuestion(pool, progress, topicId);
    if (!first) return allQuestions;
    return [
      allQuestions.find((q) => q.id === first.id)!,
      ...allQuestions.filter((q) => q.id !== first.id),
    ];
    // intentionally omit `progress` so the order is stable mid-session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allQuestions, topicId]);

  const filteredQuestions = useMemo(() => {
    let qs = adaptiveQuestions;
    if (difficultyFilter) {
      qs = qs.filter((q) => q.difficulty === difficultyFilter);
    }
    return qs;
  }, [adaptiveQuestions, difficultyFilter]);

  const [mistakeQuestions, setMistakeQuestions] = useState<Question[]>([]);
  const activeQuestions = reviewMistakesMode ? mistakeQuestions : filteredQuestions;

  const getRandomEncouragement = useCallback(() => {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * encouragingMessages.length);
    } while (idx === lastFeedbackIdx && encouragingMessages.length > 1);
    setLastFeedbackIdx(idx);
    return encouragingMessages[idx];
  }, [lastFeedbackIdx]);

  // Show tutorial first if available
  if (showTutorial && tutorial && !questionsLoading && allQuestions.length > 0) {
    return (
      <div className="min-h-screen bg-background pb-24 pt-4">
        <div className="mx-auto max-w-2xl px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4">
            ← חזרה לדשבורד
          </Button>
          <TopicTutorial
            tutorial={tutorial}
            topicName={topic?.name ?? ""}
            topicIcon={topic?.icon ?? "📖"}
            questionCount={questionCount}
            onStartPractice={() => setShowTutorial(false)}
          />
        </div>
      </div>
    );
  }

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

  const handleAnswer = (questionId: string, answer: string, correct: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { answer, correct } }));
    answerQuestion(questionId, correct);
    if (topicId) {
      saveAnswer(questionId, topicId, correct);
    }
    setShowHint(false);
    if (correct) {
      setFeedbackMessage(getRandomEncouragement());
      setTimeout(() => setFeedbackMessage(null), 3000);
    } else {
      setFeedbackMessage(null);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= activeQuestions.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setShowHint(false);
    setFeedbackMessage(null);
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
    setShowHint(false);
    setFeedbackMessage(null);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setFinished(false);
    setReviewMistakesMode(false);
    setShowHint(false);
    setFeedbackMessage(null);
  };

  const handleReviewMistakes = () => {
    const incorrectIds = Object.entries(answers)
      .filter(([, a]) => !a.correct)
      .map(([id]) => id);
    const mistakes = activeQuestions.filter((q) => incorrectIds.includes(q.id));
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
      .map(([id]) => activeQuestions.find((q) => q.id === id))
      .filter((q): q is Question => q != null);

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

          {mistakes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-destructive">
                ❌ שאלות שטעית בהן ({mistakes.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mistakes.map((q) => (
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

  const hint = getHintForQuestion(current);

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

        {/* Encouraging feedback message */}
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="rounded-lg bg-success/10 border border-success/30 p-3 text-center text-sm font-semibold text-success"
            >
              {feedbackMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ExamQuestionRenderer
              question={current}
              currentAnswer={answers[current.id]}
              onAnswer={(answer, correct) => handleAnswer(current.id, answer, correct)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Hint button */}
        {hint && !answers[current.id] && (
          <div className="space-y-2">
            {!showHint ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs border-yellow-300/50 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
                onClick={() => setShowHint(true)}
              >
                <Lightbulb className="h-3.5 w-3.5" />
                רמז
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg border border-yellow-300/50 bg-yellow-50 dark:bg-yellow-950/20 p-3"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-yellow-900 dark:text-yellow-200">{hint}</p>
                </div>
              </motion.div>
            )}
          </div>
        )}

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

          <Button className="flex-1" onClick={handleNext} disabled={!answers[current.id]}>
            {currentIndex + 1 === activeQuestions.length ? "סיום" : "הבא"}
            <ChevronLeft className="h-4 w-4 ms-1" />
          </Button>
        </div>
      </div>

      <FloatingAIButton
        question={current}
        userAnswer={answers[current.id]?.answer}
      />
    </div>
  );
};

export default PracticePage;
