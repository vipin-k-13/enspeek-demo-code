import React from "react";
import { toast } from "sonner";
import { handleKeyPress } from "../../utils";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { LuInfo, LuTrash2 } from "react-icons/lu";
import ModalScaffold from "../ui/modal/ModalScaffold";
import ModalInfoBlock from "../ui/modal/ModalInfoBlock";
import { modalDefinitions } from "../../config/modalDefinitions";

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
  const definition = modalDefinitions.deleteQuestion;

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
    <ModalScaffold
      isOpen={isOpen}
      onClose={onClose}
      className={definition.maxWidthClass}
      title={definition.title}
      icon={<LuTrash2 className="h-5 w-5" />}
      closeDisabled={isPending}
      footerLeft={
        <Button type="button" varinat="cancel" onClick={onClose} disabled={isPending}>
          {definition.cancelLabel}
        </Button>
      }
      footerRight={
        <Button
          type="button"
          varinat="danger"
          onClick={handleClick}
          disabled={isPending || !isDeleteConfirmed}
        >
          {isPending ? (
            <>
              <span className="modal-spinner" />
              {definition.submittingLabel}
            </>
          ) : (
            <>
              <LuTrash2 className="h-4 w-4" />
              {definition.submitLabel}
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-[15px] leading-6 theme-text-default">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[var(--color-questionnaire-stop)]">{`${qID ? `${qID}: ` : ""}${displayLabel || "this question"}`}</span>
          ? This action cannot be undone.
        </p>
        <ModalInfoBlock
          icon={<LuInfo className="h-4 w-4 text-[var(--color-questionnaire-stop)]" />}
        >
          Type{" "}
          <span className="font-semibold text-[var(--color-questionnaire-stop)]">
            delete
          </span>{" "}
          to confirm this action.
        </ModalInfoBlock>
        <Input
          variant="modalDanger"
          data-test-id="DELETE_QUESTIONNAIRE_MODEL"
          placeholder="Type 'delete' here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, handleClick)}
        />
      </div>
    </ModalScaffold>
  );
};

export default DeleteModel;
