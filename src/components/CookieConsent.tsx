import { useState, useEffect, useCallback } from "react";
import { Cookie, X, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  hasConsented,
  hasAnalyticsConsent,
  saveConsent,
  getStoredConsent,
} from "@/lib/cookieConsent";
import { initPostHog } from "@/lib/posthog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type View = "banner" | "customize";

// ---------------------------------------------------------------------------
// CookieConsent
// ---------------------------------------------------------------------------

/**
 * GDPR / Israeli PPA 2026 compliant cookie consent banner.
 *
 * Behaviour:
 *  - Shows on first visit (no consent stored).
 *  - Stores choice in localStorage; does NOT set cookies itself.
 *  - Only initialises PostHog after the user accepts analytics.
 *  - A small floating cookie icon lets returning users re-open settings.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [view, setView] = useState<View>("banner");
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!hasConsented()) {
      setVisible(true);
    } else {
      setShowIcon(true);
      setAnalyticsChecked(hasAnalyticsConsent());
    }
  }, []);

  const applyConsent = useCallback((analytics: boolean) => {
    saveConsent(analytics);
    if (analytics) {
      initPostHog();
    }
    setVisible(false);
    setShowIcon(true);
    setAnalyticsChecked(analytics);
  }, []);

  const handleAcceptAll = useCallback(() => applyConsent(true), [applyConsent]);
  const handleRejectNonEssential = useCallback(
    () => applyConsent(false),
    [applyConsent]
  );
  const handleSaveCustom = useCallback(
    () => applyConsent(analyticsChecked),
    [applyConsent, analyticsChecked]
  );

  /** Close the customize modal without changing stored consent. */
  const closeCustomize = useCallback(() => {
    setVisible(false);
    setShowIcon(true);
  }, []);

  const openSettings = useCallback(() => {
    const existing = getStoredConsent();
    setAnalyticsChecked(existing?.analytics ?? false);
    setView("customize");
    setVisible(true);
    setShowIcon(false);
  }, []);

  if (!visible && !showIcon) return null;

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Floating re-open button (shown after consent is given)              */}
      {/* ------------------------------------------------------------------ */}
      {showIcon && !visible && (
        <button
          onClick={openSettings}
          aria-label="פתח הגדרות עוגיות"
          className={cn(
            "fixed bottom-20 left-4 z-50 md:bottom-6",
            "flex h-10 w-10 items-center justify-center rounded-full",
            "bg-background border border-border shadow-lg",
            "text-muted-foreground hover:text-foreground",
            "transition-colors duration-200"
          )}
        >
          <Cookie className="h-5 w-5" />
        </button>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Backdrop                                                            */}
      {/* ------------------------------------------------------------------ */}
      {visible && view === "customize" && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={hasConsented() ? closeCustomize : undefined}
          aria-hidden="true"
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Main panel                                                          */}
      {/* ------------------------------------------------------------------ */}
      {visible && (
        <div
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-label="הסכמה לעוגיות"
          className={cn(
            "fixed z-50 bg-background border border-border shadow-xl",
            view === "banner"
              ? "inset-x-0 bottom-0 md:bottom-6 md:inset-x-auto md:right-6 md:w-[480px] rounded-t-2xl md:rounded-2xl"
              : "inset-x-4 bottom-4 top-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[540px] md:max-h-[90vh] rounded-2xl overflow-auto"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 p-4 border-b border-border">
            <div className="flex items-center gap-2 text-primary">
              <Cookie className="h-5 w-5 shrink-0" />
              <h2 className="font-semibold text-base text-foreground">
                {view === "banner" ? "אנחנו משתמשים בעוגיות" : "הגדרות עוגיות"}
              </h2>
            </div>
            {view === "customize" && (
              <button
                onClick={closeCustomize}
                aria-label="סגור"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {view === "banner" ? (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  אנחנו משתמשים בעוגיות הכרחיות להפעלת האתר ובעוגיות אנליטיקה
                  (PostHog) כדי לשפר את חוויית הלמידה. אנא בחר את העדפותיך.{" "}
                  <a
                    href="/privacy"
                    className="text-primary underline underline-offset-2 hover:no-underline"
                  >
                    מדיניות פרטיות
                  </a>
                </p>

                {/* Details toggle */}
                <button
                  onClick={() => setDetailsOpen((o) => !o)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-expanded={detailsOpen}
                >
                  {detailsOpen ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                  <span>פרטים על סוגי העוגיות</span>
                </button>

                {detailsOpen && (
                  <div className="rounded-lg border border-border divide-y divide-border text-sm overflow-hidden">
                    <CookieCategory
                      title="הכרחיות"
                      description="אימות משתמש ושמירת ההגדרות שלך (Supabase). תמיד פעיל."
                      icon={<Shield className="h-4 w-4 text-primary" />}
                      alwaysOn
                    />
                    <CookieCategory
                      title="אנליטיקה"
                      description="PostHog — מדידת שימוש כדי לשפר את האפליקציה. דורש הסכמה."
                      icon={<Cookie className="h-4 w-4 text-orange-500" />}
                    />
                  </div>
                )}
              </>
            ) : (
              /* Customize view */
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  בחר אילו עוגיות לאשר. עוגיות הכרחיות תמיד פעילות.
                </p>
                <div className="rounded-lg border border-border divide-y divide-border text-sm overflow-hidden">
                  <CookieCategory
                    title="הכרחיות"
                    description="אימות משתמש ושמירת ההגדרות שלך (Supabase). תמיד פעיל."
                    icon={<Shield className="h-4 w-4 text-primary" />}
                    alwaysOn
                  />
                  <CookieCategory
                    title="אנליטיקה (PostHog)"
                    description="מדידת שימוש אנונימית כדי להבין אילו נושאים הכי קשים ולשפר את האפליקציה."
                    icon={<Cookie className="h-4 w-4 text-orange-500" />}
                    checked={analyticsChecked}
                    onToggle={setAnalyticsChecked}
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div
              className={cn(
                "flex gap-2 pt-1",
                view === "banner" ? "flex-col sm:flex-row-reverse" : "flex-row-reverse"
              )}
            >
              {view === "banner" ? (
                <>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 rounded-lg bg-primary text-primary-foreground text-sm font-medium py-2.5 px-4 hover:bg-primary/90 transition-colors"
                  >
                    אשר הכל
                  </button>
                  <button
                    onClick={handleRejectNonEssential}
                    className="flex-1 rounded-lg border border-border text-sm font-medium py-2.5 px-4 hover:bg-muted transition-colors"
                  >
                    דחה שאינן הכרחיות
                  </button>
                  <button
                    onClick={() => setView("customize")}
                    className="flex-1 rounded-lg border border-border text-sm font-medium py-2.5 px-4 hover:bg-muted transition-colors text-muted-foreground"
                  >
                    התאמה אישית
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveCustom}
                    className="flex-1 rounded-lg bg-primary text-primary-foreground text-sm font-medium py-2.5 px-4 hover:bg-primary/90 transition-colors"
                  >
                    שמור העדפות
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 rounded-lg border border-border text-sm font-medium py-2.5 px-4 hover:bg-muted transition-colors"
                  >
                    אשר הכל
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// CookieCategory row
// ---------------------------------------------------------------------------

interface CookieCategoryProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  alwaysOn?: boolean;
  checked?: boolean;
  onToggle?: (val: boolean) => void;
}

function CookieCategory({
  title,
  description,
  icon,
  alwaysOn,
  checked,
  onToggle,
}: CookieCategoryProps) {
  return (
    <div className="flex items-start gap-3 p-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      {alwaysOn ? (
        <span className="shrink-0 text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5 self-center">
          תמיד פעיל
        </span>
      ) : (
        <button
          role="switch"
          aria-checked={checked}
          onClick={() => onToggle?.(!checked)}
          className={cn(
            "shrink-0 relative inline-flex h-6 w-11 items-center rounded-full self-center transition-colors duration-200",
            checked ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
              checked ? "translate-x-6" : "translate-x-1"
            )}
          />
          <span className="sr-only">{checked ? "פעיל" : "כבוי"}</span>
        </button>
      )}
    </div>
  );
}
