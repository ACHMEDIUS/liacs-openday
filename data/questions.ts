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
  language: string;
  title: string;
  description: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

const rawQuestions = [
  {
    codeSnippet: `numbers = [1, 2, 3, 4, 5, 6]
result = [x**2 for x in numbers if x % 2 = 0]
print(result)`,
    correctLineNumber: 1,
    language: 'Python',
    title: 'List Comprehension Bug',
    description: 'This code should create a list of squares for even numbers, but it has a bug:',
    options: [
      'Change x**2 to x*2',
      'Change = to ==',
      'Change % to //',
      'Add parentheses around x % 2',
    ],
    correctAnswer: 1,
    explanation: 'The bug is using = (assignment) instead of == (comparison) in the condition.',
    difficulty: 'Easy' as const,
    category: 'Syntax',
  },
  {
    codeSnippet: `function sumArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`,
    correctLineNumber: 2,
    language: 'JavaScript',
    title: 'Function Scope Issue',
    description: "This function should return the sum of an array, but it doesn't work:",
    options: [
      'Initialize sum variable before the loop',
      'Change let to var',
      'Use arr.forEach instead',
      'Add semicolon after return sum',
    ],
    correctAnswer: 0,
    explanation: 'The variable "sum" is not declared. It should be initialized before the loop.',
    difficulty: 'Medium' as const,
    category: 'Variables',
  },
  {
    codeSnippet: `public static int findMax(int[] arr) {
  int max = 0;
  for (int i = 0; i <= arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
    correctLineNumber: 2,
    language: 'Java',
    title: 'Array Index Bug',
    description: 'This code should find the maximum value in an array:',
    options: ['Change <= to <', 'Initialize max to arr[0]', 'Both A and B', 'Change i++ to ++i'],
    correctAnswer: 2,
    explanation:
      'Two bugs: loop condition should be < (not <=) to avoid index out of bounds, and max should be initialized to arr[0] to handle negative numbers.',
    difficulty: 'Hard' as const,
    category: 'Arrays',
  },
  {
    codeSnippet: `name = "Alice"
age = 25
message = "Hello, " + name + ", you are " + age + " years old"
print(message)`,
    correctLineNumber: 2,
    language: 'Python',
    title: 'String Concatenation Error',
    description: 'This code should print a greeting message:',
    options: [
      'Convert age to string: str(age)',
      'Use f-string formatting',
      'Both A and B would work',
      'Add parentheses around age',
    ],
    correctAnswer: 2,
    explanation:
      'Python cannot concatenate strings with integers directly. Either convert age to string or use f-string formatting.',
    difficulty: 'Easy' as const,
    category: 'Type Conversion',
  },
  {
    codeSnippet: `for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, 100);
}`,
    correctLineNumber: 0,
    language: 'JavaScript',
    title: 'Closure Problem',
    description: 'This code should create buttons that alert their index when clicked:',
    options: [
      'Change var to let',
      'Use an IIFE',
      'Both A and B would work',
      'Add i++ inside setTimeout',
    ],
    correctAnswer: 2,
    explanation:
      'The var keyword has function scope, so all timeouts reference the same i. Using let (block scope) or an IIFE would fix this.',
    difficulty: 'Medium' as const,
    category: 'Closures',
  },
  {
    codeSnippet: `int* createArray(int size) {
  int* arr = new int[size];
  for(int i = 0; i < size; i++) {
    arr[i] = i * 2;
  }
  return arr;
}`,
    correctLineNumber: -1, // No specific line bug, conceptual issue
    language: 'C++',
    title: 'Memory Leak',
    description: 'This code has a memory issue:',
    options: [
      'Missing delete[] in the function',
      'Should use vector instead',
      'The caller must delete[] the returned pointer',
      'Change new to malloc',
    ],
    correctAnswer: 2,
    explanation:
      'The function correctly allocates and returns dynamic memory. The caller is responsible for calling delete[] on the returned pointer.',
    difficulty: 'Hard' as const,
    category: 'Memory Management',
  },
  {
    codeSnippet: `def remove_duplicates(lst):
  for item in lst:
    if lst.count(item) > 1:
      lst.remove(item)
  return lst`,
    correctLineNumber: 1,
    language: 'Python',
    title: 'List Mutation Bug',
    description: 'This function should remove duplicates from a list:',
    options: [
      'Modifying list while iterating causes issues',
      "count() method doesn't exist",
      'remove() removes all occurrences',
      'Missing return statement',
    ],
    correctAnswer: 0,
    explanation:
      'Modifying a list while iterating over it can cause unexpected behavior. Use a copy or different approach.',
    difficulty: 'Medium' as const,
    category: 'Lists',
  },
  {
    codeSnippet: `async function getData() {
  const response = fetch('https://api.example.com/data');
  const data = response.json();
  return data;
}`,
    correctLineNumber: 1,
    language: 'JavaScript',
    title: 'Async/Await Error',
    description: 'This code should fetch data but has an error:',
    options: [
      'Missing await before fetch',
      'Missing await before response.json()',
      'Both A and B',
      'Should use .then() instead',
    ],
    correctAnswer: 2,
    explanation:
      'Both fetch and response.json() return promises and need await in an async function.',
    difficulty: 'Easy' as const,
    category: 'Async Programming',
  },
  {
    codeSnippet: `String str1 = new String("hello");
String str2 = new String("hello");
if (str1 == str2) {
  System.out.println("Strings are equal");
}`,
    correctLineNumber: 2,
    language: 'Java',
    title: 'String Comparison Bug',
    description: 'This code checks if two strings are equal:',
    options: [
      'Should use .equals() instead of ==',
      'Strings are not initialized correctly',
      'Missing else statement',
      'Should use === instead',
    ],
    correctAnswer: 0,
    explanation:
      'In Java, == compares object references, not string content. Use .equals() for string comparison.',
    difficulty: 'Easy' as const,
    category: 'String Comparison',
  },
  {
    codeSnippet: `def add_item(item, list=[]):
  list.append(item)
  return list

result1 = add_item(1)
result2 = add_item(2)`,
    correctLineNumber: 0,
    language: 'Python',
    title: 'Default Parameter Bug',
    description: 'This function has a subtle bug with default parameters:',
    options: [
      'Mutable default arguments persist between calls',
      "append() method doesn't exist",
      'Missing return statement',
      'list is a reserved keyword',
    ],
    correctAnswer: 0,
    explanation:
      'Mutable default arguments in Python persist between function calls. Use None as default and create new list inside function.',
    difficulty: 'Hard' as const,
    category: 'Functions',
  },
];

export const questions: CodeQuestion[] = rawQuestions.map(question => ({
  ...question,
  codeSnippet: trimFirstLine(question.codeSnippet),
}));
