import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";
import { topics, getQuestionsByTopic, type Question, type QuizQuestion, type TracingQuestion, type CodingQuestion } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";
import { AiTutor } from "@/components/AiTutor";

function QuizView({ q, onAnswer }: { q: QuizQuestion; onAnswer: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

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
              onAnswer(i === q.correctIndex);
            }}
            className={`w-full rounded-xl border p-4 text-right transition-all ${
              !answered
                ? "border-border bg-card hover:border-primary/50"
                : i === q.correctIndex
                ? "border-success bg-success/10 text-success"
                : i === selected
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-border bg-card opacity-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                {String.fromCharCode(1488 + i)}
              </span>
              <span className="text-sm font-medium">{opt}</span>
              {answered && i === q.correctIndex && <Check className="mr-auto h-5 w-5 text-success" />}
              {answered && i === selected && i !== q.correctIndex && <X className="mr-auto h-5 w-5 text-destructive" />}
            </div>
          </motion.button>
        ))}
      </div>
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
    </div>
  );
}

function TracingView({ q, onAnswer }: { q: TracingQuestion; onAnswer: (correct: boolean) => void }) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = answer.trim() === q.correctAnswer.trim();

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitted(true);
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-card-foreground">{q.question}</p>
      <PythonCodeBlock code={q.code} />
      <div className="space-y-2">
        <Input
          dir="ltr"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="הקלד את התשובה..."
          className="font-mono"
          disabled={submitted}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
        />
        {!submitted && (
          <Button onClick={handleSubmit} className="w-full gradient-primary text-primary-foreground" disabled={!answer.trim()}>
            בדוק תשובה
          </Button>
        )}
      </div>
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 ${isCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}
        >
          <p className="text-sm font-semibold mb-1">{isCorrect ? "✅ מצוין!" : "❌ לא מדויק"}</p>
          {!isCorrect && <p className="text-sm font-mono mb-2">תשובה נכונה: {q.correctAnswer}</p>}
          <p className="text-sm text-muted-foreground">{q.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}

function CodingView({ q, onAnswer }: { q: CodingQuestion; onAnswer: (correct: boolean) => void }) {
  const [showSolution, setShowSolution] = useState(false);
  const [code, setCode] = useState("");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground">{q.title}</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{q.description}</p>
      {q.sampleInput && (
        <div className="rounded-xl bg-muted/80 p-3 text-sm border border-border">
          <span className="font-semibold">דוגמה: </span>
          <code dir="ltr" className="font-mono">{q.sampleInput}</code>
          <span> → </span>
          <code dir="ltr" className="font-mono">{q.sampleOutput}</code>
        </div>
      )}
      <Textarea
        dir="ltr"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="כתוב את הפתרון שלך כאן..."
        className="min-h-[150px] font-mono text-sm"
      />
      <Button
        onClick={() => {
          setShowSolution(!showSolution);
          if (!showSolution) onAnswer(true);
        }}
        variant="outline"
        className="w-full gap-2"
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

const TopicPractice = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { answerQuestion } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);

  const topic = topics.find(t => t.id === topicId);
  const topicQuestions = useMemo(() => getQuestionsByTopic(topicId as any), [topicId]);

  if (!topic || topicQuestions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>נושא לא נמצא</p>
      </div>
    );
  }

  const q = topicQuestions[currentIndex];
  const progressPct = ((currentIndex + 1) / topicQuestions.length) * 100;

  const handleAnswer = (correct: boolean) => {
    answerQuestion(q.id, correct);
  };

  const handleNext = () => {
    if (currentIndex < topicQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      navigate("/topics");
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-4">
      <div className="mx-auto max-w-lg px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/topics")}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{topic.name}</p>
            <div className="flex items-center gap-2">
              <Progress value={progressPct} className="h-2 flex-1" />
              <span className="text-xs font-medium text-muted-foreground">
                {currentIndex + 1}/{topicQuestions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                q.type === "quiz" ? "bg-primary/10 text-primary" :
                q.type === "tracing" ? "bg-accent/10 text-accent" :
                "bg-warning/10 text-warning"
              }`}>
                {q.type === "quiz" ? "🔘 רב-ברירה" : q.type === "tracing" ? "🔍 מעקב קוד" : "✍️ כתיבת קוד"}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                q.difficulty === "easy" ? "bg-success/10 text-success" :
                q.difficulty === "medium" ? "bg-warning/10 text-warning" :
                "bg-destructive/10 text-destructive"
              }`}>
                {q.difficulty === "easy" ? "קל" : q.difficulty === "medium" ? "בינוני" : "קשה"}
              </span>
            </div>

            {q.type === "quiz" && <QuizView q={q} onAnswer={handleAnswer} />}
            {q.type === "tracing" && <TracingView q={q} onAnswer={handleAnswer} />}
            {q.type === "coding" && <CodingView q={q} onAnswer={handleAnswer} />}
          </motion.div>
        </AnimatePresence>

        <Button onClick={handleNext} className="mt-4 w-full gradient-primary text-primary-foreground gap-2">
          {currentIndex < topicQuestions.length - 1 ? "שאלה הבאה" : "סיום נושא"}
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <AiTutor
        questionContext={`סוג: ${q.type}, נושא: ${topic.name}, קושי: ${q.difficulty}\n${
          q.type === "coding" ? `כותרת: ${(q as any).title}\nתיאור: ${(q as any).description}` :
          `שאלה: ${(q as any).question}\n${(q as any).code ? `קוד:\n${(q as any).code}` : ""}`
        }`}
      />
    </div>
  );
};

export default TopicPractice;
