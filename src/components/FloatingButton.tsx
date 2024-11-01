// src/components/FloatingButton.tsx
import Link from "next/link";
import {FaScroll, FaPlus} from "react-icons/fa";

export default function FloatingButton() {
  return (
    <Link href="/task-register">
      <div className="fixed bottom-16 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-orange-300 text-white shadow-lg transition duration-200 ease-in-out hover:bg-orange-400">
        <div className="relative flex items-center justify-center">
          <FaScroll className="text-4xl text-white" />
          <FaPlus className="text-md absolute bottom-[13px] right-2 text-orange-300" />
        </div>
      </div>
    </Link>
  );
}
