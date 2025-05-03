
import { programmingConcepts } from './responses/programmingConcepts';
import { basicPrograms } from './responses/programming/basicPrograms';
import { algorithms } from './responses/programming/algorithms';
import { universityPrograms } from './responses/universityPrograms';
import { sqlExamples } from './responses/sqlExamples';
import { mentalHealthResponses } from './responses/mentalHealthSupport';
import { networkingConcepts } from './responses/computerScience/networking';
import { flowchartExamples } from './responses/computerScience/flowcharts';

// Enhanced spelling and grammar correction
const correctInput = (input: string): string => {
  // Common spelling corrections
  const spellingCorrections: Record<string, string> = {
    'programing': 'programming',
    'programm': 'program',
    'flowchart': 'flowchart',
    'databse': 'database',
    'javascript': 'JavaScript',
    'python': 'Python',
    'sql': 'SQL',
    'computa': 'computer',
    'computar': 'computer',
    'degre': 'degree',
    'univsity': 'university',
    'universti': 'university',
    'cours': 'course',
    'netwok': 'network',
    'netwrk': 'network',
    'programer': 'programmer',
    'programmar': 'programmer',
    'algoritm': 'algorithm',
    'algorthm': 'algorithm',
    'struture': 'structure',
    'binarry': 'binary',
    'enterpris': 'enterprise',
    'enterpise': 'enterprise',
    'buget': 'budget',
    'hackin': 'hacking',
    'copyrght': 'copyright',
    'tredmark': 'trademark',
    'budgetin': 'budgeting',
    'cumputa': 'computer',
    'komputer': 'computer',
    'suftware': 'software',
  };

  // Replace misspelled words
  const processedInput = input.split(' ').map(word => {
    const lowerWord = word.toLowerCase().replace(/[.,?!;:]/g, '');
    return spellingCorrections[lowerWord] || word;
  }).join(' ');

  return processedInput;
};

