// src/components/TaskEditForm.tsx
import {useEffect, useState, FormEvent} from "react";
import {doc, getDoc} from "firebase/firestore"; // Import Firestore functions

import {db} from "@/api/firebase"; // Ensure the correct import path for your Firestore instance
import {Task} from "@/types/Task"; // Import the Task type
import {useUpdateTask} from "@/hooks"; // Import your custom hook for updating tasks

interface TaskEditFormProps {
  taskId: string;
  onClose: () => void;
  updateTaskList: (updatedTask: Task) => void;
}

// Using export default function syntax
const TaskEditForm = ({taskId, onClose, updateTaskList}: TaskEditFormProps) => {
  const {updateTask} = useUpdateTask(); // Get the updateTask function from the custom hook
  const [task, setTask] = useState<Task | null>(null); // State to hold the task data

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await getTaskById(taskId); // Fetch the task by ID

        setTask(fetchedTask); // Update the state with the fetched task
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (task) {
      try {
        await updateTask(task); // Update the task in Firestore
        updateTaskList(task); // Notify the TaskList of the updated task
        onClose(); // Close the edit form after updating
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  if (!task) return <p className="text-center text-gray-500">Loading...</p>; // Show loading message while fetching the task

  return (
    <form className="rounded bg-white p-4 shadow-md" onSubmit={handleSubmit}>
      <h2 className="mb-4 text-lg font-semibold">Edit Task</h2>
      <input
        required
        className="mb-4 w-full rounded border border-gray-300 p-2"
        placeholder="Task Title"
        type="text"
        value={task.title}
        onChange={(e) => setTask({...task, title: e.target.value})}
      />
      <textarea
        required
        className="mb-4 w-full rounded border border-gray-300 p-2"
        placeholder="Task Description"
        value={task.description}
        onChange={(e) => setTask({...task, description: e.target.value})}
      />
      <input
        required
        className="mb-4 w-full rounded border border-gray-300 p-2"
        placeholder="Points"
        type="number"
        value={task.points}
        onChange={(e) => setTask({...task, points: parseInt(e.target.value)})}
      />
      <select
        className="mb-4 w-full rounded border border-gray-300 p-2"
        value={task.status}
        onChange={(e) => setTask({...task, status: e.target.value})}
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <div className="flex justify-between">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          type="submit"
        >
          Update Task
        </button>
        <button
          className="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Function to fetch a task by ID
const getTaskById = async (taskId: string): Promise<Task> => {
  const taskRef = doc(db, "tasks", taskId); // Create a reference to the task document
  const taskSnapshot = await getDoc(taskRef); // Get the document snapshot

  if (taskSnapshot.exists()) {
    return {id: taskSnapshot.id, ...taskSnapshot.data()} as Task; // Return the task data
  } else {
    throw new Error("Task not found"); // Throw an error if the task does not exist
  }
};

// Use default export for the component
export default TaskEditForm;
