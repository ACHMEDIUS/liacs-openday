"use client";
import { useState } from "react";

interface QuestionBoxProps {
  codeSnippet: string;
  correctLineNumber: number; // Zero-based index for the correct line
  onLineClick: () => void; // Handler for when a correct line is clicked
}

const QuestionBox: React.FC<QuestionBoxProps> = ({
  codeSnippet,
  correctLineNumber,
  onLineClick,
}) => {
  const codeLines = codeSnippet.trimEnd().split("\n");
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
    // Removed w-11/12 so it matches the container width
    <section className="mb-4 bg-gray-800 text-white rounded-lg p-4">
      {codeLines.map((line, index) => {
        const isCorrect = isAnswered && index === correctLineNumber;
        const isWrong =
          isAnswered && index === clickedLine && index !== correctLineNumber;

        let bgColorClasses = "";
        if (isCorrect) {
          bgColorClasses = "bg-green-500";
        } else if (isWrong) {
          bgColorClasses = "bg-red-500";
        }

        return (
          <div
            key={index}
            className={`
              flex items-center
              transition-colors duration-200 ease-in-out
              py-1 px-2
              ${bgColorClasses}
              ${
                !isAnswered
                  ? "hover:bg-gray-700 cursor-pointer"
                  : "cursor-default"
              }
            `}
            onClick={() => handleClick(index)}
          >
            <span className="text-gray-400 select-none w-8 text-right mr-2 font-mono">
              {index + 1}
            </span>
            <pre className="whitespace-pre-wrap m-0 font-mono flex-1">
              {line}
            </pre>
          </div>
        );
      })}
    </section>
  );
};

export default QuestionBox;
