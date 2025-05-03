
import { Bot, Clock, Sparkles, User } from "lucide-react";

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
      className={`mb-6 ${
        role === "assistant"
          ? "ml-4 mr-12"
          : "ml-12 mr-4"
      } ${animate ? 'animate-fadeIn' : ''}`}
    >
      <div
        className={`p-4 rounded-lg shadow-sm ${
          role === "assistant"
            ? "bg-primary/5 rounded-tl-none border-l-2 border-accent/50"
            : "bg-secondary/10 rounded-tr-none border-r-2 border-primary/30"
        }`}
      >
        <p className="font-semibold mb-2 flex items-center gap-2">
          {role === "assistant" ? (
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
          
          {role === "assistant" && (
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>just now</span>
            </span>
          )}
        </p>
        <div className="prose-sm max-w-none text-foreground whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
}
