import React from "react";
import DynamicModel from "./DynamicModel";
import { toast } from "sonner";
import { handleKeyPress } from "../../utils";

interface DeleteModelProps {
  onClick: () => void;
  isOpen: boolean;
  onClose: () => void;
  label: string
}

const DeleteModel: React.FC<DeleteModelProps> = ({
  onClick,
  isOpen,
  onClose,
  label
}) => {
  const [inputValue, setInputValue] = React.useState<string>("");

  const handleClick = () => {
    if (inputValue?.trim()?.toLowerCase() === "delete") {
      onClick();
      onClose();
      setInputValue("");
    } else {
      return toast.warning(`Please type "delete" to confirm`);
    }
  };
  

  return (
    <DynamicModel
      Title={`Delete Question: ${label}`}
      ButtonText="Delete"
      isOpen={isOpen}
      onClick={handleClick}
      onClose={onClose}
      className="max-w-lg"
    >
      <p>Are you sure want to delete?</p>
      <p className="mt-3">
        Type <strong>delete</strong> In the input box
      </p>
      <input
        className="border border-gray-300 focus:outline-none px-3 items-center rounded-md w-full py-1 mt-3 "
        data-test-id="DELETE_QUESTIONNAIRE_MODEL"
        placeholder="eg. delete"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e)=>handleKeyPress(e, handleClick)}
      />
    </DynamicModel>
  );
};

export default DeleteModel;
