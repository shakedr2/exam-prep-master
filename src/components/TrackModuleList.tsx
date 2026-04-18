import { memo } from "react";
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
import { resolveTopicId } from "@/data/topicTutorials";
import { useModuleProgress } from "@/features/progress/hooks/useModuleProgress";
import { useTopicProgress } from "@/features/progress/hooks/useTopicProgress";

// Pre-aggregate static question counts by topic slug. `src/data/questions.ts`
// is the product's single source of truth per CLAUDE.md, so topic cards must
// reflect these counts even when the Supabase aggregate (`get_dashboard_data`)
// hasn't been seeded yet (e.g. new OOP and DevOps questions).
const STATIC_QUESTION_COUNTS: Record<string, number> = staticQuestions.reduce(
  (acc, q) => {
    acc[q.topic] = (acc[q.topic] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>,
);

export const TopicCard = memo(function TopicCard({
  topic,
  questionCount,
  learnMap,
  isTopicUnlocked,
  isTopicComplete,
  onLearn,
  onPractice,
}: {
  topic: { id: string; name: string; icon: string | null; description: string | null };
  questionCount: number;
  learnMap: Record<string, number[]>;
  isTopicUnlocked: (topicId: string) => boolean;
  isTopicComplete: (topicId: string) => boolean;
  onLearn: (topicId: string) => void;
  onPractice: (topicId: string) => void;
}) {
  const topicProgress = useTopicProgress(topic.id);
  const completion = topicProgress.completionPct;
  const answeredCorrect = topicProgress.correct;
  const unlocked = isTopicUnlocked(topic.id);
  const completed = isTopicComplete(topic.id);

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
  isTopicUnlocked,
  isTopicComplete,
  onLearn,
  onPractice,
}: {
  module: Module;
  topics: { id: string; name: string; icon: string | null; description: string | null }[];
  questionCounts: Record<string, number>;
  learnMap: Record<string, number[]>;
  isTopicUnlocked: (topicId: string) => boolean;
  isTopicComplete: (topicId: string) => boolean;
  onLearn: (topicId: string) => void;
  onPractice: (topicId: string) => void;
}) {
  // Module topic IDs in modules.ts are stable slugs (e.g. "variables_io"),
  // while the DB `topics` table keys rows by UUID. Resolve each slug to its
  // UUID (via the canonical slug↔UUID map) before looking up the DB row, and
  // fall back to a direct id match so UUID-only callers keep working.
  // Downstream consumers (localStorage, static question filter, sequential
  // unlock order) are slug-based, so normalize the returned topic's `id` to
  // the module's slug.
  //
  // If the DB row is missing but the slug has static questions or a module
  // definition, synthesise a topic from the module metadata so new content
  // (e.g. DevOps networking) still renders on the track page.
  const moduleTopics = module.topicIds
    .map((slug) => {
      const uuid = resolveTopicId(slug)?.uuid;
      const dbTopic = topics.find((t) => t.id === uuid || t.id === slug);
      if (dbTopic) return { ...dbTopic, id: slug };
      const hasStaticQuestions = (STATIC_QUESTION_COUNTS[slug] ?? 0) > 0;
      if (!hasStaticQuestions) return null;
      return {
        id: slug,
        name: module.title,
        icon: module.icon,
        description: module.description,
      };
    })
    .filter(Boolean) as typeof topics;

  // Question counts come from two sources:
  //   • Supabase `get_dashboard_data` RPC — aggregated by topic UUID
  //   • Static `src/data/questions.ts` — aggregated by topic slug
  // Use the larger of the two so topics are never underreported when static
  // content exists but hasn't been seeded to Supabase yet.
  const getQuestionCount = (slug: string): number => {
    const uuid = resolveTopicId(slug)?.uuid;
    const remote = (uuid && questionCounts[uuid]) ?? questionCounts[slug] ?? 0;
    const staticCount = STATIC_QUESTION_COUNTS[slug] ?? 0;
    return Math.max(remote, staticCount);
  };

  const moduleProgress = useModuleProgress(module.id);
  const moduleCompletion = moduleProgress.completionPct;

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
              questionCount={getQuestionCount(topic.id)}
              learnMap={learnMap}
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
  isTopicUnlocked,
  isTopicComplete,
  onLearn,
  onPractice,
}: {
  modules: Module[];
  topics: { id: string; name: string; icon: string | null; description: string | null }[];
  questionCounts: Record<string, number>;
  learnMap: Record<string, number[]>;
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
