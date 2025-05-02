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

// Define new CS topics for Mbuya Zivai
const csTopics = {
  fetchDecodeExecute: {
    topic: "Fetch-Decode-Execute Cycle",
    explanation: `The Fetch-Decode-Execute cycle is the fundamental operation cycle of a CPU:

1. Fetch: The CPU retrieves the next instruction from memory using the Program Counter (PC)
2. Decode: The Control Unit interprets the instruction to determine the required operation
3. Execute: The Arithmetic Logic Unit (ALU) performs the actual computation or data manipulation
4. Update: The Program Counter is incremented to point to the next instruction

This cycle repeats continuously as the computer runs programs, with each cycle handling one machine instruction.`
  },
  logicGates: {
    topic: "Logic Gates",
    explanation: `Logic gates are fundamental building blocks of digital circuits that implement Boolean functions:

• AND gate: Output is 1 only when all inputs are 1
• OR gate: Output is 1 if at least one input is 1
• NOT gate: Inverts the input (1 becomes 0, 0 becomes 1)
• NAND gate: Combination of AND followed by NOT
• NOR gate: Combination of OR followed by NOT
• XOR gate: Output is 1 when inputs are different

These gates are combined to create complex digital circuits for arithmetic operations, memory storage, and control logic in computers.`
  },
  interrupts: {
    topic: "Interrupts",
    explanation: `Interrupts are signals that temporarily halt the normal execution of a program to handle higher-priority events:

1. Interrupt Generation: External device or internal condition triggers an interrupt
2. CPU Completion: CPU finishes current instruction
3. State Saving: CPU saves its current state (registers, PC) to the stack
4. Interrupt Handling: CPU executes the Interrupt Service Routine (ISR) for that interrupt
5. State Restoration: After completion, the CPU restores its previous state
6. Resume Execution: Normal program execution continues

Interrupts improve system efficiency by allowing the CPU to respond to events without constant polling.`
  },
  numericalErrors: {
    topic: "Numerical Errors",
    explanation: `Two common numerical errors in computer systems:

• Overflow Error: Occurs when a computation produces a result too large for the allocated memory space. For example, trying to store 300 in an 8-bit unsigned integer (max 255) causes overflow.

• Underflow Error: Occurs when a floating-point number becomes too small to be represented, typically resulting in the value being rounded to zero. This happens with very small decimal numbers beyond the precision limit.

These errors can cause critical system failures if not properly handled through exception handling or boundary checks.`
  },
  databaseTheory: {
    topic: "Database Theory",
    explanation: `Relational database theory is built on these key concepts:

• Tables (Relations): Collections of rows and columns that store related data
• Primary Keys: Unique identifiers for each row in a table
• Foreign Keys: Fields that link to primary keys in other tables
• Normalization: The process of organizing data to minimize redundancy (1NF, 2NF, 3NF)
• SQL (Structured Query Language): The standard language for database operations:
  - SELECT: Retrieve data
  - INSERT: Add new records
  - UPDATE: Modify existing records
  - DELETE: Remove records
  - JOIN: Combine data from multiple tables

Proper database design ensures data integrity, reduces redundancy, and improves query performance.`
  },
  osiModel: {
    topic: "OSI Model",
    explanation: `The OSI (Open Systems Interconnection) model has seven layers:

1. Physical Layer: Transmits raw bit stream over physical medium (cables, electrical signals)
2. Data Link Layer: Provides node-to-node data transfer (MAC addresses, error detection)
3. Network Layer: Handles routing and forwarding of data packets (IP addresses)
4. Transport Layer: Provides end-to-end communication services (TCP, UDP)
5. Session Layer: Manages communication sessions between applications
6. Presentation Layer: Translates data format between applications (encryption, compression)
7. Application Layer: Interfaces directly with end-user applications (HTTP, FTP, SMTP)

The TCP/IP model is a simplified version with four layers: Network Interface, Internet, Transport, and Application.`
  },
  dataStructures: {
    topic: "Data Structures",
    explanation: `Key data structures in computer science:

• Arrays: Fixed-size sequential collection of elements accessed by index
• Linked Lists: Dynamic collection of elements with pointers to the next element
• Stacks: LIFO (Last-In-First-Out) structure with push and pop operations
• Queues: FIFO (First-In-First-Out) structure with enqueue and dequeue operations
• Trees: Hierarchical structure with nodes and branches (Binary, AVL, B-trees)
• Graphs: Collections of nodes (vertices) connected by edges

Algorithm complexity is measured using Big O notation:
• O(1): Constant time (direct access)
• O(log n): Logarithmic time (binary search)
• O(n): Linear time (simple iteration)
• O(n log n): Log-linear time (efficient sorting algorithms)
• O(n²): Quadratic time (nested loops)
• O(2ⁿ): Exponential time (recursive algorithms)`
  },
  computerSecurity: {
    topic: "Computer Security and Ethics",
    explanation: `Computer security is built on three key principles:

• Confidentiality: Protecting information from unauthorized access
• Integrity: Ensuring data remains accurate and unaltered
• Availability: Maintaining reliable access to information

Ethical considerations in computing include:
• Privacy: Respecting individuals' personal information
• Intellectual Property: Honoring copyright and licensing
• Professional Conduct: Following codes of ethics
• Social Impact: Considering the broader effects of technology
• Cybersecurity Responsibility: Protecting systems and data

Security breaches can lead to data theft, financial loss, identity theft, and damage to reputation.`
  },
  visualBasic: {
    topic: "Visual Basic Programming",
    explanation: `Visual Basic programming fundamentals:

• Syntax: Based on BASIC with modern structured programming features
• Data Types: Integer, String, Double, Boolean, Date, Object
• Variables: Dim variableName As DataType
• Control Structures:
  - If/Then/Else for conditional execution
  - For/Next for counted loops
  - Do/Loop for conditional loops
  - Select Case for multiple conditions
• Event-Driven Programming: Code responds to user actions (clicks, inputs)
• Forms and Controls: Visual elements like buttons, textboxes that users interact with
• Procedures:
  - Sub procedures (no return value)
  - Function procedures (returns a value)

VB is particularly useful for building Windows applications with GUIs and database connectivity.`
  }
};

