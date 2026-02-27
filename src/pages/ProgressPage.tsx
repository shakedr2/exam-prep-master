import { motion } from "framer-motion";
import { Trophy, Zap, Flame, Target, Award, Star, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { topics, getQuestionsByTopic, questions } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";
import { useNavigate } from "react-router-dom";

const BADGE_INFO: Record<string, { icon: string; name: string; description: string }> = {
  first_10: { icon: "🎯", name: "מתחיל מבטיח", description: "10 תשובות נכונות" },
  quarter_century: { icon: "⭐", name: "25 תשובות", description: "25 תשובות נכונות" },
  perfect_exam: { icon: "🏆", name: "מבחן מושלם", description: "ציון 100 במבחן" },
};

const ProgressPage = () => {
  const { progress, totalCorrect, totalAnswered, getTopicCompletion, getIncorrectQuestions } = useProgress();
  const navigate = useNavigate();
  const overallCompletion = Math.round((totalCorrect / Math.max(questions.length, 1)) * 100);
  const incorrectQuestions = getIncorrectQuestions();

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="mx-auto max-w-lg px-4 space-y-6">
        <h1 className="text-2xl font-bold">התקדמות</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Zap, label: "XP כולל", value: progress.xp, color: "text-xp" },
            { icon: Flame, label: "רצף ימים", value: progress.streak, color: "text-destructive" },
            { icon: Target, label: "נכונות", value: totalCorrect, color: "text-success" },
            { icon: Award, label: "רמה", value: progress.level, color: "text-primary" },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <Icon className={`mx-auto h-6 w-6 mb-2 ${color}`} />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Review Mistakes */}
        {incorrectQuestions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Button
              onClick={() => navigate("/review-mistakes")}
              className="w-full h-14 text-base gap-3 gradient-primary text-primary-foreground rounded-xl"
            >
              <RotateCcw className="h-5 w-5" />
              🔄 חזרה על {incorrectQuestions.length} טעויות
            </Button>
          </motion.div>
        )}

        {/* Overall */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">התקדמות כללית</span>
            <span className="text-primary font-bold">{overallCompletion}%</span>
          </div>
          <Progress value={overallCompletion} className="h-3" />
          <p className="text-xs text-muted-foreground">{totalCorrect} מתוך {questions.length} שאלות</p>
        </div>

        {/* Per topic */}
        <div>
          <h2 className="font-bold mb-3">לפי נושא</h2>
          <div className="space-y-3">
            {topics.map(topic => {
              const tq = getQuestionsByTopic(topic.id);
              const pct = getTopicCompletion(topic.id, tq.length);
              return (
                <div key={topic.id} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{topic.icon}</span>
                    <span className="text-sm font-semibold flex-1">{topic.name}</span>
                    <span className="text-xs text-primary font-bold">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="font-bold mb-3">🏅 הישגים</h2>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(BADGE_INFO).map(([key, badge]) => {
              const earned = progress.badges.includes(key);
              return (
                <div
                  key={key}
                  className={`rounded-xl border p-3 text-center transition-all ${
                    earned ? "border-xp bg-xp/10" : "border-border bg-card opacity-40"
                  }`}
                >
                  <p className="text-2xl mb-1">{badge.icon}</p>
                  <p className="text-xs font-semibold">{badge.name}</p>
                  <p className="text-[10px] text-muted-foreground">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exam History */}
        {progress.examHistory.length > 0 && (
          <div>
            <h2 className="font-bold mb-3">📊 היסטוריית מבחנים</h2>
            <div className="space-y-2">
              {progress.examHistory.slice(-5).reverse().map((exam, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                  <span className="text-sm text-muted-foreground">
                    {new Date(exam.date).toLocaleDateString("he-IL")}
                  </span>
                  <span className="font-bold text-primary">
                    {exam.score}/{exam.total} ({Math.round((exam.score / exam.total) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
