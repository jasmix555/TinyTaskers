import {useEffect, useState, useCallback} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";

import {db} from "@/api/firebase";
import {useAuth} from "@/hooks";
import {Task} from "@/types/TaskProps";

export const useFetchTasks = (childId: string) => {
  // Accept childId as a parameter
  const {user} = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user || !childId) return; // Ensure childId is available

    setLoading(true);
    try {
      const q = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid),
        where("childId", "==", childId),
      ); // Fetch tasks for the specific child
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
  }, [user, childId]); // Add childId as a dependency

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {tasks, loading, error, refetch: fetchTasks};
};
