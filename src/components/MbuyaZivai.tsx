import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import { generateResponse } from "@/utils/aiResponses";
import { MessageCircle, Send, Bot } from "lucide-react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function MbuyaZivai() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = generateResponse(input);
      const assistantMessage = {
        role: "assistant" as const,
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
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

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-background to-secondary/5">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Bot className="w-8 h-8 text-primary" />
          <span>Chat with Mbuya Zivai</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea 
          ref={scrollRef}
          className="h-[500px] p-4"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground">
              <MessageCircle className="w-12 h-12" />
              <p className="text-lg">Welcome! Ask me anything about:</p>
              <ul className="space-y-2">
                <li>• Programming in Python or Visual Basic</li>
                <li>• Programming concepts and theory</li>
                <li>• Career guidance in tech</li>
                <li>• University programs in Zimbabwe</li>
              </ul>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 animate-fadeIn ${
                message.role === "assistant"
                  ? "ml-4 mr-12"
                  : "ml-12 mr-4"
              }`}
            >
              <div
                className={`p-4 rounded-lg ${
                  message.role === "assistant"
                    ? "bg-primary/10 rounded-tl-none"
                    : "bg-secondary/10 rounded-tr-none"
                }`}
              >
                <p className="font-semibold mb-2 flex items-center gap-2">
                  {message.role === "assistant" ? (
                    <>
                      <Bot className="w-4 h-4" />
                      <span>Mbuya Zivai</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>You</span>
                    </>
                  )}
                </p>
                <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center p-4 text-muted-foreground">
              <span className="animate-pulse">Mbuya Zivai is thinking...</span>
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about programming, careers, or university programs..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="w-4 h-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}