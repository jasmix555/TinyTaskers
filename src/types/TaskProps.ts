// src/types/Task.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  points: number; // Points for each task
  childId: string; // ID of the child to whom the task is assigned
  status?: "pending" | "ongoing" | "confirmation" | "completed"; // Added ongoing and confirmation statuses
}
