
import { UniversityDetail } from "../../types/universityPrograms";
import { csTopics } from "./topics/computerScience";
import { detailedDegreeInfo } from "./topics/education";
import { getQuizQuestions } from "./quiz/quizData";

// Improved response generation with contextual understanding
export const generateResponse = (userInput: string): string => {
  // Check for common CS topic queries
  for (const topic of csTopics) {
    for (const keyword of topic.keywords) {
      if (userInput.toLowerCase().includes(keyword.toLowerCase())) {
        return topic.response;
      }
    }
  }

  // Check for degree-related queries
  for (const program in detailedDegreeInfo) {
    if (userInput.toLowerCase().includes(program.toLowerCase())) {
      const info = detailedDegreeInfo[program as keyof typeof detailedDegreeInfo];
      return `Here's information about ${program}:\n\n${info.description}\n\nThis program typically takes ${info.duration} to complete.`;
    }
  }

  // Generic responses for when specific matching fails
  if (userInput.toLowerCase().includes("hello") || userInput.toLowerCase().includes("hi")) {
    return generateGreeting();
  }

  return "I'm not sure about that. Could you ask me something about Computer Science topics, programming concepts, or university programs?";
};

// Generate a friendly greeting with variation
export const generateGreeting = (): string => {
  const greetings = [
    "Hello! I'm Mbuya Zivai, your AI guide to Computer Science knowledge. How can I help you today?",
    "Greetings! I'm here to assist with your Computer Science questions. What would you like to know?",
    "Hi there! I'm Mbuya Zivai, ready to help with programming, CS concepts, or university programs. What's on your mind?",
  ];

  return greetings[Math.floor(Math.random() * greetings.length)];
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
