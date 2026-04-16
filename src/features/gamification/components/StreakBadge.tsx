// Issue #148: Compact streak counter for the dashboard header.
//
// Matches the visual rhythm of XpBadge (rounded pill, icon + numbers,
// gentle hover scale). The flame icon is greyed out when the streak is
// 0 so we don't lie to users who haven't practiced yet.

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak?: number;
}

export function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  const active = currentStreak > 0;
  const showLongest =
    typeof longestStreak === "number" && longestStreak > currentStreak;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1.5 shadow-lg",
        active
          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
          : "bg-muted text-muted-foreground"
      )}
      aria-label={`רצף של ${currentStreak} ימים`}
      dir="rtl"
    >
      <Flame className={cn("h-4 w-4", active && "animate-pulse")} />
      <span className="text-sm font-bold">{currentStreak}</span>
      <span className="text-xs opacity-80">ימים ברצף</span>
      {showLongest && (
        <span className="text-[10px] opacity-70 border-r border-white/20 pr-2 mr-1">
          שיא: {longestStreak}
        </span>
      )}
    </motion.div>
  );
}
