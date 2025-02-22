"use client";
import { useState } from "react";
import QuestionBox from "../../../components/InteractiveProgramming/QuestionBox";
import ScoreCounter from '../../../components/InteractiveProgramming/ScoreCounter';
import { questions } from '../../../data/questions'; 

export default function InteractivePage() {

  const [score, setScore] = useState<number>(0);

  return (
    <section>
      <ScoreCounter score={score} totalQuestions={questions.length} />

      {questions.map((question, index) => (
        <QuestionBox
          key={index}
          codeSnippet={question.codeSnippet}
          correctLineNumber={question.correctLineNumber}
          onLineClick={() => setScore((prev) => prev + 1)}
        />
      ))}
    </section>
  );
}
