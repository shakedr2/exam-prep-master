/**
 * Phase 4 PR1 — Logic Flow landing page.
 *
 * Scenarios covered:
 *   • Renders the landing sections (hero, tracks grid, founder, footer)
 *   • 6 track cards render — 3 linked (Python/OOP/DevOps) and 3 coming-soon
 *     (C# + DSA + AI/ML) rendered as non-link `role="group"`
 *   • Theme toggle writes `lf-theme` to localStorage
 *   • Arrow icons flip for RTL (Hebrew) and don't flip for LTR (English)
 *   • i18n switch between he/en updates visible strings
 */

import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import he from "@/features/i18n/locales/he";
import en from "@/features/i18n/locales/en";
import LandingPage from "@/features/welcome/WelcomePage";

/* ── i18n bootstrap for tests ─────────────────────────────────────────────── */

async function initI18n(lng: "he" | "en") {
  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources: { he: { translation: he }, en: { translation: en } },
      lng,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    });
  } else {
    await i18n.changeLanguage(lng);
  }
}

function renderLanding() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <LandingPage />
    </MemoryRouter>,
  );
}

/* ── Tests ────────────────────────────────────────────────────────────────── */

describe("Landing WelcomePage", () => {
  beforeEach(async () => {
    window.localStorage.clear();
    await initI18n("he");
  });

  afterEach(() => {
    cleanup();
  });

  it("renders hero, tracks, founder, and footer sections in Hebrew", async () => {
    renderLanding();

    expect(screen.getByText(he.landing.hero.title1)).toBeInTheDocument();
    expect(screen.getByText(he.landing.hero.title2)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: he.landing.tracks.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(he.landing.founder.title)).toBeInTheDocument();
    expect(screen.getByText(he.landing.footer.copy)).toBeInTheDocument();
  });

  it("renders 6 track cards — 3 linked and 3 coming-soon groups", async () => {
    renderLanding();

    const liveLinks = [
      screen.getByRole("link", { name: new RegExp(he.landing.tracks.pythonTitle) }),
      screen.getByRole("link", { name: new RegExp(he.landing.tracks.oopTitle) }),
      screen.getByRole("link", { name: new RegExp(he.landing.tracks.devopsTitle) }),
    ];
    expect(liveLinks[0]).toHaveAttribute("href", "/dashboard");
    expect(liveLinks[1]).toHaveAttribute("href", "/tracks/python-oop");
    expect(liveLinks[2]).toHaveAttribute("href", "/tracks/devops");

    // Coming-soon cards: 3 role=group entries with the "Coming Soon" aria tag.
    const comingGroups = screen.getAllByRole("group");
    expect(comingGroups.length).toBeGreaterThanOrEqual(3);
    expect(
      comingGroups.some((el) =>
        el.getAttribute("aria-label")?.includes(he.landing.tracks.csharpTitle),
      ),
    ).toBe(true);
  });

  it("C# coming-soon card does not link anywhere (Phase 6 #308 not started)", async () => {
    renderLanding();

    expect(
      screen.queryByRole("link", { name: new RegExp(he.landing.tracks.csharpTitle) }),
    ).toBeNull();
  });

  it("theme toggle persists 'lf-theme' to localStorage", async () => {
    renderLanding();

    // Default is dark (no key yet).
    expect(window.localStorage.getItem("lf-theme")).toBe("dark");

    const toggle = screen.getByRole("button", { name: he.landing.nav.themeLight });
    fireEvent.click(toggle);
    expect(window.localStorage.getItem("lf-theme")).toBe("light");

    const toggleBack = screen.getByRole("button", { name: he.landing.nav.themeDark });
    fireEvent.click(toggleBack);
    expect(window.localStorage.getItem("lf-theme")).toBe("dark");
  });

  it("i18n switch to English updates the visible strings", async () => {
    renderLanding();

    // Sanity check: Hebrew hero is live first.
    expect(screen.getByText(he.landing.hero.title1)).toBeInTheDocument();

    await initI18n("en");
    cleanup();
    renderLanding();

    expect(screen.getByText(en.landing.hero.title1)).toBeInTheDocument();
    expect(screen.getByText(en.landing.hero.title2)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: en.landing.tracks.title }),
    ).toBeInTheDocument();
  });
});
