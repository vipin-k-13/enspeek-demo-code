import React from "react";
import { handleKeyPress } from "../../utils";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { LuCopy, LuInfo } from "react-icons/lu";

interface CopyModelProps {
  isOpen: boolean;
  onClick: (id: string, value: string) => void;
  onClose: () => void;
  label: string;
  isPending?: boolean;
}

const CopyModel: React.FC<CopyModelProps> = ({
  isOpen,
  onClick,
  onClose,
  label,
  isPending = false,
}) => {
  const [QID, setQID] = React.useState<string>("");
  const [QLabel, setQlabel] = React.useState<string>("");
  const displayLabel =
    label?.replace(/^[A-Za-z0-9_-]+\s*:\s*/, "").trim() || label;

  const handleClick = () => {
    if (QID !== "" && QLabel !== "") {
      onClick(`CQ${QID}`, QLabel);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
            <LuCopy className="h-5 w-5" />
          </span>
          <h3 className="questionnaire-heading text-[24px] font-extrabold">Copy Question</h3>
        </div>
        <p className="mt-4 text-[15px] leading-6 text-black">
          Create a copy of
          <span className="font-semibold text-login-primary">{` ${displayLabel || "this question"}`}</span>
          {" "}with a new question ID and label.
        </p>

        <div className="mt-5">
          <label className="questionnaire-heading mb-3 block text-[15px] font-semibold">
            QID <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="questionnaire-heading text-base font-semibold">CQ</span>
            <input
              data-test-id="COPY_QUESTIONNAIRE_MODEL_1"
              className="questionnaire-input questionnaire-heading w-full rounded-[18px] border border-login-primary/35 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(85,90,230,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-login-primary/20"
              placeholder="Enter QID"
              value={QID}
              onChange={(e) => setQID(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="questionnaire-heading mb-3 block text-[15px] font-semibold">
            Question Label <span className="text-red-500">*</span>
          </label>
          <input
            data-test-id="COPY_QUESTIONNAIRE_MODEL_2"
            className="questionnaire-input questionnaire-heading w-full rounded-[18px] border border-login-primary/35 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(85,90,230,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-login-primary/20"
            placeholder="Enter copied question label"
            value={QLabel}
            onChange={(e) => setQlabel(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, handleClick)}
          />
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-[16px] home-panel-soft-bg px-4 py-3">
          <LuInfo className="mt-0.5 h-4 w-4 shrink-0 text-login-primary" />
          <p className="text-sm leading-6 text-black">
            Click <span className="font-semibold text-login-primary">Copy Question</span> and wait a moment while the duplicated question is created.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            varinat="cancel"
            className="border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            varinat="theme"
            onClick={handleClick}
            disabled={isPending || QID.trim() === "" || QLabel.trim() === ""}
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                <span>
                  Copying
                  <span className="copying-dots ml-0.5 inline-flex w-[1.5em] justify-start">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </span>
              </>
            ) : (
              <>
                <LuCopy className="h-4 w-4" />
                Copy Question
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CopyModel;
