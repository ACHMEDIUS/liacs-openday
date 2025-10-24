export interface Question {
  id: string;
  text: string;
  accepted: boolean;
  main?: boolean;
  answer?: string;
  status?: 'pending' | 'approved' | 'denied';
  createdAt?: import('firebase/firestore').Timestamp;
}

export interface CodeQuestion {
  codeSnippet: string;
  correctLineNumber: number;
}
