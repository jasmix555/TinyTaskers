"use client";

import React, {useState, useEffect} from "react";
import {collection, addDoc, getDocs, updateDoc, deleteDoc, doc} from "firebase/firestore";
import {FaGift} from "react-icons/fa";

import {db} from "@/api/firebase";
import {useAuth, useFetchChildren} from "@/hooks";
import {TaskIcons} from "@/types/TaskProps"; // Import TaskIcons

// Define the interface for a Reward item
interface Reward {
  id: string; // Firestore document ID
  title: string; // Name of the reward
  pointsRequired: number; // Points required to redeem the reward
  dateAdded: Date; // Date the reward was added
  icon: string; // Icon for the reward
  availableFor: string[]; // List of children ids the reward is available for
}

// Define the state type for the new reward being added
interface NewReward {
  id: string; // Firestore document ID
  title: string;
  pointsRequired: number;
  icon: string;
  availableFor: string[];
}

export default function RewardsPage() {
  const {user, loading: authLoading} = useAuth();
  const {children, error: childrenError} = useFetchChildren(user?.uid || "");

  const [newReward, setNewReward] = useState<NewReward>({
    id: "",
    title: "",
    pointsRequired: 0,
    icon: "",
    availableFor: [],
  });

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Handle new reward form submission
  const handleAddReward = async () => {
    if (
      !newReward.title.trim() ||
      newReward.pointsRequired <= 0 ||
      isNaN(newReward.pointsRequired) ||
      !newReward.icon ||
      newReward.availableFor.length === 0
    ) {
      setError("Please provide all details for the reward.");

      return;
    }

    setLoading(true);
    try {
      const rewardsRef = collection(db, "rewards");

      if (isEditMode) {
        const rewardDoc = doc(db, "rewards", newReward.id);

        await updateDoc(rewardDoc, {
          title: newReward.title,
          pointsRequired: newReward.pointsRequired,
          icon: newReward.icon,
          availableFor: newReward.availableFor,
        });
        setIsEditMode(false);
      } else {
        await addDoc(rewardsRef, {
          ...newReward,
          dateAdded: new Date(),
        });
      }

      setNewReward({
        id: "",
        title: "",
        pointsRequired: 0,
        icon: "",
        availableFor: [],
      });
      setError(null);
      fetchRewards();
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to add or update reward.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch rewards from Firestore
  const fetchRewards = async () => {
    try {
      const rewardsRef = collection(db, "rewards");
      const rewardsSnapshot = await getDocs(rewardsRef);
      const rewardsList: Reward[] = rewardsSnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Reward, "id">;

        return {
          id: doc.id,
          ...data,
        };
      });

      setRewards(rewardsList);
    } catch (err) {
      setError("Failed to load rewards.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  // Handle the edit reward button
  const handleEditReward = (id: string) => {
    const rewardToEdit = rewards.find((reward) => reward.id === id);

    if (rewardToEdit) {
      setNewReward({
        id: rewardToEdit.id,
        title: rewardToEdit.title,
        pointsRequired: rewardToEdit.pointsRequired,
        icon: rewardToEdit.icon,
        availableFor: rewardToEdit.availableFor,
      });
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  // Handle reward deletion
  const handleDeleteReward = async (id: string) => {
    setLoading(true);
    try {
      const rewardDoc = doc(db, "rewards", id);

      await deleteDoc(rewardDoc);
      fetchRewards();
    } catch (err) {
      setError("Failed to delete the reward.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto max-w-md p-4">
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">Rewards Store</h1>
      <div className="mb-4">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-300 px-4 py-2 text-2xl font-bold text-white shadow-md hover:bg-orange-400"
          onClick={() => {
            setIsEditMode(false);
            setIsModalOpen(true);
          }}
        >
          Add Reward
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">
              {isEditMode ? "Edit Reward" : "Add New Reward"}
            </h2>
            <div className="mb-4">
              <input
                className="mb-2 w-full rounded-lg border border-gray-300 p-2"
                placeholder="Reward Title"
                type="text"
                value={newReward.title}
                onChange={(e) => setNewReward({...newReward, title: e.target.value})}
              />
              <input
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="Points Required"
                type="number"
                value={newReward.pointsRequired}
                onChange={(e) =>
                  setNewReward({...newReward, pointsRequired: parseInt(e.target.value)})
                }
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block">
                Select Icon
                <div className="grid max-h-52 grid-cols-3 gap-2 overflow-auto rounded-lg border border-gray-300 p-2">
                  {TaskIcons.map((icon) => (
                    <button
                      key={icon.id}
                      aria-pressed={newReward.icon === icon.id}
                      className={`flex items-center justify-center rounded-md border ${
                        newReward.icon === icon.id
                          ? "border-blue-500 bg-blue-100"
                          : "border-transparent hover:bg-gray-100"
                      }`}
                      type="button"
                      onClick={() => setNewReward({...newReward, icon: icon.id})}
                    >
                      <div className="p-4 text-2xl">{React.createElement(icon.icon)}</div>
                    </button>
                  ))}
                </div>
              </label>
            </div>
            <div className="mb-4">
              <label className="mb-2 block">
                Select Children
                <select
                  multiple
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={newReward.availableFor}
                  onChange={(e) =>
                    setNewReward({
                      ...newReward,
                      availableFor: Array.from(e.target.selectedOptions, (option) => option.value),
                    })
                  }
                >
                  {children.map((child) => (
                    <option key={child.id} className="p-2" value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-between">
              <button
                className="rounded-lg bg-gray-300 px-4 py-2 text-black"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-orange-300 px-4 py-2 text-white"
                onClick={handleAddReward}
              >
                {isEditMode ? "Save Changes" : "Add Reward"}
              </button>
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {childrenError && <p className="text-red-500">{childrenError}</p>}
      {loading ? (
        <p>Loading rewards...</p>
      ) : rewards.length === 0 ? (
        <p>No rewards registered.</p>
      ) : (
        <ul>
          {rewards.map((reward) => {
            // Find the corresponding icon for the reward
            const Icon = TaskIcons.find((icon) => icon.id === reward.icon)?.icon || FaGift;

            return (
              <li
                key={reward.id}
                className="mb-4 flex items-center justify-between rounded-lg border-l border-r border-t border-gray-200 p-4 shadow-md"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-gray-200 p-4 text-3xl">
                    <Icon /> {/* Render the icon */}
                  </div>
                  <div className="flex-1">
                    <p className="max-w-xs truncate font-bold">{reward.title}</p>{" "}
                    {/* Title with ellipsis */}
                    <p className="text-gray-600">{reward.pointsRequired} points</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-lg bg-orange-300 px-4 py-2 text-white hover:bg-orange-400"
                    onClick={() => handleEditReward(reward.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    onClick={() => handleDeleteReward(reward.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
