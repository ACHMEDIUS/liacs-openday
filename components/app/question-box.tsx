'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface QuestionBoxProps {
  codeSnippet: string;
  correctLineNumber: number;
  onLineClick: () => void;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({
  codeSnippet,
  correctLineNumber,
  onLineClick,
}) => {
  const codeLines = codeSnippet.trimEnd().split('\n');
  const [clickedLine, setClickedLine] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const handleClick = (index: number) => {
    if (isAnswered) return;
    setClickedLine(index);
    setIsAnswered(true);
    if (index === correctLineNumber) {
      onLineClick();
    }
  };

  return (
    <Card className="mb-4 bg-gray-800 text-white">
      <CardContent className="p-4">
        {codeLines.map((line, index) => {
          const isCorrect = isAnswered && index === correctLineNumber;
          const isWrong = isAnswered && index === clickedLine && index !== correctLineNumber;

          let bgColorClasses = '';
          if (isCorrect) {
            bgColorClasses = 'bg-green-500';
          } else if (isWrong) {
            bgColorClasses = 'bg-red-500';
          }

          return (
            <div
              key={index}
              className={`flex items-center rounded-sm px-2 py-1 transition-colors duration-200 ease-in-out ${bgColorClasses} ${
                !isAnswered ? 'cursor-pointer hover:bg-gray-700' : 'cursor-default'
              } `}
              onClick={() => handleClick(index)}
            >
              <span className="mr-2 w-8 select-none text-right font-mono text-gray-400">
                {index + 1}
              </span>
              <pre className="m-0 flex-1 whitespace-pre-wrap font-mono">{line}</pre>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuestionBox;
