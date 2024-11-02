// components/ChildrenList.tsx
import {useEffect, useState} from "react";

import {Child} from "@/types/ChildProps";
import ChildPreview from "@/components/ChildPreview";

interface ChildrenListProps {
  registeredChildren: Child[];
  onDelete: (childId: string) => void; // Triggered to update list after deletion
}

const ChildrenList = ({registeredChildren, onDelete}: ChildrenListProps) => {
  const [children, setChildren] = useState<Child[]>(registeredChildren);

  // Update children list when registeredChildren changes
  useEffect(() => {
    setChildren(registeredChildren);
  }, [registeredChildren]);

  return (
    <div className="flex flex-col gap-4">
      {children.length === 0 ? (
        <p className="text-center text-gray-500">No children registered yet.</p>
      ) : (
        children.map((child) => (
          <ChildPreview key={child.id} child={child} onDelete={() => onDelete(child.id)} />
        ))
      )}
    </div>
  );
};

export default ChildrenList;
