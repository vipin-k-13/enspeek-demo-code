import { useEffect, useState, type FC } from "react";
import DynamicModel from "../../global/DynamicModel";
import { toast } from "sonner";
import { handleKeyPress } from "../../../utils";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { LuBadgeCheck, LuInfo, LuPower } from "react-icons/lu";
import ModalInfoBlock from "../../ui/modal/ModalInfoBlock";

interface ActivateSurveyProps {
  isOpen: boolean;
  activate: () => void;
  onClose: () => void;
  studyInfo: any;
  isPending: boolean;
}

const ActivateSurvey: FC<ActivateSurveyProps> = ({
  isOpen,
  activate,
  onClose,
  studyInfo,
  isPending,
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen && !isPending) {
      setInputValue("");
    }
  }, [isOpen, isPending]);

  const handleActivateSurvey = () => {
    if (inputValue.trim().toLowerCase() !== "activate") {
        return toast.warning(`Please type "activate" to confirm`)
    }
    activate();
  };

  return (
    <DynamicModel
      Title="Activate Survey"
      headerIcon={
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
          <LuBadgeCheck className="h-5 w-5" />
        </span>
      }
      ButtonText={isPending ? "Activating..." : "Activate Survey"}
      buttonVariant="success"
      buttonIcon={
        isPending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
        ) : (
          <LuPower className="h-4 w-4" />
        )
      }
      isOpen={isOpen}
      onClick={handleActivateSurvey}
      onClose={() => !isPending && onClose()}
      className="max-w-lg"
      disable={isPending}
      bodyClassName="bg-white"
      secondaryAction={
        <Button
          type="button"
          varinat="cancel"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-base text-[var(--color-text-strong)]">
          Please confirm if you want to activate{" "}
          <span className="font-semibold text-login-primary">
            {studyInfo.studyname}
          </span>
          ?
        </p>
        <ModalInfoBlock
          className="modal-card rounded-[20px] bg-[var(--color-surface-base)] px-4 py-4"
          icon={
            <span className="modal-header-icon h-10 w-10 text-[var(--color-brand-primary)]">
              <LuInfo className="h-4 w-4" />
            </span>
          }
        >
          Type <strong className="text-login-primary">activate</strong> in the
          input box to confirm.
        </ModalInfoBlock>
      </div>
      <Input
        variant="modal"
        type="text"
        data-test-id="ACTIVATE_INPUT"
        placeholder="eg. activate"
        className="questionnaire-heading mt-4 rounded-[18px]"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e)=>handleKeyPress(e, handleActivateSurvey)}
        disabled={isPending}
      />
    </DynamicModel>
  );
};

export default ActivateSurvey;
