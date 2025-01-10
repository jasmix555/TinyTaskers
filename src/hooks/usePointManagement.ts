import {useState, useCallback} from "react";
import {doc, updateDoc, collection, addDoc} from "firebase/firestore";

import {db} from "@/api/firebase";
import {Child} from "@/types/ChildProps";

export function usePointManagement() {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const selectChild = useCallback((child: Child) => {
    setSelectedChild(child);
  }, []);

  const adjustPoints = useCallback(
    async (childId: string, points: number, activityTitle: string, action: "add" | "subtract") => {
      try {
        const childRef = doc(db, `users/${selectedChild?.id}/children`, childId);
        const newPoints = (selectedChild?.points || 0) + (action === "add" ? points : -points);

        // Update the child's points in Firestore
        await updateDoc(childRef, {points: newPoints});

        // Log the point adjustment in the child's history
        const historyEntry = {
          title: activityTitle,
          points: action === "add" ? points : -points, // Store the action (added or subtracted)
          action, // Either "add" or "subtract"
          dateCompleted: new Date().toISOString(),
        };

        if (selectedChild?.id) {
          const childHistoryRef = collection(
            db,
            "users",
            selectedChild.id,
            "children",
            childId,
            "history",
          );

          await addDoc(childHistoryRef, historyEntry);
        } else {
          throw new Error("Selected child ID is undefined");
        }

        // Update local state
        setSelectedChild((prev) => (prev ? {...prev, points: newPoints} : null));
      } catch (error) {
        console.error("Error adjusting points:", error);
      }
    },
    [selectedChild],
  );

  return {selectedChild, selectChild, adjustPoints};
}
