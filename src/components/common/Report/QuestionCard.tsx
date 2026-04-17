import React from "react";
import { FaFilePowerpoint } from "react-icons/fa";
import { usePptDownloadHook, useProcessHook } from "./ReportMutations";
import { useLocation } from "react-router";
import Button from "../../ui/Button";

interface QuestionCardProps {
  title: string;
  children: React.ReactNode;
  qId: string;
  studyID?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ title, children, qId, studyID }) => {
  const { state } = useLocation();
  const { Process } = useProcessHook();
  const { DownloadPpt } = usePptDownloadHook({
     studyID: studyID ? studyID : state?.studyID,
    cb: ({ studyID, pid }) => {
      Process({ studyID, pid });
    },
  });
  return (
    <div data-test-id={`${qId}_REPORTCARD`} className="bg-white border border-gray-200 rounded-lg w-full h-auto mb-4">
      <div className="flex items-center justify-between p-2 border-b border-gray-100 bg-gray-200/80">
        <h3 className="font-medium text-gray-600">{title}</h3>
        <Button
          className="text-yellow-500 cursor-pointer"
          onClick={() => {
            DownloadPpt(qId);
          }}
        >
          <FaFilePowerpoint />
        </Button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default QuestionCard;
