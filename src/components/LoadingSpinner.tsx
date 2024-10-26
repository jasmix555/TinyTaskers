// components/LoadingSpinner.tsx
import {motion} from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <motion.div
        animate={{rotate: 360}} // Animation to rotate the spinner
        className="h-16 w-16 rounded-full border-8 border-t-8 border-blue-600 border-transparent" // Spinner styling
        transition={{repeat: Infinity, duration: 1, ease: "linear"}} // Adjusted duration for a smoother spin
      />
    </div>
  );
};

export default LoadingSpinner;
