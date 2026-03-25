import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, X, Timer, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PRESETS = [
  { label: "25 / 5", work: 25 * 60, break: 5 * 60 },
  { label: "15 / 3", work: 15 * 60, break: 3 * 60 },
  { label: "45 / 10", work: 45 * 60, break: 10 * 60 },
  { label: "50 / 15", work: 50 * 60, break: 15 * 60 },
];

type Phase = "work" | "break";

function playBeep(frequency: number, duration: number, count: number = 1) {
  try {
    const w = window as Window & { webkitAudioContext?: typeof AudioContext };
    const AudioCtx = w.AudioContext || w.webkitAudioContext;
    const ctx = new AudioCtx();
    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = frequency;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * (duration + 0.1));
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * (duration + 0.1) + duration);
      osc.start(ctx.currentTime + i * (duration + 0.1));
      osc.stop(ctx.currentTime + i * (duration + 0.1) + duration);
    }
    setTimeout(() => ctx.close(), count * (duration + 0.1) * 1000 + 500);
  } catch {
    // ignore audio errors in environments without AudioContext
  }
}

function playStartSound() {
  playBeep(880, 0.15, 1); // single high beep
}

function playBreakSound() {
  playBeep(523, 0.3, 2); // two mellow beeps
}

function playEndSound() {
  playBeep(1047, 0.2, 3); // three sharp beeps
}

export function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [phase, setPhase] = useState<Phase>("work");
  const [timeLeft, setTimeLeft] = useState(PRESETS[0].work);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const preset = PRESETS[presetIndex];
  const totalTime = phase === "work" ? preset.work : preset.break;
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
            playBreakSound();
            toast.success("🎉 סיימת! זמן להפסקה קצרה", { duration: 5000 });
            setPhase("break");
            return preset.break;
          } else {
            playEndSound();
            toast.info("☕ ההפסקה נגמרה! חזרה ללימודים", { duration: 5000 });
            setPhase("work");
            return preset.work;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, phase, clearTimer, preset]);

  const reset = () => {
    setIsRunning(false);
    setPhase("work");
    setTimeLeft(preset.work);
  };

  const selectPreset = (index: number) => {
    setPresetIndex(index);
    setIsRunning(false);
    setPhase("work");
    setTimeLeft(PRESETS[index].work);
    setShowSettings(false);
  };

  const handleStartPause = () => {
    if (!isRunning) {
      playStartSound();
    }
    setIsRunning(!isRunning);
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
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setIsOpen(false); setIsRunning(false); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Presets */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex gap-2 flex-wrap"
        >
          {PRESETS.map((p, i) => (
            <Button
              key={p.label}
              variant={i === presetIndex ? "default" : "outline"}
              size="sm"
              onClick={() => selectPreset(i)}
              className="text-xs"
            >
              {p.label} דק׳
            </Button>
          ))}
        </motion.div>
      )}

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
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold font-mono text-foreground">{formatTime(timeLeft)}</span>
            <span className="text-[10px] text-muted-foreground mt-1">
              {phase === "work" ? `לימוד ${preset.work / 60} דק׳` : `הפסקה ${preset.break / 60} דק׳`}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <Button variant="outline" size="icon" onClick={reset} className="rounded-full">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleStartPause}
          className="rounded-full gradient-primary text-primary-foreground px-6 gap-2"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? "עצור" : "התחל"}
        </Button>
      </div>
    </motion.div>
  );
}
