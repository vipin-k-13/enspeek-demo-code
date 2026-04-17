import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

interface SetQuotaProps {
  studyID: string;
  quota: number;
  cb?: (data: any) => void;
}

export const useSetQuota = ({ studyID, quota }: SetQuotaProps) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const {
    data: setQuotaData,
    isFetching: isSetQuotaPending,
    refetch: setQuota, 
  } = useQuery({
    queryKey: ["setQuota", studyID],
    queryFn: async () => {
      const res = await apiRequest("post", "study/set/quota", {
        apiToken,
        studyID,
        quota,
      });
      return res.response;
    },
    enabled: true,
    retry: false,
  });

  return { setQuota, setQuotaData, isSetQuotaPending };
};

export const useOverQuotaReport = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  return useQuery({
    queryKey: ["overQuotaReport", studyID],
    queryFn: async () => {
      const res = await apiRequest("post", "crosstab/freport", {
        apiToken,
        studyID,
      });
      return res.response;
    },
    enabled: !!studyID, 
  });
};
