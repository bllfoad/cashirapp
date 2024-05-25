import { useState } from "react";
import { Button } from "./button";

export const Dialog = ({ title, children, onClose, onConfirm }: { title: string, children: React.ReactNode, onClose: () => void, onConfirm: () => void }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleConfirm = () => {
    setIsOpen(false);
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-sm w-full">
        <h2 className="text-lg font-medium">{title}</h2>
        <div className="mt-4">{children}</div>
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};
