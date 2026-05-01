import { useEffect, useState } from "react";
import { FaPlus, FaRotateLeft } from "react-icons/fa6";
import { LuTrash2 } from "react-icons/lu";
import { useLogicOpts, useLogicVar } from "../common/Crosstab/CrossTab.Api";
import { useDispatch, useSelector } from "react-redux";
import { setLogic, setValidateLogic } from "../../store/CrosstabSlice";
import type { AppDispatch, RootState } from "../../store/store";
import { setLogicData } from "../../store/CrossTabDataSlice";
import { useLocation } from "react-router";
import { Tooltip } from "../ui/Tooltip";
import IconActionButton from "../ui/IconActionButton";

export interface LogicRow {
  id: string;
  variable: string;
  option: string;
  value: string;
  connector?: string;
  type: "main" | "condition" | "simple";
}

interface BannerLogicProp {
  activeTab?: number;
  storeComponent?: string;
  setLogicFunc?: (logic: { pointLogic: string }[]) => void;
}

export default function BannerLogic({
  setLogicFunc,
  activeTab,
  storeComponent,
}: BannerLogicProp) {
  const { optsData, varsData, LogicData } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const { validateLogic } = useSelector((state: RootState) => state.crosstab);
  const [rows, setRows] = useState<LogicRow[]>(
    LogicData[activeTab as number]
      ? LogicData[activeTab as number]
      : [{ id: "1", variable: "", option: "", value: "", type: "main" }]
  );
  const connectors = ["AND", "OR"];
  const dispatch = useDispatch<AppDispatch>();
  const { pathname, state } = useLocation();
  const { logic } = useSelector((state: RootState) => state.crosstab);

  useEffect(() => {
    if (!Object.keys(LogicData).length) {
      setRows([{ id: "1", variable: "", option: "", value: "", type: "main" }]);
    }
  }, [LogicData]);

  useEffect(() => {
    if (pathname === "/crosstab/edit-banner") {
      dispatch(setLogicData({ [activeTab as number]: rows }));
    }
  }, [rows]);

  const handleVariableChange = (rowId: string, value: string) => {
    const updatedRows = rows.map((row) =>
      row.id === rowId
        ? { ...row, variable: value, option: "", value: "" }
        : row
    );
    setRows(updatedRows);
    dispatchLogic(updatedRows);
    logicOptsMutate(value);
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

  const resetAllValues = () => {
    setRows([{ id: "1", variable: "", option: "", value: "", type: "main" }]);
    dispatchLogic([
      { id: "1", variable: "", option: "", value: "", type: "main" },
    ]);
  };

  const addSimpleRow = () => {
    const newRow: LogicRow = {
      id: (rows.length + 1).toString(),
      variable: "",
      option: "",
      value: "",
      type: "simple",
    };
    setRows((prev) => [...prev, newRow]);
  };

  const deleteRow = (rowId: string) => {
    const updatedRow = rows.filter((row) => row.id !== rowId);
    setRows(updatedRow);
    dispatchLogic(updatedRow);
  };

  const resetRow = (rowId: string) => {
    const updatedRow = rows.map((row) =>
      row.id === rowId ? { ...row, variable: "", option: "", value: "" } : row
    );
    setRows(updatedRow);
    dispatchLogic(updatedRow);
  };

  const {} = useLogicVar(state.studyID);
  const { logicOptsMutate } = useLogicOpts(state.studyID);

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
  };

  return (
    <div>
      {rows.map((row: any) => (
        <div key={row.id} className="mb-4 flex flex-wrap items-center gap-3">
          {row.type === "condition" && (
            <div>
              <select
                value={row.connector || "AND"}
                onChange={(e) => handleConnectorChange(row.id, e.target.value)}
                className="questionnaire-logic-select min-w-[120px] rounded-[16px] px-4 py-3 focus:outline-none"
              >
                {connectors.map((connector) => (
                  <option key={connector} value={connector}>
                    {connector}
                  </option>
                ))}
              </select>
            </div>
          )}
          <select
            value={row.variable || ""}
            data-test-id={`TAB_SELECTED_1`}
            onChange={(e) => handleVariableChange(row.id, e.target.value)}
            className="questionnaire-logic-select min-w-[220px] rounded-[16px] px-4 py-3 focus:outline-none"
          >
            <option value="">Select variables</option>
            {/* {varsData?.variables?.access?.length > 0 && (
              <optgroup label="access">
                {varsData.variables.access.map((item: any, index: number) => (
                  <option
                    data-test-id={`TAB_${activeTab}_OPTION_${index}`}
                    key={index}
                    value={item.param}
                  >
                    {item.show}
                  </option>
                ))}
              </optgroup>
            )} */}
            {varsData?.variables?.survey?.length > 0 && (
              <optgroup label="survey">
                {varsData.variables.survey.map((item: any) => (
                  <option key={item.param} value={item.param}>
                    {item.show}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          {row.variable &&
            Object.keys(optsData).length !== 0 &&
            optsData[row.variable] && (
              <select
                value={row.option || ""}
                data-test-id={`TAB_SELECTED_2`}
                onChange={(e) => handleOptionChange(row.id, e.target.value)}
                className="questionnaire-logic-select min-w-[180px] rounded-[16px] px-4 py-3 focus:outline-none"
              >
                <option value="">Select option</option>
                {optsData[row.variable].map((opt: any, index: number) => (
                  <option
                    data-test-id={`TAB_${activeTab}_OPTION_${index}`}
                    key={index}
                    value={opt.mark}
                  >
                    {opt.show}
                  </option>
                ))}
              </select>
            )}
          {row.option !== "" && (
            <select
              value={row.value || ""}
              data-test-id={`TAB_SELECTED_3`}
              onChange={(e) => handleValueChange(row.id, e.target.value)}
              className="questionnaire-logic-select min-w-[180px] rounded-[16px] px-4 py-3 focus:outline-none"
            >
              <option value="">Select value</option>
              {optsData[row.variable]
                ?.find((opt: any) => opt.mark === row.option)
                ?.options?.map((opt: any, index: number) => (
                  <option
                    data-test-id={`TAB_${activeTab}_OPTION_${index}`}
                    key={index}
                    value={opt.code}
                  >
                    {opt.show}
                  </option>
                ))}
            </select>
          )}
          <div className="flex items-center gap-2">
            {row.type === "main" && (
              <>
                <Tooltip content="Reset all" position="top">
                  <IconActionButton
                    tone="neutral"
                    onClick={resetAllValues}
                  >
                    <FaRotateLeft />
                  </IconActionButton>
                </Tooltip>
                <Tooltip content="Add simple row" position="top">
                  <IconActionButton
                    tone="primary"
                    onClick={addSimpleRow}
                  >
                    <FaPlus />
                  </IconActionButton>
                </Tooltip>
              </>
            )}
            {row.type === "condition" && (
              <>
                <Tooltip content="Reset this row" position="top">
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
              </>
            )}
            {row.type === "simple" && (
              <Tooltip content="Delete row" position="top">
                <IconActionButton
                  tone="danger"
                  onClick={() => deleteRow(row.id)}
                >
                  <LuTrash2 className="h-4 w-4" />
                </IconActionButton>
              </Tooltip>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
