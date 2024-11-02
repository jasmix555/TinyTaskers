// components/Navbar.tsx
import {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {motion, cubicBezier} from "framer-motion";

import {useAuth} from "@/hooks";
import {useFetchChildren} from "@/hooks/useFetchChildren";
import {NavbarProps} from "@/types/NavbarProps";

export default function Navbar() {
  const pathname = usePathname();
  const {user} = useAuth();
  const {children, loading} = useFetchChildren(user?.uid || "");
  const [isParent, setIsParent] = useState(false);

  useEffect(() => {
    setIsParent(!loading && children.length > 0);
  }, [children, loading]);

  const variant = {
    hidden: {opacity: 0, y: 20},
    visible: {
      opacity: 1,
      y: 0,
      transition: {duration: 0.3, ease: cubicBezier(0.4, 0, 0.2, 1)},
    },
  };

  if (!isParent) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-10 flex w-[90%] max-w-md -translate-x-1/2 transform items-center justify-around rounded-2xl bg-gray-100 p-4 shadow-xl">
      {NavbarProps.map((item) => {
        const IconComponent = item.icon;

        return (
          <motion.div
            key={item.id}
            animate="visible"
            className={`flex flex-col items-center transition-all duration-300 ${
              pathname === item.path ? "rounded-lg bg-black p-2 text-white" : "text-black"
            }`}
            initial="hidden"
            variants={variant}
          >
            <Link className="flex flex-col items-center" href={item.path}>
              <IconComponent className="h-6 w-6" />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
