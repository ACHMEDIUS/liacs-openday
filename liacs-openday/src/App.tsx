// App.tsx

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import QuestionBox from './components/QuestionBox';
import ScoreCounter from './components/ScoreCounter';
import { questions } from './data/questions'; // Import the questions array

const App: React.FC = () => {
  const [score, setScore] = useState<number>(0);

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
        <Typography
          variant="h4"
          sx={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}
        >
          Find the mistakes in the following code snippets to win a prize
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
