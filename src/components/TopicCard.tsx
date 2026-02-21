import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import type { Topic } from "@/data/questions";

interface TopicCardProps {
  topic: Topic;
  completion: number;
  questionCount: number;
  index: number;
}

export function TopicCard({ topic, completion, questionCount, index }: TopicCardProps) {
  const navigate = useNavigate();

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
        <span className="text-xs font-medium text-muted-foreground">{questionCount} שאלות</span>
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
