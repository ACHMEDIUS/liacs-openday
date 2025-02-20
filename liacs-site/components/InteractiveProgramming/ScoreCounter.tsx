interface ScoreCounterProps {
  score: number;
  totalQuestions: number;
}

const ScoreCounter: React.FC<ScoreCounterProps> = ({ score, totalQuestions }) => {
  return (
    <div className="text-center p-4 bg-black-100">
      <h1 className="text-2xl font-bold">
        Score: {score} / {totalQuestions}
      </h1>
    </div>
  );
};

export default ScoreCounter;
