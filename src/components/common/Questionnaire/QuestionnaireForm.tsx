import React from "react";
import Button from "../../ui/Button";
import QuestionsInput from "./QuestionsInput";
import RowOptions from "./RowOptions";
import { useLocation } from "react-router";
import { createNullQuestionObject } from "../../../utils/payloadBuilder";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { toast } from "sonner";
import { cn } from "../../../utils";
import { setQType } from "../../../store/TriggerSlice";
import { setChatOpen } from "../../../store/ChatSlice";
import { useRI } from "./Api";
import { LuChevronDown, LuGripVertical } from "react-icons/lu";
import { Tooltip } from "../../ui/Tooltip";

interface QuestionnaireForm {
  onSubmit: (e: string) => void;
  onClose: () => void;
  data?: Question | null;
  qType: string;
  studyInfo: any;
}

const QuestionnaireForm: React.FC<QuestionnaireForm> = ({
  onSubmit,
  onClose,
  data,
  qType,
  studyInfo,
}) => {
  const location = useLocation();
  const studyID = location.state?.studyID;
  const [id, setId] = React.useState<string>(data?.qID ? data.qID : "");
  const [maxSelection, setMaxSelection] = React.useState<number>(1);
  const [minSelection, setMinSelection] = React.useState<number>(1);
  const { qTypeList } = useSelector((state: RootState) => state.trigger);
  const dispatch = useDispatch<AppDispatch>();

  const {} = useRI(studyID);

  const [label, setLabel] = React.useState<string>(
    data?.qLabel ? data.qLabel : ""
  );
  const [qtext, setQtext] = React.useState<string>(
    data?.qText ? data.qText : ""
  );
  const [qtext2, setQtext2] = React.useState<string>(
    data?.qText2 ? data.qText2 : ""
  );
  const [qInstruction, setQinstruction] = React.useState<string>(
    data?.qNote3 ? data.qNote3 : ""
  );
  const [optionCount, setOptionCount] = React.useState<number>(0);
  const [options, setOptions] = React.useState<Option[]>(
    data?.rowOptionList ? data.rowOptionList : []
  );
  const user = useSelector((state: RootState) => state.user);
  const isSelectableType = data?.qType ? data?.qType : qType;

  const createOption = () => {
    if (options.length + optionCount > 50) {
      toast.error("You can only add up to 50 options.");
      return;
    }

    setOptions((prev) => {
      const newOptions = [...prev];
      for (let i = 1; i <= optionCount; i++) {
        newOptions.push({
          exclusive: 0,
          optionCode: i,
          optionID: `CQ${id}-r${i + options.length}`,
          optionLogic: "",
          optionNote: "",
          optionText: "",
          optionTextSpanish: "",
          optionType: qType
            ? (qType as "single-select" | "multiple-select")
            : (data?.qType as "single-select" | "multiple-select"),
          other: false,
          skip_to: "",
          terminate: 0
        });
      }
      setMaxSelection(newOptions.length);
      return newOptions;
    });
    setOptionCount(0);
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["questionCreate"],
    mutationFn: async (payload: QuestionPayload) => {
      const res = await apiRequest("post", "questionnaire/add", payload);

      return res.response;
    },
    onSuccess: (_, variables) => {
      onSubmit(variables.newQID);
      onClose();
      toast.success("Question saved successfully");
    },
  });

  const { mutate: QuestionEdit } = useMutation({
    mutationKey: ["questionsEdit"],
    mutationFn: async (data: Question) => {
      const res = await apiRequest("post", `questionnaire/edit`, {
        apiToken: user.apiToken,
        studyID,
        QID: data.qID,
        ...data,
      });
      return res.response;
    },
    onSuccess: (_, variables) => {
      onSubmit(variables.qID);
      onClose();
      toast.success(`${studyInfo.studyName} Question saved successfully`);
    },
  });

  const optionsValueChange = (index: number, value: string) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, optionText: value } : opt))
    );
  };

  const updateSpecify = (index: number, value: boolean) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, other: value } : opt))
    );
  };

  const DeleteRow = (spot: number) => {
    setOptions((prev) => {
      const updated = prev.filter((_, index) => index !== spot);
      setMaxSelection(updated.length);
      return updated;
    });
  };

  const [errors, setErrors] = React.useState({
    id: false,
    label: false,
    qtext: false,
  });
  const [optionErrors, setOptionErrors] = React.useState<boolean[]>([]);
  const handleClick = () => {
    const hasMainError =
      id.trim() === "" || label.trim() === "" || qtext.trim() === "";
    setErrors({
      id: id.trim() === "",
      label: label.trim() === "",
      qtext: qtext.trim() === "",
    });
    if (show) {
      if (options.length < 1) {
        toast.error("At least one option is required.");
        return;
      }

      const emptyTexts = options.map((opt) => opt.optionText.trim() === "");
      const hasEmpty = emptyTexts.includes(true);
      setOptionErrors(emptyTexts);

      if (hasEmpty) {
        toast.error("Option text is required.");
        return;
      }
    }

    if (hasMainError) return;

    const payload = createNullQuestionObject(
      studyID,
      `CQ${id}`,
      qType,
      qtext,
      label,
      qtext2,
      user.apiToken,
      options,
      minSelection,
      maxSelection
    );

    mutate(payload);
    dispatch(setChatOpen(true))
  };

  const checkMin = (e: number) => {
    if (e > maxSelection) {
      setMinSelection(1);
      toast.warning("min is always small than Max value");
    } else {
      setMinSelection(e);
    }
  };

  const checkMax = (e: number) => {
    if (e > options.length) {
      setMaxSelection(options.length);
      toast.warning("max is always small than Options counts");
    } else {
      setMaxSelection(e);
    }
  };

  const handleUpdate = () => {
    if (!data) return;

    const hasMainError = qtext.trim() === "";
    setErrors((prev) => ({
      ...prev,
      qtext: qtext.trim() === "",
    }));

    if (show) {
      if (options.length < 1) {
        toast.error("At least one option is required.");
        return;
      }

      const emptyTexts = options.map((opt) => opt.optionText.trim() === "");
      const hasEmpty = emptyTexts.includes(true);
      setOptionErrors(emptyTexts);

      if (hasEmpty) {
        toast.error("Option text is required for all options.");
        return;
      }
    }

    if (hasMainError) return;

    const updatedQuestion: Question = {
      ...data,
      qText: qtext,
      qText2: qtext2,
      rowOptionList: options,
    };

    dispatch(setChatOpen(true))
    QuestionEdit(updatedQuestion);
  };

  const show =
    isSelectableType !== "open-end-medium" &&
    isSelectableType !== "text-only" &&
    isSelectableType !== "stop";

  return (
    <div className="questionnaire-page-bg z-50 mb-4 w-full p-2 md:p-6">
      <div className="w-full">
      <div className="questionnaire-card questionnaire-card-edit questionnaire-edit-frame overflow-hidden rounded-[26px]">
        <div className="border-b questionnaire-border px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4 lg:flex-nowrap">
            <div className="flex min-w-0 items-center gap-3">
              <span className="questionnaire-muted hidden md:inline-flex">
                <LuGripVertical className="h-5 w-5" />
              </span>
              <span className="question-type-default rounded-full px-4 py-1.5 text-sm font-semibold">
                {data?.qID || `CQ${id || ""}`}
              </span>
              <div className="min-w-0">
                <h2 className="questionnaire-heading truncate text-lg font-semibold md:text-[22px]">
                  {qtext || label || data?.qText || "Question"}
                </h2>
              </div>
            </div>

            <div className="flex w-full flex-wrap items-center justify-end gap-3 lg:w-auto">
              <Button
                className="platform-btn-pill questionnaire-save-btn questionnaire-action-btn px-6 py-2.5 capitalize shadow-none"
                onClick={data ? handleUpdate : handleClick}
              >
                {data ? "Save" : "Submit"}
              </Button>
              <button
                type="button"
                className="questionnaire-label questionnaire-clickable px-1 text-base"
                onClick={onClose}
              >
                Close
              </button>
              <Tooltip content="Collapse" position="top">
                <button
                  type="button"
                  aria-label="Close edit question"
                  className="questionnaire-muted questionnaire-clickable inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-home-panel-soft)]"
                  onClick={onClose}
                >
                  <LuChevronDown className="h-5 w-5" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 pr-2 md:px-6 md:pr-3">
          {!data && (
            <div className="mb-6 grid gap-4 md:grid-cols-[1fr_2fr_1fr]">
              <QuestionsInput
                className="w-full"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  if (errors.id && e.target.value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, id: false }));
                  }
                }}
                min={0}
                placeholder="Enter QID"
                lable="QID"
                require
                error={errors.id}
              />

              <QuestionsInput
                className="w-full"
                lable="Question label"
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value);
                  if (errors.label && e.target.value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, label: false }));
                  }
                }}
                placeholder="Enter question label ..."
                require
                error={errors.label}
              />
              <div className="flex w-full flex-col">
                <label
                  htmlFor="qType"
                  className="questionnaire-label mb-2 text-sm font-medium"
                >
                  Question Type
                </label>
                <select
                  id="qType"
                  value={qType}
                  onChange={(e) => dispatch(setQType(e.target.value))}
                  className={cn(
                    "questionnaire-input questionnaire-heading questionnaire-border w-full rounded-[18px] border px-4 py-3.5 focus:outline-none"
                  )}
                >
                  {qTypeList.filter((item) => item.code !== "stop").map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.show}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <QuestionsInput
            className="mb-5 w-full"
            value={qtext}
            lable="Question Text"
            onChange={(e) => {
              setQtext(e.target.value);
              if (errors.qtext && e.target.value.trim() !== "") {
                setErrors((prev) => ({ ...prev, qtext: false }));
              }
            }}
            placeholder="Enter your question"
            require
            error={errors.qtext}
          />
          <QuestionsInput
            className="mb-5 w-full"
            value={qtext2}
            lable="Question Text 2 (Optional)"
            onChange={(e) => setQtext2(e.target.value)}
            placeholder="Additional context..."
          />
          <div className="mb-5">
            <QuestionsInput
              value={qInstruction}
              onChange={(e) => setQinstruction(e.target.value)}
              lable="Respondent Instruction"
              placeholder={
                isSelectableType === "stop"
                  ? "Stop the survey"
                  : "(Please select one.)"
              }
            />
          </div>
          {isSelectableType === "stop" && (
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <label className="questionnaire-label">Select stop condition</label>
              <select className="questionnaire-input questionnaire-border rounded-[16px] border px-4 py-2 focus:outline-none">
                <option>Terminated</option>
                <option>Completed</option>
              </select>
            </div>
          )}
          {show && (
            <>
              <div className="mb-5 flex flex-wrap items-end gap-3 lg:gap-4">
                <div className="flex flex-wrap items-end gap-3">
                  <span className="questionnaire-label pb-3 text-base font-medium">
                    Add options:
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={optionCount || options.length}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > 50 - options.length) {
                        toast.error(`You can add maximum 50 options.`);
                        setOptionCount(50 - options.length);
                      } else {
                        setOptionCount(val);
                      }
                    }}
                    placeholder="0"
                    className="questionnaire-input questionnaire-heading questionnaire-border h-[46px] w-[82px] rounded-[16px] border px-4 text-center text-base focus:outline-none"
                  />
                  <Button
                  className="platform-btn-pill questionnaire-action-btn bg-login-primary px-6 py-3 text-sm text-white shadow-none hover:bg-login-primary-hover"
                  size="lg"
                  onClick={createOption}
                  disabled={isPending}
                  >
                    Create
                  </Button>
                </div>
                {isSelectableType === "multiple-select" && (
                  <div className="flex flex-wrap items-end gap-3">
                    <QuestionsInput
                      className="w-full md:w-32"
                      type="number"
                      min={1}
                      value={minSelection}
                      onChange={(e) => checkMin(Number(e.target.value))}
                      lable="Min Selection"
                      placeholder="Minimum"
                    />
                    <QuestionsInput
                      className="w-full md:w-32"
                      type="number"
                      min={1}
                      value={maxSelection}
                      onChange={(e) => checkMax(Number(e.target.value))}
                      lable="Max Selection"
                      placeholder="Maximum"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h3 className="questionnaire-label mb-3 text-base font-medium">
                  Answer Options
                </h3>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <RowOptions
                      key={index}
                      optionKey={`${index + 1}`}
                      Value={option.optionText}
                      onChange={(e) => optionsValueChange(index, e)}
                      onDelete={() => DeleteRow(index)}
                      select={option.other}
                      onSelect={(val) => updateSpecify(index, val)}
                      error={optionErrors[index]}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default QuestionnaireForm;
