import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import type { Topic } from "@/data/questions";
import { questions } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";
import { getTopicAccuracy, PROFICIENCY_CONFIG } from "@/hooks/useAdaptive";

interface TopicCardProps {
  topic: Topic;
  completion: number;
  questionCount: number;
  index: number;
}

export function TopicCard({ topic, completion, questionCount, index }: TopicCardProps) {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const accuracy = getTopicAccuracy(topic.id, questions, progress.answeredQuestions);
  const proficiency = accuracy < 50 ? "beginner" : accuracy < 80 ? "intermediate" : "advanced";
  const config = PROFICIENCY_CONFIG[proficiency];
  const hasAnswered = Object.keys(progress.answeredQuestions).some(id =>
    questions.find(q => q.id === id && q.topic === topic.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/topic/${topic.id}`)}
      className="cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${topic.color} text-2xl shadow-sm`}>
          {topic.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground">{topic.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{topic.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{questionCount} שאלות</span>
          {hasAnswered && (
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${config.color}`}>
              {config.icon}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">התקדמות</span>
          <span className="font-semibold text-primary">{completion}%</span>
        </div>
        <Progress value={completion} className="h-2" />
      </div>
    </motion.div>
  );
}
