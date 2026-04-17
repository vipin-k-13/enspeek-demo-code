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

  const {}=useRI(studyID)

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
    <div className="bg-white w-full h-full z-50 mb-4 p-4">
      <div
        className={cn(
          "flex items-center mb-2 border-b border-gray-300 pb-2 space-x-2",
          data ? "justify-between" : "justify-between"
        )}
      >
        {!data && (
          <span className="bg-gray-200 flex items-center p-2 text-sm rounded font-semibold">
            {qType}
          </span>
        )}

        {data && <div className="text-xl font-semibold">{data.qLabel}</div>}
        <div className="flex gap-2">
          {data && (
            <span className="bg-gray-200 flex items-center p-2 text-sm rounded font-semibold">
              {data.qType}
            </span>
          )}
          <Button
            className="bg-primary text-white capitalize hover:bg-primary/90"
            onClick={data ? handleUpdate : handleClick}
          >
            {data ? "update" : "submit"}
          </Button>
          <Button
            className="border-red-400 text-red-400 hover:bg-gray-100 capitalize"
            varinat="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>

      <div className="h-[80vh] overflow-y-auto pr-3">
        {!data && (
          <div className="flex gap-4 mb-4 items-center">
            <QuestionsInput
              className="w-1/5"
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
              className="w-3/5"
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
            <div className="w-1/5 flex flex-col">
              <label
                htmlFor="qType"
                className="text-sm font-medium text-gray-400 mb-1"
              >
                Qtype
              </label>
              <select
                id="qType"
                value={qType}
                onChange={(e) => dispatch(setQType(e.target.value))}
                className={cn(
                  "w-full px-3 py-2 border rounded-md focus:outline-none border-gray-300"
                )}
              >
                {qTypeList.filter(item=> item.code !== "stop").map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.show}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        <QuestionsInput
          className="w-full mb-4"
          value={qtext}
          lable="Question text"
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
          className="w-full mb-4"
          value={qtext2}
          lable="Question text 2"
          onChange={(e) => setQtext2(e.target.value)}
          placeholder="Enter your question"
        />
        <div className="mb-4">
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
          <div className="flex gap-6">
            <label className="text-gray-400">Select stop condition</label>
            <select className="text-action border border-amber-300 px-3 py-1 focus:outline-none rounded">
              <option>Terminated</option>
              <option>Completed</option>
            </select>
          </div>
        )}
        {show && (
          <>
            <div className="flex gap-4 items-end mb-4">
              <QuestionsInput
                className="w-1/4"
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
                placeholder="Enter number of options"
                lable="Add Number of Row Options"
              />

              <Button
                className="bg-primary text-white text-sm hover:bg-primary/90"
                size="lg"
                onClick={createOption}
                disabled={isPending}
              >
                Create
              </Button>
              {isSelectableType === "multiple-select" && (
                <>
                  <QuestionsInput
                    className="w-32"
                    type="number"
                    min={1}
                    value={minSelection}
                    onChange={(e) => checkMin(Number(e.target.value))}
                    lable="Min Selection"
                    placeholder="Minimum"
                  />
                  <QuestionsInput
                    className="w-32"
                    type="number"
                    min={1}
                    value={maxSelection}
                    onChange={(e) => checkMax(Number(e.target.value))}
                    lable="Max Selection"
                    placeholder="Maximum"
                  />
                </>
              )}
            </div>

            <div className="space-y-2">
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
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireForm;
