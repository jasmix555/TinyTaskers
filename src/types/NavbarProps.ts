// types/NavbarProps.ts
import {FaChildren, FaStore, FaListCheck, FaGear} from "react-icons/fa6";

export const NavbarProps = [
  {
    id: "child",
    icon: FaChildren,
    path: "/",
  },
  {
    id: "store",
    icon: FaStore,
    path: "/rewards",
  },
  {
    id: "tasks",
    icon: FaListCheck,
    path: "/task-index",
  },
  {
    id: "settings",
    icon: FaGear,
    path: "/settings",
  },
];
