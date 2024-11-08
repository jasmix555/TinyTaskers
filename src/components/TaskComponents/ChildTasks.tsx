import {useEffect, useState} from "react";
import {FaScroll} from "react-icons/fa";

import {useFetchTasks, useTaskManagement} from "@/hooks"; // Ensure all hooks are correctly imported
import {Task} from "@/types/TaskProps"; // Adjust this import path based on your structure

interface ChildTasksProps {
  childId: string; // Define the prop type for child ID
}

const ChildTasks = ({childId}: ChildTasksProps) => {
  const {tasks, loading, error, refetch} = useFetchTasks(childId); // Fetch tasks based on the child's ID
  const {acceptTask, confirmCompletion} = useTaskManagement();
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    if (childId) {
      refetch();
    }
  }, [childId, refetch]);

  useEffect(() => {
    setLocalTasks(tasks); // Sync local state with fetched tasks
  }, [tasks]);

  const handleAcceptTask = async (taskId: string) => {
    // Update local state
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? {...task, status: "ongoing"} : task)),
    );
    await acceptTask(taskId); // Call the acceptTask hook to persist the change
  };

  const handleAskForConfirmation = async (taskId: string) => {
    // Update local state to indicate confirmation request
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? {...task, status: "confirmation"} : task)),
    );
    await confirmCompletion(taskId); // Call the confirmCompletion hook to persist the change
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="flex items-center gap-2 font-bold sm:text-xl md:text-4xl">
        <FaScroll />
        挑戦できるクエスト
      </h2>
      {localTasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <ul className="space-y-4">
          {localTasks.map((task) => (
            <li key={task.id} className="rounded-md border bg-gray-100 p-4">
              {task.status === "confirmation" ? (
                <div className="rounded-md border border-yellow-300 bg-yellow-100 p-4">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p>{task.description}</p>
                  <p className="text-sm">Points: {task.points}</p>
                  <p className="text-sm">Status: Confirmation Requested</p>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p>{task.description}</p>
                  <p className="text-sm">Points: {task.points}</p>
                  <p className="text-sm">Status: {task.status}</p>
                  {task.status === "pending" && (
                    <button
                      className="mt-2 rounded-md bg-green-500 px-4 py-2 text-white"
                      onClick={() => handleAcceptTask(task.id)} // Accept task
                    >
                      Accept Task
                    </button>
                  )}
                  {task.status === "ongoing" && (
                    <button
                      className="mt-2 rounded-md bg-orange-500 px-4 py-2 text-white"
                      onClick={() => handleAskForConfirmation(task.id)} // Ask for confirmation
                    >
                      Ask for Confirmation
                    </button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChildTasks;
