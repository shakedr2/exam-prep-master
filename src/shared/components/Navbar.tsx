import { Link } from "react-router-dom";
import { BookOpen, LayoutDashboard } from "lucide-react";
import { useProgress } from "@/features/progress/hooks/useProgress";

export function Navbar() {
  const { progress } = useProgress();
  const username = progress.username;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-border">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">Exam Prep</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            to="/topics"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Topics</span>
          </Link>
          {username && (
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold ml-1">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
