import { useDispatch, useSelector } from "react-redux";
import { setIsOpenGroup, setGroupInput, addGroup } from "../../../store/CrosstabSlice";
import type { RootState } from "../../../store/store";
import DynamicModel from "../../global/DynamicModel";
import Input from "../../ui/Input";

export default function AddGroupModal() {
  const dispatch = useDispatch();
  const { isOpenGroup, groupInput } = useSelector((state: RootState) => state.crosstab);

  const handleSetGroup = () => {
    dispatch(addGroup(groupInput));
    dispatch(setGroupInput(""));
    dispatch(setIsOpenGroup(false));
  };

  return (
    <DynamicModel
      Title="Set Group Name"
      ButtonText="Set Group Name"
      isOpen={isOpenGroup}
      onClose={() => dispatch(setIsOpenGroup(false))}
      onClick={handleSetGroup}
      className="max-w-lg"
    >
      <Input
        className="questionnaire-input questionnaire-heading border questionnaire-border"
        placeholder="Enter group name"
        value={groupInput}
        onChange={(e) => dispatch(setGroupInput(e.target.value))}
      />
    </DynamicModel>
  );
}
