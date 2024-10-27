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
  onDelete: (childId: string) => void;
}
