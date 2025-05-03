
/**
 * Greeting generator for the AI assistant
 */

/**
 * Generates a culturally appropriate greeting based on time of day
 */
export const generateGreeting = (): string => {
  const hour = new Date().getHours();
  const timeBasedGreeting = hour < 12 ? "Mangwanani" : hour < 18 ? "Masikati" : "Manheru";
  
  const greetings = [
    `${timeBasedGreeting}! I'm Mbuya Zivai, your wise tech companion. 🌟 I can help with computer science topics from basic programming to advanced concepts. Ask me about the Fetch-Decode-Execute cycle, OSI model, data structures, algorithms, database theory, or programming in Visual Basic!`,
    `${timeBasedGreeting}! I'm Mbuya Zivai, and I'm delighted to chat with you. 💫 As a grandmother figure in the tech world, I love sharing knowledge about computer architecture, networking protocols, algorithms, database systems, or numerical errors. What would you like to learn today?`,
    `${timeBasedGreeting}! *adjusts reading glasses* I'm your Mbuya Zivai, bringing years of tech wisdom to our chat. ✨ Whether you need help understanding logic gates, interrupts, ethical considerations in computing, or Visual Basic programming, I'm here to assist!`,
    `${timeBasedGreeting}! I'm Mbuya Zivai, your AI guide for all things Computer Science. 🎓 I specialize in explaining A-Level concepts, university programs, and career paths. What can I help you discover today?`,
    `${timeBasedGreeting}! I'm Mbuya Zivai, your knowledge keeper. 📚 I can help with everything from binary trees and data structures to ethical hacking and intellectual property concepts. What area of tech would you like to explore?`
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
};
