import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

export function Navbar() {
  const { progress } = useProgress();
  const username = progress.username;

  return (
    <nav className="sticky top-0 z-50 border-b border-foreground/20 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold font-mono">ExamPrep Python</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {username && (
            <div className="flex items-center justify-center h-8 w-8 rounded-sm border border-foreground/20 bg-foreground text-background text-sm font-bold font-mono">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
