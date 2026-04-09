import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";
import { useSupabaseQuestionCount } from "@/hooks/useSupabaseQuestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, CheckCircle2, GraduationCap, BookOpen, Brain, X } from "lucide-react";
import { questions as staticQuestions } from "@/data/questions";

const TOPIC_ORDER: Record<string, number> = {
  variables_io: 1,
  arithmetic: 2,
  conditions: 3,
  loops: 4,
  functions: 5,
  strings: 6,
  lists: 7,
  tuples_sets_dicts: 8,
};

function TopicCard({
  topic,
  order,
  progress,
  getTopicCompletion,
  onLearn,
  onPractice,
}: {
  topic: { id: string; name: string; icon: string | null; description: string | null };
  order: number;
  progress: ReturnType<typeof useProgress>["progress"];
  getTopicCompletion: ReturnType<typeof useProgress>["getTopicCompletion"];
  onLearn: () => void;
  onPractice: () => void;
}) {
  const count = useSupabaseQuestionCount(topic.id);
  const completion = getTopicCompletion(topic.id, count);

  // Count questions correctly answered for this topic using static question IDs
  const topicQuestionIds = new Set(
    staticQuestions.filter((q) => q.topic === topic.id).map((q) => q.id)
  );
  const answeredCorrect = Object.entries(progress.answeredQuestions)
    .filter(([id, v]) => topicQuestionIds.has(id) && v.correct)
    .length;

  return (
    <Card className="bg-card border border-foreground/10 hover:border-primary/40 hover:shadow-md transition-all group relative">
      <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
        {order}
      </span>
      {completion === 100 && (
        <span className="absolute top-2 left-2 text-base" title="הושלם">✅</span>
      )}
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between pt-3">
          <span className="text-2xl">{topic.icon ?? "📖"}</span>
          <span className="text-[11px] text-muted-foreground font-mono">
            {count} שאלות
          </span>
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
            className="flex-1 h-8 text-xs gap-1 border-green-500/40 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-400/30 dark:text-green-400 dark:hover:bg-green-950/30 touch-manipulation"
            onClick={(e) => { e.stopPropagation(); onPractice(); }}
          >
            <Brain className="h-3 w-3" />
            תרגול
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { progress, getTopicCompletion, totalCorrect, totalAnswered } = useProgress();
  const { topics, loading } = useSupabaseTopics();
  const [showPracticeTip, setShowPracticeTip] = useState(false);

  // Sort topics by recommended learning order; unknown topics go last
  const sortedTopics = [...topics].sort((a, b) => {
    const orderA = TOPIC_ORDER[a.id] ?? 99;
    const orderB = TOPIC_ORDER[b.id] ?? 99;
    return orderA - orderB;
  });

  // Pre-build a map of topicId → Set<questionId> to avoid recalculating per render
  const topicQuestionIdsByTopic = Object.fromEntries(
    topics.map((t) => [
      t.id,
      new Set(staticQuestions.filter((q) => q.topic === t.id).map((q) => q.id)),
    ])
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">
            שלום, {progress.username}
          </h1>
          <p className="text-muted-foreground mt-1">הנה סקירת הלימודים שלך.</p>
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
              onClick={() => setShowPracticeTip(false)}
              className="shrink-0 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 touch-manipulation"
              aria-label="סגור"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Topic grid */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">כל הנושאים</h2>
          <div className="grid grid-cols-2 gap-3">
            {sortedTopics.map((topic) => {
              const topicQuestionIds = topicQuestionIdsByTopic[topic.id] ?? new Set<string>();
              const hasPracticed = Object.keys(progress.answeredQuestions).some(
                (id) => topicQuestionIds.has(id)
              );
              return (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  order={TOPIC_ORDER[topic.id] ?? 0}
                  progress={progress}
                  getTopicCompletion={getTopicCompletion}
                  onLearn={() => navigate(`/learn/${topic.id}`)}
                  onPractice={() => {
                    if (!hasPracticed) setShowPracticeTip(true);
                    navigate(`/practice/${topic.id}`);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
