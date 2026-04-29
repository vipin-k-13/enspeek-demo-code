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
import Button from "../../ui/Button";

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
            onClick={handleArchive}
          >
            Archive
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ArchiveModel;
