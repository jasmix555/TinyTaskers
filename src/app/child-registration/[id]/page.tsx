// app/child-registration/[id]/page.tsx
"use client";

import {ChangeEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {FaCamera} from "react-icons/fa";
import {ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {onAuthStateChanged} from "firebase/auth";

import {Child} from "@/types/ChildProps";
import {auth, db, storage} from "@/api/firebase";

const ChildEditPage = () => {
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPicture, setNewPicture] = useState<File | null>(null);
  const router = useRouter();
  const childId = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : null;

  const fetchChildById = async (id: string, uid: string) => {
    const childRef = doc(db, `users/${uid}/children/${id}`);
    const childSnapshot = await getDoc(childRef);

    if (childSnapshot.exists()) {
      setChild({id: childSnapshot.id, ...childSnapshot.data()} as Child);
    } else {
      console.error("Child not found:", id);
      setError("Child not found.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && childId) {
        fetchChildById(childId, currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [childId]);

  const handleUpdate = async () => {
    if (!child) return;

    const updatedChild: Partial<Child> = {
      name: child.name,
      gender: child.gender,
      birthday: child.birthday,
      picture: child.picture,
    };

    const currentUser = auth.currentUser;

    if (!currentUser) return;

    const childRef = doc(db, `users/${currentUser.uid}/children/${child.id}`);

    // Handle picture upload if a new picture is selected
    if (newPicture) {
      const pictureRef = ref(
        storage,
        child.picture || `users/${currentUser.uid}/children/${child.id}/picture.jpg`,
      );

      // Delete old picture if it exists
      if (child.picture) {
        await deleteObject(pictureRef);
      }

      // Upload new picture
      const snapshot = await uploadBytes(pictureRef, newPicture);
      const downloadURL = await getDownloadURL(snapshot.ref);

      updatedChild.picture = downloadURL; // Update picture URL
    }

    await updateDoc(childRef, updatedChild);
    router.push("/"); // Redirect after updating
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (child) {
      setChild({
        ...child,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewPicture(e.target.files[0]);
    }
  };

  // move back to home page
  const handleBack = () => {
    router.push("/");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!child) return <p>Child data not available.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Edit Child Information</h1>

      {/* Circular Picture Section */}
      <div className="relative mb-4 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300">
          {newPicture ? (
            <img
              alt="Child"
              className="h-full w-full object-cover"
              src={URL.createObjectURL(newPicture)}
            />
          ) : (
            child.picture && (
              <img alt="Child" className="h-full w-full object-cover" src={child.picture} />
            )
          )}
          {!newPicture && !child.picture && (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <FaCamera className="h-6 w-6 text-gray-300" />
            </div>
          )}
          <button
            className="absolute inset-0 flex h-full w-full items-center justify-center"
            type="button"
            onClick={() => document.getElementById("file-input")?.click()}
          />
        </div>
        <input
          accept="image/*"
          className="hidden"
          id="file-input"
          type="file"
          onChange={handlePictureChange}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block" htmlFor="name">
          Name:
        </label>
        <input
          className="w-full rounded border border-gray-300 p-2"
          id="name"
          name="name"
          type="text"
          value={child.name}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block" htmlFor="gender">
          Gender:
        </label>
        <select
          className="w-full rounded border border-gray-300 p-2"
          id="gender"
          name="gender"
          value={child.gender}
          onChange={handleChange}
        >
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1 block" htmlFor="birthday">
          Birthday:
        </label>
        <input
          className="w-full rounded border border-gray-300 p-2"
          id="birthday"
          name="birthday"
          type="date"
          value={child.birthday}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-between">
        <button className="p-2 text-red-500" onClick={handleBack}>
          Back
        </button>

        <button className="rounded bg-blue-500 p-2 text-white" onClick={handleUpdate}>
          Update Child
        </button>
      </div>
    </div>
  );
};

export default ChildEditPage;
