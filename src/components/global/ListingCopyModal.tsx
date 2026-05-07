import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { handleKeyPress } from "../../utils";
import { useCopy } from "../common/list/Api";
import { setCopyModel } from "../../store/TriggerSlice";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { LuCopy, LuInfo } from "react-icons/lu";
import ModalScaffold from "../ui/modal/ModalScaffold";
import ModalField from "../ui/modal/ModalField";
import ModalInfoBlock from "../ui/modal/ModalInfoBlock";
import { modalDefinitions } from "../../config/modalDefinitions";

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
  const definition = modalDefinitions.copyStudy;

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
    <ModalScaffold
      isOpen={copyModel}
      onClose={handleClose}
      className={definition.maxWidthClass}
      title={definition.title}
      icon={<LuCopy className="h-5 w-5" />}
      closeDisabled={isPending}
      footerLeft={
        <Button type="button" varinat="cancel" onClick={handleClose} disabled={isPending}>
          {definition.cancelLabel}
        </Button>
      }
      footerRight={
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
              <span className="modal-spinner" />
              {definition.submittingLabel}
            </>
          ) : (
            <>
              <LuCopy className="h-4 w-4" />
              {definition.submitLabel}
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-[15px] leading-6 theme-text-default">
          Create a copy of{" "}
          <span className="font-semibold text-[var(--color-brand-primary)]">
            {selectedStudyName || "this study"}
          </span>{" "}
          with a new study name.
        </p>
        <ModalField label="New Study Name" required>
          <Input
            variant="modal"
            value={draftValue}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder="Enter copied study name"
            onKeyDown={(e) =>
              handleKeyPress(e, () => {
                Copy({ studyId: selectedId, studyName: draftValue });
              })
            }
          />
        </ModalField>
        <ModalInfoBlock
          icon={<LuInfo className="h-4 w-4 text-[var(--color-brand-primary)]" />}
        >
          Click{" "}
          <span className="font-semibold text-[var(--color-brand-primary)]">
            Copy Study
          </span>{" "}
          and wait a moment while the duplicated study is created.
        </ModalInfoBlock>
      </div>
    </ModalScaffold>
  );
};

export default ListingCopyModel;
