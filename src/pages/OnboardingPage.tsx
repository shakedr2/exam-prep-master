import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProgress } from "@/features/progress/hooks/useProgress";

const OnboardingPage = () => {
  const { progress, setUsername } = useProgress();
  const [nameInput, setNameInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (progress.username) {
      navigate("/dashboard", { replace: true });
    }
  }, [progress.username, navigate]);

  const handleStart = () => {
    const name = nameInput.trim();
    if (name) {
      setUsername(name);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm space-y-6 text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-sm border border-foreground/20 bg-foreground text-background">
          <BookOpen className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-mono">ExamPrep</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            תרגול שאלות לפי נושא, מעקב התקדמות והסברי AI.
          </p>
        </div>
        <div className="space-y-3">
          <Input
            placeholder="הכנס שם משתמש"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="text-center text-lg rounded-sm border-foreground/20"
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />
          <Button
            onClick={handleStart}
            className="w-full py-6 text-lg rounded-sm bg-foreground text-background hover:bg-foreground/80"
            disabled={!nameInput.trim()}
          >
            בוא נתחיל
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
