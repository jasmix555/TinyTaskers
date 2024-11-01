// src/hooks/useUpdateTask.ts
import {useCallback} from "react";
import {doc, updateDoc} from "firebase/firestore";

import {db} from "@/api/firebase";
import {Task} from "@/types/Task";

export function useUpdateTask() {
  const updateTask = useCallback(async (task: Task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);

      await updateDoc(taskRef, {
        title: task.title,
        description: task.description,
        points: task.points,
        status: task.status,
      });
      console.log("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      throw error; // propagate error for handling in calling component
    }
  }, []);

  return {updateTask};
}
