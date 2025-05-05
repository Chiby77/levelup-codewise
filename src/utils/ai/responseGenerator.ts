
import { UniversityDetail } from "../../types/universityPrograms";
import { csTopics } from "./topics/computerScience";
import { detailedDegreeInfo } from "./topics/education";
import { getQuizQuestions } from "./quiz/quizData";
import { generateGreeting } from "./greetings";
import { correctInput } from "./textCorrection";
import { QuizStats } from "../../types/quizStats";

// Re-export generateGreeting from greetings.ts
export { generateGreeting };

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
  
  // Intellectual property
  if ((processedInput.includes('intellectual') && processedInput.includes('property')) || 
      processedInput.includes('copyright') || processedInput.includes('trademark') || 
      processedInput.includes('patent')) {
    return "Intellectual property (IP) refers to creations of the mind, such as inventions, literary and artistic works, designs, symbols, names, and images used in commerce. It's protected by laws through patents, copyright, and trademarks, allowing creators to earn recognition or financial benefit. In software development, IP is particularly important as code, algorithms, and interfaces may all be protected under various IP rights.";
  }
  
  // Enterprise budgeting
  if (processedInput.includes('budget') || processedInput.includes('finance') || 
      (processedInput.includes('enterprise') && processedInput.includes('money'))) {
    return "Enterprise budgeting is the process of creating a plan for how a business will spend its resources over a specific period. It involves forecasting revenue, planning expenses, and allocating resources to different departments or projects. In technology projects, budgeting includes hardware costs, software licenses, development hours, maintenance, and operational expenses. Effective budget management is critical for ensuring that technology initiatives align with business goals and deliver ROI.";
  }
  
  // Ethical hacking
  if (processedInput.includes('hack') || processedInput.includes('penetration test') || 
      processedInput.includes('cyber') || processedInput.includes('security test')) {
    return "Ethical hacking involves authorized professionals attempting to bypass system security to identify weaknesses that could be exploited by malicious hackers. Unlike malicious hacking, ethical hackers work with permission and report vulnerabilities to be fixed. Common approaches include penetration testing, vulnerability assessments, and security audits. These practices are essential for organizations to proactively identify and address security issues before they can be exploited.";
  }
  
  // Data representation
  if (processedInput.includes('data representation') || processedInput.includes('binary') || 
      processedInput.includes('hex') || (processedInput.includes('number') && processedInput.includes('system'))) {
    return "Data representation refers to how computers store and manipulate data using binary (base-2) number system. All data - whether text, images, audio, or instructions - is ultimately represented as sequences of 0s and 1s. Different number systems used in computing include binary (base-2), decimal (base-10), and hexadecimal (base-16). Understanding data representation is fundamental to computer science as it underlies all computing operations, from basic arithmetic to complex data processing.";
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

  // Location information for About page
  if (processedInput.includes('location') || processedInput.includes('where') || 
      processedInput.includes('address') || processedInput.includes('map')) {
    return "Our campus is located in Harare, Zimbabwe. You can find us on Google Maps at: https://maps.app.goo.gl/e68TQE2T5wjbfC8r6";
  }

  // Handle health-related queries with mental health support
  if (processedInput.includes('mental health') || processedInput.includes('stress') || processedInput.includes('anxiety') || 
      processedInput.includes('depression') || processedInput.includes('overwhelmed')) {
    return "**Mental Health Support for Tech Students**\n\n" +
           "It's common to experience stress and anxiety while pursuing a tech education or career. " +
           "In Zimbabwe, there are several resources available:\n\n" +
           "**Local Resources:**\n" +
           "- **The Friendship Bench**: A community-based talk therapy program. Visit friendshipbenchzimbabwe.org\n" +
           "- **Zimbabwe National Association for Mental Health (ZIMNAMH)**: Advocacy and support services\n" +
           "- **Ndinewe Foundation**: A youth-led mental health organization focused on increasing awareness\n\n" +
           "**Coping Strategies:**\n" +
           "- Practice time management and break large assignments into manageable tasks\n" +
           "- Join study groups or programming communities for social support\n" +
           "- Maintain physical activities and ensure proper sleep\n" +
           "- Consider mindfulness and relaxation techniques\n\n" +
           "Remember that seeking help is a sign of strength, not weakness. Your mental health is as important as your academic success.";
  }

  // Physics in tech careers
  if ((processedInput.includes('physics') && processedInput.includes('tech')) || 
      (processedInput.includes('physics') && processedInput.includes('career'))) {
    return "**The Relevance of Physics in Tech Careers**\n\n" +
           "Physics knowledge provides a significant advantage in several technology fields:\n\n" +
           "**Game Development**: Physics is fundamental for realistic simulations, game mechanics, and graphics rendering. Understanding concepts like kinematics, collision detection, and projectile motion helps create immersive gaming experiences.\n\n" +
           "**Hardware Engineering**: Knowledge of electronics, thermodynamics, and electromagnetics is essential for designing computer hardware, from processors to cooling systems.\n\n" +
           "**Robotics**: Robotics engineers apply principles of mechanics, dynamics, and kinetics to create movement systems and sensor integration.\n\n" +
           "**AI and Machine Learning**: Many ML algorithms are based on physical models and statistical physics principles, especially for simulations and predictive modeling.\n\n" +
           "**Virtual Reality**: Creating realistic VR environments requires understanding optics, acoustics, and spatial relationships.\n\n" +
           "In Zimbabwe, students with strong physics backgrounds have competitive advantages in technical roles at companies like Econet Wireless, TelOne, and various international tech companies with remote positions.";
  }

  // Career guidance
  if (processedInput.includes('career') || processedInput.includes('job') || processedInput.includes('work') || 
      processedInput.includes('employment')) {
    return "**Tech Career Guidance in Zimbabwe**\n\n" +
           "The tech industry in Zimbabwe offers diverse opportunities despite economic challenges:\n\n" +
           "**Growing Sectors:**\n" +
           "- Mobile application development (for Econet, NetOne, Telecel)\n" +
           "- Financial technology with banks and payment services\n" +
           "- E-government services and digitization projects\n" +
           "- Telecommunications infrastructure\n" +
           "- Remote work for international companies\n\n" +
           "**Key Skills for Zimbabwean Tech Market:**\n" +
           "- Full-stack web development (JavaScript, PHP, Python)\n" +
           "- Mobile development (especially Android)\n" +
           "- Database management\n" +
           "- Network administration\n" +
           "- Cloud computing\n\n" +
           "**Local Tech Companies:**\n" +
           "- Econet Wireless and its subsidiaries (Cassava Smartech, EcoCash)\n" +
           "- Solution Centre\n" +
           "- Africom\n" +
           "- TelOne\n" +
           "- Twenty Third Century Systems\n\n" +
           "**Building Your Portfolio:**\n" +
           "- Contribute to open source projects\n" +
           "- Develop solutions for local challenges\n" +
           "- Participate in hackathons and coding competitions\n" +
           "- Consider internships with local tech companies\n\n" +
           "**Networking:**\n" +
           "- Join the Zimbabwe Information and Communication Technologies Association\n" +
           "- Attend events at tech hubs like Harare's Impact Hub\n" +
           "- Participate in the annual Zimbabwe ICT Conference\n\n" +
           "Would you like me to provide more specific information about any of these areas?";
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
  let response = `
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
${details.fees || 'Information not available'}

## Contact
${details.contact || 'Information not available'}

## Notable Alumni
${details.notable_alumni || 'Information not available'}
`;

  if (details.location) {
    response += `\n## Location\n${details.location}`;
  }

  if (details.campus_facilities && details.campus_facilities.length > 0) {
    response += `\n## Campus Facilities\n${details.campus_facilities.join(', ')}`;
  }

  if (details.international_options) {
    response += `\n## International Options\n${details.international_options}`;
  }

  if (details.scholarships) {
    response += `\n## Scholarships\n${details.scholarships}`;
  }

  if (details.research_areas && details.research_areas.length > 0) {
    response += `\n## Research Areas\n${details.research_areas.join(', ')}`;
  }

  return response;
};
