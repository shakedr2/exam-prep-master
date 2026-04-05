import { useNavigate } from "react-router-dom";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { topics, getQuestionsByTopic } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, AlertTriangle, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { progress, getTopicCompletion } = useProgress();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const lastTopicId = (() => {
    const answered = Object.keys(progress.answeredQuestions);
    if (!answered.length) return null;
    const lastId = answered[answered.length - 1];
    const found = topics.find((t) => {
      const qs = getQuestionsByTopic(t.id);
      return qs.some((q) => q.id === lastId);
    });
    return found?.id ?? null;
  })();

  const weakTopics = topics.filter((t) => {
    const total = getQuestionsByTopic(t.id).length;
    const completion = getTopicCompletion(t.id, total);
    return completion > 0 && completion < 60;
  }).slice(0, 3);

  const lastExam = progress.examHistory.length > 0
    ? progress.examHistory[progress.examHistory.length - 1]
    : null;

  if (isLoading) {
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

        {/* Continue learning — prominent card */}
        {lastTopicId && (
          <Card
            className="bg-primary/5 border-2 border-primary/30 cursor-pointer hover:bg-primary/10 transition-colors"
            onClick={() => navigate(`/practice/${lastTopicId}`)}
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">המשך ללמוד</p>
                  <p className="text-sm text-muted-foreground">
                    {topics.find((t) => t.id === lastTopicId)?.icon}{" "}
                    {topics.find((t) => t.id === lastTopicId)?.name}
                  </p>
                </div>
              </div>
              <Button size="sm" className="rounded-md">
                המשך ←
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Weak topics */}
        {weakTopics.length > 0 && (
          <Card className="border border-warning/20 bg-warning/5">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <p className="text-sm font-bold text-foreground">נקודות חולשה</p>
              </div>
              {weakTopics.map((topic) => {
                const total = getQuestionsByTopic(topic.id).length;
                const completion = getTopicCompletion(topic.id, total);
                return (
                  <div key={topic.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{topic.icon}</span>
                      <span className="text-sm text-foreground">{topic.name}</span>
                      <span className="text-xs text-muted-foreground">({completion}%)</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => navigate(`/practice/${topic.id}`)}
                    >
                      תרגול
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

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
            {topics.map((topic) => {
              const total = getQuestionsByTopic(topic.id).length;
              const completion = getTopicCompletion(topic.id, total);
              const answered = Object.keys(progress.answeredQuestions).filter((id) => {
                const qs = getQuestionsByTopic(topic.id);
                return qs.some((q) => q.id === id);
              }).length;
              return (
                <Card
                  key={topic.id}
                  className="cursor-pointer bg-card border border-foreground/10 hover:border-primary/40 hover:shadow-md transition-all group"
                  onClick={() => navigate(`/practice/${topic.id}`)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{topic.icon}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {answered}/{total}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                        {topic.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {topic.description}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Progress value={completion} className="h-1.5" />
                      <p className="text-[11px] text-muted-foreground text-left">{completion}%</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
