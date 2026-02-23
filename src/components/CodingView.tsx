import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import type { CodingQuestion } from "@/data/questions";

export function CodingView({ q, onAnswer }: { q: CodingQuestion; onAnswer: (correct: boolean) => void }) {
  const [showSolution, setShowSolution] = useState(false);
  const [code, setCode] = useState("");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground">{q.title}</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{q.description}</p>
      {q.sampleInput && (
        <div className="rounded-xl bg-secondary p-3 text-sm border border-border text-foreground">
          <span className="font-semibold">דוגמה: </span>
          <code dir="ltr" className="font-mono text-accent">{q.sampleInput}</code>
          <span> → </span>
          <code dir="ltr" className="font-mono text-accent">{q.sampleOutput}</code>
        </div>
      )}
      <Textarea
        dir="ltr"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="כתוב את הפתרון שלך כאן..."
        className="min-h-[150px] font-mono text-sm text-foreground"
      />
      <Button
        onClick={() => {
          setShowSolution(!showSolution);
          if (!showSolution) onAnswer(true);
        }}
        variant="outline"
        className="w-full gap-2 border-primary/30 text-foreground hover:bg-primary/10"
      >
        {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {showSolution ? "הסתר פתרון" : "הצג פתרון מוצע"}
      </Button>
      {showSolution && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <PythonCodeBlock code={q.solution} />
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
            <p className="text-sm font-semibold mb-1">💡 הסבר:</p>
            <p className="text-sm text-muted-foreground">{q.solutionExplanation}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
