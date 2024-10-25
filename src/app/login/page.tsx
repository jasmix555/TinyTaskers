"use client";
import {useState} from "react";
import {useRouter} from "next/navigation"; // Next.js router hook

import {supabase} from "@/api/supabase"; // Supabase client

const LoginPage = () => {
  const router = useRouter(); // Initialize router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle login
  const handleLogin = async () => {
    const {error} = await supabase.auth.signInWithPassword({email, password}); // Only destructure error

    if (error) {
      setErrorMessage(error.message); // Display error message if login fails
    } else {
      setErrorMessage(""); // Clear error message on success
      router.push("/"); // Redirect to homepage after successful login
    }
  };

  return (
    <div className="mx-auto max-w-screen-md px-8 py-10">
      <h1 className="text-3xl font-bold">Login</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Error message */}
      <div className="mt-6">
        <input
          className="mb-4 w-full rounded-md border p-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mb-4 w-full rounded-md border p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded-md bg-blue-500 py-2 text-white" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
