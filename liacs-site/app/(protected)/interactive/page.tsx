"use client";
import { useState } from "react";
import QuestionBox from "../../../components/InteractiveProgramming/QuestionBox";
import ScoreCounter from "../../../components/InteractiveProgramming/ScoreCounter";
import { questions } from "../../../data/questions";

export default function InteractivePage() {
  const [score, setScore] = useState<number>(0);
  const [quizKey, setQuizKey] = useState<number>(0);

  const resetQuiz = () => {
    setScore(0);
    setQuizKey((prev) => prev + 1);
  };

  return (
    <section className="min-h-screen p-4 text-white">
      {/* Shared container with horizontal padding, centered at max 4xl width */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Header row: Score on the left, Reset on the right */}
        <div className="flex justify-between items-center mb-4">
          <ScoreCounter score={score} totalQuestions={questions.length} />
          <button
            onClick={resetQuiz}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset Quiz
          </button>
        </div>

        {/* Re-mount questions on reset (quizKey changes) */}
        <div key={quizKey}>
          {questions.map((question, index) => (
            <QuestionBox
              key={index}
              codeSnippet={question.codeSnippet}
              correctLineNumber={question.correctLineNumber}
              onLineClick={() => setScore((prev) => prev + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
