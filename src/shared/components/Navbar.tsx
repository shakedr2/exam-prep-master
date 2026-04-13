import { Link, NavLink, useNavigate } from "react-router-dom";
import { GraduationCap, LogIn, LogOut, LayoutDashboard, Trophy } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { progress } = useProgress();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const username = progress.username;

  const handleSignOut = async () => {
    await signOut();
    navigate("/dashboard");
  };

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email;

  return (
    <nav className="sticky top-0 z-50 border-b border-foreground/20 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="text-base font-bold font-mono">ExamPrep Python</span>
          </Link>

          {/* Desktop nav links — hidden on mobile, visible md+ */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                )
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              ראשי
            </NavLink>
            <NavLink
              to="/exam"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                )
              }
            >
              <GraduationCap className="h-4 w-4" />
              מבחן
            </NavLink>
            <NavLink
              to="/progress"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                )
              }
            >
              <Trophy className="h-4 w-4" />
              התקדמות
            </NavLink>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName ?? ""}
                  className="h-8 w-8 rounded-full object-cover border border-foreground/20"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center justify-center h-8 w-8 rounded-full border border-foreground/20 bg-foreground text-background text-sm font-bold font-mono">
                  {(displayName ?? "?").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[120px]">
                {displayName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-xs gap-1 h-8 px-2"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">יציאה</span>
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-xs gap-1 h-8 px-2"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>התחברות</span>
            </Button>
          )}
          {username && !user && (
            <div className="flex items-center justify-center h-8 w-8 rounded-sm border border-foreground/20 bg-foreground text-background text-sm font-bold font-mono">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
