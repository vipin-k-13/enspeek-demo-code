import React from 'react'
import { cn } from '../../../utils';

interface QuestionsInput extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  lable: string;
  require?: boolean
  error?: boolean;
}

const QuestionsInput: React.FC<QuestionsInput> = ({  error = false,
  className,
  lable,
  value,
  onChange,
  require,
  ...props
}) => {
  return (
    <div className={cn(className)}>
      <label className='questionnaire-label mb-3 block'>
        {lable} {require && <span className='text-red-500'>*</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          value={value}
          onChange={onChange}
          className={cn(
            "questionnaire-input questionnaire-heading questionnaire-clickable w-full rounded-[18px] border px-4 py-3.5 text-base focus:outline-none",
            error ? "border-red-400 pr-10" : "questionnaire-border border"
          )}
        />
      </div>
    </div>
  )
}

export default QuestionsInput
