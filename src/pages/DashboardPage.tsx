import { useNavigate } from "react-router-dom";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { topics, getQuestionsByTopic, getConceptQuestions } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, TrendingUp, AlertTriangle, LayoutGrid } from "lucide-react";
import { useState, useEffect } from "react";
import RecommendedPractice from "@/components/RecommendedPractice";

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

  const conceptQuestions = getConceptQuestions();
  const conceptCorrect = conceptQuestions.filter(
    (q) => progress.answeredQuestions[q.id]?.correct
  ).length;
  const conceptPercent = Math.round((conceptCorrect / Math.max(conceptQuestions.length, 1)) * 100);

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Hello, {progress.username} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's your study overview.</p>
        </div>

        {lastTopicId && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Continue Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Resume <strong>{topics.find((t) => t.id === lastTopicId)?.name}</strong>
              </p>
              <Button size="sm" onClick={() => navigate(`/practice/${lastTopicId}`)}>
                Resume
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-primary" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topics.map((topic) => {
              const total = getQuestionsByTopic(topic.id).length;
              const completion = getTopicCompletion(topic.id, total);
              return (
                <div key={topic.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{topic.name}</span>
                    <span className="text-muted-foreground">{completion}%</span>
                  </div>
                  <Progress value={completion} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {weakTopics.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Weak Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {weakTopics.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{topic.name}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/practice/${topic.id}`)}
                  >
                    Practice Now
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <RecommendedPractice />

        <div>
          <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            All Topics
          </h2>

          {/* Concepts card */}
          <Card
            className="cursor-pointer bg-primary/5 border-2 border-primary/30 hover:shadow-md transition-shadow mb-3"
            onClick={() => navigate("/concepts")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                  📚
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground">מושגי יסוד</p>
                  <p className="text-xs text-muted-foreground">למד את המושגים הבסיסיים לפני שמתחילים לתרגל</p>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-primary">{conceptQuestions.length} שאלות</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">התקדמות</span>
                  <span className="font-semibold text-primary">{conceptPercent}%</span>
                </div>
                <Progress value={conceptPercent} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {topics.map((topic) => {
              const total = getQuestionsByTopic(topic.id).length;
              const completion = getTopicCompletion(topic.id, total);
              return (
                <Card
                  key={topic.id}
                  className="cursor-pointer bg-card border-border hover:bg-accent transition-colors"
                  onClick={() => navigate(`/practice/${topic.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="text-2xl mb-2">{topic.icon}</div>
                    <p className="font-semibold text-foreground text-sm">{topic.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{completion}% complete</p>
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
