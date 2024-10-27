// components/DeleteButton.tsx
"use client";
import {ref, deleteObject} from "firebase/storage";
import {doc, deleteDoc, getDoc} from "firebase/firestore";

import {auth, db, storage} from "@/api/firebase";

interface DeleteButtonProps {
  childId: string; // Pass the child ID directly to the button
  confirmMessage?: string; // Optional confirmation message
  onDeleteSuccess: () => void; // Callback to refresh data
}

const DeleteButton = ({childId, confirmMessage, onDeleteSuccess}: DeleteButtonProps) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      confirmMessage || "Are you sure you want to delete this child?",
    );

    if (confirmDelete) {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) return;

        const childRef = doc(db, `users/${currentUser.uid}/children/${childId}`);
        const docSnapshot = await getDoc(childRef);

        if (!docSnapshot.exists()) {
          console.error("Document does not exist:", childRef.path);

          return;
        }

        const childData = docSnapshot.data();
        const imagePath = childData?.picture;

        if (typeof imagePath === "string" && imagePath) {
          const imageRef = ref(storage, imagePath);

          await deleteObject(imageRef);
          console.log("Image deleted from storage:", imageRef.fullPath);
        } else {
          console.warn("No valid image path found for child.");
        }

        await deleteDoc(childRef);
        console.log("Child document deleted:", childId);

        // Call the onDeleteSuccess callback to refresh data
        onDeleteSuccess();
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
      Delete
    </button>
  );
};

export default DeleteButton;
