import React from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { SimpleAccordion, SimpleAccordionItem } from "./ShortAccorion";

type ReportFilterProps = {
  onClose: () => void;
  onClear: () => void;
};

const ReportFilter: React.FC<ReportFilterProps> = ({
  onClose,
  onClear,
}) => {
  const filter = useSelector((state: RootState) => state.filter);

  return (
    <div className="absolute top-2 right-2 bg-white border border-gray-300 rounded-md w-80 z-50">
      <div className="relative bg-primary text-white font-bold text-center py-2 rounded-t-md">
        FILTER
        <button
          onClick={onClose}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-50
                    text-action rounded-full w-4 h-4 flex items-center justify-center text-xs cursor-pointer"
        >
          <IoMdClose />
        </button>
      </div>
      <div className="p-4 mb-2 h-[40vh] overflow-y-auto">
        <SimpleAccordion>
          {filter.ReportFilterList.map((item) => (
            <SimpleAccordionItem key={item.id} title={"test"} id={item.id}>
              {[1, 2, 3, 4].map((seq) => (
                <div key={seq} className="flex items-center my-1">
                  <input
                    type="checkbox"
                    id={`${seq}`}
                    checked={true}
                    onChange={() => {}}
                    className="h-3 w-3 text-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`${seq}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    test
                  </label>
                </div>
              ))}
            </SimpleAccordionItem>
          ))}
        </SimpleAccordion>
      </div>
      <div className="flex justify-between py-2 px-4">
        <button
          onClick={onClose}
          className="border border-green-500 text-green-500 px-4 py-1 cursor-pointer rounded hover:bg-orange-50"
        >
          Apply
        </button>
        <button
          onClick={onClear}
          className="border border-orange-500 text-orange-500 px-4 py-1 cursor-pointer rounded hover:bg-orange-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ReportFilter;
