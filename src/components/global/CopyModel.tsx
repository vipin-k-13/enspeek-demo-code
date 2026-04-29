import React from "react";
import { handleKeyPress } from "../../utils";
import Modal from "../ui/Modal";
import ModalInstruction from "../ui/ModalInstruction";
import Button from "../ui/Button";

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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <h3 className="questionnaire-heading text-[22px] font-bold">Copy Question</h3>
        <p className="report-muted mt-3 text-[15px] leading-6">
          Create a copy of
          <span className="questionnaire-heading font-semibold">{` ${label || "this question"}`}</span>
          {" "}with a new question ID and label.
        </p>

        <div className="mt-5">
          <label className="questionnaire-label mb-3 block text-[15px]">
            QID <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="questionnaire-heading text-base font-semibold">CQ</span>
            <input
              data-test-id="COPY_QUESTIONNAIRE_MODEL_1"
              className="questionnaire-input questionnaire-heading w-full rounded-[18px] border questionnaire-border px-4 py-3 focus-visible:outline-none"
              placeholder="Enter QID"
              onChange={(e) => setQID(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="questionnaire-label mb-3 block text-[15px]">
            Question Label <span className="text-red-500">*</span>
          </label>
          <input
            data-test-id="COPY_QUESTIONNAIRE_MODEL_2"
            className="questionnaire-input questionnaire-heading w-full rounded-[18px] border questionnaire-border px-4 py-3 focus-visible:outline-none"
            placeholder="Enter copied question label"
            onChange={(e) => setQlabel(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, handleClick)}
          />
        </div>

        <ModalInstruction>
          Click <span className="font-semibold">Copy Question</span> and wait a moment while the duplicated question is created.
        </ModalInstruction>

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
            varinat="theme"
            onClick={handleClick}
            disabled={QID.trim() === "" || QLabel.trim() === ""}
          >
            Copy Question
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CopyModel;
