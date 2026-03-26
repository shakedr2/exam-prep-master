import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useBlocker } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, TrendingUp, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizView } from "@/components/QuizView";
import { TracingView } from "@/components/TracingView";
import { CodingView } from "@/components/CodingView";
import { FillBlankView } from "@/components/FillBlankView";
import { WarmupView } from "@/components/WarmupView";
import { TheoryCard } from "@/components/TheoryCard";
import { topics, questions as allQuestions, type Question, type TopicId, type CodingQuestion, type QuizQuestion, type TracingQuestion, type FillBlankQuestion } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";
import { AiTutor } from "@/components/AiTutor";
import { useAdaptive, PROFICIENCY_CONFIG } from "@/hooks/useAdaptive";
import { getTheoryForQuestion } from "@/lib/theoryContent";
import { StepIndicator } from "@/components/StepIndicator";
import confetti from "canvas-confetti";

const TopicPractice = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { answerQuestion, progress } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [theoryDone, setTheoryDone] = useState(false);
  const [warmupDone, setWarmupDone] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const topic = topics.find(t => t.id === topicId);
  const { sortedQuestions: topicQuestions, proficiency, accuracy } = useAdaptive(
    topicId as TopicId,
    allQuestions,
    progress.answeredQuestions
  );

  const prevProficiency = useRef(proficiency);
  useEffect(() => {
    if (prevProficiency.current !== proficiency && proficiency !== "beginner") {
      setShowLevelUp(true);
      const timer = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(timer);
    }
    prevProficiency.current = proficiency;
  }, [proficiency]);

  // Navigation blocker – warn user before leaving mid-session
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !sessionComplete &&
      currentIndex > 0 &&
      currentLocation.pathname !== nextLocation.pathname
  );

  if (!topic || topicQuestions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>נושא לא נמצא</p>
      </div>
    );
  }

  const q = topicQuestions[currentIndex];
  const theory = getTheoryForQuestion(q);
  const hasTheory = !!theory;
  const hasWarmups = q.warmupQuestions && q.warmupQuestions.length > 0;
  const showTheory = hasTheory && !theoryDone;
  const showWarmup = !showTheory && hasWarmups && !warmupDone;
  const showQuestion = !showTheory && !showWarmup;
  const progressPct = ((currentIndex + 1) / topicQuestions.length) * 100;

  const handleAnswer = (correct: boolean) => {
    answerQuestion(q.id, correct);
  };

  const handleNext = () => {
    if (currentIndex < topicQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setTheoryDone(false);
      setWarmupDone(false);
    } else {
      // All questions answered — show completion screen with confetti
      setSessionComplete(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  };

  // Completion screen
  if (sessionComplete) {
    const answeredInTopic = topicQuestions.filter(tq => progress.answeredQuestions[tq.id]);
    const correctInTopic = answeredInTopic.filter(tq => progress.answeredQuestions[tq.id]?.correct);
    const score = answeredInTopic.length > 0
      ? Math.round((correctInTopic.length / answeredInTopic.length) * 100)
      : 0;

    return (
      <div className="flex min-h-screen items-center justify-center px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center space-y-6"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl gradient-success text-4xl shadow-lg">
            <Trophy className="h-10 w-10 text-success-foreground" />
          </div>
          <h1 className="text-2xl font-bold">🎉 סיימת את כל השאלות!</h1>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <p className="text-4xl font-extrabold">{score}%</p>
            <p className="text-muted-foreground text-sm">
              {correctInTopic.length} נכונות מתוך {answeredInTopic.length} שאלות
            </p>
            <Progress value={score} className="h-3" />
            <p className="text-sm font-semibold text-foreground mt-2">
              {PROFICIENCY_CONFIG[proficiency].icon} רמה: {PROFICIENCY_CONFIG[proficiency].label}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/topics")}
              variant="outline"
              className="w-full"
            >
              חזרה לנושאים
            </Button>
            <Button
              onClick={() => navigate("/exam")}
              className="w-full gradient-primary text-primary-foreground"
            >
              התחל מבחן סימולציה 🚀
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-4">
      {/* Navigation blocker dialog */}
      {blocker.state === "blocked" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-2xl bg-card border border-border p-6 space-y-4 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-center">⚠️ לצאת מהתרגול?</h2>
            <p className="text-sm text-muted-foreground text-center">
              אם תצא עכשיו, ההתקדמות בסשן הזה תישמר — אבל תצטרך להתחיל מהשאלה הבאה.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => blocker.reset()}>
                המשך תרגול
              </Button>
              <Button className="flex-1 gradient-primary text-primary-foreground" onClick={() => blocker.proceed()}>
                צא
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="mx-auto max-w-lg px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/topics")}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-muted-foreground">{topic.name}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PROFICIENCY_CONFIG[proficiency].color}`}>
                {PROFICIENCY_CONFIG[proficiency].icon} {PROFICIENCY_CONFIG[proficiency].label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={progressPct} className="h-2 flex-1" />
              <span className="text-xs font-medium text-muted-foreground">
                {currentIndex + 1}/{topicQuestions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Level Up Animation */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="mb-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30 p-3 text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                <p className="text-sm font-bold text-foreground">🎉 עלית רמה! עכשיו אתה {PROFICIENCY_CONFIG[proficiency].label}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={showTheory ? "theory" : showWarmup ? "warmup" : "question"}
          hasTheory={hasTheory}
          hasWarmup={!!hasWarmups}
        />

        {/* Theory → Warmup → Question */}
        <AnimatePresence mode="wait">
          {showTheory && theory ? (
            <motion.div
              key={`theory-${q.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <TheoryCard
                theoryIntro={theory.theoryIntro}
                approachTip={theory.approachTip}
                example={theory.example}
                onContinue={() => setTheoryDone(true)}
              />
            </motion.div>
          ) : showWarmup ? (
            <motion.div
              key={`warmup-${q.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <WarmupView
                warmupQuestions={q.warmupQuestions!}
                onComplete={() => setWarmupDone(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              {/* Ready banner after warmup */}
              {hasWarmups && warmupDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 rounded-xl bg-success/10 border border-success/30 p-3 text-center"
                >
                  <p className="text-sm font-semibold text-success">🎯 עכשיו אתה מוכן! הנה השאלה המלאה:</p>
                </motion.div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  q.type === "quiz" ? "bg-primary/10 text-primary" :
                  q.type === "tracing" ? "bg-accent/10 text-accent" :
                  q.type === "fill-blank" ? "bg-primary/10 text-primary" :
                  "bg-warning/10 text-warning"
                }`}>
                  {q.type === "quiz" ? "🔘 רב-ברירה" : q.type === "tracing" ? "🔍 מעקב קוד" : q.type === "fill-blank" ? "✏️ השלם קוד" : "✍️ כתיבת קוד"}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  q.difficulty === "easy" ? "bg-success/10 text-success" :
                  q.difficulty === "medium" ? "bg-warning/10 text-warning" :
                  "bg-destructive/10 text-destructive"
                }`}>
                  {q.difficulty === "easy" ? "קל" : q.difficulty === "medium" ? "בינוני" : "קשה"}
                </span>
              </div>

              {q.type === "quiz" && <QuizView q={q} onAnswer={handleAnswer} />}
              {q.type === "tracing" && <TracingView q={q} onAnswer={handleAnswer} />}
              {q.type === "coding" && <CodingView q={q} onAnswer={handleAnswer} />}
              {q.type === "fill-blank" && <FillBlankView q={q} onAnswer={handleAnswer} />}
            </motion.div>
          )}
        </AnimatePresence>

      {showQuestion && progress.answeredQuestions[q.id] && (
          <Button onClick={handleNext} className="mt-4 w-full gradient-primary text-primary-foreground gap-2">
            {currentIndex < topicQuestions.length - 1 ? "שאלה הבאה" : "סיום נושא"}
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AiTutor
        questionContext={(() => {
          const base = `סוג: ${q.type}, נושא: ${topic.name}, קושי: ${q.difficulty}`;
          if (q.type === "quiz") {
            const qz = q as QuizQuestion;
            return `${base}\nשאלה: ${qz.question}\nאפשרויות: ${qz.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join(", ")}\nתשובה נכונה: ${qz.options[qz.correctIndex]}\nהסבר: ${qz.explanation}${'code' in qz && qz.code ? `\nקוד:\n${qz.code}` : ""}`;
          }
          if (q.type === "tracing") {
            const tr = q as TracingQuestion;
            return `${base}\nשאלה: ${tr.question}\nקוד:\n${tr.code}\nתשובה נכונה: ${tr.correctAnswer}\nהסבר: ${tr.explanation}`;
          }
          if (q.type === "fill-blank") {
            const fb = q as FillBlankQuestion;
            return `${base}\nכותרת: ${fb.title}\nתיאור: ${fb.description}\nהסבר: ${fb.solutionExplanation}`;
          }
          const cd = q as CodingQuestion;
          return `${base}\nכותרת: ${cd.title}\nתיאור: ${cd.description}\nהסבר: ${cd.solutionExplanation}`;
        })()}
      />
    </div>
  );
};

export default TopicPractice;
