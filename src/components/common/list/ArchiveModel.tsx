import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  setArchiveAction,
  setArchiveModel,
  setSelectedId,
  setSelectedStudyName,
} from "../../../store/TriggerSlice";
import { useActive, useArchive } from "./Api";
import Button from "../../ui/Button";
import ModalScaffold from "../../ui/modal/ModalScaffold";
import { LuArchive } from "react-icons/lu";
import { modalDefinitions } from "../../../config/modalDefinitions";

const ArchiveModel = () => {
  const { archiveModel, archiveAction, selectedId, selectedStudyName } = useSelector(
    (state: RootState) => state.trigger
  );
  const dispatch = useDispatch<AppDispatch>();
  const isUnarchive = archiveAction === "unarchive";
  const definition = isUnarchive
    ? modalDefinitions.unarchiveStudy
    : modalDefinitions.archiveStudy;

  const handleClose = () => {
    dispatch(setArchiveModel(false));
    dispatch(setArchiveAction("archive"));
    dispatch(setSelectedId(""));
    dispatch(setSelectedStudyName(""));
  };
  const { Archived, isPending: isArchiving } = useArchive(handleClose);
  const { Active, isPending: isUnarchiving } = useActive(handleClose);
  const isPending = isUnarchive ? isUnarchiving : isArchiving;

  const handleStatusChange = () => {
    if (!selectedId) return;
    if (isUnarchive) {
      Active(selectedId);
      return;
    }
    Archived(selectedId);
  };

  return (
    <ModalScaffold
      isOpen={archiveModel}
      onClose={handleClose}
      className={definition.maxWidthClass}
      title={definition.title}
      icon={<LuArchive className="h-5 w-5" />}
      closeDisabled={isPending}
      footerLeft={
        <Button
          type="button"
          varinat="cancel"
          onClick={handleClose}
          disabled={isPending}
        >
          {definition.cancelLabel}
        </Button>
      }
      footerRight={
        <Button
          type="button"
          varinat="theme"
          onClick={handleStatusChange}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
              {definition.submittingLabel}
            </>
          ) : (
            <>
              <LuArchive className="h-4 w-4" />
              {definition.submitLabel}
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-[15px] leading-7 text-[var(--color-text-default)]">
          Are you sure you want to {isUnarchive ? "unarchive" : "archive"}{" "}
          <span className="font-semibold text-[var(--color-brand-primary)]">
            {selectedStudyName || "this study"}
          </span>
          ?
        </p>
        <div className="modal-card px-4 py-3">
          <p className="text-sm leading-6 text-[var(--color-text-default)]">
            {isUnarchive
              ? "It will move back to your active studies after confirmation."
              : "You can activate it again later from the archive tab if needed."}
          </p>
        </div>
      </div>
    </ModalScaffold>
  );
};

export default ArchiveModel;
