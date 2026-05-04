import React from "react";
import { toast } from "sonner";
import { handleKeyPress } from "../../utils";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { LuInfo, LuTrash2 } from "react-icons/lu";

interface DeleteModelProps {
  onClick: () => void;
  isOpen: boolean;
  onClose: () => void;
  qID?: string;
  label: string;
  isPending?: boolean;
}

const DeleteModel: React.FC<DeleteModelProps> = ({
  onClick,
  isOpen,
  onClose,
  qID,
  label,
  isPending = false,
}) => {
  const [inputValue, setInputValue] = React.useState<string>("");
  const displayLabel =
    label?.replace(/^[A-Za-z0-9_-]+\s*:\s*/, "").trim() || label;

  React.useEffect(() => {
    if (isOpen) {
      setInputValue("");
    }
  }, [isOpen, qID, label]);

  const handleClick = () => {
    if (inputValue?.trim()?.toLowerCase() === "delete") {
      onClick();
    } else {
      return toast.warning(`Please type "delete" to confirm`);
    }
  };
  const isDeleteConfirmed = inputValue?.trim()?.toLowerCase() === "delete";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-questionnaire-stop-bg)] text-[var(--color-questionnaire-stop)]">
            <LuTrash2 className="h-5 w-5" />
          </span>
          <h3 className="questionnaire-heading text-[24px] font-extrabold">Delete Question</h3>
        </div>
        <p className="mt-4 text-[15px] leading-6 text-black">
          Are you sure you want to delete
          <span className="font-semibold text-[var(--color-questionnaire-stop)]">{` ${qID ? `${qID}: ` : ""}${displayLabel || "this question"}`}</span>
          ? This action cannot be undone.
        </p>
        <div className="mt-4 flex items-center gap-3 rounded-[16px] home-panel-soft-bg px-4 py-3">
          <LuInfo className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-questionnaire-stop)]" />
          <p className="text-sm leading-6 text-black">
            Type <span className="font-semibold text-[var(--color-questionnaire-stop)]">delete</span> to confirm this action.
          </p>
        </div>
        <input
          className="home-text mt-3 w-full rounded-[18px] border border-[color:var(--color-questionnaire-stop)]/35 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(239,68,68,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-questionnaire-stop)]/20"
          data-test-id="DELETE_QUESTIONNAIRE_MODEL"
          placeholder="Type 'delete' here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e)=>handleKeyPress(e, handleClick)}
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            varinat="cancel"
            className="border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            varinat="danger"
            onClick={handleClick}
            disabled={isPending || !isDeleteConfirmed}
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                <span>
                  Deleting
                  <span className="copying-dots ml-0.5 inline-flex w-[1.5em] justify-start">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </span>
              </>
            ) : (
              <>
                <LuTrash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModel;