export const generateGreeting = (): string => {
  const hour = new Date().getHours();
  const timeBasedGreeting = hour < 12 ? "Mangwanani" : hour < 18 ? "Masikati" : "Manheru";
  
  const greetings = [
    `${timeBasedGreeting}! I'm Mbuya Zivai, your wise tech companion. 🌟 I can help with computer science topics from basic programming to advanced concepts. Ask me about the Fetch-Decode-Execute cycle, OSI model, data structures, algorithms, database theory, or programming in Visual Basic!`,
    `${timeBasedGreeting}! I'm Mbuya Zivai, and I'm delighted to chat with you. 💫 As a grandmother figure in the tech world, I love sharing knowledge about computer architecture, networking protocols, algorithms, database systems, or numerical errors. What would you like to learn today?`,
    `${timeBasedGreeting}! *adjusts reading glasses* I'm your Mbuya Zivai, bringing years of tech wisdom to our chat. ✨ Whether you need help understanding logic gates, interrupts, ethical considerations in computing, or Visual Basic programming, I'm here to assist!`
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
};

export const generateResponse = (input: string): string => {
  const correctedInput = correctSpelling(input.toLowerCase());
  
  // Check for CS topics from our new definitions
  if (correctedInput.includes('fetch') || correctedInput.includes('cycle') || correctedInput.includes('execute')) {
    return csTopics.fetchDecodeExecute.explanation;
  }
  
  if (correctedInput.includes('logic gate')) {
    return csTopics.logicGates.explanation;
  }
  
  if (correctedInput.includes('interrupt')) {
    return csTopics.interrupts.explanation;
  }
  
  if (correctedInput.includes('overflow') || correctedInput.includes('underflow') || 
      correctedInput.includes('numerical error')) {
    return csTopics.numericalErrors.explanation;
  }
  
  if (correctedInput.includes('database') || correctedInput.includes('sql') || 
      correctedInput.includes('relational')) {
    return csTopics.databaseTheory.explanation;
  }
  
  if (correctedInput.includes('osi') || correctedInput.includes('networking') || 
      correctedInput.includes('network model')) {
    return csTopics.osiModel.explanation;
  }
  
  if (correctedInput.includes('data structure') || correctedInput.includes('algorithm') || 
      correctedInput.includes('big o')) {
    return csTopics.dataStructures.explanation;
  }
  
  if (correctedInput.includes('security') || correctedInput.includes('ethics') || 
      correctedInput.includes('ethical')) {
    return csTopics.computerSecurity.explanation;
  }
  
  if (correctedInput.includes('visual basic') || correctedInput.includes('vb') || 
      correctedInput.includes('vba')) {
    return csTopics.visualBasic.explanation;
  }

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

  return "Welcome! I'm Mbuya Zivai, your AI assistant for computer science topics. I can help with:\n\n" +
         "1. Computer Architecture: Fetch-Decode-Execute cycle, logic gates, interrupts\n" +
         "2. Numerical Errors: Overflow and underflow explanations\n" +
         "3. Database Systems: Relational model, SQL, normalization\n" +
         "4. Computer Networking: OSI model, TCP/IP, protocols\n" +
         "5. Visual Basic Programming: Syntax, event-driven programming\n" +
         "6. Computer Security and Ethics: Principles and considerations\n" +
         "7. Algorithms and Data Structures: Common implementations and complexity\n\n" +
         "What topic would you like to explore today?";
};
