import React, { useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { setSelected } from "../../../store/FiltersSlice";

interface SetSubgroupModalProps {
  options: Record<string, any>[];
  onSave: (selected: string) => void;
  onClose: () => void;
}

const SetSubgroupModal: React.FC<SetSubgroupModalProps> = ({
  options,
  onSave,
  onClose,
}) => {
  const { selected } = useSelector((state: RootState) => state.filter);
  const [select, setSelect] = useState<string>(selected)
  const dispatch = useDispatch<AppDispatch>();
  return (
    <DynamicModel
      isOpen={true}
      onClose={onClose}
      Title="Study Name"
      ButtonText="Save"
      onClick={() => {
        dispatch(setSelected(select))
        onSave(selected)
      }}
      className="max-w-lg"
    >
      <div className="max-h-[60vh] px-4">
        <div className="space-y-2">
          {options.map((option, index) => (
            <label
              key={index}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="benefit"
                value={option.qID}
                checked={select === option.qID}
                onChange={() => setSelect(option.qID)}
                className="accent-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </DynamicModel>
  );
};

export default SetSubgroupModal;
