import React from "react";
import DynamicModel from "./DynamicModel";
import { handleKeyPress } from "../../utils";

interface CopyModelProps {
  isOpen: boolean;
  onClick: (id: string, value: string) => void;
  onClose: () => void;
  label: string;
}

const CopyModel: React.FC<CopyModelProps> = ({
  isOpen,
  onClick,
  onClose,
  label,
}) => {
  const [QID, setQID] = React.useState<string>("");
  const [QLabel, setQlabel] = React.useState<string>("");

  const handleClick = () => {
    if (QID !== "" && QLabel !== "") {
      onClick(`CQ${QID}`, QLabel);
    }
  };

  return (
    <DynamicModel
      Title="Copy Question"
      ButtonText="Copy Question"
      isOpen={isOpen}
      onClick={handleClick}
      onClose={onClose}
      className="max-w-lg rounded-[24px]"
    >
      <div className="mb-3 flex">
        <label className="questionnaire-heading text-sm">QID</label>
        <span className="text-red-600 pl-1">*</span>
      </div>
      <div className="mb-5 flex items-center">
        <p className="questionnaire-heading">CQ</p>
        <input
          data-test-id="COPY_QUESTIONNAIRE_MODEL_1"
          className="questionnaire-input questionnaire-heading ml-2 w-full rounded-[20px] border questionnaire-border px-4 py-3 focus-visible:outline-none"
          placeholder="Enter QID"
          onChange={(e) => setQID(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <div className="flex">
          <label className="questionnaire-heading text-sm">Question Label</label>
          <span className="text-red-600 pl-1">*</span>
        </div>
        <input
          data-test-id="COPY_QUESTIONNAIRE_MODEL_2"
          className="questionnaire-input questionnaire-heading mt-3 w-full rounded-[20px] border questionnaire-border px-4 py-3 focus-visible:outline-none"
          placeholder="CQId: qLabel"
          onChange={(e) => setQlabel(e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, handleClick)}
        />
      </div>
    </DynamicModel>
  );
};

export default CopyModel;
