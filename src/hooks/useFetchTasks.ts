// src/hooks/useFetchTasks.ts
import {useEffect, useState, useCallback} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";

import {db} from "@/api/firebase";
import {useAuth} from "@/hooks";

interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  childId: string;
  status: string;
}

export const useFetchTasks = () => {
  const {user} = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    setLoading(true); // Start loading
    try {
      const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setTasks(tasksData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks");
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {tasks, loading, error, refetch: fetchTasks};
};
