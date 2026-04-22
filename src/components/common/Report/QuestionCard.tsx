import React from "react";
import { LuPresentation } from "react-icons/lu";
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
    <div data-test-id={`${qId}_REPORTCARD`} className="report-card w-full h-auto overflow-hidden">
      <div className="report-card-header flex items-center justify-between px-5 py-4">
        <h3 className="report-title text-[16px] font-semibold">{title}</h3>
        <Button
          className="report-toolbar-btn bg-[var(--color-brand-primary-softest)] text-login-primary hover:bg-[var(--color-brand-primary-soft)] hover:text-white"
          onClick={() => {
            DownloadPpt(qId);
          }}
        >
          <LuPresentation />
        </Button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default QuestionCard;
