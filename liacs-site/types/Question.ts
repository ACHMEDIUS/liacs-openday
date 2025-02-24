export interface Question {
  id: string;
  text: string;
  accepted: boolean;
  main?: boolean; 
  createdAt?: import("firebase/firestore").Timestamp;
}
