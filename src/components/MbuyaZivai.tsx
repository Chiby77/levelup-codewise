
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
  BookCheck,
  Sparkles,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessage } from "./chat/ChatMessage";
import { MessageInput } from "./chat/MessageInput";
import { QuickActions } from "./chat/QuickActions";
import { QuizComponent } from "./quiz/QuizComponent";
import { QuizAccess } from "./quiz/QuizAccess";
import MotivationalQuotes from "./MotivationalQuotes";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokensRemaining, setTokensRemaining] = useState(10);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Animation states
  const [messageAnimationComplete, setMessageAnimationComplete] = useState<Record<string, boolean>>({});
  const [showQuickActions, setShowQuickActions] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      const userIsAdmin = !!roleData;
      setIsAdmin(userIsAdmin);

      // Load token count for non-admins
      if (!userIsAdmin) {
        const { data: tokenData } = await supabase
          .from('chat_tokens')
          .select('tokens_used, tokens_limit')
          .eq('user_id', user.id)
          .maybeSingle();

        if (tokenData) {
          const remaining = Math.max(0, tokenData.tokens_limit - tokenData.tokens_used);
          setTokensRemaining(remaining);
          console.log('Tokens loaded:', { used: tokenData.tokens_used, limit: tokenData.tokens_limit, remaining });
        } else {
          // No record exists yet, user has full limit
          setTokensRemaining(10);
        }
      }

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
    };

    checkAuth();
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
    // Check authentication
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use Mbuya Zivai",
        variant: "destructive",
      });
      return;
    }

    // Check token limit for non-admins
    if (!isAdmin && tokensRemaining <= 0) {
      toast({
        title: "Message Limit Reached",
        description: "You have used all 10 messages. Contact admin for more.",
        variant: "destructive",
      });
      return;
    }

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
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Increment token usage for non-admins
      if (!isAdmin) {
        const { error: incrementError } = await supabase.rpc('increment_chat_tokens', {
          _user_id: user.id
        });

        if (incrementError) {
          console.error("Error incrementing tokens:", incrementError);
        } else {
          setTokensRemaining(prev => Math.max(0, prev - 1));
        }
      }
      
      // Use enhanced AI with learning capabilities
      const { data, error } = await supabase.functions.invoke('enhanced-ai', {
        body: { 
          message: query,
          sessionId: user.id
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

  // Show auth prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Card className="w-full h-full max-w-4xl mx-auto shadow-2xl border-border/50 overflow-hidden">
        <ChatHeader />
        <CardContent className="flex items-center justify-center h-[calc(80vh-7rem)]">
          <div className="text-center space-y-6 max-w-md p-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Authentication Required</h3>
              <p className="text-muted-foreground">
                Please log in to access Mbuya Zivai and get help with your studies
              </p>
            </div>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-primary hover:bg-primary/90"
            >
              Log In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full max-w-4xl mx-auto shadow-2xl border-border/50 overflow-hidden">
      <ChatHeader />
      
      {/* Token Counter for non-admins */}
      {!isAdmin && (
        <div className="px-6 py-2 border-b border-border/50 bg-primary/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Messages Remaining:</span>
            <span className={`font-semibold ${tokensRemaining <= 3 ? 'text-destructive' : 'text-primary'}`}>
              {tokensRemaining} / 10
            </span>
          </div>
        </div>
      )}
      
      <CardContent className="p-0 flex flex-col h-[calc(80vh-7rem)]">
        {showQuiz ? (
          <QuizComponent onFinish={() => setShowQuiz(false)} category={quizCategory} />
        ) : showQuizAccess ? (
          <QuizAccess onClose={() => setShowQuizAccess(false)} />
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4 bg-gradient-to-b from-background via-primary/5 to-background" ref={scrollRef}>
              {/* Empty state with enhanced animations */}
              {isEmptyState && showWelcome && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fadeIn">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-2xl opacity-30 animate-pulse"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full p-8 shadow-2xl">
                      <Bot className="w-full h-full text-white" />
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                      Welcome to Mbuya Zivai
                    </h3>
                    <p className="text-muted-foreground text-lg max-w-md">
                      Your intelligent AI companion for Computer Science, powered by advanced reasoning
                    </p>
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
                <div className="flex items-start gap-3 mb-6 animate-fadeIn">
                  <div className="flex-shrink-0 mt-1">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-sm opacity-60 animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-full">
                        <Bot className="w-4 h-4 text-white animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-w-[75%] bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl rounded-tl-sm p-4 shadow-lg backdrop-blur-sm border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Loader2 className="h-4 w-4 animate-spin text-accent" />
                      <span className="text-sm text-muted-foreground">Mbuya Zivai is thinking...</span>
                    </div>
                    
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    </div>
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
