import { motion } from "framer-motion";

type Step = "theory" | "warmup" | "question";

interface StepIndicatorProps {
  currentStep: Step;
  hasWarmup: boolean;
  hasTheory: boolean;
}

const steps: { key: Step; icon: string; label: string }[] = [
  { key: "theory", icon: "📖", label: "תיאוריה" },
  { key: "warmup", icon: "💡", label: "חימום" },
  { key: "question", icon: "📝", label: "שאלה" },
];

export function StepIndicator({ currentStep, hasWarmup, hasTheory }: StepIndicatorProps) {
  const visibleSteps = steps.filter(s => {
    if (s.key === "theory" && !hasTheory) return false;
    if (s.key === "warmup" && !hasWarmup) return false;
    return true;
  });

  const currentIdx = visibleSteps.findIndex(s => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-1 mb-4" dir="rtl">
      {visibleSteps.map((step, i) => {
        const isActive = i === currentIdx;
        const isDone = i < currentIdx;

        return (
          <div key={step.key} className="flex items-center gap-1">
            <motion.div
              animate={isActive ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : isDone
                  ? "bg-success/10 text-success border border-success/20"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              <span>{isDone ? "✓" : step.icon}</span>
              <span>{step.label}</span>
            </motion.div>
            {i < visibleSteps.length - 1 && (
              <div className={`h-px w-4 ${i < currentIdx ? "bg-success/40" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
