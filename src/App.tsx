import { lazy, Suspense, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { PostHogProvider, usePostHog } from "posthog-js/react";
import { posthog } from "@/lib/posthog";
import { retryLazy } from "@/lib/retryLazy";
import { LazyRouteBoundary } from "@/shared/components/LazyRouteBoundary";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { Navbar } from "@/shared/components/Navbar";
import { BottomNav } from "@/shared/components/BottomNav";
import { AppFooter } from "@/shared/components/AppFooter";
import { PageTransition } from "@/shared/components/PageTransition";
import { CookieConsent } from "@/components/CookieConsent";

// Auth pages are eagerly loaded — they're needed immediately on app start and
// should never flash a loading spinner before the user can sign in.
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

// All other pages are lazy-loaded to reduce the initial bundle size.
const HomePage = lazy(retryLazy(() => import("./pages/HomePage")));
const OnboardingPage = lazy(retryLazy(() => import("./pages/OnboardingPage")));
const DashboardPage = lazy(retryLazy(() => import("./pages/DashboardPage")));
const ExamMode = lazy(retryLazy(() => import("./pages/ExamMode")));
const ProgressPage = lazy(retryLazy(() => import("./pages/ProgressPage")));
const NotFound = lazy(retryLazy(() => import("./pages/NotFound")));
const PrivacyPage = lazy(retryLazy(() => import("./pages/PrivacyPage")));
const TermsPage = lazy(retryLazy(() => import("./pages/TermsPage")));
const ReviewMistakes = lazy(retryLazy(() => import("./pages/ReviewMistakes")));
const LearnPage = lazy(retryLazy(() => import("./pages/LearnPage")));
const DevOpsTrackPage = lazy(retryLazy(() => import("./pages/DevOpsTrackPage")));
const OopTrackPage = lazy(retryLazy(() => import("./pages/OopTrackPage")));
const PracticePage = lazy(retryLazy(() => import("./pages/PracticePage")));
const WelcomePage = lazy(retryLazy(() => import("./pages/WelcomePage")));
const LandingPage = lazy(retryLazy(() => import("./features/welcome/WelcomePage")));

// Multi-topic tutor pages — one per expert tutor (Prof. Python, Prof. Linux, …).
// Lazy-loaded to keep the initial bundle small; each page ships the topic's
// full curriculum + tutor persona.
const PythonPage = lazy(retryLazy(() => import("./pages/topics/PythonPage")));
const LinuxPage = lazy(retryLazy(() => import("./pages/topics/LinuxPage")));
const GitPage = lazy(retryLazy(() => import("./pages/topics/GitPage")));
const NetworkingPage = lazy(retryLazy(() => import("./pages/topics/NetworkingPage")));
const DockerPage = lazy(retryLazy(() => import("./pages/topics/DockerPage")));
const CICDPage = lazy(retryLazy(() => import("./pages/topics/CICDPage")));
const CloudPage = lazy(retryLazy(() => import("./pages/topics/CloudPage")));
const IaCPage = lazy(retryLazy(() => import("./pages/topics/IaCPage")));

const SentryErrorFallback = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">{t("error.somethingWentWrong")}</h1>
      <p className="text-muted-foreground mb-4">{t("error.unexpectedError")}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        {t("error.refreshPage")}
      </button>
    </div>
  );
};

/**
 * SPA pageview tracker.
 *
 * PostHog's automatic pageview capture is disabled in `initPostHog` because
 * a single-page app only triggers a real `load` event once. Instead we use
 * the `usePostHog()` hook (scoped to the <PostHogProvider>) and fire a
 * `$pageview` event every time react-router reports a new location. We also
 * fire `$pageleave` on unmount so session duration / bounce metrics in
 * PostHog stay accurate when the user navigates away or closes the tab.
 */
function PostHogPageviewTracker() {
  const location = useLocation();
  const posthogClient = usePostHog();

  useEffect(() => {
    if (!posthogClient) return;
    posthogClient.capture("$pageview", {
      $current_url: window.location.href,
    });
    return () => {
      posthogClient.capture("$pageleave");
    };
  }, [location.pathname, location.search, posthogClient]);

  return null;
}

