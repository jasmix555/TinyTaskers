"use client";
// src/app/child-select/page.tsx
import {useRouter} from "next/navigation";

import {useFetchChildren, useAuth} from "@/hooks";
import Loading from "@/components/Loading";

export default function ChildSelectPage() {
  const router = useRouter();
  const {user, loading: authLoading} = useAuth();
  const {children, loading: childrenLoading, error} = useFetchChildren(user?.uid || "");

  if (authLoading || childrenLoading) return <Loading />;
  if (error) return <p>{error}</p>;

  const handleChildSelect = (childId: string) => {
    router.push(`/child-dashboard/${childId}`);
  };

  return (
    <div>
      <h1>Select a Child Account</h1>
      <ul>
        {children.map((child) => (
          <li key={child.id}>
            <button onClick={() => handleChildSelect(child.id)}>{child.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
