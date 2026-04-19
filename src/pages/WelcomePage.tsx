import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Play,
  Shield,
  Clock,
  CheckCircle2,
  HelpCircle,
  LayoutGrid,
  Compass,
  Calendar,
  Lock,
  ChevronsDown,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { FloatingLogosHero } from "@/features/landing/components/FloatingLogosHero";
import { cn } from "@/lib/utils";

import "./WelcomePage.css";

export default function WelcomePage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const heroRef = useRef<HTMLElement>(null);

  const isRtl = i18n.language === "he";

  useEffect(() => {
    // Ensure dir matches the active locale while on the landing (i18n config
    // handles this globally, but re-asserting guards against stale state).
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [isRtl]);

  return (
    <div className="lf-root bg-[var(--lf-bg)] text-[var(--lf-text)] min-h-screen">
      {/* ============ NAV ============ */}
      <nav className="lf-nav">
        <div className="lf-nav-left">
          <Link to="/" className="lf-brand">
            <span className="lf-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none">
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
                  stroke="#fff"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </svg>
            </span>
            <span className="lf-grad-text">Logic Flow</span>
          </Link>
          <div className="lf-nav-links">
            <a className="lf-nav-link" href="#how">{t("landing.nav.how")}</a>
            <a className="lf-nav-link" href="#tracks">{t("landing.nav.tracks")}</a>
            <a className="lf-nav-link" href="#founder">{t("landing.nav.founder")}</a>
          </div>
        </div>
        <div className="lf-nav-right">
          <LanguageSwitcher />
          <button
            className="lf-theme-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            type="button"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/login" className="lf-btn-ghost">
            {t("landing.nav.signin")}
          </Link>
          <Link to="/register" className="lf-btn-cta-sm">
            {t("landing.nav.start")}
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
              <ArrowRight className={cn("h-4 w-4", isRtl && "rotate-180")} />
            </Link>
            <a href="#how" className="lf-btn-secondary">
              <Play className="h-3.5 w-3.5" />
              <span>{t("landing.hero.cta2")}</span>
            </a>
          </div>
        </div>

        <div className="lf-scroll-hint" aria-hidden="true">
          <span>{t("landing.hero.scroll")}</span>
          <ChevronsDown className="h-3.5 w-3.5" />
        </div>
      </section>

      {/* ============ CORE PROBLEM ============ */}
      <section className="lf-content" id="problem">
        <div className="lf-container">
          <div className="lf-section-head">
            <span className="lf-section-eyebrow">{t("landing.problem.eyebrow")}</span>
            <h2>
              {t("landing.problem.title")}
              <br />
              {t("landing.problem.titleBreak")}
            </h2>
          </div>
          <div className="lf-problem-grid">
            <div>
              <p className="lf-problem-body">{t("landing.problem.body")}</p>
              <ul className="lf-problem-list">
                <li>
                  <span className="lf-problem-ic"><Shield className="h-4 w-4" /></span>
                  <div>
                    <h4>{t("landing.problem.l1Title")}</h4>
                    <p>{t("landing.problem.l1Body")}</p>
                  </div>
                </li>
                <li>
                  <span className="lf-problem-ic"><Clock className="h-4 w-4" /></span>
                  <div>
                    <h4>{t("landing.problem.l2Title")}</h4>
                    <p>{t("landing.problem.l2Body")}</p>
                  </div>
                </li>
                <li>
                  <span className="lf-problem-ic"><CheckCircle2 className="h-4 w-4" /></span>
                  <div>
                    <h4>{t("landing.problem.l3Title")}</h4>
                    <p>{t("landing.problem.l3Body")}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="lf-problem-illus">
              <div className="lf-code-window">
                <div className="lf-code-dots">
                  <span /><span /><span />
                </div>
                <div><span className="lf-ln">1</span><span className="lf-tk-cm"># The syntax is just the entry ticket.</span></div>
                <div><span className="lf-ln">2</span><span className="lf-tk-kw">def</span> <span className="lf-tk-fn">handle_outage</span><span className="lf-tk-op">(</span><span className="lf-tk-var">service</span><span className="lf-tk-op">):</span></div>
                <div><span className="lf-ln">3</span>&nbsp;&nbsp;<span className="lf-tk-kw">if</span> <span className="lf-tk-var">service</span><span className="lf-tk-op">.</span><span className="lf-tk-var">latency</span> <span className="lf-tk-op">&gt;</span> <span className="lf-tk-str">SLO</span><span className="lf-tk-op">:</span></div>
                <div><span className="lf-ln">4</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="lf-tk-kw">return</span> <span className="lf-tk-fn">rollback</span><span className="lf-tk-op">()</span>&nbsp;&nbsp;<span className="lf-tk-cm"># …or scale? Or circuit-break?</span></div>
                <div><span className="lf-ln">5</span>&nbsp;&nbsp;<span className="lf-tk-cm"># The real question is: why this choice?</span><span className="lf-cursor" /></div>
              </div>
              <div className="lf-arrow-hint">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{t("landing.problem.think")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="lf-content" id="how" style={{ paddingTop: 20 }}>
        <div className="lf-container">
          <div className="lf-section-head">
            <span className="lf-section-eyebrow">{t("landing.how.eyebrow")}</span>
            <h2>
              {t("landing.how.title")}
              <br />
              {t("landing.how.titleBreak")}
            </h2>
            <p>{t("landing.how.sub")}</p>
          </div>
          <div className="lf-pillars">
            <div className="lf-pillar" style={{ "--c": "#9b7fff" } as React.CSSProperties}>
              <span className="lf-pillar-num">{t("landing.how.p1Num")}</span>
              <div className="lf-pillar-ic"><HelpCircle className="h-6 w-6" /></div>
              <h3>{t("landing.how.p1Title")}</h3>
              <p>{t("landing.how.p1Body")}</p>
              <div className="lf-pillar-foot">{t("landing.how.p1Foot")}</div>
            </div>
            <div className="lf-pillar" style={{ "--c": "#3ddc84" } as React.CSSProperties}>
              <span className="lf-pillar-num">{t("landing.how.p2Num")}</span>
              <div className="lf-pillar-ic"><LayoutGrid className="h-6 w-6" /></div>
              <h3>{t("landing.how.p2Title")}</h3>
              <p>{t("landing.how.p2Body")}</p>
              <div className="lf-pillar-foot">{t("landing.how.p2Foot")}</div>
            </div>
            <div className="lf-pillar" style={{ "--c": "#ffd86b" } as React.CSSProperties}>
              <span className="lf-pillar-num">{t("landing.how.p3Num")}</span>
              <div className="lf-pillar-ic"><Compass className="h-6 w-6" /></div>
              <h3>{t("landing.how.p3Title")}</h3>
              <p>{t("landing.how.p3Body")}</p>
              <div className="lf-pillar-foot">{t("landing.how.p3Foot")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRACKS ============ */}
      <section className="lf-content" id="tracks" style={{ paddingTop: 30 }}>
        <div className="lf-container">
          <div className="lf-section-head">
            <span className="lf-section-eyebrow">{t("landing.tracks.eyebrow")}</span>
            <h2>
              {t("landing.tracks.title")}
              <br />
              {t("landing.tracks.titleBreak")}
            </h2>
            <p>{t("landing.tracks.sub")}</p>
          </div>

          <div className="lf-tracks">
            <Link to="/dashboard" className="lf-track lf-track-python">
              <span className="lf-track-glow a" /><span className="lf-track-glow b" />
              <div className="lf-track-eb">TRACK · 01</div>
              <div className="lf-track-t">{t("landing.tracks.pythonTitle")}</div>
              <div className="lf-track-t-sub">{t("landing.tracks.pythonSub")}</div>
              <div className="lf-track-s">{t("landing.tracks.pythonBody")}</div>
              <div className="lf-track-meta">
                <span className="lf-track-chip"><span className="font-mono tabular-nums">12</span> {t("landing.tracks.modules")}</span>
                <div className="lf-track-arrow"><ArrowRight className={cn("h-3.5 w-3.5", isRtl && "rotate-180")} /></div>
              </div>
            </Link>

            <Link to="/tracks/python-oop" className="lf-track lf-track-oop">
              <span className="lf-track-glow a" /><span className="lf-track-glow b" />
              <div className="lf-track-eb">TRACK · 02</div>
              <div className="lf-track-t">{t("landing.tracks.oopTitle")}</div>
              <div className="lf-track-t-sub">{t("landing.tracks.oopSub")}</div>
              <div className="lf-track-s">{t("landing.tracks.oopBody")}</div>
              <div className="lf-track-meta">
                <span className="lf-track-chip"><span className="font-mono tabular-nums">8</span> {t("landing.tracks.modules")}</span>
                <div className="lf-track-arrow"><ArrowRight className={cn("h-3.5 w-3.5", isRtl && "rotate-180")} /></div>
              </div>
            </Link>

            <Link to="/tracks/devops" className="lf-track lf-track-devops">
              <span className="lf-track-glow a" /><span className="lf-track-glow b" />
              <div className="lf-track-eb">TRACK · 03</div>
              <div className="lf-track-t">{t("landing.tracks.devopsTitle")}</div>
              <div className="lf-track-t-sub">{t("landing.tracks.devopsSub")}</div>
              <div className="lf-track-s">{t("landing.tracks.devopsBody")}</div>
              <div className="lf-track-meta">
                <span className="lf-track-chip">
                  <span className="font-mono tabular-nums">8</span> {t("landing.tracks.modules")} · {t("landing.tracks.new")}
                </span>
                <div className="lf-track-arrow"><ArrowRight className={cn("h-3.5 w-3.5", isRtl && "rotate-180")} /></div>
              </div>
            </Link>

            <div className="lf-track lf-track-dsa lf-track-coming" role="group" aria-label={t("landing.tracks.dsaTitle")}>
              <span className="lf-soon-tag"><span className="lf-soon-pulse" />{t("landing.tracks.soon")}</span>
              <span className="lf-track-glow a" /><span className="lf-track-glow b" />
              <div className="lf-track-eb">TRACK · 04</div>
              <div className="lf-track-t">{t("landing.tracks.dsaTitle")}</div>
              <div className="lf-track-t-sub">{t("landing.tracks.dsaSub")}</div>
              <div className="lf-track-s">{t("landing.tracks.dsaBody")}</div>
              <div className="lf-track-meta">
                <span className="lf-track-chip"><Calendar className="h-3 w-3" />{t("landing.tracks.dsaLaunch")}</span>
                <div className="lf-track-arrow"><Lock className="h-3.5 w-3.5" /></div>
              </div>
            </div>

            <div className="lf-track lf-track-ai lf-track-coming" role="group" aria-label={t("landing.tracks.aiTitle")}>
              <span className="lf-soon-tag"><span className="lf-soon-pulse" />{t("landing.tracks.soon")}</span>
              <span className="lf-track-glow a" /><span className="lf-track-glow b" />
              <div className="lf-track-eb">TRACK · 05</div>
              <div className="lf-track-t">{t("landing.tracks.aiTitle")}</div>
              <div className="lf-track-t-sub">{t("landing.tracks.aiSub")}</div>
              <div className="lf-track-s">{t("landing.tracks.aiBody")}</div>
              <div className="lf-track-meta">
                <span className="lf-track-chip"><Calendar className="h-3 w-3" />{t("landing.tracks.aiLaunch")}</span>
                <div className="lf-track-arrow"><Lock className="h-3.5 w-3.5" /></div>
              </div>
            </div>

            <div className="lf-track lf-track-sec lf-track-coming" role="group" aria-label={t("landing.tracks.secTitle")}>
              <span className="lf-soon-tag"><span className="lf-soon-pulse" />{t("landing.tracks.soon")}</span>
              <span className="lf-track-glow a" /><span className="lf-track-glow b" />
              <div className="lf-track-eb">TRACK · 06</div>
              <div className="lf-track-t">{t("landing.tracks.secTitle")}</div>
              <div className="lf-track-t-sub">{t("landing.tracks.secSub")}</div>
              <div className="lf-track-s">{t("landing.tracks.secBody")}</div>
              <div className="lf-track-meta">
                <span className="lf-track-chip"><Calendar className="h-3 w-3" />{t("landing.tracks.secLaunch")}</span>
                <div className="lf-track-arrow"><Lock className="h-3.5 w-3.5" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOUNDER ============ */}
      <section className="lf-content lf-founder-section" id="founder">
        <div className="lf-container">
          <div className="lf-founder-card">
            <div className="lf-founder-photo-wrap">
              <div className="lf-founder-photo">
                <img src="/founder.png" alt={t("landing.founder.alt")} loading="lazy" />
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
              <span className="lf-brand-mark" aria-hidden="true">
                <svg viewBox="0 0 64 64" fill="none">
                  <path d="M14 14 L14 50 L36 50" stroke="#9b7fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M30 22 L50 22 M30 34 L44 34" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
                </svg>
              </span>
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
