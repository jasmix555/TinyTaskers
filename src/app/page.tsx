"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {doc, getDoc, getFirestore} from "firebase/firestore";

import {useAuth} from "../hooks/useAuth";

const db = getFirestore(); // Initialize Firestore

export default function Home() {
  const {user, loading} = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid); // Document reference
        const userDoc = await getDoc(userDocRef); // Get user document

        if (userDoc.exists()) {
          setUsername(userDoc.data()?.username); // Set username from Firestore
        } else {
          console.error("No such document!");
        }
      }
    };

    if (!loading) {
      if (!user) {
        router.push("/welcome");
      } else {
        fetchUsername(); // Fetch username if user is logged in
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Hello, {username ? username : user?.displayName}!</h1>
    </div>
  );
}
