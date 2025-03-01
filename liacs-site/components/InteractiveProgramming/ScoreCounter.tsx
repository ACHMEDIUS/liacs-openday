interface ScoreCounterProps {
  score: number;
  totalQuestions: number;
}

const ScoreCounter: React.FC<ScoreCounterProps> = ({
  score,
  totalQuestions,
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black">
        Score: {score} / {totalQuestions}
      </h1>
    </div>
  );
};

export default ScoreCounter;
