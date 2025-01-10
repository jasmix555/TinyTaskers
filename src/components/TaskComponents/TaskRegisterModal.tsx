import {useState, FormEvent} from "react";
import {collection, addDoc, Timestamp} from "firebase/firestore";

import {db} from "@/api/firebase";
import {useFetchChildren, useAuth} from "@/hooks";

interface TaskRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

export default function TaskRegisterModal({isOpen, onClose, onTaskAdded}: TaskRegisterModalProps) {
  const {user} = useAuth();
  const {children, loading} = useFetchChildren(user?.uid || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedChild, setSelectedChild] = useState("");
  const [points, setPoints] = useState<number | string>(1); // Allow string for empty input
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !selectedChild || !points || Number(points) <= 0) {
      alert("Please fill in all required fields.");

      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        points: Number(points), // Convert points to number before saving
        childId: selectedChild,
        userId: user?.uid,
        status: "pending",
        dateCreated: Timestamp.now(),
      });

      setSuccessMessage("Task added successfully!");
      setTitle("");
      setDescription("");
      setSelectedChild("");
      setPoints(1); // Reset points to default
      setTimeout(() => setSuccessMessage(null), 3000);
      onTaskAdded(); // Notify parent about the new task
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Create a New Task</h2>
        <form className="space-y-4" onSubmit={handleAddTask}>
          <label className="block text-sm font-medium text-gray-700">
            Task Title
            <input
              required
              className="mt-1 block w-full border-b-2 border-gray-300 px-4 py-2 focus:border-orange-300 focus:outline-none"
              placeholder="Enter task title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Task Description
            <textarea
              className="mt-1 block w-full border-b-2 border-gray-300 px-4 py-2 focus:border-orange-300 focus:outline-none"
              placeholder="Enter task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Assign to Child
            <select
              required
              className="mt-1 block w-full border-b-2 border-gray-300 px-4 py-2 focus:border-orange-300 focus:outline-none"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
            >
              <option value="">Select Child</option>
              {!loading &&
                children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Task Points
            <input
              required
              className="mt-1 block w-full border-b-2 border-gray-300 px-4 py-2 focus:border-orange-300 focus:outline-none"
              placeholder="Enter points for task"
              type="number"
              value={points}
              onChange={(e) => {
                const value = e.target.value;

                setPoints(value === "" ? "" : Number(value));
              }}
            />
          </label>

          <div className="flex justify-end gap-2">
            <button className="rounded bg-gray-300 px-4 py-2" type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              className="rounded bg-orange-300 px-4 py-2 text-white shadow-sm hover:bg-orange-400"
              type="submit"
            >
              Add Task
            </button>
          </div>
        </form>
        {successMessage && <p className="mt-4 text-center text-green-500">{successMessage}</p>}
      </div>
    </div>
  );
}
