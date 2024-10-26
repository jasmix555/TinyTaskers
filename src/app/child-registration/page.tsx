"use client"; // Ensure this file is a client component

import {useEffect, useState, FormEvent, ChangeEvent} from "react";
import {collection, addDoc, getDocs} from "firebase/firestore";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {FaCamera} from "react-icons/fa";
import {useRouter} from "next/navigation";

import {auth, db} from "@/api/firebase"; // Adjust this import based on your Firebase setup

interface Child {
  id: string;
  name: string;
  gender: string;
  picture: string | null;
  birthday: string;
}

export default function ChildRegistration() {
  const [childName, setChildName] = useState("");
  const [gender, setGender] = useState("M");
  const [picture, setPicture] = useState<File | null>(null);
  const [birthday, setBirthday] = useState("");
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);
  const [registeredChildren, setRegisteredChildren] = useState<Child[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChildren = async () => {
      if (!auth.currentUser) return;

      try {
        const childrenRef = collection(db, `users/${auth.currentUser.uid}/children`);
        const childrenSnapshot = await getDocs(childrenRef);
        const childrenData: Child[] = childrenSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Child[];

        console.log("Fetched children: ", childrenData); // Debugging line
        setRegisteredChildren(childrenData);
      } catch (error) {
        console.error("Error fetching children: ", error);
      }
    };

    fetchChildren();
  }, [auth.currentUser]); // Dependency on auth.currentUser

  // Function to upload the picture to Firebase Storage
  const uploadPicture = async (file: File): Promise<string | null> => {
    if (!file) return null;

    const storage = getStorage();
    const storageRef = ref(storage, `children/${Date.now()}-${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading file: ", error);

      return null;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!childName || !birthday) {
      alert("Please fill in all fields.");

      return;
    }

    const childId = `${Date.now()}-${childName}`; // Unique ID for the child

    const childData = {
      id: childId,
      name: childName,
      gender: gender,
      picture: picture ? await uploadPicture(picture) : null,
      birthday: birthday,
      parentId: auth.currentUser?.uid, // Link to the logged-in parent
    };

    // Check if user is authenticated
    if (!auth.currentUser) {
      alert("You must be logged in to register a child.");

      return;
    }

    try {
      // Save the child data in the user's children sub-collection
      await addDoc(collection(db, `users/${auth.currentUser?.uid}/children`), childData);
      console.log("Child added: ", childData); // Debugging line

      // Update registered children state to display previews
      setRegisteredChildren((prev) => [...prev, childData]);

      // Reset form fields
      setChildName("");
      setGender("M");
      setPicture(null);
      setBirthday("");
    } catch (error) {
      console.error("Error adding child: ", error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setPicture(file);
  };

  const handleFileInputClick = () => {
    fileInputRef?.click();
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Register Your Child</h1>
      <form className="mx-auto max-w-md rounded bg-white p-4 shadow-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-1 block" htmlFor="childName">
            Name:
          </label>
          <input
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-800 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            id="childName"
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <span className="mb-1 block">Gender:</span>
          <div className="flex items-center">
            <label className="mr-4">
              <input
                checked={gender === "M"}
                className="mr-1"
                type="radio"
                value="M"
                onChange={() => setGender("M")}
              />
              Male
            </label>
            <label>
              <input
                checked={gender === "F"}
                className="mr-1"
                type="radio"
                value="F"
                onChange={() => setGender("F")}
              />
              Female
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-1 block" htmlFor="picture">
            Picture:
          </label>
          <button
            className="mt-1 flex items-center justify-center rounded border-2 border-dashed border-gray-300 p-4 transition hover:bg-gray-100"
            tabIndex={0}
            type="button"
            onClick={handleFileInputClick}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleFileInputClick();
            }}
          >
            <FaCamera className="mr-2" />
            {picture ? picture.name : "Click to upload"}
          </button>
          <input
            ref={(input) => setFileInputRef(input)}
            accept="image/*"
            className="hidden"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block" htmlFor="birthday">
            Birthday:
          </label>
          <input
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-800 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            id="birthday"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <button
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          type="submit"
        >
          Register Child
        </button>
      </form>

      {/* Button to finish registration and go back to the app */}
      {registeredChildren.length > 0 && (
        <button
          className="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          onClick={() => router.push("/")}
        >
          Finish Registering
        </button>
      )}

      <h2 className="mb-4 mt-8 text-xl font-bold">Registered Children</h2>
      {registeredChildren.length === 0 ? (
        <p>No registered children found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {registeredChildren.map((child) => (
            <div key={child.id} className="rounded border p-4 shadow">
              {child.picture && (
                <img
                  alt={`${child.name}'s profile`}
                  className="mb-2 h-24 w-24 rounded-full object-cover"
                  src={child.picture}
                />
              )}
              <p>Name: {child.name}</p>
              <p>Gender: {child.gender}</p>
              <p>Birthday: {child.birthday}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
