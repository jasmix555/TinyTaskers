import {useState} from "react";
import {deleteObject, ref} from "firebase/storage";
import {deleteDoc, doc, getDoc} from "firebase/firestore";

import {storage, db, auth} from "@/api/firebase";

export function useDeleteChild() {
  const [error, setError] = useState<string | null>(null);

  const deleteChild = async (childId: string) => {
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    try {
      const childRef = doc(db, `users/${currentUser.uid}/children/${childId}`);
      const docSnapshot = await getDoc(childRef);
      const childData = docSnapshot.data();

      if (childData?.picture) {
        await deleteObject(ref(storage, childData.picture));
      }
      await deleteDoc(childRef);
      setError(null); // Clear error on successful deletion
    } catch (error) {
      setError("Failed to delete child. Please try again.");
      throw error; // Throw to allow further handling in HomePage if desired
    }
  };

  return {deleteChild, error};
}
