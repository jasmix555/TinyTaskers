import {useEffect, useState} from "react";
import {collection, getDocs, query, orderBy} from "firebase/firestore";

import Loading from "../Loading";

import {db} from "@/api/firebase";

// Define the type for history entries
interface HistoryEntry {
  id: string; // Firestore document ID
  title: string;
  points: number;
  action: "add" | "subtract"; // Action indicating if points were added or subtracted
  dateCompleted: Date; // The date should be a JavaScript Date object
}

interface ChildHistoryProps {
  childId: string;
  userId: string;
}

const ChildHistory = ({childId, userId}: ChildHistoryProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]); // Use the defined type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyRef = collection(db, "users", userId, "children", childId, "history");
        const historyQuery = query(historyRef, orderBy("dateCompleted", "desc")); // Sort by date completed
        const historySnapshot = await getDocs(historyQuery);
        const historyList = historySnapshot.docs.map((doc) => {
          const data = doc.data();
          const dateCompleted =
            data.dateCompleted instanceof Date ? data.dateCompleted : data.dateCompleted.toDate();

          // Ensure the data includes title, points, action, and handle any missing fields
          return {
            id: doc.id,
            title: data.title || "不明なタスク", // Default to a fallback title
            points: data.points || 0, // Default to 0 points if missing
            action: data.action || "add", // Default action to "add"
            dateCompleted,
          };
        });

        setHistory(historyList);
      } catch (err) {
        setError("履歴の読み込みに失敗しました。");
        console.error(err); // Log the error to help with debugging
      } finally {
        setLoading(false);
      }
    };

    if (childId && userId) {
      fetchHistory();
    }
  }, [childId, userId]);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="z-0 mx-2 rounded-lg border border-gray-200 bg-white shadow-md">
      {/* 固定ヘッダー */}
      <div className="sticky top-0 rounded-t-lg border-b border-gray-200 bg-white px-4 py-2">
        <h3 className="text-xl font-semibold">直近の入出ポイント</h3>
      </div>

      {/* スクロール可能なコンテンツ */}
      <div
        className="no-scrollbar overflow-y-auto p-4"
        style={{
          maxHeight: "calc(100vh - 20rem)",
        }}
      >
        {history.length === 0 ? (
          <p>この子供の活動履歴は見つかりませんでした。</p>
        ) : (
          <ul className="space-y-2">
            {history.map((entry, index) => (
              <li
                key={entry.id}
                className={`flex w-full items-center justify-between ${
                  index !== history.length - 1 ? "border-b border-gray-200 pb-2" : ""
                }`}
              >
                <div className="flex-1">
                  <p className="text-lg font-bold">{entry.title}</p>
                  <p className="text-md text-gray-400">
                    {entry.dateCompleted.toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xl font-bold">
                  {entry.action === "add" ? "+" : "-"}
                  {entry.points}pt
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChildHistory;
