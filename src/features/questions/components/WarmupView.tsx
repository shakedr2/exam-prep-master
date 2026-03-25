import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Lightbulb, ChevronLeft, Flame, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import type { WarmupQuestion } from "@/data/questions";

interface WarmupViewProps {
  warmupQuestions: WarmupQuestion[];
  onComplete: () => void;
}

function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--xp))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = 6 + Math.random() * 6;

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x, scale: 1, rotate: 0 }}
      animate={{
        opacity: 0,
        y: -120 - Math.random() * 80,
        x: x + (Math.random() - 0.5) * 120,
        scale: 0,
        rotate: Math.random() * 360,
      }}
      transition={{ duration: 0.8 + Math.random() * 0.4, delay, ease: "easeOut" }}
      className="absolute bottom-0 rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    />
  );
}

function StreakBadge({ streak }: { streak: number }) {
  if (streak < 2) return null;

  const icon = streak >= 4 ? Star : streak >= 3 ? Zap : Flame;
  const Icon = icon;
  const label = streak >= 4 ? "מושלם! 🔥" : streak >= 3 ? "רצף חם!" : `רצף ${streak}!`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="flex items-center gap-1.5 rounded-full bg-warning/15 border border-warning/30 px-3 py-1"
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      >
        <Icon className="h-4 w-4 text-warning" />
      </motion.div>
      <span className="text-xs font-bold text-warning">{label}</span>
    </motion.div>
  );
}

export function WarmupView({ warmupQuestions, onComplete }: WarmupViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const answered = confirmed;
  const wq = warmupQuestions[currentIndex];
  const totalSteps = warmupQuestions.length + 1;
  const progressPct = ((currentIndex + 1) / totalSteps) * 100;
  const isCorrect = answered && selected === wq.correctIndex;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
  };

  const handleConfirm = () => {
    if (selected === null || answered) return;
    setConfirmed(true);
    if (selected === wq.correctIndex) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak >= 2) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1200);
      }
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < warmupQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Confetti layer */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            {Array.from({ length: 18 }).map((_, i) => (
              <ConfettiParticle
                key={i}
                delay={i * 0.03}
                x={20 + (i / 18) * 260}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Warmup progress + streak */}
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-primary">
          שאלת הכנה {currentIndex + 1}/{warmupQuestions.length}
        </span>
        <Progress value={progressPct} className="h-1.5 flex-1" />
        <StreakBadge streak={streak} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 15 }}
          className={`rounded-2xl border p-5 space-y-4 transition-colors duration-300 ${
            answered && isCorrect && streak >= 2
              ? "border-success/50 bg-success/5"
              : "border-primary/30 bg-card"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              💡 שאלת הכנה
            </span>
          </div>

          <p className="text-base font-semibold text-card-foreground">{wq.question}</p>
          {wq.code && <PythonCodeBlock code={wq.code} />}

          <div className="space-y-2">
            {wq.options.map((opt, i) => (
              <motion.button
                key={i}
                whileTap={!answered ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(i)}
                animate={
                  answered && i === wq.correctIndex && streak >= 2
                    ? { scale: [1, 1.03, 1] }
                    : {}
                }
                transition={{ duration: 0.3 }}
                className={`w-full rounded-xl border p-3 text-right transition-all ${
                  answered
                    ? i === wq.correctIndex
                      ? "border-success bg-success/10 text-success"
                      : i === selected
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-secondary opacity-40 text-foreground"
                    : i === selected
                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                    : "border-primary/20 bg-secondary hover:border-primary/40 text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-foreground">
                    {String.fromCharCode(1488 + i)}
                  </span>
                  <span className="text-sm font-medium">{opt}</span>
                  {answered && i === wq.correctIndex && <Check className="mr-auto h-4 w-4 text-success" />}
                  {answered && i === selected && i !== wq.correctIndex && <X className="mr-auto h-4 w-4 text-destructive" />}
                </div>
              </motion.button>
            ))}
          </div>

          {selected !== null && !answered && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              <Button
                onClick={handleConfirm}
                className="w-full gradient-primary text-primary-foreground"
              >
                בדוק תשובה
              </Button>
            </motion.div>
          )}

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-3 ${
                isCorrect
                  ? "bg-success/10 border border-success/30"
                  : "bg-destructive/10 border border-destructive/30"
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {isCorrect
                  ? streak >= 3
                    ? "🔥 מדהים! רצף נכון!"
                    : streak >= 2
                    ? "⚡ יופי! ממשיכים ברצף!"
                    : "✅ נכון!"
                  : "❌ לא נכון"}
              </p>
              <p className="text-xs text-muted-foreground">{wq.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {answered && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button
            onClick={handleNext}
            className={`w-full gap-2 text-primary-foreground ${
              isCorrect && streak >= 2
                ? "gradient-success"
                : "gradient-primary"
            }`}
          >
            {currentIndex < warmupQuestions.length - 1 ? "שאלת הכנה הבאה" : "🚀 עכשיו אתה מוכן! לשאלה המלאה"}
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
