// src/hooks/useAuth.ts

import {useState, useEffect} from "react";
import {onAuthStateChanged, User} from "firebase/auth";

import {auth} from "../api/firebase"; // Adjust the import path if necessary

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  return {user, loading};
}
