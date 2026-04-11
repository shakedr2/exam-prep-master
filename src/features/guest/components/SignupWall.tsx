import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

interface SignupWallProps {
  onDismiss: () => void;
}

export function SignupWall({ onDismiss }: SignupWallProps) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) {
        setError(googleError);
        setLoading(false);
      }
      // On success the page will redirect via OAuth; no need to close the modal.
    } catch {
      setError("אירעה שגיאה. נסה שוב.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="signup-wall-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-xl"
        >
          <button
            onClick={onDismiss}
            className="absolute left-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="סגור"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-4 text-center">
            <div className="mb-2 text-4xl">🎯</div>
            <h2 className="text-lg font-bold text-foreground">שמור את ההתקדמות שלך</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ענית על 5 שאלות! כדי לשמור את ההתקדמות שלך ולא לאבד אותה, התחבר עם Google.
            </p>
          </div>

          {error && (
            <p className="mb-3 rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full gap-2 rounded-sm"
            variant="outline"
          >
            <GoogleIcon />
            {loading ? "מתחבר..." : "התחבר עם Google"}
          </Button>

          <button
            onClick={onDismiss}
            className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            המשך בלי לשמור
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
