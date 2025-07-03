import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';
import firebaseApp from './firebase';
import { Question } from '../types/question';

const functions = getFunctions(firebaseApp);

export const submitQuestion = async (
  questionText: string
): Promise<{ success: boolean; id?: string }> => {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not authenticated');
  }

  const token = await user.getIdToken();
  const submitQuestionFn = httpsCallable(functions, 'submitQuestion');

  const result = await submitQuestionFn({
    question: { text: questionText },
    userToken: token,
  });

  return result.data as { success: boolean; id?: string };
};

export const getQuestions = async (): Promise<Question[]> => {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not authenticated');
  }

  const token = await user.getIdToken();
  const getQuestionsFn = httpsCallable(functions, 'getQuestions');

  const result = await getQuestionsFn({ userToken: token });
  const data = result.data as { questions: Question[] };

  return data.questions;
};

export const updateScore = async (score: number): Promise<{ success: boolean }> => {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not authenticated');
  }

  const token = await user.getIdToken();
  const updateScoreFn = httpsCallable(functions, 'updateScore');

  const result = await updateScoreFn({
    score,
    userToken: token,
  });

  return result.data as { success: boolean };
};
