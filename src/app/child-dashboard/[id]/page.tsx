"use client";
import {use} from "react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {FaSackDollar, FaCaretRight} from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

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
    <div className="h-screen font-mplus-rounded">
      <div className={`w-full bg-orange-300 p-4 text-white`}>
        <div className="flex justify-between">
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

            <div className="rounded-xl bg-gray-600/25 px-4 py-2">
              <h2 className="font-bold sm:text-xl md:text-4xl">{child.name}</h2>
            </div>
          </div>
          <p className="flex items-center gap-2 font-bold sm:text-xl md:text-4xl">
            <span className="font-normal sm:text-lg md:text-3xl">
              <FaSackDollar />
            </span>
            {child.points}
          </p>
        </div>
      </div>

      {/* Grid Layout Container */}
      <div className="grid px-4 pb-4 pt-4 sm:flex sm:flex-col md:grid md:h-[calc(100vh-88px)] md:grid-cols-5 md:gap-4">
        {/* Section 1 - Left column (spans full height) */}
        <div className="col-span-3 h-full rounded-2xl bg-orange-200">
          <ChildTasks childId={child.id} />
        </div>

        {/* Right column container */}
        <div className="col-span-2 flex h-full flex-col gap-4">
          {/* Section 2 - Top right with background image */}
          <div
            className="relative h-2/3 rounded-2xl p-4"
            style={{
              backgroundImage: "url('/background_one.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#B2D67A",
            }}
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold">なにか買えるかな？</h3>
              <h2 className="text-5xl font-bold">おみせ</h2>
            </div>
            {/* Button positioned at the bottom right */}
            <Link
              className="absolute bottom-3 right-4 flex items-center gap-2 rounded-full bg-white px-8 py-4 text-2xl font-bold text-black hover:bg-gray-100"
              href="/store"
            >
              おみせへはいる
              <FaCaretRight />
            </Link>
          </div>

          {/* Section 3 - Bottom right */}
          <div
            className="relative h-1/3 rounded-2xl p-4"
            style={{
              backgroundImage: "url('/background_two.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#EE7F79",
            }}
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-5xl font-bold">おもいでノート</h2>
            </div>
            {/* New button for Section 3 positioned at the bottom right */}
            <button className="absolute bottom-3 right-4 flex items-center gap-2 rounded-full bg-white px-8 py-4 text-2xl font-bold text-black hover:bg-gray-100">
              ノートをみる
              <FaCaretRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
