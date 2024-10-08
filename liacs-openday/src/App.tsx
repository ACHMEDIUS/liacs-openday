import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import QuestionBox from './components/QuestionBox';
import ScoreCounter from './components/ScoreCounter';

// Function to trim the first line if it's blank
const trimFirstLine = (codeSnippet: string) => {
  const lines = codeSnippet.split('\n');
  if (lines.length > 0 && lines[0].trim() === '') {
    return lines.slice(1).join('\n'); // Remove the first blank line
  }
  return codeSnippet; // Return unmodified if the first line isn't blank
};

const App: React.FC = () => {
  const [score, setScore] = useState<number>(0);

  const questions = [
    {
      codeSnippet: `
function add(a, b) {
  return a + b;
}

console.log(add(2 3)); // Missing comma between arguments
`,
      correctLineNumber: 2,
    },
    {
      codeSnippet: `
def greet(name):
    print("Hello, " + name)

greet("World" // Missing closing parenthesis
`,
      correctLineNumber: 3,
    },
    {
      codeSnippet: `
#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!" << end; // Typo: should be 'endl'
  return 0;
}
`,
      correctLineNumber: 5,
    },
    {
      codeSnippet: `
const multiply = (x, y) => {
  return x *;
} // Syntax error: incomplete expression
`,
      correctLineNumber: 3,
    },
    {
      codeSnippet: `
if True
  print("Missing colon in the if statement") // Missing colon after 'if True'
`,
      correctLineNumber: 2,
    },
    {
      codeSnippet: `
SELECT * FRM users; // Typo: should be 'FROM'
`,
      correctLineNumber: 2,
    },
    {
      codeSnippet: `
<html>
  <head><title>Sample</title></head>
  <body>
    <p>Unclosed paragraph
  </body>
</html>
`,
      correctLineNumber: 5,
    },
    {
      codeSnippet: `
def factorial(n):
    if n == 1:
        return n
    else:
        return n * factorial(n - ) # Missing argument in recursive call
`,
      correctLineNumber: 6,
    },
    {
      codeSnippet: `
const obj = {
  name: "John",
  age: 30,
  country: "USA",
} // Trailing comma in the last property
`,
      correctLineNumber: 5,
    },
    {
      codeSnippet: `
def main() {
  printf("Hello World!");  // Missing #include <stdio.h> in C
}
`,
      correctLineNumber: 2,
    },
  ].map((question) => ({
    ...question,
    codeSnippet: trimFirstLine(question.codeSnippet), // Apply trimming to each question's snippet
  }));

  return (
    <Box
      sx={{
        backgroundColor: '#121212',
        minHeight: '100vh',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Website Title */}
      <Box sx={{ width: '90%', position: 'relative' }}>
        <Typography variant="h4" sx={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
          Find the mistakes in the following code snippets, to win a prize
        </Typography>

        {/* Score Counter on the top-right corner */}
        <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
          <ScoreCounter score={score} totalQuestions={questions.length} />
        </Box>
      </Box>

      {/* Render All Questions Below Each Other */}
      {questions.map((question, index) => (
        <QuestionBox
          key={index}
          codeSnippet={question.codeSnippet}
          correctLineNumber={question.correctLineNumber}
          onLineClick={() => setScore((prev) => prev + 1)}
        />
      ))}
    </Box>
  );
};

export default App;
