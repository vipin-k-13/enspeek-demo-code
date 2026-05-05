import React from "react";
import Button from "../ui/Button";
import { cn } from "../../utils";
import Modal from "../ui/Modal";
import type { ButtonProps } from "../ui/Button";

interface DynamicModelProps {
  isOpen: boolean;
  onClose: () => void;
  Title: string;
  headerIcon?: React.ReactNode;
  description?: React.ReactNode;
  descriptionClassName?: string;
  ButtonText: string;
  buttonIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  disable?: boolean;
  className?: string;
  bodyClassName?: string;
  footerContent?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  secondaryActionPosition?: "before" | "after";
  buttonVariant?: ButtonProps["varinat"];
}

const DynamicModel: React.FC<DynamicModelProps> = ({
  isOpen,
  onClose,
  Title,
  headerIcon,
  description,
  descriptionClassName,
  ButtonText,
  buttonIcon,
  children,
  onClick,
  disable,
  className = "",
  bodyClassName = "questionnaire-page-bg",
  footerContent,
  secondaryAction,
  secondaryActionPosition = "before",
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
        <div className="questionnaire-border px-6 py-5">
          <div className="flex items-center gap-3">
            {headerIcon ? <div className="shrink-0">{headerIcon}</div> : null}
            <h3 className="questionnaire-heading text-[24px] font-extrabold capitalize">
              {Title}
            </h3>
          </div>
          {description ? (
            <p
              className={cn(
                "mt-3 text-sm leading-6 text-[var(--color-text-muted)]",
                descriptionClassName
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        <div className={cn("max-h-[70vh] w-full overflow-auto px-6 py-5", bodyClassName)}>
          {children}
        </div>
        <div className="flex flex-col-reverse items-center gap-3 questionnaire-border bg-white px-6 py-4 sm:flex-row sm:justify-between">
          {(footerContent || ButtonText) &&(
            <div className="report-muted w-full text-left text-sm sm:w-auto">
              {footerContent}
            </div>
          )}
          <div
            className={cn(
              "flex items-center gap-3",
              !footerContent && !ButtonText && "sm:ml-auto"
            )}
          >
            {secondaryActionPosition === "before" ? secondaryAction : null}
            {ButtonText && onClick && (
              <Button
                size="default"
                varinat={resolvedButtonVariant}
                onClick={onClick}
                data-test-id="MODEL_BUTTON"
                className="min-w-[180px]"
                disabled={disable}
              >
                {buttonIcon}
                {ButtonText}
              </Button>
            )}
            {secondaryActionPosition === "after" ? secondaryAction : null}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DynamicModel;
