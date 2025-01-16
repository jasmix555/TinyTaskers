"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {collection, getDocs, doc, onSnapshot, runTransaction} from "firebase/firestore";
import {FaCaretDown, FaCaretLeft, FaSackDollar} from "react-icons/fa6";
import Image from "next/image";

import {db} from "@/api/firebase";
import {useAuth} from "@/hooks";
import {TaskIcons, Reward} from "@/types/TaskProps";
import {Child} from "@/types/ChildProps";
import {Loading} from "@/components";
import {usePointManagement} from "@/hooks";

export default function StorePage() {
  const {user} = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [rewardCounts, setRewardCounts] = useState<{[key: string]: number}>({});
  const [childPoints, setChildPoints] = useState<number | null>(null); // State for current points
  const {selectedChild, selectChild} = usePointManagement();
  const [isClient, setIsClient] = useState(false);
  const [routerReady, setRouterReady] = useState(false); // New state to check router readiness

  const router = useRouter();

  // Ensure the client-side rendering is active before using useRouter
  useEffect(() => {
    setIsClient(true); // Set to true once client-side rendering has started
    setRouterReady(true); // Indicate that the router is ready
  }, []);

  // Fetch children data
  useEffect(() => {
    if (!user) return;

    const fetchChildren = async () => {
      try {
        const childrenRef = collection(db, "users", user.uid, "children");
        const childrenSnapshot = await getDocs(childrenRef);
        const childrenData: Child[] = childrenSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Child[];

        setChildren(childrenData);
        if (childrenData.length > 0) selectChild(childrenData[0]);
      } catch (err) {
        console.error(err);
        setError("Failed to load child data.");
      }
    };

    fetchChildren();
  }, [user, selectChild]);

  // Sync child points and item counts with Firestore
  useEffect(() => {
    if (!user || !selectedChild) return;

    const childRef = doc(db, "users", user.uid, "children", selectedChild.id);
    const itemsRef = collection(childRef, "items");

    const unsubscribeChild = onSnapshot(childRef, (doc) => {
      if (doc.exists()) {
        const childData = doc.data() as Child;

        setChildPoints(childData.points || 0);
      }
    });

    const fetchItems = async () => {
      try {
        const itemsSnapshot = await getDocs(itemsRef);
        const itemsData = itemsSnapshot.docs.reduce(
          (acc, doc) => {
            acc[doc.id] = doc.data().count || 0;

            return acc;
          },
          {} as {[key: string]: number},
        );

        setRewardCounts(itemsData);
      } catch (err) {
        console.error("Failed to load items:", err);
      }
    };

    fetchItems();

    return () => unsubscribeChild();
  }, [user, selectedChild]);

  // Fetch rewards data
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const rewardsRef = collection(db, "rewards");
        const rewardsSnapshot = await getDocs(rewardsRef);
        const rewardsData: Reward[] = rewardsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Reward[];

        setRewards(rewardsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load rewards.");
      }
    };

    fetchRewards();
  }, []);

  const handlePurchase = async () => {
    if (!selectedChild || !selectedReward) return;

    const childRef = doc(db, "users", user!.uid, "children", selectedChild.id);
    const itemRef = doc(childRef, "items", selectedReward.id);
    const historyRef = collection(childRef, "history");

    try {
      await runTransaction(db, async (transaction) => {
        const childDoc = await transaction.get(childRef);

        if (!childDoc.exists()) throw new Error("Child not found");

        const currentPoints = childDoc.data().points || 0;

        if (currentPoints < selectedReward.pointsRequired) throw new Error("Insufficient points.");

        const itemDoc = await transaction.get(itemRef);
        const currentCount = itemDoc.exists() ? itemDoc.data().count : 0;

        // Deduct points
        transaction.update(childRef, {points: currentPoints - selectedReward.pointsRequired});

        // Increment reward count
        transaction.set(itemRef, {count: currentCount + 1}, {merge: true});

        // Log history
        transaction.set(doc(historyRef), {
          title: selectedReward.title,
          points: selectedReward.pointsRequired,
          action: "subtract",
          dateCompleted: new Date(),
        });

        // Update local state
        setChildPoints(currentPoints - selectedReward.pointsRequired);
        setRewardCounts((prev) => ({
          ...prev,
          [selectedReward.id]: (prev[selectedReward.id] || 0) + 1,
        }));
      });

      setIsModalOpen(false);
      setSelectedReward(null);
    } catch (error) {
      console.error("Purchase failed:", error);
      setError("Failed to complete purchase.");
    }
  };

  const filteredRewards = selectedChild
    ? rewards.filter((reward) => reward.availableFor.includes(selectedChild.id))
    : rewards;

  if (!user) return <Loading />;

  return (
    <div className="h-screen">
      {error && <p className="text-red-500">{error}</p>}

      {/* Points Summary */}
      {selectedChild && (
        <div className="flex w-full items-center justify-between bg-orange-300 p-4 text-white">
          <div className="relative flex items-center gap-3 rounded-lg">
            <div className="h-14 w-14 overflow-hidden rounded-full">
              <Image
                priority
                alt={selectedChild.name}
                className="rounded-full"
                height={200}
                src={selectedChild.picture || "/default-child.png"}
                width={200}
              />
            </div>

            {/* Child Name with Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-xl bg-gray-600/25 px-4 py-2 text-xl"
                onClick={() => setIsModalOpen((prev) => !prev)} // Toggle dropdown visibility
              >
                {selectedChild.name}
                <FaCaretDown />
              </button>

              {/* Dropdown Menu */}
              {isModalOpen && (
                <div className="absolute left-0 top-12 z-10 w-48 rounded-lg border bg-white shadow-lg">
                  <ul>
                    {children.map((child) => (
                      <li
                        key={child.id}
                        className={`cursor-pointer p-2 text-black hover:bg-gray-100 ${
                          child.id === selectedChild.id ? "font-bold" : ""
                        }`}
                        onClick={() => {
                          selectChild(child);
                          setIsModalOpen(false); // Close dropdown after selection
                        }}
                      >
                        {child.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <p className="flex items-center gap-2 font-bold sm:text-xl md:text-4xl">
            <span className="font-normal sm:text-lg md:text-3xl">
              <FaSackDollar />
            </span>
            {childPoints}
          </p>
        </div>
      )}

      {/* Rewards List */}
      <div
        className="no-scrollbar m-4 overflow-y-scroll rounded-lg bg-orange-200 p-4 shadow-md"
        style={{
          height: "calc(100vh - 7.8rem)",
        }}
      >
        {filteredRewards.length === 0 ? (
          <p className="text-center">No rewards available.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRewards.map((reward) => {
              const Icon = TaskIcons.find((icon) => icon.id === reward.icon)?.icon || FaSackDollar;
              const ownedCount = rewardCounts[reward.id] || 0;

              return (
                <li
                  key={reward.id}
                  className="flex flex-col items-center justify-between rounded-lg border bg-white p-4 shadow-md"
                >
                  <div className="mb-2 rounded-lg border p-4 text-5xl shadow-sm">
                    <Icon />
                  </div>
                  <div className="flex flex-col gap-2 text-center">
                    <p className="text-2xl font-bold">{reward.title}</p>
                    <p className="flex items-center justify-center gap-1 text-xl text-gray-600">
                      <FaSackDollar /> {reward.pointsRequired}
                    </p>
                    <p className="text-md text-gray-500">Owned: x{ownedCount}</p>
                  </div>
                  <button
                    className="mt-4 rounded-lg bg-orange-300 px-4 py-2 text-white hover:bg-orange-400 disabled:bg-gray-300"
                    disabled={!selectedChild || (childPoints ?? 0) < reward.pointsRequired}
                    onClick={() => {
                      setSelectedReward(reward);
                      setIsModalOpen(true);
                    }}
                  >
                    {(childPoints ?? 0) >= reward.pointsRequired
                      ? "Purchase"
                      : "Insufficient Points"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Modal for Purchase Confirmation */}
      {isModalOpen && selectedReward && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Confirm Purchase</h2>
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-lg border p-4 text-5xl shadow-sm">
                {React.createElement(
                  TaskIcons.find((icon) => icon.id === selectedReward.icon)?.icon || FaSackDollar,
                )}
              </div>
            </div>
            <p className="mb-4">
              Are you sure you want to purchase <strong>{selectedReward.title}</strong>?
            </p>
            <p className="mb-4">
              This will deduct <strong>{selectedReward.pointsRequired}</strong> points from{" "}
              <strong>{selectedChild?.name}</strong>.
            </p>
            <div className="flex justify-between gap-4">
              <button
                className="rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
                onClick={handlePurchase}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-12 left-10 z-0 rounded-lg">
        <button
          className="flex items-center gap-2 rounded-lg border bg-white p-4 px-4 py-2 shadow-md hover:bg-gray-100"
          onClick={() => {
            if (selectedChild && routerReady) {
              router.push(`/child-dashboard/${selectedChild.id}`);
            }
          }}
        >
          <FaCaretLeft />
          Back to Child Dashboard
        </button>
      </div>
    </div>
  );
}
