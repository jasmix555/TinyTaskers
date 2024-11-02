// types/ChildProps.ts
export interface Child {
  id: string;
  name: string;
  gender: string;
  picture: string;
  birthday: string;
  points?: number;
}

// types/ChildProps.ts
export interface ChildPreviewProps {
  child: Child;
  onDelete: (childId: string) => void;
}
