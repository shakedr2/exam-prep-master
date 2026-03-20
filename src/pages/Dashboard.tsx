import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, BarChart2, Zap } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();

  const greeting = progress.username ? `שלום, ${progress.username} 👋` : "שלום 👋";

  const cards = [
    {
      title: "תרגול שאלות",
      description: "תרגל שאלות רב-ברירה לפי נושא או מבחן מלא",
      icon: BookOpen,
      to: "/questions/practice",
      color: "text-primary",
    },
    {
      title: "תרגול מושגים",
      description: "חזרה על מושגי יסוד באמצעות כרטיסיות",
      icon: Brain,
      to: "/concepts/practice",
      color: "text-success",
    },
    {
      title: "סטטיסטיקות",
      description: "סקירת ביצועים ואחוזי הצלחה לפי נושא",
      icon: BarChart2,
      to: "/analytics",
      color: "text-xp",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-8">
      <div className="mx-auto max-w-lg px-4 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-foreground">{greeting}</h1>
          <p className="text-muted-foreground">מה נתרגל היום?</p>
        </div>

        {/* Today CTA */}
        <Button
          onClick={() => navigate("/questions/practice")}
          className="w-full h-14 text-lg gap-3 gradient-primary text-primary-foreground rounded-xl shadow-md"
        >
          <Zap className="h-5 w-5" />
          תרגול יומי – התחל עכשיו
        </Button>

        {/* Navigation cards */}
        <div className="space-y-3">
          {cards.map(({ title, description, icon: Icon, to, color }) => (
            <Card
              key={to}
              className="cursor-pointer border border-border bg-card hover:bg-accent transition-colors"
              onClick={() => navigate(to)}
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Icon className={`h-6 w-6 ${color}`} />
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