// Enhanced degree information
const detailedDegreeInfo = {
  "bsc computer science": {
    "NUST": {
      description: "The BSc in Computer Science at the National University of Science and Technology (NUST) is a premier four-year program that provides comprehensive education in computing fundamentals, software engineering, artificial intelligence, and data structures. The program combines theoretical knowledge with practical laboratory work and an industrial attachment in the third year.",
      entry_requirements: "Mathematics A Level (C or better), Computing/Physics A Level (C or better), English Language O Level (B or better)",
      duration: "4 years (including 1 year industrial attachment)",
      key_courses: [
        "Data Structures and Algorithms",
        "Database Management Systems",
        "Operating Systems",
        "Software Engineering",
        "Computer Networks",
        "Artificial Intelligence",
        "Web Application Development",
        "Mobile Computing",
        "Computer Graphics",
        "Distributed Systems"
      ],
      career_paths: [
        "Software Developer",
        "Systems Analyst",
        "Database Administrator",
        "Network Engineer",
        "AI/ML Engineer",
        "Web Developer",
        "Research Scientist",
        "IT Project Manager"
      ],
      fees: "Approximately USD 1,500 - 2,500 per semester (varies by residence status)",
      contact: "admissions@nust.ac.zw, +263-9-282842",
      notable_alumni: "Many graduates work at leading tech companies like Econet, TelOne, and international firms.",
      location: "Bulawayo, Zimbabwe - Main Campus",
      campus_facilities: [
        "High-performance computing lab",
        "IoT and embedded systems lab",
        "Software development studio",
        "Robotics research center",
        "Digital library",
        "Student innovation hub"
      ],
      international_options: "Exchange programs with universities in South Africa, China, and the UK",
      scholarships: "Merit-based scholarships available for top performing students"
    },
    "UZ": {
      description: "The University of Zimbabwe offers a comprehensive BSc Honors degree in Computer Science focused on developing skilled professionals in computing theory and practice. The program emphasizes programming skills, algorithms, database systems, and software development methodologies.",
      entry_requirements: "Mathematics A Level (B or better), Computing/Physics A Level, English Language O Level",
      duration: "4 years",
      key_courses: [
        "Programming Fundamentals",
        "Data Structures and Algorithms",
        "Database Systems",
        "Computer Architecture",
        "Software Engineering",
        "Computer Networks",
        "Machine Learning",
        "Web Technologies",
        "Information Security",
        "Distributed Computing"
      ],
      career_paths: [
        "Software Developer",
        "Systems Analyst",
        "IT Consultant",
        "Web Developer",
        "Database Administrator",
        "Network Administrator",
        "Academic/Researcher"
      ],
      fees: "Approximately USD 1,200 - 2,000 per semester (varies by residence status)",
      contact: "admissions@uz.ac.zw, +263-4-303211",
      notable_alumni: "Graduates hold key positions in financial institutions, telecoms, and government offices across Zimbabwe.",
      location: "Harare, Zimbabwe - Mount Pleasant Campus",
      campus_facilities: [
        "Computer labs with 24/7 access",
        "Research commons",
        "Innovation center",
        "Central computing facility",
        "Digital makerspace"
      ],
      research_areas: [
        "Machine Learning and AI",
        "Cybersecurity",
        "HCI and User Experience",
        "Big Data Analytics",
        "Mobile Computing"
      ]
    },
    "HIT": {
      description: "Harare Institute of Technology's BSc in Computer Science program focuses on delivering hands-on, industry-relevant skills in software development, cyber security, and emerging technologies. The program has a strong entrepreneurial component.",
      entry_requirements: "Mathematics A Level (C or better), Physics/Computing A Level, English Language O Level",
      duration: "4 years",
      key_courses: [
        "Object-Oriented Programming",
        "Data Structures and Algorithms",
        "Database Design",
        "Computer Networks and Security",
        "Mobile Application Development",
        "Cloud Computing",
        "Internet of Things",
        "Entrepreneurship in ICT",
        "Artificial Intelligence",
        "Blockchain Technologies"
      ],
      career_paths: [
        "Software Engineer",
        "Security Specialist",
        "Mobile App Developer",
        "Cloud Solutions Architect",
        "Startup Founder",
        "Systems Engineer"
      ],
      fees: "Approximately USD 1,300 - 2,200 per semester",
      contact: "admissions@hit.ac.zw, +263-4-741422-36",
      notable_alumni: "HIT graduates have founded several tech startups in Zimbabwe's innovation ecosystem."
    }
  },
  "btech information technology": {
    "HIT": {
      description: "The BTech Information Technology program at Harare Institute of Technology emphasizes practical IT skills like system administration, network management, and IT service delivery. The program includes substantial hands-on laboratory work and industry attachments.",
      entry_requirements: "Mathematics A Level (D or better), Computing/Physics/Chemistry A Level, English Language O Level",
      duration: "4 years",
      key_courses: [
        "IT Service Management",
        "Network Administration",
        "System Administration",
        "Cloud Infrastructure",
        "IT Project Management",
        "Database Administration",
        "Web Technologies",
        "Cybersecurity Essentials",
        "Virtualization Technologies"
      ],
      career_paths: [
        "Network Administrator",
        "IT Support Specialist",
        "Systems Engineer",
        "Cloud Administrator",
        "IT Project Manager",
        "Database Administrator",
        "Security Operations Analyst"
      ]
    },
    "CUT": {
      description: "Chinhoyi University of Technology offers a practical BTech in Information Technology focusing on IT infrastructure, enterprise systems, and business technology integration. The program prepares graduates to manage and implement IT solutions across various industries.",
      entry_requirements: "Mathematics A Level (D or better), Computing/Physics/Chemistry A Level, English Language O Level",
      duration: "4 years",
      key_courses: [
        "Enterprise Systems",
        "IT Infrastructure",
        "Business Process Integration",
        "Systems Analysis and Design",
        "Database Management",
        "Network Security",
        "IT Governance",
        "Mobile Computing",
        "IT Service Delivery"
      ],
      career_paths: [
        "IT Infrastructure Specialist",
        "Business Systems Analyst",
        "IT Service Manager",
        "Network Security Specialist",
        "Enterprise Systems Administrator",
        "IT Compliance Officer"
      ]
    }
  },
  "bachelor of engineering software": {
    "NUST": {
      description: "The Bachelor of Engineering in Software Engineering at NUST is an accredited engineering program that combines computer science fundamentals with engineering principles to develop robust software systems. The program has a strong focus on software architecture, quality assurance, and large-scale systems development.",
      entry_requirements: "Mathematics A Level (B or better), Physics A Level (C or better), Chemistry/Computing A Level, English Language O Level",
      duration: "5 years (including industrial attachment)",
      key_courses: [
        "Software Architecture",
        "Software Quality Assurance",
        "Requirements Engineering",
        "Software Project Management",
        "Embedded Systems",
        "High-Performance Computing",
        "Real-time Systems",
        "Human-Computer Interaction",
        "Formal Methods in Software Engineering"
      ],
      career_paths: [
        "Software Architect",
        "Quality Assurance Engineer",
        "DevOps Engineer",
        "Systems Engineer",
        "Requirements Engineer",
        "Product Manager",
        "Full-Stack Developer"
      ]
    },
    "HIT": {
      description: "HIT's Bachelor of Engineering in Software Engineering program emphasizes innovation and entrepreneurship alongside technical skills. The program focuses on cutting-edge software development methodologies, emerging technologies, and engineering principles for building resilient software systems.",
      entry_requirements: "Mathematics A Level (C or better), Physics A Level, Chemistry/Computing A Level, English Language O Level",
      duration: "5 years",
      key_courses: [
        "Software Design and Architecture",
        "Agile Development Methodologies",
        "DevOps and Continuous Integration",
        "Mobile Engineering",
        "Cloud-Native Applications",
        "Engineering Economics",
        "Software Testing and Validation",
        "IP and Technology Law",
        "Technology Entrepreneurship"
      ],
      career_paths: [
        "Software Engineer",
        "Technical Lead",
        "DevOps Specialist",
        "Technology Entrepreneur",
        "Cloud Engineer",
        "R&D Engineer"
      ]
    }
  },
  "data science": {
    "NUST": {
      description: "The BSc in Data Science at NUST is an interdisciplinary program combining statistics, computing, and domain expertise to prepare students for careers in data analytics and machine learning. The program teaches how to extract insights from complex data sets to inform business and research decisions.",
      entry_requirements: "Mathematics A Level (B or better), Computing/Physics A Level, English Language O Level",
      duration: "4 years",
      key_courses: [
        "Statistical Computing",
        "Machine Learning",
        "Data Mining",
        "Big Data Analytics",
        "Data Visualization",
        "Time Series Analysis",
        "Natural Language Processing",
        "Deep Learning",
        "Business Intelligence"
      ],
      career_paths: [
        "Data Scientist",
        "Data Analyst",
        "Machine Learning Engineer",
        "Business Intelligence Analyst",
        "Research Scientist",
        "Data Engineer"
      ]
    }
  },
  "cyber security": {
    "HIT": {
      description: "The BSc in Cyber Security and Forensics at HIT prepares students to protect information systems from cyber threats and investigate digital crimes. The program covers defensive and offensive security techniques, digital forensics, and security governance.",
      entry_requirements: "Mathematics A Level (C or better), Computing/Physics A Level, English Language O Level",
      duration: "4 years",
      key_courses: [
        "Network Security",
        "Ethical Hacking",
        "Digital Forensics",
        "Cryptography",
        "Security Governance",
        "Incident Response",
        "Malware Analysis",
        "Security Architecture",
        "Penetration Testing"
      ],
      career_paths: [
        "Security Analyst",
        "Penetration Tester",
        "Digital Forensic Investigator",
        "Security Consultant",
        "Compliance Specialist",
        "Security Operations Center Analyst"
      ]
    }
  }
};

