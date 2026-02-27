import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, BookOpen, GraduationCap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TheoryCard } from "@/components/TheoryCard";
import { WarmupView } from "@/components/WarmupView";
import { topics, questions as allQuestions } from "@/data/questions";
import { getTheoryForQuestion } from "@/lib/theoryContent";

const TopicLearn = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"theory" | "warmup" | "done">("theory");
  const [completedCount, setCompletedCount] = useState(0);

  const topic = topics.find(t => t.id === topicId);
  const topicQuestions = useMemo(
    () => allQuestions.filter(q => q.topic === topicId),
    [topicId]
  );

  if (!topic || topicQuestions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">נושא לא נמצא</p>
      </div>
    );
  }

  const q = topicQuestions[currentIndex];
  const theory = getTheoryForQuestion(q);
  const hasWarmups = q.warmupQuestions && q.warmupQuestions.length > 0;
  const progressPct = ((currentIndex + 1) / topicQuestions.length) * 100;
  const isFinished = currentIndex >= topicQuestions.length;

  const handleTheoryDone = () => {
    if (hasWarmups) {
      setPhase("warmup");
    } else {
      goToNext();
    }
  };

  const handleWarmupDone = () => {
    goToNext();
  };

  const goToNext = () => {
    setCompletedCount(c => c + 1);
    if (currentIndex < topicQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setPhase("theory");
    } else {
      setPhase("done");
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
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-primary">מצב למידה</p>
              <span className="text-xs text-muted-foreground">• {topic.name}</span>
            </div>
            {phase !== "done" && (
              <div className="flex items-center gap-2">
                <Progress value={progressPct} className="h-2 flex-1" />
                <span className="text-xs font-medium text-muted-foreground">
                  {currentIndex + 1}/{topicQuestions.length}
                </span>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase === "done" ? (
            /* Completion Summary */
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-success/30 bg-card p-6 text-center space-y-5"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
              >
                <GraduationCap className="h-10 w-10 text-success" />
              </motion.div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">🎓 סיימת ללמוד!</h2>
                <p className="text-sm text-muted-foreground">
                  עברת על {completedCount} קונספטים בנושא <span className="font-semibold text-foreground">{topic.name}</span>
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>תיאוריה + שאלות הכנה הושלמו</span>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={() => navigate(`/topic/${topicId}`)}
                  className="w-full gradient-primary text-primary-foreground gap-2"
                >
                  🚀 עכשיו תרגל!
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/topics")}
                  className="w-full gap-2"
                >
                  חזרה לנושאים
                </Button>
              </div>
            </motion.div>
          ) : phase === "theory" && theory ? (
            <motion.div
              key={`theory-${q.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <TheoryCard
                theoryIntro={theory.theoryIntro}
                approachTip={theory.approachTip}
                onContinue={handleTheoryDone}
              />
            </motion.div>
          ) : phase === "warmup" && hasWarmups ? (
            <motion.div
              key={`warmup-${q.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <WarmupView
                warmupQuestions={q.warmupQuestions!}
                onComplete={handleWarmupDone}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TopicLearn;
