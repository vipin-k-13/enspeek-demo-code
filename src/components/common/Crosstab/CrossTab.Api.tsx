import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { queryClient } from "../../../App";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  setBannerPointer,
  setBanners,
  setBannersAll,
  setOptsData,
  setTableData,
  setVarsData,
} from "../../../store/CrossTabDataSlice";
import { setStudyInfo } from "../../../store/CrosstabStudySlice";
import { setSelectedQuestions } from "../../../store/CrosstabSlice";

interface customHooks {
  studyID?: string;
  cb?: ({ studyID, pid }: { studyID?: string; pid?: string }) => void;
}

export const useStudyInfo = (studyID: string) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { data: StudyInfo } = useSuspenseQuery({
    queryKey: ["studyInfo", studyID],
    queryFn: async () => {
      const res = await apiRequest("post", "study/info", {
        apiToken: user.apiToken,
        studyID: studyID,
      });
      dispatch(
        setStudyInfo({
          studyID: studyID,
          hasQuestionnaire: res.response.hasquestionnaire,
          launch: res.response.launch,
          name: res.response.studyname,
          output: res.response.output,
          link: res.response.link,
          closed: res.response.closed
        })
      );
      return res.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { StudyInfo };
};

export const useBannerList = (studyID: string) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: BannerListData,
    isLoading: isBannerListLoading,
    isError: isBannerListError,
  } = useQuery({
    queryKey: ["bannerList", studyID],
    queryFn: async () => {
      const res = await apiRequest("post", "crosstab/banner/list", {
        studyID,
        apiToken: user.apiToken,
      });
      dispatch(setBannersAll(res.response));
      dispatch(setBanners(res.response));

      return res.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
    select: (data) => {
      localStorage.setItem("BannerPoniterList", JSON.stringify(data));
      return data;
    },
  });

  return { BannerListData, isBannerListLoading, isBannerListError };
};

export const useAddBanner = ({
  studyID,
  cb = () => {},
}: customHooks) => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const {
    mutate: addBannerMutation,
    data: addBannerData,
    isPending: isAddBannerPending,
  } = useMutation({
    mutationKey: ["addBanner"],
    mutationFn: async ({
      title,
      description,
      logic,
      count,
      percent,
    }: AddBannerPayload) => {
      const res = await apiRequest("post", "crosstab/banner/add", {
        studyID,
        apiToken: user.apiToken,
        title: title,
        description: description,
        logic: logic,
        count: count,
        percent: percent,
      });
      return res.response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bannerList"] });
      toast.success("Banner added successfully");
      cb({});
      navigate("/crosstab/edit-banner", {
        state: { studyID, bannerID: data.bannerID },
      });
    },
  });
  return { addBannerMutation, addBannerData, isAddBannerPending };
};

export const useEditBanner = ({
  studyID,
  cb = () => {},
}: customHooks) => {
  const user = useSelector((state: RootState) => state.user);
  const {
    mutate: editBannerMutation,
    data: editBannerData,
    isPending: isEditBannerPending,
  } = useMutation({
    mutationKey: ["editBanner"],
    mutationFn: async ({
      bannerID,
      title,
      description,
      logic,
      count,
      percent,
      statGroup,
    }: EditBannerPayload) => {
      const res = await apiRequest("post", "crosstab/banner/edit", {
        studyID,
        apiToken: user.apiToken,
        bannerID,
        title,
        description,
        logic,
        count,
        percent,
        statGroup,
      });
      return res.response;
    },
    onSuccess: () => {
      cb({});
    },
  });
  return { editBannerMutation, editBannerData, isEditBannerPending };
};

export const useDeleteBanner = ({
  studyID,
  cb = () => {},
}: customHooks) => {
  const user = useSelector((state: RootState) => state.user);
  const {
    mutate: deleteBannerMutation,
    data: deletebannerData,
    isPending: isDeleteBannerPending,
  } = useMutation({
    mutationKey: ["deleteBanner"],
    mutationFn: async (bannerID: string) => {
      const res = await apiRequest("post", "crosstab/banner/delete", {
        studyID,
        apiToken: user.apiToken,
        bannerID,
      });
      return res.response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bannerList"] });
      await queryClient.refetchQueries({
        queryKey: ["bannerList", studyID],
        type: "active",
      });
      toast.success("Banner delete successfully");
      cb({});
    },
  });
  return { deleteBannerMutation, deletebannerData, isDeleteBannerPending };
};

