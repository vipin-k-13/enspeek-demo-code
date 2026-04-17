import { useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import LoaderSpinner from "../../global/LoaderSpinner";
import { setTrigger } from "../../../store/TriggerSlice";
import { useLocation } from "react-router";

export default function FilterModal({isOpen, setIsOpen}:{isOpen:boolean, setIsOpen:()=>void}) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const filter = useSelector((state: RootState) => state.filter);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>()
  const {state} = useLocation();

  const toggleFilter = (id: string) => {
    setSelectedFilters((prev) =>
      prev.includes(id)
        ? prev.filter((filterId) => filterId !== id)
        : [...prev, id]
    );
  };

  const {mutate, isPending} = useMutation({
    mutationKey: ["includesFilter"],
    mutationFn: async () => {
      const res = await apiRequest("post", "report/filters/include", {
        apiToken: user.apiToken,
        "question-list": selectedFilters,
        studyID: state.studyID,
      });

      return res.response;
    },
    onSuccess: () => {
      setIsOpen();
      dispatch(setTrigger(true))
    },
  });

  if (!isOpen) return null;

  if(isPending){
    return <LoaderSpinner/>
  }

  return (
    <DynamicModel
      Title="iPhone 15 Feature Usage"
      ButtonText="Save Filter List"
      isOpen={isOpen}
      onClick={()=>mutate()}
      onClose={() => setIsOpen()}
      className="max-w-lg"
    >
      <div className="max-h-[60vh] overflow-y-auto">
        {filter.FilterList.map((option) => (
          <div key={option.id} className="flex items-center mb-4">
            <input
              type="checkbox"
              id={option.id}
              checked={selectedFilters.includes(option.id)}
              onChange={() => toggleFilter(option.id)}
              className="h-4 w-4 text-primary border-gray-300 cursor-pointer rounded"
            />
            <label htmlFor={option.id} className="ml-2 text-sm text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </DynamicModel>
  );
}
