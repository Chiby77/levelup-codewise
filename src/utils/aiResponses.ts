interface ProgrammingConcept {
  python: string;
  visualBasic: string;
  explanation: string;
}

interface UniversityProgram {
  description: string;
  universities: string[];
  requirements: string;
  careerPaths: string[];
}

const programmingConcepts: Record<string, ProgrammingConcept> = {
  variable: {
    python: `# Python Variable Example
age = 25
name = "John"
price = 19.99`,
    visualBasic: `' Visual Basic Variable Example
Dim age As Integer = 25
Dim name As String = "John"
Dim price As Double = 19.99`,
    explanation: "A variable is a container for storing data values. Variables can hold different types of data like numbers, text, or boolean values."
  },
  "if statement": {
    python: `# Python If Statement Example
age = 18
if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")`,
    visualBasic: `' Visual Basic If Statement Example
Dim age As Integer = 18
If age >= 18 Then
    Console.WriteLine("You are an adult")
ElseIf age >= 13 Then
    Console.WriteLine("You are a teenager")
Else
    Console.WriteLine("You are a child")
End If`,
    explanation: "An If statement is a control structure that allows your program to make decisions based on conditions. It executes different code blocks depending on whether conditions are true or false."
  },
  loop: {
    python: `# Python For Loop Example
for i in range(5):
    print(f"Count: {i}")`,
    visualBasic: `' Visual Basic For Loop Example
For i As Integer = 0 To 4
    Console.WriteLine("Count: " & i)
Next`,
    explanation: "A loop is a programming construct that allows you to repeat a block of code multiple times. It's useful for automating repetitive tasks."
  }
};

const universityPrograms: Record<string, UniversityProgram> = {
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

export const generateResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Check for university programs and career guidance
  for (const [program, details] of Object.entries(universityPrograms)) {
    if (lowercaseInput.includes(program) || 
        (lowercaseInput.includes("degree") && lowercaseInput.includes(program.split(" ")[0]))) {
      return `${details.description}\n\nOffered at:\n${details.universities.join("\n")}\n\nEntry Requirements:\n${details.requirements}\n\nPotential Career Paths:\n${details.careerPaths.join("\n")}`;
    }
  }

  // Check for specific university mentions
  if (lowercaseInput.includes("nust") && lowercaseInput.includes("computer science")) {
    const program = universityPrograms["bsc computer science"];
    return `BSc Computer Science at NUST (National University of Science and Technology)\n\n${program.description}\n\nEntry Requirements:\n${program.requirements}\n\nCareer Opportunities:\n${program.careerPaths.join("\n")}`;
  }

  if (lowercaseInput.includes("career") || lowercaseInput.includes("guidance")) {
    return "I can help you explore various tech-related degree programs and career paths in Zimbabwe. Try asking about:\n- BSc Computer Science\n- BTech Information Technology\n- Bachelor of Engineering\n\nOr ask specific questions about career paths in programming, networking, or system administration.";
  }

  // Check for programming concepts
  for (const [concept, details] of Object.entries(programmingConcepts)) {
    if (lowercaseInput.includes(concept)) {
      if (lowercaseInput.includes("python") && details.python) {
        return `${details.explanation}\n\nHere's how to use it in Python:\n${details.python}`;
      }
      if ((lowercaseInput.includes("visual basic") || lowercaseInput.includes("vb")) && details.visualBasic) {
        return `${details.explanation}\n\nHere's how to use it in Visual Basic:\n${details.visualBasic}`;
      }
      return `${details.explanation}\n\nPython Example:\n${details.python}\n\nVisual Basic Example:\n${details.visualBasic}`;
    }
  }

  // General programming questions
  if (lowercaseInput.includes("what is") || lowercaseInput.includes("explain") || lowercaseInput.includes("define")) {
    if (lowercaseInput.includes("python")) {
      return programmingConcepts.python.explanation;
    }
    if (lowercaseInput.includes("visual basic") || lowercaseInput.includes("vb")) {
      return programmingConcepts["visual basic"].explanation;
    }
  }

  // Default response
  return "I can help you with:\n1. Python programming\n2. Visual Basic programming\n3. Programming concepts\n4. Career guidance\n5. University programs in Zimbabwe\n\nFeel free to ask any specific questions about:\n- Programming concepts (e.g., 'explain if statement')\n- Degree programs (e.g., 'tell me about BSc Computer Science at NUST')\n- Career paths in technology";
};