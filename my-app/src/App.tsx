import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
import QuestionBox from './components/QuestionBox';

const App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>(Array(5).fill(false)); // Track answers for all questions

  const questions = [
    {
      question: 'What is the mistake in the following Python code?',
      correctLine: 1,
      code: (
        <>
          <code>for i in range(5):</code>
          <br />
          <code>print(i)</code> {/* This line has a mistake (should be indented) */}
        </>
      ),
    },
    {
      question: 'What is the mistake in the following C++ code?',
      correctLine: 2,
      code: (
        <>
          <code>#include &lt;iostream&gt;</code>
          <br />
          <code>int main() {"{"}</code>
          <br />
          <code>std::cout &lt;&lt; "Hello, World!";</code> {/* Missing `return 0;` */}
          <br />
          <code>{"}"}</code>
        </>
      ),
    },
    {
      question: 'Find the mistake in the Python function.',
      correctLine: 1,
      code: (
        <>
          <code>def add_numbers(a, b):</code>
          <br />
          <code>return a + b + c</code> {/* `c` is not defined */}
        </>
      ),
    },
    {
      question: 'What is wrong in this C++ loop?',
      correctLine: 1,
      code: (
        <>
          <code>for(int i = 0; i &lt; 10; i--)</code> {/* `i--` should be `i++` */}
          <br />
          <code>{"{"}</code>
          <br />
          <code>std::cout &lt;&lt; i;</code>
          <br />
          <code>{"}"}</code>
        </>
      ),
    },
    {
      question: 'Find the mistake in the Python list manipulation.',
      correctLine: 1,
      code: (
        <>
          <code>my_list = [1, 2, 3]</code>
          <br />
          <code>print(myList[0])</code> {/* Incorrect variable name `myList` */}
        </>
      ),
    },
  ];

  const handleAnswer = (index: number, isCorrect: boolean) => {
    const newAnswers = [...answers];
    newAnswers[index] = isCorrect;
    setAnswers(newAnswers);
  };

  const handleSubmitAll = () => {
    const totalScore = answers.filter((answer) => answer).length;
    setScore(totalScore);
  };

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-6">
        Interactive Coding Quiz
      </Typography>
      <Typography variant="h6" className="mb-6">
        Score: {score}/{questions.length}
      </Typography>
      {questions.map((question, index) => (
        <QuestionBox
          key={index}
          question={question.question}
          correctLine={question.correctLine}
          onAnswer={(isCorrect) => handleAnswer(index, isCorrect)}
        >
          {question.code}
        </QuestionBox>
      ))}
      <Button
        onClick={handleSubmitAll}
        color="primary"
        variant="contained"
        className="mt-4"
      >
        Submit All Answers
      </Button>
    </div>
  );
};

export default App;
