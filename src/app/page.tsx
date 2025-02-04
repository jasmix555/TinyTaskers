"use client";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";

import {useAuth, useFetchChildren} from "@/hooks";
import {Child} from "@/types/ChildProps";
import {ChildListPopup, Loading, ChildHistory} from "@/components";

export default function HomePage() {
  const {user, loading: authLoading} = useAuth();
  const {children, loading: childrenLoading} = useFetchChildren(user?.uid || "");
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showListPopup, setShowListPopup] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();

  // Redirect to welcome page if user is not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/welcome");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const savedChildId = localStorage.getItem("selectedChildId");

    if (children.length > 0) {
      if (savedChildId) {
        const savedChild = children.find((child) => child.id === savedChildId);

        if (savedChild) {
          setSelectedChild(savedChild);

          return;
        }
      }
      setSelectedChild(children[0]);
    }
  }, [children]);

  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
    localStorage.setItem("selectedChildId", child.id);
    setShowListPopup(false);
  };

  const handleRegisterChild = () => {
    router.push("/child-registration");
  };

  const handleCopyLink = () => {
    if (selectedChild) {
      const childDashboardLink = `${window.location.origin}/child-dashboard/${selectedChild.id}`;

      navigator.clipboard.writeText(childDashboardLink).then(() => {
        setNotification(`${selectedChild.name}のリンクがコピーされました`);
        setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
      });
    }
  };

  if (authLoading || childrenLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto max-w-md">
      {/* if no children registered add button to register child and show no child registered */}
      {children.length === 0 && (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
          <h1 className="text-center text-2xl font-bold">登録された子供はいません</h1>
          <button
            className="rounded-lg bg-orange-300 px-4 py-2 text-white shadow-md"
            onClick={handleRegisterChild}
          >
            子供を登録する
          </button>
        </div>
      )}

      {children.length > 0 && selectedChild && (
        <button
          className="flex w-full cursor-pointer items-center gap-4 rounded-b-lg border-b border-gray-200 bg-white p-4 shadow-md"
          onClick={() => setShowListPopup(true)}
        >
          <div className="h-14 w-14 overflow-hidden rounded-full">
            <Image
              priority
              alt={selectedChild.name}
              className="h-full w-full bg-contain"
              height={200}
              src={selectedChild.picture || "/default-child.png"}
              width={200}
            />
          </div>
          <h2 className="text-xl">{selectedChild.name}</h2>
          <p className="ml-auto text-2xl font-bold">{selectedChild.points}pt</p>
        </button>
      )}

      {/* Copy Link Button */}
      {selectedChild && (
        <div className="flex w-full justify-end p-4">
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600"
            onClick={handleCopyLink}
          >
            リンクをコピー
          </button>
        </div>
      )}

      {showListPopup && (
        <ChildListPopup
          childrenList={children}
          selectedChildId={selectedChild?.id || ""}
          onClose={() => setShowListPopup(false)}
          onRegister={handleRegisterChild}
          onSelect={handleSelectChild}
        />
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed left-1/2 top-4 -translate-x-1/2 transform rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg">
          {notification}
        </div>
      )}

      {/* Display ChildHistory below the child selection */}
      {selectedChild && user && <ChildHistory childId={selectedChild.id} userId={user.uid} />}
    </div>
  );
}
