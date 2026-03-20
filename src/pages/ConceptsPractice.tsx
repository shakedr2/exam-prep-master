import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizView } from "@/components/QuizView";
import { getConceptQuestions, conceptTopicLabels } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";
import type { TopicId, QuizQuestion } from "@/data/questions";

const TOPIC_ICONS: Record<TopicId, string> = {
  tracing: "🔍",
  conditions: "🔀",
  loops: "🔄",
  lists: "📋",
  math: "🔢",
};

export default function ConceptsPractice() {
  const navigate = useNavigate();
  const { answerQuestion, progress } = useProgress();
  const conceptQuestions = useMemo(() => getConceptQuestions(), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());

  const total = conceptQuestions.length;
  const currentQ = conceptQuestions[currentIndex] as QuizQuestion;
  const currentTopic = currentQ?.topic;

  // Find where each topic group starts
  const topicGroupStart = useMemo(() => {
    const map = new Map<TopicId, number>();
    conceptQuestions.forEach((q, i) => {
      if (!map.has(q.topic)) map.set(q.topic, i);
    });
    return map;
  }, [conceptQuestions]);

  // Is this the first question of a new topic group?
  const isNewGroup = topicGroupStart.get(currentTopic) === currentIndex;

  const correctCount = conceptQuestions.filter(
    q => progress.answeredQuestions[q.id]?.correct
  ).length;

  const progressPercent = Math.round((correctCount / Math.max(total, 1)) * 100);
  const isComplete = currentIndex >= total;

  const handleAnswer = (correct: boolean) => {
    answerQuestion(currentQ.id, correct);
    setAnswered(prev => new Set(prev).add(currentIndex));
  };

  const goNext = () => setCurrentIndex(i => Math.min(i + 1, total));
  const goPrev = () => setCurrentIndex(i => Math.max(i - 1, 0));

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="text-6xl">🎓</div>
          <h1 className="text-2xl font-bold text-foreground">כל הכבוד!</h1>
          <p className="text-muted-foreground">
            סיימת לעבור על כל {total} מושגי היסוד
          </p>
          <div className="rounded-xl bg-card border border-border p-4 space-y-2">
            <p className="text-sm text-muted-foreground">תשובות נכונות</p>
            <p className="text-3xl font-bold text-primary">{correctCount}/{total}</p>
            <Progress value={progressPercent} className="h-2" />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => {
                setCurrentIndex(0);
                setAnswered(new Set());
              }}
            >
              <RotateCcw className="h-4 w-4" />
              חזור שוב
            </Button>
            <Button
              className="flex-1 gradient-primary text-primary-foreground"
              onClick={() => navigate("/topics")}
            >
              חזור לנושאים
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="mx-auto max-w-lg px-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/topics")}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">📚 מושגי יסוד</h1>
            <p className="text-xs text-muted-foreground">
              {currentIndex + 1} מתוך {total}
            </p>
          </div>
          <span className="text-sm font-semibold text-primary">{progressPercent}%</span>
        </div>

        {/* Progress bar */}
        <Progress value={((currentIndex + 1) / total) * 100} className="h-2" />

        {/* Topic group header */}
        <AnimatePresence mode="wait">
          {isNewGroup && (
            <motion.div
              key={`group-${currentTopic}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 pt-2"
            >
              <span className="text-xl">{TOPIC_ICONS[currentTopic]}</span>
              <span className="text-sm font-semibold text-foreground">
                {conceptTopicLabels[currentTopic]}
              </span>
              <div className="flex-1 h-px bg-border" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <QuizView q={currentQ} onAnswer={handleAnswer} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="gap-1.5"
          >
            <ArrowRight className="h-4 w-4" />
            הקודם
          </Button>
          <div className="flex-1" />
          {answered.has(currentIndex) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                size="sm"
                onClick={goNext}
                className="gap-1.5 gradient-primary text-primary-foreground"
              >
                {currentIndex === total - 1 ? "סיום" : "הבא"}
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
