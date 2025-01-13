"use client";

import {useState, useEffect} from "react";
import {collection, addDoc, getDocs, updateDoc, doc} from "firebase/firestore";
import {FaPlus, FaGift, FaGamepad, FaApple, FaStar} from "react-icons/fa";

import {db} from "@/api/firebase";
import {useAuth, useFetchChildren} from "@/hooks";

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

// Icon data for the picker (you can add more icons here)
const iconOptions = [
  {id: "gift", icon: <FaGift />},
  {id: "gamepad", icon: <FaGamepad />},
  {id: "apple", icon: <FaApple />},
  {id: "star", icon: <FaStar />},
  // Add more icons as needed
];

export default function RewardsPage() {
  const {user, loading: authLoading} = useAuth();
  const {children, error: childrenError} = useFetchChildren(user?.uid || ""); // Pass user.uid here

  const [newReward, setNewReward] = useState<NewReward>({
    id: "", // Firestore document ID
    title: "",
    pointsRequired: 0,
    icon: "",
    availableFor: [],
  });

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // Edit mode flag

  // Handle new reward form submission
  const handleAddReward = async () => {
    // Validate inputs
    if (
      !newReward.title.trim() || // Ensure title is not empty
      newReward.pointsRequired <= 0 || // Ensure pointsRequired is a positive number
      isNaN(newReward.pointsRequired) || // Ensure pointsRequired is a number
      !newReward.icon || // Ensure icon is selected
      newReward.availableFor.length === 0 // Ensure availableFor is not empty
    ) {
      setError("Please provide all details for the reward.");

      return;
    }

    setLoading(true);
    try {
      const rewardsRef = collection(db, "rewards");

      if (isEditMode) {
        // Update the existing reward
        const rewardDoc = doc(db, "rewards", newReward.id); // Use newReward.id instead of newReward.icon

        await updateDoc(rewardDoc, {
          title: newReward.title,
          pointsRequired: newReward.pointsRequired,
          icon: newReward.icon,
          availableFor: newReward.availableFor,
        });

        setIsEditMode(false); // Reset edit mode after updating
      } else {
        // Add new reward
        await addDoc(rewardsRef, {
          ...newReward,
          dateAdded: new Date(),
        });
      }

      // Reset form and state after submission
      setNewReward({
        id: "", // Firestore document ID
        title: "",
        pointsRequired: 0,
        icon: "",
        availableFor: [],
      });
      setError(null); // Reset error
      fetchRewards(); // Re-fetch rewards after adding or editing a reward
      setIsModalOpen(false); // Close the modal after submitting
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
      setIsEditMode(true); // Enable edit mode
      setIsModalOpen(true); // Open the modal
    }
  };

  if (authLoading || !user) {
    return <p>Loading...</p>; // Wait for auth state to load
  }

  return (
    <div className="container mx-auto max-w-md p-4">
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">ストア</h1>

      <div className="mb-4">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-300 px-4 py-2 text-2xl font-bold text-white shadow-md hover:bg-orange-400"
          onClick={() => {
            setIsEditMode(false);
            setIsModalOpen(true);
          }}
        >
          <FaPlus />
          欲しいもの追加
        </button>
      </div>

      {/* Modal for adding or editing reward */}
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

            {/* Scrollable Icon Grid */}
            <div className="mb-4">
              <label className="mb-2 block">
                Select Icon
                <div className="grid max-h-48 grid-cols-3 gap-2 overflow-auto rounded-lg border border-gray-300 p-2">
                  {iconOptions.map((icon) => (
                    <div
                      key={icon.id}
                      className={`flex cursor-pointer items-center justify-center rounded-md border p-2 ${
                        newReward.icon === icon.id
                          ? "border-blue-500 bg-blue-100"
                          : "border-transparent hover:bg-gray-100"
                      }`}
                      role="button" // Make the div behave like a button
                      tabIndex={0} // Make the div focusable via keyboard (tab key)
                      onClick={() => setNewReward({...newReward, icon: icon.id})}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setNewReward({...newReward, icon: icon.id});
                        }
                      }}
                    >
                      <div className="text-2xl">{icon.icon}</div>
                    </div>
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
                    <option key={child.id} value={child.id}>
                      {child.name} {/* Assuming each child has a `name` property */}
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

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}
      {childrenError && <p className="text-red-500">{childrenError}</p>}

      {/* List of Rewards */}
      {loading ? (
        <p>Loading rewards...</p>
      ) : rewards.length === 0 ? (
        <p>No rewards registered.</p> // Message when there are no rewards
      ) : (
        <ul>
          {rewards.map((reward) => (
            <li
              key={reward.id}
              className="mb-4 flex items-center justify-between rounded-lg border-l border-r border-t border-gray-200 p-4 shadow-md"
            >
              <div className="flex items-center gap-2 p-2">
                <div className="mr-2 rounded-lg border border-gray-300 bg-white p-4 text-2xl">
                  {iconOptions.find((icon) => icon.id === reward.icon)?.icon}
                </div>
                <div className="">
                  <p className="font-bold">{reward.title}</p>
                  <p className="text-gray-600">{reward.pointsRequired} points</p>
                </div>
              </div>
              {/* Edit Button */}
              <button
                className="rounded-lg bg-orange-300 px-4 py-2 text-white hover:bg-orange-400"
                onClick={() => handleEditReward(reward.id)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
