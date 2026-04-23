import React from "react";
import Button from "../ui/Button";
import { cn } from "../../utils";
import Modal from "../ui/Modal";

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
    <Modal isOpen={isOpen} onClose={onClose} className={cn("w-full", className)}>
      <div tabIndex={-1}>
        <div className="p-6">
          <h3 className="questionnaire-heading text-[18px] font-semibold capitalize">
            {Title}
          </h3>
        </div>
        <div className="h-full max-h-[70vh] w-full px-6 pb-4 overflow-auto">
          {children}
        </div>
        <div className="flex flex-col-reverse items-center gap-3 px-6 pb-6 pt-2 sm:flex-row sm:justify-between">
          {(footerContent || ButtonText) &&(
            <div className="report-muted w-full text-left text-sm sm:w-auto">
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
    </Modal>
  );
};

export default DynamicModel;
