import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { apiRequest } from "../../../services/apiService";
import { useQuery } from "@tanstack/react-query";
import { setQTypeList } from "../../../store/TriggerSlice";

export const useQtype = (studyID: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { data: Qtype = [] } = useQuery({
    queryKey: ["qType"],
    queryFn: async () => {
      try {
        const res = await apiRequest("post", "questionnaire/qtype", {
          apiToken: apiToken,
          studyID,
        });

        dispatch(setQTypeList(res.response));
        return res.response;
      } catch (error: any) {
        console.log(error.message);
      }
    },
    enabled: !!apiToken,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { Qtype };
};

export const useRI = (studyID: string) => {
  const { qType } = useSelector((state: RootState) => state.trigger);
  const { apiToken } = useSelector((state: RootState) => state.user);

  const { data: RI } = useQuery({
    queryKey: ["ri", qType],
    queryFn: async () => {
      const res = await apiRequest("post", "questionnaire/add/ri", {
        apiToken: apiToken,
        qtype: qType,
        studyID,
      });
      return res.response;
    },
    enabled: !!apiToken && !!qType,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  return {RI};
};
