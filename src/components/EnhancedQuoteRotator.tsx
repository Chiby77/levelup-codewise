
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
  },
  {
    text: "The art of programming is the skill of controlling complexity.",
    author: "Marijn Haverbeke"
  },
  {
    text: "Computer science is no more about computers than astronomy is about telescopes.",
    author: "Edsger W. Dijkstra"
  }
];

const EnhancedQuoteRotator = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const transitionClass = prefersReducedMotion 
    ? "" 
    : `transition-all duration-500 ${isTransitioning ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"}`;

  return (
    <>
      <div className="h-24 flex items-center justify-center">
        <div className={`text-white/90 max-w-2xl text-center ${transitionClass}`}>
          <p className="text-lg md:text-xl italic mb-2 text-glow">{quotes[currentQuote].text}</p>
          <p className="text-sm md:text-base">- {quotes[currentQuote].author}</p>
        </div>
      </div>

      <style>
        {`
          .text-glow {
            text-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
          }
        `}
      </style>
    </>
  );
};

export default EnhancedQuoteRotator;
