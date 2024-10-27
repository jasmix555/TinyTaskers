// hooks/useFetchChildren.ts
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";

import {db} from "../api/firebase";

import {Child} from "@/types/ChildProps";

export function useFetchChildren(uid: string) {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const childrenRef = collection(db, `users/${uid}/children`);
        const childrenSnapshot = await getDocs(childrenRef);
        const childrenData = childrenSnapshot.docs.map(
          (doc) => ({id: doc.id, ...doc.data()}) as Child,
        );

        setChildren(childrenData);
      } catch (error) {
        console.error("Error fetching children:", error);
        setError("Failed to load children data.");
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchChildren();
    }
  }, [uid]);

  return {children, loading, error};
}
