
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import FloatingChatButton from "@/components/FloatingChatButton";
import { registerServiceWorker } from "@/utils/serviceWorkerRegistration";

// Eagerly loaded - critical path
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminPortal from "./pages/AdminPortal";

// Lazy loaded - code splitting for better mobile performance
const About = lazy(() => import("./pages/About"));
const Downloads = lazy(() => import("./pages/Downloads"));
const Contact = lazy(() => import("./pages/Contact"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const StudentExam = lazy(() => import("./pages/StudentExam"));
const AdminContent = lazy(() => import("./pages/AdminContent"));
const StudentSubmissionHistory = lazy(() => import("./pages/StudentSubmissionHistory"));
const ExamSystem = lazy(() => import("./pages/ExamSystem").then(m => ({ default: m.ExamSystem })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

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

// Register service worker for offline support
registerServiceWorker();

const App = () => {
  console.log('App component is rendering...');
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" enableSystem>
          <TooltipProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin-portal-secret" element={<AdminPortal />} />
                  <Route path="/student-dashboard" element={<StudentDashboard />} />
                  <Route path="/student-exam" element={<StudentExam />} />
                  <Route path="/exams" element={<ExamSystem />} />
                  <Route path="/admin-content" element={<AdminContent />} />
                  <Route path="/submission-history" element={<StudentSubmissionHistory />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
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
