// src/types/Task.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  points: number; // Assuming you have points for each task
  childId: string; // ID of the child to whom the task is assigned
  status: string; // Could be 'pending', 'completed', etc.
}
