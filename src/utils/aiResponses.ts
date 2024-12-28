import { programmingConcepts } from './responses/programmingConcepts';
import { basicPrograms } from './responses/programming/basicPrograms';
import { algorithms } from './responses/programming/algorithms';
import { universityPrograms } from './responses/universityPrograms';
import { sqlExamples } from './responses/sqlExamples';
import { mentalHealthResponses } from './responses/mentalHealthSupport';
import { networkingConcepts } from './responses/computerScience/networking';
import { flowchartExamples } from './responses/computerScience/flowcharts';

const correctSpelling = (input: string): string => {
  const commonMisspellings: Record<string, string> = {
    'programing': 'programming',
    'flowchart': 'flowchart',
    'databse': 'database',
    'javascript': 'JavaScript',
    'python': 'Python',
    'sql': 'SQL',
  };

  return input.split(' ').map(word => {
    const lowerWord = word.toLowerCase();
    return commonMisspellings[lowerWord] || word;
  }).join(' ');
};

const generateGreeting = (): string => {
  const greetings = [
    "Makorokoto! I'm Mbuya Zivai, your wise tech companion. How may I assist you today? Whether it's programming help, career guidance, or just someone to talk to, I'm here for you. 💫",
    "Mhoro! I'm Mbuya Zivai, and I'm delighted to chat with you. What's on your mind? I can help with coding, career choices, or lend a listening ear if you need one. 🌟",
    "Mangwanani/Masikati/Manheru! I'm your Mbuya Zivai, bringing wisdom from years of tech experience. How can I brighten your day? Whether it's technical help or life advice, I'm here. ✨"
  ];
  
  const hour = new Date().getHours();
  const timeBasedGreeting = hour < 12 ? "Mangwanani" : hour < 18 ? "Masikati" : "Manheru";
  
  let greeting = greetings[Math.floor(Math.random() * greetings.length)];
  greeting = greeting.replace("Mangwanani/Masikati/Manheru", timeBasedGreeting);
  
  return greeting;
};

