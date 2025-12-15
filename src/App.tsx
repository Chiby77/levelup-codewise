
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import FloatingChatButton from "@/components/FloatingChatButton";
import Index from "./pages/Index";
import About from "./pages/About";
import Downloads from "./pages/Downloads";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import StudentExam from "./pages/StudentExam";
import AdminContent from "./pages/AdminContent";
import StudentSubmissionHistory from "./pages/StudentSubmissionHistory";
import { ExamSystem } from "./pages/ExamSystem";

// Create a client with optimized caching for performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache garbage collection after 30 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus for mobile
      retry: 2, // Retry failed requests twice
      refetchOnReconnect: true, // Refetch when internet reconnects
    },
  },
});

const App = () => {
  console.log('App component is rendering...');
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" enableSystem>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/student-exam" element={<StudentExam />} />
                <Route path="/exams" element={<ExamSystem />} />
                <Route path="/admin-content" element={<AdminContent />} />
                <Route path="/submission-history" element={<StudentSubmissionHistory />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <FloatingChatButton />
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return <div>Error loading application. Check console for details.</div>;
  }
};

export default App;
