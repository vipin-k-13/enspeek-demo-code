import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import Button from "../ui/Button";
import { cn } from "../../utils";

interface DynamicModelProps {
  isOpen: boolean;
  onClose: () => void;
  Title: string;
  ButtonText: string;
  children: React.ReactNode;
  onClick: () => void;
  disable?: boolean;
  className?: string;
  footerContent?: React.ReactNode;
}

const DynamicModel: React.FC<DynamicModelProps> = ({
  isOpen,
  onClose,
  Title,
  ButtonText,
  children,
  onClick,
  disable,
  className = "",
  footerContent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99]">
      <div tabIndex={-1} className={`questionnaire-card w-full rounded-[24px] border questionnaire-border shadow-2xl ${className}`}>
        <div className="p-6 flex items-center justify-between">
          <h3 className="questionnaire-heading text-[18px] font-semibold capitalize">{Title}</h3>
          <IoCloseSharp onClick={onClose} size={24} className="questionnaire-muted cursor-pointer" />
        </div>
        <div className="h-full max-h-[70vh] w-full px-6 pb-4 overflow-auto">
          {children}
        </div>
        <div className="flex flex-col-reverse items-center gap-3 px-6 pb-6 pt-2 sm:flex-row sm:justify-between">
          {(footerContent || ButtonText) &&(
            <div className="text-sm text-left text-gray-600 w-full sm:w-auto">
              {footerContent}
            </div>
          )}
          {ButtonText && onClick && (

          <Button
            size={"sm"}
            onClick={onClick}
            data-test-id="MODEL_BUTTON"
            className={cn(
              "min-w-[180px] rounded-[18px] px-6 text-white",
              ButtonText.toLowerCase().includes("delete")
                ? "questionnaire-delete-btn"
                : "bg-login-primary hover:bg-login-primary-hover"
            )}
            disabled={disable}
          >
            {ButtonText}
          </Button>
          )}
        </div>

      </div>
    </div>
  );
};

export default DynamicModel;
