// ChildrenList.tsx
import {Child} from "@/types/ChildProps";
import ChildPreview from "@/components/ChildPreview";

interface ChildrenListProps {
  onEdit: (child: Child) => void;
  onDelete: (childId: string) => void;
  children: Child[]; // Keep this for type definition
}

const ChildrenList = ({onEdit, onDelete, children}: ChildrenListProps) => {
  return (
    <div>
      {children.map((child) => (
        <ChildPreview key={child.id} child={child} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default ChildrenList;
