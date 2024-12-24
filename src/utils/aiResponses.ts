interface ProgrammingConcept {
  python: string;
  visualBasic: string;
  explanation: string;
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

export const generateResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
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
  return "I can help you with Python and Visual Basic programming concepts. Try asking about specific topics like variables, if statements, loops, or arrays. You can also ask for general explanations about Python or Visual Basic.";
};