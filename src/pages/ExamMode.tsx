import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, ChevronLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getRandomQuestions, type Question, type QuizQuestion, type TracingQuestion } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";
import { AiTutor } from "@/components/AiTutor";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";

const EXAM_DURATION = 3 * 60 * 60; // 3 hours in seconds
const EXAM_QUESTIONS = 5;

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

  const examQuestions = useMemo(() => getRandomQuestions(EXAM_QUESTIONS), [started]);

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

  const handleFinish = () => {
    setFinished(true);
    addExamResult(score, EXAM_QUESTIONS);
    examQuestions.forEach((q, i) => {
      if (answers[i]) answerQuestion(q.id, answers[i].correct);
    });
  };

  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center space-y-6"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary text-4xl shadow-lg">
            📝
          </div>
          <h1 className="text-2xl font-bold">מבחן סימולציה</h1>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>⏱️ {EXAM_QUESTIONS} שאלות, 3 שעות</p>
            <p>📊 שאלות אקראיות מכל הנושאים</p>
            <p>🎯 ציון בסוף המבחן</p>
          </div>
          <Button
            onClick={() => setStarted(true)}
            className="w-full gradient-primary text-primary-foreground text-lg py-6 rounded-xl"
          >
            התחל מבחן 🚀
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")}>חזרה לדף הבית</Button>
        </motion.div>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / EXAM_QUESTIONS) * 100);
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center space-y-6"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl gradient-success text-4xl shadow-lg">
            <Trophy className="h-10 w-10 text-success-foreground" />
          </div>
          <h1 className="text-2xl font-bold">סיום מבחן!</h1>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <p className="text-5xl font-extrabold text-gradient-primary">{pct}%</p>
            <p className="text-muted-foreground">{score} מתוך {EXAM_QUESTIONS} נכונות</p>
            <Progress value={pct} className="h-3" />
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/")} variant="outline" className="flex-1">
              דף הבית
            </Button>
            <Button
              onClick={() => { setStarted(false); setFinished(false); setCurrentIndex(0); setAnswers({}); setTimeLeft(EXAM_DURATION); }}
              className="flex-1 gradient-primary text-primary-foreground"
            >
              מבחן חדש
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = examQuestions[currentIndex];

  return (
    <div className="min-h-screen pb-24 pt-4">
      <div className="mx-auto max-w-lg px-4">
        {/* Timer */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-warning" />
            <span className="font-mono font-bold text-warning">{formatTime(timeLeft)}</span>
          </div>
          <span className="text-sm text-muted-foreground">שאלה {currentIndex + 1}/{EXAM_QUESTIONS}</span>
        </div>
        <Progress value={((currentIndex + 1) / EXAM_QUESTIONS) * 100} className="h-2 mb-4" />

        {/* Question */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <p className="font-semibold text-card-foreground">{q.type === "coding" ? (q as any).title : (q as any).question}</p>
          {(q as any).code && <PythonCodeBlock code={(q as any).code} />}
          {q.type === "coding" && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{(q as any).description}</p>}

          {q.type === "quiz" && (
            <div className="space-y-2">
              {(q as QuizQuestion).options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers(a => ({ ...a, [currentIndex]: { answer: opt, correct: i === (q as QuizQuestion).correctIndex } }))}
                  className={`w-full rounded-xl border p-3 text-right text-sm transition-all ${
                    answers[currentIndex]?.answer === opt ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {(q.type === "tracing" || q.type === "coding") && (
            <input
              dir="ltr"
              className="w-full rounded-xl border border-border bg-background p-3 font-mono text-sm"
              placeholder={q.type === "tracing" ? "הקלד את הפלט..." : "כתוב תשובה מקוצרת..."}
              value={answers[currentIndex]?.answer || ""}
              onChange={e => {
                const val = e.target.value;
                const correct = q.type === "tracing" ? val.trim() === (q as TracingQuestion).correctAnswer.trim() : val.trim().length > 0;
                setAnswers(a => ({ ...a, [currentIndex]: { answer: val, correct } }));
              }}
            />
          )}
        </div>

        <div className="flex gap-3 mt-4">
          {currentIndex > 0 && (
            <Button variant="outline" onClick={() => setCurrentIndex(i => i - 1)} className="flex-1 gap-2">
              <ArrowRight className="h-4 w-4" /> הקודמת
            </Button>
          )}
          {currentIndex < EXAM_QUESTIONS - 1 ? (
            <Button onClick={() => setCurrentIndex(i => i + 1)} className="flex-1 gradient-primary text-primary-foreground gap-2">
              הבאה <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="flex-1 gradient-success text-success-foreground gap-2">
              סיום מבחן ✓
            </Button>
          )}
        </div>
      </div>

      <AiTutor
        questionContext={`שאלה במבחן סימולציה\nסוג: ${q.type}\n${
          q.type === "coding" ? `כותרת: ${(q as any).title}\nתיאור: ${(q as any).description}` :
          `שאלה: ${(q as any).question}\n${(q as any).code ? `קוד:\n${(q as any).code}` : ""}`
        }`}
      />
    </div>
  );
};

export default ExamMode;
