
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
import { ExamSystem } from "./pages/ExamSystem";

// Create a client
const queryClient = new QueryClient();

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
                <Route path="/exams" element={<ExamSystem />} />
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
