import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateResponse, generateGreeting } from "@/utils/ai/index";
import {
  BookOpenCheck,
  ChevronDown,
  Database,
  Loader2,
  ShieldCheck,
  TreePine,
  BookCheck,
  Sparkles,
  Brain,
  Zap,
  ImagePlus,
  X,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessage } from "./chat/ChatMessage";
import { MessageInput } from "./chat/MessageInput";
import { QuickActions } from "./chat/QuickActions";
import { QuizComponent } from "./quiz/QuizComponent";
import { QuizAccess } from "./quiz/QuizAccess";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { BluewaveLogo } from "./BluewaveLogo";

interface Message {
  role: "assistant" | "user";
  content: string;
  id: string;
  animate?: boolean;
  imageUrl?: string;
}

function getOrCreateSessionId(): string {
  const existing = localStorage.getItem("mbuya-session-id");
  if (existing) return existing;
  const fresh = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem("mbuya-session-id", fresh);
  return fresh;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function MbuyaZivai() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDropdownHint, setShowDropdownHint] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showQuizAccess, setShowQuizAccess] = useState(false);
  const [quizCategory, setQuizCategory] = useState<string | undefined>(undefined);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showQuickActions, setShowQuickActions] = useState(true);

  useEffect(() => {
    getOrCreateSessionId();
    const timer = setTimeout(() => {
      const initialGreeting = generateGreeting();
      setMessages([
        {
          role: "assistant",
          content: `${initialGreeting} I'm Mbuya Zivai, your AI tutor for Bluewave Academy. Ask me anything about Computer Science — programming, algorithms, exam prep — or send a photo of your work and I'll help.`,
          id: "greeting-" + Date.now(),
          animate: true,
        },
      ]);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 3) {
      setShowDropdownHint(true);
      setTimeout(() => setShowDropdownHint(false), 4000);
    }
  }, [messages]);

  const handleImagePick = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Unsupported file", description: "Please choose an image.", variant: "destructive" });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Maximum size is 8 MB.", variant: "destructive" });
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setPendingImage(dataUrl);
  };

  const handleSubmit = async (query: string) => {
    if (!query.trim() && !pendingImage) return;

    setShowWelcome(false);
    setShowQuickActions(false);

    // Quick navigation shortcuts (text only)
    const lower = query.toLowerCase();
    if (!pendingImage) {
      if (lower.includes("digital exam") || lower.includes("take exam")) {
        const id = "assistant-exam-" + Date.now();
        setMessages((p) => [
          ...p,
          { role: "user", content: query, id: "user-" + Date.now() },
          {
            role: "assistant",
            content: "Opening the digital exam portal for you...",
            id,
            animate: true,
          },
        ]);
        setTimeout(() => navigate("/student-exam"), 1500);
        return;
      }
      const resourceKeywords = ["download", "resource", "paper", "notes", "book", "material", "past paper"];
      if (resourceKeywords.some((k) => lower.includes(k))) {
        const id = "assistant-resource-" + Date.now();
        setMessages((p) => [
          ...p,
          { role: "user", content: query, id: "user-" + Date.now() },
          {
            role: "assistant",
            content: "Heading to the downloads page where you can grab notes, past papers and textbooks.",
            id,
            animate: true,
          },
        ]);
        setTimeout(() => navigate("/downloads"), 1500);
        return;
      }
      if (lower.includes("quiz") || lower.includes("test my knowledge")) {
        setShowQuizAccess(true);
        return;
      }
      if (lower.includes("start quiz") || lower.includes("take quiz")) {
        const cm = query.match(/quiz\s+on\s+(\w+)/i) || query.match(/(\w+)\s+quiz/i);
        setQuizCategory(cm ? cm[1] : undefined);
        setShowQuiz(true);
        return;
      }
    }

    const imageForThisMessage = pendingImage;
    const userMessage: Message = {
      role: "user",
      content: query || (imageForThisMessage ? "(image only)" : ""),
      id: "user-" + Date.now(),
      imageUrl: imageForThisMessage || undefined,
    };
    setMessages((p) => [...p, userMessage]);
    setPendingImage(null);
    setIsLoading(true);

    try {
      const sessionId = getOrCreateSessionId();
      const recent = [...messages, userMessage].slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { data, error } = await supabase.functions.invoke("enhanced-ai", {
        body: {
          message: query,
          sessionId,
          history: recent.slice(0, -1),
          imageUrl: imageForThisMessage,
        },
      });

      if (error) throw error;
      if (data?.error && !data?.response) throw new Error(data.error);

      const response = data?.response || generateResponse(query);
      const assistantId = "assistant-" + Date.now();
      setMessages((p) => [
        ...p,
        { role: "assistant", content: response, id: assistantId, animate: true },
      ]);
    } catch (error: any) {
      console.error("Mbuya Zivai error:", error);
      try {
        const fallback = generateResponse(query);
        setMessages((p) => [
          ...p,
          { role: "assistant", content: fallback, id: "assistant-" + Date.now(), animate: true },
        ]);
      } catch {
        toast({
          title: "Error",
          description: error?.message || "Failed to get a reply. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickActionClick = (query: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    handleSubmit(query);
  };

  const isEmptyState = messages.length === 0;

  const suggestedTopics = [
    {
      icon: <Database className="mr-2 h-4 w-4 text-primary" />,
      text: "Explain dynamic vs static data structures",
      query: "What's the difference between dynamic and static data structures?",
    },
    {
      icon: <TreePine className="mr-2 h-4 w-4 text-primary" />,
      text: "Find study resources",
      query: "Where can I find programming notes and past papers?",
    },
    {
      icon: <ShieldCheck className="mr-2 h-4 w-4 text-primary" />,
      text: "Take digital exam",
      query: "I want to take a digital exam",
    },
    {
      icon: <BookCheck className="mr-2 h-4 w-4 text-primary" />,
      text: "Take a quiz",
      query: "I want to take a quiz",
    },
  ];

  return (
    <Card className="w-full h-full max-w-4xl mx-auto shadow-2xl border-accent/20 overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
      <ChatHeader />

      <CardContent className="p-0 flex flex-col h-[calc(80vh-7rem)]">
        {showQuiz ? (
          <QuizComponent onFinish={() => setShowQuiz(false)} category={quizCategory} />
        ) : showQuizAccess ? (
          <QuizAccess onClose={() => setShowQuizAccess(false)} />
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4 bg-gradient-to-b from-background via-primary/5 to-background" ref={scrollRef}>
              {isEmptyState && showWelcome && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fadeIn p-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-accent rounded-full blur-3xl opacity-40 animate-pulse" />
                    <BluewaveLogo className="relative w-32 h-32 rounded-3xl shadow-2xl" />
                    <Sparkles className="absolute -top-2 -right-2 w-10 h-10 text-yellow-400 animate-pulse" />
                    <Zap className="absolute -bottom-2 -left-2 w-8 h-8 text-accent animate-bounce" />
                  </div>

                  <div className="space-y-4 max-w-2xl">
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                      Mbuya Zivai
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Your AI tutor for A Level Computer Science. Free for everyone — no sign-in needed.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-sm">
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                        <Brain className="w-5 h-5 text-accent mx-auto mb-2" />
                        <p className="font-semibold text-accent">Smart Tutoring</p>
                        <p className="text-xs text-muted-foreground">Instant answers</p>
                      </div>
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                        <ImagePlus className="w-5 h-5 text-primary mx-auto mb-2" />
                        <p className="font-semibold text-primary">Image Recognition</p>
                        <p className="text-xs text-muted-foreground">Send a photo of your work</p>
                      </div>
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                        <BookOpenCheck className="w-5 h-5 text-accent mx-auto mb-2" />
                        <p className="font-semibold text-accent">Exam Ready</p>
                        <p className="text-xs text-muted-foreground">Past papers & quizzes</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showQuickActions && (
                <QuickActions onActionClick={handleQuickActionClick} suggestedTopics={suggestedTopics} />
              )}

              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  animate={message.animate}
                  id={message.id}
                  imageUrl={message.imageUrl}
                />
              ))}

              {isLoading && (
                <div className="flex items-start gap-3 mb-6 animate-fadeIn">
                  <div className="flex-shrink-0 mt-1">
                    <BluewaveLogo className="w-9 h-9 rounded-xl" />
                  </div>
                  <div className="max-w-[75%] bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl rounded-tl-sm p-4 shadow-lg backdrop-blur-sm border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Loader2 className="h-4 w-4 animate-spin text-accent" />
                      <span className="text-sm text-muted-foreground">Mbuya Zivai is thinking...</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}

              {showDropdownHint && (
                <div className="flex justify-center my-4 animate-pulse">
                  <div className="flex flex-col items-center text-muted-foreground text-sm">
                    <ChevronDown className="h-5 w-5 animate-bounce" />
                    <p>Try asking about binary trees, cybersecurity, or VB.NET coding</p>
                  </div>
                </div>
              )}

              <div className="h-2" ref={messageEndRef} />
            </ScrollArea>

            {/* Pending image preview */}
            {pendingImage && (
              <div className="px-4 py-2 border-t border-border/50 bg-muted/30 flex items-center gap-3">
                <img src={pendingImage} alt="attached" className="h-16 w-16 object-cover rounded-md" />
                <span className="text-sm text-muted-foreground flex-1">Image attached — add a question or just send.</span>
                <Button size="icon" variant="ghost" onClick={() => setPendingImage(null)} aria-label="Remove image">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Input area */}
            <div className="flex items-end gap-2 px-4 py-3 border-t border-border/50">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImagePick(e.target.files?.[0] || null)}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach an image"
                title="Attach an image"
              >
                <ImagePlus className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <MessageInput onSendMessage={handleSubmit} isLoading={isLoading} />
              </div>
            </div>
          </>
        )}
      </CardContent>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </Card>
  );
}
