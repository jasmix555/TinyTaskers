import {useEffect, useState} from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";

import {auth, db} from "../api/firebase"; // Adjust the import path if necessary

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUsername, setHasUsername] = useState(false);
  const [hasChildInfo, setHasChildInfo] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Fetch user document to check for username and child info
        const userDoc = await getDoc(doc(db, "users", user.uid)); // Assuming user info is stored under 'users' collection

        if (userDoc.exists()) {
          const userData = userDoc.data();

          setHasUsername(!!userData.username); // Check if username exists

          setHasChildInfo(!!userData.children && userData.children.length > 0); // Check if children exist
        } else {
          setHasUsername(false);
          setHasChildInfo(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  return {user, loading, hasUsername, hasChildInfo};
}
