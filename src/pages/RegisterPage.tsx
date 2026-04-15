import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { translateAuthError, MIN_PASSWORD_LENGTH } from "@/shared/lib/authErrors";

const RegisterPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`הסיסמה חייבת להכיל לפחות ${MIN_PASSWORD_LENGTH} תווים`);
      return;
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp(email, password);
    setLoading(false);

    if (signUpError) {
      setError(translateAuthError(signUpError));
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4" dir="rtl">
        <div className="animate-fade-in-scale w-full max-w-sm">
          <Card className="border-foreground/10">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="text-5xl">✉️</div>
              <h2 className="text-xl font-bold text-foreground">נרשמת בהצלחה!</h2>
              <p className="text-sm text-muted-foreground">
                שלחנו לך אימייל לאישור. בדוק את תיבת הדואר שלך.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full rounded-sm bg-foreground text-background hover:bg-foreground/80"
              >
                חזרה להתחברות
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" dir="rtl">
      <div className="animate-fade-in-scale w-full max-w-sm">
        <Card className="border-foreground/10">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm border border-foreground/20 bg-foreground text-background">
              <UserPlus className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-bold">הרשמה</CardTitle>
            <p className="text-sm text-muted-foreground">
              צור חשבון כדי לשמור את ההתקדמות שלך
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
                  placeholder="לפחות 6 תווים"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                  className="rounded-sm border-foreground/20"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  אימות סיסמה
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="הזן סיסמה שוב"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "נרשם..." : "הרשמה"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              כבר יש לך חשבון?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                התחברות
              </Link>
            </div>

            <div className="mt-3 text-center">
              <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                המשך בלי חשבון ←
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
