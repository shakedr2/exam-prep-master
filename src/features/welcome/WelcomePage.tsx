/**
 * Logic Flow — Welcome / Landing page.
 *
 * Shown to unauthenticated visitors on `/` (see `App.tsx` RootRoute).
 * Self-contained: its own nav, hero, tracks grid, founder card, and footer,
 * so `App.tsx` hides the shared chrome (Navbar / BottomNav / AppFooter)
 * while rendering this page.
 *
 * Theme:
 *   • Dark by default; toggles via localStorage key `lf-theme`.
 *   • Tokens are defined inside `WelcomePage.css` under `.lf-root` so the
 *     page cannot leak styles into the rest of the app.
 *
 * RTL:
 *   • Layout is direction-agnostic; the outer `dir` comes from i18n config
 *     (Hebrew default → RTL).
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Calendar,
  ChevronsDown,
  Lock,
  Moon,
  Play,
  Sparkles,
  Sun,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { FloatingLogosHero } from "./components/FloatingLogosHero";

import "./WelcomePage.css";

type LfTheme = "dark" | "light";

const LF_THEME_STORAGE_KEY = "lf-theme";

function readStoredTheme(): LfTheme {
  if (typeof window === "undefined") return "dark";
  try {
    const raw = window.localStorage.getItem(LF_THEME_STORAGE_KEY);
    return raw === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function persistTheme(theme: LfTheme): void {
  try {
    window.localStorage.setItem(LF_THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

/**
 * Minimal mark used in the nav + footer. Kept inline so the landing does
 * not depend on any app-level brand component (which might change shape).
 */
function BrandMark() {
  return (
    <span className="lf-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
        <defs>
          <linearGradient id="lf-nav-gradient" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0" stopColor="#9b7fff" />
            <stop offset="0.55" stopColor="#7c5cfc" />
            <stop offset="1" stopColor="#3ddc84" />
          </linearGradient>
        </defs>
        <path
          d="M14 14 L14 50 L36 50"
          stroke="url(#lf-nav-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M30 22 L50 22 M30 34 L44 34"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </span>
  );
}

interface TrackConfig {
  index: string;
  titleKey: string;
  subKey: string;
  bodyKey: string;
  href: string | null;
  meta: "new" | "modules" | "soon";
  moduleCount?: number;
  launchKey?: string;
}

const TRACKS: TrackConfig[] = [
  { index: "01", titleKey: "landing.tracks.pythonTitle", subKey: "landing.tracks.pythonSub", bodyKey: "landing.tracks.pythonBody", href: "/dashboard", meta: "modules", moduleCount: 12 },
  { index: "02", titleKey: "landing.tracks.oopTitle",    subKey: "landing.tracks.oopSub",    bodyKey: "landing.tracks.oopBody",    href: "/tracks/python-oop", meta: "modules", moduleCount: 8 },
  { index: "03", titleKey: "landing.tracks.devopsTitle", subKey: "landing.tracks.devopsSub", bodyKey: "landing.tracks.devopsBody", href: "/tracks/devops", meta: "new", moduleCount: 8 },
  { index: "04", titleKey: "landing.tracks.csharpTitle", subKey: "landing.tracks.csharpSub", bodyKey: "landing.tracks.csharpBody", href: null, meta: "soon", launchKey: "landing.tracks.csharpLaunch" },
  { index: "05", titleKey: "landing.tracks.dsaTitle",    subKey: "landing.tracks.dsaSub",    bodyKey: "landing.tracks.dsaBody",    href: null, meta: "soon", launchKey: "landing.tracks.dsaLaunch" },
  { index: "06", titleKey: "landing.tracks.aiTitle",     subKey: "landing.tracks.aiSub",     bodyKey: "landing.tracks.aiBody",     href: null, meta: "soon", launchKey: "landing.tracks.aiLaunch" },
];

