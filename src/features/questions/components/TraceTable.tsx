import { motion } from "framer-motion";

interface TraceTableProps {
  headers: string[];
  rows: string[][];
}

export function TraceTable({ headers, rows }: TraceTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto rounded-lg border border-border"
    >
      <table className="w-full text-xs font-mono" dir="ltr">
        <thead>
          <tr className="bg-muted/80">
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-center font-bold text-foreground border-b border-border">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-1.5 text-center text-foreground border-b border-border/50">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}