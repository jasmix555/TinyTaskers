export interface Task {
  id: string;
  title: string;
  description?: string;
  points: number; // Points for each task
  childId: string; // ID of the child to whom the task is assigned
  status?: "finished" | "confirmation" | "completed"; // Task statuses reflecting child and parent flow
}
