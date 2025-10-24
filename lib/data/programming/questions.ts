export interface ProgrammingQuestion {
  id: string;
  language: 'Python' | 'JavaScript' | 'C++';
  title: string;
  description: string;
  code: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

const programmingQuestions: ProgrammingQuestion[] = [
  {
    id: 'python-list-comprehension',
    language: 'Python',
    title: 'List Comprehension Bug',
    description: 'Generate squares of even numbers, but something is off:',
    code: `numbers = [1, 2, 3, 4, 5, 6]
result = [x**2 for x in numbers if x % 2 = 0]
print(result)`,
    options: [
      'Change x**2 to x*2',
      'Change = to == inside the comprehension',
      'Move the if clause before for',
      'Remove the if clause entirely',
    ],
    correctAnswer: 1,
    explanation:
      'The comprehension uses the assignment operator. Replace `=` with `==` to compare the remainder.',
    difficulty: 'Easy',
    category: 'Syntax',
  },
  {
    id: 'javascript-sum-array',
    language: 'JavaScript',
    title: 'Function Scope Issue',
    description: 'This function should return the sum of an array:',
    code: `function sumArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`,
    options: [
      'Initialize sum before the loop',
      'Change let to var for i',
      'Use arr.forEach instead of the loop',
      'Move the return statement inside the loop',
    ],
    correctAnswer: 0,
    explanation: 'The accumulator `sum` was never declared or initialised in the function.',
    difficulty: 'Medium',
    category: 'Variables',
  },
  {
    id: 'cpp-find-max',
    language: 'C++',
    title: 'Finding Maximum Value',
    description: 'This function attempts to find the maximum element but crashes:',
    code: `int findMax(const std::vector<int>& values) {
  int max = 0;
  for (size_t i = 0; i <= values.size(); ++i) {
    if (values[i] > max) {
      max = values[i];
    }
  }
  return max;
}`,
    options: [
      'Change <= to < in the loop condition',
      'Initialise max with values[0]',
      'Both of the above fixes are required',
      'Use std::max instead of manual comparison',
    ],
    correctAnswer: 2,
    explanation:
      'The loop runs one step too far and the initial max should come from the first element to handle negatives.',
    difficulty: 'Hard',
    category: 'Loops',
  },
  {
    id: 'python-slice-off-by-one',
    language: 'Python',
    title: 'Off-by-One Slice',
    description: 'Return the first three items of a list, but the result is missing an element:',
    code: `items = ['a', 'b', 'c', 'd']
print(items[0:2])`,
    options: [
      'Use items[:3] instead',
      'Use items[0:3] instead',
      'Use items[1:3] instead',
      'Use items[-3:] instead',
    ],
    correctAnswer: 1,
    explanation:
      'List slicing is end-exclusive; `items[0:3]` (or `items[:3]`) returns the first three elements.',
    difficulty: 'Easy',
    category: 'Slicing',
  },
  {
    id: 'python-mutable-default',
    language: 'Python',
    title: 'Mutable Default Argument',
    description: 'Appending to a list default behaves strangely between calls:',
    code: `def append_item(value, bucket=[]):
  bucket.append(value)
  return bucket

print(append_item(1))
print(append_item(2))`,
    options: [
      'Move bucket=[] into the function body',
      'Replace [] with None and create a new list when needed',
      'Call bucket.clear() before appending',
      'Use bucket = list() as the default',
    ],
    correctAnswer: 1,
    explanation:
      'Default arguments are evaluated once. Use None as the default and create a new list inside the function.',
    difficulty: 'Medium',
    category: 'Functions',
  },
  {
    id: 'python-dict-iteration',
    language: 'Python',
    title: 'Changing Dictionary While Iterating',
    description: 'Removing keys while iterating raises a runtime error:',
    code: `grades = {'alice': 8, 'bob': 5, 'carla': 10}
for student, score in grades.items():
  if score < 6:
    del grades[student]`,
    options: [
      'Use grades.copy().items() in the loop',
      'Iterate over list(grades.items())',
      'Collect keys to delete and remove them afterwards',
      'All of the above are valid fixes',
    ],
    correctAnswer: 3,
    explanation:
      'Removing entries while iterating invalidates the iterator; iterate over a copy or collect keys first.',
    difficulty: 'Medium',
    category: 'Iteration',
  },
  {
    id: 'javascript-settimeout-loop',
    language: 'JavaScript',
    title: 'Loop with setTimeout',
    description: 'What prints when using setTimeout inside a for loop?',
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    options: ['0 1 2', '3 3 3', '0 0 0', '0 1 2 with delays'],
    correctAnswer: 1,
    explanation:
      '`var` is function-scoped, so each callback sees the final value (3). Use let or IIFE to capture the value.',
    difficulty: 'Medium',
    category: 'Async',
  },
  {
    id: 'javascript-json-parse',
    language: 'JavaScript',
    title: 'Parsing JSON Safely',
    description: 'The function crashes when invalid JSON is passed:',
    code: `function safeParse(json) {
  return JSON.parse(json) || {};
}`,
    options: [
      'Wrap JSON.parse in try/catch',
      'Replace || with ??',
      'Call JSON.stringify first',
      'Use eval instead of JSON.parse',
    ],
    correctAnswer: 0,
    explanation:
      'Invalid JSON throws; surround JSON.parse with try/catch and return a fallback object on failure.',
    difficulty: 'Easy',
    category: 'Error Handling',
  },
  {
    id: 'javascript-equality-pitfall',
    language: 'JavaScript',
    title: 'Loose Equality Bug',
    description: 'A check lets unexpected values pass:',
    code: `function isTen(value) {
  if (value == 10) {
    return true;
  }
  return false;
}`,
    options: [
      'Use === instead of ==',
      'Cast value to Number before comparing',
      'Return Boolean(value == 10)',
      'Check typeof value !== "string"',
    ],
    correctAnswer: 0,
    explanation:
      'Loose equality coerces strings and booleans. Use strict equality (`===`) for exact comparisons.',
    difficulty: 'Easy',
    category: 'Comparison',
  },
  {
    id: 'cpp-reference-return',
    language: 'C++',
    title: 'Dangling Reference',
    description: 'The function returns a reference to a local variable:',
    code: `const std::string& buildName() {
  std::string name = \"LIACS\";
  return name;
}`,
    options: [
      'Make name static inside the function',
      'Return std::string by value instead',
      'Allocate name with new',
      'Pass a buffer into the function',
    ],
    correctAnswer: 1,
    explanation:
      'Returning a reference to a local object is undefined behaviour. Return by value or use a static/global.',
    difficulty: 'Hard',
    category: 'Memory',
  },
  {
    id: 'cpp-range-for-copy',
    language: 'C++',
    title: 'Unintended Copy in Range-For',
    description: 'Updates inside the loop are ignored afterwards:',
    code: `std::vector<int> numbers{1, 2, 3};
for (auto num : numbers) {
  num *= 2;
}
// numbers still contains 1,2,3`,
    options: [
      'Use auto& num in the loop',
      'Use numbers[i] *= 2 instead',
      'Call numbers.assign(numbers.begin(), numbers.end())',
      'Use std::transform instead of a loop',
    ],
    correctAnswer: 0,
    explanation:
      'The loop iterates by value. Use a reference (`auto&`) to modify the elements in place.',
    difficulty: 'Medium',
    category: 'Iteration',
  },
  {
    id: 'javascript-floating-point',
    language: 'JavaScript',
    title: 'Floating Point Surprise',
    description: 'Why does the comparison fail?',
    code: `const sum = 0.1 + 0.2;
if (sum === 0.3) {
  console.log('match');
}`,
    options: [
      'Use == instead of ===',
      'Round sum before comparing',
      'Multiply by 10 before adding',
      'It should work; the bug is elsewhere',
    ],
    correctAnswer: 1,
    explanation:
      'Binary floating point introduces rounding error. Round (or compare within a tolerance) before comparing.',
    difficulty: 'Medium',
    category: 'Numbers',
  },
];

export default programmingQuestions;
