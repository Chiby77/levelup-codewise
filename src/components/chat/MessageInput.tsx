import { useState, useRef, FormEvent } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send, Sparkles } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 border-t border-border/50 bg-gradient-to-r from-background via-primary/5 to-background backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about computer science, programming, or share your thoughts..."
            disabled={isLoading}
            rows={2}
            className="resize-none pr-12 bg-background/80 backdrop-blur-sm border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/25 rounded-xl transition-all"
          />
          <div className="absolute right-3 bottom-3 text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent/50" />
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim()} 
          size="lg"
          className="relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-105 rounded-xl px-6 shadow-lg"
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
      
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
