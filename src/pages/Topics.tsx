import { TopicCard } from "@/components/TopicCard";
import { topics, getQuestionsByTopic } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";

const Topics = () => {
  const { getTopicCompletion } = useProgress();

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="mx-auto max-w-lg px-4">
        <h1 className="text-2xl font-bold text-foreground mb-1">נושאי לימוד</h1>
        <p className="text-sm text-muted-foreground mb-6">בחר נושא כדי להתחיל לתרגל</p>
        <div className="space-y-3">
          {topics.map((topic, i) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              completion={getTopicCompletion(topic.id, getQuestionsByTopic(topic.id).length)}
              questionCount={getQuestionsByTopic(topic.id).length}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topics;
