import { useMutation } from "@tanstack/react-query";
import QuestionLogic from "./QuestionLogic";
import { apiRequest } from "../../../services/apiService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { toast } from "sonner";
import { useLocation } from "react-router";
import Button from "../../ui/Button";
import LogicModel from "../../global/LogicModal";
import { useState } from "react";
import { LuSave } from "react-icons/lu";

interface QuesLogicModalProps {
  isOpen: boolean;
  onClose: () => void;
  qID: string | null;
  onSubmit: (qID: string) => void;
}

export default function QuesLogicModal({
  isOpen,
  onClose,
  qID,
  onSubmit,
}: QuesLogicModalProps) {
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const studyID = location.state?.studyID;
  const [resetFlag, setResetFlag] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const logicPayload = useSelector(
    (state: RootState) => state.question.logicPayload
  );
  const { mutate: QuesLogic, isPending } = useMutation({
    mutationKey: ["quesLogic"],
    mutationFn: async (qlPayload: QuesLogicPayload) => {
      const response = await apiRequest(
        "post",
        `questionnaire/edit/${qID}/logic`,
        {
          studyID,
          apiToken: user.apiToken,
          ...qlPayload,
        }
      );
      return response.response;
    },
    onSuccess: () => {
      if (isResetting) {
        toast.success("Logic reset successfully");
        setIsResetting(false);
        if (qID) onSubmit(qID);
        return;
      }

      toast.success("Logic saved successfully");
      if (qID) onSubmit(qID);
      onClose();
    },
  });

  const handleSave = () => {
    if (!qID) {
      toast.error("Question ID not found");
      return;
    }
    if(resetFlag){
      QuesLogic({logic1:{}}as QuesLogicPayload)
      return
    }
    QuesLogic((logicPayload ?? {}) as QuesLogicPayload);
  };

  const handleReset = () => {
    setIsResetting(true);
    setResetFlag((prev) => !prev);

    setTimeout(() => {
      handleSave();
    }, 100);
  };

  return (
    <LogicModel
      isOpen={isOpen}
      onClose={onClose}
      Title="Add/Edit Question Logic"
      description="Configure logic rules for this question. Save when the conditions, skip path, or termination behavior are ready."
      className="max-w-[90vw]"
      footerContent={
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            varinat="cancel"
            className="border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50"
            onClick={() => {
              handleReset();
            }}
            disabled={isPending}
          >
            {isPending && isResetting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-[var(--color-text-strong)]/25 border-t-[var(--color-text-strong)] animate-spin" />
                <span>
                  Resetting
                  <span className="copying-dots ml-0.5 inline-flex w-[1.5em] justify-start">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </span>
              </>
            ) : (
              "Reset Logic"
            )}
          </Button>
          <Button
            varinat="success"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                <span>
                  Saving
                  <span className="copying-dots ml-0.5 inline-flex w-[1.5em] justify-start">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </span>
              </>
            ) : (
              <>
                <LuSave className="h-4 w-4" />
                Save Logic
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <QuestionLogic questionID={qID} resetFlag={resetFlag} isOpen={isOpen} />
      </div>
    </LogicModel>
  );
}
