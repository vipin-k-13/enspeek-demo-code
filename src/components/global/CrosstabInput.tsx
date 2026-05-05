import React from 'react';
import { cn } from '../../utils';

interface CrosstabInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label: string;
  labelClassName?: string;
  required?: boolean;
  error?: boolean;
}

const CrosstabInput: React.FC<CrosstabInputProps> = ({
  error = false,
  className,
  label,
  labelClassName,
  value,
  onChange,
  required,
  ...props
}) => {
  return (
    <div className={cn(className)}>
      <label
        className={cn(
          "questionnaire-label text-sm font-semibold text-[var(--color-text-strong)]",
          labelClassName
        )}
      >
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <div className="relative mt-2">
        <input
          {...props}
          value={value}
          onChange={onChange}
          className={cn(
            "questionnaire-input questionnaire-heading w-full rounded-[16px] border px-4 py-3 focus:outline-none",
            error ? "border-red-500 pr-10" : "questionnaire-border"
          )}
        />
      </div>
    </div>
  );
};

export default CrosstabInput;
