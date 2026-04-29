import React from "react";
import Button from "../ui/Button";
import { cn } from "../../utils";
import Modal from "../ui/Modal";
import type { ButtonProps } from "../ui/Button";

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
  buttonVariant?: ButtonProps["varinat"];
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
  buttonVariant,
}) => {
  if (!isOpen) return null;

  const resolvedButtonVariant = buttonVariant
    ? buttonVariant
    : ButtonText.toLowerCase().includes("delete")
      ? "danger"
      : /(save|update|submit)/i.test(ButtonText)
        ? "success"
        : "theme";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={cn("w-full", className)}>
      <div tabIndex={-1}>
        <div className="border-b questionnaire-border px-6 py-5">
          <h3 className="questionnaire-heading text-[24px] font-semibold capitalize">
            {Title}
          </h3>
        </div>
        <div className="max-h-[70vh] w-full overflow-auto px-6 py-5 questionnaire-page-bg">
          {children}
        </div>
        <div className="flex flex-col-reverse items-center gap-3 border-t questionnaire-border bg-white px-6 py-4 sm:flex-row sm:justify-between">
          {(footerContent || ButtonText) &&(
            <div className="report-muted w-full text-left text-sm sm:w-auto">
              {footerContent}
            </div>
          )}
          {ButtonText && onClick && (

          <Button
            size="default"
            varinat={resolvedButtonVariant}
            onClick={onClick}
            data-test-id="MODEL_BUTTON"
            className="min-w-[180px]"
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
