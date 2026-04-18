// Issue #148: First-time user wizard.
//
// Four steps:
//   1. Welcome: explain the app in Hebrew
//   2. Daily goal: questions/day (5/10/20)
//   3. Exam date (optional)
//   4. Preferred topics (multi-select from the 8 syllabus topics)
//
// Emits PostHog step events + a final onboarding_completed event, then
// persists to user_onboarding via useOnboarding().complete(). Shows as a
// modal Dialog so it overlays the dashboard instead of needing its own
// route — returning users never see it.

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, BookOpen, Sparkles, Trophy, Flame } from "lucide-react";
import { useOnboarding } from "../hooks/useOnboarding";
import { cn } from "@/lib/utils";

const SYLLABUS_TOPICS: Array<{ id: string; name: string; icon: string }> = [
  { id: "variables_io", name: "משתנים וקלט/פלט", icon: "📝" },
  { id: "arithmetic", name: "אריתמטיקה", icon: "🔢" },
  { id: "conditions", name: "תנאים", icon: "🔀" },
  { id: "loops", name: "לולאות", icon: "🔁" },
  { id: "functions", name: "פונקציות", icon: "🧩" },
  { id: "strings", name: "מחרוזות", icon: "📜" },
  { id: "lists", name: "רשימות", icon: "📋" },
  { id: "tuples_sets_dicts", name: "טאפלים, סטים ומילונים", icon: "🗃️" },
];

const DAILY_GOAL_OPTIONS = [5, 10, 20];

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingWizard({ open, onClose }: OnboardingWizardProps) {
  const { complete, skip, recordStep } = useOnboarding();
  const [step, setStep] = useState(0);
  const [goalDaily, setGoalDaily] = useState<number | null>(10);
  const [goalDate, setGoalDate] = useState<string>("");
  const [topics, setTopics] = useState<string[]>([]);

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const next = () => {
    recordStep(`step_${step}_completed`, { step });
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const toggleTopic = (id: string) => {
    setTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const finish = async () => {
    await complete({
      goalDailyQuestions: goalDaily,
      goalExamDate: goalDate || null,
      preferredTopics: topics,
    });
    onClose();
  };

  const handleSkip = async () => {
    await skip();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleSkip()}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            ברוכים הבאים ל-Logic Flow
          </DialogTitle>
          <DialogDescription>
            שלב {step + 1} מתוך {totalSteps}
          </DialogDescription>
        </DialogHeader>

        <Progress value={progress} className="h-2" />

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-[240px] py-2"
        >
          {step === 0 && <WelcomeStep />}
          {step === 1 && (
            <DailyGoalStep value={goalDaily} onChange={setGoalDaily} />
          )}
          {step === 2 && (
            <ExamDateStep value={goalDate} onChange={setGoalDate} />
          )}
          {step === 3 && (
            <TopicsStep selected={topics} onToggle={toggleTopic} />
          )}
        </motion.div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <Button variant="ghost" onClick={handleSkip} size="sm">
            דלג
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={back} size="sm">
                חזור
              </Button>
            )}
            {step < totalSteps - 1 ? (
              <Button onClick={next} size="sm">
                המשך
              </Button>
            ) : (
              <Button onClick={finish} size="sm">
                סיים וקבל 50 XP
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WelcomeStep() {
  const features = [
    { icon: <BookOpen className="h-5 w-5" />, title: "תרגול לפי נושא", text: "8 נושאים, 120+ שאלות מהמבחנים האחרונים" },
    { icon: <Target className="h-5 w-5" />, title: "מצב מבחן", text: "סימולציה של המבחן האמיתי — 6 שאלות, 3 שעות" },
    { icon: <Flame className="h-5 w-5" />, title: "רצף יומי", text: "תרגל כל יום ושמור על הרצף" },
    { icon: <Trophy className="h-5 w-5" />, title: "XP ורמות", text: "קבל נקודות על כל תשובה נכונה ועלה ברמות" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        ברוכים הבאים! האפליקציה תעזור לך להתכונן למבחן בקורס "מבוא לתכנות בפייתון".
      </p>
      <div className="grid gap-2">
        {features.map((f) => (
          <div key={f.title} className="flex items-start gap-3 rounded-md border p-3">
            <div className="mt-0.5 text-primary">{f.icon}</div>
            <div>
              <div className="font-semibold text-sm">{f.title}</div>
              <div className="text-xs text-muted-foreground">{f.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyGoalStep({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-base mb-1">כמה שאלות ביום?</h3>
        <p className="text-sm text-muted-foreground">
          הגדר יעד יומי שיעזור לך לשמור על רצף
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {DAILY_GOAL_OPTIONS.map((n) => (
          <Card
            key={n}
            className={cn(
              "cursor-pointer transition-all hover:border-primary",
              value === n && "border-primary ring-2 ring-primary/30"
            )}
            onClick={() => onChange(n)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{n}</div>
              <div className="text-xs text-muted-foreground">שאלות ביום</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ExamDateStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-base mb-1 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          מתי המבחן? (אופציונלי)
        </h3>
        <p className="text-sm text-muted-foreground">
          אם יש לך תאריך מבחן נוכל להתאים לך תוכנית לימודים
        </p>
      </div>
      <Input
        type="date"
        min={today}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="ltr"
        className="text-center"
      />
    </div>
  );
}

function TopicsStep({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold text-base mb-1">אילו נושאים הכי חשובים לך?</h3>
        <p className="text-sm text-muted-foreground">
          בחר את הנושאים שתרצה להתמקד בהם (ניתן לשנות בכל עת)
        </p>
      </div>
      <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
        {SYLLABUS_TOPICS.map((t) => {
          const isSelected = selected.includes(t.id);
          return (
            <Badge
              key={t.id}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-3 py-1.5 text-sm transition-all",
                isSelected && "ring-2 ring-primary/30"
              )}
              onClick={() => onToggle(t.id)}
            >
              <span className="ml-1.5">{t.icon}</span>
              {t.name}
            </Badge>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-muted-foreground">
          נבחרו {selected.length} נושאים
        </p>
      )}
    </div>
  );
}
