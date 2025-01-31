import {useState, useEffect} from "react";
import {doc, getDoc, updateDoc, collection, addDoc, Timestamp} from "firebase/firestore";
import Image from "next/image";
import {FaPlus} from "react-icons/fa";

import Loading from "../Loading";

import TaskEditForm from "./TaskEditForm";
import TaskRegisterModal from "./TaskRegisterModal";

import {db} from "@/api/firebase";
import {useFetchTasks, useFetchChildren, useAuth, useDeleteTask, useUpdateTask} from "@/hooks";
import {Task} from "@/types/TaskProps";

export default function TaskList() {
  const {user} = useAuth();
  const {
    children,
    loading: childrenLoading,
    error: childrenError,
  } = useFetchChildren(user ? user.uid : "");
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState("日付"); // デフォルトは日付順
  const [sortOrder, setSortOrder] = useState("desc"); // デフォルトは昇順
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (children.length > 0) {
      setSelectedChildId(children[0].id); // 最初の子をデフォルトで選択
    }
  }, [children]);

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useFetchTasks(selectedChildId || "");

  const {deleteTask} = useDeleteTask();
  const {updateTask} = useUpdateTask();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleEditClick = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const handleDeleteClick = async (taskId: string) => {
    const confirmed = window.confirm("このタスクを削除してもよろしいですか？");

    if (confirmed) {
      try {
        await deleteTask(taskId);
        refetchTasks();
      } catch (error) {
        console.error("タスク削除エラー:", error);
      }
    }
  };

  const handleCloseEdit = () => {
    setEditingTaskId(null);
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!user) {
      console.error("ユーザーが認証されていません。");

      return;
    }

    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId);

      if (taskToUpdate) {
        const childId = taskToUpdate.childId;
        const pointsToAdd = taskToUpdate.points;

        await updateTask(taskId, {status: "completed"});

        const childRef = doc(db, "users", user.uid, "children", childId);
        const childSnapshot = await getDoc(childRef);

        if (childSnapshot.exists()) {
          const currentPoints = childSnapshot.data().points || 0;
          const newPoints = currentPoints + pointsToAdd;

          await updateDoc(childRef, {points: newPoints});

          const historyRef = collection(db, "users", user.uid, "children", childId, "history");

          await addDoc(historyRef, {
            title: taskToUpdate.title,
            points: pointsToAdd,
            dateCompleted: new Date(),
          });
        }

        refetchTasks();
      }
    } catch (error) {
      console.error("タスク完了エラー:", error);
    }
  };

  const handleTaskAdded = () => {
    refetchTasks();
    setIsRegisterModalOpen(false);
  };

  const getChildName = (childId: string) => {
    const child = children.find((child) => child.id === childId);

    return child ? child.name : "不明な子供";
  };

  const getChildPicture = (childId: string) => {
    const child = children.find((child) => child.id === childId);

    return child ? child.picture : "/default-child.png";
  };

  const handleSortOptionChange = (option: string) => {
    if (sortOption === option) {
      // 同じオプションが選択された場合、並び順を切り替える
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // 別のオプションが選ばれた場合、昇順に切り替える
      setSortOption(option);
      setSortOrder("asc");
    }
  };

  const sortTasks = (tasks: Task[]) => {
    switch (sortOption) {
      case "日付":
        return [...tasks].sort((a, b) => {
          const dateA = a.dateCreated instanceof Timestamp ? a.dateCreated.toDate() : a.dateCreated;
          const dateB = b.dateCreated instanceof Timestamp ? b.dateCreated.toDate() : b.dateCreated;

          return sortOrder === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        });
      case "ポイント":
        return [...tasks].sort((a, b) =>
          sortOrder === "asc" ? a.points - b.points : b.points - a.points,
        );
      case "ステータス":
        return [...tasks].sort((a, b) => {
          const statusA = a.status || "";
          const statusB = b.status || "";

          return sortOrder === "asc"
            ? statusA.localeCompare(statusB)
            : statusB.localeCompare(statusA);
        });
      default:
        return tasks;
    }
  };

  const getJapaneseStatus = (status: string | undefined) => {
    switch (status) {
      case "finished":
        return "完了済み";
      case "confirmation":
        return "確認中";
      case "completed":
        return "完了";
      default:
        return "未定義";
    }
  };

  const sortedTasks = sortTasks(tasks);

  if (tasksLoading || childrenLoading) return <Loading />;
  if (tasksError) return <p>{tasksError}</p>;
  if (childrenError) return <p>{childrenError}</p>;

  return (
    <div className="mx-auto mb-44 max-w-md p-4">
      <div className="relative" style={{minHeight: "7rem"}}>
        <div className="fixed left-0 right-0 top-0 z-10 flex w-full flex-col gap-1 bg-white p-4 shadow-sm">
          <h2 className="text-center text-2xl font-bold text-gray-800">タスクリスト</h2>

          <div className="relative">
            <button
              className="mt-1 block w-full rounded border border-gray-200 bg-white px-3 py-2 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              タスクの並べ替え: {sortOption} {sortOrder === "asc" ? "↑" : "↓"}
            </button>

            {isDropdownOpen && (
              <div
                className="absolute left-0 z-10 mt-2 w-full rounded border-2 border-gray-200 bg-white shadow-lg"
                role="listbox"
              >
                <div className="px-4 py-2">
                  <button
                    aria-selected={sortOption === "日付"}
                    className="flex w-full cursor-pointer items-center justify-between border-b border-gray-200 p-2 text-left hover:bg-blue-600"
                    role="option"
                    onClick={() => handleSortOptionChange("日付")}
                  >
                    <span>日付</span>
                    {sortOption === "日付" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    aria-selected={sortOption === "ポイント"}
                    className="flex w-full cursor-pointer items-center justify-between border-b border-gray-200 p-2 text-left hover:bg-blue-600"
                    role="option"
                    onClick={() => handleSortOptionChange("ポイント")}
                  >
                    <span>ポイント</span>
                    {sortOption === "ポイント" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    aria-selected={sortOption === "ステータス"}
                    className="flex w-full cursor-pointer items-center justify-between p-2 text-left hover:bg-orange-100"
                    role="option"
                    onClick={() => handleSortOptionChange("ステータス")}
                  >
                    <span>ステータス</span>

                    {sortOption === "ステータス" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {sortedTasks.length === 0 ? (
        <p>タスクはありません。</p>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task: Task) => (
            <div
              key={task.id}
              className="flex flex-col gap-2 rounded-lg border-l border-r border-t border-gray-200 bg-white p-4 shadow-md"
            >
              <h3 className="text-2xl font-semibold">{task.title}</h3>
              <p className="text-lg">{task.description || "説明はありません"}</p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    priority
                    alt={getChildName(task.childId)}
                    className="rounded-full"
                    height={60}
                    src={getChildPicture(task.childId)}
                    width={60}
                  />
                </div>
                <p className="text-2xl">{getChildName(task.childId)}</p>
              </div>
              <p>
                <strong>ポイント:</strong> {task.points}
              </p>
              <p>
                <strong>ステータス:</strong> {getJapaneseStatus(task.status)}
              </p>
              <p>
                <strong>作成日:</strong>{" "}
                {(task.dateCreated instanceof Timestamp
                  ? task.dateCreated.toDate()
                  : task.dateCreated
                ).toLocaleDateString()}
              </p>
              <div className="flex justify-between">
                {task.status === "confirmation" && (
                  <button
                    className="rounded bg-green-500 p-2 text-white"
                    onClick={() => handleCompleteTask(task.id)}
                  >
                    タスク完了
                  </button>
                )}
                <button
                  className="rounded bg-yellow-500 p-2 text-white"
                  onClick={() => handleEditClick(task.id)}
                >
                  タスク編集
                </button>
                <button
                  className="rounded bg-red-500 p-2 text-white"
                  onClick={() => handleDeleteClick(task.id)}
                >
                  タスク削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTaskId && (
        <TaskEditForm
          taskId={editingTaskId}
          updateTaskList={refetchTasks}
          onClose={handleCloseEdit}
        />
      )}

      {/* タスク追加ボタン */}
      <div className="fixed bottom-32 right-6">
        <button
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition duration-200 hover:bg-blue-600"
          onClick={() => setIsRegisterModalOpen(true)}
        >
          <FaPlus className="text-2xl" />
        </button>
      </div>

      {/* タスク登録モーダル */}
      <TaskRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onTaskAdded={handleTaskAdded}
      />
    </div>
  );
}
