import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  setDeleteModel,
  setSelectedId,
  setSelectedStudyName,
} from "../../../store/TriggerSlice";
import { handleKeyPress } from "../../../utils";
import { useDelete } from "./Api";
import { toast } from "sonner";
import Modal from "../../ui/Modal";
import ModalInstruction from "../../ui/ModalInstruction";
import Button from "../../ui/Button";

const DeleteModel = () => {
  const [deleteInputValue, setDeleteInputValue] = useState<string>("");
  const { deleteModel, selectedId, selectedStudyName } = useSelector(
    (state: RootState) => state.trigger
  );
  const dispatch = useDispatch<AppDispatch>();
  const { Delete } = useDelete();

  const handleDelete = () => {
    if (
      deleteInputValue.trim().toLowerCase() === "delete" &&
      selectedId !== ""
    ) {
      Delete(selectedId);
      dispatch(setSelectedId(""));
      dispatch(setDeleteModel(false));
      setDeleteInputValue("");
    } else {
      toast.warning("Please type 'delete' to confirm.");
    }
  };
  const handleClose = () => {
    dispatch(setSelectedId(""));
    dispatch(setSelectedStudyName(""));
    dispatch(setDeleteModel(false));
    setDeleteInputValue("");
  };
  const isDeleteConfirmed =
    deleteInputValue.trim().toLowerCase() === "delete" && selectedId !== "";

  return (
    <Modal isOpen={deleteModel} onClose={handleClose} className="max-w-md">
      <div className="p-6">
        <h3 className="home-heading text-[22px] font-bold">Delete Study</h3>
        <p className="home-muted mt-3 text-[15px] leading-6">
          Are you sure you want to delete
          <span className="home-heading font-semibold">{` ${selectedStudyName || "this study"}`}</span>
          ? This action cannot be undone.
        </p>
        <ModalInstruction>
          Type <strong className="text-red-500">delete</strong> to confirm this action.
        </ModalInstruction>
        <input
          data-test-id="DELETE_MODEL"
          className="questionnaire-input home-text mt-3 w-full rounded-[18px] border questionnaire-border px-4 py-3 focus:outline-none"
          placeholder="Type 'delete' here..."
          value={deleteInputValue}
          onChange={(e) => setDeleteInputValue(e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, handleDelete)}
        />
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
            varinat="danger"
            onClick={handleDelete}
            disabled={!isDeleteConfirmed}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModel;
