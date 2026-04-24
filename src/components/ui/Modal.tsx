import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { cn } from "../../utils";

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showOverlay?: boolean;
  showCloseButton?: boolean;
}> = ({
  isOpen,
  onClose,
  children,
  className = "",
  showOverlay = true,
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {showOverlay && (
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      )}
      <div
        className={cn(
          "questionnaire-card questionnaire-border relative z-50 w-full overflow-hidden rounded-[24px] border shadow-2xl transition-all",
          className
        )}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="questionnaire-muted questionnaire-clickable absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-home-panel-soft)]"
            aria-label="Close modal"
          >
            <IoCloseSharp size={20} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
