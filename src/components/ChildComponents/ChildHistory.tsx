import {useEffect, useState} from "react";
import {collection, getDocs, query, orderBy, updateDoc, doc} from "firebase/firestore";

import Loading from "../Loading";

import {db} from "@/api/firebase";

interface HistoryEntry {
  id: string; // Firestore document ID
  title: string;
  points: number;
  action: "add" | "subtract"; // Action indicating if points were added or subtracted
  dateCompleted: Date; // The date should be a JavaScript Date object
  purchased?: boolean; // Field to indicate if the item is purchased
}

interface ChildHistoryProps {
  childId: string;
  userId: string;
}

const ChildHistory = ({childId, userId}: ChildHistoryProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]); // State to store history data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyRef = collection(db, "users", userId, "children", childId, "history");
        const historyQuery = query(historyRef, orderBy("dateCompleted", "desc"));
        const historySnapshot = await getDocs(historyQuery);

        const historyList = historySnapshot.docs.map((doc) => {
          const data = doc.data();
          const dateCompleted =
            data.dateCompleted instanceof Date ? data.dateCompleted : data.dateCompleted.toDate();

          return {
            id: doc.id,
            title: data.title || "不明なタスク", // Default title
            points: data.points || 0, // Default to 0 if points are missing
            action: data.action || "add", // Default action is "add"
            purchased: data.purchased || false, // Default purchased status to false
            dateCompleted,
          };
        });

        setHistory(historyList);
      } catch (err) {
        setError("履歴の読み込みに失敗しました。");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (childId && userId) {
      fetchHistory();
    }
  }, [childId, userId]);

  const markAsPurchased = async (entryId: string) => {
    try {
      const entryRef = doc(db, "users", userId, "children", childId, "history", entryId);

      await updateDoc(entryRef, {purchased: true});

      setHistory((prevHistory) =>
        prevHistory.map((entry) => (entry.id === entryId ? {...entry, purchased: true} : entry)),
      );
    } catch (err) {
      console.error("購入済みとしてマーク中にエラーが発生しました:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="z-0 mx-2 rounded-lg border border-gray-200 bg-white shadow-md">
      {/* Fixed Header */}
      <div className="sticky top-0 rounded-t-lg border-b border-gray-200 bg-white px-4 py-2">
        <h3 className="text-xl font-semibold">直近の入出ポイント</h3>
      </div>

      {/* Scrollable Content */}
      <div
        className="no-scrollbar overflow-y-auto"
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
                className={`relative flex w-full flex-col justify-between px-4 py-2 ${
                  index !== history.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                {/* Purchased overlay */}
                {entry.purchased && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                    <p className="text-2xl font-bold text-white">購入済み</p>
                  </div>
                )}

                <div className="flex w-full items-center justify-between gap-2">
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

                  {/* Purchase button */}
                  {entry.action === "subtract" && !entry.purchased && (
                    <button
                      className="absolute left-1/2 z-20 -translate-x-1/2 transform rounded-md bg-blue-500 px-4 py-2 text-sm text-white shadow-md hover:bg-blue-600"
                      onClick={() => markAsPurchased(entry.id)}
                    >
                      購入済みとしてマーク
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChildHistory;
