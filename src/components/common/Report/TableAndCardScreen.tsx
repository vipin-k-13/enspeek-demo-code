import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { type FC } from "react";
import TableForm from "./TableForm";
import QuestionCard from "./QuestionCard";
import SingleSelectChart from "./Charts";
import { useLocation } from "react-router";
import { useReportViewById } from "../../../api-network/report/query";

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
  const { state } = useLocation();
  const {
    reportViewByIdData,
    isReportViewByIdLoading,
    isReportViewByIdError,
  } = useReportViewById(state.studyID, qid, selected, side_by_side);

  const tableData = reportViewByIdData?.tableData;
  const chartData = reportViewByIdData?.chartData;

  if (isReportViewByIdLoading) {
    return (
      <QuestionCard title="" qId={qid}>
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-action animate-spin rounded-full" />
        </div>
      </QuestionCard>
    );
  }

  if (isReportViewByIdError || !chartData || !tableData) return null;

  if (chartData.external) {
    return (
      <QuestionCard title={chartData.title} qId={qid}>
        <img
          src={chartData.Image}
          alt=""
          className="mx-auto max-h-[300px]"
        />
      </QuestionCard>
    );
  }

  if (showTableView) {
    return <TableForm {...tableData} />;
  }

  return (
    <QuestionCard title={chartData.title} qId={qid}>
      <SingleSelectChart
        categories={chartData.categories}
        questionId={qid}
        hasData={chartData.chartData?.length > 0}
        chartData={chartData.chartData}
        baseText={chartData.baseText}
        questionText={chartData.questionText}
        totalRespondents={chartData.totalRespondents}
      />
    </QuestionCard>
  );
};

export default TableAndCardScreen;
