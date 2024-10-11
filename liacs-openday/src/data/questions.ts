// questions.ts

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
  def calculate_average(numbers):
      total = sum(numbers)
      return total / len(total)
  `,
      correctLineNumber: 2,
    },
    {
      codeSnippet: `
  function isEven(num) {
      return num % 2 == 1;
  }
  `,
      correctLineNumber: 1,
    },
    {
      codeSnippet: `
  #include <iostream>
  int main() {
      int arr[5] = {1, 2, 3, 4, 5};
      for (int i = 0; i <= 5; ++i) {
          std::cout << arr[i] << " ";
      }
      return 0;
  }
  `,
      correctLineNumber: 4,
    },
    {
      codeSnippet: `
  let obj = {a: 1, b: 2, c: 3};
  for (let key in obj) {
      console.log(obj.key);
  }
  `,
      correctLineNumber: 2,
    },
    {
      codeSnippet: `
  def merge_dicts(a, b):
      return a.update(b)
  
  d1 = {'x': 1}
  d2 = {'y': 2}
  print(merge_dicts(d1, d2))
  `,
      correctLineNumber: 2,
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
      correctLineNumber: 6,
    },
    {
      codeSnippet: `
  let arr = [1, 2, 3];
  arr.map(x => x * 2);
  console.log(arr);
  `,
      correctLineNumber: 4,
    },
    {
      codeSnippet: `
  class MyClass:
      def __init__(self, value):
          self.value = value
  
      def get_value():
          return self.value
  
  obj = MyClass(10)
  print(obj.get_value())
  `,
      correctLineNumber: 5,
    },
    {
      codeSnippet: `
  #include <iostream>
  void printMessage(const char* msg) {
      if (msg == NULL) {
          std::cout << "No message" << std::endl;
      }
      std::cout << msg << std::endl;
  }
  
  int main() {
      printMessage(NULL);
      return 0;
  }
  `,
      correctLineNumber: 6,
    },
    {
      codeSnippet: `
  let x = 5;
  if (x = 10) {
      console.log('x is 10');
  }
  `,
      correctLineNumber: 3,
    },
    {
      codeSnippet: `
  def append_to_list(value, lst=[]):
      lst.append(value)
      return lst
  
  print(append_to_list(1))
  print(append_to_list(2))
  `,
      correctLineNumber: 1,
    },
    {
      codeSnippet: `
  #include <iostream>
  int main() {
      int arr[5];
      for (int i = 0; i < 5; ++i)
          arr[i] = i * 2;
      delete[] arr;
      return 0;
  }
  `,
      correctLineNumber: 6,
    },
    {
      codeSnippet: `
  let arr = [1, 2, 3];
  console.log(arr.length());
  `,
      correctLineNumber: 3,
    },
    {
      codeSnippet: `
  def area_of_circle(r):
      from math import pi
      return pi * r * r
  
  print(area_of_circle('5'))
  `,
      correctLineNumber: 5,
    },
    {
      codeSnippet: `
  #include <iostream>
  class Base {
  public:
      virtual void show() { std::cout << "Base\\n"; }
  };
  
  class Derived : public Base {
      void show() { std::cout << "Derived\\n"; }
  };
  
  int main() {
      Base *b = new Derived();
      b->show();
      return 0;
  }
  `,
      correctLineNumber: 7,
    },
    {
      codeSnippet: `
  let x = NaN;
  if (x === NaN) {
      console.log('x is NaN');
  }
  `,
      correctLineNumber: 3,
    },
    {
      codeSnippet: `
  def increment(n):
      n += 1
  
  num = 5
  increment(num)
  print(num)
  `,
      correctLineNumber: 4,
    },
    {
      codeSnippet: `
  #include <iostream>
  #include <string>
  int main() {
      std::string s = "hello";
      if (s.compare("hello") == -1) {
          std::cout << "Strings are equal" << std::endl;
      }
      return 0;
  }
  `,
      correctLineNumber: 6,
    },
    {
      codeSnippet: `
  function addToList(item, list = []) {
      list.push(item);
      return list;
  }
  
  console.log(addToList(1));
  console.log(addToList(2));
  `,
      correctLineNumber: 1,
    },
    {
      codeSnippet: `
  def func(a, b, c):
      print(a, b, c)
  
  func(*[1, 2])
  `,
      correctLineNumber: 5,
    },
  ].map((question) => ({
    ...question,
    codeSnippet: trimFirstLine(question.codeSnippet), // Apply trimming to each question's snippet
  }));
  