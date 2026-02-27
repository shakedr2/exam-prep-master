import { motion } from "framer-motion";
import { BookOpen, Lightbulb, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TheoryCardProps {
  theoryIntro: string;
  approachTip: string;
  onContinue: () => void;
}

export function TheoryCard({ theoryIntro, approachTip, onContinue }: TheoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-2xl border border-primary/30 bg-card p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          📖 רגע של תיאוריה
        </span>
      </div>

      {/* Theory intro */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold text-foreground">מה צריך לדעת?</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{theoryIntro}</p>
      </div>

      {/* Approach tip */}
      <div className="rounded-xl bg-warning/5 border border-warning/20 p-4 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-5 w-5 text-warning" />
          <h3 className="text-sm font-bold text-foreground">💡 טיפ לגישה</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{approachTip}</p>
      </div>

      {/* Continue button */}
      <Button
        onClick={onContinue}
        className="w-full gradient-primary text-primary-foreground gap-2"
      >
        הבנתי, בוא נתחיל!
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
