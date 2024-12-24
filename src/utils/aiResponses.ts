import { programmingConcepts } from './responses/programmingConcepts';
import { practicalExamples } from './responses/practicalExamples';
import { universityPrograms } from './responses/universityPrograms';

export const generateResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Check for programming task requests
  if (lowercaseInput.includes("program") || lowercaseInput.includes("code") || lowercaseInput.includes("write")) {
    // Check for specific program requests
    for (const [program, details] of Object.entries(practicalExamples)) {
      if (lowercaseInput.includes(program)) {
        if (lowercaseInput.includes("python")) {
          return `Here's a ${program} program in Python:\n\n${details.python}\n\n${details.explanation}`;
        }
        if (lowercaseInput.includes("visual basic") || lowercaseInput.includes("vb")) {
          return `Here's a ${program} program in Visual Basic:\n\n${details.visualBasic}\n\n${details.explanation}`;
        }
        return `Here are examples of a ${program} program:\n\nPython:\n${details.python}\n\nVisual Basic:\n${details.visualBasic}\n\n${details.explanation}`;
      }
    }
    
    // If no specific program is found, provide a list of available examples
    return "I can help you with programming tasks! Here are some examples I can provide:\n" +
           "1. Calculator program\n" +
           "2. Temperature converter\n" +
           "3. Fibonacci sequence generator\n" +
           "4. Prime numbers finder\n" +
           "\nJust ask for a specific program in Python or Visual Basic, for example:\n" +
           "- 'Write a calculator program in Python'\n" +
           "- 'Show me a temperature converter in Visual Basic'\n" +
           "- 'Create a Fibonacci sequence program'\n" +
           "- 'How to find prime numbers in Python'";
  }

  // Check for programming concepts
  for (const [concept, details] of Object.entries(programmingConcepts)) {
    if (lowercaseInput.includes(concept)) {
      if (lowercaseInput.includes("python")) {
        return `${details.explanation}\n\nHere's how to use it in Python:\n${details.python}`;
      }
      if ((lowercaseInput.includes("visual basic") || lowercaseInput.includes("vb"))) {
        return `${details.explanation}\n\nHere's how to use it in Visual Basic:\n${details.visualBasic}`;
      }
      return `${details.explanation}\n\nPython Example:\n${details.python}\n\nVisual Basic Example:\n${details.visualBasic}`;
    }
  }

  // Check for university programs and career guidance
  for (const [program, details] of Object.entries(universityPrograms)) {
    if (lowercaseInput.includes(program) || 
        (lowercaseInput.includes("degree") && lowercaseInput.includes(program.split(" ")[0]))) {
      return `${details.description}\n\nOffered at:\n${details.universities.join("\n")}\n\nEntry Requirements:\n${details.requirements}\n\nPotential Career Paths:\n${details.careerPaths.join("\n")}`;
    }
  }

  // Default response
  return "I can help you with:\n" +
         "1. Programming tasks and examples\n" +
         "2. Programming concepts\n" +
         "3. Career guidance\n" +
         "4. University programs in Zimbabwe\n\n" +
         "Try asking for:\n" +
         "- Specific programming examples (e.g., 'Write a calculator program')\n" +
         "- Programming concepts (e.g., 'Explain if statement')\n" +
         "- University programs (e.g., 'Tell me about BSc Computer Science at NUST')";
};