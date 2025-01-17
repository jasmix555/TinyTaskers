// types/TaskProps.tsx
import {Timestamp} from "firebase/firestore";
import {
  FaGift,
  FaAppStore,
  FaGamepad,
  FaStar,
  FaTrophy,
  FaMedal,
  FaShoppingCart,
  FaGlobe,
  FaPlane,
  FaLaptop,
  FaFutbol,
  FaMusic,
  FaTree,
  FaPaintBrush,
  FaFlask,
  FaAppleAlt,
  FaBook,
  FaCamera,
  FaRobot,
} from "react-icons/fa";
import {LuToyBrick} from "react-icons/lu";
import {GiPopcorn, GiChocolateBar} from "react-icons/gi";
export interface Reward {
  id: string;
  title: string;
  pointsRequired: number;
  dateAdded: Date;
  icon: string;
  availableFor: string[];
  isPurchased?: boolean;
  inventory: number;
}

export interface NewReward {
  id: string;
  title: string;
  pointsRequired: number;
  icon: string;
  availableFor: string[];
  inventory: number; // Add inventory field
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  points: number;
  childId: string;
  dateCreated: Date | Timestamp;
  status?: "finished" | "confirmation" | "completed";
}

export const TaskIcons = [
  {id: "gift", icon: FaGift},
  {id: "appStore", icon: FaAppStore},
  {id: "gamepad", icon: FaGamepad},
  {id: "star", icon: FaStar},
  {id: "trophy", icon: FaTrophy},
  {id: "medal", icon: FaMedal},
  {id: "shoppingCart", icon: FaShoppingCart},
  {id: "snacks", icon: GiChocolateBar},
  {id: "popcorn", icon: GiPopcorn},
  {id: "lego", icon: LuToyBrick},
  {id: "globe", icon: FaGlobe},
  {id: "plane", icon: FaPlane},
  {id: "laptop", icon: FaLaptop},
  {id: "sports", icon: FaFutbol},
  {id: "music", icon: FaMusic},
  {id: "nature", icon: FaTree},
  {id: "creativity", icon: FaPaintBrush},
  {id: "science", icon: FaFlask},
  {id: "health", icon: FaAppleAlt},
  {id: "books", icon: FaBook},
  {id: "travel", icon: FaPlane},
  {id: "animals", icon: FaCamera},
  {id: "toy", icon: FaRobot},
];
