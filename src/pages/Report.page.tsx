import { useEffect } from "react";
import Report from "../components/common/Report/report-charts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../services/apiService";
import { setFilterList, setReportFilterList } from "../store/FiltersSlice";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../components/global/Error";
import { useLocation } from "react-router";

const Report_page = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const trigger = useSelector((state: RootState) => state.trigger);
  const { state } = useLocation();

  const {} = useQuery({
    queryKey: ["appliedFilter", trigger],
    queryFn: async () => {
      const res = await apiRequest("post", "report/appliedfilter", {
        apiToken: user.apiToken,
        filter_data: {},
        studyID: state.studyID,
      });

      return res.response;
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const { data: FiterList, isLoading } = useQuery({
    queryKey: ["filterList", trigger],
    queryFn: async () => {
      const res = await apiRequest("post", "report/filters/list", {
        studyID: state.studyID,
        apiToken: user.apiToken,
        side_by_side: 0,
      });

      return res.response;
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const { data: ReportFilter, isLoading: isReportFilterLoading } = useQuery({
    queryKey: ["reportFilter", trigger],
    queryFn: async () => {
      const res = await apiRequest("post", "report/filters", {
        apiToken: user.apiToken,
        side_by_side: 0,
        studyID: state.studyID,
        filter_data: {},
        subgroupID: "Cell",
      });
      return res.response;
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (FiterList && !isLoading) {
      const filterList = FiterList["seq"].map((seq: string) => {
        const value = FiterList[seq];
        const { rowOptionList, ...rest } = value;
        return { id: seq, ...rest };
      });
      dispatch(setFilterList(filterList));
    }
    if (ReportFilter && !isReportFilterLoading) {
      const list = (ReportFilter as ReportFilterType).seq
        .filter((seq: string) => {
          const value = ReportFilter[seq];
          return value && Object.keys(value).length > 0;
        })
        .map((seq: string) => {
          const value = ReportFilter[seq];
          return { id: seq, ...value };
        });
      dispatch(setReportFilterList(list));
    }
  }, [FiterList, isLoading, dispatch]);

  return (
    <ErrorBoundary fallbackRender={() => <Error showHome />}>
        <Report />
    </ErrorBoundary>
  );
};

export default Report_page;