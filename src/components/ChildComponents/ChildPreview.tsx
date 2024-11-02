// components/ChildPreview.tsx
import Image from "next/image";
import {useRouter} from "next/navigation";
import {FaClipboard} from "react-icons/fa";

import DeleteButton from "../DeleteButton";

import {ChildPreviewProps} from "@/types/ChildProps";

const ChildPreview = ({child, onDelete}: ChildPreviewProps) => {
  const router = useRouter();

  const handleEdit = () => {
    // Navigate to the edit page for the selected child using its ID
    router.push(`/child-registration/${child.id}`);
  };

  // When clicking the button, save the child's ID to the clipboard
  const clickToSave = () => {
    navigator.clipboard.writeText(child.id);
    alert("Copied to clipboard");
  };

  return (
    <div className="rounded border border-gray-300 p-4">
      <div className="flex gap-4">
        <div className="mb-4 h-28 w-28 overflow-hidden rounded-full">
          <Image
            priority
            alt={child.name}
            className="rounded-full"
            height={200}
            src={child.picture || "/default-child.png"}
            width={200}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{child.name}</h3>
          <p>Gender: {child.gender === "M" ? "Male" : "Female"}</p>
          <p>Age: {new Date().getFullYear() - new Date(child.birthday).getFullYear()}</p>
          <button
            className="flex items-center gap-2 rounded bg-green-500 px-2 py-1 text-sm text-white hover:bg-green-600"
            onClick={clickToSave}
          >
            <FaClipboard />
            Copy ID
          </button>
        </div>
      </div>
      <div>
        <button
          className="mr-2 mt-2 rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
          onClick={handleEdit}
        >
          Edit
        </button>
        <DeleteButton
          childId={child.id}
          confirmMessage={`Are you sure you want to delete ${child.name}?`}
          onDeleteSuccess={() => onDelete?.(child.id)}
        />
      </div>
    </div>
  );
};

export default ChildPreview;
