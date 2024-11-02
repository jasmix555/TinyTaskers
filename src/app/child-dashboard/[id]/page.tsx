"use client";
import {use} from "react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

import {useAuth, useFetchChildren} from "@/hooks";
import {ChildTasks} from "@/components";

export default function ChildDashboardPage({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params); // Use React’s `use` to unwrap the promise
  const {user, loading: authLoading} = useAuth();

  // Pass the user UID to fetch children associated with that user
  const {children, loading: fetchingChildrenLoading, error} = useFetchChildren(user?.uid || "");

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");

      return;
    }
  }, [authLoading, user, router]);

  // Find the specific child based on the id from the params
  const child = children?.find((child) => child.id === id);

  if (authLoading || fetchingChildrenLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading children: {error}</p>;

  if (!child) {
    return <p>No child found!</p>; // Display a message if no child is found
  }

  // Determine suffix based on gender
  const suffix = child.gender === "M" ? "くん" : "ちゃん";

  return (
    <div className="">
      <div className="flex justify-between bg-orange-300 p-6">
        <h2 className="text-2xl font-bold">
          {child.name} {suffix}
        </h2>
        <p>Current Points: {child.points}</p>
      </div>
      <ChildTasks childId={child.id} /> {/* Pass the child's ID to ChildTasks */}
    </div>
  );
}
