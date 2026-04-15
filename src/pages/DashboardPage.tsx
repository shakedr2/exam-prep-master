import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "@/hooks/useProgress";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTopicCompletion } from "@/hooks/useTopicCompletion";
import { MODULES, type Module } from "@/data/modules";
import { getTutorialByTopicId } from "@/data/topicTutorials";
import { XpBadge } from "@/components/XpBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Flame, CheckCircle2, GraduationCap, BookOpen, Brain, X, Lock, ChevronLeft, Home } from "lucide-react";
import { PythonHero } from "@/components/PythonHero";
import { questions as staticQuestions } from "@/data/questions";

const PRACTICE_TIP_DISMISSED_KEY = "practice_tip_dismissed";

function TopicCard({
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
  onLearn: () => void;
  onPractice: () => void;
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
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8 text-xs gap-1 border-blue-500/40 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400/30 dark:text-blue-400 dark:hover:bg-blue-950/30 touch-manipulation"
            onClick={(e) => { e.stopPropagation(); onLearn(); }}
          >
            <BookOpen className="h-3 w-3" />
            למידה
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`flex-1 h-8 text-xs gap-1 touch-manipulation ${
              unlocked
                ? "border-green-500/40 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-400/30 dark:text-green-400 dark:hover:bg-green-950/30"
                : "border-muted text-muted-foreground cursor-not-allowed opacity-60"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (unlocked) onPractice();
            }}
            disabled={!unlocked}
            title={!unlocked ? "יש לסיים את הנושא הקודם כדי לפתוח נושא זה" : undefined}
          >
            {unlocked ? <Brain className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            {unlocked ? "תרגול" : "נעול"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ModuleSection({
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
    ? Math.round(
        moduleTopics.reduce(
          (sum, t) => sum + getTopicCompletion(t.id, questionCounts[t.id] ?? 0),
          0
        ) / moduleTopics.length
      )
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
              onLearn={() => onLearn(topic.id)}
              onPractice={() => onPractice(topic.id)}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { progress, getTopicCompletion, totalCorrect, totalAnswered } = useProgress();
  const { topics, loading } = useSupabaseTopics();
  const { learnMap, questionCounts } = useDashboardData();
  const { isTopicUnlocked, isTopicComplete } = useTopicCompletion();
  const [tipDismissed, setTipDismissed] = useState(
    () => localStorage.getItem(PRACTICE_TIP_DISMISSED_KEY) === "true"
  );

  const hasPracticed = totalAnswered > 0;
  const hasLearnedAny = Object.values(learnMap).some((arr) => arr.length > 0);
  const showPracticeTip = hasPracticed && !hasLearnedAny && !tipDismissed;

  const activeModules = useMemo(
    () => MODULES.filter((m) => !m.comingSoon).sort((a, b) => a.order - b.order),
    []
  );

  const comingSoonModules = useMemo(
    () => MODULES.filter((m) => m.comingSoon).sort((a, b) => a.order - b.order),
    []
  );

  const allModuleTopicIds = useMemo(
    () => new Set(MODULES.flatMap((m) => m.topicIds)),
    []
  );

  const ungroupedTopics = useMemo(
    () => topics.filter((t) => !allModuleTopicIds.has(t.id)),
    [topics, allModuleTopicIds]
  );

  const defaultExpanded = useMemo(
    () => activeModules.map((m) => m.id),
    [activeModules]
  );

  const lastExam = progress.examHistory.length > 0
    ? progress.examHistory[progress.examHistory.length - 1]
    : null;

  const lastActiveLabel = progress.lastActiveDate
    ? (() => {
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (progress.lastActiveDate === today) return "היום";
        if (progress.lastActiveDate === yesterday.toDateString()) return "אתמול";
        return new Date(progress.lastActiveDate).toLocaleDateString("he-IL");
      })()
    : null;

  if (loading) {
    return (
      <div className="min-h-screen pb-24 pt-4">
        <div className="mx-auto max-w-2xl px-4 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="mx-auto max-w-2xl px-4 space-y-6">
        {/* Breadcrumb trail: Home → Python Fundamentals */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1 rounded px-1.5 py-1 hover:text-foreground hover:bg-foreground/5 transition-colors touch-manipulation"
          >
            <Home className="h-3.5 w-3.5" />
            <span>בית</span>
          </button>
          <ChevronLeft className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
          <span className="px-1.5 py-1 font-semibold text-foreground">יסודות פייתון</span>
        </nav>

        {/* Python Hero Section */}
        <PythonHero />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">
              שלום, {progress.username}
            </h1>
            <p className="text-muted-foreground mt-1">הנה סקירת הלימודים שלך.</p>
          </div>
          <XpBadge xp={progress.xp} level={progress.level} />
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Card className="bg-card border border-foreground/10">
            <CardContent className="p-2 sm:p-3 text-center">
              <p className="text-xl sm:text-2xl font-bold text-foreground font-mono">{totalCorrect}</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">שאלות נכונות</p>
            </CardContent>
          </Card>
          <Card className="bg-card border border-foreground/10">
            <CardContent className="p-2 sm:p-3 text-center">
              <p className="text-xl sm:text-2xl font-bold text-foreground font-mono">{totalAnswered}</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">סה״כ נפתרו</p>
            </CardContent>
          </Card>
          <Card className="bg-card border border-foreground/10">
            <CardContent className="p-2 sm:p-3 text-center flex flex-col items-center">
              {progress.streak > 0 ? (
                <>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                    <p className="text-xl sm:text-2xl font-bold text-foreground font-mono">{progress.streak}</p>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">ימים רצופים</p>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mb-0.5" />
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                    {lastActiveLabel ? `פעיל ${lastActiveLabel}` : "התחל לתרגל!"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick exam CTA */}
        <Card
          className="bg-card border border-foreground/10 cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => navigate("/exam")}
        >
          <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground">מבחן סימולציה</p>
                <p className="text-xs text-muted-foreground">
                  6 שאלות, 3 שעות — כמו במבחן האמיתי
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              {lastExam ? (
                <p className="text-xs text-muted-foreground">
                  אחרון: {Math.round((lastExam.score / lastExam.total) * 100)}%
                </p>
              ) : null}
              <Button size="sm" variant="outline" className="text-xs h-8 mt-1 min-w-[60px] touch-manipulation">
                התחל
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Soft practice tip banner */}
        {showPracticeTip && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/20 p-3 text-sm text-amber-700 dark:text-amber-400">
            <span className="mt-0.5 text-base">💡</span>
            <p className="flex-1">טיפ: נסה להתחיל עם למידת המושגים לפני שתתרגל!</p>
            <button
              onClick={() => {
                setTipDismissed(true);
                localStorage.setItem(PRACTICE_TIP_DISMISSED_KEY, "true");
              }}
              className="shrink-0 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 touch-manipulation"
              aria-label="סגור"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Module sections */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">מסלול הלמידה</h2>
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
                onLearn={(topicId) => navigate(`/learn/${topicId}`)}
                onPractice={(topicId) => navigate(`/practice/${topicId}`)}
              />
            ))}
          </Accordion>

          {/* Coming soon modules */}
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

          {/* Ungrouped topics fallback */}
          {ungroupedTopics.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-bold text-muted-foreground mb-3">אחר</h3>
              <div className="grid grid-cols-2 gap-3">
                {ungroupedTopics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    questionCount={questionCounts[topic.id] ?? 0}
                    learnMap={learnMap}
                    progress={progress}
                    getTopicCompletion={getTopicCompletion}
                    isTopicUnlocked={isTopicUnlocked}
                    isTopicComplete={isTopicComplete}
                    onLearn={() => navigate(`/learn/${topic.id}`)}
                    onPractice={() => navigate(`/practice/${topic.id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
