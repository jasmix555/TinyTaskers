// hooks/useCreateChild.ts
import {useState, Dispatch, SetStateAction} from "react";
import {addDoc, collection, doc, updateDoc} from "firebase/firestore";

import {Child} from "@/types/ChildProps";
import {db} from "@/api/firebase";

export function useCreateChild(currentUser: string | null) {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChildSubmit = async (
    childData: Child,
    editingChild: Child | null,
    setRegisteredChildren: Dispatch<SetStateAction<Child[]>>, // Ensure type safety here
  ) => {
    try {
      if (!currentUser) return;

      // Validation: Check for required fields
      if (!childData.name || !childData.gender || !childData.picture || !childData.birthday) {
        setError("All fields are required.");

        return;
      }

      // Reset error state if validation passes
      setError(null);

      const childToFirestore = {
        name: childData.name,
        gender: childData.gender,
        picture: childData.picture,
        birthday: childData.birthday,
      };

      if (editingChild) {
        const childRef = doc(db, `users/${currentUser}/children`, editingChild.id);

        await updateDoc(childRef, childToFirestore);

        // Update the local state for editing
        setRegisteredChildren((prev: Child[]) =>
          prev.map((child) =>
            child.id === editingChild.id ? {...child, ...childToFirestore} : child,
          ),
        );
      } else {
        const docRef = await addDoc(
          collection(db, `users/${currentUser}/children`),
          childToFirestore,
        );

        // Update the registeredChildren state with the newly created child
        setRegisteredChildren((prev: Child[]) => [...prev, {...childData, id: docRef.id}]);
      }

      setSuccessMessage(
        editingChild ? "Child updated successfully." : "Child registered successfully.",
      );
    } catch (error) {
      console.error("Error adding/updating child:", error);
      setError("Failed to save child. Please try again.");
    }
  };

  return {handleChildSubmit, error, successMessage};
}
