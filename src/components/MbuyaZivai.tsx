
import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateResponse, generateGreeting } from "@/utils/ai/index";
import { 
  BookOpenCheck, 
  Bot, 
  ChevronDown, 
  Database, 
  Loader2,
  ShieldCheck,
  TreePine,
  BookCheck
} from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessage } from "./chat/ChatMessage";
import { MessageInput } from "./chat/MessageInput";
import { QuickActions } from "./chat/QuickActions";
import { QuizComponent } from "./quiz/QuizComponent";
import { QuizAccess } from "./quiz/QuizAccess";
import MotivationalQuotes from "./MotivationalQuotes";

interface Message {
  role: "assistant" | "user";
  content: string;
  id: string;
  animate?: boolean;
}

export default function MbuyaZivai() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDropdownHint, setShowDropdownHint] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showQuizAccess, setShowQuizAccess] = useState(false);
  const [quizCategory, setQuizCategory] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Animation states
  const [messageAnimationComplete, setMessageAnimationComplete] = useState<Record<string, boolean>>({});
  const [showQuickActions, setShowQuickActions] = useState(true);

  useEffect(() => {
    // Generate or get session ID
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', Date.now().toString());
    }

    const timer = setTimeout(() => {
      const initialGreeting = generateGreeting();
      setMessages([{
        role: "assistant",
        content: `${initialGreeting} I'm Mbuya Zivai, your enhanced AI assistant! I learn from our conversations to provide better, more personalized help. Ask me anything about Computer Science!`,
        id: "greeting-" + Date.now(),
        animate: true
      }]);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll to bottom with smooth animation
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Show dropdown hint after a few messages
    if (messages.length === 3) {
      setShowDropdownHint(true);
      setTimeout(() => setShowDropdownHint(false), 4000);
    }
  }, [messages]);

  const handleSubmit = async (query: string) => {
    setShowWelcome(false);
    setShowQuickActions(false);
    
    // Handle quiz commands
    if (query.toLowerCase().includes('quiz') || query.toLowerCase().includes('test my knowledge')) {
      setShowQuizAccess(true);
      return;
    }
    
    if (query.toLowerCase().includes('start quiz') || query.toLowerCase().includes('take quiz')) {
      const categoryMatch = query.match(/quiz\s+on\s+(\w+)/i) || 
                            query.match(/(\w+)\s+quiz/i);
      
      if (categoryMatch) {
        setQuizCategory(categoryMatch[1]);
      } else {
        setQuizCategory(undefined);
      }
      
      setShowQuiz(true);
      return;
    }
    
    const userMessage = { 
      role: "user" as const, 
      content: query,
      id: "user-" + Date.now()
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log('Attempting to call enhanced-ai function...');
      
      // Use enhanced AI with learning capabilities
      const { data, error } = await supabase.functions.invoke('enhanced-ai', {
        body: { 
          message: query,
          sessionId: sessionStorage.getItem('sessionId') || 'anonymous'
        }
      });

      console.log('Enhanced-AI response:', { data, error });

      if (error) throw error;

      const response = data?.response || generateResponse(query);
      const assistantMessageId = "assistant-" + Date.now();
      
      const assistantMessage = {
        role: "assistant" as const,
        content: response,
        id: assistantMessageId,
        animate: true
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Mark message as animated after it appears
      setTimeout(() => {
        setMessageAnimationComplete(prev => ({
          ...prev,
          [assistantMessageId]: true
        }));
      }, 100);

    } catch (error) {
      console.error("Error with enhanced AI:", error);
      // Fallback to local AI
      try {
        const response = generateResponse(query);
        const assistantMessageId = "assistant-" + Date.now();
        
        const assistantMessage = {
          role: "assistant" as const,
          content: response,
          id: assistantMessageId,
          animate: true
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        
        setTimeout(() => {
          setMessageAnimationComplete(prev => ({
            ...prev,
            [assistantMessageId]: true
          }));
        }, 100);
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: "Failed to get response from Mbuya Zivai. Please try again.",
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

  // Determine if we're in the initial empty state
  const isEmptyState = messages.length === 0;

  // Suggested topics based on added knowledge
  const suggestedTopics = [
    { 
      icon: <Database className="mr-2 h-4 w-4 text-indigo-500" />,
      text: "Explain dynamic vs static data structures",
      query: "What's the difference between dynamic and static data structures?"
    },
    { 
      icon: <TreePine className="mr-2 h-4 w-4 text-emerald-500" />,
      text: "Binary Tree operations",
      query: "How do binary tree traversal methods work?"
    },
    { 
      icon: <ShieldCheck className="mr-2 h-4 w-4 text-red-500" />,
      text: "Ethical hacking concepts",
      query: "Tell me about ethical hacking and cybersecurity"
    },
    { 
      icon: <BookCheck className="mr-2 h-4 w-4 text-amber-500" />,
      text: "Take a quiz",
      query: "I want to take a quiz"
    }
  ];

  return (
    <Card className={`w-full h-full max-w-3xl mx-auto bg-gradient-to-br from-background to-secondary/5 shadow-xl transition-all duration-500 ${isExpanded ? 'scale-[1.02]' : 'scale-100'}`}
         onMouseEnter={() => setIsExpanded(true)}
         onMouseLeave={() => setIsExpanded(false)}>
      <CardHeader className="border-b relative">
        <ChatHeader />
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-[calc(80vh-4rem)]">
        {showQuiz ? (
          <QuizComponent onFinish={() => setShowQuiz(false)} category={quizCategory} />
        ) : showQuizAccess ? (
          <QuizAccess onClose={() => setShowQuizAccess(false)} />
        ) : (
          <>
            <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
              {/* Empty state with enhanced animations */}
              {isEmptyState && showWelcome && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fadeIn">
                  <div className="w-24 h-24 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary/60 rounded-full blur-lg opacity-40 animate-pulse"></div>
                    <Bot className="w-full h-full p-4 text-primary relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Welcome to Mbuya Zivai</h3>
                    <p className="text-muted-foreground mb-4">Your wise AI companion for Computer Science knowledge</p>
                  </div>
                </div>
              )}
              
              {/* Quick actions */}
              {showQuickActions && (
                <QuickActions 
                  onActionClick={handleQuickActionClick} 
                  suggestedTopics={suggestedTopics} 
                />
              )}

              {/* Messages */}
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  animate={message.animate}
                  id={message.id}
                />
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-center gap-3 p-4 animate-fadeIn">
                  <div className="relative">
                    <Bot className="w-5 h-5 text-accent" />
                    <div className="absolute inset-0 bg-accent/20 rounded-full blur-sm animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p>Mbuya Zivai is thinking...</p>
                  </div>
                </div>
              )}
              
              {/* Dropdown hint animation */}
              {showDropdownHint && (
                <div className="flex justify-center my-4 animate-pulse">
                  <div className="flex flex-col items-center text-muted-foreground text-sm">
                    <ChevronDown className="h-5 w-5 animate-bounce" />
                    <p>Try asking about advanced topics like binary trees or hacking</p>
                  </div>
                </div>
              )}
              
              {/* Bottom space for better scrolling */}
              <div className="h-2" ref={messageEndRef}></div>
            </ScrollArea>

            {/* Input area */}
            <MessageInput onSendMessage={handleSubmit} isLoading={isLoading} />
          </>
        )}
      </CardContent>

      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </Card>
  );
}
