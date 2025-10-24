export const en = {
  // Navigation
  nav: {
    apps: 'Apps',
    presentation: 'Presentation',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    language: 'Language',
    home: 'Home',

    // Apps menu
    games: 'Games',
    gamesDescription:
      'Interactive programming challenges and educational games for computer science learning.',
    wheelOfFortune: 'Wheel of Fortune',
    wheelDescription: 'Spin the wheel for interactive presentations',
    interactiveProgramming: 'Interactive Programming',
    interactiveDescription: 'Debug code challenges and test your skills',
    sortingAlgorithms: 'Sorting Algorithms',
    sortingDescription: 'Visualize and explore sorting algorithms',
    mazes: 'Maze Explorer',
    mazesDescription: 'Compare BFS, DFS, and flood fill traversals',
    oracle: 'Oracle',
    oracleDescription: 'AI chat console with Hugging Face models',
    interestingPatterns: 'Interesting Patterns',
    interestingPatternsDescription: 'Fractals and creative coding experiments',
    fluidSimulation: 'Fluid Simulation',
    fluidSimulationDescription: 'Interactive fluid dynamics visualization',
    grappleGame: 'Grapple Game',
    grappleGameDescription: 'Physics-based grappling with procedural generation',
    objectDetection: 'Object Detection',
    objectDetectionDescription: 'YOLOv12 demo running in the browser',

    // Presentation menu
    questions: 'Questions',
    questionsDescription: 'Browse submitted questions',
    addQuestions: 'Add Questions',
    addQuestionsDescription: 'Submit new questions for Q&A',
  },

  // Home page
  home: {
    title:
      'Are you interested in becoming a student developer and gaining some real-world experience while earning money too?',
    subtitle: 'Scan the QR code below to find out more',
    badge: 'Leiden University • Student Dev',
    ctaPrimary: 'Become a Student Dev',
  },

  // Login page
  login: {
    title: 'Login',
    subtitle: 'Sign in to your account',
    emailLabel: 'Email',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    loginButton: 'Login',
    loginWithGoogle: 'Login with Google',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    invalidCredentials: 'Invalid credentials',
    loginFailed: 'Login failed. Please try again.',
  },

  // Interactive page
  interactive: {
    title: 'Interactive Programming Challenge',
    loading: 'Loading...',
    score: 'Score',
    question: 'Question',
    of: 'of',
    language: 'Language',
    findBug: 'Find the bug in this code:',
    selectAnswer: 'Select your answer:',
    noBug: 'No bug in this code',
    submit: 'Submit',
    correct: 'Correct!',
    incorrect: 'Incorrect!',
    correctAnswer: 'The correct answer is',
    nextQuestion: 'Next Question',
    finish: 'Finish',
    completed: 'Challenge completed!',
    finalScore: 'Your final score',
    playAgain: 'Play Again',
  },

  // Wheel page
  wheel: {
    title: 'Wheel of Fortune',
    spinButton: 'Spin the Wheel',
    spinKey: 'Press "S" to spin',
    winner: 'Winner!',
  },

  // Questions
  questions: {
    addTitle: 'Add Question',
    addSubtitle: 'Submit a new question for the Q&A session',
    viewTitle: 'Submitted Questions',
    viewSubtitle: 'View all approved questions',
    yourQuestion: 'Your question',
    questionPlaceholder: 'Type your question here...',
    submitQuestion: 'Submit Question',
    submitting: 'Submitting...',
    submitted: 'Question submitted!',
    submitError: 'Failed to submit. Please try again.',
    noQuestions: 'No questions submitted yet.',
    approved: 'Approved',
    pending: 'Pending',
  },

  // Admin
  admin: {
    title: 'Admin Dashboard',
    pendingQuestions: 'Pending Questions',
    approvedQuestions: 'Approved Questions',
    approve: 'Approve',
    reject: 'Reject',
    noQuestions: 'No pending questions',
  },

  // Sorting
  sorting: {
    title: 'Sorting Algorithm Visualization',
    algorithm: 'Algorithm',
    arraySize: 'Array Size',
    speed: 'Speed',
    generate: 'Generate New Array',
    sort: 'Sort',
    stop: 'Stop',
    comparisons: 'Comparisons',
    swaps: 'Swaps',
    bubbleSort: 'Bubble Sort',
    selectionSort: 'Selection Sort',
    insertionSort: 'Insertion Sort',
    mergeSort: 'Merge Sort',
    quickSort: 'Quick Sort',
    heapSort: 'Heap Sort',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    tryAgain: 'Try again',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    yes: 'Yes',
    no: 'No',
  },

  // Languages
  languages: {
    en: 'English',
    nl: 'Dutch',
  },
} as const;
