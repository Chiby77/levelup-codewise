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
    python: `# Python If Statement
age = 18
if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")`,
    visualBasic: `' Visual Basic If Statement
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
  python: {
    python: "",
    visualBasic: "",
    explanation: "Python is a high-level, interpreted programming language known for its simplicity and readability. It's widely used in web development, data science, artificial intelligence, and automation. Python uses indentation to define code blocks and supports both procedural and object-oriented programming paradigms."
  },
  "visual basic": {
    python: "",
    visualBasic: "",
    explanation: "Visual Basic (VB) is a programming language developed by Microsoft. It's designed to be easy to learn and uses a more verbose, English-like syntax. VB is commonly used for Windows desktop applications, database applications, and automation tasks. It's part of the .NET framework and uses explicit code block declarations with End statements."
  }
};

const universityPrograms: Record<string, UniversityProgram> = {
  "bsc computer science": {
    description: "Bachelor of Science in Computer Science is a degree program that focuses on the theoretical and practical aspects of computing. It covers programming, algorithms, data structures, software engineering, and more.",
    universities: ["University of Zimbabwe", "National University of Science and Technology (NUST)", "Harare Institute of Technology (HIT)"],
    requirements: "Mathematics A Level (C or better), Computing/Physics/Chemistry",
    careerPaths: ["Software Developer", "Systems Analyst", "Database Administrator", "AI/ML Engineer"]
  },
  "btech information technology": {
    description: "Bachelor of Technology in Information Technology is a practical-oriented degree focusing on IT infrastructure, networking, and system administration.",
    universities: ["Harare Institute of Technology (HIT)", "Chinhoyi University of Technology (CUT)"],
    requirements: "Mathematics A Level (D or better), Computing/Physics/Chemistry",
    careerPaths: ["Network Administrator", "IT Support Specialist", "Systems Engineer", "Cloud Administrator"]
  },
  "bachelor of engineering": {
    description: "Bachelor of Engineering in Computer/Software Engineering combines computer science with engineering principles to design and develop complex software systems and hardware interfaces.",
    universities: ["University of Zimbabwe", "NUST", "HIT"],
    requirements: "Mathematics and Physics A Level (C or better)",
    careerPaths: ["Software Engineer", "Hardware Engineer", "Systems Architect", "IoT Developer"]
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
      return details.explanation;
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
  return "I can help you with:\n1. Python programming\n2. Visual Basic programming\n3. Programming concepts\n4. Career guidance\n5. University programs in Zimbabwe\n\nFeel free to ask any questions!";
};