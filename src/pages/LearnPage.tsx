import { useParams, useNavigate } from "react-router-dom";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";
import { getTutorialByTopicId } from "@/data/topicTutorials";
import { useSupabaseQuestionCount } from "@/hooks/useSupabaseQuestions";
import { TopicTutorial } from "@/components/TopicTutorial";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const LearnPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { topics, loading } = useSupabaseTopics();

  const topic = topics.find((t) => t.id === topicId);
  const tutorial = topicId ? getTutorialByTopicId(topicId) : undefined;
  const questionCount = useSupabaseQuestionCount(topicId ?? "");

  if (loading) {
    return (
      <div className="min-h-screen pb-24 pt-4">
        <div className="mx-auto max-w-2xl px-4 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!topic || !tutorial) {
    return (
      <div className="min-h-screen pb-24 pt-4" dir="rtl">
        <div className="mx-auto max-w-2xl px-4 space-y-4">
          <p className="text-muted-foreground">חומר לימוד לנושא זה טרם נוסף.</p>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <ArrowRight className="h-4 w-4 ml-1" />
            חזרה לדשבורד
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-4" dir="rtl">
      <div className="mx-auto max-w-2xl px-4">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-muted-foreground"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזרה לדשבורד
        </Button>
        <TopicTutorial
          tutorial={tutorial}
          topicName={topic.name}
          topicIcon={topic.icon ?? "📖"}
          questionCount={questionCount}
          onStartPractice={() => navigate(`/practice/${topicId}`)}
        />
      </div>
    </div>
  );
};

export default LearnPage;
