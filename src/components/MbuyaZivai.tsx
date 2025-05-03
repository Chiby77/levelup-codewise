
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import { generateResponse, generateGreeting } from "@/utils/aiResponses";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  Heart, 
  Code, 
  School, 
  Database, 
  Brain, 
  Sparkles,
  Award,
  ArrowRight,
  Loader2,
  User,
  ChevronDown,
  GraduationCap,
  NetworkIcon,
  BookOpenCheck,
  ShieldCheck,
  Clock,
  TreePine
} from "lucide-react";

interface Message {
  role: "assistant" | "user";
  content: string;
  id: string;
  animate?: boolean;
}

export default function MbuyaZivai() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDropdownHint, setShowDropdownHint] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Animation states
  const [messageAnimationComplete, setMessageAnimationComplete] = useState<Record<string, boolean>>({});
  const [showQuickActions, setShowQuickActions] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const initialGreeting = generateGreeting();
      setMessages([{
        role: "assistant",
        content: initialGreeting,
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

  const handleSubmit = async (e: React.FormEvent, predefinedQuery?: string) => {
    e.preventDefault();
    const query = predefinedQuery || input;
    if (!query.trim()) return;

    setShowWelcome(false);
    setShowQuickActions(false);
    const userMessage = { 
      role: "user" as const, 
      content: query,
      id: "user-" + Date.now()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate processing delay for better UX
      const processingTime = Math.floor(Math.random() * 400) + 800;
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      const response = generateResponse(query);
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
      toast({
        title: "Error",
        description: "Failed to get response from Mbuya Zivai. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickActionClick = (query: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    handleSubmit(e as unknown as React.FormEvent, query);
  };

  const focusInput = () => {
    inputRef.current?.focus();
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
      icon: <BookOpenCheck className="mr-2 h-4 w-4 text-amber-500" />,
      text: "Intellectual property types",
      query: "Explain different types of intellectual property"
    }
  ];

  return (
    <Card className={`w-full h-full max-w-3xl mx-auto bg-gradient-to-br from-background to-secondary/5 shadow-xl transition-all duration-500 ${isExpanded ? 'scale-[1.02]' : 'scale-100'}`}
         onMouseEnter={() => setIsExpanded(true)}
         onMouseLeave={() => setIsExpanded(false)}>
      <CardHeader className="border-b relative">
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-accent/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        
        <CardTitle className="flex items-center gap-2 text-2xl group">
          <div className="relative">
            <Bot className="w-8 h-8 text-primary z-10 relative" />
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-sm animate-pulse"></div>
          </div>
          <span>Chat with Mbuya Zivai</span>
          <Heart className="w-5 h-5 text-red-500 ml-2 animate-heartbeat" />
        </CardTitle>
        <CardDescription className="text-muted-foreground flex items-center gap-2">
          <span>Your wise AI guide to Computer Science and programming knowledge</span>
          <GraduationCap className="w-4 h-4 text-accent animate-bounce" style={{ animationDuration: "2s" }} />
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-[calc(80vh-4rem)]">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 animate-fadeIn [animation-delay:500ms]">
              <h4 className="text-sm font-semibold text-muted-foreground col-span-full mb-1">Popular topics:</h4>
              
              <Button 
                variant="outline" 
                className="justify-start group hover:bg-accent/10 border-dashed" 
                onClick={handleQuickActionClick("Tell me about Computer Science degrees in Zimbabwe")}
              >
                <Award className="mr-2 h-4 w-4 text-accent" />
                <span>Computer Science degrees</span>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start group hover:bg-accent/10 border-dashed" 
                onClick={handleQuickActionClick("Explain the OSI model")}
              >
                <NetworkIcon className="mr-2 h-4 w-4 text-accent" />
                <span>OSI network model</span>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start group hover:bg-accent/10 border-dashed" 
                onClick={handleQuickActionClick("Write a calculator program in Python")}
              >
                <Code className="mr-2 h-4 w-4 text-accent" />
                <span>Python calculator example</span>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start group hover:bg-accent/10 border-dashed" 
                onClick={handleQuickActionClick("Explain data structures")}
              >
                <Brain className="mr-2 h-4 w-4 text-accent" />
                <span>Data structures</span>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              
              {/* New suggested topics based on added knowledge */}
              <h4 className="text-sm font-semibold text-muted-foreground col-span-full mt-4 mb-1">
                Advanced topics:
              </h4>
              
              {suggestedTopics.map((topic, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="justify-start group hover:bg-accent/10 border-dashed" 
                  onClick={handleQuickActionClick(topic.query)}
                >
                  {topic.icon}
                  <span>{topic.text}</span>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              ))}
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`mb-6 ${
                message.role === "assistant"
                  ? "ml-4 mr-12"
                  : "ml-12 mr-4"
              } ${message.animate ? 'animate-fadeIn' : ''}`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div
                className={`p-4 rounded-lg shadow-sm ${
                  message.role === "assistant"
                    ? "bg-primary/5 rounded-tl-none border-l-2 border-accent/50"
                    : "bg-secondary/10 rounded-tr-none border-r-2 border-primary/30"
                }`}
              >
                <p className="font-semibold mb-2 flex items-center gap-2">
                  {message.role === "assistant" ? (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Bot className="w-5 h-5 text-accent" />
                        <span className="absolute -bottom-1 -right-1">
                          <Sparkles className="w-3 h-3 text-yellow-400" />
                        </span>
                      </div>
                      <span>Mbuya Zivai</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-primary/10">
                        <User className="w-3 h-3" />
                      </div>
                      <span>You</span>
                    </div>
                  )}
                  
                  {message.role === "assistant" && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>just now</span>
                    </span>
                  )}
                </p>
                <div className="prose-sm max-w-none text-foreground whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
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

        {/* Input area with enhanced animations */}
        <div className="p-4 border-t border-border relative" onClick={focusInput}>
          <form onSubmit={handleSubmit} className="flex gap-2 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about programming, computer science, degrees, or share your concerns..."
              disabled={isLoading}
              className="flex-1 pl-4 pr-10 py-3 bg-background/50 backdrop-blur-sm border-border focus:ring-2 focus:ring-accent/25"
            />
            <div className="absolute right-14 top-1/2 -translate-y-1/2 text-muted-foreground">
              <ChevronDown className="h-4 w-4" />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="relative overflow-hidden group"
            >
              <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
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
