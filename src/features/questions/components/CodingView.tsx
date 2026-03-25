import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import type { CodingQuestion } from "@/data/questions";

export function CodingView({ q, onAnswer }: { q: CodingQuestion; onAnswer: (correct: boolean) => void }) {
  const [showSolution, setShowSolution] = useState(false);
  const [code, setCode] = useState("");
  const [selfAssessed, setSelfAssessed] = useState<boolean | null>(null);

  const handleSelfAssess = (correct: boolean) => {
    setSelfAssessed(correct);
    onAnswer(correct);
  };

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
        disabled={selfAssessed !== null}
      />
      <Button
        onClick={() => setShowSolution(!showSolution)}
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

          {selfAssessed === null && (
            <div className="rounded-xl bg-muted/50 border border-border p-4 space-y-2">
              <p className="text-sm font-semibold text-center">האם הפתרון שלך נכון?</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleSelfAssess(true)}
                  variant="outline"
                  className="flex-1 gap-2 border-success/30 hover:bg-success/10 text-success"
                >
                  <ThumbsUp className="h-4 w-4" /> כן, נכון
                </Button>
                <Button
                  onClick={() => handleSelfAssess(false)}
                  variant="outline"
                  className="flex-1 gap-2 border-destructive/30 hover:bg-destructive/10 text-destructive"
                >
                  <ThumbsDown className="h-4 w-4" /> לא, טעיתי
                </Button>
              </div>
            </div>
          )}
          {selfAssessed !== null && (
            <div className={`rounded-xl p-3 text-center text-sm font-semibold ${selfAssessed ? "bg-success/10 text-success border border-success/30" : "bg-warning/10 text-warning border border-warning/30"}`}>
              {selfAssessed ? "✅ סימנת כנכון" : "📝 סימנת כלא נכון — חזור על הנושא"}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
