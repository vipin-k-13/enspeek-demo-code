import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, type FC, type ReactNode } from "react";
import { cn } from "../../utils";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent px-5 py-2.5 text-sm font-bold leading-none align-middle transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      varinat: {
        default: "bg-login-primary text-white shadow-sm hover:bg-login-primary-hover",
        theme: "bg-login-primary text-white shadow-sm hover:bg-login-primary-hover",
        success:
          "bg-[var(--color-study-activated)] text-white shadow-sm hover:brightness-95",
        danger: "bg-red-500 text-white shadow-sm hover:opacity-95",
        cancel:
          "border-black bg-white text-black shadow-sm hover:bg-black/[0.03]",
        destructive: "bg-red-500 text-white shadow-sm hover:opacity-95",
        outline:
          "border-black bg-white text-black shadow-sm hover:bg-black/[0.03]",
        secondary:
          "border home-border bg-white home-heading shadow-sm hover:bg-[var(--color-home-panel-soft)]",
        ghost: "bg-transparent text-[var(--color-text-strong)] hover:bg-gray-100",
        link: "text-primary underline-offset-4 hover:underline",
        social:
          "w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50 transition-all duration-300 text-gray-700 shadow-sm",
      },
      size: {
        default: "px-5 py-2.5 text-sm",
        sm: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-sm",
        icon: "aspect-square p-2.5 text-2xl",
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
      className={cn(buttonVariants({ varinat, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
