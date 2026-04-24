import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, type FC, type ReactNode } from "react";
import { cn } from "../../utils";

export const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      varinat: {
        default:
          "",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-gray-100",
        link: "text-primary underline-offset-4 hover:underline",
        social:
          "w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50 transition-all duration-300 text-gray-700 shadow-sm",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9 text-2xl",
      },
    },
    defaultVariants: {
      varinat: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({
  children,
  varinat,
  size,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({className, varinat, size }))}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
