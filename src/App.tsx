import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { Navbar } from "@/shared/components/Navbar";
import { BottomNav } from "@/shared/components/BottomNav";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import PracticePage from "./pages/PracticePage";
import AdminPage from "./pages/AdminPage";
import Topics from "./pages/Topics";
import TopicPractice from "./pages/TopicPractice";
import TopicLearn from "./pages/TopicLearn";
import ConceptsPractice from "./pages/ConceptsPractice";
import ExamMode from "./pages/ExamMode";
import ProgressPage from "./pages/ProgressPage";
import ReviewMistakes from "./pages/ReviewMistakes";
import NotFound from "./pages/NotFound";
import QuestionsPracticePage from "./pages/QuestionsPracticePage";
import ConceptsPracticePage from "./pages/ConceptsPracticePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import FocusedPracticePage from "./pages/FocusedPracticePage";

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
          <Route path="/dashboard" element={<AuthGuard><DashboardPage /></AuthGuard>} />
          <Route path="/practice/:topicId" element={<AuthGuard><PracticePage /></AuthGuard>} />
          <Route path="/topics" element={<AuthGuard><Topics /></AuthGuard>} />
          <Route path="/concepts/:topicId" element={<AuthGuard><ConceptsPractice /></AuthGuard>} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/topic/:topicId" element={<AuthGuard><TopicPractice /></AuthGuard>} />
          <Route path="/concepts" element={<AuthGuard><ConceptsPractice /></AuthGuard>} />
          <Route path="/concepts/practice" element={<AuthGuard><ConceptsPracticePage /></AuthGuard>} />
          <Route path="/topic/:topicId/learn" element={<AuthGuard><TopicLearn /></AuthGuard>} />
          <Route path="/exam" element={<AuthGuard><ExamMode /></AuthGuard>} />
          <Route path="/progress" element={<AuthGuard><ProgressPage /></AuthGuard>} />
          <Route path="/review-mistakes" element={<AuthGuard><ReviewMistakes /></AuthGuard>} />
          <Route path="/questions/practice" element={<AuthGuard><QuestionsPracticePage /></AuthGuard>} />
          <Route path="/analytics" element={<AuthGuard><AnalyticsPage /></AuthGuard>} />
          <Route path="/focused-practice" element={<AuthGuard><FocusedPracticePage /></AuthGuard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
