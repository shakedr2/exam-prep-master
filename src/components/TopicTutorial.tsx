import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Lightbulb, AlertTriangle, ChevronLeft, ChevronRight, Sparkles, CheckCircle, XCircle, FastForward } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import type { TopicTutorial as TopicTutorialData } from "@/data/topicTutorials";

interface TopicTutorialProps {
  tutorial: TopicTutorialData;
  topicName: string;
  topicIcon: string;
  questionCount: number;
  onStartPractice: () => void;
}

const STEP_LABELS = ["סקירת תיאוריה", "מושגי מפתח", "שאלת חימום", "מלכודות נפוצות"];
const STEP_ICONS = ["📖", "✨", "🧩", "⚠️"];

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } },
};

export function TopicTutorial({
  tutorial,
  topicName,
  topicIcon,
  questionCount,
  onStartPractice,
}: TopicTutorialProps) {
  const hasWarmup = (tutorial.prepQuestions ?? []).length > 0;
  const totalSteps = hasWarmup ? 4 : 3;

  // Map logical step index to display index (skip warmup step if none available)
  const steps: Array<"theory" | "concepts" | "warmup" | "pitfalls"> = hasWarmup
    ? ["theory", "concepts", "warmup", "pitfalls"]
    : ["theory", "concepts", "pitfalls"];

  const [stepIdx, setStepIdx] = useState(0);
  const [warmupSelected, setWarmupSelected] = useState<number | null>(null);
  const [warmupAnswered, setWarmupAnswered] = useState(false);

  const currentStep = steps[stepIdx];
  const progressPct = Math.round(((stepIdx) / (totalSteps - 1)) * 100);

  function goNext() {
    if (stepIdx < totalSteps - 1) {
      setStepIdx((s) => s + 1);
    } else {
      onStartPractice();
    }
  }

  function handleWarmupSelect(idx: number) {
    if (warmupAnswered) return;
    setWarmupSelected(idx);
    setWarmupAnswered(true);
  }

  const warmupQuestion = (tutorial.prepQuestions ?? [])[0];
  const stepLabel = hasWarmup ? STEP_LABELS : [STEP_LABELS[0], STEP_LABELS[1], STEP_LABELS[3]];
  const stepIcon = hasWarmup ? STEP_ICONS : [STEP_ICONS[0], STEP_ICONS[1], STEP_ICONS[3]];

  return (
    <div dir="rtl" className="max-w-3xl mx-auto space-y-5 p-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">{topicIcon}</span>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{topicName}</h1>
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
            <BookOpen className="h-3.5 w-3.5" />
            {questionCount} שאלות
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onStartPractice}
          className="gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
        >
          <FastForward className="h-4 w-4" />
          דלג לתרגול
        </Button>
      </div>

      {/* ── Step indicator ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>הכנה למפגש</span>
          <span>שלב {stepIdx + 1} מתוך {totalSteps}</span>
        </div>
        <Progress value={progressPct} className="h-1.5" />
        <div className="flex gap-1.5 flex-wrap">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStepIdx(idx)}
              className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                idx === stepIdx
                  ? "bg-primary text-primary-foreground"
                  : idx < stepIdx
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span>{stepIcon[idx]}</span>
              <span className="hidden sm:inline">{stepLabel[idx]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Step content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Step 1 — Theory overview */}
          {currentStep === "theory" && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6 pb-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">📖</span>
                  <h2 className="text-lg font-semibold text-foreground">סקירת תיאוריה</h2>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                  {tutorial.introduction}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step 2 — Key concepts with code */}
          {currentStep === "concepts" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">מושגי מפתח עם דוגמאות</h2>
              </div>
              {tutorial.concepts.map((concept, idx) => (
                <Card key={idx} className="border-border overflow-hidden">
                  <div className="bg-primary/8 px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs shrink-0">
                        {idx + 1}/{tutorial.concepts.length}
                      </Badge>
                      <h3 className="font-semibold text-foreground text-sm">{concept.title}</h3>
                    </div>
                  </div>
                  <CardContent className="pt-4 pb-4 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {concept.explanation}
                    </p>
                    <PythonCodeBlock code={concept.codeExample} />
                    {concept.expectedOutput && (
                      <div className="rounded-md border bg-muted/40 p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          ▶ פלט צפוי:
                        </p>
                        <pre className="text-sm font-mono whitespace-pre-wrap text-foreground" dir="ltr">
                          {concept.expectedOutput}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 3 — Warmup question */}
          {currentStep === "warmup" && warmupQuestion && (
            <Card className="border-border">
              <CardContent className="pt-6 pb-6 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧩</span>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">שאלת חימום</h2>
                    <p className="text-xs text-muted-foreground">נסה/י לענות לפני שמתחילים בתרגול</p>
                  </div>
                </div>
                <p className="text-base font-medium text-foreground leading-relaxed">
                  {warmupQuestion.question}
                </p>
                <div className="space-y-2">
                  {warmupQuestion.options.map((option, idx) => {
                    const isCorrect = idx === warmupQuestion.correctAnswer;
                    const isSelected = idx === warmupSelected;
                    let btnClass =
                      "w-full text-right justify-start px-4 py-3 h-auto rounded-lg border text-sm transition-colors ";
                    if (!warmupAnswered) {
                      btnClass += "border-border hover:border-primary hover:bg-primary/5 bg-background";
                    } else if (isCorrect) {
                      btnClass += "border-success bg-success/10 text-success font-medium";
                    } else if (isSelected) {
                      btnClass += "border-destructive bg-destructive/10 text-destructive";
                    } else {
                      btnClass += "border-border bg-muted/40 text-muted-foreground";
                    }
                    return (
                      <button
                        key={idx}
                        className={btnClass}
                        onClick={() => handleWarmupSelect(idx)}
                        disabled={warmupAnswered}
                      >
                        <span className="flex items-center gap-2">
                          {warmupAnswered && isCorrect && <CheckCircle className="h-4 w-4 shrink-0" />}
                          {warmupAnswered && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0" />}
                          <span>{option}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {warmupAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg p-3 text-sm font-medium ${
                      warmupSelected === warmupQuestion.correctAnswer
                        ? "bg-success/10 text-success border border-success/30"
                        : "bg-destructive/10 text-destructive border border-destructive/30"
                    }`}
                  >
                    {warmupSelected === warmupQuestion.correctAnswer
                      ? "✓ נכון מאוד! ממשיכים לתרגול."
                      : `✗ לא בדיוק. התשובה הנכונה: ${warmupQuestion.options[warmupQuestion.correctAnswer]}`}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4 — Common pitfalls + quick tip */}
          {currentStep === "pitfalls" && (
            <div className="space-y-4">
              <Card className="border-destructive/20">
                <CardContent className="pt-6 pb-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h2 className="text-lg font-semibold text-foreground">מלכודות נפוצות</h2>
                  </div>
                  <ul className="space-y-2.5">
                    {tutorial.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 h-5 w-5 rounded-full bg-destructive/10 text-destructive text-xs flex items-center justify-center shrink-0 font-bold">
                          !
                        </span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-yellow-300/50 bg-yellow-50 dark:bg-yellow-950/20">
                <CardContent className="pt-5 pb-5 flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">
                      טיפ אחרון לפני התרגול
                    </p>
                    <p className="text-sm leading-relaxed text-yellow-900 dark:text-yellow-200">
                      {tutorial.quickTip}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation ── */}
      <div className="flex gap-3 pt-2 pb-6">
        {stepIdx > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setStepIdx((s) => s - 1)}
            className="gap-2"
          >
            <ChevronRight className="h-5 w-5" />
            הקודם
          </Button>
        )}
        <Button
          size="lg"
          className="flex-1 text-base gap-2"
          onClick={goNext}
          disabled={currentStep === "warmup" && !warmupAnswered}
        >
          {stepIdx < totalSteps - 1 ? (
            <>
              הבא
              <ChevronLeft className="h-5 w-5" />
            </>
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              התחל תרגול
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
