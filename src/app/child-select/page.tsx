"use client";
// src/app/child-select/page.tsx
import {useRouter} from "next/navigation";

import {useFetchChildren, useAuth} from "@/hooks";
import {Loading} from "@/components";

export default function ChildSelectPage() {
  const router = useRouter();
  const {user, loading: authLoading} = useAuth();
  const {children, loading: childrenLoading, error} = useFetchChildren(user?.uid || "");

  if (authLoading || childrenLoading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleChildSelect = (childId: string) => {
    router.push(`/child-dashboard/${childId}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold">子供のアカウントを選択</h1>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children.map((child) => (
          <li
            key={child.id}
            className={`flex items-center justify-center bg-${child.gender === "M" ? "blue-400" : "pink-400"} transform rounded-lg p-6 shadow-lg transition-transform hover:scale-105`}
          >
            <button
              className="text-lg font-semibold text-white focus:outline-none"
              onClick={() => handleChildSelect(child.id)}
            >
              {child.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
