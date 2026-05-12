import { useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import LoaderSpinner from "../../global/LoaderSpinner";
import { setTrigger } from "../../../store/TriggerSlice";
import { useLocation } from "react-router";
import ModalInstruction from "../../ui/ModalInstruction";
import Checkbox from "../../ui/Checkbox";
import { useReportIncludeFiltersMutation } from "../../../api-network/report/mutation";

export default function FilterModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: () => void }) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const filter = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch<AppDispatch>()
  const { state } = useLocation();

  const toggleFilter = (id: string) => {
    setSelectedFilters((prev) => prev.includes(id) ? prev.filter((filterId) => filterId !== id) : [...prev, id]);
  };

  const { includeReportFilters, isIncludeReportFiltersPending } =
    useReportIncludeFiltersMutation(state.studyID, () => {
      setIsOpen();
      dispatch(setTrigger(true));
    });

  if (!isOpen) return null;

  if (isIncludeReportFiltersPending) {
    return <LoaderSpinner />
  }

  return (
    <DynamicModel
      Title="Add Report Filters"
      ButtonText="Save Filter List"
      isOpen={isOpen}
      onClick={() => includeReportFilters(selectedFilters)}
      onClose={() => setIsOpen()}
      className="max-w-lg"
    >
      <ModalInstruction>
        Select the questions you want available in the report filters list, then save the updated filter set.
      </ModalInstruction>
      <div className="max-h-[60vh] overflow-y-auto">
        {filter.FilterList.map((option) => (
          <div key={option.id} className="modal-card mb-3 flex items-center rounded-[16px] px-4 py-3">
            <Checkbox
              id={option.id}
              checked={selectedFilters.includes(option.id)}
              onChange={() => toggleFilter(option.id)}
              className="cursor-pointer"
            />
            <label htmlFor={option.id} className="ml-3 home-text text-sm font-medium">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </DynamicModel>
  );
}
