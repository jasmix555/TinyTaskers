import Image from "next/image";

import {ChildPreviewProps} from "@/types/ChildProps";

function ChildPreview({child}: ChildPreviewProps) {
  const handleCopyId = () => {
    navigator.clipboard.writeText(child.id);
    // Optionally display a success message or update state to show the copied icon
  };

  return (
    <div className="rounded border border-gray-300 p-4">
      <div className="mb-2">
        <Image
          alt={child.name}
          className="rounded-full"
          height={100}
          src={child.picture || "/default-child.png"} // Default image if no picture
          width={100}
        />
      </div>
      <button
        className="cursor-pointer"
        tabIndex={0} // Make it focusable for keyboard navigation
        onClick={handleCopyId}
        onKeyDown={(e) => e.key === "Enter" && handleCopyId()} // Add keyboard event listener
      >
        Id: {child.id}
      </button>
      <h3 className="text-lg font-semibold">{child.name}</h3>
      <p>Gender: {child.gender === "M" ? "Male" : "Female"}</p>
      <p>Birthday: {new Date(child.birthday).toLocaleDateString()}</p>
    </div>
  );
}

export default ChildPreview;
