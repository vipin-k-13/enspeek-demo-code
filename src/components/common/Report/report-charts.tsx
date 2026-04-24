import { useState } from "react";
import ReportHeader from "./ReportHeader";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import TableAndCardScreen from "./TableAndCardScreen";
import { setFliterReportData, setTableQList } from "../../../store/FiltersSlice";
import { useLocation } from "react-router";
import { setStudyInfo } from "../../../store/CrosstabStudySlice";

export default function Report() {
  const [showTableView, setShowTableView] = useState(false);
  const { state } = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const { fliterReportData } = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch<AppDispatch>();

  const { data: ViewList } = useSuspenseQuery({
    queryKey: ["viewList", state.studyID],
    queryFn: async () => {
      const res = await apiRequest("post", "report/view/list", {
        apiToken: user.apiToken,
        studyID: state.studyID,
        side_by_side: "0",
      });
      dispatch(setTableQList(res.response[0].groupList.seq));
      dispatch(setFliterReportData(res.response[0].groupList.seq));
      return res.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { data: StudyInfo } = useSuspenseQuery({
    queryKey: ["studyInfo", state.studyID],
    queryFn: async () => {
      const res = await apiRequest("post", "study/info", {
        apiToken: user.apiToken,
        studyID: state.studyID,
      });
      dispatch(
        setStudyInfo({
          studyID: state.studyID,
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

  return (
    <div className="report-page-bg flex h-full min-h-0 flex-col overflow-hidden">
      <ReportHeader
        Title={StudyInfo.studyname}
        Type={StudyInfo.whichquestionnaire}
        showTableView={showTableView}
        setShowTableView={setShowTableView}
      />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-8 pt-3 md:px-4 md:pb-10 md:pt-4">
        <div className="w-full space-y-4">
          {ViewList[0].groupList.seq.map((q: any) => {
            if (!fliterReportData.includes(q)) return null;
            return (
              <TableAndCardScreen
                qid={q}
                key={q}
                showTableView={showTableView}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

