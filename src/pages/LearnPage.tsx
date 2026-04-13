import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lightbulb, BookOpen, Rocket, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import posthog from "posthog-js";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import { GuidedExample } from "@/components/GuidedExample";
import { getTutorialByTopicId, resolveTopicId } from "@/data/topicTutorials";
import { topics } from "@/data/questions";
import { useLearningProgress } from "@/hooks/useLearningProgress";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function LearnPage() {
  const { topicId: rawTopicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const resolved = resolveTopicId(rawTopicId ?? "");
  const tutorial = getTutorialByTopicId(resolved?.uuid ?? "");
  const topic = topics.find((t) => t.id === resolved?.slug);
  const topicId = resolved?.uuid ?? rawTopicId;
  const { completedConcepts, markConceptComplete, guidedExampleCompleted, markGuidedExampleComplete } = useLearningProgress(topicId ?? "");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSkipped, setQuizSkipped] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  // Phase B: show guided example(s) after last concept card
  const [showGuidedExample, setShowGuidedExample] = useState(false);
  // Index into tutorial.guidedExamples[]
  const [guidedExampleIndex, setGuidedExampleIndex] = useState(0);

  if (!tutorial || !topicId) {
    return (
      <div dir="rtl" className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">הנושא לא נמצא</h1>
        <p className="text-muted-foreground">לא נמצא תוכן לימוד עבור נושא זה.</p>
        <Button onClick={() => navigate("/dashboard")}>חזרה לדשבורד</Button>
      </div>
    );
  }

  if (showCompletion) {
    return (
      <div dir="rtl" className="max-w-3xl mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="text-6xl">🎓</div>
          <h1 className="text-2xl font-bold text-foreground">
            סיימת את כל המושגים!
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            סיימת את כל המושגים! בוא נתרגל כדי לחזק את מה שלמדת.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            <Button size="lg" className="w-full text-base gap-2" onClick={() => navigate(`/practice/${topicId}`)}>
              <Rocket className="h-5 w-5" />
              בוא נתרגל
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => navigate("/dashboard")}>
              חזרה לדשבורד
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const conceptsList = tutorial.concepts;
  const totalConcepts = conceptsList.length;
  const concept = conceptsList[currentIndex];
  const isLast = currentIndex === totalConcepts - 1;
  const progressPct = Math.round(((currentIndex + 1) / totalConcepts) * 100);
  const currentPrepQ = tutorial.prepQuestions?.[currentIndex] ?? null;

  // Phase B: guided example screen
  if (showGuidedExample && tutorial.guidedExamples && tutorial.guidedExamples.length > 0) {
    const example = tutorial.guidedExamples[guidedExampleIndex];
    const exampleCount = tutorial.guidedExamples.length;
    return (
      <div dir="rtl" className="max-w-3xl mx-auto space-y-5 p-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">{topic?.icon ?? "📖"}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{tutorial.title}</h1>
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <BookOpen className="h-3.5 w-3.5" />
              דוגמה מודרכת{exampleCount > 1 ? ` ${guidedExampleIndex + 1}/${exampleCount}` : ""}
            </span>
          </div>
        </div>

        <Card className="border-border overflow-hidden">
          <div className="bg-primary/8 px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs shrink-0 border-primary/40 text-primary">
                שלב B — דוגמה מודרכת
              </Badge>
              <p className="text-sm text-muted-foreground">
                עקבו אחרי הקוד שלב אחרי שלב
              </p>
            </div>
          </div>
          <CardContent className="pt-4 pb-4">
            <GuidedExample
              key={`${topicId}-${guidedExampleIndex}`}
              example={example}
              onComplete={handleGuidedExampleComplete}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  const quizAnswered = quizSelected !== null || quizSkipped;
  const nextLocked = currentPrepQ !== null && !quizAnswered;

  function handleQuizAnswer(optionIndex: number) {
    if (quizSelected !== null || !currentPrepQ) return;
    const correct = optionIndex === currentPrepQ.correctAnswer;
    setQuizSelected(optionIndex);
    posthog.capture("lesson_quiz_answered", {
      topic_id: topicId,
      concept_index: currentIndex,
      correct,
    });
  }

  function goNext() {
    markConceptComplete(currentIndex);
    posthog.capture("lesson_progress", {
      topic_id: topicId,
      concept_index: currentIndex,
      total_concepts: totalConcepts,
    });
    if (isLast) {
      posthog.capture("lesson_completed", {
        topic_id: topicId,
        topic_name: topic?.name,
      });
      // Phase B: show guided example if available and not yet completed
      const hasGuidedExamples = tutorial.guidedExamples && tutorial.guidedExamples.length > 0;
      if (hasGuidedExamples && !guidedExampleCompleted) {
        setShowGuidedExample(true);
        setGuidedExampleIndex(0);
      } else {
        setShowCompletion(true);
      }
    } else {
      setCurrentIndex((i) => i + 1);
      setHintOpen(false);
      setQuizSelected(null);
      setQuizSkipped(false);
    }
  }

  function handleGuidedExampleComplete() {
    const examples = tutorial.guidedExamples ?? [];
    const nextIdx = guidedExampleIndex + 1;
    if (nextIdx < examples.length) {
      // More examples to show
      setGuidedExampleIndex(nextIdx);
    } else {
      // All examples done
      markGuidedExampleComplete();
      posthog.capture("guided_example_completed", {
        topic_id: topicId,
        steps_count: examples.reduce((sum, ex) => sum + ex.steps.length, 0),
      });
      setShowGuidedExample(false);
      setShowCompletion(true);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setHintOpen(false);
      setQuizSelected(null);
      setQuizSkipped(false);
    }
  }

  return (
    <div dir="rtl" className="max-w-3xl mx-auto space-y-5 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">{topic?.icon ?? "📖"}</span>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{tutorial.title}</h1>
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
            <BookOpen className="h-3.5 w-3.5" />
            לימוד מודרך
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>מושג {currentIndex + 1} מתוך {totalConcepts}</span>
          <span>{progressPct}%</span>
        </div>
        <Progress value={progressPct} className="h-1.5" />
        <div className="flex gap-1.5 flex-wrap">
          {conceptsList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrentIndex(idx); setHintOpen(false); }}
              className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                idx === currentIndex
                  ? "bg-primary text-primary-foreground"
                  : completedConcepts.includes(idx)
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {completedConcepts.includes(idx) && (
                <CheckCircle className="h-3 w-3" />
              )}
              <span>{idx + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Concept card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Card className="border-border overflow-hidden">
            <div className="bg-primary/8 px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs shrink-0">
                  {currentIndex + 1}/{totalConcepts}
                </Badge>
                <h2 className="font-semibold text-foreground text-base">{concept.title}</h2>
              </div>
            </div>
            <CardContent className="pt-4 pb-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
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

          {/* Symbol explainers hint section */}
          {tutorial.symbolExplainers && tutorial.symbolExplainers.length > 0 && (
            <Collapsible open={hintOpen} onOpenChange={setHintOpen} className="mt-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                  <Lightbulb className="h-4 w-4" />
                  {hintOpen ? "הסתר רמזים" : "הצג רמזים — מילון סימנים"}
                  <ChevronLeft className={`h-4 w-4 mr-auto transition-transform ${hintOpen ? "rotate-90" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="border-yellow-300/50 bg-yellow-50 dark:bg-yellow-950/20 mt-2">
                  <CardContent className="pt-4 pb-4">
                    <ul className="space-y-2">
                      {tutorial.symbolExplainers.map((se, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <code className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground" dir="ltr">
                            {se.symbol}
                          </code>
                          <span className="text-muted-foreground">{se.meaning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Mini-quiz */}
          {currentPrepQ && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">{currentPrepQ.question}</p>
              <ul className="space-y-2">
                {currentPrepQ.options.map((option, idx) => {
                  const isSelected = quizSelected === idx;
                  const isCorrect = idx === currentPrepQ.correctAnswer;
                  let optionClass =
                    "w-full text-right rounded-lg border px-4 py-2.5 text-sm transition-colors cursor-pointer ";
                  if (quizSelected !== null) {
                    if (isCorrect) {
                      optionClass += "border-green-400 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200";
                    } else if (isSelected) {
                      optionClass += "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200";
                    } else {
                      optionClass += "border-border bg-muted/30 text-muted-foreground";
                    }
                  } else {
                    optionClass += "border-border bg-background hover:border-primary/50 hover:bg-primary/5";
                  }
                  return (
                    <li key={idx}>
                      <button
                        className={optionClass}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={quizSelected !== null}
                        aria-pressed={isSelected}
                      >
                        {option}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {quizSelected !== null && (
                <p className={`text-sm font-medium ${quizSelected === currentPrepQ.correctAnswer ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {quizSelected === currentPrepQ.correctAnswer ? "נכון! 🎉" : "לא נכון — התשובה הנכונה מסומנת בירוק"}
                </p>
              )}
              {quizSelected === null && (
                <button
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 mt-1"
                  onClick={() => setQuizSkipped(true)}
                >
                  דלג על השאלה
                </button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Common mistakes — last card only */}
      {isLast && tutorial.commonMistakes.length > 0 && (
        <Card className="border-yellow-300/50 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 shrink-0" />
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">טעויות נפוצות</p>
            </div>
            <ul className="space-y-1.5">
              {tutorial.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-yellow-900 dark:text-yellow-100">
                  <span className="mt-0.5 shrink-0">•</span>
                  {mistake}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2 pb-6">
        {currentIndex > 0 && (
          <Button variant="outline" size="lg" onClick={goPrev} className="gap-2">
            <ChevronRight className="h-5 w-5" />
            הקודם
          </Button>
        )}
        <Button size="lg" className="flex-1 text-base gap-2" onClick={goNext} disabled={nextLocked}>
          {isLast ? (
            <>
              <Rocket className="h-5 w-5" />
              מוכנים לתרגול?
            </>
          ) : (
            <>
              הבא
              <ChevronLeft className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
