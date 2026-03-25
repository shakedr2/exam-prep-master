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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm space-y-6 text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <BookOpen className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Exam Prep</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Practice questions by topic, track your progress, get AI explanations.
          </p>
        </div>
        <div className="space-y-3">
          <Input
            placeholder="Enter your username"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="text-center text-lg"
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            dir="ltr"
          />
          <Button
            onClick={handleStart}
            className="w-full py-6 text-lg rounded-xl"
            disabled={!nameInput.trim()}
          >
            Get Started 🚀
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
