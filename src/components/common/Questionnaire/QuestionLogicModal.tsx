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
  const { mutate: QuesLogic } = useMutation({
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
      if (!isResetting) {
        toast.success("Logic saved successfully");
      }
      setIsResetting(false);
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
      toast.success("Logic reset successfully");
    }, 100);
  };

  return (
    <LogicModel
      isOpen={isOpen}
      onClose={onClose}
      Title="Edit or Add logic"
      className="max-w-[min(92vw,1320px)]"
      footerContent={
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            className="platform-btn-modal questionnaire-action-btn border questionnaire-border bg-white px-5 py-2.5 questionnaire-heading shadow-none"
            onClick={() => {
              handleReset();
            }}
          >
            Reset Logic
          </Button>
          <Button
            className="platform-btn-modal questionnaire-save-btn questionnaire-action-btn px-5 py-2.5 shadow-none"
            onClick={handleSave}
          >
            Save Logic
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-[16px] home-panel-soft-bg px-4 py-3">
          <p className="home-muted text-sm leading-6">
            Configure logic rules for this question. Save when the conditions,
            skip path, or termination behavior are ready.
          </p>
        </div>
        <QuestionLogic questionID={qID} resetFlag={resetFlag} isOpen={isOpen} />
      </div>
    </LogicModel>
  );
}
