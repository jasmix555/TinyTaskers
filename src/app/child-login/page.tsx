"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {collection, getDocs, query, where} from "firebase/firestore";

import {db} from "@/api/firebase";

const ChildLogin = () => {
  const [childId, setChildId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null); // Reset error state

    if (!childId) {
      setError("Child ID is required.");

      return;
    }

    try {
      // Create a query to find the child with the given ID in any user's children collection
      const q = query(collection(db, "users"), where("children", "array-contains", childId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Child not found. Please check the ID.");

        return;
      }

      // Assuming each user has only one child with that ID, get the first matching user
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id; // Get the user ID

      // Now you can navigate to the child dashboard
      router.push(`/child-dashboard/${userId}/${childId}`); // Pass both userId and childId
    } catch (error) {
      const e = error as Error;

      setError(e.message);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Child Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        className="mt-4 rounded border p-2"
        placeholder="Enter Child ID"
        type="text"
        value={childId}
        onChange={(e) => setChildId(e.target.value)}
      />
      <button
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default ChildLogin;