/**
 * `/` is dual-purpose: unauthenticated visitors see the Logic Flow landing
 * page (marketing), authenticated users see the in-app HomePage (progress
 * + tracks). While the auth session is still being resolved we render
 * nothing to avoid a flash of the wrong page — `LazyRouteBoundary`'s
 * spinner is already taking care of the visual.
 */
function RootRoute() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? <HomePage /> : <LandingPage />;
}

/**
 * Renders the route table inside an AnimatePresence so that each page
 * element gets a fade/slide transition on mount and unmount.
 *
 * Notes:
 *   • `mode="wait"` → exit animation completes before the next page enters.
 *     This avoids two pages rendering on top of each other during the swap.
 *   • We `key` the <Routes> on `location.pathname` (not the whole location
 *     object) so in-page state updates that don't change the path don't
 *     retrigger the transition.
 *   • `PageTransition` internally checks `prefers-reduced-motion` and
 *     collapses to an instant opacity swap when the user has it enabled.
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><RootRoute /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><OnboardingPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/welcome" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><WelcomePage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/auth/callback" element={<PageTransition><AuthCallbackPage /></PageTransition>} />
        <Route path="/dashboard" element={<AuthGuard><PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><DashboardPage /></Suspense></LazyRouteBoundary></PageTransition></AuthGuard>} />
        <Route path="/practice/:topicId" element={<AuthGuard><PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><PracticePage /></Suspense></LazyRouteBoundary></PageTransition></AuthGuard>} />
        <Route path="/learn/:topicId" element={<AuthGuard><PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><LearnPage /></Suspense></LazyRouteBoundary></PageTransition></AuthGuard>} />
        <Route path="/exam" element={<AuthGuard><PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><ExamMode /></Suspense></LazyRouteBoundary></PageTransition></AuthGuard>} />
        <Route path="/progress" element={<AuthGuard><PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><ProgressPage /></Suspense></LazyRouteBoundary></PageTransition></AuthGuard>} />
        <Route path="/review-mistakes" element={<AuthGuard><PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><ReviewMistakes /></Suspense></LazyRouteBoundary></PageTransition></AuthGuard>} />
        <Route path="/tracks/devops" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><DevOpsTrackPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/tracks/python-oop" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><OopTrackPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/topics/python" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><PythonPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/topics/linux" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><LinuxPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/topics/git" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><GitPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/topics/networking" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><NetworkingPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/topics/docker" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><DockerPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/topics/cicd" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><CICDPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/topics/cloud" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><CloudPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/topics/iac" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><IaCPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><PrivacyPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="/terms" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><TermsPage /></Suspense></LazyRouteBoundary></PageTransition>} />
        <Route path="*" element={<PageTransition><LazyRouteBoundary><Suspense fallback={<LoadingSpinner />}><NotFound /></Suspense></LazyRouteBoundary></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

const queryClient = new QueryClient();

/**
 * Renders the shared app chrome (Navbar, BottomNav, AppFooter) unless the
 * user is on the marketing landing (`/` while unauthenticated). The landing
 * ships its own nav + footer, so stacking the shared chrome on top would
 * duplicate controls and break the visual.
 */
function AppChrome() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const hideForLanding = pathname === "/" && !loading && !user;

  if (hideForLanding) {
    return (
      <>
        <AnimatedRoutes />
        <CookieConsent />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <AnimatedRoutes />
      <AppFooter />
      <BottomNav />
      <CookieConsent />
    </>
  );
}

const AppContent = () => {
  return (
    <div>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PostHogPageviewTracker />
        <AppChrome />
      </BrowserRouter>
    </div>
  );
};

const App = () => (
  <Sentry.ErrorBoundary fallback={<SentryErrorFallback />}>
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </PostHogProvider>
  </Sentry.ErrorBoundary>
);

export default App;
