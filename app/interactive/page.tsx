'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Code, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileUnsupportedNotice } from '@/components/common/MobileNotice';
import programmingQuestions, {
  ProgrammingQuestion,
} from '@/lib/data/programming/questions';

export default function InteractivePage() {
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);
  // Removed authentication requirement - interactive programming is now publicly accessible
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(programmingQuestions.length).fill(false)
  );

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);

    if (selectedAnswer === programmingQuestions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }

    setAnsweredQuestions(prev => {
      const newAnswered = [...prev];
      newAnswered[currentQuestion] = true;
      return newAnswered;
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < programmingQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Array(programmingQuestions.length).fill(false));
  };

  const isCorrect = selectedAnswer === programmingQuestions[currentQuestion].correctAnswer;
  const isCompleted = answeredQuestions.every(answered => answered);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <MobileUnsupportedNotice
          title="Interactive Programming"
          description="This interactive is best experienced on larger screens. Please switch to a tablet or desktop to continue the challenge."
        />
      </div>
    );
  }

  // Interactive programming is now publicly accessible - no authentication checks needed

  const question: ProgrammingQuestion = programmingQuestions[currentQuestion];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-leiden">Interactive Programming Challenge</h1>
        <p className="text-muted-foreground">Debug the code and find the correct solutions!</p>
      </div>

      {/* Progress and Score */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            Question {currentQuestion + 1} of {programmingQuestions.length}
          </Badge>
          <Badge
            variant="outline"
            className={`${
              question.difficulty === 'Easy'
                ? 'bg-green-100 text-green-800'
                : question.difficulty === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}
          >
            {question.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-leiden" />
          <span className="font-semibold">
            Score: {score}/{programmingQuestions.length}
          </span>
        </div>
      </div>

      {isCompleted && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Trophy className="h-4 w-4" />
          <div>
            <strong>Quiz Completed!</strong>
            <p>
              Final Score: {score}/{programmingQuestions.length} (
              {Math.round((score / programmingQuestions.length) * 100)}%)
            </p>
          </div>
        </Alert>
      )}

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            {question.title}
            <Badge>{question.language}</Badge>
          </CardTitle>
          <p className="text-muted-foreground">{question.description}</p>
        </CardHeader>
        <CardContent>
          {/* Code Block */}
          <div className="mb-6 rounded-lg bg-gray-900 p-4 text-green-400">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              <code>{question.code}</code>
            </pre>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            <h4 className="font-semibold">What&apos;s the bug in this code?</h4>
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? 'default' : 'outline'}
                className={`w-full justify-start text-left ${
                  showResult && index === question.correctAnswer
                    ? 'border-green-500 bg-green-100 hover:bg-green-100'
                    : showResult && selectedAnswer === index && !isCorrect
                      ? 'border-red-500 bg-red-100 hover:bg-red-100'
                      : selectedAnswer === index
                        ? 'bg-leiden hover:bg-leiden/90'
                        : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <span className="mr-2 font-mono">{String.fromCharCode(65 + index)}.</span>
                {option}
                {showResult && index === question.correctAnswer && (
                  <CheckCircle className="ml-auto h-4 w-4 text-green-600" />
                )}
                {showResult && selectedAnswer === index && !isCorrect && (
                  <XCircle className="ml-auto h-4 w-4 text-red-600" />
                )}
              </Button>
            ))}
          </div>

          {/* Submit Button */}
          {!showResult && (
            <Button
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
              className="mt-4 bg-leiden hover:bg-leiden/90"
            >
              Submit Answer
            </Button>
          )}

          {/* Explanation */}
          {showResult && (
            <Alert
              className={`mt-4 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
            >
              <div>
                <strong>{isCorrect ? 'Correct!' : 'Incorrect'}</strong>
                <p className="mt-1">{question.explanation}</p>
              </div>
            </Alert>
          )}

          {/* Navigation */}
          {showResult && (
            <div className="mt-4 flex gap-2">
              {currentQuestion < programmingQuestions.length - 1 ? (
                <Button onClick={nextQuestion} className="bg-leiden hover:bg-leiden/90">
                  Next Question
                </Button>
              ) : (
                <Button onClick={resetQuiz} variant="outline">
                  Restart Quiz
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="flex gap-2">
        {programmingQuestions.map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded ${
              index === currentQuestion
                ? 'bg-leiden'
                : answeredQuestions[index]
                  ? 'bg-green-500'
                  : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
