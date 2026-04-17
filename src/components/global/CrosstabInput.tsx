import React from 'react';
import { cn } from '../../utils';

interface CrosstabInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label: string;
  required?: boolean;
  error?: boolean;
}

const CrosstabInput: React.FC<CrosstabInputProps> = ({
  error = false,
  className,
  label,
  value,
  onChange,
  required,
  ...props
}) => {
  return (
    <div className={cn(className)}>
      <label className='font-medium'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <div className="relative mt-2">
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
  );
};

export default CrosstabInput;