// Define CS topics for Mbuya Zivai
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
  },
  
  // New topics on data structures
  dataStructuresDynamic: {
    topic: "Dynamic vs Static Data Structures",
    explanation: `Data structures can be classified as either dynamic or static based on their memory allocation and size flexibility:

**Dynamic Data Structures**
• Size can increase or decrease during program execution
• Examples: Linked Lists, Binary Trees, Graphs, Stacks and Queues (when implemented with linked lists)
• Memory is allocated at runtime (heap memory)
• Advantages:
  - Efficient memory utilization
  - No size limitations (except total available memory)
  - No overflow until memory is exhausted
• Disadvantages:
  - More complex implementation
  - Slower access times (compared to static)
  - Require pointers or references

**Static Data Structures**
• Fixed size determined at compile time
• Examples: Arrays, Structures
• Memory is allocated at compile time (stack memory)
• Advantages:
  - Simpler to implement
  - Faster access with direct indexing
  - Better cache performance
• Disadvantages:
  - May waste memory if not fully utilized
  - Size must be predetermined
  - Possibility of overflow errors

The choice between dynamic and static structures depends on your application's needs regarding memory efficiency, access speed, and flexibility.`
  },
  
  binaryTrees: {
    topic: "Binary Trees",
    explanation: `A binary tree is a hierarchical data structure where each node has at most two children (left child and right child):

**Key Properties**:
• Each node contains a value and pointers to left and right children
• The left subtree contains nodes with values less than the parent node
• The right subtree contains nodes with values greater than the parent node

**Tree Traversal Methods**:
1. **In-order**: Left → Root → Right (gives sorted output for BST)
2. **Pre-order**: Root → Left → Right (useful for copying trees)
3. **Post-order**: Left → Right → Root (useful for deletion)
4. **Level-order**: Level by level from top to bottom

**Operations**:
• **Insertion**: Compare with root, traverse left/right based on comparison, insert at first null position
• **Deletion**: 
  - Leaf node: Remove directly
  - One child: Replace with child
  - Two children: Replace with in-order successor (smallest in right subtree) or predecessor
• **Search**: Start at root, traverse left/right based on comparison

**Applications**:
• Expression evaluation and syntax parsing
• File system directories
• Database indexing
• Decision trees in machine learning
• Priority queues`
  },
  
  enterprisingIP: {
    topic: "Intellectual Property",
    explanation: `Intellectual Property (IP) refers to creations of the mind that are protected by law, giving creators exclusive rights:

**Types of Intellectual Property**:

1. **Copyright**
   • Protects original works of authorship (literature, music, art, software)
   • Automatic upon creation, lasts author's lifetime plus 70 years
   • Gives exclusive rights to reproduce, distribute, display, and create derivative works
   • Registration recommended but not required in many countries

2. **Trademark**
   • Protects brand identifiers like logos, names, slogans
   • Rights established through use, but registration provides stronger protection
   • Can potentially last indefinitely with proper maintenance
   • Requires renewal every 5-10 years depending on jurisdiction

3. **Patent**
   • Protects inventions, processes, methods
   • Must be novel, non-obvious, and useful
   • Limited term (usually 20 years)
   • Requires formal application and examination
   • Provides exclusive rights to make, use, and sell the invention

4. **Trade Secret**
   • Protects confidential business information
   • No registration process; protection comes from keeping information secret
   • Can potentially last indefinitely (as long as it remains secret)
   • Examples: formulas, processes, customer lists

For technology entrepreneurs and software developers, understanding these protections is crucial for business strategy and avoiding infringement issues.`
  },
  
  enterprisingBudget: {
    topic: "Budgeting for Enterprises",
    explanation: `Budgeting is a critical process for enterprises to plan and control financial resources:

**Key Components of Enterprise Budgeting**:

1. **Capital Budget**
   • Covers long-term investments (equipment, facilities, R&D)
   • Evaluated using ROI, NPV, IRR, and payback period
   • Typically planned for 3-5 year horizons

2. **Operating Budget**
   • Revenue forecasts
   • Fixed costs (rent, salaries, insurance)
   • Variable costs (materials, utilities, commissions)
   • Marketing and sales expenses
   • R&D expenditure

3. **Cash Flow Budget**
   • Timing of cash inflows and outflows
   • Working capital requirements
   • Seasonal variations
   • Debt service schedules

4. **Budgeting Approaches**:
   • Zero-based: Justifying all expenses from zero each period
   • Incremental: Adjusting previous period's budget
   • Activity-based: Allocating costs based on activities
   • Rolling: Continuous updating of budgets

5. **Technology Budget Considerations**:
   • Hardware costs (initial and replacement)
   • Software licenses and subscriptions
   • Development costs (internal and external)
   • Maintenance and support
   • Training and onboarding
   • Security and compliance

Effective budgeting helps enterprises allocate resources efficiently, measure performance against plans, and make informed financial decisions.`
  },
  
  hackingEthical: {
    topic: "Ethical Hacking",
    explanation: `Ethical hacking (also known as penetration testing or white-hat hacking) is the practice of testing computer systems, networks, and applications to identify security vulnerabilities that could be exploited by malicious hackers:

**Key Phases of Ethical Hacking**:

1. **Reconnaissance**
   • Passive: Gathering information without touching systems (OSINT)
   • Active: Direct interaction with target systems
   • Tools: WHOIS, DNS, social engineering, Shodan

2. **Scanning**
   • Port scanning to identify open services
   • Vulnerability scanning to detect weaknesses
   • Tools: Nmap, Nessus, OpenVAS

3. **Gaining Access**
   • Exploiting identified vulnerabilities
   • Password cracking, buffer overflows, SQL injection
   • Tools: Metasploit, SQLmap, Hydra

4. **Maintaining Access**
   • Backdoors and persistence mechanisms
   • Privilege escalation
   • Studying lateral movement possibilities

5. **Covering Tracks**
   • Understanding how attackers hide their presence
   • Log analysis and clearing

**Ethical Considerations**:
• Always obtain proper authorization before testing
• Respect scope limitations and rules of engagement
• Avoid disruption to business operations
• Handle sensitive data appropriately
• Provide detailed reports with remediation suggestions

Ethical hackers help organizations improve their security posture by identifying and addressing vulnerabilities before malicious hackers can exploit them.`
  },
  
  dataRepresentation: {
    topic: "Data Representation",
    explanation: `Data representation refers to how data is encoded and stored in computer systems:

**Number Systems**:
• **Binary (Base-2)**: Uses only 0 and 1 (e.g., 1101 = 13₁₀)
• **Decimal (Base-10)**: Standard system using digits 0-9
• **Hexadecimal (Base-16)**: Uses digits 0-9 and letters A-F (e.g., 0xD = 13₁₀)
• **Octal (Base-8)**: Uses digits 0-7 (e.g., 15₈ = 13₁₀)

**Integer Representation**:
• **Unsigned**: Represents only positive values (e.g., 8-bit: 0 to 255)
• **Signed**: Represents positive and negative values
  - Sign-Magnitude: First bit represents sign
  - One's Complement: Invert all bits for negative
  - Two's Complement: Invert all bits and add 1 (commonly used)

**Floating-Point Representation**:
• IEEE 754 standard for floating-point arithmetic
• Components: Sign bit, exponent, mantissa
• Single precision (32-bit) and double precision (64-bit)

**Character Encoding**:
• **ASCII**: 7-bit encoding for basic English characters (128 values)
• **Extended ASCII**: 8-bit encoding (256 values)
• **Unicode**: Universal character set (UTF-8, UTF-16, UTF-32)
  - UTF-8: Variable-length encoding (1-4 bytes)
  - UTF-16: Fixed-length encoding (2 or 4 bytes)

**Data Types in Programming**:
• Integers (byte, short, int, long)
• Floating-point (float, double)
• Characters and strings
• Boolean (true/false)
• Composite types (arrays, structures, objects)

Understanding data representation is fundamental for efficient programming, memory management, and data processing.`
  },
};

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
        return `**BSc Computer Science at ${university}**\n\n${info.description}\n\n**Entry Requirements:**\n${info.entry_requirements}\n\n**Duration:**\n${info.duration}\n\n**Key Courses:**\n${info.key_courses.join('\n')}\n\n**Career Paths:**\n${info.career_paths.join('\n')}\n\n**Contact:**\n${info.contact}\n\n**Campus Location:**\n${info.location || 'Information not available'}\n\n**Campus Facilities:**\n${info.campus_facilities ? info.campus_facilities.join('\n') : 'Information not available'}\n\n**International Options:**\n${info.international_options || 'Information not available'}\n\n**Scholarships:**\n${info.scholarships || 'Information not available'}`;
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
         "14. Data Representation: Binary, hexadecimal, and encoding systems\n\n" +
         "What topic would you like to explore today?";
};

