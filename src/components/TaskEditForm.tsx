//components/TaskEditForm.tsx
import {useEffect, useState, FormEvent} from "react";
import {doc, getDoc} from "firebase/firestore";

import {db} from "@/api/firebase";
import {Task} from "@/types/Task";
import {useUpdateTask} from "@/hooks";

interface TaskEditFormProps {
  taskId: string;
  onClose: () => void;
  updateTaskList: (updatedTask: Task) => void;
}

const TaskEditForm = ({taskId, onClose, updateTaskList}: TaskEditFormProps) => {
  const {updateTask} = useUpdateTask();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await getTaskById(taskId);

        setTask(fetchedTask);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (task) {
      try {
        await updateTask(task);
        updateTaskList(task);
        onClose();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  if (!task) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <form className="rounded bg-white p-4 shadow-md" onSubmit={handleSubmit}>
      <h2 className="mb-4 text-lg font-semibold">Edit Task</h2>

      <label className="mb-4 block">
        <span className="text-gray-700">Task Title</span>
        <input
          required
          className="mt-1 w-full rounded border border-gray-300 p-2"
          type="text"
          value={task.title}
          onChange={(e) => setTask({...task, title: e.target.value})}
        />
      </label>

      <label className="mb-4 block">
        <span className="text-gray-700">Task Description</span>
        <textarea
          required
          className="mt-1 w-full rounded border border-gray-300 p-2"
          value={task.description}
          onChange={(e) => setTask({...task, description: e.target.value})}
        />
      </label>

      <label className="mb-4 block">
        <span className="text-gray-700">Points</span>
        <input
          required
          className="mt-1 w-full rounded border border-gray-300 p-2"
          type="number"
          value={task.points}
          onChange={(e) => setTask({...task, points: parseInt(e.target.value)})}
        />
      </label>

      <label className="mb-4 block">
        <span className="text-gray-700">Status</span>
        <select
          className="mt-1 w-full rounded border border-gray-300 p-2"
          value={task.status}
          onChange={(e) => setTask({...task, status: e.target.value})}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </label>

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

const getTaskById = async (taskId: string): Promise<Task> => {
  const taskRef = doc(db, "tasks", taskId);
  const taskSnapshot = await getDoc(taskRef);

  if (taskSnapshot.exists()) {
    return {id: taskSnapshot.id, ...taskSnapshot.data()} as Task;
  } else {
    throw new Error("Task not found");
  }
};

export default TaskEditForm;
