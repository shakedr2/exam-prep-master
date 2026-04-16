import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, LogIn, LogOut, LayoutDashboard, Trophy, Terminal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProgress } from "@/hooks/useProgress";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const DEVOPS_PATHS = ["/tracks/devops", "/topics/linux", "/topics/git", "/topics/networking", "/topics/docker", "/topics/cicd", "/topics/cloud", "/topics/iac"];
const PYTHON_PATHS = ["/dashboard", "/exam", "/progress", "/review-mistakes", "/topics/python"];

function useActiveTrack(): "python" | "devops" | null {
  const { pathname } = useLocation();
  if (DEVOPS_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) return "devops";
  if (PYTHON_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) || pathname.startsWith("/practice/") || pathname.startsWith("/learn/")) return "python";
  return null;
}

export function Navbar() {
  const { t } = useTranslation();
  const { progress } = useProgress();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const track = useActiveTrack();
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium",
      "transition-[color,background-color,transform] duration-200 ease-out",
      "hover:-translate-y-[1px] active:translate-y-0",
      isActive
        ? "text-foreground bg-foreground/[0.06]"
        : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
    );

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="group flex items-center gap-2 font-bold text-foreground transition-colors duration-200"
          >
            <span className={cn(
              "relative flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200",
              track === "devops"
                ? "bg-accent/15 ring-1 ring-accent/25 group-hover:bg-accent/20 group-hover:ring-accent/35"
                : "bg-primary/10 ring-1 ring-primary/20 group-hover:bg-primary/15 group-hover:ring-primary/30"
            )}>
              {track === "devops" ? (
                <Terminal className="h-4 w-4 text-accent" />
              ) : (
                <GraduationCap className="h-4 w-4 text-primary" />
              )}
            </span>
            <span className="text-base font-bold font-mono tracking-tight">
              ExamPrep
              {track === "python" && <span className="text-gradient-snake"> Python</span>}
              {track === "devops" && <span className="text-accent"> DevOps</span>}
            </span>
          </Link>

          {/* Desktop nav links — hidden on mobile, visible md+ */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <LayoutDashboard className="h-4 w-4" />
                  {t("nav.dashboard")}
                  {isActive && (
                    <span
                      className="absolute inset-x-3 -bottom-[9px] h-[2px] rounded-full bg-gradient-to-r from-primary to-accent"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/exam" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <GraduationCap className="h-4 w-4" />
                  {t("nav.exam")}
                  {isActive && (
                    <span
                      className="absolute inset-x-3 -bottom-[9px] h-[2px] rounded-full bg-gradient-to-r from-primary to-accent"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/progress" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <Trophy className="h-4 w-4" />
                  {t("nav.progress")}
                  {isActive && (
                    <span
                      className="absolute inset-x-3 -bottom-[9px] h-[2px] rounded-full bg-gradient-to-r from-primary to-accent"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName ?? ""}
                  className="h-8 w-8 rounded-full object-cover border border-[var(--border-color-strong)] ring-1 ring-primary/20 transition-transform duration-200 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center justify-center h-8 w-8 rounded-full ring-1 ring-primary/20 bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold font-mono transition-transform duration-200 hover:scale-105">
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
                <span className="hidden sm:inline">{t("nav.signOut")}</span>
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
              <span>{t("nav.signIn")}</span>
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
