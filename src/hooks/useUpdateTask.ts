import {useCallback} from "react";
import {doc, updateDoc} from "firebase/firestore";

import {db} from "@/api/firebase";
import {Task} from "@/types/TaskProps";

export function useUpdateTask() {
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, "tasks", taskId);

      await updateDoc(taskRef, updates);
      console.log("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      throw error; // propagate error for handling in calling component
    }
  }, []);

  return {updateTask};
}
