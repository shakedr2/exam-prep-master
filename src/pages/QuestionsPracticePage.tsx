import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GraduationCap, Zap, BookOpen, ChevronDown } from "lucide-react";

interface Topic {
  id: string;
  name: string;
}

// Mock topic list – TODO: replace with data from Supabase / questions data
const TOPICS: Topic[] = [
  { id: "tracing", name: "מעקב קוד" },
  { id: "conditions", name: "תנאים" },
  { id: "loops", name: "לולאות" },
  { id: "lists", name: "רשימות" },
  { id: "math", name: "מתמטיקה" },
];

const QuestionsPracticePage = () => {
  const navigate = useNavigate();

  const handleTopicSelect = (topic: Topic) => {
    navigate(`/questions/session?mode=topic&topic=${topic.id}`);
  };

  return (
    <div className="min-h-screen pb-24 pt-8">
      <div className="mx-auto max-w-lg px-4 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">תרגול שאלות</h1>
          <p className="text-muted-foreground">בחר מצב תרגול</p>
        </div>

        {/* Mode buttons */}
        <div className="space-y-3">
          {/* Full exam */}
          <Button
            onClick={() => navigate("/questions/session?mode=full")}
            className="w-full h-16 text-base gap-3 rounded-xl border border-border bg-card text-foreground hover:bg-accent shadow-sm justify-start px-5"
            variant="ghost"
          >
            <GraduationCap className="h-6 w-6 text-primary shrink-0" />
            <div className="text-right">
              <p className="font-semibold">מבחן מלא</p>
              <p className="text-xs text-muted-foreground font-normal">כל השאלות בסדר אקראי</p>
            </div>
          </Button>

          {/* Short set */}
          <Button
            onClick={() => navigate("/questions/session?mode=short")}
            className="w-full h-16 text-base gap-3 rounded-xl border border-border bg-card text-foreground hover:bg-accent shadow-sm justify-start px-5"
            variant="ghost"
          >
            <Zap className="h-6 w-6 text-xp shrink-0" />
            <div className="text-right">
              <p className="font-semibold">סט קצר</p>
              <p className="text-xs text-muted-foreground font-normal">10 שאלות מהירות</p>
            </div>
          </Button>

          {/* Practice by topic – dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="w-full h-16 text-base gap-3 rounded-xl border border-border bg-card text-foreground hover:bg-accent shadow-sm justify-start px-5"
                variant="ghost"
              >
                <BookOpen className="h-6 w-6 text-success shrink-0" />
                <div className="text-right flex-1">
                  <p className="font-semibold">תרגול לפי נושא</p>
                  <p className="text-xs text-muted-foreground font-normal">בחר נושא מהרשימה</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {TOPICS.map((topic) => (
                <DropdownMenuItem
                  key={topic.id}
                  onSelect={() => handleTopicSelect(topic)}
                >
                  {topic.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPracticePage;
