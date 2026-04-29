import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import LoaderSpinner from "./LoaderSpinner";
import { handleKeyPress } from "../../utils";
import { useCopy } from "../common/list/Api";
import { setCopyModel } from "../../store/TriggerSlice";
import Modal from "../ui/Modal";
import ModalInstruction from "../ui/ModalInstruction";
import Button from "../ui/Button";

const ListingCopyModel: React.FC = () => {
  const { selectedStudyName, copyModel, selectedId } = useSelector(
    (state: RootState) => state.trigger
  );
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState<string>("");
  const { Copy, isPending } = useCopy();

  if (isPending) {
    return <LoaderSpinner />;
  }

  const handleClose = () => {
    dispatch(setCopyModel(false));
    setValue("");
  };

  const defaultCopyName = selectedStudyName
    ? `${selectedStudyName} (copy)`
    : "";
  const draftValue = value.trim() !== "" ? value : defaultCopyName;

  return (
    <Modal isOpen={copyModel} onClose={handleClose} className="max-w-md">
      <div className="p-6">
        <h3 className="home-heading text-[22px] font-bold">Copy Study</h3>
        <p className="home-muted mt-3 text-[15px] leading-6">
          Create a copy of
          <span className="home-heading font-semibold">{` ${selectedStudyName || "this study"}`}</span>
          {" "}with a new study name.
        </p>
        <label className="home-heading mt-5 block text-[15px] font-semibold">
          New Study Name
        </label>
        <input
          value={draftValue}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className="questionnaire-input home-text mt-3 w-full rounded-[18px] border questionnaire-border px-4 py-3 focus-visible:outline-none"
          placeholder="Enter copied study name"
          onKeyDown={(e) =>
            handleKeyPress(e, () => {
              Copy({ studyId: selectedId, studyName: draftValue });
              setValue("");
            })
          }
        />
        <ModalInstruction>
          Click <span className="font-semibold">Copy Study</span> and wait a moment while the duplicated study is created.
        </ModalInstruction>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            varinat="cancel"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            varinat="theme"
            onClick={() => {
              Copy({ studyId: selectedId, studyName: draftValue });
              setValue("");
            }}
            disabled={isPending || draftValue.trim() === ""}
          >
            Copy Study
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ListingCopyModel;
