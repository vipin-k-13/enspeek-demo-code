import React from "react";
import Modal from "../ui/Modal";
import { cn } from "../../utils";

interface LogicModelProps {
  isOpen: boolean;
  onClose: () => void;
  Title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  disable?: boolean;
  className?: string;
  footerContent?: React.ReactNode;
}

const LogicModel: React.FC<LogicModelProps> = ({
  isOpen,
  onClose,
  Title,
  description,
  children,
  className = "",
  footerContent,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={cn("max-w-5xl", className)}>
      <div tabIndex={-1} className="w-full">
        <div className="flex items-center justify-between border-b questionnaire-border px-7 py-5">
          <div>
            <h3 className="questionnaire-heading text-[28px] font-semibold capitalize tracking-[-0.02em] leading-none">
              {Title}
            </h3>
            {description ? (
              <p className="home-muted mt-3 text-sm leading-6">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <div className="max-h-[72vh] w-full overflow-auto px-7 py-4 questionnaire-page-bg">
          {children}
        </div>
        <div className="flex items-center justify-end gap-3 border-t questionnaire-border bg-white px-7 py-4 rounded-b-[24px]">
          {footerContent}
        </div>
      </div>
    </Modal>
  );
};

export default LogicModel;
