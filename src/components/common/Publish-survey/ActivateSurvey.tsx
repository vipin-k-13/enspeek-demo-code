import { useEffect, useState, type FC } from "react";
import DynamicModel from "../../global/DynamicModel";
import { toast } from "sonner";
import { handleKeyPress } from "../../../utils";
import Button from "../../ui/Button";
import { LuBadgeCheck, LuInfo, LuPower } from "react-icons/lu";

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
          className="border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50"
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
        <div className="rounded-[20px] border questionnaire-border bg-white px-4 py-4 shadow-[0_8px_24px_rgba(79,70,229,0.08)]">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
              <LuInfo className="h-4 w-4" />
            </span>
            <p className="text-sm leading-6 text-[var(--color-text-strong)]">
              Type <strong className="text-login-primary">activate</strong> in
              the input box to confirm.
            </p>
          </div>
        </div>
      </div>
      <input
        type="text"
        data-test-id="ACTIVATE_INPUT"
        placeholder="eg. activate"
        className="questionnaire-input questionnaire-heading questionnaire-border mt-4 w-full rounded-[18px] border border-login-primary/30 px-4 py-3 text-sm shadow-[0_8px_24px_rgba(79,70,229,0.08)] focus:outline-none"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e)=>handleKeyPress(e, handleActivateSurvey)}
        disabled={isPending}
      />
    </DynamicModel>
  );
};

export default ActivateSurvey;
