export interface ProgrammingExample {
  python: string;
  visualBasic: string;
  explanation: string;
}

export const practicalExamples: Record<string, ProgrammingExample> = {
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
  },
  "fibonacci": {
    python: `# Python Fibonacci Program
def fibonacci(n):
    if n <= 0:
        return "Please enter a positive number"
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    return sequence

# Example usage
n = 10
result = fibonacci(n)
print(f"First {n} numbers of Fibonacci sequence: {result}")`,
    visualBasic: `' Visual Basic Fibonacci Program
Module FibonacciProgram
    Function Fibonacci(n As Integer) As List(Of Long)
        Dim sequence As New List(Of Long)
        
        If n <= 0 Then
            Return sequence
        End If
        
        sequence.Add(0)
        If n = 1 Then
            Return sequence
        End If
        
        sequence.Add(1)
        For i As Integer = 2 To n - 1
            sequence.Add(sequence(i-1) + sequence(i-2))
        Next
        
        Return sequence
    End Function
    
    Sub Main()
        Dim n As Integer = 10
        Dim result = Fibonacci(n)
        Console.WriteLine($"First {n} numbers of Fibonacci sequence:")
        For Each num In result
            Console.Write($"{num} ")
        Next
    End Sub
End Module`,
    explanation: "A program that generates the Fibonacci sequence up to n numbers. The Fibonacci sequence is a series where each number is the sum of the two preceding ones, usually starting with 0 and 1."
  },
  "prime numbers": {
    python: `# Python Prime Numbers Program
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

def find_primes(start, end):
    primes = []
    for num in range(start, end + 1):
        if is_prime(num):
            primes.append(num)
    return primes

# Example usage
start = 1
end = 50
prime_numbers = find_primes(start, end)
print(f"Prime numbers between {start} and {end}: {prime_numbers}")`,
    visualBasic: `' Visual Basic Prime Numbers Program
Module PrimeNumbers
    Function IsPrime(n As Integer) As Boolean
        If n < 2 Then
            Return False
        End If
        
        For i As Integer = 2 To Math.Sqrt(n)
            If n Mod i = 0 Then
                Return False
            End If
        Next
        
        Return True
    End Function
    
    Function FindPrimes(start As Integer, ending As Integer) As List(Of Integer)
        Dim primes As New List(Of Integer)
        
        For num As Integer = start To ending
            If IsPrime(num) Then
                primes.Add(num)
            End If
        Next
        
        Return primes
    End Function
    
    Sub Main()
        Dim start As Integer = 1
        Dim ending As Integer = 50
        Dim primeNumbers = FindPrimes(start, ending)
        
        Console.WriteLine($"Prime numbers between {start} and {ending}:")
        For Each num In primeNumbers
            Console.Write($"{num} ")
        Next
    End Sub
End Module`,
    explanation: "A program that finds all prime numbers within a given range. A prime number is a natural number greater than 1 that is only divisible by 1 and itself."
  }
};
