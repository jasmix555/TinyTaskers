import {useCallback} from "react";
import {doc, updateDoc, collection, addDoc} from "firebase/firestore";

import {db} from "@/api/firebase";
import {Task} from "@/types/TaskProps";

// Explicitly define the type for adjustPointsCallback
type AdjustPointsCallback = (
  childId: string,
  points: number,
  activityTitle: string,
  action: "add" | "subtract",
) => void;

export const completeTaskAndLogHistory = async (
  task: Task,
  adjustPointsCallback: AdjustPointsCallback,
) => {
  try {
    // Update the task status to 'completed'
    const taskRef = doc(db, "tasks", task.id);

    await updateDoc(taskRef, {status: "completed"});

    // Log the task completion in the child's history
    const historyEntry = {
      title: task.title,
      points: task.points,
      action: "add", // Points are added upon task completion
      dateCompleted: new Date().toISOString(),
    };

    // Reference the child's history sub-collection and add the history entry
    const childHistoryRef = collection(db, "children", task.childId, "history");

    await addDoc(childHistoryRef, historyEntry);

    // Adjust points for the child (using the callback from usePointManagement)
    adjustPointsCallback(task.childId, task.points, task.title, "add");

    console.log("Task completed and logged in history!");
  } catch (error) {
    console.error("Error completing task or logging history:", error);
  }
};

export function useTaskManagement() {
  const acceptTask = useCallback(async (taskId: string) => {
    try {
      const taskRef = doc(db, "tasks", taskId);

      await updateDoc(taskRef, {status: "finished"});
    } catch (error) {
      console.error("Error accepting task:", error);
    }
  }, []);

  const confirmCompletion = useCallback(async (taskId: string) => {
    try {
      const taskRef = doc(db, "tasks", taskId);

      await updateDoc(taskRef, {status: "confirmation"});
    } catch (error) {
      console.error("Error confirming task completion:", error);
    }
  }, []);

  return {
    acceptTask,
    confirmCompletion,
  };
}
