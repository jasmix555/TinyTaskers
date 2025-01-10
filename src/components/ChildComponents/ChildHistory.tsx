import {useEffect, useState} from "react";
import {collection, getDocs, query, orderBy} from "firebase/firestore";

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
            title: data.title || "Unknown Task", // Default to a fallback title
            points: data.points || 0, // Default to 0 points if missing
            action: data.action || "add", // Default action to "add"
            dateCompleted,
          };
        });

        setHistory(historyList);
      } catch (err) {
        setError("Failed to load history.");
        console.error(err); // Log the error to help with debugging
      } finally {
        setLoading(false);
      }
    };

    if (childId && userId) {
      fetchHistory();
    }
  }, [childId, userId]);

  if (loading) return <p>Loading history...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mt-4 rounded-lg bg-white p-4 shadow-md">
      <h3 className="text-xl font-semibold">Activity History</h3>
      {history.length === 0 ? (
        <p>No activity history found for this child.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {history.map((entry, index) => (
            <li key={entry.id} className="flex w-full items-center justify-between">
              <div className="flex-1">
                <p className="text-lg font-bold">{entry.title}</p>
                <p className="text-md text-gray-400">{entry.dateCompleted.toLocaleDateString()}</p>
              </div>
              <p className="text-xl font-bold">
                {entry.action === "add" ? "+" : "-"}
                {entry.points}pt
              </p>

              {index < history.length - 1 && <div className="my-2 border-t border-gray-300" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChildHistory;
