// src/app/page.tsx
"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {User} from "@supabase/supabase-js"; // Supabase User type

import {supabase} from "@/api/supabase";

export default function Home() {
  const [user, setUser] = useState<User | null>(null); // User type from Supabase
  const router = useRouter();

  // Check if the user is logged in
  useEffect(() => {
    const checkUser = async (): Promise<void> => {
      const {
        data: {session},
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
      } else {
        router.push("/welcome"); // Redirect to Welcome page if not logged in
      }
    };

    checkUser();
  }, [router]);

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    router.push("/welcome");
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="">
      <h1>Hello, {user.email}!</h1>
      <button className="bg-red-500 text-white rounded px-8 py-2 mt-4" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
