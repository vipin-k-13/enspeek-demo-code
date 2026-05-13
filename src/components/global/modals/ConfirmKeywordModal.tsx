import { useEffect, useState } from "react";
import { toast } from "sonner";
import { handleKeyPress } from "../../../utils";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import ModalScaffold from "../../ui/modal/ModalScaffold";
import ModalInfoBlock from "../../ui/modal/ModalInfoBlock";
import { LuInfo, LuTrash2 } from "react-icons/lu";
import { modalDefinitions } from "../../../config/modalDefinitions";

type ConfirmKeywordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titleKey: keyof typeof modalDefinitions;
  targetLabel: string;
  keyword?: string;
  actionVerb?: string;
  warningToneClass?: string;
  isPending?: boolean;
  testId?: string;
};

export default function ConfirmKeywordModal({
  isOpen,
  onClose,
  onConfirm,
  titleKey,
  targetLabel,
  keyword = "delete",
  actionVerb = "delete",
  warningToneClass = "text-[var(--color-questionnaire-stop)]",
  isPending = false,
  testId,
}: ConfirmKeywordModalProps) {
  const [value, setValue] = useState("");
  const definition = modalDefinitions[titleKey];
  const normalizedKeyword = keyword.trim().toLowerCase();
  const isConfirmed = value.trim().toLowerCase() === normalizedKeyword;

  useEffect(() => {
    if (isOpen) {
      setValue("");
    }
  }, [isOpen, targetLabel]);

  const handleConfirm = () => {
    if (!isConfirmed) {
      toast.warning(`Please type "${keyword}" to confirm.`);
      return;
    }

    onConfirm();
  };

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
          onClick={handleConfirm}
          disabled={isPending || !isConfirmed}
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
          Are you sure you want to {actionVerb}{" "}
          <span className={`font-semibold ${warningToneClass}`}>
            {targetLabel}
          </span>
          ? This action cannot be undone.
        </p>
        <ModalInfoBlock
          icon={<LuInfo className={`h-4 w-4 ${warningToneClass}`} />}
        >
          Type <span className={`font-semibold ${warningToneClass}`}>{keyword}</span>{" "}
          to confirm this action.
        </ModalInfoBlock>
        <Input
          variant="modalDanger"
          data-test-id={testId}
          placeholder={`Type '${keyword}' here...`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, handleConfirm)}
        />
      </div>
    </ModalScaffold>
  );
}
