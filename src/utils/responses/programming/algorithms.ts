export interface ProgramExample {
  python: string;
  visualBasic: string;
  explanation: string;
}

export const algorithms: Record<string, ProgramExample> = {
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
