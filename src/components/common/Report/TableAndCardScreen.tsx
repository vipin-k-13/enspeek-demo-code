import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { ChartResponseReFactor, getTableDataFromSurvey } from "../../../utils";
import { type FC } from "react";
import TableForm from "./TableForm";
import QuestionCard from "./QuestionCard";
import SingleSelectChart from "./Charts";
import { useLocation } from "react-router";

interface TableAndCardScreenProp {
  qid: string;
  showTableView: boolean;
}

const TableAndCardScreen: FC<TableAndCardScreenProp> = ({
  qid,
  showTableView,
}) => {
  const { selected, side_by_side } = useSelector(
    (state: RootState) => state.filter
  );

  const user = useSelector((state: RootState) => state.user);
  const { state } = useLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ReportView", qid, selected, side_by_side],
    queryFn: async () => {
      const res = await apiRequest("post", `report/view/${qid}`, {
        apiToken: user.apiToken,
        studyID: state.studyID,
        filter_data: {},
        side_by_side,
        subgroupID: side_by_side === "0" ? "" : selected,
      });

      const TableData = getTableDataFromSurvey(res.response);
      const ChartData = ChartResponseReFactor(res.response);
      return { TableData, ChartData };
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isLoading) {
    return (
      <QuestionCard title="" qId={qid}>
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-action animate-spin rounded-full" />
        </div>
      </QuestionCard>
    );
  }

  if (isError || !data?.ChartData || !data?.TableData) return null;

  if (data.ChartData.external) {
    return (
      <QuestionCard title={data.ChartData.title} qId={qid}>
        <img
          src={data.ChartData.Image}
          alt=""
          className="mx-auto max-h-[300px]"
        />
      </QuestionCard>
    );
  }

  if (showTableView) {
    return <TableForm {...data.TableData} />;
  }

  return (
    <QuestionCard title={data.ChartData.title} qId={qid}>
      <SingleSelectChart
        categories={data.ChartData.categories}
        questionId={qid}
        hasData={data.ChartData.chartData?.length > 0}
        chartData={data.ChartData.chartData}
        baseText={data.ChartData.baseText}
        questionText={data.ChartData.questionText}
        totalRespondents={data.ChartData.totalRespondents}
      />
    </QuestionCard>
  );
};

export default TableAndCardScreen;