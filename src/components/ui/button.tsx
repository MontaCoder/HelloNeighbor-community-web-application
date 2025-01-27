import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow-md hover:bg-primary-dark",
        outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 py-2",  // Add this line
        lg: "h-12 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
