
import { useState, useRef, FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChevronDown, Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
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
  );
}
