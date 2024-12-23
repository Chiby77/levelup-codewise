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
  
  // Programming-related responses
  if (lowercaseInput.includes("python") || lowercaseInput.includes("visual basic")) {
    if (lowercaseInput.includes("loop") || lowercaseInput.includes("for") || lowercaseInput.includes("while")) {
      if (lowercaseInput.includes("python")) {
        return `In Python, you can use loops like this:

For loop:
for i in range(5):
    print(i)

While loop:
i = 0
while i < 5:
    print(i)
    i += 1`;
      } else {
        return `In Visual Basic, you can use loops like this:

For loop:
For i As Integer = 0 To 4
    Console.WriteLine(i)
Next

While loop:
Dim i As Integer = 0
While i < 5
    Console.WriteLine(i)
    i += 1
End While`;
      }
    }

    if (lowercaseInput.includes("array") || lowercaseInput.includes("list")) {
      if (lowercaseInput.includes("python")) {
        return `In Python, you can work with lists like this:

# Create a list
numbers = [1, 2, 3, 4, 5]

# Add an item
numbers.append(6)

# Access an item
print(numbers[0])

# Loop through list
for num in numbers:
    print(num)`;
      } else {
        return `In Visual Basic, you can work with arrays like this:

' Declare and initialize array
Dim numbers() As Integer = {1, 2, 3, 4, 5}

' Access an element
Console.WriteLine(numbers(0))

' Loop through array
For Each num As Integer In numbers
    Console.WriteLine(num)
Next`;
      }
    }

    if (lowercaseInput.includes("function") || lowercaseInput.includes("sub")) {
      if (lowercaseInput.includes("python")) {
        return `In Python, you can create functions like this:

def greet(name):
    return f"Hello, {name}!"

# Call the function
message = greet("John")
print(message)`;
      } else {
        return `In Visual Basic, you can create functions and subs like this:

' Function (returns a value)
Function Greet(name As String) As String
    Return "Hello, " & name & "!"
End Function

' Sub (doesn't return a value)
Sub PrintGreeting(name As String)
    Console.WriteLine("Hello, " & name & "!")
End Sub`;
      }
    }

    if (lowercaseInput.includes("if") || lowercaseInput.includes("condition")) {
      if (lowercaseInput.includes("python")) {
        return `In Python, you can use conditional statements like this:

age = 18
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teenager")
else:
    print("Child")`;
      } else {
        return `In Visual Basic, you can use conditional statements like this:

Dim age As Integer = 18
If age >= 18 Then
    Console.WriteLine("Adult")
ElseIf age >= 13 Then
    Console.WriteLine("Teenager")
Else
    Console.WriteLine("Child")
End If`;
      }
    }
  }
  
  // Keep existing general responses
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
    return "I can help you with Python and Visual Basic programming questions, as well as general computer science concepts. Feel free to ask specific questions!";
  }
  
  if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi")) {
    return "Maswera sei! I'm Mbuya Zivai, your AI assistant for A Level Computer Science. I can help you with Python and Visual Basic programming, as well as general computer science concepts. How can I help you today?";
  }

  // Default response
  return "I can help you with Python and Visual Basic programming, as well as general information about our program. Could you please be more specific about what you'd like to know?";
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
