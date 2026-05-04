import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { handleKeyPress } from "../../utils";
import { useCopy } from "../common/list/Api";
import { setCopyModel } from "../../store/TriggerSlice";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { LuCopy, LuInfo } from "react-icons/lu";

const ListingCopyModel: React.FC = () => {
  const { selectedStudyName, copyModel, selectedId } = useSelector(
    (state: RootState) => state.trigger
  );
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState<string>("");
  const { Copy, isPending } = useCopy();

  const defaultCopyName = selectedStudyName
    ? `${selectedStudyName} (copy)`
    : "";
  const draftValue = value;

  React.useEffect(() => {
    if (copyModel) {
      setValue(defaultCopyName);
    }
  }, [copyModel, defaultCopyName]);

  const handleClose = () => {
    dispatch(setCopyModel(false));
    setValue("");
  };

  return (
    <Modal isOpen={copyModel} onClose={handleClose} className="max-w-2xl">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
            <LuCopy className="h-5 w-5" />
          </span>
          <h3 className="home-heading text-[24px] font-extrabold">Copy Study</h3>
        </div>
        <p className="mt-4 text-[15px] leading-6 text-black">
          Create a copy of
          <span className="font-semibold text-login-primary">{` ${selectedStudyName || "this study"}`}</span>
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
          className="home-text mt-3 w-full rounded-[18px] border border-login-primary/35 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(85,90,230,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-login-primary/20"
          placeholder="Enter copied study name"
          onKeyDown={(e) =>
            handleKeyPress(e, () => {
              Copy({ studyId: selectedId, studyName: draftValue });
            })
          }
        />
        <div className="mt-4 flex items-start gap-3 rounded-[16px] home-panel-soft-bg px-4 py-3">
          <LuInfo className="mt-0.5 h-4 w-4 shrink-0 text-login-primary" />
          <p className="text-sm leading-6 text-black">
            Click <span className="font-semibold text-login-primary">Copy Study</span> and wait a moment while the duplicated study is created.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            varinat="cancel"
            className="border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            varinat="theme"
            onClick={() => {
              Copy({ studyId: selectedId, studyName: draftValue });
            }}
            disabled={isPending || draftValue.trim() === ""}
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
                Copy Study
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ListingCopyModel;
