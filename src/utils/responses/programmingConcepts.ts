export interface ProgrammingConcept {
  python: string;
  visualBasic: string;
  explanation: string;
}

export const programmingConcepts: Record<string, ProgrammingConcept> = {
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
