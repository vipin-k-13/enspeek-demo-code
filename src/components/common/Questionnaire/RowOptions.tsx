import React from "react";
import Input from "../../ui/Input";
import { MdDelete } from "react-icons/md";

interface RowOptions {
  optionKey:string;
  Value: string;
  onChange: (e:string)=>void;
  select: boolean;
  onSelect: (e:boolean)=>void;
  onDelete:()=>void
  error?: boolean;
}

const RowOptions:React.FC<RowOptions> = ({optionKey, Value, onChange, onDelete, error = false}) => {
  return (
    <div className="flex items-center mb-2 gap-6">
      <label htmlFor={`row`} className="text-blue-600 w-6">
        R{optionKey}
      </label>
      <Input value={Value} onChange={(e)=>onChange(e.target.value)} className={`focus-visible:ring-0 ${
          error ? "border-red-500" : "border-gray-300"
        }`} required />
      <MdDelete size={28} onClick={onDelete} className="text-red-400 hover:text-red-600" />
    </div>
  );
};

export default RowOptions;
