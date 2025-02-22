"use client";
import { useState } from 'react';

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
  const codeLines = codeSnippet.trimEnd().split('\n'); // Split code into lines
  const [clickedLine, setClickedLine] = useState<number | null>(null); // Track clicked line
  const [isAnswered, setIsAnswered] = useState<boolean>(false); // Track if the question is answered

  // Handle line click and trigger correct/incorrect visual states
  const handleClick = (index: number) => {
    if (isAnswered) return; // Ignore clicks if already selected
    setClickedLine(index); // Set the clicked line index
    setIsAnswered(true); // Mark this question as answered
    if (index === correctLineNumber) {
      onLineClick(); // Increment the score if correct line clicked
    }
  };

  return (
    <section
      
      // sx={{
      //   width: '90%',
      //   marginBottom: 4,
      //   backgroundColor: "#1e1e1e",
      //   color: "#fff",
      //   borderRadius: '0.5rem',
      // }}
      className="width-9/10 margin-b-xs border-2 border-gray-600 rounded-lg"
    >
      <section>
        <section className=''>
          {/* sx={{ display: 'flex', flexDirection: 'column' }} */}
          {codeLines.map((line, index) => {
            // Determine the background color based on whether the line is clicked and correct
            let backgroundColor = 'transparent';
            if (isAnswered) {
              backgroundColor = index === correctLineNumber ? '#2ecc71' : clickedLine === index ? '#e74c3c' : 'transparent';
            }

            return (
              <section
                key={index}
                className="line-container"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: '1.5rem',
                  margin: 0,
                  padding: '4px 0',
                  cursor: isAnswered ? 'default' : 'pointer',
                  backgroundColor: backgroundColor,
                  transition: 'background-color 0.2s ease-in-out',
                }}
                onClick={() => handleClick(index)}
                onMouseEnter={(e) => {
                  if (!isAnswered) {
                    e.currentTarget.style.backgroundColor = '#333'; // Darker background on hover if not answered
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isAnswered) {
                    e.currentTarget.style.backgroundColor = 'transparent'; // Revert to original if not answered
                  }
                }}
              >
                <span
                  className="text-gray-400 select-none"
                  style={{
                    width: '30px',
                    textAlign: 'right',
                    marginRight: '10px',
                    fontFamily: 'monospace',
                    lineHeight: 'inherit',
                  }}
                >
                  {index + 1}
                </span>

                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    fontFamily: 'monospace',
                    flex: 1,
                    padding: 0,
                    display: 'inline',
                    lineHeight: 'inherit',
                  }}
                >
                  {line}
                </pre>
              </section>
            );
          })}
        </section>
      </section>
    </section>
  );
};

export default QuestionBox;
