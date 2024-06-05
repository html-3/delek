import { Timestamp } from "firebase/firestore";

export type Deck = {
  id: string;       // Firestore document ID
  title: string;
  description: string;
  ownerId: string;      // User ID or Firestore reference
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
