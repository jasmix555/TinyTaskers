// components/ChildPreview.tsx
"use client";
import Image from "next/image";

import DeleteButton from "./DeleteButton";

import {ChildPreviewProps} from "@/types/ChildProps";

const ChildPreview = ({child, onDelete, onEdit}: ChildPreviewProps) => {
  const handleEdit = () => {
    onEdit?.(child); // Call the onEdit function only if it's defined
  };

  return (
    <div className="rounded border border-gray-300 p-4">
      <div className="mb-2">
        <Image
          alt={child.name}
          className="rounded-full"
          height={100}
          src={child.picture || "/default-child.png"}
          width={100}
        />
      </div>
      <h3 className="text-lg font-semibold">{child.name}</h3>
      <p>Gender: {child.gender === "M" ? "Male" : "Female"}</p>
      <p>
        Birthday: {new Date(child.birthday).toLocaleDateString()} (
        {new Date().getFullYear() - new Date(child.birthday).getFullYear()})
      </p>
      <button
        className="mr-2 mt-2 rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
        onClick={handleEdit}
      >
        Edit
      </button>
      <DeleteButton
        childId={child.id}
        confirmMessage={`Are you sure you want to delete ${child.name}?`}
        onDeleteSuccess={() => onDelete?.(child.id)} // Call onDelete only if it's defined
      />
    </div>
  );
};

export default ChildPreview;
