import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { apiRequest } from "../../services/apiService";
import queryStructure from "../query-template";
import url from "../url";
import reportKeys from "./keys";
import { setStudyInfo } from "../../store/CrosstabStudySlice";
import { setFilterList, setFliterReportData, setReportFilterList, setTableQList } from "../../store/FiltersSlice";
import { ChartResponseReFactor, getTableDataFromSurvey } from "../../utils";

const mapFilterList = (filterListResponse: any) => (filterListResponse?.seq ?? []).map((seq: string) => {
  const value = filterListResponse[seq];
  const { rowOptionList, ...rest } = value;
  return { id: seq, ...rest };
});

const mapReportFilterList = (reportFilterResponse: any) => (reportFilterResponse?.seq ?? []).filter((seq: string) => {
  const value = reportFilterResponse[seq];
  return value && Object.keys(value).length > 0;
}).map((seq: string) => {
  const value = reportFilterResponse[seq];
  return { id: seq, ...value };
});

export const useReportStudyInfo = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const studyInfoQuery = queryStructure({
    queryKey: reportKeys.studyInfo(studyID),
    queryFn: async () => {
      const res = await apiRequest(url.studyInfo.method, url.studyInfo.endpoint, {
        apiToken,
        studyID,
      });

      dispatch(
        setStudyInfo({
          studyID: studyID ?? null,
          hasQuestionnaire: res.response.hasquestionnaire,
          launch: res.response.launch,
          name: res.response.studyname,
          output: res.response.output,
          link: res.response.link,
          closed: res.response.closed,
        })
      );

      return res.response;
    },
    enable: !!apiToken && !!studyID,
  });

  return {
    reportStudyInfo: studyInfoQuery.data,
    isReportStudyInfoLoading: studyInfoQuery.isLoading,
    refetchReportStudyInfo: studyInfoQuery.refetch,
  };
};

export const useReportViewList = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const reportViewListQuery = queryStructure({
    queryKey: reportKeys.viewList(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportViewList.method,
        url.reportViewList.endpoint,
        {
          apiToken,
          studyID,
          side_by_side: "0",
        }
      );

      const sequence = res.response?.[0]?.groupList?.seq ?? [];
      dispatch(setTableQList(sequence));
      dispatch(setFliterReportData(sequence));

      return res.response;
    },
    enable: !!apiToken && !!studyID,
  });

  return {
    reportViewList: reportViewListQuery.data,
    isReportViewListLoading: reportViewListQuery.isLoading,
    isReportViewListRefetching: reportViewListQuery.isRefetching,
    refetchReportViewList: reportViewListQuery.refetch,
  };
};

export const useReportViewById = (
  studyID?: string,
  qID?: string,
  selected?: string,
  sideBySide?: string
) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const reportViewByIdQuery = queryStructure({
    queryKey: reportKeys.viewById(studyID, qID, selected, sideBySide),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportViewById.method,
        url.reportViewById.endpoint.replace(":qId", qID as string),
        {
          apiToken,
          studyID,
          filter_data: {},
          side_by_side: sideBySide,
          subgroupID: sideBySide === "0" ? "" : selected,
        }
      );

      return {
        tableData: getTableDataFromSurvey(res.response),
        chartData: ChartResponseReFactor(res.response),
      };
    },
    enable: !!apiToken && !!studyID && !!qID,
  });

  return {
    reportViewByIdData: reportViewByIdQuery.data,
    isReportViewByIdLoading: reportViewByIdQuery.isLoading,
    isReportViewByIdError: reportViewByIdQuery.isError,
  };
};

export const useReportProcessList = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const processListQuery = queryStructure({
    queryKey: reportKeys.processList(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportProcessList.method,
        url.reportProcessList.endpoint,
        {
          apiToken,
          studyID,
        }
      );

      return res.response;
    },
    enable: !!apiToken && !!studyID,
  });

  return {
    reportProcessList: processListQuery.data,
    isReportProcessListLoading: processListQuery.isLoading,
    isReportProcessListError: processListQuery.isError,
  };
};

export const useReportSideBySideVariables = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const sideBySideQuery = queryStructure({
    queryKey: reportKeys.sideBySideVariables(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportSideBySideVariables.method,
        url.reportSideBySideVariables.endpoint,
        {
          apiToken,
          studyID,
        }
      );
      return res.response;
    },
    enable: !!apiToken && !!studyID,
  });

  return {
    sideBySideVariables: sideBySideQuery.data ?? [],
    isSideBySideVariablesLoading: sideBySideQuery.isLoading,
  };
};

export const useReportAppliedFilter = (studyID?: string, refreshKey?: unknown) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const appliedFilterQuery = queryStructure({
    queryKey: reportKeys.appliedFilter(studyID, refreshKey),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportAppliedFilter.method,
        url.reportAppliedFilter.endpoint,
        {
          apiToken,
          filter_data: {},
          studyID,
        }
      );

      return res.response;
    },
    enable: !!apiToken && !!studyID,
    retry: 0,
  });

  return {
    appliedFilterData: appliedFilterQuery.data,
    isAppliedFilterLoading: appliedFilterQuery.isLoading,
  };
};

export const useReportFiltersList = (studyID?: string, refreshKey?: unknown) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const reportFiltersListQuery = queryStructure({
    queryKey: reportKeys.filtersList(studyID, refreshKey),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportFiltersList.method,
        url.reportFiltersList.endpoint,
        {
          studyID,
          apiToken,
          side_by_side: 0,
        }
      );

      dispatch(setFilterList(mapFilterList(res.response)));
      return res.response;
    },
    enable: !!apiToken && !!studyID,
    retry: 0,
  });

  return {
    reportFiltersList: reportFiltersListQuery.data,
    isReportFiltersListLoading: reportFiltersListQuery.isLoading,
  };
};

export const useReportFilters = (studyID?: string, refreshKey?: unknown) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const reportFiltersQuery = queryStructure({
    queryKey: reportKeys.filters(studyID, refreshKey),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportFilters.method,
        url.reportFilters.endpoint,
        {
          apiToken,
          side_by_side: 0,
          studyID,
          filter_data: {},
          subgroupID: "Cell",
        }
      );

      dispatch(setReportFilterList(mapReportFilterList(res.response)));
      return res.response;
    },
    enable: !!apiToken && !!studyID,
    retry: 0,
  });

  return {
    reportFilters: reportFiltersQuery.data,
    isReportFiltersLoading: reportFiltersQuery.isLoading,
  };
};
