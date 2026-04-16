import { Trophy, GraduationCap, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  icon: typeof LayoutDashboard;
  labelKey: string;
};

const navItems: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" },
  { to: "/exam", icon: GraduationCap, labelKey: "nav.exam" },
  { to: "/progress", icon: Trophy, labelKey: "nav.progress" },
];

export function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-color)] bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65 pb-safe">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {navItems.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "group relative flex flex-col items-center gap-1 rounded-xl px-5 py-2 text-xs font-medium min-h-[52px] touch-manipulation",
                "transition-[color,background-color,transform] duration-200 ease-out",
                "active:scale-95",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Animated active pill */}
                <span
                  className={cn(
                    "absolute inset-x-2 inset-y-1 -z-0 rounded-xl transition-all duration-300 ease-out",
                    isActive
                      ? "bg-primary/10 ring-1 ring-primary/20 scale-100 opacity-100"
                      : "scale-90 opacity-0 group-hover:bg-foreground/5 group-hover:opacity-100 group-hover:scale-100"
                  )}
                  aria-hidden="true"
                />
                <Icon
                  className={cn(
                    "h-5 w-5 relative z-10 transition-transform duration-200",
                    isActive && "stroke-[2.5] scale-110"
                  )}
                />
                <span className="relative z-10">{t(labelKey)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
