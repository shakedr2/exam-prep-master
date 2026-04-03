import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useProgress } from "@/features/progress/hooks/useProgress";

export function Navbar() {
  const { progress } = useProgress();
  const username = progress.username;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-border">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link to="/topics" className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold">ExamPrep Python</span>
        </Link>
        {username && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </nav>
  );
}
