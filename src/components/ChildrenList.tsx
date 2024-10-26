// components/ChildrenList.tsx
import {Child} from "@/types/ChildProps";
import ChildPreview from "@/components/ChildPreview"; // Ensure to import the ChildPreview component

interface ChildrenListProps {
  children: Child[];
}

const ChildrenList = ({children}: ChildrenListProps) => {
  return (
    <>
      {children.map((child) => (
        <ChildPreview key={child.id} child={child} />
      ))}
    </>
  );
};

export default ChildrenList;
