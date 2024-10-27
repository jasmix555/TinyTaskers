import {FaChildren, FaGift, FaListCheck, FaGear} from "react-icons/fa6";

export const NavbarProps = [
  {
    id: "child",
    icon: FaChildren,
    path: "/",
  },
  {
    id: "gift",
    icon: FaGift,
    path: "/rewards",
  },
  {
    id: "list",
    icon: FaListCheck,
    path: "/tasks",
  },
  {
    id: "settings",
    icon: FaGear,
    path: "/settings",
  },
];
