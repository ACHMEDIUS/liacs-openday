// Function to trim the first line if it's blank
const trimFirstLine = (codeSnippet: string): string => {
  const lines = codeSnippet.split("\n");
  if (lines.length > 0 && lines[0].trim() === "") {
    return lines.slice(1).join("\n"); // Remove the first blank line
  }
  return codeSnippet; // Return unmodified if the first line isn't blank
};

// Define the Question type for type safety
interface Question {
  codeSnippet: string;
  correctLineNumber: number; // zero-based index
}

export const questions: Question[] = [
  // 1. Python snippet: Error when concatenating a string and a number
  {
    codeSnippet: `
def multiply(a, b):
    return a * b
result = multiply(2, 3)
print("Result is " + result)
`,
    correctLineNumber: 3,
  },

  // 2. JavaScript snippet: Typo in the function call ('squre' instead of 'square')
  {
    codeSnippet: `
function square(x) {
    return x * x;
}
console.log("Square of 4 is: " + squre(4));
`,
    correctLineNumber: 3,
  },

  // 3. Java snippet: Using an undefined variable 'c'
  {
    codeSnippet: `
public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 5;
        System.out.println(a / c);
    }
}
`,
    correctLineNumber: 4,
  },

  // 4. TypeScript snippet: Passing a number instead of a string
  {
    codeSnippet: `
function greet(name: string): string {
    return "Hello, " + name;
}
console.log(greet("Alice"));
console.log(greet(42));
`,
    correctLineNumber: 4,
  },

  // 5. C snippet: Missing semicolon after variable declaration
  {
    codeSnippet: `
#include <stdio.h>
int main() {
    int x = 10
    printf("Value: %d\n", x);
    return 0;
}
`,
    correctLineNumber: 2,
  },

  // 6. C++ snippet: Using an undefined variable 'y'
  {
    codeSnippet: `
#include <iostream>
using namespace std;
int main() {
    int x = 5;
    cout << "Value is: " << x << endl;
    cout << "Next value: " << y << endl;
    return 0;
}
`,
    correctLineNumber: 5,
  },

  // 7. Ruby snippet: Incorrect number of arguments passed to the method
  {
    codeSnippet: `
def add(a, b)
  a + b
end
puts add(2, 3)
puts add(2)
`,
    correctLineNumber: 4,
  },

  // 8. Go snippet: Using an invalid operator '**' for exponentiation
  {
    codeSnippet: `
package main
import "fmt"
func main() {
    x := 10
    fmt.Println("Value:", x)
    fmt.Println("Double:", x * 2)
    fmt.Println("Triple:", x ** 3)
}
`,
    correctLineNumber: 6,
  },

  // 9. PHP snippet: Typo in the function call ('sayHelo' instead of 'sayHello')
  {
    codeSnippet: `
<?php
function sayHello($name) {
    return "Hello, " . $name;
}
echo sayHello("World");
echo sayHelo("User");
?>
`,
    correctLineNumber: 5,
  },

  // 10. SQL snippet: Misspelled column name in the ORDER BY clause
  {
    codeSnippet: `
SELECT id, name, age
FROM users
WHERE age > 20
ORDER BY nmae;
`,
    correctLineNumber: 3,
  },
].map((question) => ({
  ...question,
  codeSnippet: trimFirstLine(question.codeSnippet), // Apply trimming to each snippet
}));
