"use client";
import {useEffect, useState} from "react";
import {collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc} from "firebase/firestore";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from "firebase/auth";
import {ref, deleteObject} from "firebase/storage";

import {Child} from "@/types/ChildProps";
import ChildForm from "@/components/ChildForm";
import ChildPreview from "@/components/ChildPreview";
import {auth, db, storage} from "@/api/firebase";

const ChildRegistration = () => {
  const [registeredChildren, setRegisteredChildren] = useState<Child[]>([]);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchChildren(currentUser.uid);
      } else {
        setRegisteredChildren([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchChildren = async (uid: string) => {
    setLoading(true);
    const childrenRef = collection(db, `users/${uid}/children`);
    const childrenSnapshot = await getDocs(childrenRef);
    const childrenData: Child[] = childrenSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Child[];

    setRegisteredChildren(childrenData);
    setLoading(false);
  };

  const handleChildSubmit = async (childData: Child) => {
    try {
      const currentUser = auth.currentUser;

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
        const childRef = doc(db, `users/${currentUser.uid}/children`, editingChild.id);

        await updateDoc(childRef, childToFirestore);
        setRegisteredChildren((prev) =>
          prev.map((child) => (child.id === childData.id ? childData : child)),
        );
      } else {
        const docRef = await addDoc(
          collection(db, `users/${currentUser.uid}/children`),
          childToFirestore,
        );

        setRegisteredChildren((prev) => [...prev, {...childData, id: docRef.id}]);
      }
    } catch (error) {
      console.error("Error adding/updating child:", error);
    }
  };

  const handleEdit = (child: Child) => {
    setEditingChild(child);
  };

  const handleDelete = async (id: string) => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      const childRef = doc(db, `users/${currentUser.uid}/children/${id}`);
      const docSnapshot = await getDoc(childRef);

      if (!docSnapshot.exists()) {
        console.error("Document does not exist:", childRef.path);

        return;
      }

      const childData = docSnapshot.data() as Child;
      const imagePath = childData.picture;

      if (typeof imagePath === "string" && imagePath) {
        const imageRef = ref(storage, imagePath);

        await deleteObject(imageRef);
        console.log("Image deleted from storage:", imageRef.fullPath);
      } else {
        console.warn("No valid image path found for child:", childData.name);
      }

      await deleteDoc(childRef);
      setRegisteredChildren((prev) => prev.filter((child) => child.id !== id));
    } catch (error) {
      const e = error as Error;

      console.error("Error deleting child:", e.message);
    }
  };

  const handleFinishRegistering = () => {
    router.push("/");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Child Registration</h1>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      <ChildForm onSubmit={handleChildSubmit} />
      <h2 className="mb-4 mt-6 text-xl font-bold">Registered Children</h2>
      {loading ? (
        <p>Loading...</p>
      ) : registeredChildren.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {registeredChildren.map((child) => (
            <ChildPreview
              key={child.id}
              child={child}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <p>No children registered yet.</p>
      )}
      {registeredChildren.length > 0 ? (
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleFinishRegistering}
        >
          Finish Registering
        </button>
      ) : (
        <button
          className="mt-4 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          onClick={handleFinishRegistering}
        >
          Back to Home
        </button>
      )}
    </div>
  );
};

export default ChildRegistration;
