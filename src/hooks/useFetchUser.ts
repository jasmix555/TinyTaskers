// hooks/useFetchUserData.ts
import {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";

import {db} from "../api/firebase";

import {User} from "@/types/UserProps";

export function useFetchUser(uid: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          console.error("User document not found.");
          setError("User not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchUserData();
    }
  }, [uid]);

  return {user, loading, error};
}
