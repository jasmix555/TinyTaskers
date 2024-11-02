"use client";
import {useState, FormEvent} from "react";
import {collection, addDoc, Timestamp} from "firebase/firestore";
import Link from "next/link";

import {db} from "@/api/firebase";
import {useFetchChildren, useAuth} from "@/hooks";

export default function AddTaskForm() {
  const {user} = useAuth();
  const {children, loading} = useFetchChildren(user?.uid || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedChild, setSelectedChild] = useState("");
  const [points, setPoints] = useState<number>(1); // Default points value set to 1
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !selectedChild || points <= 0) {
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        points,
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
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form
      className="mx-auto max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md"
      onSubmit={handleAddTask}
    >
      <h2 className="text-xl font-bold text-gray-800">Create a New Task</h2>

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
          pattern="^[1-9][0-9]*$" // Only allows numbers that don’t start with 0
          placeholder="Enter points for task"
          type="text"
          value={points}
          onChange={(e) => {
            const value = e.target.value;

            if (/^[1-9][0-9]*$/.test(value) || value === "") {
              setPoints(Number(value));
            }
          }}
        />
      </label>

      <button
        className="w-full rounded-md bg-orange-300 px-4 py-2 font-semibold text-white shadow-sm hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        type="submit"
      >
        Add Task
      </button>

      {successMessage && <p className="mt-4 text-center text-green-500">{successMessage}</p>}

      <p className="mt-4 text-center text-sm text-gray-600">
        <Link className="text-orange-300 hover:text-orange-400" href="/task-index">
          Return to Task List
        </Link>
      </p>
    </form>
  );
}
