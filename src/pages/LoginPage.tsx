import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { translateAuthError } from "@/shared/lib/authErrors";

const LoginPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      setError(translateAuthError(signInError));
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <Card className="border-foreground/10">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm border border-foreground/20 bg-foreground text-background">
              <LogIn className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-bold">התחברות</CardTitle>
            <p className="text-sm text-muted-foreground">
              התחבר כדי לשמור את ההתקדמות שלך
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  אימייל
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  className="rounded-sm border-foreground/20"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  סיסמה
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                  className="rounded-sm border-foreground/20"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full rounded-sm bg-foreground text-background hover:bg-foreground/80"
                disabled={loading}
              >
                {loading ? "מתחבר..." : "התחבר"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              אין לך חשבון?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                הרשמה
              </Link>
            </div>

            <div className="mt-3 text-center">
              <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                המשך בלי חשבון ←
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
