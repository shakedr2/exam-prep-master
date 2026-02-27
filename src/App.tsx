import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useTheme } from "@/hooks/useTheme";
import Index from "./pages/Index";
import Topics from "./pages/Topics";
import TopicPractice from "./pages/TopicPractice";
import TopicLearn from "./pages/TopicLearn";
import ExamMode from "./pages/ExamMode";
import ProgressPage from "./pages/ProgressPage";
import ReviewMistakes from "./pages/ReviewMistakes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useTheme(); // applies dark/light class to <html>

  return (
    <div>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/topic/:topicId" element={<TopicPractice />} />
          <Route path="/topic/:topicId/learn" element={<TopicLearn />} />
          <Route path="/exam" element={<ExamMode />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/review-mistakes" element={<ReviewMistakes />} />
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
