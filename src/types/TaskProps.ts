// types/TaskProps.tsx
import {Timestamp} from "firebase/firestore";
import {
  FaGift,
  FaGamepad,
  FaStar,
  FaAppStore,
  FaTrophy,
  FaMedal,
  FaShoppingCart,
  FaGlobe,
  FaPlane,
  FaLaptop,
  FaFutbol,
} from "react-icons/fa";
import {MdOutlineSmartToy} from "react-icons/md";

export interface Reward {
  id: string;
  title: string;
  pointsRequired: number;
  dateAdded: Date;
  icon: string;
  availableFor: string[];
}

export interface NewReward {
  id: string;
  title: string;
  pointsRequired: number;
  icon: string;
  availableFor: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  points: number;
  childId: string;
  dateCreated: Date | Timestamp; // JS Date or Firestore Timestamp
  status?: "finished" | "confirmation" | "completed";
}

export const TaskIcons = [
  {id: "gift", icon: FaGift},
  {id: "appStore", icon: FaAppStore},
  {id: "gamepad", icon: FaGamepad},
  {id: "pokeball", icon: MdOutlineSmartToy},
  {id: "star", icon: FaStar},
  {id: "trophy", icon: FaTrophy},
  {id: "medal", icon: FaMedal},
  {id: "shoppingCart", icon: FaShoppingCart},
  {id: "globe", icon: FaGlobe},
  {id: "plane", icon: FaPlane},
  {id: "laptop", icon: FaLaptop},
  {id: "futbol", icon: FaFutbol},
];
