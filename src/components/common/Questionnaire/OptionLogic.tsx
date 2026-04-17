import { useState, type ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { setSubmitItems } from "../../../store/QuestionSlice";
import { TbRefresh } from "react-icons/tb";
import { GiCancel } from "react-icons/gi";

type RowLogic = {
  row: string;
  value: string;
  terminate: boolean;
};

interface OptionLogicProps {
  qID: string;
  rowIndex: string;
  optionText: string;
}

const INITIAL_LOGIC: RowLogic[] = [
  { row: "row1", value: "", terminate: false },
];

export default function OptionLogic({
  qID,
  rowIndex,
  optionText,
}: OptionLogicProps) {
  const [logic, setLogic] = useState<RowLogic[]>(INITIAL_LOGIC);
  const submitItems = useSelector(
    (state: RootState) => state.question.submitItems
  );
  const questionList = useSelector((state: RootState) => state.question.qList);
  const location = useLocation();
  const studyID = location.state?.studyID;
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: submit } = useMutation({
    mutationKey: ["questions", studyID],
    mutationFn: async (CQID: string) => {
      const res = await apiRequest("post", `questionnaire/view/${CQID}`, {
        apiToken: user.apiToken,
        studyID,
      });
      return res.response;
    },
    onSuccess: (data: Question) => {
      dispatch(setSubmitItems(data));
    },
  });

  
  const { mutate } = useMutation({
    mutationKey: ["questions", studyID],
    mutationFn: async ({
      terminate,
      skipTo,
      isReset,
      isRemoveTerminate,
      isRemoveSkip,
    }: {
      terminate: boolean;
      skipTo: string;
      isReset?: boolean;
      isRemoveTerminate?: boolean;
      isRemoveSkip?: boolean;
    }) => {
      const option_id = rowIndex;
      const res = await apiRequest(
        "post",
        `questionnaire/edit/logic/${option_id}`,
        {
          apiToken: user.apiToken,
          studyID,
          option_terminate: terminate ? 1 : 0,
          option_skip: terminate ? "" : skipTo,
        }
      );
      return {
        response: res.response,
        terminate,
        skipTo,
        isReset,
        isRemoveTerminate,
        isRemoveSkip,
      };
    },
    onSuccess: ({ terminate, isReset, isRemoveTerminate, isRemoveSkip }) => {
      if (isReset) {
        toast.success(`Logic reset successfully for → ${qID} ${optionText}`);
      } else if (isRemoveTerminate) {
        toast.success(
          `Remove terminate successfully for → ${qID} ${optionText}`
        );
      } else if (isRemoveSkip) {
        toast.success(
          `Remove skip logic successfully for → ${qID} ${optionText}`
        );
      } else {
        const logicType = terminate ? "Terminate" : "Skip logic";
        toast.success(`${logicType} applied in → ${qID} ${optionText}`);
      }
      submit(qID);
    },
  });

  const handleLogicChange = (idx: number, value: string) => {
    const wasSkipApplied = !!logic[idx].value?.trim();
    const isRemoving = wasSkipApplied && value === "";

    setLogic((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, value, terminate: false } : r))
    );

    mutate({
      terminate: false,
      skipTo: value,
      isRemoveSkip: isRemoving,
    });
  };

  const toggleTerminate = (idx: number) => {
    const isRemoving = logic[idx].terminate;
    setLogic((prev) =>
      prev.map((r, i) =>
        i === idx ? { ...r, terminate: !r.terminate, value: "" } : r
      )
    );
    mutate({
      terminate: !logic[idx].terminate,
      skipTo: "",
      isRemoveTerminate: isRemoving,
    });
  };

  const handleReset = (idx: number) => {
    setLogic((prev) =>
      prev.map((r, i) =>
        i === idx ? { ...r, value: "", terminate: false } : r
      )
    );
    mutate({ terminate: false, skipTo: "", isReset: true });
  };

  useEffect(() => {
    const question = submitItems.find((q) => q.qID === qID);
    if (question && question.rowOptionList) {
      const row = question.rowOptionList.find((q) => q.optionID === rowIndex);
      if (row) {
        setLogic((prev) => {
          const apiValue = row.skip_to ?? "";
          const apiTerminate = row.terminate === 1;

          if (
            prev[0]?.value !== apiValue ||
            prev[0]?.terminate !== apiTerminate
          ) {
            return [
              {
                row: `row${rowIndex + 1}`,
                value: apiValue,
                terminate: apiTerminate,
              },
            ];
          }
          return prev;
        });
      }
    }
  }, [submitItems, qID, rowIndex]);

  return (
    <div>
      {logic.map((row, idx) => (
        <div key={row.row} className="flex items-center">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => toggleTerminate(idx)}
              title={
                row.value
                  ? ""
                  : row.terminate
                  ? "Click to remove terminate"
                  : "Click to apply terminate"
              }
              disabled={!!row.value}
              className={`text-lg focus:outline-none ${
                row.value ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${row.terminate ? "text-red-500" : "text-blue-300"}`}
            >
              <GiCancel />
            </button>

            <select
              className={`focus:outline-none border border-gray-400 px-2 py-0.5 rounded 
                ${row.value?.trim() ? "bg-action text-white" : "bg-white"} 
                ${row.terminate ? "opacity-50 cursor-not-allowed" : ""}`}
              title={
                row.terminate
                  ? ""
                  : row.value?.trim()
                  ? "Click to remove or apply skip logic"
                  : "Click to apply skip logic"
              }
              value={row.value}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleLogicChange(idx, e.target.value)
              }
              disabled={row.terminate}
            >
              <option value="">skip to</option>
              {questionList?.map((opt) => (
                <option key={opt.qID} value={opt.qID}>
                  SKIP TO {opt.qID}
                </option>
              ))}
            </select>

            {(row.value || row.terminate) && (
              <button
                onClick={() => handleReset(idx)}
                title="Click to reset applied logic"
                className="text-gray-400 hover:text-red-500 text-lg focus:outline-none cursor-pointer"
              >
                <TbRefresh />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
