import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface XpBadgeProps {
  xp: number;
  level: number;
}

export function XpBadge({ xp, level }: XpBadgeProps) {
  const xpInLevel = xp % 100;

  return (
    <motion.div
      className="flex items-center gap-2 rounded-full gradient-xp px-3 py-1.5 text-xp-foreground shadow-lg"
      whileHover={{ scale: 1.05 }}
    >
      <Zap className="h-4 w-4" />
      <span className="text-sm font-bold">{xp} XP</span>
      <span className="text-xs opacity-80">רמה {level}</span>
    </motion.div>
  );
}
