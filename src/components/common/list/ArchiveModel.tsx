import Modal from "../../ui/Modal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  setArchiveModel,
  setSelectedId,
  setSelectedStudyName,
} from "../../../store/TriggerSlice";
import { useArchive } from "./Api";
import ModalInstruction from "../../ui/ModalInstruction";

const ArchiveModel = () => {
  const { archiveModel, selectedId, selectedStudyName } = useSelector(
    (state: RootState) => state.trigger
  );
  const dispatch = useDispatch<AppDispatch>();
  const { Archived } = useArchive();

  const handleClose = () => {
    dispatch(setArchiveModel(false));
    dispatch(setSelectedId(""));
    dispatch(setSelectedStudyName(""));
  };

  const handleArchive = () => {
    if (!selectedId) return;
    Archived(selectedId);
    handleClose();
  };

  return (
    <Modal isOpen={archiveModel} onClose={handleClose} className="max-w-md">
      <div className="p-6">
        <h3 className="home-heading text-[22px] font-bold">Archive Study</h3>
        <p className="home-muted mt-3 text-[15px] leading-6">
          Are you sure you want to archive
          <span className="home-heading font-semibold">{` ${selectedStudyName || "this study"}`}</span>
          ?
        </p>
        <ModalInstruction>
          You can activate it again later from the archive tab if needed.
        </ModalInstruction>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="report-toolbar-btn rounded-[16px] border home-border px-5 py-2.5 font-bold home-heading"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleArchive}
            className="report-toolbar-btn rounded-[16px] bg-login-primary px-5 py-2.5 font-bold text-white hover:bg-login-primary-hover"
          >
            Archive
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ArchiveModel;
