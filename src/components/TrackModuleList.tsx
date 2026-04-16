import { memo } from "react";
import { useProgress } from "@/hooks/useProgress";
import { type Module } from "@/data/modules";
import { getTutorialByTopicId } from "@/data/topicTutorials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CheckCircle2, BookOpen, Brain, Lock } from "lucide-react";
import { questions as staticQuestions } from "@/data/questions";

export const TopicCard = memo(function TopicCard({
  topic,
  questionCount,
  learnMap,
  progress,
  getTopicCompletion,
  isTopicUnlocked,
  isTopicComplete,
  onLearn,
  onPractice,
}: {
  topic: { id: string; name: string; icon: string | null; description: string | null };
  questionCount: number;
  learnMap: Record<string, number[]>;
  progress: ReturnType<typeof useProgress>["progress"];
  getTopicCompletion: ReturnType<typeof useProgress>["getTopicCompletion"];
  isTopicUnlocked: (topicId: string) => boolean;
  isTopicComplete: (topicId: string) => boolean;
  onLearn: (topicId: string) => void;
  onPractice: (topicId: string) => void;
}) {
  const completion = getTopicCompletion(topic.id, questionCount);
  const unlocked = isTopicUnlocked(topic.id);
  const completed = isTopicComplete(topic.id);

  const topicQuestionIds = new Set(
    staticQuestions.filter((q) => q.topic === topic.id).map((q) => q.id)
  );
  const answeredCorrect = Object.entries(progress.answeredQuestions)
    .filter(([id, v]) => topicQuestionIds.has(id) && v.correct)
    .length;

  const conceptsLearned = learnMap[topic.id]?.length ?? 0;
  const totalConcepts = getTutorialByTopicId(topic.id)?.concepts.length ?? 0;
  const learnDone = totalConcepts > 0 && conceptsLearned >= totalConcepts;
  const learnStarted = conceptsLearned > 0;
  const practiceStarted = answeredCorrect > 0;

  let ctaLabel: string;
  let ctaIcon: React.ReactNode;
  let ctaAction: () => void;
  let ctaClass: string;
  let ctaDisabled = false;

  if (!unlocked && !completed) {
    ctaLabel = "נעול";
    ctaIcon = <Lock className="h-3 w-3" />;
    ctaAction = () => {};
    ctaClass = "border-muted text-muted-foreground cursor-not-allowed opacity-60";
    ctaDisabled = true;
  } else if (completed || completion >= 80) {
    ctaLabel = "שולט בנושא! ✅";
    ctaIcon = <CheckCircle2 className="h-3 w-3" />;
    ctaAction = () => onPractice(topic.id);
    ctaClass = "border-success/40 text-success hover:bg-success/10 dark:border-success/30 dark:hover:bg-success/10";
  } else if (learnDone && practiceStarted) {
    ctaLabel = `המשך לתרגל (${answeredCorrect}/${questionCount})`;
    ctaIcon = <Brain className="h-3 w-3" />;
    ctaAction = () => onPractice(topic.id);
    ctaClass = "border-green-500/40 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-400/30 dark:text-green-400 dark:hover:bg-green-950/30";
  } else if (learnDone && !practiceStarted) {
    ctaLabel = "התחל לתרגל";
    ctaIcon = <Brain className="h-3 w-3" />;
    ctaAction = () => onPractice(topic.id);
    ctaClass = "border-green-500/40 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-400/30 dark:text-green-400 dark:hover:bg-green-950/30";
  } else if (learnStarted) {
    ctaLabel = `המשך ללמוד (${conceptsLearned}/${totalConcepts})`;
    ctaIcon = <BookOpen className="h-3 w-3" />;
    ctaAction = () => onLearn(topic.id);
    ctaClass = "border-blue-500/40 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400/30 dark:text-blue-400 dark:hover:bg-blue-950/30";
  } else if (totalConcepts > 0) {
    ctaLabel = "התחל ללמוד";
    ctaIcon = <BookOpen className="h-3 w-3" />;
    ctaAction = () => onLearn(topic.id);
    ctaClass = "border-blue-500/40 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400/30 dark:text-blue-400 dark:hover:bg-blue-950/30";
  } else {
    ctaLabel = practiceStarted ? `המשך לתרגל (${answeredCorrect}/${questionCount})` : "התחל לתרגל";
    ctaIcon = <Brain className="h-3 w-3" />;
    ctaAction = () => onPractice(topic.id);
    ctaClass = "border-green-500/40 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-400/30 dark:text-green-400 dark:hover:bg-green-950/30";
  }

  return (
    <Card className={`bg-card border hover:shadow-md transition-all group relative ${
      completed
        ? "border-success/40 hover:border-success/60"
        : unlocked
        ? "border-foreground/10 hover:border-primary/40"
        : "border-foreground/10 opacity-75"
    }`}>
      {completed && (
        <span className="absolute top-2 left-2 text-base" title="הושלם">✅</span>
      )}
      {!unlocked && !completed && (
        <span className="absolute top-2 left-2 text-base" title="נעול — יש לסיים את הנושא הקודם">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </span>
      )}
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl">{topic.icon ?? "📖"}</span>
          <div className="flex items-center gap-1.5">
            {totalConcepts > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
                {conceptsLearned}/{totalConcepts} מושגים
              </Badge>
            )}
            <span className="text-[11px] text-muted-foreground font-mono">
              {questionCount} שאלות
            </span>
          </div>
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
            {topic.name}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
            {topic.description ?? ""}
          </p>
        </div>
        <div className="space-y-1">
          <Progress value={completion} className="h-1.5" />
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">{answeredCorrect} נפתרו נכון</p>
            <p className="text-[11px] text-muted-foreground font-mono">{completion}%</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className={`w-full h-8 text-xs gap-1 touch-manipulation ${ctaClass}`}
          onClick={(e) => { e.stopPropagation(); ctaAction(); }}
          disabled={ctaDisabled}
          title={ctaDisabled ? "יש לסיים את הנושא הקודם כדי לפתוח נושא זה" : undefined}
        >
          {ctaIcon}
          {ctaLabel}
        </Button>
      </CardContent>
    </Card>
  );
});

