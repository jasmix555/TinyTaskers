import {MouseEvent, KeyboardEvent} from "react";
import Image from "next/image";
import {motion, AnimatePresence} from "framer-motion";

import {Child} from "@/types/ChildProps";

interface ChildListPopupProps {
  childrenList: Child[];
  selectedChildId: string;
  onSelect: (child: Child) => void;
  onClose: () => void;
  onRegister: () => void;
}

const ChildListPopup = ({
  childrenList,
  selectedChildId,
  onSelect,
  onClose,
  onRegister,
}: ChildListPopupProps) => {
  const handleBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBackgroundKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleChildSelect = (child: Child) => {
    onSelect(child);
  };

  return (
    <AnimatePresence>
      <motion.div
        animate={{opacity: 1}}
        aria-modal="true"
        className="fixed inset-0 z-10 mb-24 flex items-end justify-center bg-gray-900 bg-opacity-50"
        exit={{opacity: 0}}
        initial={{opacity: 0}}
        role="dialog"
        tabIndex={-1}
        onClick={handleBackgroundClick}
        onKeyDown={handleBackgroundKeyDown}
      >
        <motion.div
          animate={{y: 0}}
          className="w-full max-w-md rounded-t-lg bg-white p-4 shadow-lg"
          exit={{y: "100%"}}
          initial={{y: "100%"}}
          role="document"
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-2 text-xl font-bold">子供一覧</h2>
          <ul aria-label="Children list" className="flex flex-col gap-1" role="listbox">
            {childrenList.map((child) => (
              <motion.li
                key={child.id}
                animate={{opacity: 1, y: 0}}
                aria-selected={child.id === selectedChildId}
                className="mb-2"
                initial={{opacity: 0, y: 20}}
                role="option"
                transition={{delay: 0.1}}
              >
                <button
                  aria-pressed={child.id === selectedChildId}
                  className={`flex w-full items-center justify-between rounded-xl border-2 border-gray-200 px-4 py-2 ${
                    child.id === selectedChildId ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleChildSelect(child)}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-14 w-14 overflow-hidden rounded-full">
                      <Image
                        priority
                        alt={child.name}
                        className="rounded-full"
                        height={200}
                        src={child.picture || "/default-child.png"}
                        width={200}
                      />
                    </div>
                    <div>
                      <span className="font-semibold">{child.name}</span>
                      {child.id === selectedChildId && (
                        <span className="ml-2 text-sm text-blue-500">Currently Selected</span>
                      )}
                    </div>
                  </div>
                  <span>{child.points}pt</span>
                </button>
              </motion.li>
            ))}
          </ul>
          <motion.button
            animate={{opacity: 1}}
            className="mt-4 w-full rounded bg-orange-300 p-2 text-white"
            initial={{opacity: 0}}
            transition={{delay: 0.1}}
            onClick={onRegister}
          >
            + 子供を追加
          </motion.button>
          <motion.button
            animate={{opacity: 1}}
            className="mt-2 w-full rounded bg-gray-500 p-2 text-white"
            initial={{opacity: 0}}
            transition={{delay: 0.2}}
            onClick={onClose}
          >
            閉じる
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChildListPopup;
