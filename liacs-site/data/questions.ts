// Function to trim the first line if it's blank
const trimFirstLine = (codeSnippet: string): string => {
    const lines = codeSnippet.split('\n');
    if (lines.length > 0 && lines[0].trim() === '') {
      return lines.slice(1).join('\n'); // Remove the first blank line
    }
    return codeSnippet; // Return unmodified if the first line isn't blank
  };
  
  // Define the Question type for type safety
  interface Question {
    codeSnippet: string;
    correctLineNumber: number;
  }
  
  export const questions: Question[] = [
    {
      codeSnippet: `
  def add(a, b):
      result = a + b
      return result
  print(result)
  `,
      correctLineNumber: 3,
    },
    {
      codeSnippet: `
  #include <iostream>
  int main() {
      int *p = new int(5);
      std::cout << *p << std::endl;
      delete p;
      delete p;
      return 0;
  }
  `,
      correctLineNumber: 5,
    },
    {
      codeSnippet: `
  #include <iostream>
  using namespace std;

  int main() {
      cout << "Enter a number: " << endl;
      cin >> x;  
      cout << "You entered: " << x << endl;
      
      return 0;
  }
  `,
      correctLineNumber: 5,
    },
    {
      codeSnippet: `
  for i in range(5):

      print("Number: " + i)
  print(i)
  `,
      correctLineNumber: 3,
    },
    {
      codeSnippet: `
  #include <iostream>
  using namespace std;

  void sayHello() {
      cout << message << endl;
  }

  int main() {
      string message = "Hello, world!";
      sayHello();
      return 0;
  }
  `,
      correctLineNumber: 4,
    },
    {
      codeSnippet: `
  my_list = [1, 2, 3]
  
  print(my_list[3])
  `,
      correctLineNumber: 2,
    },
  ].map((question) => ({
    ...question,
    codeSnippet: trimFirstLine(question.codeSnippet), // Apply trimming to each question's snippet
  }));
  