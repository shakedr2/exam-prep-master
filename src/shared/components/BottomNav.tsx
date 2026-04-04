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
    <nav className="fixed inset-inline-0 bottom-0 z-50 border-t border-foreground/20 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 rounded-sm px-3 py-2 text-xs font-medium font-mono transition-colors",
                isActive
                  ? "text-foreground bg-foreground/5 border border-foreground/20"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
