import { useDispatch, useSelector } from "react-redux";
import { useQList } from "./CrossTab.Api";
import type { AppDispatch, RootState } from "../../../store/store";
import { setSelectedQuestions } from "../../../store/CrosstabSlice";
import { useLocation } from "react-router";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "../../../utils";

export default function QuestionsList() {
  const { state } = useLocation();
  const { QListData, isQListDataPending } = useQList(
    state.studyID,
    state.BannerID
  );
  const { selectedQuestions } = useSelector(
    (state: RootState) => state.crosstab
  );
  const dispatch = useDispatch<AppDispatch>();
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      dispatch(setSelectedQuestions(QListData.map((q: any) => q.qID)));
    } else {
      dispatch(setSelectedQuestions([]));
    }
  };

  const toggleSelect = (id: string) => {
    dispatch(
      setSelectedQuestions(
        selectedQuestions.includes(id)
          ? selectedQuestions.filter((i) => i !== id)
          : [...selectedQuestions, id]
      )
    );
  };

  if (isQListDataPending) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <AiOutlineLoading3Quarters
          size={34}
          className={cn("animate-spin text-action")}
        />
      </div>
    );
  }
  const allSelected = selectedQuestions.length === QListData.length;

  return (
    <div>
      <p className="my-2 text-gray-700 font-medium">
        Please add questions to table list
      </p>
      <div className="border border-gray-200 rounded bg-white px-3 py-1 max-h-[70vh] overflow-auto">
        <div className="flex items-center px-4 py-2 font-semibold">
          <div>
            <input
              data-test-id="CHECKBOX"
              type="checkbox"
              checked={allSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
              className="cursor-pointer"
            />
          </div>
          <div className="ml-4">Select All Questions</div>
        </div>

        {QListData.map((question: any, i: number) => (
          <div key={i} className="flex items-center px-4 py-2 bg-gray-50 mb-2">
            <div className="mr-8 ">
              <input
                type="checkbox"
                checked={selectedQuestions.includes(question.qID)}
                onChange={() => toggleSelect(question.qID)}
                className="cursor-pointer"
              />
            </div>
            <div>{question.qLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
