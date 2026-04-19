import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { translateAuthError, MIN_PASSWORD_LENGTH } from "@/shared/lib/authErrors";
import { getPasswordStrength, getPasswordStrengthLevel } from "@/shared/lib/passwordStrength";
import { getLogicFlowThemeClass } from "@/pages/authTheme";
import "./AuthPages.css";

const strengthLevelToClass: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-amber-500",
  3: "bg-emerald-500",
};

const RegisterPage = () => {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strengthLevel = getPasswordStrengthLevel(password);
  const strength = getPasswordStrength(password);
  const strengthLabelKey = `auth.passwordStrength.${strength}` as const;
  const strengthColorClass = strengthLevelToClass[Math.max(1, strengthLevel)];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t("auth.validation.passwordMin", { min: MIN_PASSWORD_LENGTH }));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.validation.passwordMismatch"));
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
      <div className={`lf-theme${getLogicFlowThemeClass()}`} dir="rtl">
        <div className="auth-shell flex min-h-screen items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm"
          >
            <Card className="auth-card">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="text-5xl">✉️</div>
                <h2 className="text-xl font-bold text-foreground">{t("auth.register.successTitle")}</h2>
                <p className="auth-muted text-sm">{t("auth.register.successBody")}</p>
                <Button
                  onClick={() => navigate("/login")}
                  className="auth-primary-btn w-full rounded-sm hover:opacity-90"
                >
                  {t("auth.register.backToLogin")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`lf-theme${getLogicFlowThemeClass()}`} dir="rtl">
      <div className="auth-shell flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <Card className="auth-card">
            <CardHeader className="text-center space-y-2">
              <div className="auth-icon-wrap mx-auto flex h-14 w-14 items-center justify-center rounded-sm border">
                <UserPlus className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl font-bold">{t("auth.register.title")}</CardTitle>
              <p className="auth-muted text-sm">{t("auth.register.subtitle")}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    {t("auth.common.emailLabel")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("auth.common.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    dir="ltr"
                    className="auth-input rounded-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    {t("auth.common.passwordLabel")}
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("auth.validation.passwordMinHint", { min: MIN_PASSWORD_LENGTH })}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    dir="ltr"
                    className="auth-input rounded-sm"
                  />
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-1">
                      {[1, 2, 3].map((level) => (
                        <span
                          key={level}
                          className={`h-1 rounded ${level <= Math.max(1, strengthLevel) ? strengthColorClass : "bg-muted/40"}`}
                        />
                      ))}
                    </div>
                    <p className="auth-muted text-xs">
                      {t("auth.passwordStrength.label")}: {t(strengthLabelKey)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    {t("auth.register.confirmPasswordLabel")}
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("auth.register.confirmPasswordPlaceholder")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    dir="ltr"
                    className="auth-input rounded-sm"
                  />
                </div>

                {error && <p className="auth-error text-sm text-center">{error}</p>}

                <Button
                  type="submit"
                  className="auth-primary-btn w-full rounded-sm hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? t("auth.register.loading") : t("auth.register.submit")}
                </Button>
              </form>

              <div className="auth-muted mt-4 text-center text-sm">
                {t("auth.register.hasAccount")}{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  {t("auth.register.login")}
                </Link>
              </div>

              <div className="mt-3 text-center">
                <Link to="/dashboard" className="auth-muted text-xs hover:text-foreground transition-colors">
                  {t("auth.register.continueAsGuest")}
                </Link>
              </div>
              <div className="mt-3 text-center">
                <Link to="/terms" className="auth-muted text-xs hover:text-foreground transition-colors">
                  {t("common.termsOfService")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
