import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Target, BookOpen, GraduationCap, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { TopicCard } from "@/components/TopicCard";
import { XpBadge } from "@/components/XpBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { topics, getQuestionsByTopic, questions } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";

function getDailySummary(answeredQuestions: Record<string, { correct: boolean; attempts: number }>) {
  const today = new Date().toDateString();
  const storageKey = `examprep_daily_${today}`;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved) as { count: number; correct: number };
  } catch {}
  return { count: 0, correct: 0 };
}

const Index = () => {
  const { progress, setUsername, totalCorrect, totalAnswered, getTopicCompletion } = useProgress();
  const [nameInput, setNameInput] = useState("");
  const navigate = useNavigate();

  const overallCompletion = Math.round((totalCorrect / Math.max(questions.length, 1)) * 100);
  const daily = getDailySummary(progress.answeredQuestions);
  const dailyAccuracy = daily.count > 0 ? Math.round((daily.correct / daily.count) * 100) : 0;

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
              className="text-center text-lg text-foreground"
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
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <XpBadge xp={progress.xp} level={progress.level} />
            </div>
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
        {/* Daily Summary */}
        {daily.count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-3"
          >
            <TrendingUp className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-foreground">
              היום תרגלת <strong>{daily.count}</strong> שאלות בדיוק של <strong>{dailyAccuracy}%</strong> 💪
            </p>
          </motion.div>
        )}

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
          <PomodoroTimer />
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
