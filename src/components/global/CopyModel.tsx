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
      Title={`Copy question : ${label}`}
      ButtonText="Copy Question"
      isOpen={isOpen}
      onClick={handleClick}
      onClose={onClose}
      className="max-w-lg"
    >
      <div className="flex">
        <label className="text-gray-400 text-sm">QID</label>
        <span className="text-red-600 pl-1">*</span>
      </div>
      <div className="flex mb-3 items-center">
        <p>CQ</p>
        <input
          data-test-id="COPY_QUESTIONNAIRE_MODEL_1"
          className="border border-gray-400 ml-2 px-3 py-1 rounded-md focus-visible:outline-none"
          placeholder="Enter QID"
          onChange={(e) => setQID(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <div className="flex">
          <label className="text-gray-400 text-sm">Question label</label>
          <span className="text-red-600 pl-1">*</span>
        </div>
        <input
          data-test-id="COPY_QUESTIONNAIRE_MODEL_2"
          className="border border-gray-400 rounded-md px-3 py-1 w-full focus-visible:outline-none"
          placeholder="CQId: qLabel"
          onChange={(e) => setQlabel(e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, handleClick)}
        />
      </div>
    </DynamicModel>
  );
};

export default CopyModel;
