// components/ChildrenList.tsx
import {Child} from "@/types/ChildProps";
import ChildPreview from "@/components/ChildPreview";

interface ChildrenListProps {
  onEdit: (child: Child) => void;
  onDelete: (childId: string) => void;
  registeredChildren: Child[]; // Define this as an array
}

const ChildrenList = ({onEdit, onDelete, registeredChildren}: ChildrenListProps) => {
  return (
    <div>
      {registeredChildren.length === 0 ? (
        <p className="text-center text-gray-500">No children registered yet.</p>
      ) : (
        registeredChildren.map((child) => (
          <ChildPreview key={child.id} child={child} onDelete={onDelete} onEdit={onEdit} />
        ))
      )}
    </div>
  );
};

export default ChildrenList;
