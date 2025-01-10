import {useEffect} from "react";
import {FaSackDollar, FaExclamation, FaCircleCheck} from "react-icons/fa6";

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

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="px-4 pb-6 pt-2 font-bold sm:text-xl md:text-4xl">今日のクエスト</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="relative overflow-hidden rounded-l-full rounded-r-2xl border bg-white"
            >
              <div className="flex items-center gap-4 px-4 py-2">
                <div className="h-24 w-24 rounded-full bg-gray-300" />
                <div className="flex flex-1 items-center justify-between p-4">
                  <div className="flex flex-col gap-3 text-xl sm:text-xl md:text-3xl">
                    <h3 className="font-bold">{task.title}</h3>
                    <p className="flex items-center gap-2 text-xl">
                      クエスト完了で +{task.points}
                      <FaSackDollar />
                    </p>
                  </div>
                  <div>
                    {task.status === "completed" ? (
                      <button className="mt-2 p-4 text-orange-300">
                        <FaCircleCheck className="text-5xl" />
                      </button>
                    ) : (
                      task.status !== "finished" && (
                        <button
                          className="mt-2 rounded-xl bg-orange-300 px-8 py-4 text-3xl font-bold text-white shadow-lg"
                          disabled={task.status === "confirmation"}
                          onClick={() => handleAskForConfirmation(task)}
                        >
                          {task.status === "confirmation" ? "かくにんちゅう" : "おわったよ！"}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
              {task.status === "confirmation" && (
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                  <div className="flex h-full w-full items-center justify-center bg-gray-300/50">
                    <p className="flex items-center text-3xl font-bold text-black">
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
