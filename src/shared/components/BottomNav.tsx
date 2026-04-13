import { Trophy, GraduationCap, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "ראשי" },
  { to: "/exam", icon: GraduationCap, label: "מבחן" },
  { to: "/progress", icon: Trophy, label: "התקדמות" },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-foreground/10 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 rounded-xl min-w-[44px] min-h-[44px] px-5 py-2 text-xs font-medium transition-colors touch-manipulation",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("h-6 w-6", isActive && "stroke-[2.5]")} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
