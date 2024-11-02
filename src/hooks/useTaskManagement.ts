// src/hooks/useTaskManagement.ts
import {useCallback} from "react";

import {useUpdateTask} from "@/hooks/useUpdateTask"; // Ensure this path is correct

export function useTaskManagement() {
  const {updateTask} = useUpdateTask();

  const acceptTask = useCallback(
    async (taskId: string) => {
      try {
        await updateTask(taskId, {status: "ongoing"});
        // Additional logic can be added here if needed
      } catch (error) {
        console.error("Error accepting task:", error);
        throw error; // Propagate error if needed
      }
    },
    [updateTask],
  );

  const confirmCompletion = useCallback(
    async (taskId: string) => {
      try {
        await updateTask(taskId, {status: "confirmation"});
        // Additional logic can be added here if needed
      } catch (error) {
        console.error("Error confirming task completion:", error);
        throw error; // Propagate error if needed
      }
    },
    [updateTask],
  );

  return {
    acceptTask,
    confirmCompletion,
  };
}
