export const nl = {
  // Navigation
  nav: {
    apps: 'Apps',
    presentation: 'Presentatie',
    admin: 'Beheer',
    login: 'Inloggen',
    logout: 'Uitloggen',
    language: 'Taal',
    home: 'Home',

    // Apps menu
    games: 'Spellen',
    gamesDescription:
      'Interactieve programmeeruitdagingen en educatieve spellen voor het leren van informatica.',
    wheelOfFortune: 'Rad van Fortuin',
    wheelDescription: 'Draai het rad voor interactieve presentaties',
    interactiveProgramming: 'Interactief Programmeren',
    interactiveDescription: 'Debug code uitdagingen en test je vaardigheden',
    sortingAlgorithms: 'Sorteeralgoritmen',
    sortingDescription: 'Visualiseer en verken sorteeralgoritmen',

    // Presentation menu
    viewQuestions: 'Vragen Bekijken',
    viewQuestionsDescription: 'Bekijk ingediende vragen',
    addQuestions: 'Vragen Toevoegen',
    addQuestionsDescription: 'Nieuwe vragen indienen voor Q&A',
  },

  // Home page
  home: {
    title: 'Wil je ook een student developer worden en echte geld gaan verdienen?',
    subtitle: 'Scan dan de QR code voor meer informatie',
  },

  // Login page
  login: {
    title: 'Inloggen',
    subtitle: 'Meld je aan voor je account',
    emailLabel: 'E-mail',
    emailPlaceholder: 'naam@voorbeeld.nl',
    passwordLabel: 'Wachtwoord',
    passwordPlaceholder: 'Voer je wachtwoord in',
    loginButton: 'Inloggen',
    loginWithGoogle: 'Inloggen met Google',
    noAccount: 'Heb je geen account?',
    signUp: 'Registreren',
    invalidCredentials: 'Ongeldige inloggegevens',
    loginFailed: 'Inloggen mislukt. Probeer het opnieuw.',
  },

  // Interactive page
  interactive: {
    title: 'Interactieve Programmeeruitdaging',
    loading: 'Laden...',
    score: 'Score',
    question: 'Vraag',
    of: 'van',
    language: 'Taal',
    findBug: 'Vind de fout in deze code:',
    selectAnswer: 'Selecteer je antwoord:',
    noBug: 'Geen fout in deze code',
    submit: 'Indienen',
    correct: 'Correct!',
    incorrect: 'Onjuist!',
    correctAnswer: 'Het juiste antwoord is',
    nextQuestion: 'Volgende vraag',
    finish: 'Voltooien',
    completed: 'Uitdaging voltooid!',
    finalScore: 'Je eindscore',
    playAgain: 'Opnieuw spelen',
  },

  // Wheel page
  wheel: {
    title: 'Rad van Fortuin',
    spinButton: 'Draai het rad',
    spinKey: 'Druk op "S" om te draaien',
    winner: 'Winnaar!',
  },

  // Questions
  questions: {
    addTitle: 'Vraag Toevoegen',
    addSubtitle: 'Dien een nieuwe vraag in voor de Q&A sessie',
    viewTitle: 'Ingediende Vragen',
    viewSubtitle: 'Bekijk alle goedgekeurde vragen',
    yourQuestion: 'Je vraag',
    questionPlaceholder: 'Typ hier je vraag...',
    submitQuestion: 'Vraag indienen',
    submitting: 'Indienen...',
    submitted: 'Vraag ingediend!',
    submitError: 'Fout bij indienen. Probeer het opnieuw.',
    noQuestions: 'Nog geen vragen ingediend.',
    approved: 'Goedgekeurd',
    pending: 'In afwachting',
  },

  // Admin
  admin: {
    title: 'Beheerdersdashboard',
    pendingQuestions: 'Vragen in afwachting',
    approvedQuestions: 'Goedgekeurde vragen',
    approve: 'Goedkeuren',
    reject: 'Afwijzen',
    noQuestions: 'Geen vragen in afwachting',
  },

  // Sorting
  sorting: {
    title: 'Sorteeralgoritme Visualisatie',
    algorithm: 'Algoritme',
    arraySize: 'Array grootte',
    speed: 'Snelheid',
    generate: 'Nieuwe array genereren',
    sort: 'Sorteren',
    stop: 'Stoppen',
    comparisons: 'Vergelijkingen',
    swaps: 'Verwisselingen',
    bubbleSort: 'Bubble Sort',
    selectionSort: 'Selection Sort',
    insertionSort: 'Insertion Sort',
    mergeSort: 'Merge Sort',
    quickSort: 'Quick Sort',
    heapSort: 'Heap Sort',
  },

  // Common
  common: {
    loading: 'Laden...',
    error: 'Er is een fout opgetreden',
    tryAgain: 'Probeer opnieuw',
    cancel: 'Annuleren',
    save: 'Opslaan',
    delete: 'Verwijderen',
    edit: 'Bewerken',
    back: 'Terug',
    next: 'Volgende',
    previous: 'Vorige',
    yes: 'Ja',
    no: 'Nee',
  },

  // Languages
  languages: {
    en: 'Engels',
    nl: 'Nederlands',
  },
} as const;
