import { lazy, Suspense, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { PostHogProvider, usePostHog } from "posthog-js/react";
import { posthog } from "@/lib/posthog";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { Navbar } from "@/shared/components/Navbar";
import { BottomNav } from "@/shared/components/BottomNav";
import { PageTransition } from "@/shared/components/PageTransition";
import HomePage from "./pages/HomePage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import PracticePage from "./pages/PracticePage";
import ExamMode from "./pages/ExamMode";
import ProgressPage from "./pages/ProgressPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import NotFound from "./pages/NotFound";

const ReviewMistakes = lazy(() => import("./pages/ReviewMistakes"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const DevOpsTrackPage = lazy(() => import("./pages/DevOpsTrackPage"));

const LazyFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-muted-foreground">טוען...</div>
  </div>
);

const SentryErrorFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center" dir="rtl">
    <h1 className="text-2xl font-bold mb-2">משהו השתבש</h1>
    <p className="text-muted-foreground mb-4">אירעה שגיאה בלתי צפויה. נסה לרענן את הדף.</p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
    >
      רענן דף
    </button>
  </div>
);

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
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><OnboardingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/auth/callback" element={<PageTransition><AuthCallbackPage /></PageTransition>} />
        <Route path="/dashboard" element={<AuthGuard><PageTransition><DashboardPage /></PageTransition></AuthGuard>} />
        <Route path="/practice/:topicId" element={<AuthGuard><PageTransition><PracticePage /></PageTransition></AuthGuard>} />
        <Route path="/learn/:topicId" element={<AuthGuard><PageTransition><Suspense fallback={<LazyFallback />}><LearnPage /></Suspense></PageTransition></AuthGuard>} />
        <Route path="/exam" element={<AuthGuard><PageTransition><ExamMode /></PageTransition></AuthGuard>} />
        <Route path="/progress" element={<AuthGuard><PageTransition><ProgressPage /></PageTransition></AuthGuard>} />
        <Route path="/review-mistakes" element={<AuthGuard><PageTransition><Suspense fallback={<LazyFallback />}><ReviewMistakes /></Suspense></PageTransition></AuthGuard>} />
        <Route path="/tracks/devops" element={<PageTransition><Suspense fallback={<LazyFallback />}><DevOpsTrackPage /></Suspense></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <div>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PostHogPageviewTracker />
        <Navbar />
        <AnimatedRoutes />
        <BottomNav />
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
