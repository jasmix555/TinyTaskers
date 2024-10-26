// components/LogoutButton.tsx
"use client"; // Ensure this file is a client component
import {signOut} from "firebase/auth";
import {useRouter} from "next/navigation";

import {auth} from "@/api/firebase";

const LogoutButton = ({className}: {className?: string}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/welcome"); // Redirect to welcome page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <button
      className={`ml-2 mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 ${className}`}
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
