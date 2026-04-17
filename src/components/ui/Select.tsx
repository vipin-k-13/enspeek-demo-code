import { cva, type VariantProps } from 'class-variance-authority';
import type { FC, ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from '../../utils';

const selectVariants = cva("cursor-pointer px-3 py-2 border rounded", {
  variants: {
    variant: {
      default: '',
      outlined: 'border-gray-300',
      filled: 'bg-gray-100 border-gray-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  children: ReactNode;
}


const Select: FC<SelectProps> = ({ children, variant, className, ...props }) => {
  return (
    <select className={cn(selectVariants({ variant }), className)} {...props}>
      {children}
    </select>
  );
};

export default Select;
