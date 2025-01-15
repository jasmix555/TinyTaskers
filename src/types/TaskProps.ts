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
import {TbPokeball} from "react-icons/tb";

export interface Task {
  id: string;
  title: string;
  description?: string;
  points: number;
  childId: string;
  dateCreated: Date | Timestamp; // Firestore Timestamp or JS Date
  status?: "finished" | "confirmation" | "completed";
}

// TaskIcons array with JSX
export const TaskIcons = [
  {id: "gift", icon: FaGift},
  {id: "appStore", icon: FaAppStore},
  {id: "gamepad", icon: FaGamepad},
  {id: "pokeball", icon: TbPokeball},
  {id: "star", icon: FaStar},
  {id: "trophy", icon: FaTrophy},
  {id: "medal", icon: FaMedal},
  {id: "shoppingCart", icon: FaShoppingCart},
  {id: "globe", icon: FaGlobe},
  {id: "plane", icon: FaPlane},
  {id: "laptop", icon: FaLaptop},
  {id: "futbol", icon: FaFutbol},
];
