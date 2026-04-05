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
    <nav className="fixed inset-inline-0 bottom-0 z-50 border-t border-foreground/10 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2.5 px-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1.5 rounded-lg px-5 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
