"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {getDoc, doc} from "firebase/firestore";

import {db} from "@/api/firebase";
import {Child} from "@/types/ChildProps";

const ChildLogin = ({userId}: {userId: string}) => {
  // Accept userId as a prop
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
      const childRef = doc(db, `users/${userId}/children/${childId}`); // Use userId from props
      const docSnapshot = await getDoc(childRef);

      if (!docSnapshot.exists()) {
        setError("Child not found. Please check the ID.");

        return;
      }

      const childData = docSnapshot.data() as Child;

      // Store child data in context or state management if needed
      // Example: setChild(childData);

      // Navigate to the child dashboard
      router.push(`/child-dashboard/${childId}`); // Update this path accordingly
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
