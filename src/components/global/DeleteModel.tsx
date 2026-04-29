import React from "react";
import { toast } from "sonner";
import { handleKeyPress } from "../../utils";
import Modal from "../ui/Modal";
import ModalInstruction from "../ui/ModalInstruction";
import Button from "../ui/Button";

interface DeleteModelProps {
  onClick: () => void;
  isOpen: boolean;
  onClose: () => void;
  label: string
}

const DeleteModel: React.FC<DeleteModelProps> = ({
  onClick,
  isOpen,
  onClose,
  label,
}) => {
  const [inputValue, setInputValue] = React.useState<string>("");

  const handleClick = () => {
    if (inputValue?.trim()?.toLowerCase() === "delete") {
      onClick();
      onClose();
      setInputValue("");
    } else {
      return toast.warning(`Please type "delete" to confirm`);
    }
  };
  const isDeleteConfirmed = inputValue?.trim()?.toLowerCase() === "delete";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <h3 className="questionnaire-heading text-[22px] font-bold">Delete Question</h3>
        <p className="report-muted mt-3 text-[15px] leading-6">
          Are you sure you want to delete
          <span className="questionnaire-heading font-semibold">{` ${label || "this question"}`}</span>
          ? This action cannot be undone.
        </p>
        <ModalInstruction>
          Type <strong className="text-red-500">delete</strong> to confirm this action.
        </ModalInstruction>
        <input
          className="questionnaire-input mt-3 w-full rounded-[18px] border questionnaire-border px-4 py-3 focus:outline-none"
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
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            varinat="danger"
            onClick={handleClick}
            disabled={!isDeleteConfirmed}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModel;
