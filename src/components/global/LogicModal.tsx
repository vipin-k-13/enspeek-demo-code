import React from "react";
import Modal from "../ui/Modal";
import { cn } from "../../utils";
import { LuGitBranchPlus } from "react-icons/lu";

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
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
                <LuGitBranchPlus className="h-5 w-5" />
              </span>
              <h3 className="questionnaire-heading text-[28px] font-extrabold capitalize tracking-[-0.02em] leading-none">
                {Title}
              </h3>
            </div>
            {description ? (
              <p className="mt-4 text-sm leading-6 text-black">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <div className="h-[calc(100vh-300px)] w-full overflow-auto px-7 py-4">
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
