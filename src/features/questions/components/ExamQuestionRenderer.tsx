import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizView } from "@/components/QuizView";
import { TracingView } from "@/components/TracingView";
import { FillBlankView } from "@/components/FillBlankView";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import { QuestionText } from "@/components/QuestionText";
import { Textarea } from "@/components/ui/textarea";
import { CommonMistakeWarning } from "@/features/questions/components/CommonMistakeWarning";
import type { Question, CodingQuestion, QuizQuestion, TracingQuestion } from "@/data/questions";

interface Props {
  question: Question;
  currentAnswer?: { answer: string; correct: boolean };
  onAnswer: (answer: string, correct: boolean) => void;
}

const ExamCodingView = memo(function ExamCodingView({ q, currentAnswer, onAnswer }: { q: CodingQuestion; currentAnswer?: { answer: string; correct: boolean }; onAnswer: (answer: string, correct: boolean) => void }) {
  const [code, setCode] = useState(currentAnswer?.answer || "");
  const [showSolution, setShowSolution] = useState(false);
  const [selfAssessed, setSelfAssessed] = useState<boolean | null>(currentAnswer?.correct ?? null);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground">{q.title}</h3>
      <QuestionText text={q.description} className="text-sm text-muted-foreground" />
      {q.sampleInput && (
        <div className="rounded-xl bg-white dark:bg-secondary p-3 text-sm border border-border text-foreground">
          <span className="font-semibold">דוגמה: </span>
          <code dir="ltr" className="font-mono text-accent">{q.sampleInput}</code>
          <span> → </span>
          <code dir="ltr" className="font-mono text-accent">{q.sampleOutput}</code>
        </div>
      )}
      <Textarea
        dir="ltr"
        value={code}
        onChange={e => {
          setCode(e.target.value);
          onAnswer(e.target.value, selfAssessed ?? false);
        }}
        placeholder="כתוב את הפתרון שלך כאן..."
        className="min-h-[120px] font-mono text-sm text-foreground"
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <PythonCodeBlock code={q.solution} />
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
            <p className="text-sm font-semibold mb-1">💡 הסבר:</p>
            <QuestionText text={q.solutionExplanation} className="text-sm text-muted-foreground" />
          </div>
          {selfAssessed === null && (
            <div className="rounded-xl bg-muted/50 border border-border p-4 space-y-2">
              <p className="text-sm font-semibold text-center">האם הפתרון שלך נכון?</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => { setSelfAssessed(true); onAnswer(code, true); }}
                  variant="outline"
                  className="flex-1 gap-2 border-success/30 hover:bg-success/10 text-success"
                >
                  <ThumbsUp className="h-4 w-4" /> כן, נכון
                </Button>
                <Button
                  onClick={() => { setSelfAssessed(false); onAnswer(code, false); }}
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
              {selfAssessed ? "✅ סימנת כנכון" : "📝 סימנת כלא נכון — חזור על הנושא אחרי המבחן"}
            </div>
          )}
          {selfAssessed === false && (
            <CommonMistakeWarning mistake={q.commonMistake} />
          )}
        </motion.div>
      )}
    </div>
  );
});

export const ExamQuestionRenderer = memo(function ExamQuestionRenderer({ question, currentAnswer, onAnswer }: Props) {
  const isAnswered = !!currentAnswer;

  const handleAnswer = useCallback((correct: boolean) => {
    if (isAnswered) return; // prevent re-answering
    const answerText = correct ? "correct" : "incorrect";
    onAnswer(answerText, correct);
  }, [isAnswered, onAnswer]);

  // Derive explanation text for the micro-explanation block
  function getExplanation(): string | null {
    switch (question.type) {
      case "quiz": return (question as QuizQuestion).explanation;
      case "tracing": return (question as TracingQuestion).explanation;
      default: return null;
    }
  }
  const explanation = getExplanation();

  return (
    <div>
      {/* Already answered indicator with micro-explanation */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-3 rounded-lg border p-3 space-y-2 ${
            currentAnswer.correct
              ? "bg-success/10 text-success border-success/30"
              : "bg-destructive/10 text-destructive border-destructive/30"
          }`}
        >
          <p className="text-xs font-semibold text-center">
            {currentAnswer.correct ? "✅ ענית נכון" : "❌ ענית לא נכון"}
          </p>
          {explanation && (
            <p className="text-xs text-foreground/80 leading-relaxed text-right">
              {explanation}
            </p>
          )}
        </motion.div>
      )}

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          question.type === "quiz" ? "bg-primary/10 text-primary" :
          question.type === "tracing" ? "bg-accent/10 text-accent" :
          question.type === "fill-blank" ? "bg-primary/10 text-primary" :
          "bg-warning/10 text-warning"
        }`}>
          {question.type === "quiz" ? "🔘 רב-ברירה" : question.type === "tracing" ? "🔍 מעקב קוד" : question.type === "fill-blank" ? "✏️ השלם קוד" : "✍️ כתיבת קוד"}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium border ${
          question.difficulty === "easy" ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30" :
          question.difficulty === "hard" ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30" :
          "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
        }`}>
          {question.difficulty === "easy" ? "🟢 קל" : question.difficulty === "hard" ? "🔴 קשה" : "🟡 בינוני"}
        </span>
      </div>

      {question.type === "quiz" && <QuizView q={question} onAnswer={handleAnswer} />}
      {question.type === "tracing" && <TracingView q={question} onAnswer={handleAnswer} />}
      {question.type === "fill-blank" && <FillBlankView q={question} onAnswer={handleAnswer} />}
      {question.type === "coding" && (
        <ExamCodingView q={question} currentAnswer={currentAnswer} onAnswer={onAnswer} />
      )}
    </div>
  );
});
