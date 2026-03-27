import { X } from "lucide-react";

interface OutputConsoleProps {
  output: string;
  error?: string;
  onClear: () => void;
}

export function OutputConsole({ output, error, onClear }: OutputConsoleProps) {
  const hasContent = output.trim() !== "" || !!error;

  return (
    <div dir="ltr" className="border-t border-white/10 bg-[#0d0e1a]">
      {/* Console header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-1.5">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Output</span>
        <button
          onClick={onClear}
          className="rounded p-0.5 text-slate-600 hover:text-slate-300 transition-colors"
          aria-label="Clear output"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Console body */}
      <pre className="min-h-[48px] overflow-x-auto p-4 text-sm leading-6 font-mono">
        {!hasContent && (
          <span className="text-slate-600 italic">— no output —</span>
        )}
        {output.trim() !== "" && (
          <span className="text-slate-200">{output}</span>
        )}
        {output.trim() !== "" && error && <span>{"\n"}</span>}
        {error && (
          <span className="text-red-400">{error}</span>
        )}
      </pre>
    </div>
  );
}
