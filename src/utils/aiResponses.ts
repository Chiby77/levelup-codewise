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

const practicalExamples: Record<string, ProgrammingConcept> = {
  "calculator": {
    python: `# Python Calculator Program
def calculator():
    print("Simple Calculator")
    print("1. Add")
    print("2. Subtract")
    print("3. Multiply")
    print("4. Divide")
    
    choice = input("Enter choice (1-4): ")
    num1 = float(input("Enter first number: "))
    num2 = float(input("Enter second number: "))
    
    if choice == '1':
        print(f"{num1} + {num2} = {num1 + num2}")
    elif choice == '2':
        print(f"{num1} - {num2} = {num1 - num2}")
    elif choice == '3':
        print(f"{num1} * {num2} = {num1 * num2}")
    elif choice == '4':
        if num2 != 0:
            print(f"{num1} / {num2} = {num1 / num2}")
        else:
            print("Error: Cannot divide by zero")
    else:
        print("Invalid input")

calculator()`,
    visualBasic: `' Visual Basic Calculator Program
Module Calculator
    Sub Main()
        Console.WriteLine("Simple Calculator")
        Console.WriteLine("1. Add")
        Console.WriteLine("2. Subtract")
        Console.WriteLine("3. Multiply")
        Console.WriteLine("4. Divide")
        
        Console.Write("Enter choice (1-4): ")
        Dim choice As String = Console.ReadLine()
        
        Console.Write("Enter first number: ")
        Dim num1 As Double = Double.Parse(Console.ReadLine())
        
        Console.Write("Enter second number: ")
        Dim num2 As Double = Double.Parse(Console.ReadLine())
        
        Select Case choice
            Case "1"
                Console.WriteLine($"{num1} + {num2} = {num1 + num2}")
            Case "2"
                Console.WriteLine($"{num1} - {num2} = {num1 - num2}")
            Case "3"
                Console.WriteLine($"{num1} * {num2} = {num1 * num2}")
            Case "4"
                If num2 <> 0 Then
                    Console.WriteLine($"{num1} / {num2} = {num1 / num2}")
                Else
                    Console.WriteLine("Error: Cannot divide by zero")
                End If
            Case Else
                Console.WriteLine("Invalid input")
        End Select
    End Sub
End Module`,
    explanation: "A simple calculator program that performs basic arithmetic operations (addition, subtraction, multiplication, division) based on user input."
  },
  "temperature converter": {
    python: `# Python Temperature Converter
def celsius_to_fahrenheit(celsius):
    return (celsius * 9/5) + 32

def fahrenheit_to_celsius(fahrenheit):
    return (fahrenheit - 32) * 5/9

# Example usage
celsius = 25
fahrenheit = celsius_to_fahrenheit(celsius)
print(f"{celsius}°C is equal to {fahrenheit}°F")

fahrenheit = 77
celsius = fahrenheit_to_celsius(fahrenheit)
print(f"{fahrenheit}°F is equal to {celsius}°C")`,
    visualBasic: `' Visual Basic Temperature Converter
Module TemperatureConverter
    Function CelsiusToFahrenheit(celsius As Double) As Double
        Return (celsius * 9/5) + 32
    End Function
    
    Function FahrenheitToCelsius(fahrenheit As Double) As Double
        Return (fahrenheit - 32) * 5/9
    End Function
    
    Sub Main()
        Dim celsius As Double = 25
        Dim fahrenheit As Double = CelsiusToFahrenheit(celsius)
        Console.WriteLine($"{celsius}°C is equal to {fahrenheit}°F")
        
        fahrenheit = 77
        celsius = FahrenheitToCelsius(fahrenheit)
        Console.WriteLine($"{fahrenheit}°F is equal to {celsius}°C")
    End Sub
End Module`,
    explanation: "A temperature converter program that converts between Celsius and Fahrenheit scales using conversion formulas."
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
  
  // Check for programming task requests
  if (lowercaseInput.includes("program") || lowercaseInput.includes("code") || lowercaseInput.includes("write")) {
    // Check for specific program requests
    for (const [program, details] of Object.entries(practicalExamples)) {
      if (lowercaseInput.includes(program)) {
        if (lowercaseInput.includes("python")) {
          return `Here's a ${program} program in Python:\n\n${details.python}\n\n${details.explanation}`;
        }
        if (lowercaseInput.includes("visual basic") || lowercaseInput.includes("vb")) {
          return `Here's a ${program} program in Visual Basic:\n\n${details.visualBasic}\n\n${details.explanation}`;
        }
        return `Here are examples of a ${program} program:\n\nPython:\n${details.python}\n\nVisual Basic:\n${details.visualBasic}\n\n${details.explanation}`;
      }
    }
    
    // Generic programming request
    return "I can help you with programming tasks! Here are some examples I can provide:\n" +
           "1. Calculator program\n" +
           "2. Temperature converter\n" +
           "\nJust ask for a specific program in Python or Visual Basic, for example:\n" +
           "- 'Write a calculator program in Python'\n" +
           "- 'Show me a temperature converter in Visual Basic'";
  }

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
