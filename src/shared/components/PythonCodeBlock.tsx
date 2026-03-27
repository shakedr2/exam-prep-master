import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePyodide } from "@/hooks/usePyodide";
import { OutputConsole } from "./OutputConsole";

interface PythonCodeBlockProps {
  code: string;
}

const LINE_HEIGHT_PX = 20;
const EDITOR_PADDING_PX = 16;
const MIN_EDITOR_HEIGHT = 80;
const MAX_EDITOR_HEIGHT = 400;

function calcEditorHeight(code: string): number {
  const lineCount = code.split("\n").length;
  const height = lineCount * LINE_HEIGHT_PX + EDITOR_PADDING_PX;
  return Math.min(Math.max(height, MIN_EDITOR_HEIGHT), MAX_EDITOR_HEIGHT);
}

export function PythonCodeBlock({ code }: PythonCodeBlockProps) {
  const [currentCode, setCurrentCode] = useState(code);
  const [output, setOutput] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(false);

  const { runPython, isLoading: isPyodideLoading } = usePyodide();

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput(null);
    setRunError(undefined);
    try {
      const result = await runPython(currentCode);
      setOutput(result.output);
      setRunError(result.error);
    } finally {
      setIsRunning(false);
    }
  }, [currentCode, runPython]);

  const handleClear = useCallback(() => {
    setOutput(null);
    setRunError(undefined);
  }, []);

  const editorHeight = calcEditorHeight(currentCode);
  const isBusy = isRunning || isPyodideLoading;

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#1a1b2e] shadow-lg">
      {/* Header bar */}
      <div dir="ltr" className="flex items-center gap-1.5 border-b border-white/5 bg-white/5 px-4 py-2">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[10px] text-slate-500 font-mono">Python</span>
      </div>

      {/* Monaco Editor */}
      <div dir="ltr">
        <Editor
          height={`${editorHeight}px`}
          language="python"
          value={currentCode}
          onChange={(val) => setCurrentCode(val ?? "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'Fira Code', 'Cascadia Code', Menlo, monospace",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 8, bottom: 8 },
            renderLineHighlight: "line",
            overviewRulerLanes: 0,
          }}
        />
      </div>

      {/* Run button row */}
      <div className="flex items-center justify-end border-t border-white/5 bg-white/[0.02] px-4 py-2">
        <Button
          onClick={handleRun}
          disabled={isBusy}
          size="sm"
          className="gap-2 bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {isBusy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
          {isPyodideLoading ? "טוען Python…" : isRunning ? "מריץ…" : "הרץ קוד"}
        </Button>
      </div>

      {/* Output console — shown after first run */}
      {output !== null && (
        <OutputConsole output={output} error={runError} onClear={handleClear} />
      )}
    </div>
  );
}