export const ModuleSection = memo(function ModuleSection({
  module,
  topics,
  questionCounts,
  learnMap,
  progress,
  getTopicCompletion,
  isTopicUnlocked,
  isTopicComplete,
  onLearn,
  onPractice,
}: {
  module: Module;
  topics: { id: string; name: string; icon: string | null; description: string | null }[];
  questionCounts: Record<string, number>;
  learnMap: Record<string, number[]>;
  progress: ReturnType<typeof useProgress>["progress"];
  getTopicCompletion: ReturnType<typeof useProgress>["getTopicCompletion"];
  isTopicUnlocked: (topicId: string) => boolean;
  isTopicComplete: (topicId: string) => boolean;
  onLearn: (topicId: string) => void;
  onPractice: (topicId: string) => void;
}) {
  const moduleTopics = module.topicIds
    .map((tid) => topics.find((t) => t.id === tid))
    .filter(Boolean) as typeof topics;

  const moduleCompletion = moduleTopics.length > 0
    ? Math.min(100, Math.round(
        moduleTopics.reduce(
          (sum, t) => sum + getTopicCompletion(t.id, questionCounts[t.id] ?? 0),
          0
        ) / moduleTopics.length
      ))
    : 0;

  if (moduleTopics.length === 0) return null;

  return (
    <AccordionItem value={module.id} className="border-b-0 mb-4">
      <AccordionTrigger className="hover:no-underline py-3 px-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-2xl shrink-0">{module.icon}</span>
          <div className="flex-1 min-w-0 text-right">
            <p className="font-bold text-foreground text-base">{module.title}</p>
            <p className="text-xs text-muted-foreground truncate">{module.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-muted-foreground">{moduleCompletion}%</span>
            <Progress value={moduleCompletion} className="h-1.5 w-16" />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 gap-3">
          {moduleTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              questionCount={questionCounts[topic.id] ?? 0}
              learnMap={learnMap}
              progress={progress}
              getTopicCompletion={getTopicCompletion}
              isTopicUnlocked={isTopicUnlocked}
              isTopicComplete={isTopicComplete}
              onLearn={onLearn}
              onPractice={onPractice}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

/**
 * Reusable module list used by all track pages (Python Fundamentals, OOP, DevOps).
 * Renders modules as accordion sections containing topic cards.
 */
export function TrackModuleList({
  modules,
  topics,
  questionCounts,
  learnMap,
  progress,
  getTopicCompletion,
  isTopicUnlocked,
  isTopicComplete,
  onLearn,
  onPractice,
}: {
  modules: Module[];
  topics: { id: string; name: string; icon: string | null; description: string | null }[];
  questionCounts: Record<string, number>;
  learnMap: Record<string, number[]>;
  progress: ReturnType<typeof useProgress>["progress"];
  getTopicCompletion: ReturnType<typeof useProgress>["getTopicCompletion"];
  isTopicUnlocked: (topicId: string) => boolean;
  isTopicComplete: (topicId: string) => boolean;
  onLearn: (topicId: string) => void;
  onPractice: (topicId: string) => void;
}) {
  const activeModules = modules.filter((m) => !m.comingSoon).sort((a, b) => a.order - b.order);
  const comingSoonModules = modules.filter((m) => m.comingSoon).sort((a, b) => a.order - b.order);
  const defaultExpanded = activeModules.map((m) => m.id);

  return (
    <div>
      <Accordion type="multiple" defaultValue={defaultExpanded}>
        {activeModules.map((module) => (
          <ModuleSection
            key={module.id}
            module={module}
            topics={topics}
            questionCounts={questionCounts}
            learnMap={learnMap}
            progress={progress}
            getTopicCompletion={getTopicCompletion}
            isTopicUnlocked={isTopicUnlocked}
            isTopicComplete={isTopicComplete}
            onLearn={onLearn}
            onPractice={onPractice}
          />
        ))}
      </Accordion>

      {comingSoonModules.map((module) => (
        <Card key={module.id} className="bg-card/50 border border-dashed border-foreground/10 opacity-60 mt-4">
          <CardContent className="p-4 flex items-center gap-3">
            <span className="text-2xl">{module.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-sm">{module.title}</p>
              <p className="text-xs text-muted-foreground">{module.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary" className="text-xs">בקרוב</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
