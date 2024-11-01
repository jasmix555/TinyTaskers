// src/hooks/useUpdateTask.ts
import {useCallback} from "react";
import {doc, updateDoc} from "firebase/firestore";

import {db} from "@/api/firebase"; // Adjust the import based on your Firebase setup
import {Task} from "@/types/Task"; // Assuming you have a Task type defined

export const useUpdateTask = () => {
  const updateTask = useCallback(async (task: Task) => {
    const taskRef = doc(db, "tasks", task.id); // Assuming tasks are stored in a 'tasks' collection

    await updateDoc(taskRef, {
      title: task.title,
      description: task.description,
      points: task.points,
      status: task.status, // Include any other fields you want to update
    });
  }, []);

  return {updateTask};
};
