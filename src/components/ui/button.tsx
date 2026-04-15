import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 btn-lift",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-soft-md active:shadow-soft-sm",
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/90 hover:shadow-soft-md active:shadow-soft-sm",
        accent: "bg-accent text-accent-foreground shadow-soft hover:bg-accent/90 hover:shadow-soft-md active:shadow-soft-sm",
        destructive: "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90 hover:shadow-soft-md active:shadow-soft-sm",
        outline: "border border-input bg-background shadow-soft-sm hover:bg-muted hover:shadow-soft hover:text-foreground active:shadow-soft-sm",
        ghost: "hover:bg-muted hover:text-foreground",
        soft: "bg-muted text-foreground shadow-soft-sm hover:bg-muted/80 hover:shadow-soft active:shadow-soft-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        className: cn(children.props.className, classes),
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };