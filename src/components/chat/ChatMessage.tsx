import { Bot, Sparkles, User } from "lucide-react";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string;
  animate?: boolean;
  id: string;
}

export function ChatMessage({ role, content, animate, id }: ChatMessageProps) {
  return (
    <div
      key={id}
      className={`mb-6 flex gap-3 ${
        role === "assistant" ? "justify-start" : "justify-end"
      } ${animate ? 'animate-fadeIn' : ''}`}
    >
      {role === "assistant" && (
        <div className="flex-shrink-0 mt-1">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-sm opacity-60"></div>
            <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-full">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <Sparkles className="absolute -top-0.5 -right-0.5 w-3 h-3 text-yellow-400 animate-pulse" />
          </div>
        </div>
      )}
      
      <div
        className={`max-w-[75%] ${
          role === "assistant"
            ? "bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl rounded-tl-sm"
            : "bg-gradient-to-br from-secondary/20 to-primary/10 rounded-2xl rounded-tr-sm"
        } p-4 shadow-lg backdrop-blur-sm border border-border/50`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-semibold ${
            role === "assistant" 
              ? "text-primary" 
              : "text-foreground"
          }`}>
            {role === "assistant" ? "Mbuya Zivai" : "You"}
          </span>
          {role === "assistant" && (
            <span className="text-xs text-muted-foreground bg-accent/10 px-2 py-0.5 rounded-full">
              AI
            </span>
          )}
        </div>
        
        <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>
      
      {role === "user" && (
        <div className="flex-shrink-0 mt-1">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-full">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
