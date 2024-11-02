"use client";
// src/app/child-login/page.tsx
import {useState, FormEvent} from "react";
import {useRouter} from "next/navigation";
import {signInWithEmailAndPassword} from "firebase/auth";

import {auth} from "@/api/firebase";

export default function ChildLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/child-select"); // Redirect to child selection page
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
