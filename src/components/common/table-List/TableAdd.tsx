import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { FaPlus, FaTrash } from "react-icons/fa6";
import BannerLogic from "../../global/BannerLogic";

interface ControlItem {
  id: number;
  variable: string;
}
export interface TableRow {
  id: string;
  title: string;
  variables: string;
  logic: { pointLogic: string }[],
  controls: ControlItem[];
}

interface Props {
  rows: TableRow[];
  setRows: React.Dispatch<React.SetStateAction<TableRow[]>>;
}

export default function AddCustomTableListModal({ rows, setRows }: Props) {
  const handleCreateRow = () => {
    const newRowId = `CT-${rows.length + 1}`;
    setRows([
      ...rows,
      {
        id: newRowId,
        title: "",
        variables: "",
        logic:[],
        controls: [{ id: Date.now(), variable: "variable1" }],
      },
    ]);
  };

  const handleRowChange = (
    rowIndex: number,
    field: keyof Omit<TableRow, "id" | "controls">,
    value: any
  ) => {
    setRows((prev) =>
      prev.map((r, i) => (i === rowIndex ? { ...r, [field]: value } : r))
    );
  };

  const handleDeleteRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-gray-300">
      <div className="flex justify-end py-2 px-4 border-b border-gray-300">
        <Button
          varinat="outline"
          onClick={handleCreateRow}
          className="ml-4 text-action border-action hover:bg-action hover:text-white"
        >
          <FaPlus className="mr-1" />
          Create Row
        </Button>
      </div>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left px-4 py-2 w-24 border-r border-gray-300">
              Row ID
            </th>
            <th className="text-left px-4 py-2 border-r border-gray-300">
              Row Title
            </th>
            <th className="text-center px-4 py-2 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={row.id}>
              <td className="px-4 py-2 border-r border-gray-300 align-middle">
                <div className="text-sm font-medium">{row.id}</div>
              </td>
              <td className="px-4 py-2 align-middle border-r border-gray-300 ">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter option text"
                    value={row.title}
                    onChange={(e) =>
                      handleRowChange(rowIndex, "title", e.target.value)
                    }
                    className="w-full border border-gray-300 focus:outline-none"
                  />
                  <div className="space-y-2">
                    {row.controls.map((_, index) => (
                      <BannerLogic setLogicFunc={(e)=>handleRowChange(rowIndex, "logic", e)} key={index} />
                    ))}
                  </div>
                </div>
              </td>
              {rows.length > 1 && (
                <td className="px-4 py-2 text-center align-middle">
                  <button
                    onClick={() => handleDeleteRow(rowIndex)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <FaTrash className="text-red-500 hover:text-red-600" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
