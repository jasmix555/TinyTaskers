"use client";
import {use} from "react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

import {useAuth, useFetchChildren} from "@/hooks";
import {ChildTasks, Loading} from "@/components";

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

  if (authLoading || fetchingChildrenLoading) return <Loading />;
  if (error) return <p>Error loading children: {error}</p>;

  if (!child) {
    return <p>No child found!</p>; // Display a message if no child is found
  }

  // Determine suffix based on gender
  const suffix = child.gender === "M" ? "くん" : "ちゃん";

  // Determine background color based on gender
  const backgroundColor = child.gender === "M" ? "bg-blue-500" : "bg-pink-500";

  return (
    <div className="">
      <div className={`flex justify-between p-6 ${backgroundColor}`}>
        <h2 className="font-bold sm:text-xl md:text-4xl">
          {child.name}
          <span className="font-normal sm:text-lg md:text-3xl">{suffix}</span>
        </h2>
        <p className="font-bold sm:text-xl md:text-4xl">
          {child.points}
          <span className="font-normal sm:text-lg md:text-3xl">pt</span>
        </p>
      </div>
      <ChildTasks childId={child.id} /> {/* Pass the child's ID to ChildTasks */}
    </div>
  );
}
