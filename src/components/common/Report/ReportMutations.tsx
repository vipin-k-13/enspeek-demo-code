import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { queryClient } from "../../../App";
import { toast } from "sonner";

interface customHooks {
  studyID: string;
  cb: ({ studyID, pid }: { studyID: string; pid: string }) => void;
}

export const useExcelDownload = ({ studyID, cb }: customHooks) => {
  const user = useSelector((state: RootState) => state.user);
  const {
    mutate: DownloadExcel,
    data: DownloadExcelData,
    isPending: isDownloadExcelPending,
  } = useMutation({
    mutationKey: ["downloadExcel"],
    mutationFn: async () => {
      const res = await apiRequest("post", "report/export/data/excel", {
        apiToken: user.apiToken,
        studyID,
      });
      return res.response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["processList"] });
      cb({ studyID, pid: data });
    },
  });
  return { DownloadExcel, DownloadExcelData, isDownloadExcelPending };
};

export const useProcessHook = (cb?: () => void) => {
  const user = useSelector((state: RootState) => state.user);

  const { mutate: Process, isPending: isProcessPending } = useMutation({
    mutationKey: ["process"],
    mutationFn: async ({ studyID, pid }: { studyID: string; pid: string }) => {
      const res = await apiRequest(
        "post",
        "report/process",
        {
          apiToken: user.apiToken,
          studyID,
          pid,
        },
        "blob",
      );

      const contentDisposition = res.headers["content-disposition"];
      const blob = new Blob([res.response]);

      // Extract filename safely
      let filename = "Test_works_EXCEL_1771585829.xlsx";

      if (contentDisposition?.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
      }

      const url = window.URL.createObjectURL(res.response);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename; // cleaner way
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return blob;
    },
    onMutate: () => {
      toast.info("File is preparing for download");
    },
    onSuccess: () => {
      cb && cb();
    },
  });

  return { Process, isProcessPending };
};

export const useSpssHook = ({ studyID, cb }: customHooks) => {
  const user = useSelector((state: RootState) => state.user);
  const { mutate: DownloadSpss, isPending: isDownloadSpssPending } =
    useMutation({
      mutationKey: ["downloadSpss"],
      mutationFn: async () => {
        const res = await apiRequest("post", "report/export/data/spss", {
          apiToken: user.apiToken,
          studyID,
        });
        return res.response;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["processList"] });
        cb({ studyID, pid: data.pid });
      },
    });

  return { DownloadSpss, isDownloadSpssPending };
};

export const useClearHistoryHook = ({
  studyID,
  cb,
}: {
  studyID?: string;
  cb: () => void;
}) => {
  const user = useSelector((state: RootState) => state.user);
  const { mutate: ClearHistory, isPending: isClearHistoryPending } =
    useMutation({
      mutationKey: ["clearHistory"],
      mutationFn: async () => {
        const res = await apiRequest("post", "report/process/clear", {
          apiToken: user.apiToken,
          studyID,
        });
        return res.response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["processList"] });
        cb();
      },
    });

  return { ClearHistory, isClearHistoryPending };
};

export const useTableDownload = ({ studyID, cb }: customHooks) => {
  const user = useSelector((state: RootState) => state.user);
  const filter = useSelector((state: RootState) => state.filter);
  const {
    mutate: DownloadTable,
    data: DownloadTableData,
    isPending: isDownloadTablePending,
  } = useMutation<any, Error, string | void>({
    mutationKey: ["downloadExcel"],
    mutationFn: async (qid: string | void) => {
      const qidList = qid ? [qid] : filter.tableQList;

      const res = await apiRequest("post", "report/table/ready/all", {
        apiToken: user.apiToken,
        studyID,
        filter_data: {},
        side_by_side: 0,
        subgroupID: "Cell",
        qidList,
        qlabel: "",
      });
      return res.response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["processList"] });
      cb({ studyID, pid: data.pid });
    },
  });
  return { DownloadTable, DownloadTableData, isDownloadTablePending };
};

export const usePptDownloadHook = ({ studyID, cb }: customHooks) => {
  const user = useSelector((state: RootState) => state.user);
  const filter = useSelector((state: RootState) => state.filter);
  const { selected } = useSelector((state: RootState) => state.filter);
  const { mutate: DownloadPpt, isPending: isDownloadPptPending } = useMutation({
    mutationKey: ["downloadPpt"],
    mutationFn: async (qid: string | void) => {
      const qidList = qid
        ? [qid.toLowerCase()]
        : filter.tableQList.map((q: string) => q.toLowerCase());

      const res = await apiRequest("post", "report/reportReadyAll", {
        apiToken: user.apiToken,
        studyID,
        filter_data: {},
        side_by_side: 0,
        subgroupID: selected,
        qidList,
      });

      return res.response;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["processList"] });
      cb({ studyID, pid: data.pid });
    },
  });

  return { DownloadPpt, isDownloadPptPending };
};
