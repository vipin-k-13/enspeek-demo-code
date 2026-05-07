import { useState, type ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { setSubmitItems } from "../../../store/QuestionSlice";
import { TbRefresh } from "react-icons/tb";
import { LuBan, LuChevronDown } from "react-icons/lu";
import Button from "../../ui/Button";
import { Tooltip } from "../../ui/Tooltip";
import IconActionButton from "../../ui/IconActionButton";
import Select from "../../ui/Select";

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
          <div className="flex flex-wrap items-center gap-3">
             {(row.value || row.terminate) && (
              <Tooltip content="Reset logic" position="top">
                <IconActionButton
                  type="button"
                  tone="neutral"
                  onClick={() => handleReset(idx)}
                >
                  <TbRefresh className="h-4 w-4" />
                </IconActionButton>
              </Tooltip>
            )}
            <Tooltip
              content={
                row.terminate ? "Remove termination" : "Apply termination"
              }
              position="top"
            >
              <Button
                type="button"
                varinat={row.terminate ? "danger" : "outline"}
                size="sm"
                onClick={() => toggleTerminate(idx)}
                disabled={!!row.value}
                className={row.terminate ? "questionnaire-logic-chip-danger" : "questionnaire-logic-chip-muted"}
              >
                <LuBan className="h-4 w-4" />
                <span>{row.terminate ? "Termination Applied" : "Apply Termination"}</span>
              </Button>
            </Tooltip>

            <Tooltip
              content={row.value?.trim() ? "Update skip logic" : "Apply skip logic"}
              position="top"
            >
              <div className="relative min-w-[144px]">
                <Select
                  variant="questionnaire"
                  className={`w-full rounded-full py-2 pl-3 pr-9 text-sm font-semibold ${
                    row.value?.trim() ? "questionnaire-logic-select-active" : ""
                  } ${row.terminate ? "opacity-50 cursor-not-allowed" : ""}`}
                  value={row.value}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleLogicChange(idx, e.target.value)
                  }
                  disabled={row.terminate}
                >
                  <option value="">Skip to</option>
                  {questionList?.map((opt) => (
                    <option key={opt.qID} value={opt.qID}>
                      SKIP TO {opt.qID}
                    </option>
                  ))}
                </Select>
                <LuChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 questionnaire-muted" />
              </div>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
}
