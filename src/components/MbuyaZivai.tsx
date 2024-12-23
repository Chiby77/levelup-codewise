import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const generateResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Basic pattern matching for common questions
  if (lowercaseInput.includes("who started") || lowercaseInput.includes("history")) {
    return "A Level Computer Science Experts started as a WhatsApp group in Masvingo with Brave Machangu. It grew to accommodate the whole of Zimbabwe with the help of L Chenyika, J Mapasure and T Chibi.";
  }
  
  if (lowercaseInput.includes("programming") || lowercaseInput.includes("code")) {
    return "We offer comprehensive programming tutorials and resources. Check our Downloads page for detailed programming notes divided into 8 parts covering various programming concepts.";
  }
  
  if (lowercaseInput.includes("past papers") || lowercaseInput.includes("exam")) {
    return "We provide access to past papers from 2015 to 2023, including both theory and practical papers. Visit our Downloads page to access these resources.";
  }
  
  if (lowercaseInput.includes("help") || lowercaseInput.includes("support")) {
    return "We offer support through our community of learners and experienced educators. Feel free to ask specific questions about computer science concepts!";
  }
  
  if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi")) {
    return "Maswera sei! I'm Mbuya Zivai, your AI assistant for A Level Computer Science. How can I help you today?";
  }

  // Default response for unmatched patterns
  return "I understand you're asking about computer science. Could you please be more specific about what you'd like to know? I can help with programming concepts, past papers, or general information about our program.";
};

export default function MbuyaZivai() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate a brief delay for more natural interaction
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Chat with Mbuya Zivai</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] mb-4 p-4 border rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "assistant"
                  ? "bg-primary/10 p-3 rounded-lg"
                  : "bg-secondary/10 p-3 rounded-lg"
              }`}
            >
              <p className="font-semibold">
                {message.role === "assistant" ? "Mbuya Zivai" : "You"}:
              </p>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-muted-foreground">
              Mbuya Zivai is thinking...
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Mbuya Zivai anything about computer science..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}