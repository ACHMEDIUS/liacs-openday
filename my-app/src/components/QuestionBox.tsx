import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

interface QuestionBoxProps {
  question: string;
  correctLine: number; // Index of the correct line that contains the mistake
  children: React.ReactNode;
  onAnswer: (isCorrect: boolean) => void;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({
  question,
  correctLine,
  children,
  onAnswer,
}) => {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber);
  };

  const handleSubmit = () => {
    const isCorrect = selectedLine === correctLine;
    onAnswer(isCorrect);
  };

  return (
    <Card className="my-4 p-4 shadow-lg border border-gray-200">
      <CardContent>
        <Typography variant="h5" className="mb-4">
          {question}
        </Typography>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
          {React.Children.map(children, (child, index) =>
            React.cloneElement(child as React.ReactElement, {
              onClick: () => handleLineClick(index),
              className: `cursor-pointer p-2 ${
                selectedLine === index
                  ? selectedLine === correctLine
                    ? "bg-green-300"
                    : "bg-red-300"
                  : "hover:bg-gray-300"
              }`,
            })
          )}
        </pre>
      </CardContent>
      <CardActions>
        <Button
          onClick={handleSubmit}
          color="secondary"
          variant="contained"
          disabled={selectedLine === null}
        >
          Submit Answer
        </Button>
      </CardActions>
    </Card>
  );
};

export default QuestionBox;
