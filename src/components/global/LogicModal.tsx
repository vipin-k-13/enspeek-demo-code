import React from "react";
import Modal from "../ui/Modal";
import { cn } from "../../utils";

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
    <Modal isOpen={isOpen} onClose={onClose} className={cn("max-w-5xl", className)}>
      <div tabIndex={-1} className="w-full">
        <div className="flex items-center justify-between border-b questionnaire-border px-6 py-5">
          <div>
            <h3 className="questionnaire-heading text-[24px] font-semibold capitalize">
              {Title}
            </h3>
            <p className="questionnaire-muted mt-1 text-sm leading-6">
              Define skip, terminate, and conditional logic using the same guided flow across the platform.
            </p>
          </div>
        </div>
        <div className="max-h-[70vh] w-full overflow-auto px-6 py-5 questionnaire-page-bg">
          {children}
        </div>
        <div className="flex items-center justify-end gap-3 border-t questionnaire-border bg-white px-6 py-4 rounded-b-[24px]">
          {footerContent}
        </div>
      </div>
    </Modal>
  );
};

export default LogicModel;
