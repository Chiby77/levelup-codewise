export interface UniversityProgram {
  description: string;
  universities: string[];
  requirements: string;
  careerPaths: string[];
}

export const universityPrograms: Record<string, UniversityProgram> = {
  "bsc computer science": {
    description: "The Bachelor of Science in Computer Science at NUST Zimbabwe is a comprehensive four-year degree program that provides a strong foundation in computing principles, software development, and problem-solving skills. The program covers essential areas such as programming languages, algorithms, database systems, artificial intelligence, and software engineering. Students also engage in practical projects and industrial attachments to gain hands-on experience.",
    universities: [
      "National University of Science and Technology (NUST)",
      "University of Zimbabwe",
      "Harare Institute of Technology (HIT)"
    ],
    requirements: "Mathematics A Level (C or better), Computing/Physics/Chemistry A Level, English Language O Level",
    careerPaths: [
      "Software Developer",
      "Systems Analyst",
      "Database Administrator",
      "AI/ML Engineer",
      "Web Developer",
      "Research and Development"
    ]
  },
  "btech information technology": {
    description: "The Bachelor of Technology in Information Technology is a hands-on degree focusing on practical IT skills, system administration, and network management. The program emphasizes real-world applications and includes industrial attachment opportunities.",
    universities: [
      "Harare Institute of Technology (HIT)",
      "Chinhoyi University of Technology (CUT)"
    ],
    requirements: "Mathematics A Level (D or better), Computing/Physics/Chemistry A Level",
    careerPaths: [
      "Network Administrator",
      "IT Support Specialist",
      "Systems Engineer",
      "Cloud Administrator",
      "IT Project Manager"
    ]
  },
  "bachelor of engineering": {
    description: "The Bachelor of Engineering program combines computer science with engineering principles to design and develop complex software systems and hardware interfaces. Students learn about embedded systems, digital electronics, and software architecture.",
    universities: [
      "University of Zimbabwe",
      "National University of Science and Technology (NUST)",
      "Harare Institute of Technology (HIT)"
    ],
    requirements: "Mathematics and Physics A Level (C or better), Chemistry A Level recommended",
    careerPaths: [
      "Software Engineer",
      "Hardware Engineer",
      "Systems Architect",
      "IoT Developer",
      "Robotics Engineer"
    ]
  }
};
