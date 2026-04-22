import React from "react";
import Input from "../../ui/Input";
import { LuTrash2 } from "react-icons/lu";

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
    <div className="flex items-center gap-3">
      <label htmlFor={`row`} className="questionnaire-label w-10 shrink-0 text-base font-medium">
        R{optionKey}
      </label>
      <Input value={Value} onChange={(e)=>onChange(e.target.value)} className={`questionnaire-input questionnaire-heading questionnaire-clickable rounded-[18px] border-0 px-5 py-3.5 text-base focus-visible:ring-0 ${
          error ? "ring-1 ring-red-400" : ""
        }`} required />
      <button
        type="button"
        onClick={onDelete}
        className="questionnaire-delete inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-home-panel-soft)]"
      >
        <LuTrash2 size={18} />
      </button>
    </div>
  );
};

export default RowOptions;
