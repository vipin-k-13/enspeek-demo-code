import DynamicModel from "../../global/DynamicModel";
import Button from "../../ui/Button";
import { FiDownload } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import LoaderSpinner from "../../global/LoaderSpinner";
import { cn } from "../../../utils";
import { useClearHistoryHook, useProcessHook } from "./ReportMutations";
import { queryClient } from "../../../App";
import { useState } from "react";
import { useLocation } from "react-router";
import { LuEraser } from "react-icons/lu";

export default function HistoryModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const user = useSelector((state: RootState) => state.user);
  const { name } = useSelector((state: RootState) => state.study);
  const [pid, setPid] = useState<string[]>([]);
  const callback = () => {
    queryClient.invalidateQueries({ queryKey: ["processList"] });
    onOpenChange(false);
  };
  const { state } = useLocation();
  const { Process } = useProcessHook(() => setPid([]));
  const { ClearHistory, isClearHistoryPending } = useClearHistoryHook({
    studyID: state.studyID,
    cb: callback,
  });

  const {
    data: List,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["processList"],
    queryFn: async () => {
      const res = await apiRequest("post", "report/processList", {
        apiToken: user.apiToken,
        studyID: state.studyID,
      });

      return res.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const DownloadHandle = (pid: string) => {
    setPid((prev) => [pid, ...prev]);
    Process({ studyID: state.studyID, pid: pid });
  };
  const hasHistory = Boolean(List?.data?.length);

  if (isError) {
    return null;
  }

  return (
    <DynamicModel
      Title={`Downloads : ${name}`}
      description="Review recent downloads for this study, or clear the history when you no longer need it."
      ButtonText={hasHistory ? (isClearHistoryPending ? "Clearing..." : "Clear History") : ""}
      buttonIcon={
        hasHistory
          ? isClearHistoryPending ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
            ) : (
              <LuEraser className="h-4 w-4" />
            )
          : undefined
      }
      buttonVariant="danger"
      isOpen={open}
      onClick={() => {
        if (hasHistory) {
          ClearHistory();
        }
      }}
      onClose={() => onOpenChange(false)}
      className="max-w-xl"
      disable={isClearHistoryPending}
      secondaryActionPosition={hasHistory ? "before" : "after"}
      secondaryAction={
        <Button
          type="button"
          varinat="cancel"
          onClick={() => onOpenChange(false)}
          disabled={isClearHistoryPending}
        >
          Cancel
        </Button>
      }
    >
      <div className="py-1">
        {isPending ? (
          <LoaderSpinner />
        ) : List.data.length ? (
          List.data.map((item: any, index: number) => (
            <div
              data-test-id={`${item.req_name}_${index + 1}`}
              key={index}
              className={cn(
                "mb-3 flex items-center justify-between rounded-[18px] border home-border-soft p-4 shadow-sm",
                item.status === 0 ? "home-panel-soft-bg" : "bg-white",
                index === List.data.length - 1 && "pb-4"
              )}
            >
              <div className="flex-1">
                <p className="home-text text-sm font-medium">
                  {index + 1}. {item.req_name}
                </p>
                <p className="home-muted text-xs">
                  {new Date(`${item.time}`).toDateString()}
                </p>
              </div>
              <div>
                <FiDownload
                  className={cn(
                    "h-6 w-6 cursor-pointer text-[var(--color-study-progress)]",
                    pid.includes(item.pid) && "text-[var(--color-brand-primary)]"
                  )}
                  onClick={() => DownloadHandle(item.pid)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="questionnaire-heading flex h-full w-full items-center justify-center text-lg font-semibold">
            No Data Found
          </div>
        )}
      </div>
    </DynamicModel>
  );
}
