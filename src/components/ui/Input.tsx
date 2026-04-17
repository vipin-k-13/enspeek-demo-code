import React from 'react'
import { cn } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input:React.FC<InputProps> = ({className="", ...props}) => {
  return (
    <input
      className={cn(`flex w-full rounded-md border px-3 py-1 text-sm
         text-gray-800 bg-gray-50 file:border-0 file:text-sm 
         file:font-medium file:text-foreground placeholder:text-gray-400 
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
           disabled:cursor-not-allowed disabled:opacity-50`, className)}
      {...props}
    />
  );
}

export default Input