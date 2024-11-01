// src/hooks/useDeleteTask.ts
import {useCallback} from "react";
import {doc, deleteDoc} from "firebase/firestore";

import {db} from "@/api/firebase";

export const useDeleteTask = () => {
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const taskRef = doc(db, "tasks", taskId);

      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }, []);

  return {deleteTask};
};
