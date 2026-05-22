/**
 * Button Component
 * Premium button variants for luxury food delivery app
 * 
 * Variants:
 * - default: Gold primary button
 * - secondary: Dark surface button
 * - outline: Bordered button
 * - ghost: Transparent with hover
 * - destructive: Error state button
 * - gold: Shiny gold gradient button
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// Button Variants
// ============================================

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary Gold Button
        default: [
          "bg-gold text-background-primary hover:bg-gold-400",
          "shadow-md shadow-gold/20 hover:shadow-lg hover:shadow-gold/30",
          "border border-transparent",
        ],

        // Secondary Dark Button
        secondary: [
          "bg-surface-secondary text-text-primary hover:bg-surface-hover",
          "shadow-sm hover:shadow-md",
          "border border-border hover:border-border-light",
        ],

        // Outline Button
        outline: [
          "bg-transparent text-text-primary hover:bg-surface-secondary",
          "border border-border hover:border-gold/50",
          "shadow-none hover:shadow-sm",
        ],

        // Ghost Button
        ghost: [
          "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary/50",
          "border border-transparent",
          "shadow-none",
        ],

        // Destructive Button
        destructive: [
          "bg-error text-white hover:bg-error-light",
          "shadow-md shadow-error/20 hover:shadow-lg hover:shadow-error/30",
          "border border-transparent",
        ],

        // Gold Gradient Button (Premium)
        gold: [
          "bg-gradient-to-r from-gold via-gold-400 to-gold text-background-primary",
          "hover:brightness-110",
          "shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40",
          "border border-transparent",
        ],

        // Subtle Button
        subtle: [
          "bg-surface-tertiary/50 text-text-secondary hover:text-text-primary hover:bg-surface-tertiary",
          "shadow-none",
          "border border-transparent",
        ],

        // Link Button
        link: [
          "bg-transparent text-gold hover:text-gold-light underline-offset-4 hover:underline",
          "shadow-none",
          "border border-transparent",
        ],
      },

      // Size variants
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 px-2.5 text-xs rounded-md",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10 p-2",
        "icon-sm": "h-8 w-8 p-1.5",
        "icon-lg": "h-12 w-12 p-2.5",
      },

      // Full width option
      fullWidth: {
        true: "w-full",
        false: "",
      },

      // Rounded option
      rounded: {
        default: "rounded-lg",
        none: "rounded-none",
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-2xl",
        full: "rounded-full",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
      rounded: "default",
    },
  }
);

// ============================================
// Button Component Interface
// ============================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ============================================
// Button Component
// ============================================

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      rounded,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, fullWidth, rounded, className }),
          loading && "cursor-wait"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

// ============================================
// Icon Button Component
// ============================================

interface IconButtonProps extends Omit<ButtonProps, "size" | "leftIcon" | "rightIcon"> {
  icon: React.ReactNode;
  "aria-label": string;
  size?: "default" | "sm" | "lg";
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = "default", className, ...props }, ref) => {
    const sizeMap = {
      default: "icon",
      sm: "icon-sm",
      lg: "icon-lg",
    } as const;

    return (
      <Button
        ref={ref}
        size={sizeMap[size]}
        className={cn("rounded-full", className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";

// ============================================
// Button Group Component
// ============================================

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  attached?: boolean;
  orientation?: "horizontal" | "vertical";
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, attached = false, orientation = "horizontal", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          attached && orientation === "horizontal" && "[&>button:first-child]:rounded-r-none [&>button:last-child]:rounded-l-none [&>button:not(:first-child):not(:last-child)]:rounded-none [&>button:not(:first-child)]:-ml-px",
          attached && orientation === "vertical" && "[&>button:first-child]:rounded-b-none [&>button:last-child]:rounded-t-none [&>button:not(:first-child):not(:last-child)]:rounded-none [&>button:not(:first-child)]:-mt-px",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

// ============================================
// Exports
// ============================================

export { Button, buttonVariants, IconButton, ButtonGroup };
export default Button;
