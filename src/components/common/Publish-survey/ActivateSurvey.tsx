import { useState, type FC } from "react";
import DynamicModel from "../../global/DynamicModel";
import { toast } from "sonner";
import { handleKeyPress } from "../../../utils";

interface ActivateSurveyProps {
  isOpen: boolean;
  activate: () => void;
  onClose: () => void;
  studyInfo: any;
}

const ActivateSurvey: FC<ActivateSurveyProps> = ({
  isOpen,
  activate,
  onClose,
  studyInfo
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleActivateSurvey = () => {
    if (inputValue.trim().toLowerCase() !== "activate") {
        return toast.warning(`Please type "activate" to confirm`)
    }
    activate();
    setInputValue("");
  };

  return (
    <DynamicModel
      Title={studyInfo.studyname}
      ButtonText="Activate Survey"
      buttonVariant="theme"
      isOpen={isOpen}
      onClick={handleActivateSurvey}
      onClose={onClose}
      className="max-w-lg"
    >
      <p className="questionnaire-label mb-3 text-base">
        Please confirm if you want to activate {studyInfo.studyname}?
      </p>
      <p className="questionnaire-heading mb-3 text-sm">
        Type <strong>activate</strong> in the input box to confirm.
      </p>
      <input
        type="text"
        data-test-id="ACTIVATE_INPUT"
        placeholder="eg. activate"
        className="questionnaire-input questionnaire-heading questionnaire-border mt-1 w-full rounded-[16px] border px-4 py-3 text-sm focus:outline-none"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e)=>handleKeyPress(e, handleActivateSurvey)}
      />
    </DynamicModel>
  );
};

export default ActivateSurvey;