export const useReplicateBanner = ({
  studyID,
  cb = () => {},
}: customHooks) => {
  const user = useSelector((state: RootState) => state.user);
  const {
    mutate: replicateBannerMutate,
    isPending: isRelicateBannerPending,
    data: replicateBannerData,
  } = useMutation({
    mutationKey: ["replicateBanner"],
    mutationFn: async ({
      bannerID,
      title,
    }: {
      bannerID: string;
      title: string;
    }) => {
      const res = await apiRequest("post", "crosstab/banner/replicate", {
        studyID,
        apiToken: user.apiToken,
        bannerID,
        title,
      });
      return res.response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bannerList"] });
      await queryClient.refetchQueries({
        queryKey: ["bannerList", studyID],
        type: "active",
      });
      toast.success("Banner copied successfully");
      cb({});
    },
  });
  return {
    replicateBannerMutate,
    isRelicateBannerPending,
    replicateBannerData,
  };
};

export const useTableList = (
  bannerID: string,
  studyID: string 
) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { data: tableListData, error: tableListError, isPending } = useQuery({
    queryKey: ["tableList", bannerID],
    queryFn: async () => {
      try {
        const res = await apiRequest("post", "crosstab/tableList/list", {
          studyID,
          apiToken: user.apiToken,
          bannerID,
        });
        dispatch(setTableData(Array.isArray(res.response) ? res.response : []));
        return res.response;
      } catch (err: any) {
        throw new Error(
          err?.response?.data?.message || "Unable to fetch table list"
        );
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
  return { tableListData, tableListError, isPending };
};

export const useQList = (
  studyID: string,
  bannerID: string
) => {
  const user = useSelector((state: RootState) => state.user);
  const { data: QListData, isPending: isQListDataPending } = useQuery({
    queryKey: ["qList"],
    queryFn: async () => {
      const res = await apiRequest("post", "crosstab/tableList/qlist", {
        studyID,
        apiToken: user.apiToken,
        bannerID,
      });
      return res.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { QListData, isQListDataPending };
};

export const useTableListAdd = (
  bannerID: string,
  studyID: string
) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const { selectedQuestions } = useSelector(
    (state: RootState) => state.crosstab
  );
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: tableListAddMutate,
    isPending: isTableListAddPending,
    data: tableListAddData,
  } = useMutation({
    mutationKey: ["tableListAdd"],
    mutationFn: async () => {
      const res = await apiRequest("post", "crosstab/tableList/add", {
        studyID,
        bannerID,
        apiToken,
        quest_info: selectedQuestions,
      });
      return res.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableList"] });
      dispatch(setSelectedQuestions([]));
      toast.success("Questions added successfully");
    },
  });
  return { tableListAddMutate, tableListAddData, isTableListAddPending };
};

export const useTableOutput = (
  tableId: string,
  bannerID: string,
  studyID: string
) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const {
    data: tableOutputData,
    refetch: TableOutputData,
    isRefetching: isTableOutputRefetching,
  } = useSuspenseQuery({
    queryKey: ["tableOutput", tableId],
    queryFn: async () => {
      const res = await apiRequest(
        "post",
        `crosstab/tableList/output/${bannerID}/${tableId}`,
        {
          studyID,
          apiToken,
        }
      );
      return res.response;
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });
  return { tableOutputData, TableOutputData, isTableOutputRefetching };
};

export const useQuesLogicVar = (studyID: string, questionID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { data: quesLogicVarData, isPending: isQuesLogicVarPending } = useQuery(
    {
      queryKey: ["quesLogicVar", studyID, questionID],
      queryFn: async () => {
        const res = await apiRequest("post", "questionnaire/logic/vars", {
          studyID,
          apiToken,
          qID: questionID
        });
        dispatch(setVarsData(res.response));
        return res.response;
      },
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
  return { quesLogicVarData, isQuesLogicVarPending };
};
export const useLogicVar = (studyID: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { data: logicVarData, isPending: isLogicVarPending } = useQuery({
    queryKey: ["logicVar"],
    queryFn: async () => {
      const res = await apiRequest("post", "crosstab/logic/vars", {
        studyID,
        apiToken,
      });
      dispatch(setVarsData(res.response));
      return res.response;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { logicVarData, isLogicVarPending };
};

export const useLogicOpts = (studyID: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: logicOptsMutate,
    isPending: isLogicOptsPending,
    data: logicOptsData,
  } = useMutation({
    mutationKey: ["LogicOpts"],
    mutationFn: async (qID: string) => {
      const res = await apiRequest("post", "crosstab/logic/opts", {
        studyID,
        apiToken,
        qID,
      });
      return res.response;
    },
    onSuccess: (data, variable) => {
      dispatch(setOptsData({ key: variable, data }));
    },
  });
  return { logicOptsMutate, logicOptsData, isLogicOptsPending };
};
export const useQuesLogicOpts = (studyID: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const {
    mutate: quesLogicOptsMutate,
    isPending: isQuesLogicOptsPending,
    data: quesLogicOptsData,
  } = useMutation({
    mutationKey: ["LogicOpts"],
    mutationFn: async (qID: string) => {
      const res = await apiRequest("post", "questionnaire/logic/opts", {
        studyID,
        apiToken,
        qID,
      });
      return res.response;
    },
    onSuccess: (data, variable) => {
      dispatch(setOptsData({ key: variable, data }));
    },
  });
  return { quesLogicOptsMutate, quesLogicOptsData, isQuesLogicOptsPending };
};

export const useOpList = (
  tableId: string,
  qid: string,
  bannerID: string,
  studyID: string
) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const { data: opListData, isPending: isOpListPending } = useQuery({
    queryKey: ["opList", qid],
    queryFn: async () => {
      const res = await apiRequest(
        "post",
        `crosstab/tableList/opList/${tableId}/${qid}`,
        {
          studyID,
          apiToken,
          bannerID,
        }
      );
      return res.response;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!apiToken && !!tableId && !!qid,
  });
  return { opListData, isOpListPending };
};

export const useBannerPointerList = (
  bannerID: string,
  studyID: string
) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: bannerPointerListData,
    isPending: isBannerPointerListPending,
    isError: isBannerPointerError,
  } = useSuspenseQuery({
    queryKey: ["bannerPointerList", bannerID],
    queryFn: async () => {
      const res = await apiRequest("post", "crosstab/bannerPoint/list", {
        studyID,
        bannerID,
        apiToken,
      });
      dispatch(
        setBannerPointer(Array.isArray(res.response) ? res.response : [])
      );
      return res.response;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    bannerPointerListData,
    isBannerPointerListPending,
    isBannerPointerError,
  };
};

export const useAddBannerPointer = (studyID: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const {
    mutate: addBannerPointerMutate,
    isPending: isAddBannerPointerPending,
  } = useMutation({
    mutationKey: ["addBannerPointer"],
    mutationFn: async ({
      bannerID,
      allSegment,
    }: {
      bannerID: string;
      allSegment: pointerSegment[];
    }) => {
      const res = await apiRequest("post", "crosstab/bannerPoint/add", {
        studyID,
        apiToken,
        bannerID,
        allSegment,
      });
      return res.response;
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ["bannerPointerList"] });
      navigate("/crosstab/table-list", {
        state: { bannerID: variable.bannerID, studyID },
      });
    },
  });

  return { addBannerPointerMutate, isAddBannerPointerPending };
};

export const useAddCustomTable = (studyID: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const { mutate: addCustomTableMutate, isPending: isAddCustomTablePending } =
    useMutation({
      mutationKey: ["addCustomTable"],
      mutationFn: async (payload: AddCustomTablePayload) => {
        const res = await apiRequest("post", "crosstab/tableList/custom/add", {
          studyID,
          ...payload,
          apiToken,
        });
        return res.response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tableList"] });
        toast.success("Custom Table Added Successfully");
      },
    });
  return { addCustomTableMutate, isAddCustomTablePending };
};

export const useEditTableListQuestion = ({
  qId,
  studyID,
  cb,
}: {
  qId: string;
  studyID?: string;
  cb?: () => void;
}) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const {
    mutate: editTableListQuestionMutate,
    isPending: isEditTableListQuestionPending,
  } = useMutation({
    mutationKey: ["editTableListQuestion"],
    mutationFn: async (data: EditTableListQuestionPayload) => {
      const res = await apiRequest("post", `crosstab/tableList/edit/${qId}`, {
        apiToken,
        studyID,
        ...data,
      });
      return res.response;
    },
    onSuccess: (_, variable) => {
      queryClient.refetchQueries({ queryKey: ["tableList"] });
      queryClient.refetchQueries({
        queryKey: ["tableOutput", variable.tableID],
      });
      cb && cb();
    },
  });
  return { editTableListQuestionMutate, isEditTableListQuestionPending };
};

export const useDownloadtable = ({
  studyID,
  cb,
}: customHooks) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const { mutate: downloadTableMutate, isPending: isdownloadTablePending } =
    useMutation({
      mutationKey: ["downloadTable"],
      mutationFn: async ({
        bannerID,
        tableID,
      }: {
        bannerID: string;
        tableID: string[];
      }) => {
        const res = await apiRequest("post", "crosstab/table/download", {
          studyID,
          bannerID,
          apiToken,
          tableID,
        });
        return res.response;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["processList"] });
        toast.info(
          "Please wait. Your file is being prepared for download, kindly visit download history"
        );
        cb?.({ studyID, pid: data?.pid });
      },
    });
  return { downloadTableMutate, isdownloadTablePending };
};
