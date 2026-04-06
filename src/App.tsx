import { Component, lazy, Suspense } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { Navbar } from "@/shared/components/Navbar";
import { BottomNav } from "@/shared/components/BottomNav";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import PracticePage from "./pages/PracticePage";
import ExamMode from "./pages/ExamMode";
import ProgressPage from "./pages/ProgressPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import ExamPrepPage from "./pages/ExamPrepPage";

const ReviewMistakes = lazy(() => import("./pages/ReviewMistakes"));

const LazyFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-muted-foreground">טוען...</div>
  </div>
);

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
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
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient();

const AppContent = () => {
  useTheme();

  return (
    <div>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<AuthGuard><DashboardPage /></AuthGuard>} />
          <Route path="/practice/:topicId" element={<AuthGuard><PracticePage /></AuthGuard>} />
          <Route path="/exam" element={<AuthGuard><ExamMode /></AuthGuard>} />
          <Route path="/progress" element={<AuthGuard><ProgressPage /></AuthGuard>} />
          <Route path="/exam-prep" element={<AuthGuard><ExamPrepPage /></AuthGuard>} />
          <Route path="/review-mistakes" element={<AuthGuard><Suspense fallback={<LazyFallback />}><ReviewMistakes /></Suspense></AuthGuard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
