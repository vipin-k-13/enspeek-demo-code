import React, { useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";
import { useSetQuota } from "./SurveyApi";

interface QuotaProps {
  studyID: string;
  complete: number;
  disqualified: number;
  incomplete: number;
  totalQuota?: number;
}

const Quota: React.FC<QuotaProps> = ({
  studyID,
  complete,
  disqualified,
  incomplete,
  totalQuota,
}) => {
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [editTotal, setEditTotal] = useState(totalQuota || 100);
  const { setQuota, isSetQuotaPending } = useSetQuota({
    studyID,
    quota: editTotal || 100,
  });

  const handleSaveTotal = () => {
    setQuota();
    setIsEditingTotal(false);
    toast.success("Quota updated successfully!");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-300 mt-6 w-full p-3">
      <div className="pb-3">
        <h2 className="text-xl font-semibold text-action">Over Quota</h2>
      </div>

      <div className="pb-3">
        {!isEditingTotal ? (
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-2 rounded-lg">
            <span className="text-sm text-gray-500">
              Total Quota:{" "}
              <strong>{isSetQuotaPending ? "Updating..." : editTotal}</strong>
            </span>
            <button
              onClick={() => setIsEditingTotal(true)}
              title="Edit total quota"
              className="text-gray-400 hover:text-gray-500 cursor-pointer"
            >
              <FaEdit size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 border p-2 border-gray-200 rounded-lg">
            <input
              type="number"
              value={editTotal}
              onChange={(e) => setEditTotal(Number(e.target.value))}
              className="w-24 border border-gray-300 text-gray-700 rounded px-1 py-0.5 focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveTotal}
                title="Set total quota"
                className="text-action hover:text-action/70 cursor-pointer"
              >
                <AiOutlineSave size={20} />
              </button>
              <button
                onClick={() => setIsEditingTotal(false)}
                title="Cancel"
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <MdCancel size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center rounded-lg border border-green-200 bg-green-50 p-2">
          <p className="text-sm text-gray-600">Complete</p>
          <p className="text-2xl font-bold text-green-600">{complete}</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2">
          <p className="text-sm text-gray-600">Disqualified</p>
          <p className="text-2xl font-bold text-red-600">{disqualified}</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-yellow-200 bg-yellow-50 p-2">
          <p className="text-sm text-gray-600">Incomplete</p>
          <p className="text-2xl font-bold text-yellow-600">{incomplete}</p>
        </div>
      </div>
    </div>
  );
};

export default Quota;
