import {useEffect} from "react";
import {FaSackDollar, FaExclamation, FaCircleCheck} from "react-icons/fa6";
import Image from "next/image";

import {useFetchTasks, useTaskManagement} from "@/hooks";
import {Task} from "@/types/TaskProps";

interface ChildTasksProps {
  childId: string;
}

export default function ChildTasks({childId}: ChildTasksProps) {
  const {tasks, loading, error, refetch} = useFetchTasks(childId);
  const {confirmCompletion} = useTaskManagement();

  useEffect(() => {
    if (childId) refetch();
  }, [childId, refetch]);

  const handleAskForConfirmation = async (task: Task) => {
    await confirmCompletion(task.id); // Change task status to "confirmation"
    refetch(); // Update tasks after confirmation
  };

  if (loading) return <p className="p-4">クエストロード中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-full p-4">
      <h2 className="px-4 pb-6 pt-2 text-2xl font-bold sm:text-2xl md:text-4xl">今日のクエスト</h2>
      {tasks.length === 0 ? (
        <p>今日タスクありません。</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="relative overflow-hidden rounded-full border bg-white">
              <div className="flex items-center gap-4 px-4">
                <div className="h-14 w-14 rounded-full md:h-28 md:w-28">
                  <Image
                    alt="cheer"
                    className="rounded-full"
                    height={120}
                    src={"/cheer.svg"}
                    width={120}
                  />
                </div>
                <div className="flex w-full flex-1 items-center justify-between py-2">
                  <div className="flex flex-col gap-3 text-lg sm:text-lg md:text-3xl">
                    <h3 className="max-w-48 truncate font-bold md:max-w-96">{task.title}</h3>
                    <p className="flex items-center text-xs md:gap-2 md:text-xl">
                      クエスト完了すると +<FaSackDollar />
                      {task.points}
                    </p>
                  </div>
                  {task.status === "completed" ? (
                    <button className="p-4 text-orange-300">
                      <FaCircleCheck className="text-5xl" />
                    </button>
                  ) : (
                    task.status !== "finished" && (
                      <button
                        className="text-md text-nowrap rounded-full bg-orange-300 px-4 py-2 font-bold text-white shadow-lg md:px-8 md:py-4 md:text-3xl"
                        disabled={task.status === "confirmation"}
                        onClick={() => handleAskForConfirmation(task)}
                      >
                        {task.status === "confirmation" ? "かくにんちゅう" : "おわったよ！"}
                      </button>
                    )
                  )}
                </div>
              </div>
              {task.status === "confirmation" && (
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                  <div className="flex h-full w-full items-center justify-center bg-gray-300/50">
                    <p className="flex items-center text-lg font-bold text-black md:text-3xl">
                      <Image
                        alt="confirming"
                        className="h-20 w-20 rounded-full md:h-28 md:w-28"
                        height={80}
                        src={"/confirming.svg"}
                        width={80}
                      />
                      かくにんちゅうだよ
                      <FaExclamation />
                    </p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
