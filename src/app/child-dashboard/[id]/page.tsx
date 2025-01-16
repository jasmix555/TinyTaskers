"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {FaCaretDown, FaSackDollar} from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import {FaCaretRight} from "react-icons/fa";

import {useAuth, useFetchChildren} from "@/hooks";
import {ChildTasks, Loading} from "@/components";

export default function ChildDashboardPage({params}: {params: Promise<{id: string}>}) {
  const [id, setId] = useState<string | null>(null);

  // Unwrap params after the promise resolves
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;

      setId(resolvedParams.id);
    };

    getParams();
  }, [params]);

  const {user, loading: authLoading} = useAuth();
  const {children, loading: fetchingChildrenLoading, error} = useFetchChildren(user?.uid || "");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();

  const handleChildChange = (newChildId: string) => {
    setDropdownOpen(false);
    router.push(`/child-dashboard/${newChildId}`);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");

      return;
    }
  }, [authLoading, user, router]);

  const child = children?.find((child) => child.id === id);

  if (authLoading || fetchingChildrenLoading || id === null) return <Loading />;
  if (error) return <p>Error loading children: {error}</p>;

  if (!child) {
    return <p>No child found!</p>;
  }

  return (
    <div className="h-screen font-mplus-rounded">
      <div className={`w-full bg-orange-300 p-4 text-white`}>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            {/* Child profile picture */}
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

            {/* Dropdown for selecting child */}
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-xl bg-gray-600/25 px-4 py-2 text-xl"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <span>{child.name}</span>
                <FaCaretDown />
              </button>
              {isDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                  {children.map((childOption) => (
                    <li
                      key={childOption.id}
                      className="cursor-pointer px-4 py-2 text-black hover:bg-gray-100"
                      onClick={() => handleChildChange(childOption.id)}
                    >
                      {childOption.name}
                    </li>
                  ))}
                </ul>
              )}
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

      {/* Rest of the layout */}
      <div className="grid px-4 pb-4 pt-4 sm:flex sm:flex-col md:grid md:h-[calc(100vh-88px)] md:grid-cols-5 md:gap-4">
        <div className="col-span-3 h-full rounded-2xl bg-orange-200">
          <ChildTasks childId={child.id} />
        </div>
        <div className="col-span-2 flex h-full flex-col gap-4">
          {/* Sections for store and memory */}
          <div
            className="relative h-4/5 rounded-2xl p-4"
            style={{
              backgroundImage: "url('/background_one.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#B2D67A",
            }}
          >
            <div className="flex flex-col gap-2">
              <h3 className="font-bold md:text-2xl">なにか買えるかな？</h3>
              <h2 className="font-bold md:text-5xl">おみせ</h2>
            </div>
            <Link
              className="absolute bottom-3 right-4 flex items-center gap-2 rounded-full bg-white px-8 py-4 text-2xl font-bold text-black hover:bg-gray-100"
              href="/store"
            >
              おみせへはいる <FaCaretRight />
            </Link>
          </div>

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
              <h2 className="font-bold md:text-5xl">おもいでノート</h2>
            </div>
            <button className="absolute bottom-3 right-4 flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-black hover:bg-gray-100 md:text-2xl">
              ノートをみる <FaCaretRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
