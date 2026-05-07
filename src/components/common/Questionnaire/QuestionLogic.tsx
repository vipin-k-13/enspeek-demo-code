import { useEffect, useState } from "react";
import { FaPlus, FaRotateLeft } from "react-icons/fa6";
import { LuGitBranchPlus, LuTrash2 } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { setLogic, setValidateLogic } from "../../../store/CrosstabSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import { useLocation } from "react-router";
import { useQuesLogicOpts, useQuesLogicVar } from "../Crosstab/CrossTab.Api";
import { setLogicPayload } from "../../../store/QuestionSlice";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { cn } from "../../../utils";
import IconActionButton from "../../ui/IconActionButton";
import Select from "../../ui/Select";
import { Tooltip } from "../../ui/Tooltip";

export interface LogicRow {
  id: string;
  groupId: string;
  variable: string;
  option: string;
  value: string;
  connector?: string;
  type: "main" | "condition" | "simple";
}

interface QuesLogicProp {
  activeTab?: number;
  storeComponent?: string;
  setLogicFunc?: (logic: { pointLogic: string }[]) => void;
  questionID: string | null;
  resetFlag?: boolean;
  isOpen: boolean;
}

export default function QuestionLogic({
  setLogicFunc,
  activeTab,
  storeComponent,
  questionID,
  resetFlag,
  isOpen,
}: QuesLogicProp) {
  const [selectedConditions, setSelectedConditions] = useState<
    Record<string, string>
  >({});

  const handleFirstChange = (groupId: string, value: string) => {
    setSelectedConditions((prev) => ({
      ...prev,
      [groupId]: value,
    }));
  };

  const { optsData, varsData, LogicData } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const { validateLogic } = useSelector((state: RootState) => state.crosstab);

  const [rows, setRows] = useState<LogicRow[]>(
    LogicData[activeTab as number]?.length
      ? LogicData[activeTab as number]
      : [
          {
            id: "1",
            groupId: "1",
            variable: "",
            option: "",
            value: "",
            type: "main",
          },
        ]
  );

  const connectors = ["AND", "OR"];
  const dispatch = useDispatch<AppDispatch>();
  const { state } = useLocation();
  const { logic } = useSelector((state: RootState) => state.crosstab);
  const { quesLogicOptsMutate } = useQuesLogicOpts(state.studyID);
  const {} = useQuesLogicVar(state.studyID, questionID || undefined);


  useEffect(() => {
    if (!Object.keys(LogicData).length) {
      setRows([
        {
          id: "1",
          groupId: "1",
          variable: "",
          option: "",
          value: "",
          type: "main",
        },
      ]);
    }
  }, [LogicData]);

  const generateLogicPayload = (rows: LogicRow[]) => {
    const groups = [...new Set(rows.map((r) => r.groupId))];
    const logic1Payload: Record<string, any> = {};

    groups.forEach((groupId) => {
      const groupRows = rows.filter((r) => r.groupId === groupId);
      const mainRow = groupRows.find((r) => r.type === "main");
      const conditionRows = groupRows.filter((r) => r.type === "condition");

      if (
        !mainRow ||
        !mainRow.variable?.trim() ||
        !mainRow.option?.trim() ||
        !mainRow.value?.trim()
      ) {
        return;
      }

      const QID = mainRow.variable;
      const selectedOption = mainRow.option;
      const param = mainRow.value;

      const logicBlock = {
        _lgic: "IF",
        QID,
        optionID: selectedOption,
        param,
        value: "",
        extend: conditionRows
          .filter((r) => r.variable && r.option && r.value)
          .map((row) => ({
            _lgic: `${row.connector ?? "AND"} IF`,
            QID: row.variable,
            optionID: row.option,
            param: row.value,
            value: "",
          })),
      };

      const logicType = selectedConditions[groupId];

      if (!logicType) return;

      if (!logic1Payload[logicType]) {
        logic1Payload[logicType] = [];
      }

      logic1Payload[logicType].push(logicBlock);
    });

    return {
      logic1: logic1Payload,
    };
  };

  const dispatchLogic = (updatedRows: LogicRow[]) => {
    const validRows = updatedRows.filter(
      (r) => r.variable && r.option && r.value
    );

    if (
      updatedRows.some(
        (val: any) =>
          val.variable.trim() !== "" ||
          val.option.trim() !== "" ||
          val.value.trim() !== ""
      )
    ) {
      dispatch(
        setValidateLogic({
          ...validateLogic,
          [activeTab as number]: updatedRows,
        })
      );
    } else {
      const newLogic = { ...validateLogic };
      delete newLogic[activeTab as number];
      dispatch(setValidateLogic(newLogic));
    }

    const logicArray = validRows.map((row) => ({
      pointLogic: `${
        row.option.includes("_") ? row.option : row.variable.toUpperCase()
      }${row.value}`,
    }));

    dispatch(setLogic({ ...logic, [storeComponent as string]: logicArray }));
    setLogicFunc && setLogicFunc(logicArray);
    const payload = generateLogicPayload(updatedRows);
    dispatch(setLogicPayload({ logic1: payload.logic1 }));
  };

  const handleVariableChange = (rowId: string, value: string) => {
    const updatedRows = rows.map((row) =>
      row.id === rowId
        ? { ...row, variable: value, option: "", value: "" }
        : row
    );
    setRows(updatedRows);
    dispatchLogic(updatedRows);
    quesLogicOptsMutate(value);
  };

  const handleOptionChange = (rowId: string, value: string) => {
    const updatedRows = rows.map((row) =>
      row.id === rowId ? { ...row, option: value } : row
    );
    setRows(updatedRows);
    dispatchLogic(updatedRows);
  };

  const handleValueChange = (rowId: string, value: string) => {
    const updatedRows = rows.map((row) =>
      row.id === rowId ? { ...row, value: value } : row
    );
    setRows(updatedRows);
    dispatchLogic(updatedRows);
  };

  const handleConnectorChange = (rowId: string, value: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, connector: value } : row))
    );
  };

  const addNewLogicGroup = () => {
    const newGroupId = Date.now().toString();
    const newRow: LogicRow = {
      id: crypto.randomUUID(),
      groupId: newGroupId,
      variable: "",
      option: "",
      value: "",
      type: "main",
    };
    setRows((prev) => [...prev, newRow]);
  };

  const addConditionRow = (groupId: string) => {
    const newRow: LogicRow = {
      id: crypto.randomUUID(),
      groupId,
      variable: "",
      option: "",
      value: "",
      connector: "AND",
      type: "condition",
    };
    setRows((prev) => [...prev, newRow]);
  };

  const resetRow = (rowId: string) => {
    const updatedRow = rows.map((row) =>
      row.id === rowId
        ? {
            ...row,
            variable: "",
            option: "",
            value: "",
            connector: row.type === "condition" ? "AND" : row.connector,
          }
        : row
    );
    setRows(updatedRow);
    dispatchLogic(updatedRow);
  };

  const deleteRow = (rowId: string) => {
    const updatedRow = rows.filter((row) => row.id !== rowId);
    setRows(updatedRow);
    dispatchLogic(updatedRow);
  };

  const resetAllGroupRows = (groupId: string) => {
    const updatedRows = rows
      .map((row) =>
        row.groupId === groupId && row.type === "main"
          ? { ...row, variable: "", option: "", value: "" }
          : row
      )
      .filter((row) => row.groupId !== groupId || row.type === "main");

    setRows(updatedRows);

    setSelectedConditions((prev) => {
      const updated = { ...prev };
      delete updated[groupId];
      return updated;
    });

    dispatchLogic(updatedRows);
  };

  const deleteGroup = (groupId: string) => {
    const updated = rows.filter((r) => r.groupId !== groupId);
    setRows(updated);
  };
  const location = useLocation();
  const studyID = location.state?.studyID;
  const user = useSelector((state: RootState) => state.user);

  const { data } = useQuery({
    queryKey: ["getQuesLogic", questionID],
    queryFn: async () => {
      const res = await apiRequest("post", `questionnaire/get/${questionID}`, {
        apiToken: user.apiToken,
        studyID,
      });
      return res.response;
    },
    enabled: !!questionID && !!studyID && !!user.apiToken,
    refetchOnWindowFocus: false,
    retry: 1,
  });

 useEffect(() => {
  if (!data || !isOpen) return;

  const transformedRows: LogicRow[] = [];
  const selectedConditionMap: Record<string, string> = {};
  let groupCounter = 1;
  const uniqueVariables: string[] = [];

  Object.entries(data).forEach(([logicType, entries]: [string, any]) => {
    if (!Array.isArray(entries)) return;

    entries.forEach((entry: any) => {
      const groupId = `group-${groupCounter++}`;
      const mainId = crypto.randomUUID();

      if (entry.QID) uniqueVariables.push(entry.QID);

      transformedRows.push({
        id: mainId,
        groupId,
        variable: (entry.QID || "").toLowerCase(),
        option: entry.optionID || "",
        value: String(entry.param || "").trim(),
        type: "main",
      });

      selectedConditionMap[groupId] = logicType;

      if (Array.isArray(entry.extend)) {
        entry.extend.forEach((ext: any) => {
          if (ext.QID) uniqueVariables.push(ext.QID);

          transformedRows.push({
            id: crypto.randomUUID(),
            groupId,
            variable: (ext.QID || "").toLowerCase(),
            option: ext.optionID || "",
            value: String(ext.param || "").trim(),
            connector: ext._lgic?.split(" ")[0] || "AND",
            type: "condition",
          });
        });
      }
    });
  });
  if (transformedRows.length === 0) {
    setRows([
      {
        id: "1",
        groupId: "1",
        variable: "",
        option: "",
        value: "",
        type: "main",
      },
    ]);
    setSelectedConditions({});
    return;
  }
  setRows([]);
  setSelectedConditions({});
  setTimeout(() => {
    setRows([...transformedRows]);
    setSelectedConditions({ ...selectedConditionMap });
  }, 0);

  const uniqueVarSet = [...new Set(uniqueVariables)];
  uniqueVarSet.forEach((variable) => {
    if (variable.trim()) {
      quesLogicOptsMutate(variable);
    }
  });
}, [data, isOpen]);

  useEffect(() => {
    if (resetFlag === undefined) return;

    const resetRows = [
      {
        id: "1",
        groupId: "1",
        variable: "",
        option: "",
        value: "",
        type: "main" as const,
      },
    ];

    setRows(resetRows);
    setSelectedConditions({});
    dispatch(
      setValidateLogic({
        ...validateLogic,
        [activeTab as number]: resetRows,
      })
    );

    dispatch(setLogic({ ...logic, [storeComponent as string]: [] }));
    dispatch(setLogicPayload({ logic1: {} }));
  }, [resetFlag]);

  useEffect(() => {
    if (!rows || rows.length === 0) return;

    const hasValidMainRow = rows.some(
      (row) =>
        row.type === "main" &&
        row.variable?.trim() &&
        row.option?.trim() &&
        row.value?.trim()
    );

    if (hasValidMainRow) {
      dispatchLogic(rows);
    }
  }, [rows]);

  const uniqueGroupIds = [...new Set(rows.map((r) => r.groupId))];
  const lastGroupId = uniqueGroupIds[uniqueGroupIds.length - 1];

  return (
    <div>
      {uniqueGroupIds.map((groupId, index) => {
        const groupRows = rows.filter((r) => r.groupId === groupId);
        const mainRow = groupRows.find((r) => r.type === "main");
        const conditionRows = groupRows.filter((r) => r.type === "condition");

        return (
          <div
            key={groupId}
            className="questionnaire-card questionnaire-border mb-4 w-full rounded-[22px] border px-4 py-4 shadow-sm"
          >
            {mainRow && (
              <div
                className={cn(
                  "flex flex-wrap items-center gap-3",
                  conditionRows.length > 0 && "mb-4"
                )}
              >
                <Select
                  variant="questionnaire"
                  name="condition"
                  className="min-w-[220px]"
                  value={selectedConditions[groupId] || ""}
                  onChange={(e) => handleFirstChange(groupId, e.target.value)}
                >
                  <option value="">Select condition</option>
                  {varsData?.condition?.length > 0 &&
                    varsData.condition.map((cond: any, index: number) => (
                      <option key={index} value={cond.code}>
                        {cond.show}
                      </option>
                    ))}
                </Select>

                {selectedConditions[groupId] && (
                  <Select
                    variant="questionnaire"
                    value={mainRow.variable || ""}
                    onChange={(e) =>
                      handleVariableChange(mainRow.id, e.target.value)
                    }
                    className="min-w-[220px]"
                  >
                    <option value="">Select variables</option>
                    {varsData?.variables?.survey?.length > 0 && (
                      <optgroup label="survey">
                        {varsData.variables.survey.map(
                          (item: any, index: number) => (
                            <option
                              key={`${item.param}-${index}`}
                              value={item.param.toLowerCase()}
                            >
                              {item.show}
                            </option>
                          )
                        )}
                      </optgroup>
                    )}
                  </Select>
                )}
                {mainRow.variable &&
                  optsData[mainRow.variable] &&
                  optsData[mainRow.variable].length > 0 && (
                    <Select
                      variant="questionnaire"
                      value={mainRow.option || ""}
                      onChange={(e) =>
                        handleOptionChange(mainRow.id, e.target.value)
                      }
                      className="min-w-[200px]"
                    >
                      <option value="">Select option</option>
                      {optsData[mainRow.variable].map(
                        (opt: any, index: number) => (
                          <option key={index} value={opt.mark}>
                            {opt.show}
                          </option>
                        )
                      )}
                    </Select>
                  )}

                {mainRow.option !== "" && (
                  <Select
                    variant="questionnaire"
                    value={String(mainRow.value) || ""}
                    onChange={(e) =>
                      handleValueChange(mainRow.id, e.target.value)
                    }
                    className="min-w-[200px]"
                  >
                    <option value="">Select value</option>
                    {optsData[mainRow.variable]
                      ?.find(
                        (opt: any) =>
                          String(opt.mark).toLowerCase() ===
                          String(mainRow.option).toLowerCase()
                      )
                      ?.options?.map((opt: any, index: number) => (
                        <option key={index} value={String(opt.code)}>
                          {opt.show}
                        </option>
                      ))}
                  </Select>
                )}

                <div className="flex items-center gap-2">
                  {selectedConditions[groupId] && (
                    <Tooltip content="Add condition" position="top">
                      <IconActionButton
                        tone="primary"
                        onClick={() => addConditionRow(groupId)}
                      >
                        <LuGitBranchPlus className="h-4 w-4" />
                      </IconActionButton>
                    </Tooltip>
                  )}
                  <Tooltip content="Reset group" position="top">
                    <IconActionButton
                      tone="neutral"
                      onClick={() => resetAllGroupRows(groupId)}
                    >
                      <FaRotateLeft />
                    </IconActionButton>
                  </Tooltip>

                  {groupId === lastGroupId && (
                    <IconActionButton
                      tone="primary"
                      onClick={addNewLogicGroup}
                    >
                      <FaPlus />
                    </IconActionButton>
                  )}

                  {index > 0 && (
                    <Tooltip content="Delete group" position="top">
                      <IconActionButton
                        tone="danger"
                        onClick={() => deleteGroup(groupId)}
                      >
                        <LuTrash2 className="h-4 w-4" />
                      </IconActionButton>
                    </Tooltip>
                  )}
                </div>
              </div>
            )}

            {conditionRows.map((row, rowIndex) => (
              <div
                key={row.id}
                className={cn(
                  "flex flex-wrap items-center gap-3",
                  rowIndex !== conditionRows.length - 1 && "mb-4"
                )}
              >
                <Tooltip content="AND/OR condition" position="top">
                  <Select
                    variant="questionnaire"
                    value={row.connector || "AND"}
                    onChange={(e) =>
                      handleConnectorChange(row.id, e.target.value)
                    }
                    className="min-w-[140px]"
                  >
                    {connectors.map((connector) => (
                      <option key={connector} value={connector}>
                        {connector}
                      </option>
                    ))}
                  </Select>
                </Tooltip>

                <Select
                  variant="questionnaire"
                  value={row.variable || ""}
                  onChange={(e) => handleVariableChange(row.id, e.target.value)}
                  className="min-w-[220px]"
                >
                  <option value="">Select variables</option>
                  {varsData?.variables?.survey?.length > 0 && (
                    <optgroup label="survey">
                      {varsData.variables.survey.map(
                        (item: any, index: number) => (
                          <option
                            key={`${item.param}-${index}`}
                            value={item.param.toLowerCase()}
                          >
                            {item.show}
                          </option>
                        )
                      )}
                    </optgroup>
                  )}
                </Select>

                {row.variable &&
                  optsData[row.variable] &&
                  optsData[row.variable].length > 0 && (
                    <Select
                      variant="questionnaire"
                      value={row.option || ""}
                      onChange={(e) =>
                        handleOptionChange(row.id, e.target.value)
                      }
                      className="min-w-[200px]"
                    >
                      <option value="">Select option</option>
                      {optsData[row.variable].map((opt: any, index: number) => (
                        <option key={index} value={opt.mark}>
                          {opt.show}
                        </option>
                      ))}
                    </Select>
                  )}

                {row.option !== "" && (
                  <Select
                    variant="questionnaire"
                    value={String(row.value) || ""}
                    onChange={(e) => handleValueChange(row.id, e.target.value)}
                    className="min-w-[200px]"
                  >
                    <option value="">Select value</option>
                    {optsData[row.variable]
                      ?.find(
                        (opt: any) =>
                          String(opt.mark).toLowerCase() ===
                          String(row.option).toLowerCase()
                      )
                      ?.options?.map((opt: any, index: number) => (
                        <option key={index} value={String(opt.code)}>
                          {opt.show}
                        </option>
                      ))}
                  </Select>
                )}

                <div className="flex items-center gap-2">
                  <Tooltip content="Reset row" position="top">
                    <IconActionButton
                      tone="neutral"
                      onClick={() => resetRow(row.id)}
                    >
                      <FaRotateLeft />
                    </IconActionButton>
                  </Tooltip>
                  <Tooltip content="Delete row" position="top">
                    <IconActionButton
                      tone="danger"
                      onClick={() => deleteRow(row.id)}
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </IconActionButton>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
