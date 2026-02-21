import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizView } from "@/components/QuizView";
import { TracingView } from "@/components/TracingView";
import { CodingView } from "@/components/CodingView";
import { WarmupView } from "@/components/WarmupView";
import { topics, getQuestionsByTopic, type Question } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";
import { AiTutor } from "@/components/AiTutor";

const TopicPractice = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { answerQuestion } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [warmupDone, setWarmupDone] = useState(false);

  const topic = topics.find(t => t.id === topicId);
  const topicQuestions = useMemo(() => getQuestionsByTopic(topicId as any), [topicId]);

  if (!topic || topicQuestions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>נושא לא נמצא</p>
      </div>
    );
  }

  const q = topicQuestions[currentIndex];
  const hasWarmups = q.warmupQuestions && q.warmupQuestions.length > 0;
  const showWarmup = hasWarmups && !warmupDone;
  const progressPct = ((currentIndex + 1) / topicQuestions.length) * 100;

  const handleAnswer = (correct: boolean) => {
    answerQuestion(q.id, correct);
  };

  const handleNext = () => {
    if (currentIndex < topicQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setWarmupDone(false);
    } else {
      navigate("/topics");
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-4">
      <div className="mx-auto max-w-lg px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/topics")}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{topic.name}</p>
            <div className="flex items-center gap-2">
              <Progress value={progressPct} className="h-2 flex-1" />
              <span className="text-xs font-medium text-muted-foreground">
                {currentIndex + 1}/{topicQuestions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Warmup or Question */}
        <AnimatePresence mode="wait">
          {showWarmup ? (
            <motion.div
              key={`warmup-${q.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <WarmupView
                warmupQuestions={q.warmupQuestions!}
                onComplete={() => setWarmupDone(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              {/* Ready banner after warmup */}
              {hasWarmups && warmupDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 rounded-xl bg-success/10 border border-success/30 p-3 text-center"
                >
                  <p className="text-sm font-semibold text-success">🎯 עכשיו אתה מוכן! הנה השאלה המלאה:</p>
                </motion.div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  q.type === "quiz" ? "bg-primary/10 text-primary" :
                  q.type === "tracing" ? "bg-accent/10 text-accent" :
                  "bg-warning/10 text-warning"
                }`}>
                  {q.type === "quiz" ? "🔘 רב-ברירה" : q.type === "tracing" ? "🔍 מעקב קוד" : "✍️ כתיבת קוד"}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  q.difficulty === "easy" ? "bg-success/10 text-success" :
                  q.difficulty === "medium" ? "bg-warning/10 text-warning" :
                  "bg-destructive/10 text-destructive"
                }`}>
                  {q.difficulty === "easy" ? "קל" : q.difficulty === "medium" ? "בינוני" : "קשה"}
                </span>
              </div>

              {q.type === "quiz" && <QuizView q={q} onAnswer={handleAnswer} />}
              {q.type === "tracing" && <TracingView q={q} onAnswer={handleAnswer} />}
              {q.type === "coding" && <CodingView q={q} onAnswer={handleAnswer} />}
            </motion.div>
          )}
        </AnimatePresence>

        {!showWarmup && (
          <Button onClick={handleNext} className="mt-4 w-full gradient-primary text-primary-foreground gap-2">
            {currentIndex < topicQuestions.length - 1 ? "שאלה הבאה" : "סיום נושא"}
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AiTutor
        questionContext={`סוג: ${q.type}, נושא: ${topic.name}, קושי: ${q.difficulty}\n${
          q.type === "coding" ? `כותרת: ${(q as any).title}\nתיאור: ${(q as any).description}` :
          `שאלה: ${(q as any).question}\n${(q as any).code ? `קוד:\n${(q as any).code}` : ""}`
        }`}
      />
    </div>
  );
};

export default TopicPractice;
