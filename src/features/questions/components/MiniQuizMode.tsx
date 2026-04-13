/**
 * MiniQuizMode — 5-question topic assessment with no hints or streaks.
 *
 * Question selection: 1 easy + 2 medium + 1 hard + 1 random (mixed).
 * If a difficulty bucket is empty the slot is filled from a fallback pool.
 * Questions already answered this session are deprioritised (shown last).
 *
 * On completion calls:
 *   onComplete({ passed, correct, total, wrongQuestions })
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X as XIcon, Clock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExamQuestionRenderer } from "@/components/exam/ExamQuestionRenderer";
import type { Question, Difficulty } from "@/data/questions";

export interface MiniQuizResult {
  passed: boolean;
  correct: number;
  total: number;
  wrongQuestions: Question[];
}

interface Props {
  topicName: string;
  topicIcon: string | null;
  allQuestions: Question[];
  /** Questions already answered in this practice session (deprioritised) */
  sessionAnsweredIds?: Set<string>;
  onComplete: (result: MiniQuizResult) => void;
  onClose: () => void;
}

const QUIZ_SIZE = 5;

function pickRandom<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function selectQuizQuestions(
  allQuestions: Question[],
  sessionAnsweredIds: Set<string>
): Question[] {
  if (allQuestions.length === 0) return [];

  // Separate by difficulty
  const byDifficulty: Record<Difficulty, Question[]> = {
    easy: [],
    medium: [],
    hard: [],
  };
  for (const q of allQuestions) {
    byDifficulty[q.difficulty].push(q);
  }

  // Prefer fresh (not answered this session) within each bucket
  const fresh = (arr: Question[]) =>
    arr.filter((q) => !sessionAnsweredIds.has(q.id));
  const freshOrAll = (arr: Question[]) => (fresh(arr).length > 0 ? fresh(arr) : arr);

  const selected: Set<string> = new Set();
  const result: Question[] = [];

  function pick(pool: Question[]) {
    const eligible = pool.filter((q) => !selected.has(q.id));
    const q = pickRandom(eligible);
    if (q) {
      selected.add(q.id);
      result.push(q);
      return true;
    }
    return false;
  }

  // Slots: 1 easy, 2 medium, 1 hard, 1 any
  const targets: [number, Difficulty | null][] = [
    [1, "easy"],
    [2, "medium"],
    [1, "hard"],
    [1, null],
  ];

  for (const [count, diff] of targets) {
    const pool = diff ? freshOrAll(byDifficulty[diff]) : freshOrAll(allQuestions);
    let picked = 0;
    while (picked < count) {
      if (!pick(pool)) {
        // Fallback to any remaining question
        if (!pick(allQuestions.filter((q) => !selected.has(q.id)))) break;
      } else {
        picked++;
      }
    }
  }

  // If we still don't have enough, fill from any remaining
  while (result.length < Math.min(QUIZ_SIZE, allQuestions.length)) {
    const remaining = allQuestions.filter((q) => !selected.has(q.id));
    const q = pickRandom(remaining);
    if (!q) break;
    selected.add(q.id);
    result.push(q);
  }

  return result;
}

function useElapsedTimer() {
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    ref.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, []);

  const stop = useCallback(() => {
    if (ref.current) {
      clearInterval(ref.current);
      ref.current = null;
    }
  }, []);

  const formatted = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return { formatted, stop };
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: "קל",
  medium: "בינוני",
  hard: "קשה",
};

const typeLabels: Record<string, string> = {
  quiz: "רב-ברירה",
  tracing: "מעקב קוד",
  coding: "כתיבת קוד",
  "fill-blank": "השלמה",
};

function getQuestionText(q: Question): string {
  if (q.type === "coding" || q.type === "fill-blank") return q.title;
  return q.question;
}

