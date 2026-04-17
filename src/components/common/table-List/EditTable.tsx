import { useEffect, useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import { FaArrowsUpDownLeftRight, FaTrash } from "react-icons/fa6";
import { toast } from "sonner";
import BannerLogic from "../../global/BannerLogic";
import { useEditTableListQuestion, useOpList } from "../Crosstab/CrossTab.Api";
import { useLocation } from "react-router";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import CrosstabInput from "../../global/CrosstabInput";

interface EditTableModalProps {
  qid: string;
  tid: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditTableModal({
  open,
  onOpenChange,
  qid,
  tid,
}: EditTableModalProps) {
  const { state } = useLocation();
  const { opListData, isOpListPending } = useOpList(
    tid,
    qid,
    state.bannerID,
    state.studyID
  );
  const [tableLabel, setTableLabel] = useState("");
  const [tableText, setTableText] = useState("");
  const [rows, setRows] = useState<QuestionOption[]>([]);
  const [logics, setLogics] = useState<
    {
      pointLogic: string;
    }[]
  >([]);

  const { editTableListQuestionMutate, isEditTableListQuestionPending } =
    useEditTableListQuestion({
      qId: qid,
      studyID: state.studyID,
      cb: () => onOpenChange(false),
    });

  useEffect(() => {
    if (!isOpListPending && opListData) {
      setTableLabel(opListData.title);
      setTableText(opListData.description);
      setRows(opListData.rowOptionList);
      setLogics((prev) => [...opListData.logic, ...prev]);
    }
  }, [opListData]);

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleRowTitleChange = (id: string, title: string) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, title } : row)));
  };

  const handleSelectOption = (id: string, value: boolean) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, op_show: value ? 1 : 0 } : row
      )
    );
  };

  const updateTable = () => {
    if (!tableLabel.trim()) {
      toast.error("Table label is required");
      return;
    }
    if (!tableText.trim()) {
      toast.error("Table text is required");
      return;
    }
    editTableListQuestionMutate({
      bannerID: state.bannerID,
      title: tableLabel,
      description: tableText,
      logic: logics,
      rowOptionList: rows.map(({ op_show, old_q, net, ...item }) => ({
        ...item,
        show: op_show,
        net: net.length ? net : "",
      })),
      tableID: tid,
    });
  };

  return (
    <DynamicModel
      Title={tableLabel}
      disable={isEditTableListQuestionPending}
      ButtonText="Update Table"
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onClick={updateTable}
      className="max-w-6xl"
    >
      {isOpListPending ? (
        <div className="flex justify-center">
          <AiOutlineLoading3Quarters
            size={34}
            className={"animate-spin text-action"}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <CrosstabInput
              label="Table Label"
              required
              placeholder="Enter label"
              value={tableLabel}
              onChange={(e) => setTableLabel(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <CrosstabInput
              label="Table Text"
              placeholder="Enter text"
              value={tableText}
              onChange={(e: any) => setTableText(e.target.value)}
              required
            />
          </div>
          {opListData.logic.length !== 0 &&
            opListData.logic.some((item: any) =>
              logics.some((logic: any) => logic.pointLogic === item.pointLogic)
            ) && (
              <div>
                <p className="text-action">Banner Point Logic</p>
                {opListData.logic.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex text-red-500 items-center gap-4 mt-2"
                  >
                    <span>
                      <span className="text-black">{index + 1}.</span>{" "}
                      {item.pointLogic}
                    </span>
                    <MdDeleteForever
                      className="h-5 w-5"
                      onClick={() =>
                        setLogics((prev) =>
                          prev.filter(
                            (logic) => logic.pointLogic !== item.pointLogic
                          )
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          <div className="space-y-2">
            <label className="text-sm font-medium">* Table Logic</label>
            <div className="flex items-center gap-2">
              <BannerLogic
                setLogicFunc={(e) => setLogics(e)}
              />
            </div>
          </div>
          <div className="border border-gray-300">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="w-12 text-left px-2 py-2 border-r border-gray-300">
                    Re-order
                  </th>
                  <th className="w-16 text-left px-2 py-2 border-r border-gray-300">
                    Show
                  </th>
                  <th className="w-24 text-left px-2 py-2 border-r border-gray-300">
                    Row ID
                  </th>
                  <th className="text-left px-2 py-2 border-r border-gray-300">
                    Row Title
                  </th>
                  <th className="w-32 px-2 py-2"></th>
                  <th className="w-12 px-2 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-2 py-2 border-r border-gray-300 align-middle text-center">
                      <button className="cursor-all-scroll">
                        <FaArrowsUpDownLeftRight />
                      </button>
                    </td>
                    <td className="px-2 py-2 border-r border-gray-300 align-middle text-center">
                      <input
                        type="checkbox"
                        className="form-checkbox cursor-pointer"
                        checked={Boolean(row.op_show)}
                        onChange={(e) =>
                          handleSelectOption(row.id, e.target.checked)
                        }
                      />
                    </td>
                    <td className="px-2 py-2 border-r border-gray-300 align-middle">
                      {row.id}
                    </td>
                    <td className="px-2 py-2 border-r border-gray-300">
                      <input
                        type="text"
                        value={row.optionText}
                        onChange={(e) =>
                          handleRowTitleChange(row.id, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    </td>
                    <td className="px-2 py-2 border-r border-gray-300">
                      {row.id === "" ? (
                        <select className="w-full border border-gray-300 focus:outline-none rounded-md p-2">
                          <option value="">Select</option>
                          <option value="option1">Net</option>
                          <option value="option2">Mean</option>
                          <option value="option2">Median</option>
                          <option value="option2">Standard Deviation</option>
                        </select>
                      ) : null}
                    </td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent rounded"
                      >
                        <FaTrash className="h-4 w-4 cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DynamicModel>
  );
}
