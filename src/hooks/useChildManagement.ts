// src/hooks/useChildManagement.ts
import {useState, useCallback} from "react";
import {doc, updateDoc} from "firebase/firestore";

import {db} from "@/api/firebase";
import {Child} from "@/types/ChildProps";

export function useChildManagement() {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const selectChild = useCallback((child: Child) => {
    setSelectedChild(child);
  }, []);

  const adjustPoints = useCallback(
    async (childId: string, points: number) => {
      try {
        const childRef = doc(db, `users/${selectedChild?.id}/children`, childId);
        const newPoints = (selectedChild?.points || 0) + points;

        await updateDoc(childRef, {points: newPoints});

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
