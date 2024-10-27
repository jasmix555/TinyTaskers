// components/ChildrenList.tsx
import {Child} from "@/types/ChildProps";
import ChildPreview from "@/components/ChildPreview";

interface ChildrenListProps {
  onDelete: (childId: string) => void;
  registeredChildren: Child[]; // Define this as an array
}

const ChildrenList = ({onDelete, registeredChildren}: ChildrenListProps) => {
  return (
    // Add a grid class to the parent div
    <div className="flex flex-col gap-4">
      {registeredChildren.length === 0 ? (
        <p className="text-center text-gray-500">No children registered yet.</p>
      ) : (
        registeredChildren.map((child) => (
          <ChildPreview key={child.id} child={child} onDelete={onDelete} />
        ))
      )}
    </div>
  );
};

export default ChildrenList;
