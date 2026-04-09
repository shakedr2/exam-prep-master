import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lightbulb, BookOpen, Rocket, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import { getTutorialByTopicId } from "@/data/topicTutorials";
import { topics } from "@/data/questions";
import { useLearningProgress } from "@/hooks/useLearningProgress";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function LearnPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const tutorial = getTutorialByTopicId(topicId ?? "");
  const topic = topics.find((t) => t.id === topicId);
  const { completedConcepts, markConceptComplete } = useLearningProgress(topicId ?? "");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);

  if (!tutorial || !topicId) {
    return (
      <div dir="rtl" className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">הנושא לא נמצא</h1>
        <p className="text-muted-foreground">לא נמצא תוכן לימוד עבור נושא זה.</p>
        <Button onClick={() => navigate("/dashboard")}>חזרה לדשבורד</Button>
      </div>
    );
  }

  const conceptsList = tutorial.concepts;
  const totalConcepts = conceptsList.length;
  const concept = conceptsList[currentIndex];
  const isLast = currentIndex === totalConcepts - 1;
  const progressPct = Math.round(((currentIndex + 1) / totalConcepts) * 100);

  function goNext() {
    markConceptComplete(currentIndex);
    if (isLast) {
      navigate(`/practice/${topicId}`);
    } else {
      setCurrentIndex((i) => i + 1);
      setHintOpen(false);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setHintOpen(false);
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
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 pt-2 pb-6">
        {currentIndex > 0 && (
          <Button variant="outline" size="lg" onClick={goPrev} className="gap-2">
            <ChevronRight className="h-5 w-5" />
            הקודם
          </Button>
        )}
        <Button size="lg" className="flex-1 text-base gap-2" onClick={goNext}>
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
