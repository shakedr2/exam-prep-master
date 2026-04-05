import { motion } from "framer-motion";
import { Target, CheckCircle2, BarChart3, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { topics, getQuestionsByTopic, questions } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";
import { useNavigate } from "react-router-dom";

const ProgressPage = () => {
  const { progress, totalCorrect, totalAnswered, getTopicCompletion, getIncorrectQuestions } = useProgress();
  const navigate = useNavigate();
  const overallCompletion = Math.round((totalCorrect / Math.max(questions.length, 1)) * 100);
  const accuracyRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const incorrectQuestions = getIncorrectQuestions();

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="mx-auto max-w-lg px-4 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">התקדמות</h1>

        {/* Stats — practical, not gamified */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: CheckCircle2, label: "נענו", value: totalAnswered, color: "text-primary" },
            { icon: Target, label: "נכונות", value: totalCorrect, color: "text-success" },
            { icon: BarChart3, label: "דיוק", value: `${accuracyRate}%`, color: "text-foreground" },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-foreground/10 bg-card p-4 text-center"
            >
              <Icon className={`mx-auto h-5 w-5 mb-1.5 ${color}`} />
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Overall progress */}
        <div className="rounded-lg border border-foreground/10 bg-card p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-foreground">התקדמות כללית</span>
            <span className="text-primary font-bold">{overallCompletion}%</span>
          </div>
          <Progress value={overallCompletion} className="h-2.5" />
          <p className="text-xs text-muted-foreground">{totalCorrect} מתוך {questions.length} שאלות</p>
        </div>

        {/* Review Mistakes */}
        {incorrectQuestions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Button
              onClick={() => navigate("/review-mistakes")}
              variant="outline"
              className="w-full h-12 text-sm gap-2 border-destructive/30 text-destructive hover:bg-destructive/5"
            >
              <RotateCcw className="h-4 w-4" />
              חזרה על {incorrectQuestions.length} טעויות
            </Button>
          </motion.div>
        )}

        {/* Exam History — prominent placement */}
        {progress.examHistory.length > 0 && (
          <div>
            <h2 className="font-bold text-foreground mb-3">היסטוריית מבחנים</h2>
            <div className="space-y-2">
              {progress.examHistory.slice(-5).reverse().map((exam, i) => {
                const pct = Math.round((exam.score / exam.total) * 100);
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-foreground/10 bg-card p-3">
                    <span className="text-sm text-muted-foreground">
                      {new Date(exam.date).toLocaleDateString("he-IL")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {exam.score}/{exam.total}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        pct >= 80 ? "bg-success/10 text-success" :
                        pct >= 60 ? "bg-warning/10 text-warning" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Per topic */}
        <div>
          <h2 className="font-bold text-foreground mb-3">לפי נושא</h2>
          <div className="space-y-2">
            {topics.map(topic => {
              const tq = getQuestionsByTopic(topic.id);
              const pct = getTopicCompletion(topic.id, tq.length);
              const answered = Object.keys(progress.answeredQuestions).filter((id) =>
                tq.some((q) => q.id === id)
              ).length;
              return (
                <div key={topic.id} className="rounded-lg border border-foreground/10 bg-card p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{topic.icon}</span>
                    <span className="text-sm font-semibold flex-1 text-foreground">{topic.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{answered}/{tq.length}</span>
                    <span className="text-xs text-primary font-bold w-10 text-left">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
