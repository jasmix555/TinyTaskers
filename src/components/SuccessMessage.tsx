// components/SuccessMessage.tsx
import React, {useEffect} from "react";

interface SuccessMessageProps {
  message: string | null;
  onClose?: () => void; // Optional close handler
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({message, onClose}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 3000); // Adjust duration as needed (3000ms = 3 seconds)

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [message, onClose]);

  if (!message) return null; // Don't render if there's no message

  return <div className="mb-4 rounded bg-green-100 p-2 text-green-800">{message}</div>;
};

export default SuccessMessage;
