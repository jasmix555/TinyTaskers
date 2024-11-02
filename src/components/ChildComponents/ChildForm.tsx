// app/components/ChildForm.tsx
import {useState, FormEvent, ChangeEvent} from "react";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {FaCamera} from "react-icons/fa";

import {Child} from "@/types/ChildProps";

interface ChildFormProps {
  onSubmit: (childData: Child) => void;
  editingChild: Child | null; // Add this line
}

const ChildForm = ({onSubmit, editingChild}: ChildFormProps) => {
  const [childName, setChildName] = useState(editingChild ? editingChild.name : ""); // Pre-fill if editing
  const [gender, setGender] = useState(editingChild ? editingChild.gender : "M"); // Pre-fill if editing
  const [picture, setPicture] = useState<File | null>(null);
  const [birthday, setBirthday] = useState(editingChild ? editingChild.birthday : ""); // Pre-fill if editing
  const [points, setPoints] = useState<number>(editingChild ? editingChild.points || 0 : 0); // Pre-fill points if editing
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
      id: editingChild ? editingChild.id : "", // Keep ID if editing
      name: childName,
      gender,
      picture: pictureUrl || (editingChild ? editingChild.picture : ""),
      birthday,
      points, // Include points in child data
    };

    onSubmit(childData);
    resetForm();
  };

  const resetForm = () => {
    setChildName("");
    setGender("M");
    setPicture(null);
    setBirthday("");
    setPoints(0); // Reset points to 0
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setPicture(file);
  };

  const handleFileInputClick = () => {
    fileInputRef?.click();
  };

  return (
    <form className="max-w-md rounded bg-white px-10 py-4 shadow-md" onSubmit={handleSubmit}>
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
            <div className="flex h-full w-full items-center justify-center bg-gray-50">
              <FaCamera className="h-6 w-6 text-gray-300" />
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
          className="mt-1 block w-full rounded-md border-2 border-gray-300 px-4 py-2 text-black placeholder-gray-300 shadow-sm"
          id="childName"
          placeholder='e.g. "John"'
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
          className="mt-1 block w-full rounded-md border-2 border-gray-300 px-4 py-2 text-black placeholder-gray-300 shadow-sm"
          id="birthday"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block" htmlFor="points">
          Points:
        </label>
        <input
          required
          className="mt-1 block w-full rounded-md border-2 border-gray-300 px-4 py-2 text-black placeholder-gray-300 shadow-sm"
          id="points"
          min="0"
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
        />
      </div>
      <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" type="submit">
        Register Child
      </button>
    </form>
  );
};

export default ChildForm;
