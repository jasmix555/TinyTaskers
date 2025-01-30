// components/DeleteButton.tsx
import {useDeleteChild} from "@/hooks/useDeleteChild";

interface DeleteButtonProps {
  childId: string; // Pass the child ID directly to the button
  confirmMessage?: string; // Optional confirmation message
  onDeleteSuccess: () => void; // Callback to refresh data after successful deletion
}

export default function DeleteButton({
  childId,
  confirmMessage,
  onDeleteSuccess,
}: DeleteButtonProps) {
  const {deleteChild} = useDeleteChild();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      confirmMessage || "Are you sure you want to delete this child?",
    );

    if (confirmDelete) {
      try {
        await deleteChild(childId);
        console.log("Child deleted successfully:", childId);
        onDeleteSuccess(); // Trigger callback to refresh data
      } catch (error) {
        console.error("Error deleting child:", error);
        alert("Failed to delete the child. Please try again.");
      }
    }
  };

  return (
    <button
      className="mt-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      onClick={handleDelete}
    >
      削除する
    </button>
  );
}
