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
      isOpen={isOpen}
      onClick={handleActivateSurvey}
      onClose={onClose}
      className="max-w-lg"
    >
      <p className="text-sm text-gray-700 mb-3">
        Please confirm if you want to activate Testing11 Study?
      </p>
      <p className="text-sm text-gray-700 mb-2">
        Type <strong>activate</strong> in the input box to confirm.
      </p>
      <input
        type="text"
        data-test-id="ACTIVATE_INPUT"
        placeholder="eg. activate"
        className="w-full border border-gray-300 focus:outline-none rounded-md px-3 py-2 text-sm mt-1"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e)=>handleKeyPress(e, handleActivateSurvey)}
      />
    </DynamicModel>
  );
};

export default ActivateSurvey;
