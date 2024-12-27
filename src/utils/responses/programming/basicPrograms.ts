export interface ProgramExample {
  python: string;
  visualBasic: string;
  explanation: string;
}

export const basicPrograms: Record<string, ProgramExample> = {
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
