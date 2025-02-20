export interface Question {
  id: string;
  text: string;
  accepted: boolean;
  createdAt?: import("firebase/firestore").Timestamp;
}
