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
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { LuInfo, LuTrash2 } from "react-icons/lu";
import ModalScaffold from "../../ui/modal/ModalScaffold";
import ModalInfoBlock from "../../ui/modal/ModalInfoBlock";
import { modalDefinitions } from "../../../config/modalDefinitions";

const DeleteModel = () => {
  const [deleteInputValue, setDeleteInputValue] = useState<string>("");
  const { deleteModel, selectedId, selectedStudyName } = useSelector(
    (state: RootState) => state.trigger
  );
  const dispatch = useDispatch<AppDispatch>();
  const { Delete, isPending } = useDelete();

  const handleDelete = () => {
    if (
      deleteInputValue.trim().toLowerCase() === "delete" &&
      selectedId !== ""
    ) {
      Delete(selectedId);
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
  const definition = modalDefinitions.deleteStudy;

  return (
    <ModalScaffold
      isOpen={deleteModel}
      onClose={handleClose}
      className={definition.maxWidthClass}
      title={definition.title}
      icon={<LuTrash2 className="h-5 w-5" />}
      closeDisabled={isPending}
      footerLeft={
        <Button type="button" varinat="cancel" onClick={handleClose} disabled={isPending}>
          {definition.cancelLabel}
        </Button>
      }
      footerRight={
        <Button
          type="button"
          varinat="danger"
          onClick={handleDelete}
          disabled={!isDeleteConfirmed || isPending}
        >
          {isPending ? (
            <>
              <span className="modal-spinner" />
              {definition.submittingLabel}
            </>
          ) : (
            <>
              <LuTrash2 className="h-4 w-4" />
              {definition.submitLabel}
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-[15px] leading-6 theme-text-default">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[var(--color-questionnaire-stop)]">
            {selectedStudyName || "this study"}
          </span>
          ? This action cannot be undone.
        </p>
        <ModalInfoBlock
          icon={<LuInfo className="h-4 w-4 text-[var(--color-questionnaire-stop)]" />}
        >
          Type{" "}
          <span className="font-semibold text-[var(--color-questionnaire-stop)]">
            delete
          </span>{" "}
          to confirm this action.
        </ModalInfoBlock>
        <Input
          variant="modalDanger"
          data-test-id="DELETE_MODEL"
          placeholder="Type 'delete' here..."
          value={deleteInputValue}
          onChange={(e) => setDeleteInputValue(e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, handleDelete)}
        />
      </div>
    </ModalScaffold>
  );
};

export default DeleteModel;
