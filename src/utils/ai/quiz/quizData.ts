
import { QuizQuestion } from "@/types/universityPrograms";

// Database of computer science quiz questions
const quizQuestions: QuizQuestion[] = [
  {
    question: "What is the time complexity of a binary search algorithm?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "Binary search has a time complexity of O(log n) because it divides the search interval in half with each comparison.",
    difficulty: "medium",
    category: "algorithms"
  },
  {
    question: "Which data structure operates on the LIFO (Last In, First Out) principle?",
    options: [
      "Queue",
      "Stack",
      "Linked List",
      "Tree"
    ],
    correctAnswer: 1,
    explanation: "A stack operates on the Last In, First Out principle, where the last element added is the first one to be removed.",
    difficulty: "easy",
    category: "data structures"
  },
  {
    question: "In object-oriented programming, what is encapsulation?",
    options: [
      "The ability of an object to take many forms",
      "The process of creating child classes from a parent class",
      "The practice of bundling data and methods together and restricting access to the internal state",
      "The ability to override methods from parent classes"
    ],
    correctAnswer: 2,
    explanation: "Encapsulation is the bundling of data and methods that operate on that data into a single unit (class) and restricting access to some of the object's components.",
    difficulty: "medium",
    category: "programming concepts"
  },
  {
    question: "Which layer of the OSI model is responsible for routing packets between networks?",
    options: [
      "Transport Layer",
      "Network Layer",
      "Data Link Layer",
      "Session Layer"
    ],
    correctAnswer: 1,
    explanation: "The Network Layer (Layer 3) is responsible for packet forwarding and routing through intermediate routers.",
    difficulty: "medium",
    category: "networking"
  },
  {
    question: "What is the result of the logical operation: (TRUE AND FALSE) OR TRUE?",
    options: [
      "TRUE",
      "FALSE",
      "Error",
      "Undefined"
    ],
    correctAnswer: 0,
    explanation: "(TRUE AND FALSE) evaluates to FALSE, then FALSE OR TRUE evaluates to TRUE.",
    difficulty: "easy",
    category: "logic"
  },
  {
    question: "What is the decimal value of the binary number 10110?",
    options: [
      "21",
      "22",
      "23",
      "24"
    ],
    correctAnswer: 1,
    explanation: "10110 in binary = 1×2⁴ + 0×2³ + 1×2² + 1×2¹ + 0×2⁰ = 16 + 0 + 4 + 2 + 0 = 22",
    difficulty: "easy",
    category: "data representation"
  },
  {
    question: "Which of the following is NOT a primary key constraint?",
    options: [
      "Must contain unique values",
      "Cannot contain NULL values",
      "Can have multiple columns in a table",
      "Must be an auto-increment column"
    ],
    correctAnswer: 3,
    explanation: "A primary key must have unique values and cannot be NULL, but it doesn't have to be an auto-increment column.",
    difficulty: "medium",
    category: "databases"
  },
  {
    question: "What is the main purpose of the fetch-decode-execute cycle in a CPU?",
    options: [
      "To manage memory allocation",
      "To perform input/output operations",
      "To process program instructions",
      "To control peripheral devices"
    ],
    correctAnswer: 2,
    explanation: "The fetch-decode-execute cycle is the basic operation cycle of a CPU that processes program instructions one by one.",
    difficulty: "easy",
    category: "computer architecture"
  },
  {
    question: "Which sorting algorithm has the best average case time complexity?",
    options: [
      "Bubble Sort - O(n²)",
      "Insertion Sort - O(n²)",
      "Quick Sort - O(n log n)",
      "Selection Sort - O(n²)"
    ],
    correctAnswer: 2,
    explanation: "Quick Sort has an average time complexity of O(n log n), which is better than the O(n²) complexity of bubble, insertion, and selection sorts.",
    difficulty: "medium",
    category: "algorithms"
  },
  {
    question: "What is a deadlock in operating systems?",
    options: [
      "A situation where a computer freezes and needs to be restarted",
      "When two or more processes are unable to proceed because each is waiting for resources held by others",
      "A malfunction in the process scheduler",
      "When a process uses 100% of CPU resources"
    ],
    correctAnswer: 1,
    explanation: "A deadlock occurs when two or more processes are blocked because each is holding a resource and waiting for another resource that's being held by another blocked process.",
    difficulty: "hard",
    category: "operating systems"
  },
  {
    question: "What is the purpose of normalization in database design?",
    options: [
      "To improve query performance",
      "To reduce storage space",
      "To eliminate data redundancy and dependency",
      "To create indexes for faster data retrieval"
    ],
    correctAnswer: 2,
    explanation: "Normalization is the process of organizing data in a database to reduce redundancy and dependency, which improves data integrity.",
    difficulty: "medium",
    category: "databases"
  },
  {
    question: "In cryptography, which of these is an asymmetric encryption algorithm?",
    options: [
      "AES",
      "DES",
      "RSA",
      "Blowfish"
    ],
    correctAnswer: 2,
    explanation: "RSA is an asymmetric encryption algorithm that uses different keys for encryption and decryption (public and private keys).",
    difficulty: "hard",
    category: "security"
  },
  {
    question: "What is the output of the following Python code: print(5 // 2)",
    options: [
      "2.5",
      "2",
      "3",
      "2.0"
    ],
    correctAnswer: 1,
    explanation: "In Python, // is the floor division operator that returns the integer part of the division. 5 // 2 equals 2.",
    difficulty: "easy",
    category: "programming"
  },
  {
    question: "Which of the following is NOT a form of machine learning?",
    options: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Reinforcement Learning",
      "Reflexive Learning"
    ],
    correctAnswer: 3,
    explanation: "Reflexive Learning is not a recognized form of machine learning. The main forms are supervised, unsupervised, and reinforcement learning.",
    difficulty: "medium",
    category: "artificial intelligence"
  },
  {
    question: "Which of the following is a characteristic of a virus but NOT of a worm?",
    options: [
      "Self-replication",
      "Attachment to a host file",
      "Network-based propagation",
      "Exploitation of system vulnerabilities"
    ],
    correctAnswer: 1,
    explanation: "Viruses must attach themselves to host files to propagate, while worms can spread independently through networks without needing a host file.",
    difficulty: "hard",
    category: "security"
  }
];

// Function to get a random subset of quiz questions
export const getQuizQuestions = (count = 5, category?: string): QuizQuestion[] => {
  let filteredQuestions = quizQuestions;
  
  // Filter by category if specified
  if (category) {
    filteredQuestions = quizQuestions.filter(q => q.category.toLowerCase().includes(category.toLowerCase()));
    
    // If not enough questions in that category, add some general ones
    if (filteredQuestions.length < count) {
      const generalQuestions = quizQuestions.filter(q => !q.category.toLowerCase().includes(category.toLowerCase()));
      filteredQuestions = [...filteredQuestions, ...generalQuestions];
    }
  }
  
  // Shuffle the questions
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
  
  // Return the requested number of questions
  return shuffled.slice(0, count);
};
