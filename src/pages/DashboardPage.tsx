import { useNavigate } from "react-router-dom";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";
import { useSupabaseQuestionCount } from "@/hooks/useSupabaseQuestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, CheckCircle2, GraduationCap } from "lucide-react";
import { questions as staticQuestions } from "@/data/questions";

function TopicCard({
  topic,
  progress,
  getTopicCompletion,
  onClick,
}: {
  topic: { id: string; name: string; icon: string | null; description: string | null };
  progress: ReturnType<typeof useProgress>["progress"];
  getTopicCompletion: ReturnType<typeof useProgress>["getTopicCompletion"];
  onClick: () => void;
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
    <Card
      className="cursor-pointer bg-card border border-foreground/10 hover:border-primary/40 hover:shadow-md transition-all group relative"
      onClick={onClick}
    >
      {completion === 100 && (
        <span className="absolute top-2 right-2 text-lg" title="הושלם">✅</span>
      )}
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
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
      </CardContent>
    </Card>
  );
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { progress, getTopicCompletion, totalCorrect, totalAnswered } = useProgress();
  const { topics, loading } = useSupabaseTopics();

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

        {/* Topic grid */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">כל הנושאים</h2>
          <div className="grid grid-cols-2 gap-3">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                progress={progress}
                getTopicCompletion={getTopicCompletion}
                onClick={() => navigate(`/practice/${topic.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
