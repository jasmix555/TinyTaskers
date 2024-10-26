"use client";
import {useRouter} from "next/navigation";

import {useAuth} from "../hooks/useAuth";

export default function Home() {
  const {user, loading} = useAuth();
  const router = useRouter();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    router.push("/welcome");

    return null;
  }

  return (
    <div>
      <h1>Hello, {user.displayName}!</h1>
    </div>
  );
}
