// types/ChildProps.ts
export interface Child {
  id: string;
  name: string;
  gender: string;
  picture: string;
  birthday: string;
}

// types/ChildProps.ts
export interface ChildPreviewProps {
  child: Child;
  onEdit: (child: Child) => void;
  onDelete: (childId: string) => void;
}
