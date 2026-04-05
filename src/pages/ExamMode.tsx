import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trophy, Flag, ChevronLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Question } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";
import { ExamQuestionRenderer } from "@/components/exam/ExamQuestionRenderer";
import { ExamReviewScreen } from "@/components/exam/ExamReviewScreen";
import { useSupabaseExamQuestions } from "@/hooks/useSupabaseQuestions";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";

const EXAM_DURATION = 3 * 60 * 60;
const EXAM_QUESTIONS = 6;

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const ExamMode = () => {
  const navigate = useNavigate();
  const { answerQuestion, addExamResult } = useProgress();
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { answer: string; correct: boolean }>>({});
  const [finished, setFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());

  const { questions: examQuestions, loading: questionsLoading } = useSupabaseExamQuestions(EXAM_QUESTIONS, started);
  const { topics } = useSupabaseTopics();

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  const score = Object.values(answers).filter(a => a.correct).length;
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = examQuestions.length || EXAM_QUESTIONS;
  const unansweredCount = totalQuestions - answeredCount;

  const handleAnswer = (index: number, answer: string, correct: boolean) => {
    setAnswers(a => ({ ...a, [index]: { answer, correct } }));
  };

  const toggleFlag = (index: number) => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleFinish = () => {
    setFinished(true);
    addExamResult(score, totalQuestions);
    examQuestions.forEach((q, i) => {
      if (answers[i]) answerQuestion(q.id, answers[i].correct);
    });
  };

  // Start screen
  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center space-y-6"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-4xl">📝</div>
          <h1 className="text-2xl font-bold text-foreground">מבחן סימולציה</h1>
          <div className="rounded-lg border border-foreground/10 bg-card p-4 space-y-2 text-sm text-muted-foreground text-right">
            <p>⏱️ {EXAM_QUESTIONS} שאלות, 3 שעות</p>
            <p>📊 שאלה אחת לפחות מכל נושא</p>
            <p>🎯 ציון מפורט בסוף המבחן</p>
            <p>🚩 אפשר לסמן שאלות לחזרה</p>
          </div>
          <Button onClick={() => setStarted(true)} className="w-full text-lg py-6 rounded-lg">
            התחל מבחן
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
            חזרה לדף הבית
          </Button>
        </motion.div>
      </div>
    );
  }

  // Loading questions
  if (questionsLoading || examQuestions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pb-24">
        <div className="w-full max-w-sm space-y-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-64 w-full" />
          <p className="text-sm text-muted-foreground">טוען שאלות...</p>
        </div>
      </div>
    );
  }

  // Review screen
  if (finished && showReview) {
    return (
      <ExamReviewScreen
        examQuestions={examQuestions}
        answers={answers}
        onBack={() => setShowReview(false)}
      />
    );
  }

  // Results screen
  if (finished) {
    const pct = Math.round((score / totalQuestions) * 100);
    const topicBreakdown = topics.map(t => {
      const indices = examQuestions.map((q, i) => q.topic === t.id ? i : -1).filter(i => i >= 0);
      const correct = indices.filter(i => answers[i]?.correct).length;
      return { topic: t, total: indices.length, correct };
    }).filter(tb => tb.total > 0);

    return (
      <div className="flex min-h-screen items-center justify-center px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center space-y-6"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-success/10">
            <Trophy className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">סיום מבחן!</h1>
          <div className="rounded-lg border border-foreground/10 bg-card p-6 space-y-4">
            <p className="text-5xl font-extrabold text-foreground">{pct}%</p>
            <p className="text-muted-foreground">{score} מתוך {totalQuestions} נכונות</p>
            <Progress value={pct} className="h-2.5" />

            {/* Topic breakdown */}
            <div className="space-y-2 text-right">
              <p className="text-sm font-semibold text-foreground">פירוט לפי נושא:</p>
              {topicBreakdown.map(tb => (
                <div key={tb.topic.id} className="flex items-center justify-between text-sm">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tb.correct === tb.total ? "bg-success/10 text-success" : tb.correct > 0 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                    {tb.correct}/{tb.total}
                  </span>
                  <span className="text-muted-foreground">{tb.topic.icon ?? "📖"} {tb.topic.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setShowReview(true)} variant="outline" className="w-full gap-2">
              סקירת שאלות ותשובות
            </Button>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/dashboard")} variant="outline" className="flex-1">דף הבית</Button>
              <Button
                onClick={() => { setStarted(false); setFinished(false); setCurrentIndex(0); setAnswers({}); setTimeLeft(EXAM_DURATION); setFlagged(new Set()); setShowReview(false); }}
                className="flex-1"
              >
                מבחן חדש
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Exam question screen
  const q = examQuestions[currentIndex];
  const isFlagged = flagged.has(currentIndex);
  const flaggedList = Array.from(flagged).sort((a, b) => a - b);
  const isLowTime = timeLeft <= 15 * 60;

  return (
    <div className="min-h-screen pb-24 pt-4">
      <div className="mx-auto max-w-lg px-4">
        {/* Timer & progress */}
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center gap-2 text-sm ${isLowTime ? "animate-pulse" : ""}`}>
            <Clock className={`h-4 w-4 ${isLowTime ? "text-destructive" : "text-warning"}`} />
            <span className={`font-mono font-bold ${isLowTime ? "text-destructive" : "text-warning"}`}>
              {formatTime(timeLeft)}
            </span>
            {isLowTime && <span className="text-xs text-destructive font-medium">זמן אוזל!</span>}
          </div>
          <span className="text-sm text-muted-foreground">שאלה {currentIndex + 1}/{totalQuestions}</span>
        </div>
        <Progress value={((currentIndex + 1) / totalQuestions) * 100} className="h-2 mb-2" />

        {/* Question navigator pills */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {examQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`flex-shrink-0 h-9 w-9 rounded-lg text-xs font-bold transition-all ${
                i === currentIndex ? "bg-primary text-primary-foreground ring-2 ring-primary/50" :
                answers[i] ? "bg-success/20 text-success border border-success/30" :
                "bg-muted text-muted-foreground border border-foreground/10"
              } ${flagged.has(i) ? "ring-2 ring-warning/60" : ""}`}
            >
              {flagged.has(i) ? "🚩" : i + 1}
            </button>
          ))}
        </div>

        {/* Flag button */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => toggleFlag(currentIndex)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              isFlagged ? "bg-warning/20 text-warning border border-warning/30" : "bg-muted text-muted-foreground border border-foreground/10 hover:border-warning/50"
            }`}
          >
            <Flag className="h-3.5 w-3.5" />
            {isFlagged ? "מסומנת לחזרה" : "סמן לחזרה"}
          </button>
          {flaggedList.length > 0 && (
            <span className="text-xs text-muted-foreground">🚩 {flaggedList.length} מסומנות</span>
          )}
        </div>

        {/* Question content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="rounded-lg border border-foreground/10 bg-card p-5"
          >
            <ExamQuestionRenderer
              question={q}
              currentAnswer={answers[currentIndex]}
              onAnswer={(answer, correct) => handleAnswer(currentIndex, answer, correct)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-4">
          {currentIndex > 0 && (
            <Button variant="outline" onClick={() => setCurrentIndex(i => i - 1)} className="flex-1 gap-2">
              <ArrowRight className="h-4 w-4" /> הקודמת
            </Button>
          )}
          {currentIndex < totalQuestions - 1 ? (
            <Button onClick={() => setCurrentIndex(i => i + 1)} className="flex-1 gap-2">
              הבאה <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="flex-1 gap-2 bg-success text-success-foreground hover:bg-success/90">
                  סיום מבחן
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>סיום המבחן?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {unansweredCount > 0
                      ? `יש לך עוד ${unansweredCount} שאלות שלא נענו. בטוח שברצונך לסיים?`
                      : "ענית על כל השאלות. ברצונך לסיים את המבחן?"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row-reverse gap-2">
                  <AlertDialogAction onClick={handleFinish}>כן, סיים מבחן</AlertDialogAction>
                  <AlertDialogCancel>חזור למבחן</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamMode;
