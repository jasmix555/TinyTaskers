"use client";

import React, {useEffect, useState} from "react";
import {collection, getDocs, doc, onSnapshot, runTransaction} from "firebase/firestore";
import {FaSackDollar} from "react-icons/fa6";

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
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">Store</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Child Selection Dropdown */}
      <div className="mb-4">
        <label className="block font-bold" htmlFor="childSelect">
          Select Child:
        </label>
        <select
          className="mt-2 w-full rounded-lg border border-gray-300 p-2"
          id="childSelect"
          value={selectedChild?.id || ""}
          onChange={(e) => {
            const selectedChild = children.find((child) => child.id === e.target.value);

            selectChild(selectedChild!);
          }}
        >
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
        </select>
      </div>

      {/* Points Summary */}
      {selectedChild && (
        <div className="mb-4 flex justify-between rounded-lg bg-gray-100 p-4">
          <span className="text-lg font-bold">{selectedChild.name}&apos;s Points</span>
          <span className="flex items-center gap-1 text-xl font-bold text-orange-500">
            <FaSackDollar /> {childPoints ?? 0}
          </span>
        </div>
      )}

      {/* Rewards List */}
      {filteredRewards.length === 0 ? (
        <p className="text-center">No rewards available.</p>
      ) : (
        <ul>
          {filteredRewards.map((reward) => {
            const Icon = TaskIcons.find((icon) => icon.id === reward.icon)?.icon || FaSackDollar;
            const ownedCount = rewardCounts[reward.id] || 0;

            return (
              <li
                key={reward.id}
                className="mb-4 flex items-center justify-between rounded-lg border p-4 shadow-md"
              >
                <div className="flex items-center gap-2">
                  <div className="text-3xl">
                    <Icon />
                  </div>
                  <div>
                    <p className="font-bold">{reward.title}</p>
                    <p className="flex items-center gap-1 text-gray-600">
                      <FaSackDollar /> {reward.pointsRequired}
                    </p>
                    <p className="text-sm text-gray-500">Owned: x{ownedCount}</p>{" "}
                    {/* Owned count here */}
                  </div>
                </div>
                <button
                  className="rounded-lg bg-orange-300 px-4 py-2 text-white hover:bg-orange-400 disabled:bg-gray-300"
                  disabled={!selectedChild || (childPoints ?? 0) < reward.pointsRequired}
                  onClick={() => {
                    setSelectedReward(reward);
                    setIsModalOpen(true);
                  }}
                >
                  {(childPoints ?? 0) >= reward.pointsRequired ? "Purchase" : "Insufficient Points"}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal for Purchase Confirmation */}
      {isModalOpen && selectedReward && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Confirm Purchase</h2>
            <p className="mb-4">
              Are you sure you want to purchase <strong>{selectedReward.title}</strong>?
            </p>
            <div className="flex justify-end gap-4">
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
    </div>
  );
}
