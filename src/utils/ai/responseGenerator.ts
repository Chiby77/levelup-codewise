import { UniversityDetail } from "../../types/universityPrograms";
import { csTopics } from "./topics/computerScience";
import { detailedDegreeInfo } from "./topics/education";
import { getQuizQuestions } from "./quiz/quizData";
import { generateGreeting } from "./greetings";
import { correctInput } from "./textCorrection";
import { QuizStats } from "../../types/quizStats";

// Improved response generation with contextual understanding
export const generateResponse = (userInput: string): string => {
  // Process input to handle broken English and spelling mistakes
  const processedInput = correctInput(userInput.toLowerCase());
  
  // Check for CS topics from our definitions
  if (processedInput.includes('fetch') || processedInput.includes('cycle') || processedInput.includes('execute')) {
    return csTopics.fetchDecodeExecute.explanation;
  }
  
  if (processedInput.includes('logic gate')) {
    return csTopics.logicGates.explanation;
  }
  
  if (processedInput.includes('interrupt')) {
    return csTopics.interrupts.explanation;
  }
  
  if (processedInput.includes('overflow') || processedInput.includes('underflow') || 
      processedInput.includes('numerical error')) {
    return csTopics.numericalErrors.explanation;
  }
  
  if (processedInput.includes('database') || processedInput.includes('sql') || 
      processedInput.includes('relational')) {
    return csTopics.databaseTheory.explanation;
  }
  
  if (processedInput.includes('osi') || processedInput.includes('networking') || 
      processedInput.includes('network model')) {
    return csTopics.osiModel.explanation;
  }
  
  if (processedInput.includes('data structure') || processedInput.includes('algorithm') || 
      processedInput.includes('big o')) {
    return csTopics.dataStructures.explanation;
  }
  
  if (processedInput.includes('security') || processedInput.includes('ethics') || 
      processedInput.includes('ethical')) {
    return csTopics.computerSecurity.explanation;
  }
  
  if (processedInput.includes('visual basic') || processedInput.includes('vb') || 
      processedInput.includes('vba')) {
    return csTopics.visualBasic.explanation;
  }
  
  // New topics from additional knowledge
  if (processedInput.includes('dynamic') && processedInput.includes('static') &&
     (processedInput.includes('data structure') || processedInput.includes('structure'))) {
    return csTopics.dataStructuresDynamic.explanation;
  }
  
  if (processedInput.includes('binary tree') || processedInput.includes('tree traversal') || 
     (processedInput.includes('tree') && processedInput.includes('data structure'))) {
    return csTopics.binaryTrees.explanation;
  }
  
  if ((processedInput.includes('intellectual') && processedInput.includes('property')) || 
      processedInput.includes('copyright') || processedInput.includes('trademark') || 
      processedInput.includes('patent')) {
    return csTopics.enterprisingIP.explanation;
  }
  
  if (processedInput.includes('budget') || processedInput.includes('finance') || 
      (processedInput.includes('enterprise') && processedInput.includes('money'))) {
    return csTopics.enterprisingBudget.explanation;
  }
  
  if (processedInput.includes('hack') || processedInput.includes('penetration test') || 
      processedInput.includes('cyber') || processedInput.includes('security test')) {
    return csTopics.hackingEthical.explanation;
  }
  
  if (processedInput.includes('data representation') || processedInput.includes('binary') || 
      processedInput.includes('hex') || (processedInput.includes('number') && processedInput.includes('system'))) {
    return csTopics.dataRepresentation.explanation;
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

  if (/^(hi|hello|hey|greetings|hie)/i.test(userInput)) {
    return generateGreeting();
  }

  // Generic responses for when specific matching fails
  if (userInput.toLowerCase().includes("hello") || userInput.toLowerCase().includes("hi")) {
    return generateGreeting();
  }

  return "I'm not sure about that. Could you ask me something about Computer Science topics, programming concepts, or university programs?";
};

// Function to generate detailed university response
export const generateUniversityResponse = (program: string, university: string, details: UniversityDetail): string => {
  return `
# ${university} - ${program}

${details.description}

## Entry Requirements
${details.entry_requirements}

## Duration
${details.duration}

## Key Courses
${details.key_courses.join(', ')}

## Career Paths
${details.career_paths.join(', ')}

## Fees
${details.fees}

## Contact
${details.contact}

## Notable Alumni
${details.notable_alumni}

${details.location ? `## Location\n${details.location}` : ''}

${details.campus_facilities ? `## Campus Facilities\n${details.campus_facilities.join(', ')}` : ''}

${details.international_options ? `## International Options\n${details.international_options}` : ''}

${details.scholarships ? `## Scholarships\n${details.scholarships}` : ''}

${details.research_areas ? `## Research Areas\n${details.research_areas.join(', ')}` : ''}
`;
};
