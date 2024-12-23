import { useEffect, useState } from "react";

const quotes = [
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay"
  },
  {
    text: "Programming isn't about what you know; it's about what you can figure out.",
    author: "Chris Pine"
  },
  {
    text: "The only way to learn a new programming language is by writing programs in it.",
    author: "Dennis Ritchie"
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  }
];

const QuoteRotator = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-24 flex items-center justify-center">
      <div 
        key={currentQuote}
        className="text-white/90 max-w-2xl text-center animate-fadeIn"
      >
        <p className="text-lg italic mb-2">{quotes[currentQuote].text}</p>
        <p className="text-sm">- {quotes[currentQuote].author}</p>
      </div>
    </div>
  );
};

export default QuoteRotator;