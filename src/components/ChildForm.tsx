// app/components/ChildForm.tsx
import {useState, FormEvent, ChangeEvent} from "react";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {FaCamera} from "react-icons/fa"; // Importing camera icon from React Icons

import {Child} from "@/types/ChildProps";

interface ChildFormProps {
  editingChild: Child | null;
  onSubmit: (childData: Child) => void;
  setEditingChild: (child: Child | null) => void;
}

const ChildForm = ({editingChild, onSubmit, setEditingChild}: ChildFormProps) => {
  const [childName, setChildName] = useState(editingChild ? editingChild.name : "");
  const [gender, setGender] = useState(editingChild ? editingChild.gender : "M");
  const [picture, setPicture] = useState<File | null>(null);
  const [birthday, setBirthday] = useState(editingChild ? editingChild.birthday : "");
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);

  const uploadPicture = async (file: File): Promise<string | null> => {
    if (!file) return null;
    const storage = getStorage();
    const storageRef = ref(storage, `children/${Date.now()}-${file.name}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!childName || !birthday) {
      alert("Please fill in all fields.");

      return;
    }

    const pictureUrl = picture ? await uploadPicture(picture) : null;
    const childData: Child = {
      id: editingChild ? editingChild.id : "", // Update the ID only if editing
      name: childName,
      gender,
      picture: pictureUrl,
      birthday,
    };

    onSubmit(childData);
    resetForm();
  };

  const resetForm = () => {
    setChildName("");
    setGender("M");
    setPicture(null);
    setBirthday("");
    setEditingChild(null); // Reset editing state
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setPicture(file);
  };

  const handleFileInputClick = () => {
    fileInputRef?.click();
  };

  return (
    <form className="mx-auto max-w-md rounded bg-white p-4 shadow-md" onSubmit={handleSubmit}>
      {/* Circular Picture Section */}
      <div className="relative mb-4 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300">
          {picture ? (
            <img
              alt="Child"
              className="h-full w-full object-cover"
              src={URL.createObjectURL(picture)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <FaCamera className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <button
            className="absolute inset-0 flex h-full w-full items-center justify-center"
            type="button"
            onClick={handleFileInputClick}
          />
        </div>
        <input
          ref={setFileInputRef}
          accept="image/*"
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />
      </div>
      {/* Form Fields */}
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
      <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" type="submit">
        {editingChild ? "Update Child" : "Register Child"}
      </button>
    </form>
  );
};

export default ChildForm;
