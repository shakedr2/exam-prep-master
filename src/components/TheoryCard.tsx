import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Lightbulb, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";

interface TheoryExample {
  code: string;
  output: string;
}

interface TheoryCardProps {
  theoryIntro: string;
  approachTip: string;
  example?: TheoryExample;
  onContinue: () => void;
}

export function TheoryCard({ theoryIntro, approachTip, example, onContinue }: TheoryCardProps) {
  const [showOutput, setShowOutput] = useState(false);

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

      {/* Interactive example */}
      {example && (
        <div className="rounded-xl bg-accent/5 border border-accent/20 p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-foreground">🧪 דוגמה חיה</span>
          </div>
          <PythonCodeBlock code={example.code} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOutput(!showOutput)}
            className="w-full gap-2 text-xs"
          >
            {showOutput ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {showOutput ? "הסתר פלט" : "מה יודפס? לחץ לגלות"}
          </Button>
          {showOutput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-lg bg-muted/50 border border-border p-3"
            >
              <p className="text-xs font-mono text-success whitespace-pre-line">{example.output}</p>
            </motion.div>
          )}
        </div>
      )}

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