export default function WelcomePage() {
  const { t, i18n } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<LfTheme>(() => readStoredTheme());

  useEffect(() => {
    persistTheme(theme);
  }, [theme]);

  const isRtl = i18n.language === "he";
  const arrowClass = isRtl ? "lf-arrow-flip" : "";

  return (
    <div className={`lf-root${theme === "light" ? " lf-light" : ""}`}>
      {/* ============ NAV ============ */}
      <nav className="lf-nav" aria-label={t("landing.nav.ariaLabel")}>
        <div className="lf-nav-left">
          <Link to="/" className="lf-brand">
            <BrandMark />
            <span className="lf-grad-text">Logic Flow</span>
          </Link>
          <div className="lf-nav-links">
            <a className="lf-nav-link" href="#tracks">{t("landing.nav.tracks")}</a>
            <a className="lf-nav-link" href="#founder">{t("landing.nav.founder")}</a>
          </div>
        </div>
        <div className="lf-nav-right">
          <LanguageSwitcher />
          <button
            type="button"
            className="lf-theme-btn"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label={
              theme === "dark"
                ? t("landing.nav.themeLight")
                : t("landing.nav.themeDark")
            }
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/login" className="lf-btn-ghost">
            {t("landing.nav.signin")}
          </Link>
          <Link to="/register" className="lf-btn-cta-sm">
            {t("landing.nav.signup")}
          </Link>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section ref={heroRef} className="lf-hero-wrap" id="hero">
        <div className="lf-hero-grid" aria-hidden="true" />
        <FloatingLogosHero containerRef={heroRef} />

        <div className="lf-hero-content">
          <span className="lf-hero-eyebrow">
            <Sparkles className="h-3 w-3" />
            <span>{t("landing.hero.eyebrow")}</span>
          </span>
          <h1 className="lf-hero-title">
            <span>{t("landing.hero.title1")}</span>
            <span className="lf-line2">{t("landing.hero.title2")}</span>
          </h1>
          <p className="lf-hero-sub">{t("landing.hero.sub")}</p>
          <div className="lf-hero-ctas">
            <Link to="/register" className="lf-btn-primary">
              <span>{t("landing.hero.cta1")}</span>
              <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
            </Link>
            <Link to="/login" className="lf-btn-secondary">
              <Play className="h-3.5 w-3.5" />
              <span>{t("landing.hero.cta2")}</span>
            </Link>
          </div>
        </div>

        <div className="lf-scroll-hint" aria-hidden="true">
          <span>{t("landing.hero.scroll")}</span>
          <ChevronsDown className="h-3.5 w-3.5" />
        </div>
      </section>

      {/* ============ TRACKS ============ */}
      <section className="lf-content" id="tracks">
        <div className="lf-container">
          <div className="lf-section-head">
            <span className="lf-section-eyebrow">{t("landing.tracks.eyebrow")}</span>
            <h2>{t("landing.tracks.title")}</h2>
            <p>{t("landing.tracks.sub")}</p>
          </div>

          <div className="lf-tracks">
            {TRACKS.map((track) => {
              const title = t(track.titleKey);
              const sub = t(track.subKey);
              const body = t(track.bodyKey);
              const isComing = track.meta === "soon";

              const metaNode = isComing ? (
                <span className="lf-track-chip">
                  <Calendar className="h-3 w-3" />
                  {track.launchKey ? t(track.launchKey) : null}
                </span>
              ) : (
                <span className="lf-track-chip">
                  <span className="font-mono tabular-nums">{track.moduleCount ?? 0}</span>{" "}
                  {t("landing.tracks.modules")}
                  {track.meta === "new" ? ` · ${t("landing.tracks.new")}` : ""}
                </span>
              );

              const body_inner = (
                <>
                  {isComing && (
                    <span className="lf-soon-tag">
                      <span className="lf-soon-pulse" />
                      {t("landing.tracks.soon")}
                    </span>
                  )}
                  <span className="lf-track-glow a" aria-hidden="true" />
                  <span className="lf-track-glow b" aria-hidden="true" />
                  <div className="lf-track-eb">TRACK · {track.index}</div>
                  <div className="lf-track-t">{title}</div>
                  <div className="lf-track-t-sub">{sub}</div>
                  <div className="lf-track-s">{body}</div>
                  <div className="lf-track-meta">
                    {metaNode}
                    <div className="lf-track-arrow" aria-hidden="true">
                      {isComing ? (
                        <Lock className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowRight className={`h-3.5 w-3.5 ${arrowClass}`} />
                      )}
                    </div>
                  </div>
                </>
              );

              if (isComing || !track.href) {
                return (
                  <div
                    key={track.index}
                    className="lf-track lf-track-coming"
                    role="group"
                    aria-label={`${title} (${t("landing.tracks.soon")})`}
                  >
                    {body_inner}
                  </div>
                );
              }

              return (
                <Link key={track.index} to={track.href} className="lf-track">
                  {body_inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FOUNDER ============ */}
      <section className="lf-content lf-founder-section" id="founder">
        <div className="lf-container">
          <div className="lf-founder-card">
            <div className="lf-founder-photo-wrap">
              <div className="lf-founder-photo">
                <img src="/founder.svg" alt={t("landing.founder.alt")} loading="lazy" />
              </div>
              <div className="lf-founder-badge">{t("landing.founder.badge")}</div>
            </div>
            <div className="lf-founder-text">
              <span className="lf-founder-eb">{t("landing.founder.eyebrow")}</span>
              <h2>{t("landing.founder.title")}</h2>
              <blockquote>{t("landing.founder.body")}</blockquote>
              <div className="lf-founder-sig">
                <span className="lf-founder-name">{t("landing.founder.name")}</span>
                <span className="lf-founder-divider" />
                <span className="lf-founder-role">{t("landing.founder.role")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="lf-footer">
        <div className="lf-footer-inner">
          <div className="lf-footer-brand">
            <div className="lf-brand">
              <BrandMark />
              <span className="lf-grad-text">Logic Flow</span>
            </div>
            <div className="lf-footer-tag">{t("landing.footer.tag")}</div>
          </div>
          <div className="lf-footer-links">
            <Link to="/terms">{t("landing.footer.terms")}</Link>
            <Link to="/privacy">{t("landing.footer.privacy")}</Link>
          </div>
        </div>
        <div className="lf-footer-copy">{t("landing.footer.copy")}</div>
      </footer>
    </div>
  );
}
