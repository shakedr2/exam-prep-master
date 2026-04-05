import { useNavigate } from "react-router-dom";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";
import { useSupabaseQuestionCount } from "@/hooks/useSupabaseQuestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, AlertTriangle, GraduationCap } from "lucide-react";

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
  const answered = Object.keys(progress.answeredQuestions).filter((id) =>
    id.startsWith(topic.id) || progress.answeredQuestions[id] !== undefined
  ).length;

  return (
    <Card
      className="cursor-pointer bg-card border border-foreground/10 hover:border-primary/40 hover:shadow-md transition-all group"
      onClick={onClick}
    >
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
          <p className="text-[11px] text-muted-foreground text-left">{completion}%</p>
        </div>
      </CardContent>
    </Card>
  );
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { progress, getTopicCompletion } = useProgress();
  const { topics, loading } = useSupabaseTopics();

  const lastExam = progress.examHistory.length > 0
    ? progress.examHistory[progress.examHistory.length - 1]
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

        {/* Quick exam CTA */}
        <Card
          className="bg-card border border-foreground/10 cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => navigate("/exam")}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">מבחן סימולציה</p>
                <p className="text-xs text-muted-foreground">
                  6 שאלות, 3 שעות — כמו במבחן האמיתי
                </p>
              </div>
            </div>
            <div className="text-left">
              {lastExam ? (
                <p className="text-xs text-muted-foreground">
                  אחרון: {Math.round((lastExam.score / lastExam.total) * 100)}%
                </p>
              ) : null}
              <Button size="sm" variant="outline" className="text-xs h-7 mt-1">
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
