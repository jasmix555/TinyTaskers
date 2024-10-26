"use client";
import {useState, useEffect, FormEvent} from "react";
import {createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import {useRouter} from "next/navigation";

import {auth} from "@/api/firebase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send a verification email
      await sendEmailVerification(user);

      // Show the confirmation/loading page
      setIsConfirming(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Signup Error:", error);
    }
  };

  useEffect(() => {
    // Polling function to check for email verification
    const pollForEmailVerification = async () => {
      const interval = setInterval(async () => {
        const user = auth.currentUser;

        if (user) {
          await user.reload(); // Reload user to get the latest info
          if (user.emailVerified) {
            setIsVerified(true); // Set verified state
            clearInterval(interval); // Stop polling
          }
        }
      }, 3000); // Check every 3 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    };

    if (isConfirming) {
      pollForEmailVerification(); // Start polling if confirming
    }
  }, [isConfirming]); // Dependency on isConfirming

  useEffect(() => {
    if (isVerified) {
      router.push("/username"); // Redirect to username setup page
    }
  }, [isVerified, router]); // Redirect when verified

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">{isConfirming ? "Confirm Your Email" : "Sign Up"}</h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      {!isConfirming ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email address
            </label>
            <input
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            type="submit"
          >
            Register
          </button>
        </form>
      ) : (
        <div>
          <p className="mb-4">
            A verification link has been sent to your email. Please check your inbox.
          </p>
          <p>We are checking your verification...</p>
        </div>
      )}
    </div>
  );
}
