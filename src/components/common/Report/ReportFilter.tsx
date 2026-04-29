import React from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { SimpleAccordion, SimpleAccordionItem } from "./ShortAccorion";
import Button from "../../ui/Button";

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
    <div className="report-card absolute top-2 right-2 z-50 w-80 overflow-hidden">
      <div className="relative bg-login-primary text-center py-3 text-sm font-bold text-white">
        FILTER
        <button
          onClick={onClose}
          className="questionnaire-clickable absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-login-primary"
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
                    className="h-3 w-3 rounded border home-border text-login-primary"
                  />
                  <label
                    htmlFor={`${seq}`}
                    className="home-text ml-2 text-sm"
                  >
                    test
                  </label>
                </div>
              ))}
            </SimpleAccordionItem>
          ))}
        </SimpleAccordion>
      </div>
      <div className="flex justify-between px-4 py-3">
        <Button varinat="theme" size="sm" onClick={onClose}>
          Apply
        </Button>
        <Button varinat="cancel" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default ReportFilter;
