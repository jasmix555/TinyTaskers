// types/ChildProps.ts

export interface Child {
  id: string;
  name: string;
  gender: string;
  picture: string | null;
  birthday: string;
}

export interface ChildPreviewProps {
  child: Child;
}
