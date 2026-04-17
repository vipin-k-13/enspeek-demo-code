import DynamicModel from "../../global/DynamicModel";
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

  if (isError) {
    return null;
  }

  if (isClearHistoryPending) {
    return <LoaderSpinner />;
  }

  return (
    <DynamicModel
      Title={`Downloads : ${name}`}
      ButtonText="Clear History"
      isOpen={open}
      onClick={() => ClearHistory()}
      onClose={() => onOpenChange(false)}
      className="max-w-xl"
    >
      <div className="py-2 h-[20rem] overflow-y-auto no-scrollbar">
        {isPending ? (
          <LoaderSpinner />
        ) : List.data.length ? (
          List.data.map((item: any, index: number) => (
            <div
              data-test-id={`${item.req_name}_${index + 1}`}
              key={index}
              className={cn(
                "flex items-center justify-between p-4 border border-gray-200",
                item.status === 0 ? "bg-gray-100" : "",
                index === List.data.length - 1 && "pb-4"
              )}
            >
              <div className="flex-1">
                <p className="text-sm">
                  {index + 1}. {item.req_name}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(`${item.time}`).toDateString()}
                </p>
              </div>
              <div>
                <FiDownload
                  className={cn(
                    "h-6 w-6 text-amber-500 cursor-pointer",
                    pid.includes(item.pid) && "text-amber-800"
                  )}
                  onClick={() => DownloadHandle(item.pid)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex justify-center items-center text-xl font-bold">
            No Data Found
          </div>
        )}
      </div>
    </DynamicModel>
  );
}
