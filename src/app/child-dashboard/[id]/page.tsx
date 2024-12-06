"use client";
import {use} from "react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {FaSackXmark} from "react-icons/fa6";
import Image from "next/image";

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

  return (
    <div className="">
      <div className={`flex justify-between bg-orange-300 p-6 text-white`}>
        <div className="flex items-center gap-2">
          {/* child profile picture */}
          <div className="h-14 w-14 overflow-hidden rounded-full">
            <Image
              priority
              alt={child.name}
              className="rounded-full"
              height={200}
              src={child.picture || "/default-child.png"}
              width={200}
            />
          </div>

          <div className="rounded-xl bg-gray-600/30 px-4 py-2">
            <h2 className="font-bold sm:text-xl md:text-4xl">{child.name}</h2>
          </div>
        </div>
        <p className="flex items-center gap-2 font-bold sm:text-xl md:text-4xl">
          <span className="font-normal sm:text-lg md:text-3xl">
            <FaSackXmark />
          </span>
          {child.points}
        </p>
      </div>
      <ChildTasks childId={child.id} /> {/* Pass the child's ID to ChildTasks */}
    </div>
  );
}
