// src/components/TaskList.tsx
import {useState, useEffect} from "react";

import Loading from "./Loading";
import TaskEditForm from "./TaskEditForm";

import {useFetchTasks, useFetchChildren, useAuth, useDeleteTask} from "@/hooks";
import {Task} from "@/types/Task";

export default function TaskList() {
  const {user} = useAuth();
  const {tasks, loading: tasksLoading, error: tasksError, refetch: refetchTasks} = useFetchTasks();
  const {
    children,
    loading: childrenLoading,
    error: childrenError,
  } = useFetchChildren(user ? user.uid : "");
  const {deleteTask} = useDeleteTask();

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (editingTaskId) {
      refetchTasks(); // Refetch tasks when editing task changes
    }
  }, [editingTaskId, refetchTasks]);

  if (tasksLoading || childrenLoading) return <Loading />;
  if (tasksError) return <p>{tasksError}</p>;
  if (childrenError) return <p>{childrenError}</p>;

  const getChildName = (childId: string) => {
    const child = children.find((child) => child.id === childId);

    return child ? child.name : "Unknown Child";
  };

  const handleEditClick = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const handleDeleteClick = async (taskId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");

    if (confirmed) {
      try {
        await deleteTask(taskId);
        refetchTasks(); // Refetch tasks after deletion
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleCloseEdit = () => {
    setEditingTaskId(null);
  };

  return (
    <div className="mx-auto max-w-md p-4">
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

              <div className="flex justify-between">
                <button
                  className="rounded bg-yellow-500 p-2 text-white"
                  onClick={() => handleEditClick(task.id)}
                >
                  Edit Task
                </button>
                <button
                  className="rounded bg-red-500 p-2 text-white"
                  onClick={() => handleDeleteClick(task.id)}
                >
                  Delete Task
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTaskId && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="rounded p-6 shadow-lg">
            <TaskEditForm
              taskId={editingTaskId}
              updateTaskList={refetchTasks} // Refetch tasks on update
              onClose={handleCloseEdit}
            />
          </div>
        </div>
      )}

      {/* link to go task-register */}
    </div>
  );
}
