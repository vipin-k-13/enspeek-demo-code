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
      Title="Delete Question"
      ButtonText="Delete"
      isOpen={isOpen}
      onClick={handleClick}
      onClose={onClose}
      className="max-w-lg rounded-[24px]"
    >
      <p className="questionnaire-label text-lg">
        Are you sure you want to delete this question? This action cannot be undone.
      </p>
      <p className="mt-5 questionnaire-heading">
        Type <strong className="text-red-500">delete</strong> to confirm
      </p>
      <input
        className="questionnaire-input mt-3 w-full rounded-[20px] border border-red-300 px-4 py-3 focus:outline-none"
        data-test-id="DELETE_QUESTIONNAIRE_MODEL"
        placeholder="Type 'delete' here..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e)=>handleKeyPress(e, handleClick)}
      />
    </DynamicModel>
  );
};

export default DeleteModel;
