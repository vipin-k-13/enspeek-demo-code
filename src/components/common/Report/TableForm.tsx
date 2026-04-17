import { FaFilePowerpoint } from "react-icons/fa";
import Button from "../../ui/Button";
import { useLocation } from "react-router";
import { useProcessHook, useTableDownload } from "./ReportMutations";

interface TableFormProps {
  questionId: string;
  studyID?: string;
  title: string;
  baseText: string;
  questionText: string;
  headers: string[];
  baseRow: (string | number)[];
  rows: {
    rowLabel: string;
    values: (string | number)[];
  }[];
}

export default function TableForm({
  questionId,
  title,
  baseText,
  questionText,
  headers,
  baseRow,
  rows,
  studyID,
}: TableFormProps) {
  const { state } = useLocation();
  const { Process } = useProcessHook();
  const { DownloadTable } = useTableDownload({
    studyID: studyID ? studyID : state?.studyID,
    cb: ({ studyID, pid }) => {
      Process({ studyID, pid });
    },
  });
  return (
    <div
      data-test-id={`${questionId}_TABLE`}
      key={questionId}
      className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden mb-4"
    >
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-300">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <Button
          className="text-yellow-500 cursor-pointer"
          onClick={() => {
            DownloadTable(questionId);
          }}
        >
          <FaFilePowerpoint />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-6 py-3"></th>
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-3 text-center">
                  {h}
                </th>
              ))}
            </tr>
            <tr className="bg-white text-gray-600">
              <td className="px-6 py-2 text-gray-900 font-medium">Base</td>
              {baseRow.map((item, idx) => (
                <td key={idx} className="px-6 py-2 text-center font-medium">
                  {item}
                </td>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-3 text-gray-900">{row.rowLabel}</td>
                {row.values.map((val, idx) => (
                  <td key={idx} className="px-6 py-3 text-center text-gray-800">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 space-y-1 text-gray-500">
        <p className="text-sm">{baseText}</p>
        <p className="text-sm">{questionText}</p>
      </div>
    </div>
  );
}
