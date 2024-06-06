import { Timestamp } from "firebase/firestore";

export type Card = {
  id: string;       // Firestore document ID
  ownerId: string;       
  front: string;
  back: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  dueDate: Timestamp;
  interval: number;     // Days until next review
  easeFactor: number;   // e.g., 2.5
  repetitions: number;  // Number of times reviewed
  lapses: number;       // Number of times failed
  selected:boolean;
  deckCardId:string;
};
