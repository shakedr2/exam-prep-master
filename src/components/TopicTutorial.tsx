import { motion } from "framer-motion";
import { BookOpen, Lightbulb, AlertTriangle, ChevronLeft, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import type { TopicTutorial as TopicTutorialData } from "@/data/topicTutorials";

interface TopicTutorialProps {
  tutorial: TopicTutorialData;
  topicName: string;
  topicIcon: string;
  questionCount: number;
  onStartPractice: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

export function TopicTutorial({
  tutorial,
  topicName,
  topicIcon,
  questionCount,
  onStartPractice,
}: TopicTutorialProps) {
  return (
    <div dir="rtl" className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="flex items-center gap-3"
      >
        <span className="text-4xl">{topicIcon}</span>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{topicName}</h1>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <BookOpen className="h-4 w-4" />
          {questionCount} שאלות
        </span>
      </motion.div>

      {/* Introduction */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-base leading-relaxed text-muted-foreground">
              {tutorial.introduction}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Concepts */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          מושגי מפתח
        </h2>
        <Accordion type="multiple" className="space-y-2">
          {tutorial.concepts.map((concept, idx) => (
            <AccordionItem
              key={idx}
              value={`concept-${idx}`}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="text-right font-medium">
                {concept.title}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {concept.explanation}
                </p>
                <PythonCodeBlock code={concept.codeExample} />
                <div className="rounded-md border bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    פלט צפוי:
                  </p>
                  <pre className="text-sm font-mono whitespace-pre-wrap" dir="ltr">
                    {concept.expectedOutput}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* Common Mistakes */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <Accordion type="single" collapsible>
          <AccordionItem value="mistakes" className="border rounded-lg px-4">
            <AccordionTrigger className="text-right font-semibold">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                טעויות נפוצות
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                {tutorial.commonMistakes.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      {/* Quick Tip */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <Card className="border-yellow-300/50 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6 flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
            <p className="text-sm leading-relaxed text-yellow-900 dark:text-yellow-200">
              {tutorial.quickTip}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Start Practice Button */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={5}
        className="pt-2 pb-6"
      >
        <Button
          size="lg"
          className="w-full text-lg gap-2"
          onClick={onStartPractice}
        >
          <ChevronLeft className="h-5 w-5" />
          התחל תרגול
        </Button>
      </motion.div>
    </div>
  );
}
