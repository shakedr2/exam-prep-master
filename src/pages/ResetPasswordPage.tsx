import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { MIN_PASSWORD_LENGTH, translateAuthError } from "@/shared/lib/authErrors";
import { getPasswordStrength, getPasswordStrengthLevel } from "@/shared/lib/passwordStrength";
import { getLogicFlowThemeClass } from "@/pages/authTheme";
import "./AuthPages.css";

const strengthLevelToClass: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-amber-500",
  3: "bg-emerald-500",
};

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    const { error: updateError } = await updatePassword(password);
    setLoading(false);

    if (updateError) {
      setError(translateAuthError(updateError));
      return;
    }

    navigate("/dashboard", { replace: true });
  };

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
                <ShieldCheck className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl font-bold">{t("auth.resetPassword.title")}</CardTitle>
              <p className="auth-muted text-sm">{t("auth.resetPassword.subtitle")}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    {t("auth.common.newPasswordLabel")}
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
                    {t("auth.resetPassword.confirmPasswordLabel")}
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
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
                  {loading ? t("auth.common.saving") : t("auth.resetPassword.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
