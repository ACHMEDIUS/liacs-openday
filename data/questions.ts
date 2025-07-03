const trimFirstLine = (codeSnippet: string): string => {
  const lines = codeSnippet.split('\n');
  if (lines.length > 0 && lines[0].trim() === '') {
    return lines.slice(1).join('\n');
  }
  return codeSnippet;
};

interface CodeQuestion {
  codeSnippet: string;
  correctLineNumber: number;
}

export const questions: CodeQuestion[] = [
  {
    codeSnippet: `
def multiply(a, b):
    return a * b
result = multiply(2, 3)
print("Result is " + result)
`,
    correctLineNumber: 3,
  },
  {
    codeSnippet: `
function square(x) {
    return x * x;
}
console.log("Square of 4 is: " + squre(4));
`,
    correctLineNumber: 3,
  },
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
  {
    codeSnippet: `
def add(a, b):
  a + b
end
puts add(2, 3)
puts add(2)
`,
    correctLineNumber: 4,
  },
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
  {
    codeSnippet: `
SELECT id, name, age
FROM users
WHERE age > 20
ORDER BY nmae;
`,
    correctLineNumber: 3,
  },
  {
    codeSnippet: `
let items = [1, 2, 3];
for (let i = 0; i <= items.length; i++) {
    console.log(items[i]);
}
`,
    correctLineNumber: 2,
  },
  {
    codeSnippet: `
class Calculator:
    def __init__(self):
        self.result = 0
    
    def add(self, x):
        self.result += x
        return self
    
calc = Calculator()
calc.add(5).add(3)
print(calc.result)
`,
    correctLineNumber: 9,
  },
].map(question => ({
  ...question,
  codeSnippet: trimFirstLine(question.codeSnippet),
}));
