"use client";
import {useState, FormEvent} from "react";
import {getFirestore, doc, setDoc} from "firebase/firestore";
import {useRouter} from "next/navigation";

import {auth} from "@/api/firebase"; // Adjust the import path as necessary

const db = getFirestore(); // Initialize Firestore

export default function UsernamePage() {
  const [username, setUsername] = useState("");
  const [email] = useState(auth.currentUser?.email || ""); // Get the registered email
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
      setError("ユーザー名の保存中にエラーが発生しました。再試行してください。");
      console.error("Error saving username:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="container mx-auto max-w-md">
        <h1 className="mb-4 text-center text-3xl font-bold">ユーザー名を選択してください</h1>
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}

        <form
          className="flex flex-col content-center justify-center gap-8 rounded-lg p-6"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              登録済みメールアドレス
            </label>
            <input
              readOnly
              className="mt-1 block w-full border-0 border-b-4 border-gray-400 bg-transparent px-3 py-2 text-gray-400 placeholder-gray-500 outline-none"
              id="email"
              type="email"
              value={email}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">
              ユーザー名
            </label>
            <input
              required
              className="mt-1 block w-full border-0 border-b-4 border-black bg-transparent px-3 py-2 placeholder-gray-500 transition duration-100 ease-in-out focus:border-orange-300 focus:outline-none focus:ring-0"
              id="username"
              placeholder="ユーザー名を入力してください"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <button
            className={`w-full rounded-full py-2 font-bold text-white transition duration-100 ease-in-out ${
              loading || !username
                ? "cursor-not-allowed bg-gray-400"
                : "bg-orange-300 hover:bg-orange-200"
            }`}
            disabled={loading || !username} // Disable the button if loading or username is empty
            type="submit"
          >
            {loading ? "保存中..." : "送信"}
          </button>
        </form>
      </div>
    </div>
  );
}
