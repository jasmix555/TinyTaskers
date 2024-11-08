import {Task} from "@/types/TaskProps";
import {useUpdateTask} from "@/hooks/useUpdateTask"; // Updated import

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetail({task, onClose}: TaskDetailProps) {
  const {updateTask} = useUpdateTask();

  const handleCompleteTask = async () => {
    try {
      await updateTask(task.id, {status: "completed"}); // Update status only
      // Optionally handle point addition logic here
      onClose(); // Close detail modal after completion
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  return (
    <div className="rounded bg-white p-6 shadow-lg">
      <h3 className="text-xl font-semibold">{task.title}</h3>
      <p>{task.description}</p>
      <button className="rounded bg-green-500 p-2 text-white" onClick={handleCompleteTask}>
        Complete Task
      </button>
      <button className="rounded bg-gray-500 p-2 text-white" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
