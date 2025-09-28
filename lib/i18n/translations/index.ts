import { en } from './en';
import { nl } from './nl';

export const translations = {
  en,
  nl,
} as const;

export type Language = keyof typeof translations;

// Create a unified type structure that both languages must follow
type BaseTranslationStructure = {
  nav: {
    apps: string;
    presentation: string;
    admin: string;
    login: string;
    logout: string;
    language: string;
    home: string;
    games: string;
    gamesDescription: string;
    wheelOfFortune: string;
    wheelDescription: string;
    interactiveProgramming: string;
    interactiveDescription: string;
    sortingAlgorithms: string;
    sortingDescription: string;
    mazes: string;
    mazesDescription: string;
    oracle: string;
    oracleDescription: string;
    interestingPatterns: string;
    interestingPatternsDescription: string;
    objectDetection: string;
    objectDetectionDescription: string;
    viewQuestions: string;
    viewQuestionsDescription: string;
    addQuestions: string;
    addQuestionsDescription: string;
  };
  home: {
    title: string;
    subtitle: string;
  };
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    loginButton: string;
    loginWithGoogle: string;
    noAccount: string;
    signUp: string;
    invalidCredentials: string;
    loginFailed: string;
  };
  interactive: {
    title: string;
    loading: string;
    score: string;
    question: string;
    of: string;
    language: string;
    findBug: string;
    selectAnswer: string;
    noBug: string;
    submit: string;
    correct: string;
    incorrect: string;
    correctAnswer: string;
    nextQuestion: string;
    finish: string;
    completed: string;
    finalScore: string;
    playAgain: string;
  };
  wheel: {
    title: string;
    spinButton: string;
    spinKey: string;
    winner: string;
  };
  questions: {
    addTitle: string;
    addSubtitle: string;
    viewTitle: string;
    viewSubtitle: string;
    yourQuestion: string;
    questionPlaceholder: string;
    submitQuestion: string;
    submitting: string;
    submitted: string;
    submitError: string;
    noQuestions: string;
    approved: string;
    pending: string;
  };
  admin: {
    title: string;
    pendingQuestions: string;
    approvedQuestions: string;
    approve: string;
    reject: string;
    noQuestions: string;
  };
  sorting: {
    title: string;
    algorithm: string;
    arraySize: string;
    speed: string;
    generate: string;
    sort: string;
    stop: string;
    comparisons: string;
    swaps: string;
    bubbleSort: string;
    selectionSort: string;
    insertionSort: string;
    mergeSort: string;
    quickSort: string;
    heapSort: string;
  };
  common: {
    loading: string;
    error: string;
    tryAgain: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    previous: string;
    yes: string;
    no: string;
  };
  languages: {
    en: string;
    nl: string;
  };
};

export type TranslationKeys = BaseTranslationStructure;
