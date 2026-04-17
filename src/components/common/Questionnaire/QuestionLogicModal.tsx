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
      className="max-w-5xl"
      footerContent={
        <div className="flex gap-2">
          <Button
            className="bg-gray-50 px-3 py-1 text-gray-700 border-action border focus:outline-none rounded"
            onClick={() => {
              handleReset();
            }}
          >
            Reset Logic
          </Button>
          <Button
            className="bg-primary px-3 py-1 text-gray-50 focus:outline-none rounded"
            onClick={handleSave}
          >
            Save Logic
          </Button>
        </div>
      }
    >
      <QuestionLogic questionID={qID} resetFlag={resetFlag} isOpen={isOpen} />
    </LogicModel>
  );
}
