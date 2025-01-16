import {useEffect, useState, FormEvent} from "react";
import {doc, getDoc} from "firebase/firestore";

import {db} from "@/api/firebase";
import {Task} from "@/types/TaskProps";
import {useUpdateTask} from "@/hooks";

interface TaskEditFormProps {
  taskId: string;
  onClose: () => void;
  updateTaskList: (updatedTask: Task) => void;
}

export default function TaskEditForm({taskId, onClose, updateTaskList}: TaskEditFormProps) {
  const {updateTask} = useUpdateTask();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await getTaskById(taskId);

        setTask(fetchedTask);
      } catch (error) {
        console.error("タスクの取得エラー:", error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (task) {
      try {
        await updateTask(taskId, {
          title: task.title,
          description: task.description,
          points: task.points,
          status: task.status,
        });
        updateTaskList(task);
        onClose();
      } catch (error) {
        console.error("タスクの更新エラー:", error);
      }
    }
  };

  if (!task) return <p className="text-center text-gray-500">読み込み中...</p>;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <form
        className="m-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4 text-lg font-semibold">タスクの編集</h2>

        <label className="mb-4 block">
          <span className="text-gray-700">タスクタイトル</span>
          <input
            required
            className="mt-1 w-full rounded border border-gray-300 p-2"
            type="text"
            value={task.title}
            onChange={(e) => setTask({...task, title: e.target.value})}
          />
        </label>

        <label className="mb-4 block">
          <span className="text-gray-700">タスクの説明</span>
          <textarea
            required
            className="mt-1 w-full rounded border border-gray-300 p-2"
            value={task.description}
            onChange={(e) => setTask({...task, description: e.target.value})}
          />
        </label>

        <label className="mb-4 block">
          <span className="text-gray-700">ポイント</span>
          <input
            required
            className="mt-1 w-full rounded border border-gray-300 p-2"
            type="number"
            value={task.points}
            onChange={(e) => setTask({...task, points: parseInt(e.target.value, 10)})}
          />
        </label>

        <label className="mb-4 block">
          <span className="text-gray-700">ステータス</span>
          <select
            className="mt-1 w-full rounded border border-gray-300 p-2"
            value={task.status}
            onChange={(e) => setTask({...task, status: e.target.value as Task["status"]})} // Cast to Task['status']
          >
            <option value="ongoing">進行中</option>
            <option value="confirmation">確認中</option>
            <option value="completed">完了</option>
          </select>
        </label>

        <div className="flex justify-between">
          <button
            className="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
            type="button"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className="rounded bg-orange-300 px-4 py-2 text-white hover:bg-orange-400"
            type="submit"
          >
            タスクを更新
          </button>
        </div>
      </form>
    </div>
  );
}

const getTaskById = async (taskId: string): Promise<Task> => {
  const taskRef = doc(db, "tasks", taskId);
  const taskSnapshot = await getDoc(taskRef);

  if (taskSnapshot.exists()) {
    return {id: taskSnapshot.id, ...taskSnapshot.data()} as Task;
  } else {
    throw new Error("タスクが見つかりません");
  }
};
