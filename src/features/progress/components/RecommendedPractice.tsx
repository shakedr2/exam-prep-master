import { useNavigate } from "react-router-dom";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { questions, topics } from "@/data/questions";
import type { QuizQuestion } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

const RecommendedPractice = () => {
  const navigate = useNavigate();
  const { getWeakTopics, progress } = useProgress();

  const weakTopics = getWeakTopics();

  if (weakTopics.length === 0) return null;

  const weakTopicIds = new Set(weakTopics.map((t) => t.topicId));

  // Quiz questions in weak topics that haven't been answered correctly yet
  const focusedQuestions = (questions as QuizQuestion[]).filter(
    (q): q is QuizQuestion =>
      q.type === "quiz" &&
      weakTopicIds.has(q.topic) &&
      !progress.answeredQuestions[q.id]?.correct
  );

  if (focusedQuestions.length === 0) return null;

  const handleStartFocusedPractice = () => {
    navigate("/focused-practice", {
      state: { questionIds: focusedQuestions.map((q) => q.id) },
    });
  };

  return (
    <Card className="bg-card border border-foreground/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          למידה מותאמת
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          לפי הביצועים שלך, אנחנו ממליצים להתמקד בנושאים הבאים:
        </p>
        <div className="flex flex-wrap gap-2">
          {weakTopics.map(({ topicId, successRate }) => {
            const topic = topics.find((t) => t.id === topicId);
            return (
              <span
                key={topicId}
                className="inline-flex items-center gap-1 rounded-sm bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive"
              >
                {topic?.icon} {topic?.name}
                <span className="text-destructive/70">
                  ({Math.round(successRate * 100)}%)
                </span>
              </span>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {focusedQuestions.length} שאלות נבחרו לתרגול ממוקד
        </p>
        <Button className="w-full rounded-sm bg-foreground text-background hover:bg-foreground/80" onClick={handleStartFocusedPractice}>
          <Target className="h-4 w-4 me-2" />
          התחל תרגול ממוקד
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecommendedPractice;
