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
      <label className='text-sm font-medium text-gray-400 mb-1'>
        {lable} {require && <span className='text-red-500'>*</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          value={value}
          onChange={onChange}
          className={cn(
            "w-full px-3 py-2 border rounded-md focus:outline-none",
            error ? "border-red-500 pr-10" : "border-gray-300"
          )}
        />
      </div>
    </div>
  )
}

export default QuestionsInput