export const generateResponse = (input: string): string => {
  const correctedInput = correctSpelling(input.toLowerCase());
  
  // Handle health-related queries
  const healthKeywords = ['headache', 'sick', 'pain', 'tired', 'unwell', 'ill'];
  if (healthKeywords.some(keyword => correctedInput.includes(keyword))) {
    return "I'm sorry to hear you're not feeling well. While I can provide general wellness tips, it's important to:\n\n" +
           "1. Take a break from your screen\n" +
           "2. Stay hydrated\n" +
           "3. Consider resting in a quiet, dark room\n" +
           "4. If symptoms persist, please consult a healthcare professional\n\n" +
           "Would you like to take a break from our discussion and resume when you're feeling better?";
  }

  if (/^(hi|hello|hey|greetings|hie)/i.test(input)) {
    return generateGreeting();
  }

  // Handle degree-related queries
  const degreeKeywords = ['degree', 'course', 'study', 'university', 'college'];
  if (degreeKeywords.some(keyword => correctedInput.includes(keyword))) {
    // Check for specific degrees in universityPrograms
    for (const [program, details] of Object.entries(universityPrograms)) {
      if (correctedInput.includes(program) || 
          (correctedInput.includes("computer") && correctedInput.includes("science")) ||
          (correctedInput.includes("it") && correctedInput.includes("degree"))) {
        return `${details.description}\n\nOffered at:\n${details.universities.join("\n")}\n\nEntry Requirements:\n${details.requirements}\n\nPotential Career Paths:\n${details.careerPaths.join("\n")}`;
      }
    }
    
    // General response for degree inquiries
    return "A degree in Computer Science or Information Technology offers excellent career prospects! Here's what you should know:\n\n" +
           "1. High demand in job market\n" +
           "2. Competitive salaries\n" +
           "3. Diverse career paths (Software Development, AI, Cybersecurity, etc.)\n" +
           "4. Opportunities for innovation and entrepreneurship\n\n" +
           "Would you like specific information about:\n" +
           "- BSc Computer Science\n" +
           "- BTech Information Technology\n" +
           "- Bachelor of Engineering\n" +
           "Just ask about any of these programs!";
  }

  if (correctedInput.includes('flowchart')) {
    const flowchartInfo = flowchartExamples.basic;
    return `${flowchartInfo.explanation}\n\nFlowchart Symbols:\n${Object.entries(flowchartInfo.symbols).map(([symbol, desc]) => `${symbol}: ${desc}`).join('\n')}\n\n${flowchartInfo.example}`;
  }

  if (correctedInput.includes('tcp/ip') || correctedInput.includes('dns')) {
    for (const [concept, details] of Object.entries(networkingConcepts)) {
      if (correctedInput.includes(concept)) {
        let response = details.explanation;
        if (details.example) {
          response += `\n\nExample:\n${details.example}`;
        }
        if (details.components) {
          response += `\n\nKey Components:\n${details.components.join('\n')}`;
        }
        return response;
      }
    }
  }

  const mentalHealthKeywords = ['depressed', 'depression', 'anxiety', 'stressed', 'stress', 'overwhelmed', 'suicide', 'help'];
  if (mentalHealthKeywords.some(keyword => correctedInput.includes(keyword))) {
    for (const [condition, response] of Object.entries(mentalHealthResponses)) {
      if (correctedInput.includes(condition)) {
        return `${response.message}\n\nHere are some resources that might help:\n${response.resources.join('\n')}\n\n${response.followUp}`;
      }
    }
  }

  if (correctedInput.includes('sql') || correctedInput.includes('database') || correctedInput.includes('query')) {
    for (const [command, details] of Object.entries(sqlExamples)) {
      if (correctedInput.includes(command)) {
        return `Here's how to use the ${command.toUpperCase()} command in SQL:\n\n${details.query}\n\n${details.explanation}`;
      }
    }
  }

  if (correctedInput.includes("program") || correctedInput.includes("code") || correctedInput.includes("write")) {
    for (const [program, details] of Object.entries(basicPrograms)) {
      if (correctedInput.includes(program)) {
        if (correctedInput.includes("python")) {
          return `Here's a ${program} program in Python:\n\n${details.python}\n\n${details.explanation}`;
        }
        if (correctedInput.includes("visual basic") || correctedInput.includes("vb")) {
          return `Here's a ${program} program in Visual Basic:\n\n${details.visualBasic}\n\n${details.explanation}`;
        }
        return `Here are examples of a ${program} program:\n\nPython:\n${details.python}\n\nVisual Basic:\n${details.visualBasic}\n\n${details.explanation}`;
      }
    }
    
    return "I can help you with programming tasks! Here are some examples I can provide:\n" +
           "1. Calculator program\n" +
           "2. Temperature converter\n" +
           "\nJust ask for a specific program in Python or Visual Basic, for example:\n" +
           "- 'Write a calculator program in Python'\n" +
           "- 'Show me a temperature converter in Visual Basic'\n" +
           "- 'Create a Fibonacci sequence program'\n" +
           "- 'How to find prime numbers in Python'";
  }

  for (const [concept, details] of Object.entries(programmingConcepts)) {
    if (correctedInput.includes(concept)) {
      if (correctedInput.includes("python")) {
        return `${details.explanation}\n\nHere's how to use it in Python:\n${details.python}`;
      }
      if (correctedInput.includes("visual basic") || correctedInput.includes("vb")) {
        return `${details.explanation}\n\nHere's how to use it in Visual Basic:\n${details.visualBasic}`;
      }
      return `${details.explanation}\n\nPython Example:\n${details.python}\n\nVisual Basic Example:\n${details.visualBasic}`;
    }
  }

  return "Welcome to our comprehensive tech education platform! I'm Mbuya Zivai, your AI assistant. I can help you with:\n\n" +
         "1. Programming tasks and examples in Python and Visual Basic\n" +
         "2. SQL database queries and commands\n" +
         "3. Career guidance for tech-related degrees\n" +
         "4. Mental health support and counseling\n" +
         "5. University programs in Zimbabwe\n\n" +
         "How can I assist you today? Feel free to:\n" +
         "- Ask for programming help (e.g., 'Write a calculator program')\n" +
         "- Learn about SQL (e.g., 'How to use JOIN in SQL')\n" +
         "- Get career advice (e.g., 'Tell me about BSc Computer Science at NUST')\n" +
         "- Discuss any concerns - I'm here to listen and support you";
};
