import React from "react";
import { IoCloseSharp } from "react-icons/io5";

interface LogicModelProps {
  isOpen: boolean;
  onClose: () => void;
  Title: string;
  children: React.ReactNode;
  disable?: boolean;
  className?: string;
  footerContent?: React.ReactNode;
}

const LogicModel: React.FC<LogicModelProps> = ({
  isOpen,
  onClose,
  Title,
  children,
  className = "",
  footerContent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99]">
      <div tabIndex={-1} className={`bg-white rounded-md w-full border border-gray-100 ${className}`}>
        <div className="p-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold capitalize">{Title}</h3>
          <IoCloseSharp onClick={onClose} size={24} className="cursor-pointer" />
        </div>
        <div className="border-t border-b border-gray-200 h-full max-h-[70vh] w-full p-4 overflow-auto">
          {children}
        </div>
        <div className="flex justify-end items-center gap-2 p-2 bg-gray-100 rounded-b-md">
          {footerContent}
        </div>
      </div>
    </div>
  );
};

export default LogicModel;
