import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { toast } from "sonner";
import { queryClient } from "../../../App";
import { setFilterStudys } from "../../../store/CrosstabStudySlice";
import {
  setCopyModel,
  setDeleteModel,
  setSelectedId,
  setSelectedStudyName,
} from "../../../store/TriggerSlice";

const removeStudyFromList = (items: any[], studyId: string) =>
  items.filter((prev) => (prev.studyid ?? prev.studyID) !== studyId);

const refreshStudyList = async () => {
  window.dispatchEvent(new CustomEvent("refresh-study-list"));
  await queryClient.invalidateQueries({
    queryKey: ["studyList"],
    exact: false,
  });
  await queryClient.refetchQueries({
    queryKey: ["studyList"],
    exact: false,
    type: "active",
  });
};

export const useArchive = () => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const { FilterStudys } = useSelector((state: RootState) => state.study);
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: Archived } = useMutation({
    mutationFn: async (selectedStudies: string) => {
      return await apiRequest("post", "study/archive", {
        apiToken: apiToken,
        study_list: [selectedStudies],
      });
    },
    onMutate(variables) {
      const newData = removeStudyFromList(FilterStudys, variables);
      dispatch(setFilterStudys(newData));
    },
    onSuccess: async () => {
      await refreshStudyList();
      toast.success("Study archived successfully");
    },
  });

  return { Archived };
};

export const useDelete = () => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const { FilterStudys } = useSelector((state: RootState) => state.study);
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: Delete, isPending } = useMutation({
    mutationKey: ["studyDelete"],
    mutationFn: async (selectedStudies: string) => {
      const res = await apiRequest("post", "study/delete", {
        apiToken: apiToken,
        study_list: [selectedStudies],
      });
      if (!res) {
        return null;
      }
      return res;
    },
    onMutate(variables) {
      const newData = removeStudyFromList(FilterStudys, variables);
      dispatch(setFilterStudys(newData));
    },
    onSuccess: async (data) => {
      if (!data) {
        return;
      }
      await refreshStudyList();
      dispatch(setSelectedId(""));
      dispatch(setSelectedStudyName(""));
      dispatch(setDeleteModel(false));
      toast.success("Study deleted successfully");
    },
  });

  return { Delete, isPending };
};

export const useCopy = () => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: Copy, isPending } = useMutation({
    mutationKey: ["CopyStudy"],
    mutationFn: async ({
      studyId,
      studyName,
    }: {
      studyId: string;
      studyName: string;
    }) => {
      const res = await apiRequest("post", "study/replicate", {
        apiToken: apiToken,
        studyID: studyId,
        studyName: studyName,
      });
      if (!res) {
        return null;
      }
      return res.response;
    },
    onSuccess: async (data) => {
      if (!data) {
        return;
      }
      window.dispatchEvent(new CustomEvent("copy-study-success"));
      dispatch(setCopyModel(false));
      toast.success("Study copied successfully");
    },
  });
  return { Copy, isPending };
};

export const useActive = () => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const { FilterStudys } = useSelector((state: RootState) => state.study);
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: Active } = useMutation({
    mutationKey: ["activeProject"],
    mutationFn: async (selectedStudies: string) => {
      return await apiRequest("post", "study/activate", {
        apiToken: apiToken,
        study_list: [selectedStudies],
      });
    },
    onMutate: (variables) => {
      const newData = removeStudyFromList(FilterStudys, variables);
      dispatch(setFilterStudys(newData));
    },
    onSuccess: async () => {
      await refreshStudyList();
      toast.success("Project activated successfully");
    },
  });

  return { Active };
};

export const useFieldReport = () => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const {
    mutate: fetchFieldReport,
    data,
  } = useMutation({
    mutationKey: ["fieldReport"],
    mutationFn: async (studyId: string) => {
      const res = await apiRequest("post", "crosstab/freport", {
        apiToken: apiToken,
        studyID: studyId,
      });
      return res.response;
    },
  });

  return { fetchFieldReport, data };
};
