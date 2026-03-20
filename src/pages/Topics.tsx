import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { TopicCard } from "@/components/TopicCard";
import { Progress } from "@/components/ui/progress";
import { topics, getQuestionsByTopic, getConceptQuestions } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";

const Topics = () => {
  const { getTopicCompletion, progress } = useProgress();
  const navigate = useNavigate();
  const conceptQuestions = getConceptQuestions();
  const conceptCorrect = conceptQuestions.filter(
    q => progress.answeredQuestions[q.id]?.correct
  ).length;
  const conceptPercent = Math.round((conceptCorrect / Math.max(conceptQuestions.length, 1)) * 100);

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="mx-auto max-w-lg px-4">
        <h1 className="text-2xl font-bold text-foreground mb-1">נושאי לימוד</h1>
        <p className="text-sm text-muted-foreground mb-6">בחר נושא כדי להתחיל לתרגל</p>

        {/* Concepts card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/concepts")}
          className="cursor-pointer mb-6 overflow-hidden rounded-xl border-2 border-primary/30 bg-primary/5 p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
              📚
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground">מושגי יסוד</h3>
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
        </motion.div>

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
