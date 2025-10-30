'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import type { Question as FirestoreQuestion } from '@/types/question';
import { AddQuestionDialog } from '@/components/app/add-question-dialog';

type ViewQuestion = {
  id: string;
  text: string;
  status: 'pending' | 'approved' | 'denied';
  accepted: boolean;
  main: boolean;
  answer: string;
  createdAt: number | null;
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<ViewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const questionsQuery = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      questionsQuery,
      snapshot => {
        const nextQuestions: ViewQuestion[] = snapshot.docs
          .map(docSnapshot => {
            const data = docSnapshot.data() as FirestoreQuestion & {
              question?: unknown;
              status?: unknown;
              createdAt?: unknown;
              answer?: unknown;
            };

            const rawText =
              typeof data.text === 'string'
                ? data.text
                : typeof data.question === 'string'
                  ? data.question
                  : '';
            const text = rawText.trim();
            if (!text) {
              return null;
            }

            const rawStatus = data.status;
            const status =
              rawStatus === 'approved' || rawStatus === 'denied' || rawStatus === 'pending'
                ? rawStatus
                : data.accepted
                  ? 'approved'
                  : 'pending';

            const rawCreatedAt = (data as { createdAt?: unknown }).createdAt;
            let createdAt: number | null = null;
            if (typeof rawCreatedAt === 'number') {
              createdAt = rawCreatedAt;
            } else if (
              rawCreatedAt &&
              typeof (rawCreatedAt as { toMillis?: () => number }).toMillis === 'function'
            ) {
              createdAt = (rawCreatedAt as { toMillis: () => number }).toMillis();
            }

            const answer = typeof data.answer === 'string' ? data.answer : '';

            return {
              id: docSnapshot.id,
              text,
              status,
              accepted: Boolean(data.accepted),
              main: Boolean(data.main),
              answer,
              createdAt,
            } satisfies ViewQuestion;
          })
          .filter((question): question is ViewQuestion => Boolean(question));

        setQuestions(nextQuestions);
        setError('');
        setLoading(false);
      },
      snapshotError => {
        console.error('Failed to load questions:', snapshotError);
        setError('Unable to load questions right now. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const approvedQuestions = useMemo(
    () => questions.filter(question => question.status === 'approved'),
    [questions]
  );
  const mainQuestion = useMemo(
    () => approvedQuestions.find(question => question.main),
    [approvedQuestions]
  );
  const faqQuestions = useMemo(() => {
    const excludeId = mainQuestion?.id;
    return approvedQuestions.filter(question => question.id !== excludeId);
  }, [approvedQuestions, mainQuestion?.id]);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-leiden">Live Q&A Board</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-leiden" aria-label="Loading questions" />
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardContent className="py-8 text-center text-destructive">{error}</CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          <section>
            <Card className="border-leiden/30">
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle className="text-2xl">Current Question</CardTitle>
                <AddQuestionDialog
                  triggerButtonText="Add"
                  dialogTitle="Submit Your Question"
                  dialogDescription="Ask a question and it will be reviewed by our team before appearing on the board."
                  placeholder="Enter your question here"
                  submitButtonText="Submit Question"
                  submittingButtonText="Submitting..."
                />
              </CardHeader>
              <CardContent>
                {mainQuestion ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{mainQuestion.text}</p>
                    </div>
                    {mainQuestion.answer && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Answer
                          </p>
                          <p className="mt-2 text-base text-foreground">{mainQuestion.answer}</p>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No question selected as current yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-foreground">FAQ</h2>
            </div>

            {faqQuestions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No approved questions yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {faqQuestions.map(question => (
                  <Card key={question.id} className="border-border/40 bg-muted/20">
                    <CardContent className="space-y-3 p-5">
                      <p className="text-base font-medium text-foreground">{question.text}</p>
                      {question.answer ? (
                        <p className="text-sm text-muted-foreground">{question.answer}</p>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
