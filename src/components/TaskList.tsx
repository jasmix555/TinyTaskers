// src/components/TaskList.tsx
import {useState, useEffect} from "react";

import TaskEditForm from "./TaskEditForm";

import {useFetchTasks, useFetchChildren, useAuth} from "@/hooks";
import {Task} from "@/types/Task";

export default function TaskList() {
  const {user} = useAuth();
  const {tasks, loading: tasksLoading, error: tasksError, refetch: refetchTasks} = useFetchTasks();
  const {
    children,
    loading: childrenLoading,
    error: childrenError,
  } = useFetchChildren(user ? user.uid : "");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (editingTaskId) {
      refetchTasks(); // Refetch tasks when editing task changes
    }
  }, [editingTaskId, refetchTasks]);

  if (!user) return <p>Please log in to view tasks.</p>;
  if (tasksLoading || childrenLoading) return <p>Loading tasks...</p>;
  if (tasksError) return <p>{tasksError}</p>;
  if (childrenError) return <p>{childrenError}</p>;

  const getChildName = (childId: string) => {
    const child = children.find((child) => child.id === childId);

    return child ? child.name : "Unknown Child";
  };

  const handleEditClick = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const handleCloseEdit = () => {
    setEditingTaskId(null);
  };

  const updateTaskList = () => {
    refetchTasks(); // Just refetch the tasks
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <h2 className="text-2xl font-bold text-gray-800">Task List</h2>

      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task: Task) => (
            <div key={task.id} className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
              <p className="text-gray-700">
                <strong>Description:</strong> {task.description || "No description provided"}
              </p>
              <p className="text-gray-700">
                <strong>Assigned to:</strong> {getChildName(task.childId)}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong> {task.status}
              </p>
              <button
                className="rounded bg-yellow-500 p-2 text-white"
                onClick={() => handleEditClick(task.id)}
              >
                Edit Task
              </button>
            </div>
          ))}
        </div>
      )}

      {editingTaskId && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="rounded bg-white p-6 shadow-lg">
            <TaskEditForm
              taskId={editingTaskId}
              updateTaskList={updateTaskList} // Pass updateTaskList as a prop
              onClose={handleCloseEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