export function MiniQuizMode({ topicName, topicIcon, allQuestions, sessionAnsweredIds = new Set(), onComplete, onClose }: Props) {
  const [quizQuestions] = useState(() =>
    selectQuizQuestions(allQuestions, sessionAnsweredIds)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer: string; correct: boolean }>>({});
  const [done, setDone] = useState(false);

  const { formatted: timerStr, stop: stopTimer } = useElapsedTimer();

  const handleAnswer = (questionId: string, answer: string, correct: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { answer, correct } }));
  };

  const handleNext = () => {
    if (currentIndex + 1 >= quizQuestions.length) {
      stopTimer();
      setDone(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
  };

  const current = quizQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPct = quizQuestions.length > 0
    ? Math.round((answeredCount / quizQuestions.length) * 100)
    : 0;

  if (done) {
    const correct = Object.values(answers).filter((a) => a.correct).length;
    const total = quizQuestions.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = pct >= 80;
    const wrongQuestions = quizQuestions.filter(
      (q) => answers[q.id] && !answers[q.id].correct
    );

    const result: MiniQuizResult = { passed, correct, total, wrongQuestions };

    return (
      <div className="min-h-screen bg-background px-4 pb-24 pt-8" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto space-y-6"
        >
          <div className="text-center space-y-3">
            <div className="text-6xl">{passed ? "🎉" : "💪"}</div>
            <h2 className="text-3xl font-bold text-foreground">
              {passed ? "כל הכבוד! עברת את המבחן!" : "כמעט! בוא נחזור על מה שצריך חיזוק"}
            </h2>
            <p className="text-muted-foreground text-lg">
              ענית נכון על{" "}
              <strong className="text-foreground">{correct}</strong> מתוך{" "}
              <strong className="text-foreground">{total}</strong> שאלות ({pct}%)
            </p>
            <Progress value={pct} className="h-3 max-w-xs mx-auto" />
          </div>

          {passed ? (
            <Card className="border-success/30 bg-success/5">
              <CardContent className="p-4 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto" />
                <p className="font-semibold text-success">
                  הנושא סומן כ"הושלם" +50 XP!
                </p>
                <p className="text-xs text-muted-foreground">
                  הנושא הבא פתוח לתרגול.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-warning/30 bg-warning/5">
              <CardContent className="p-4 space-y-2">
                <p className="font-semibold text-warning text-sm flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  נדרש 80% לסיום הנושא. חזור לתרגל ונסה שוב!
                </p>
              </CardContent>
            </Card>
          )}

          {wrongQuestions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-destructive">
                ❌ שאלות שטעית ({wrongQuestions.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {wrongQuestions.map((q) => (
                  <Card key={q.id} className="border-destructive/20">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium line-clamp-2">
                        {getQuestionText(q)}
                      </p>
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
            <Button
              className="w-full rounded-sm"
              onClick={() => onComplete(result)}
            >
              {passed ? "המשך לדשבורד" : "חזרה לתרגול"}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="min-h-screen bg-background pb-40 pt-4" dir="rtl">
      <div className="mx-auto max-w-2xl px-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1">
            <XIcon className="h-4 w-4" />
            יציאה
          </Button>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-mono text-muted-foreground">{timerStr}</span>
          </div>
        </div>

        {/* Assessment badge */}
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">
            מבחן נושא
          </Badge>
          <p className="text-sm font-semibold text-primary">
            {topicIcon ?? "📖"} {topicName}
          </p>
          <span className="text-xs text-muted-foreground font-mono ms-auto">
            שאלה {currentIndex + 1} מתוך {quizQuestions.length}
          </span>
        </div>

        <Progress value={progressPct} className="h-2" />

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
      </div>

      {/* Sticky nav */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-foreground/10 bg-background/95 backdrop-blur-sm pb-16">
        <div className="mx-auto max-w-2xl px-4 py-2 flex gap-3">
          <Button
            className="flex-1 min-h-[44px] touch-manipulation"
            onClick={handleNext}
            disabled={!answers[current.id]}
          >
            {currentIndex + 1 >= quizQuestions.length ? "סיום מבחן" : "הבא"}
            <ArrowLeft className="h-4 w-4 ms-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
