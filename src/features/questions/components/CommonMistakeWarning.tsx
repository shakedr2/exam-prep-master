import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface Props {
  mistake?: string | null;
}

/**
 * Shows the `common_mistake` tag associated with a question after the learner
 * answers it wrong. Returns `null` when the question has no `commonMistake`
 * metadata, so views can render it unconditionally.
 */
export function CommonMistakeWarning({ mistake }: Props) {
  if (!mistake) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-warning/40 bg-warning/10 p-3 flex items-start gap-2"
      role="status"
    >
      <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-warning">טעות נפוצה להיזהר ממנה</p>
        <p className="text-sm text-foreground">{mistake}</p>
      </div>
    </motion.div>
  );
}
