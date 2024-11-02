import {useEffect, useState} from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {useRouter} from "next/navigation";
import {doc, getDoc} from "firebase/firestore";

import {auth, db} from "@/api/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUsername, setHasUsername] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user);
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();

            setHasUsername(!!userData.username);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return {user, loading, hasUsername};
}
