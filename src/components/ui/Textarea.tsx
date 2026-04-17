import { cva, type VariantProps } from 'class-variance-authority';
import { type FC, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils';

const textareaVariants = cva("border rounded px-3 py-2 w-full", {
  variants: {
    variant: {
      default: "",
    }
  },
  defaultVariants: {
    variant: "default",
  }
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {}

const Textarea: FC<TextareaProps> = ({ className, variant, ...props }) => {
  return (
    <textarea className={cn(`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 file:border-0 file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50`, className)} {...props} />
  );
};

export default Textarea;

