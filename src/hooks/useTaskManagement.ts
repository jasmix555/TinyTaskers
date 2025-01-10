import {useCallback} from "react";
import {doc, updateDoc, collection, addDoc} from "firebase/firestore";

import {db} from "@/api/firebase";
import {Task} from "@/types/TaskProps";

export const completeTaskAndLogHistory = async (task: Task) => {
  try {
    // Update the task status to 'completed'
    const taskRef = doc(db, "tasks", task.id);

    await updateDoc(taskRef, {status: "completed"});

    // Create a history entry for the child
    const historyEntry = {
      title: task.title,
      points: task.points,
      dateCompleted: new Date().toISOString(), // Store completion date in ISO format
    };

    // Reference the child's history sub-collection and add the history entry
    const childHistoryRef = collection(db, "children", task.childId, "history");

    await addDoc(childHistoryRef, historyEntry);

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
