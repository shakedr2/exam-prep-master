import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, X, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

type Phase = "work" | "break";

export function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("work");
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalTime = phase === "work" ? WORK_DURATION : BREAK_DURATION;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          if (phase === "work") {
            toast.success("🎉 סיימת 25 דקות! זמן להפסקה קצרה", { duration: 5000 });
            setPhase("break");
            return BREAK_DURATION;
          } else {
            toast.info("☕ ההפסקה נגמרה! חזרה ללימודים", { duration: 5000 });
            setPhase("work");
            return WORK_DURATION;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, phase, clearTimer]);

  const reset = () => {
    setIsRunning(false);
    setPhase("work");
    setTimeLeft(WORK_DURATION);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        className="h-auto flex-col gap-2 rounded-xl border border-border bg-card py-4 text-foreground shadow-sm hover:bg-accent"
      >
        <Timer className="h-6 w-6 text-warning" />
        <span className="text-sm font-semibold">טיימר פומודורו</span>
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-border bg-card p-5 space-y-4 col-span-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-foreground flex items-center gap-2">
          <Timer className="h-4 w-4 text-warning" />
          {phase === "work" ? "🎯 זמן לימוד" : "☕ הפסקה"}
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Circular progress */}
      <div className="flex justify-center">
        <div className="relative h-32 w-32">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" className="stroke-muted" />
            <circle
              cx="60" cy="60" r="52" fill="none" strokeWidth="8"
              className={phase === "work" ? "stroke-primary" : "stroke-success"}
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold font-mono text-foreground">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={reset}
          className="rounded-full"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className="rounded-full gradient-primary text-primary-foreground px-6 gap-2"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? "עצור" : "התחל"}
        </Button>
      </div>
    </motion.div>
  );
}
