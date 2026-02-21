import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Target, BookOpen, GraduationCap, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { TopicCard } from "@/components/TopicCard";
import { XpBadge } from "@/components/XpBadge";
import { topics, getQuestionsByTopic, questions } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";

const Index = () => {
  const { progress, setUsername, totalCorrect, totalAnswered, getTopicCompletion } = useProgress();
  const [nameInput, setNameInput] = useState("");
  const navigate = useNavigate();

  const overallCompletion = Math.round((totalCorrect / Math.max(questions.length, 1)) * 100);

  if (!progress.username) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm space-y-6 text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary text-4xl shadow-lg">
            🎓
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gradient-primary">ExamPrep</h1>
            <p className="mt-2 text-muted-foreground">הכנה למבחן כנות בסיסית - Python</p>
            <p className="text-xs text-muted-foreground mt-1">ד"ר רמי רשקוביץ</p>
          </div>
          <div className="space-y-3">
            <Input
              placeholder="מה השם שלך?"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              className="text-center text-lg"
              onKeyDown={e => e.key === "Enter" && nameInput.trim() && setUsername(nameInput.trim())}
            />
            <Button
              onClick={() => nameInput.trim() && setUsername(nameInput.trim())}
              className="w-full gradient-primary text-primary-foreground text-lg py-6 rounded-xl"
              disabled={!nameInput.trim()}
            >
              בואו נתחיל! 🚀
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="gradient-primary px-4 pb-8 pt-6 text-primary-foreground">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80">שלום 👋</p>
              <h1 className="text-2xl font-bold">{progress.username}</h1>
            </div>
            <XpBadge xp={progress.xp} level={progress.level} />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/15 backdrop-blur-sm p-3 text-center">
              <Flame className="mx-auto h-5 w-5 mb-1" />
              <p className="text-lg font-bold">{progress.streak}</p>
              <p className="text-xs opacity-80">רצף ימים</p>
            </div>
            <div className="rounded-xl bg-white/15 backdrop-blur-sm p-3 text-center">
              <Target className="mx-auto h-5 w-5 mb-1" />
              <p className="text-lg font-bold">{totalCorrect}</p>
              <p className="text-xs opacity-80">תשובות נכונות</p>
            </div>
            <div className="rounded-xl bg-white/15 backdrop-blur-sm p-3 text-center">
              <BookOpen className="mx-auto h-5 w-5 mb-1" />
              <p className="text-lg font-bold">{overallCompletion}%</p>
              <p className="text-xs opacity-80">הושלם</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 -mt-4 space-y-4">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          <Button
            onClick={() => navigate("/exam")}
            className="h-auto flex-col gap-2 rounded-xl border border-border bg-card py-4 text-foreground shadow-sm hover:bg-accent"
            variant="ghost"
          >
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-sm font-semibold">מבחן סימולציה</span>
          </Button>
          <Button
            onClick={() => navigate("/topics")}
            className="h-auto flex-col gap-2 rounded-xl border border-border bg-card py-4 text-foreground shadow-sm hover:bg-accent"
            variant="ghost"
          >
            <BookOpen className="h-6 w-6 text-accent" />
            <span className="text-sm font-semibold">תרגול לפי נושא</span>
          </Button>
        </motion.div>

        {/* Topics */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">נושאי לימוד</h2>
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
    </div>
  );
};

export default Index;
