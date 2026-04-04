import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import { AIExplanationDrawer } from "@/components/AIExplanationDrawer";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import type { QuizQuestion } from "@/data/questions";
import {
  getQuestionExplanation,
  generateSimilarQuestion,
  type AIExplanationResult,
} from "@/lib/aiClient";

export function QuizView({ q, onAnswer }: { q: QuizQuestion; onAnswer: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const answered = submitted;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerContent, setDrawerContent] = useState("");

  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarOpen, setSimilarOpen] = useState(false);
  const [similarContent, setSimilarContent] = useState("");

  async function handleExplain() {
    setDrawerContent("");
    setDrawerLoading(true);
    setDrawerOpen(true);
    try {
      const result: AIExplanationResult = await getQuestionExplanation(
        q.question,
        q.options,
        q.correctIndex,
        selected ?? undefined,
      );
      setDrawerContent(result.tip ? `${result.explanation}\n\n${result.tip}` : result.explanation);
    } catch {
      setDrawerOpen(false);
      toast.error("שגיאה בטעינת ההסבר, נסה שוב");
    } finally {
      setDrawerLoading(false);
    }
  }

  async function handleSimilar() {
    setSimilarLoading(true);
    setSimilarOpen(false);
    setSimilarContent("");
    try {
      const result = await generateSimilarQuestion(q.question, q.topic);
      setSimilarContent(result);
      setSimilarOpen(true);
    } catch {
      toast.error("שגיאה בטעינת שאלה דומה, נסה שוב");
    } finally {
      setSimilarLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-card-foreground">{q.question}</p>
      {q.code && <PythonCodeBlock code={q.code} />}
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={!answered ? { scale: 0.98 } : {}}
            onClick={() => {
              if (answered) return;
              setSelected(i);
            }}
            className={`w-full rounded-sm border p-4 text-right transition-all ${
              answered
                ? i === q.correctIndex
                  ? "border-success bg-success/10 text-success"
                  : i === selected
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border bg-secondary opacity-50 text-foreground"
                : i === selected
                ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                : "border-border bg-secondary hover:border-primary/50 text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-foreground">
                {String.fromCharCode(1488 + i)}
              </span>
              <span className="text-sm font-medium">{opt}</span>
              {answered && i === q.correctIndex && <Check className="ms-auto h-5 w-5 text-success" />}
              {answered && i === selected && i !== q.correctIndex && <X className="ms-auto h-5 w-5 text-destructive" />}
            </div>
          </motion.button>
        ))}
      </div>
      {selected !== null && !answered && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            onClick={() => {
              setSubmitted(true);
              onAnswer(selected === q.correctIndex);
            }}
            className="w-full gradient-primary text-primary-foreground"
          >
            בדוק תשובה
          </Button>
        </motion.div>
      )}
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 ${selected === q.correctIndex ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}
        >
          <p className="text-sm font-semibold mb-1">{selected === q.correctIndex ? "✅ נכון!" : "❌ לא נכון"}</p>
          <p className="text-sm text-muted-foreground">{q.explanation}</p>
        </motion.div>
      )}
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleExplain}
          >
            הסבר עם AI
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            disabled={similarLoading}
            onClick={handleSimilar}
          >
            {similarLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "שאלה דומה"
            )}
          </Button>
        </motion.div>
      )}
      {similarContent && (
        <Collapsible open={similarOpen} onOpenChange={setSimilarOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full items-center justify-between p-2 text-sm font-semibold">
              שאלה דומה (AI)
              <ChevronDown className={`h-4 w-4 transition-transform ${similarOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="rounded-xl border bg-muted/50 p-4 text-sm text-card-foreground whitespace-pre-wrap">
              {similarContent}
            </p>
          </CollapsibleContent>
        </Collapsible>
      )}
      <AIExplanationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        content={drawerContent}
        loading={drawerLoading}
        title="הסבר עם AI"
      />
    </div>
  );
}
