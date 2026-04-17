import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { toast } from "sonner";
import { queryClient } from "../../../App";
import { setFilterStudys } from "../../../store/CrosstabStudySlice";
import { setCopyModel, setDeleteModel } from "../../../store/TriggerSlice";

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
      const newData = FilterStudys.filter((prev) => prev.studyID !== variables);
      dispatch(setFilterStudys(newData));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyList"] });
      toast.success("Study archived successfully");
    },
  });

  return { Archived };
};

export const useDelete = () => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const { FilterStudys } = useSelector((state: RootState) => state.study);
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: Delete } = useMutation({
    mutationKey: ["studyDelete"],
    mutationFn: async (selectedStudies: string) => {
      return await apiRequest("post", "study/delete", {
        apiToken: apiToken,
        study_list: [selectedStudies],
      });
    },
    onMutate(variables) {
      const newData = FilterStudys.filter((prev) => prev.studyID !== variables);
      dispatch(setFilterStudys(newData));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyList"] });
      dispatch(setDeleteModel(false));
      toast.success("Study deleted successfully");
    },
  });

  return { Delete };
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
      const data = await res.response;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyList"] });
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
      const newData = FilterStudys.filter((prev) => prev.studyID !== variables);
      dispatch(setFilterStudys(newData));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyList"] });
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
