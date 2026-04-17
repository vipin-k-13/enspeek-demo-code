import { useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { setDeleteModel, setSelectedId } from "../../../store/TriggerSlice";
import { handleKeyPress } from "../../../utils";
import { useDelete } from "./Api";
import { toast } from "sonner";

const DeleteModel = () => {
  const [deleteInputValue, setDeleteInputValue] = useState<string>("");
  const { deleteModel, selectedId } = useSelector(
    (state: RootState) => state.trigger
  );
  const dispatch = useDispatch<AppDispatch>();
  const { Delete } = useDelete();

  const handleDelete = () => {
    if (
      deleteInputValue.trim().toLowerCase() === "delete" &&
      selectedId !== ""
    ) {
      Delete(selectedId);
      dispatch(setSelectedId(""));
      dispatch(setDeleteModel(false));
      setDeleteInputValue("");
    } else {
      toast.warning("Please type 'delete' to confirm.");
    }
  };
  return (
    <DynamicModel
      Title="Delete Study"
      ButtonText={"Delete"}
      isOpen={deleteModel}
      onClose={() => {
        dispatch(setSelectedId(""));
        dispatch(setDeleteModel(false));
        setDeleteInputValue("");
      }}
      onClick={() => {
        handleDelete();
      }}
      className="max-w-lg"
    >
      <p>Are you sure you want to delete?</p>
      <p className="mt-3">
        Type <strong>delete</strong> in the input box
      </p>
      <input
        data-test-id="DELETE_MODEL"
        className="border border-gray-300 focus:outline-none px-3 items-center rounded-md w-full py-1 mt-3"
        placeholder="eg. delete"
        value={deleteInputValue}
        onChange={(e) => setDeleteInputValue(e.target.value)}
        onKeyDown={(e) => handleKeyPress(e, handleDelete)}
      />
    </DynamicModel>
  );
};

export default DeleteModel;
