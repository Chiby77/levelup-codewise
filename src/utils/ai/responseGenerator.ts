
import { csTopics } from './topics/computerScience';
import { detailedDegreeInfo } from './topics/education';
import { programmingConcepts } from '../responses/programmingConcepts';
import { basicPrograms } from '../responses/programming/basicPrograms';
import { algorithms } from '../responses/programming/algorithms';
import { universityPrograms } from '../responses/universityPrograms';
import { sqlExamples } from '../responses/sqlExamples';
import { mentalHealthResponses } from '../responses/mentalHealthSupport';
import { networkingConcepts } from '../responses/computerScience/networking';
import { flowchartExamples } from '../responses/computerScience/flowcharts';
import { correctInput } from './textProcessing';

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

export const generateResponse = (input: string): string => {
  // Process input to handle broken English and spelling mistakes
  const processedInput = correctInput(input.toLowerCase());
  
  // Check for CS topics from our definitions
  for (const [key, topic] of Object.entries(csTopics)) {
    if (processedInput.includes(key) || 
        topic.keywords?.some(keyword => processedInput.includes(keyword))) {
      return topic.explanation;
    }
  }

  // Enhanced degree information handling
  if (processedInput.includes('degree') || 
      processedInput.includes('university') || 
      processedInput.includes('college') || 
      processedInput.includes('study') || 
      processedInput.includes('course')) {
    
    // Check for specific degree inquiries
    if (processedInput.includes('computer science') || processedInput.includes('comp sci') || processedInput.includes('cs degree')) {
      const university = processedInput.includes('nust') ? 'NUST' : 
                       processedInput.includes('uz') ? 'UZ' : 
                       processedInput.includes('hit') ? 'HIT' : null;
      
      if (university && detailedDegreeInfo["bsc computer science"][university]) {
        const info = detailedDegreeInfo["bsc computer science"][university];
        return `**BSc Computer Science at ${university}**\n\n${info.description}\n\n**Entry Requirements:**\n${info.entry_requirements}\n\n**Duration:**\n${info.duration}\n\n**Key Courses:**\n${info.key_courses.join('\n')}\n\n**Career Paths:**\n${info.career_paths.join('\n')}\n\n**Contact:**\n${info.contact ?? 'Information not available'}\n\n**Campus Location:**\n${info.location ?? 'Information not available'}\n\n**Campus Facilities:**\n${info.campus_facilities?.join('\n') ?? 'Information not available'}\n\n**International Options:**\n${info.international_options ?? 'Information not available'}\n\n**Scholarships:**\n${info.scholarships ?? 'Information not available'}`;
      }
      
      // General info about Computer Science degree
      return `**BSc Computer Science in Zimbabwe**\n\nA Bachelor of Science in Computer Science is offered at several universities in Zimbabwe, including NUST, UZ, and HIT. The program typically spans 4 years and covers programming, algorithms, databases, software engineering, and specialized areas like AI and networking.\n\n**Where to Study:**\n- National University of Science and Technology (NUST) - Bulawayo\n- University of Zimbabwe (UZ) - Harare\n- Harare Institute of Technology (HIT) - Harare\n\n**Typical Entry Requirements:**\n- Mathematics A Level (C or better)\n- Computing or Physics A Level\n- English Language O Level\n\nFor more specific information about a particular university's program, please ask about "computer science at [university name]".\n\n**Career Prospects:**\nGraduates work as software developers, systems analysts, database administrators, network engineers, and more, with organizations like Econet, TelOne, banks, and government institutions.\n\n**Research Opportunities:**\nMany programs include research components in areas such as AI, machine learning, cybersecurity, and software engineering methodologies.`;
    }
    
    if (processedInput.includes('information technology') || processedInput.includes('it degree')) {
      const university = processedInput.includes('hit') ? 'HIT' : 
                       processedInput.includes('cut') ? 'CUT' : null;
      
      if (university && detailedDegreeInfo["btech information technology"][university]) {
        const info = detailedDegreeInfo["btech information technology"][university];
        return `**BTech Information Technology at ${university}**\n\n${info.description}\n\n**Entry Requirements:**\n${info.entry_requirements}\n\n**Duration:**\n${info.duration}\n\n**Key Courses:**\n${info.key_courses.join('\n')}\n\n**Career Paths:**\n${info.career_paths.join('\n')}`;
      }
      
      // General info about IT degree
      return `**BTech Information Technology in Zimbabwe**\n\nThe Bachelor of Technology in Information Technology focuses on practical IT skills, system management, and IT service delivery. This program emphasizes hands-on skills with industry attachments.\n\n**Where to Study:**\n- Harare Institute of Technology (HIT)\n- Chinhoyi University of Technology (CUT)\n\n**Typical Entry Requirements:**\n- Mathematics A Level (D or better)\n- Computing/Physics/Chemistry A Level\n- English Language O Level\n\n**Career Prospects:**\nGraduates work as network administrators, IT support specialists, systems engineers, database administrators, and IT project managers.`;
    }
    
    if (processedInput.includes('software engineering') || processedInput.includes('software engineer')) {
      const university = processedInput.includes('nust') ? 'NUST' : 
                       processedInput.includes('hit') ? 'HIT' : null;
      
      if (university && detailedDegreeInfo["bachelor of engineering software"][university]) {
        const info = detailedDegreeInfo["bachelor of engineering software"][university];
        return `**Bachelor of Engineering in Software Engineering at ${university}**\n\n${info.description}\n\n**Entry Requirements:**\n${info.entry_requirements}\n\n**Duration:**\n${info.duration}\n\n**Key Courses:**\n${info.key_courses.join('\n')}\n\n**Career Paths:**\n${info.career_paths.join('\n')}`;
      }
      
      // General info about Software Engineering degree
      return `**Bachelor of Engineering in Software Engineering**\n\nThis engineering program combines computer science with engineering principles to design and develop complex software systems. It has a strong focus on software architecture, quality assurance, and systems development methodologies.\n\n**Where to Study:**\n- National University of Science and Technology (NUST)\n- Harare Institute of Technology (HIT)\n\n**Typical Entry Requirements:**\n- Mathematics A Level (B or better)\n- Physics A Level\n- Chemistry/Computing A Level\n- English Language O Level\n\n**Career Prospects:**\nGraduates work as software architects, quality assurance engineers, systems engineers, and technical leads in various industries.`;
    }
    
    if (processedInput.includes('data science')) {
      if (detailedDegreeInfo["data science"]["NUST"]) {
        const info = detailedDegreeInfo["data science"]["NUST"];
        return `**BSc in Data Science at NUST**\n\n${info.description}\n\n**Entry Requirements:**\n${info.entry_requirements}\n\n**Duration:**\n${info.duration}\n\n**Key Courses:**\n${info.key_courses.join('\n')}\n\n**Career Paths:**\n${info.career_paths.join('\n')}`;
      }
    }
    
    if (processedInput.includes('cyber security') || processedInput.includes('cybersecurity') || processedInput.includes('security degree')) {
      if (detailedDegreeInfo["cyber security"]["HIT"]) {
        const info = detailedDegreeInfo["cyber security"]["HIT"];
        return `**BSc in Cyber Security and Forensics at HIT**\n\n${info.description}\n\n**Entry Requirements:**\n${info.entry_requirements}\n\n**Duration:**\n${info.duration}\n\n**Key Courses:**\n${info.key_courses.join('\n')}\n\n**Career Paths:**\n${info.career_paths.join('\n')}`;
      }
    }
    
    // General degree inquiry
    return `**Computer Science and IT Degrees in Zimbabwe**\n\nZimbabwe offers several excellent degree programs in computing fields:\n\n1. **BSc Computer Science**\n   - Offered at: NUST, UZ, HIT\n   - Focus: Programming, algorithms, software development\n   - Duration: 4 years\n\n2. **BTech Information Technology**\n   - Offered at: HIT, CUT\n   - Focus: IT systems, networks, practical applications\n   - Duration: 4 years\n\n3. **Bachelor of Engineering in Software Engineering**\n   - Offered at: NUST, HIT\n   - Focus: Software architecture, quality assurance, engineering principles\n   - Duration: 5 years\n\n4. **BSc in Data Science**\n   - Offered at: NUST\n   - Focus: Data analytics, machine learning, statistical computing\n   - Duration: 4 years\n\n5. **BSc in Cyber Security and Forensics**\n   - Offered at: HIT\n   - Focus: Network security, ethical hacking, digital forensics\n   - Duration: 4 years\n\nFor detailed information about a specific degree, please ask about it by name.`;
  }

  // Handle health-related queries
  const healthKeywords = ['headache', 'sick', 'pain', 'tired', 'unwell', 'ill'];
  if (healthKeywords.some(keyword => processedInput.includes(keyword))) {
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

  if (processedInput.includes('flowchart')) {
    const flowchartInfo = flowchartExamples.basic;
    return `${flowchartInfo.explanation}\n\nFlowchart Symbols:\n${Object.entries(flowchartInfo.symbols).map(([symbol, desc]) => `${symbol}: ${desc}`).join('\n')}\n\n${flowchartInfo.example}`;
  }

  if (processedInput.includes('tcp/ip') || processedInput.includes('dns')) {
    for (const [concept, details] of Object.entries(networkingConcepts)) {
      if (processedInput.includes(concept)) {
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
  if (mentalHealthKeywords.some(keyword => processedInput.includes(keyword))) {
    for (const [condition, response] of Object.entries(mentalHealthResponses)) {
      if (processedInput.includes(condition)) {
        return `${response.message}\n\nHere are some resources that might help:\n${response.resources.join('\n')}\n\n${response.followUp}`;
      }
    }
  }

  if (processedInput.includes('sql') || processedInput.includes('database') || processedInput.includes('query')) {
    for (const [command, details] of Object.entries(sqlExamples)) {
      if (processedInput.includes(command)) {
        return `Here's how to use the ${command.toUpperCase()} command in SQL:\n\n${details.query}\n\n${details.explanation}`;
      }
    }
  }

  if (processedInput.includes("program") || processedInput.includes("code") || processedInput.includes("write")) {
    for (const [program, details] of Object.entries(basicPrograms)) {
      if (processedInput.includes(program)) {
        if (processedInput.includes("python")) {
          return `Here's a ${program} program in Python:\n\n${details.python}\n\n${details.explanation}`;
        }
        if (processedInput.includes("visual basic") || processedInput.includes("vb")) {
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

  // Check for quiz-related queries
  if (processedInput.includes('quiz') || processedInput.includes('test') || 
      processedInput.includes('question') || processedInput.includes('assessment')) {
    return "I can help you practice your computer science knowledge with a quiz! Just say 'start quiz' or specify a topic like 'quiz on data structures' or 'networking quiz'.";
  }

  for (const [concept, details] of Object.entries(programmingConcepts)) {
    if (processedInput.includes(concept)) {
      if (processedInput.includes("python")) {
        return `${details.explanation}\n\nHere's how to use it in Python:\n${details.python}`;
      }
      if (processedInput.includes("visual basic") || processedInput.includes("vb")) {
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
         "7. Algorithms and Data Structures: Common implementations and complexity\n" +
         "8. University Degrees: Information about Computer Science and IT programs in Zimbabwe\n" +
         "9. Dynamic vs Static Data Structures: Comparisons and applications\n" +
         "10. Binary Trees: Implementation, traversal, and operations\n" +
         "11. Ethical Hacking: Principles, methodologies, and tools\n" +
         "12. Intellectual Property: Copyright, patents, trademarks\n" +
         "13. Enterprise Budgeting: Financial planning for tech ventures\n" +
         "14. Data Representation: Binary, hexadecimal, and encoding systems\n" +
         "15. Take a computer science quiz to test your knowledge\n\n" +
         "What topic would you like to explore today?";
};
