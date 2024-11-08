// ChildRegistration.tsx
"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from "firebase/auth";

import {Child} from "@/types/ChildProps";
import ChildForm from "@/components/ChildComponents/ChildForm";
import ChildrenList from "@/components/ChildComponents/ChildrenList";
import {useDeleteChild, useFetchChildren, useAuth, useCreateChild} from "@/hooks";
import {auth} from "@/api/firebase";

export default function ChildRegistration() {
  const {user} = useAuth();
  const {deleteChild} = useDeleteChild();
  const router = useRouter();

  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const {children: initialRegisteredChildren, loading} = useFetchChildren(user?.uid || "");
  const [registeredChildren, setRegisteredChildren] = useState<Child[]>(initialRegisteredChildren);

  const {handleChildSubmit} = useCreateChild(currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user.uid : null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setRegisteredChildren(initialRegisteredChildren);
  }, [initialRegisteredChildren]);

  const handleSubmit = async (childData: Child) => {
    await handleChildSubmit(childData, editingChild, setRegisteredChildren);
    setEditingChild(null); // Reset editing state after submission
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteChild(id);
      setRegisteredChildren((prev) => prev.filter((child) => child.id !== id));
      setSuccessMessage("Child deleted successfully.");
      setTimeout(() => setSuccessMessage(null), 3000); // Auto-hide message
    } catch (error) {
      console.error("Error deleting child:", error);
      setError("Failed to delete the child. Please try again.");
    }
  };

  const handleFinishRegistering = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Child Registration</h1>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      {successMessage && (
        <div className="mb-4 rounded bg-green-100 p-2 text-green-800">{successMessage}</div>
      )}{" "}
      {/* Display success message */}
      <ChildForm editingChild={editingChild} onSubmit={handleSubmit} />
      <h2 className="mb-4 mt-6 text-xl font-bold">Registered Children</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ChildrenList registeredChildren={registeredChildren} onDelete={handleDelete} />
      )}
      <button
        className={`mt-4 rounded px-4 py-2 text-white ${
          registeredChildren.length > 0
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-500 hover:bg-gray-600"
        }`}
        onClick={handleFinishRegistering}
      >
        {registeredChildren.length > 0 ? "Finish Registering" : "Back to Home"}
      </button>
    </div>
  );
}
