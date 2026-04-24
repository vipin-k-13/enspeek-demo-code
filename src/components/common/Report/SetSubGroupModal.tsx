import React, { useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { setSelected } from "../../../store/FiltersSlice";
import ModalInstruction from "../../ui/ModalInstruction";

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
      Title="Choose Subgroup"
      ButtonText="Save"
      onClick={() => {
        dispatch(setSelected(select))
        onSave(selected)
      }}
      className="max-w-lg"
    >
      <ModalInstruction>
        Choose the subgroup variable you want to apply in the report view.
      </ModalInstruction>
      <div className="max-h-[60vh] px-4">
        <div className="space-y-2">
          {options.map((option, index) => (
            <label
              key={index}
              className="flex cursor-pointer items-center space-x-3 rounded-[16px] bg-white px-4 py-3 shadow-sm"
            >
              <input
                type="radio"
                name="benefit"
                value={option.qID}
                checked={select === option.qID}
                onChange={() => setSelect(option.qID)}
                className="accent-blue-600"
              />
              <span className="home-text text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </DynamicModel>
  );
};

export default SetSubgroupModal;
