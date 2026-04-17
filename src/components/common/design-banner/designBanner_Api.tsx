import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { queryClient } from "../../../App";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { setBannerPointer } from "../../../store/CrossTabDataSlice";

export const useBannerPointerList = (
  bannerID: string = "HBUipTq7IZOwA",
  studyID: string = "CS_FWypI6XEdjwl9U"
) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: bannerPointerListData,
    isError: isBannerPointerError,
    isFetching: isBannerPointerListPending,
  } = useQuery({
    queryKey: ["bannerPointerList", bannerID],
    queryFn: async () => {
      const res = await apiRequest("post", "crosstab/bannerPoint/list", {
        studyID,
        bannerID,
        apiToken,
      });
      dispatch(
        setBannerPointer(
          Array.isArray(res.response)
            ? res.response
            : [
                {
                  bannerGroup: "",
                  logic: [],
                  pointID: "",
                  seq: 1,
                  statLevel: null,
                  title: "Banner point 1",
                  active: 0,
                  alpha: "",
                },
              ]
        )
      );
      return res.response;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  return {
    bannerPointerListData,
    isBannerPointerListPending,
    isBannerPointerError,
  };
};

export const useAddBannerPointer = (studyID: string = "CS_FWypI6XEdjwl9U") => {
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