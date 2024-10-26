"use client";
import {useState, FormEvent} from "react";
import {getFirestore, doc, setDoc} from "firebase/firestore";
import {useRouter} from "next/navigation";

import {auth} from "@/api/firebase"; // Adjust the import path as necessary

const db = getFirestore(); // Initialize Firestore

export default function UsernamePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid); // Create a document reference for the user

        await setDoc(userDocRef, {username}); // Save the username

        router.push("/"); // Redirect to the homepage or another page after successful submission
      }
    } catch (error) {
      setError("Error saving username. Please try again.");
      console.error("Error saving username:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">Choose Your Username</h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="username">
            Username
          </label>
          <input
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          disabled={loading} // Disable the button while loading
          type="submit"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
