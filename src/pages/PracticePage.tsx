import { useState, useMemo, useCallback, useEffect, useRef, Fragment } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, X as XIcon, Lightbulb, TrendingUp, ArrowLeft, HelpCircle, ClipboardCheck } from "lucide-react";
import { FloatingAIButton } from "@/components/FloatingAIButton";
import { TopicTutorial } from "@/components/TopicTutorial";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { ExamQuestionRenderer } from "@/components/exam/ExamQuestionRenderer";
import { useSupabaseQuestionsByTopic, useSupabaseQuestionCount } from "@/hooks/useSupabaseQuestions";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";
import { useSupabaseAnsweredQuestions } from "@/hooks/useSupabaseAnsweredQuestions";
import { useLocalProgressMigration } from "@/hooks/useLocalProgressMigration";
import { useSaveAnswer } from "@/hooks/useSaveAnswer";
import { useWeakPatterns } from "@/hooks/useWeakPatterns";
import { useTopicCompletion } from "@/hooks/useTopicCompletion";
import { MiniQuizMode, type MiniQuizResult } from "@/features/questions/components/MiniQuizMode";
import { getTutorialByTopicId, resolveTopicId } from "@/data/topicTutorials";
import {
  selectNextQuestion,
  type ProgressLike,
  type SelectableQuestion,
} from "@/features/progress/lib/adaptiveSelection";
import posthog from "posthog-js";
import type { Difficulty, Question } from "@/data/questions";
import { useGuestThreshold } from "@/features/guest/hooks/useGuestThreshold";
import { SignupWall } from "@/features/guest/components/SignupWall";
import { toast } from "sonner";
import { patternFamilyLabel } from "@/lib/patternFamilyLabels";
import { fireTopicMasteredConfetti } from "@/shared/lib/confetti";

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
  const { topicId: rawTopicId } = useParams<{ topicId: string }>();
  const resolved = resolveTopicId(rawTopicId ?? "");
  const topicId = resolved?.uuid ?? rawTopicId;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { answerQuestion, getWeakTopics, progress, updateLastPosition } = useProgress();
  const { saveAnswer } = useSaveAnswer();
  const { markTopicComplete, isTopicComplete } = useTopicCompletion();
  const { showWall, increment: incrementGuestCount, dismiss: dismissWall } = useGuestThreshold();

  // One-time: copy any legacy localStorage progress into Supabase.
  useLocalProgressMigration();

  // Remote source of truth for adaptive selection. Falls back to the
  // local `progress` object when Supabase has nothing for this topic yet.
  const { answeredQuestions: remoteAnswered } = useSupabaseAnsweredQuestions(topicId);
  const { weak: weakPatternStats } = useWeakPatterns();

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

  // Unified learning flow — session progress tracking
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  // "I don't understand" — pin next N questions to easy difficulty
  const [easyPinRemaining, setEasyPinRemaining] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);
  // Mastery milestone — shown once when 80%+ over 6+ attempts
  const [masteryShown, setMasteryShown] = useState(false);
  // Mini-quiz assessment mode — triggered from mastery banner
  const [miniQuizActive, setMiniQuizActive] = useState(false);

  // Phase C / D pedagogy state
  // Entering from LearnPage (/practice/:topicId?from=learn) starts in guided_practice (Phase C).
  // Direct navigation from the dashboard skips to independent_practice (Phase D).
  const initialPhase: "guided_practice" | "independent_practice" =
    searchParams.get("from") === "learn" ? "guided_practice" : "independent_practice";
  const [practicePhase, setPracticePhase] = useState<"guided_practice" | "independent_practice">(initialPhase);
  const [showPhaseTransition, setShowPhaseTransition] = useState(false);
  // Tracks consecutive correct answers on easy questions in guided_practice mode.
  // Reaching 3 triggers the Phase C → D transition.
  const [guidedEasyCorrectStreak, setGuidedEasyCorrectStreak] = useState(0);
  // Phase F: pattern families being reinforced in a pattern-targeted review session.
  const [patternReviewFamilies, setPatternReviewFamilies] = useState<string[]>([]);

  // Adaptive queue: the list of questions presented in this session. Grows
  // by one each time the learner advances, with each new question chosen
  // by `selectNextQuestion` based on the latest in-memory answers. This
  // replaces the old "pick the first question, then natural order" logic
  // so every step of the practice loop is adaptive.
  //
  // Progress source: prefer Supabase answers (survives across devices);
  // fall back to the local progress hook when the remote set is empty
  // (e.g. offline / first load before the migration runs).
  const [adaptiveQueue, setAdaptiveQueue] = useState<Question[]>([]);
  const sessionAnswersRef = useRef<Record<string, { correct: boolean; attempts: number }>>({});
  // Tracks which (topic, allQuestions) combination the queue has been seeded
  // for, so we only re-seed when those inputs actually change.
  const seededKeyRef = useRef<string | null>(null);

  const globalWeakPatterns = useMemo(
    () => new Set(weakPatternStats.map((s) => s.patternFamily)),
    [weakPatternStats]
  );

  const buildSelectionProgress = useCallback((): ProgressLike => {
    // Merge remote history (prior sessions) with in-memory session answers
    // so a question answered this session is immediately deprioritised.
    const merged: Record<string, { correct: boolean; attempts: number }> = {};
    if (Object.keys(remoteAnswered).length > 0) {
      for (const [id, rec] of Object.entries(remoteAnswered)) {
        merged[id] = { correct: rec.correct, attempts: rec.attempts };
      }
    } else {
      for (const [id, rec] of Object.entries(progress.answeredQuestions)) {
        merged[id] = { correct: rec.correct, attempts: rec.attempts };
      }
    }
    for (const [id, rec] of Object.entries(sessionAnswersRef.current)) {
      merged[id] = rec;
    }
    return { answeredQuestions: merged };
  }, [remoteAnswered, progress.answeredQuestions]);

  const pickNextForQueue = useCallback(
    (currentQueue: Question[]): Question | null => {
      if (!topicId || allQuestions.length === 0) return null;
      const queueIds = new Set(currentQueue.map((q) => q.id));
      let remaining = allQuestions.filter((q) => !queueIds.has(q.id));
      // guided_practice (Phase C): pin to easy questions by default
      if (practicePhase === "guided_practice") {
        const easyOnly = remaining.filter((q) => q.difficulty === "easy");
        if (easyOnly.length > 0) remaining = easyOnly;
      }
      // "I don't understand" easy-pin: prefer easy questions when active
      if (easyPinRemaining > 0) {
        const easyOnly = remaining.filter((q) => q.difficulty === "easy");
        if (easyOnly.length > 0) remaining = easyOnly;
      }
      if (remaining.length === 0) return null;
      const pool = remaining as unknown as SelectableQuestion[];
      const next = selectNextQuestion(pool, buildSelectionProgress(), topicId, {
        globalWeakPatterns,
      });
      if (!next) return null;
      return allQuestions.find((q) => q.id === next.id) ?? null;
    },
    [allQuestions, topicId, buildSelectionProgress, globalWeakPatterns, easyPinRemaining, practicePhase]
  );

  // Seed the queue once all the inputs needed for adaptive selection are
  // available (questions loaded). Re-seed when the topic or question set
  // changes. We compute the seed synchronously during render using a
  // ref-tracked key so `activeQuestions` is non-empty on the very first
  // render after `allQuestions` loads — avoiding a flash of the empty
  // "no questions at this difficulty" screen. React's set-state during
  // render is safe here because the seededKeyRef guard makes it converge
  // after one render.
  //
  // Issue #95: if the user has a saved `lastPosition` for this topic
  // (from user_profiles for authed users, or localStorage for guests),
  // build the adaptive queue out to that index so they resume on the
  // exact question they were on. The adaptive selection is deterministic
  // given the same answer history, so iteratively picking N questions
  // reproduces the same sequence as the original session.
  let effectiveQueue = adaptiveQueue;
  if (
    topicId &&
    allQuestions.length > 0 &&
    !reviewMistakesMode &&
    !difficultyFilter &&
    seededKeyRef.current !== `${topicId}:${allQuestions.length}`
  ) {
    seededKeyRef.current = `${topicId}:${allQuestions.length}`;
    sessionAnswersRef.current = {};
    const savedIdx = Math.min(
      Math.max(progress.lastPosition?.[topicId] ?? 0, 0),
      allQuestions.length - 1
    );
    const queue: Question[] = [];
    while (queue.length <= savedIdx) {
      const queueIds = new Set(queue.map((q) => q.id));
      const remaining = allQuestions.filter((q) => !queueIds.has(q.id));
      if (remaining.length === 0) break;
      const pool = remaining as unknown as SelectableQuestion[];
      const next = selectNextQuestion(pool, buildSelectionProgress(), topicId, {
        globalWeakPatterns,
      });
      const picked = next
        ? (allQuestions.find((q) => q.id === next.id) ?? remaining[0])
        : remaining[0];
      queue.push(picked);
    }
    if (
      adaptiveQueue.length !== queue.length ||
      (queue.length > 0 && adaptiveQueue[0]?.id !== queue[0].id)
    ) {
      effectiveQueue = queue;
      setAdaptiveQueue(queue);
      const targetIdx = Math.min(savedIdx, queue.length - 1);
      if (currentIndex !== targetIdx) setCurrentIndex(targetIdx);
    }
  }

  // Clear the seed key when the user enters a non-adaptive mode so that
  // returning to the default flow re-seeds cleanly.
  useEffect(() => {
    if (reviewMistakesMode || difficultyFilter) {
      seededKeyRef.current = null;
    }
  }, [reviewMistakesMode, difficultyFilter]);

  // Track quiz_start when practice begins without a tutorial
  const trackedStartRef = useRef(false);
  useEffect(() => {
    if (!showTutorial && !questionsLoading && allQuestions.length > 0 && !trackedStartRef.current) {
      if (!tutorial) {
        posthog.capture("quiz_start", { topic_id: topicId, topic_name: topic?.name });
      }
      trackedStartRef.current = true;
    }
  }, [showTutorial, questionsLoading, allQuestions.length, tutorial, topicId, topic?.name]);

  // Track quiz_completion when a session finishes
  useEffect(() => {
    if (finished && Object.keys(answers).length > 0) {
      const correct = Object.values(answers).filter((a) => a.correct).length;
      const total = activeQuestions.length;
      posthog.capture("quiz_completion", {
        topic_id: topicId,
        correct,
        total,
        score_pct: total > 0 ? Math.round((correct / total) * 100) : 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  // Phase C: auto-show hint 10 seconds after a wrong answer in guided_practice mode.
  // This is proactive (not on-demand) scaffolding per the pedagogy spec §4.3.
  useEffect(() => {
    if (practicePhase !== "guided_practice") return;
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;
    const currentAnswer = answers[currentQ.id];
    if (!currentAnswer || currentAnswer.correct) return;
    if (showHint) return;
    const timer = setTimeout(() => setShowHint(true), 10_000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practicePhase, currentIndex, activeQuestions, answers, showHint]);

  const filteredQuestions = useMemo(() => {
    if (difficultyFilter) {
      return allQuestions.filter((q) => q.difficulty === difficultyFilter);
    }
    return effectiveQueue;
    // effectiveQueue is derived from adaptiveQueue + seeding branch;
    // re-memoising on each render is cheap and correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adaptiveQueue, allQuestions, difficultyFilter, effectiveQueue]);

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
            onStartPractice={() => {
              posthog.capture("quiz_start", { topic_id: topicId, topic_name: topic?.name });
              setShowTutorial(false);
            }}
          />
        </div>
      </div>
    );
  }

  // Mini-quiz assessment mode — full-screen replacement of the practice UI
  if (miniQuizActive && topicId && allQuestions.length > 0) {
    const sessionIds = new Set(Object.keys(answers));
    return (
      <MiniQuizMode
        topicName={topic?.name ?? ""}
        topicIcon={topic?.icon ?? null}
        allQuestions={allQuestions}
        sessionAnsweredIds={sessionIds}
        onComplete={async (result: MiniQuizResult) => {
          setMiniQuizActive(false);
          if (result.passed) {
            await markTopicComplete(topicId);
            fireTopicMasteredConfetti();
            toast.success("כל הכבוד! הנושא הושלם! 🎉", { duration: 5000 });
            posthog.capture("mini_quiz_passed", { topic_id: topicId });
          } else {
            posthog.capture("mini_quiz_failed", { topic_id: topicId, correct: result.correct });
          }
        }}
        onClose={() => setMiniQuizActive(false)}
      />
    );
  }

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 pt-4">
        <div className="mx-auto max-w-2xl px-4 space-y-5">
          {/* Topic header skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          {/* Progress bar skeleton */}
          <Skeleton className="h-1.5 w-full rounded-full" />
          {/* Question card skeleton */}
          <div className="rounded-lg border border-foreground/10 bg-card p-5 space-y-4">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            {/* Answer options */}
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-11 w-full rounded-lg" />
            ))}
          </div>
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
  // In adaptive mode, the queue grows as the learner advances; use the
  // total number of questions in the topic as the stable denominator so
  // the counter doesn't jump (1/1 → 2/2 → …). In filter / mistakes mode
  // we still know the full list up front.
  const totalTarget =
    reviewMistakesMode || difficultyFilter
      ? activeQuestions.length
      : allQuestions.length;
  const progressPct = totalTarget > 0
    ? Math.round((answeredCount / totalTarget) * 100)
    : 0;

  const handleAnswer = (questionId: string, answer: string, correct: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { answer, correct } }));
   
    incrementGuestCount();
    if (topicId) {
      answerQuestion(questionId, topicId, correct);
      const q = allQuestions.find((q) => q.id === questionId);
      saveAnswer(questionId, topicId, correct, q?.patternFamily, q?.commonMistake);
    }
    // Track the answer in session memory so the next adaptive pick sees
    // the updated state immediately (no waiting for a Supabase round-trip).
    const prevAttempts = sessionAnswersRef.current[questionId]?.attempts ?? 0;
    sessionAnswersRef.current = {
      ...sessionAnswersRef.current,
      [questionId]: { correct, attempts: prevAttempts + 1 },
    };
    setShowHint(false);

    // Session progress tracking
    const newTotal = totalAttempts + 1;
    setTotalAttempts(newTotal);
    if (correct) {
      const newCorrect = correctCount + 1;
      const newStreak = currentStreak + 1;
      setCorrectCount(newCorrect);
      setCurrentStreak(newStreak);

      // Streak celebration at every 3-in-a-row
      if (newStreak === 3) {
        toast.success("יופי! 3 נכונות ברצף — אתה מתקדם!", { duration: 3500 });
      } else if (newStreak > 0 && newStreak % 5 === 0) {
        toast.success(`${newStreak} נכונות ברצף! כל הכבוד!`, { duration: 3500 });
      }

      // Mastery milestone: 80%+ over 6+ attempts
      if (!masteryShown && newTotal >= 6 && newCorrect / newTotal >= 0.8) {
        setMasteryShown(true);
      }

      // Decrement easy pin counter
      if (easyPinRemaining > 0) {
        setEasyPinRemaining((n) => n - 1);
      }

      // Phase C: track consecutive correct answers on easy questions.
      // Reaching 3 triggers the Phase C → D transition celebration.
      if (practicePhase === "guided_practice") {
        const answeredQ = allQuestions.find((q) => q.id === questionId);
        if (answeredQ?.difficulty === "easy") {
          const newGuidedStreak = guidedEasyCorrectStreak + 1;
          setGuidedEasyCorrectStreak(newGuidedStreak);
          if (newGuidedStreak >= 3) {
            setShowPhaseTransition(true);
          }
        } else {
          setGuidedEasyCorrectStreak(0);
        }
      }

      setFeedbackMessage(getRandomEncouragement());
      setTimeout(() => setFeedbackMessage(null), 3000);
    } else {
      setCurrentStreak(0);

      // Decrement easy pin counter on wrong answer too
      if (easyPinRemaining > 0) {
        setEasyPinRemaining((n) => n - 1);
      }

      // Phase C: reset guided easy streak on wrong answer
      if (practicePhase === "guided_practice") {
        setGuidedEasyCorrectStreak(0);
      }

      setFeedbackMessage(null);
    }
  };

  const handleNext = () => {
    // In review-mistakes or difficulty-filter modes the active list is
    // pre-built, so we just walk it. In the default adaptive flow, grow
    // the queue by picking the next best question given the latest answers.
    if (reviewMistakesMode || difficultyFilter) {
      if (currentIndex + 1 >= activeQuestions.length) {
        setFinished(true);
        return;
      }
      setCurrentIndex((i) => i + 1);
      setShowHint(false);
      setFeedbackMessage(null);
      return;
    }

    if (currentIndex + 1 < adaptiveQueue.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (topicId) updateLastPosition(topicId, nextIdx);
      setShowHint(false);
      setFeedbackMessage(null);
      return;
    }

    const next = pickNextForQueue(adaptiveQueue);
    if (!next) {
      setFinished(true);
      return;
    }
    setAdaptiveQueue((q) => [...q, next]);
    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);
    if (topicId) updateLastPosition(topicId, nextIdx);
    setShowHint(false);
    setFeedbackMessage(null);
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    const prevIdx = currentIndex - 1;
    setCurrentIndex(prevIdx);
    if (topicId && !reviewMistakesMode && !difficultyFilter) {
      updateLastPosition(topicId, prevIdx);
    }
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
    setCorrectCount(0);
    setCurrentStreak(0);
    setTotalAttempts(0);
    setEasyPinRemaining(0);
    setShowEncouragement(false);
    setMasteryShown(false);
    setPracticePhase(initialPhase);
    setShowPhaseTransition(false);
    setGuidedEasyCorrectStreak(0);
    setPatternReviewFamilies([]);
    // Clear session memory and force the seeding block to re-run next
    // render, picking a fresh starting question based on the just-recorded
    // answers.
    sessionAnswersRef.current = {};
    seededKeyRef.current = null;
    setAdaptiveQueue([]);
    if (topicId) updateLastPosition(topicId, 0);
  };

  const handleReviewMistakes = () => {
    const incorrectIds = Object.entries(answers)
      .filter(([, a]) => !a.correct)
      .map(([id]) => id);
    const mistakes = activeQuestions.filter((q) => incorrectIds.includes(q.id));

    // Phase F: build a pattern-targeted review pool instead of replaying the
    // exact wrong questions. Collect the weak pattern_family tags from wrong
    // questions and expand the pool to all questions sharing those patterns.
    const weakFamilies = new Set(
      mistakes.map((q) => q.patternFamily).filter((p): p is string => Boolean(p))
    );
    let reviewPool: Question[];
    if (weakFamilies.size > 0) {
      reviewPool = allQuestions.filter(
        (q) => q.patternFamily && weakFamilies.has(q.patternFamily)
      );
      setPatternReviewFamilies([...weakFamilies]);
    } else {
      reviewPool = mistakes;
      setPatternReviewFamilies([]);
    }

    setMistakeQuestions(reviewPool);
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
    sessionAnswersRef.current = {};
    // The seeding effect re-runs on filter change and rebuilds the queue
    // when `d` is null; when `d` is non-null, `filteredQuestions` already
    // returns the filtered list directly.
  };

  if (finished) {
    const correct = Object.values(answers).filter((a) => a.correct).length;
    const total = activeQuestions.length;
    const pct = Math.round((correct / total) * 100);
    const mistakes = Object.entries(answers)
      .filter(([, a]) => !a.correct)
      .map(([id]) => activeQuestions.find((q) => q.id === id))
      .filter((q): q is Question => q != null);

    // Weak areas: types where mistakes occurred most
    const mistakesByType: Record<string, number> = {};
    for (const q of mistakes) {
      mistakesByType[q.type] = (mistakesByType[q.type] ?? 0) + 1;
    }
    const weakTypes = Object.entries(mistakesByType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([type]) => typeLabels[type]);

    // Weak difficulty areas
    const mistakesByDifficulty: Record<string, number> = {};
    for (const q of mistakes) {
      mistakesByDifficulty[q.difficulty] = (mistakesByDifficulty[q.difficulty] ?? 0) + 1;
    }
    const hardestDifficulty = Object.entries(mistakesByDifficulty)
      .sort(([, a], [, b]) => b - a)[0]?.[0] as Difficulty | undefined;

    // Next topic suggestion: the weakest topic (excluding current), fallback to first unattempted topic
    const weakTopics = getWeakTopics(4);
    const attemptedTopicIds = new Set(weakTopics.map((wt) => wt.topicId));
    const nextTopicSuggestion = weakTopics.find((wt) => wt.topicId !== topicId);
    const nextTopicData = nextTopicSuggestion
      ? topics.find((t) => t.id === nextTopicSuggestion.topicId)
      : topics.find((t) => t.id !== topicId && !attemptedTopicIds.has(t.id)) ??
        topics.find((t) => t.id !== topicId);

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

          {/* Weak areas */}
          {mistakes.length > 0 && (weakTypes.length > 0 || hardestDifficulty) && (
            <Card className="border-warning/20 bg-warning/5">
              <CardContent className="p-4 space-y-2">
                <h3 className="text-sm font-semibold text-warning flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  אזורים לשיפור
                </h3>
                {weakTypes.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    סוגי שאלות: <span className="text-foreground font-medium">{weakTypes.join(", ")}</span>
                  </p>
                )}
                {hardestDifficulty && (
                  <p className="text-xs text-muted-foreground">
                    רמת קושי בעייתית:{" "}
                    <span className={`font-medium ${
                      hardestDifficulty === "easy" ? "text-green-600 dark:text-green-400" :
                      hardestDifficulty === "hard" ? "text-red-600 dark:text-red-400" :
                      "text-yellow-600 dark:text-yellow-400"
                    }`}>
                      {difficultyLabels[hardestDifficulty]}
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {mistakes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-destructive">
                ❌ שאלות שטעית בהן ({mistakes.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
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

          {/* Next topic suggestion */}
          {!reviewMistakesMode && nextTopicData && (
            <Card className="border-primary/20 bg-primary/5 cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => navigate(`/practice/${nextTopicData.id}`)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">נושא מומלץ לתרגול הבא</p>
                  <p className="text-sm font-semibold text-foreground">
                    {nextTopicData.icon ?? "📖"} {nextTopicData.name}
                  </p>
                  {nextTopicSuggestion && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      אחוז הצלחה: {Math.round(nextTopicSuggestion.successRate * 100)}%
                    </p>
                  )}
                </div>
                <ArrowLeft className="h-4 w-4 text-primary shrink-0" />
              </CardContent>
            </Card>
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
    <Fragment>
      {showWall && <SignupWall onDismiss={dismissWall} />}

      {/* Phase C → D transition modal */}
      <AnimatePresence>
        {showPhaseTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-xl border border-border shadow-lg p-6 max-w-sm w-full text-center space-y-4"
            >
              <div className="text-4xl">🎓</div>
              <p className="text-base font-semibold text-foreground">
                אתה מוכן לשלב הבא — פחות רמזים, עצמאות גדולה יותר.
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  setShowPhaseTransition(false);
                  setPracticePhase("independent_practice");
                  posthog.capture("guided_practice_graduated", { topic_id: topicId });
                }}
              >
                בואו נמשיך! 🚀
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    <div className="min-h-screen bg-background pb-40 pt-4">
      <div className="mx-auto max-w-2xl px-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            ← חזרה
          </Button>
          <div className="flex items-center gap-2">
            {/* Phase badge: distinguishes guided (Phase C) from independent (Phase D) practice */}
            {!reviewMistakesMode && (
              <Badge
                variant="outline"
                className={
                  practicePhase === "guided_practice"
                    ? "text-xs border-blue-300/60 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20"
                    : "text-xs border-primary/30 text-primary bg-primary/5"
                }
              >
                {practicePhase === "guided_practice" ? "תרגול מונחה" : "תרגול עצמאי"}
              </Badge>
            )}
            <div className="text-sm text-muted-foreground font-medium font-mono">
              שאלה {currentIndex + 1} מתוך {totalTarget}
            </div>
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
            <p className="text-xs text-muted-foreground">{answeredCount}/{totalTarget} נענו</p>
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

        {/* Phase F: show which pattern families are being reinforced */}
        {reviewMistakesMode && patternReviewFamilies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-primary"
          >
            מתרגלים על: {patternReviewFamilies.map((p) => patternFamilyLabel(p)).join(", ")}
          </motion.div>
        )}

        <Progress value={progressPct} className="h-2" />

        {/* Session progress indicator */}
        {totalAttempts > 0 && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>שאלות נכונות: <strong className="text-foreground">{correctCount}</strong></span>
            {currentStreak > 0 && (
              <span>רצף נכון: <strong className="text-primary">{currentStreak} ברצף</strong></span>
            )}
          </div>
        )}

        {/* Encouragement after "I don't understand" */}
        <AnimatePresence>
          {showEncouragement && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3 text-center text-sm font-medium text-blue-800 dark:text-blue-200"
            >
              בסדר גמור — בוא נחזור רגע לבסיס.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mastery milestone */}
        <AnimatePresence>
          {masteryShown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="rounded-lg bg-success/10 border border-success/30 p-4 text-center space-y-3"
            >
              {topicId && isTopicComplete(topicId) ? (
                <>
                  <p className="text-sm font-semibold text-success">
                    ✅ הנושא הושלם! עברת את מבחן הנושא.
                  </p>
                  {(() => {
                    const topicIdx = topics.findIndex((t) => t.id === topicId);
                    const nextTopic = topicIdx >= 0 && topicIdx < topics.length - 1 ? topics[topicIdx + 1] : null;
                    return nextTopic ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => navigate(`/practice/${nextTopic.id}`)}
                      >
                        {nextTopic.icon ?? "📖"} {nextTopic.name}
                        <ArrowLeft className="h-3 w-3" />
                      </Button>
                    ) : null;
                  })()}
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-success">
                    מצוין! הגעת לרמת שליטה גבוהה!
                  </p>
                  <Button
                    size="sm"
                    className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
                    onClick={() => setMiniQuizActive(true)}
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    מוכן למבחן נושא!
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
        {/* In guided_practice mode hints are available after wrong answers too (proactive scaffolding). */}
        {hint && (
          practicePhase === "guided_practice"
            ? !answers[current.id]?.correct
            : !answers[current.id]
        ) && (
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

        {/* "I don't understand" button */}
        {!answers[current.id] && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              setCurrentStreak(0);
              setEasyPinRemaining(3);
              setShowEncouragement(true);
              setTimeout(() => setShowEncouragement(false), 4000);
              posthog.capture("dont_understand_clicked", { topic_id: topicId, question_id: current.id });
            }}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            לא הבנתי — תסביר אחרת
          </Button>
        )}
      </div>

      {/* Sticky navigation bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-foreground/10 bg-background/95 backdrop-blur-sm pb-16 md:pb-0">
        <div className="mx-auto max-w-2xl px-4 py-2 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 min-h-[44px] touch-manipulation"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronRight className="h-4 w-4 me-1" />
            הקודם
            <span className="ms-1 text-xs opacity-70 font-mono">
              {currentIndex + 1}/{totalTarget}
            </span>
          </Button>

          <Button
            className="flex-1 min-h-[44px] touch-manipulation"
            onClick={handleNext}
            disabled={!answers[current.id]}
          >
            {currentIndex + 1 >= totalTarget ? "סיום" : "הבא"}
            <span className="ms-1 text-xs opacity-70 font-mono">
              {currentIndex + 1}/{totalTarget}
            </span>
            <ChevronLeft className="h-4 w-4 ms-1" />
          </Button>
        </div>
      </div>

      <FloatingAIButton
        question={current}
        userAnswer={answers[current.id]?.answer}
      />
    </div>
    </Fragment>
  );
};

export default PracticePage;
