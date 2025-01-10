// types/TaskProps.ts
import {Timestamp} from "firebase/firestore";

export interface Task {
  id: string;
  title: string;
  description?: string;
  points: number;
  childId: string;
  dateCreated: Date | Timestamp; // Firestore Timestamp or JS Date
  status?: "finished" | "confirmation" | "completed";
}
