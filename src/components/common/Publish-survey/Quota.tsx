import React, { useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";
import { useSetQuota } from "./SurveyApi";
import { LuCircleCheck, LuCircleX, LuClock3, LuPencilLine } from "react-icons/lu";
import { Tooltip } from "../../ui/Tooltip";
import IconActionButton from "../../ui/IconActionButton";

interface QuotaProps {
  studyID: string;
  complete: number;
  disqualified: number;
  incomplete: number;
  totalQuota?: number;
}

const Quota: React.FC<QuotaProps> = ({
  studyID,
  complete,
  disqualified,
  incomplete,
  totalQuota,
}) => {
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [editTotal, setEditTotal] = useState(totalQuota || 100);
  const { setQuota, isSetQuotaPending } = useSetQuota({
    studyID,
    quota: editTotal || 100,
  });

  const handleSaveTotal = () => {
    setQuota();
    setIsEditingTotal(false);
    toast.success("Quota updated successfully!");
  };

  const safeTotalQuota = totalQuota || 0;
  const progress = safeTotalQuota > 0 ? Math.min((complete / safeTotalQuota) * 100, 100) : 0;

  return (
    <section className="questionnaire-card mt-6 w-full rounded-[24px] border home-border-soft p-6 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="questionnaire-heading text-[16px] font-bold">
              Response Overview
            </h2>
          </div>
          <div className="min-w-[116px]">
            {!isEditingTotal ? (
              <div className="flex items-center justify-end gap-2">
                <span className="home-muted text-sm font-medium">
                  Total Quota
                </span>
                <span className="questionnaire-heading text-sm font-bold">
                  {isSetQuotaPending ? "Updating..." : editTotal}
                </span>
                <Tooltip content="Edit total quota" position="top">
                  <IconActionButton
                    tone="primary"
                    onClick={() => setIsEditingTotal(true)}
                  >
                    <LuPencilLine size={16} />
                  </IconActionButton>
                </Tooltip>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2">
                <input
                  type="number"
                  value={editTotal}
                  onChange={(e) => setEditTotal(Number(e.target.value))}
                  className="questionnaire-input questionnaire-heading w-20 rounded-xl border questionnaire-border px-3 py-2 text-sm focus:outline-none"
                />
                <Tooltip content="Set total quota" position="top">
                  <button
                    onClick={handleSaveTotal}
                    className="questionnaire-clickable text-[var(--color-questionnaire-multi)] transition hover:opacity-80"
                  >
                    <AiOutlineSave size={18} />
                  </button>
                </Tooltip>
                <Tooltip content="Cancel" position="top">
                  <IconActionButton
                    tone="danger"
                    onClick={() => setIsEditingTotal(false)}
                  >
                    <MdCancel size={18} />
                  </IconActionButton>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="questionnaire-label">Progress</span>
            <span className="questionnaire-heading text-[14px] font-bold">
              {`${complete} / ${safeTotalQuota}`}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-brand-primary-softest)]">
            <div
              className="h-full rounded-full bg-login-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {!isEditingTotal ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[20px] bg-[var(--color-questionnaire-open-bg)] p-4">
              <div className="mb-3 flex items-center gap-2 text-[var(--color-questionnaire-open)]">
                <LuCircleCheck className="h-4 w-4" />
                <p className="text-sm font-medium">Complete</p>
              </div>
              <p className="text-[18px] font-bold text-[var(--color-questionnaire-open)]">
                {complete}
              </p>
            </div>
            <div className="rounded-[20px] bg-[var(--color-questionnaire-stop-bg)] p-4">
              <div className="mb-3 flex items-center gap-2 text-[var(--color-questionnaire-stop)]">
                <LuCircleX className="h-4 w-4" />
                <p className="text-sm font-medium">Disqualified</p>
              </div>
              <p className="text-[18px] font-bold text-[var(--color-questionnaire-stop)]">
                {disqualified}
              </p>
            </div>
            <div className="rounded-[20px] bg-[var(--color-study-progress-bg)] p-4">
              <div className="mb-3 flex items-center gap-2 text-[var(--color-study-progress)]">
                <LuClock3 className="h-4 w-4" />
                <p className="text-sm font-medium">Incomplete</p>
              </div>
              <p className="text-[18px] font-bold text-[var(--color-study-progress)]">
                {incomplete}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[20px] bg-[var(--color-questionnaire-open-bg)] p-4">
              <div className="mb-3 flex items-center gap-2 text-[var(--color-questionnaire-open)]">
                <LuCircleCheck className="h-4 w-4" />
                <p className="text-sm font-medium">Complete</p>
              </div>
              <p className="text-[18px] font-bold text-[var(--color-questionnaire-open)]">
                {complete}
              </p>
            </div>
            <div className="rounded-[20px] bg-[var(--color-questionnaire-stop-bg)] p-4">
              <div className="mb-3 flex items-center gap-2 text-[var(--color-questionnaire-stop)]">
                <LuCircleX className="h-4 w-4" />
                <p className="text-sm font-medium">Disqualified</p>
              </div>
              <p className="text-[18px] font-bold text-[var(--color-questionnaire-stop)]">
                {disqualified}
              </p>
            </div>
            <div className="rounded-[20px] bg-[var(--color-study-progress-bg)] p-4">
              <div className="mb-3 flex items-center gap-2 text-[var(--color-study-progress)]">
                <LuClock3 className="h-4 w-4" />
                <p className="text-sm font-medium">Incomplete</p>
              </div>
              <p className="text-[18px] font-bold text-[var(--color-study-progress)]">
                {incomplete}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Quota;
