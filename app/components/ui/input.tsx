/**
 * Input Component
 * Premium input component with elegant styling for forms
 * 
 * Features:
 * - Multiple variants (default, filled, outlined, ghost)
 * - Support for icons (left/right)
 * - Error states with visual feedback
 * - Loading state
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// Input Variants
// ============================================

const inputVariants = cva(
  // Base styles
  "flex w-full transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        // Default input with border
        default: [
          "bg-surface-secondary",
          "border border-border",
          "rounded-lg",
          "text-text-primary",
          "placeholder:text-text-muted",
          "hover:border-border-light",
          "focus:border-gold focus:ring-2 focus:ring-gold/20",
        ],

        // Filled input (no border, just background)
        filled: [
          "bg-surface-tertiary",
          "border-2 border-transparent",
          "rounded-lg",
          "text-text-primary",
          "placeholder:text-text-muted",
          "hover:bg-surface-hover",
          "focus:bg-surface-secondary focus:border-gold",
        ],

        // Outlined input (visible border)
        outlined: [
          "bg-transparent",
          "border-2 border-border",
          "rounded-lg",
          "text-text-primary",
          "placeholder:text-text-muted",
          "hover:border-border-light",
          "focus:border-gold",
        ],

        // Ghost input (minimal styling)
        ghost: [
          "bg-transparent",
          "border-b-2 border-border",
          "rounded-none px-0",
          "text-text-primary",
          "placeholder:text-text-muted",
          "hover:border-border-light",
          "focus:border-gold",
        ],

        // Underline input
        underline: [
          "bg-transparent",
          "border-0 border-b border-border",
          "rounded-none px-0",
          "text-text-primary",
          "placeholder:text-text-muted",
          "hover:border-border-light",
          "focus:border-gold focus:ring-0",
        ],
      },

      // Size variants
      size: {
        default: "h-11 px-4 py-2.5 text-sm",
        sm: "h-9 px-3 py-2 text-xs",
        lg: "h-12 px-5 py-3 text-base",
        xl: "h-14 px-6 py-4 text-lg",
      },

      // Error state
      error: {
        true: "border-error focus:border-error focus:ring-error/20",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      error: false,
    },
  }
);

// ============================================
// Input Component Interface
// ============================================

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  containerClassName?: string;
}

// ============================================
// Input Component
// ============================================

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      error,
      leftIcon,
      rightIcon,
      errorMessage,
      helperText,
      label,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || React.useId();
    const hasError = error || !!errorMessage;

    return (
      <div className={cn("w-full", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Element */}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              inputVariants({ variant, size, error: hasError }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {errorMessage}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !errorMessage && (
          <p className="mt-1.5 text-sm text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ============================================
// Textarea Component
// ============================================

const textareaVariants = cva(
  "flex w-full min-h-[80px] transition-all duration-200 placeholder:text-text-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y",
  {
    variants: {
      variant: {
        default: [
          "bg-surface-secondary",
          "border border-border",
          "rounded-lg",
          "text-text-primary",
          "hover:border-border-light",
          "focus:border-gold focus:ring-2 focus:ring-gold/20",
          "px-4 py-3 text-sm",
        ],
        filled: [
          "bg-surface-tertiary",
          "border-2 border-transparent",
          "rounded-lg",
          "text-text-primary",
          "hover:bg-surface-hover",
          "focus:bg-surface-secondary focus:border-gold",
          "px-4 py-3 text-sm",
        ],
        outlined: [
          "bg-transparent",
          "border-2 border-border",
          "rounded-lg",
          "text-text-primary",
          "hover:border-border-light",
          "focus:border-gold",
          "px-4 py-3 text-sm",
        ],
        ghost: [
          "bg-transparent",
          "border-b-2 border-border",
          "rounded-none px-0",
          "text-text-primary",
          "hover:border-border-light",
          "focus:border-gold",
          "py-3 text-sm",
        ],
      },
      error: {
        true: "border-error focus:border-error focus:ring-error/20",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      error: false,
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  errorMessage?: string;
  helperText?: string;
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, variant, error, errorMessage, helperText, label, id, ...props },
    ref
  ) => {
    const textareaId = id || React.useId();
    const hasError = error || !!errorMessage;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(textareaVariants({ variant, error: hasError }), className)}
          {...props}
        />
        {errorMessage && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {errorMessage}
          </p>
        )}
        {helperText && !errorMessage && (
          <p className="mt-1.5 text-sm text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// ============================================
// Search Input Component
// ============================================

interface SearchInputProps extends Omit<InputProps, "leftIcon" | "type"> {
  onClear?: () => void;
  showClearButton?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClearButton = true, value, onChange, ...props }, ref) => {
    const SearchIcon = () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    );

    const ClearIcon = () => (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    );

    const hasValue = value && String(value).length > 0;

    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<SearchIcon />}
        rightIcon={
          showClearButton && hasValue ? (
            <button
              type="button"
              onClick={onClear}
              className="p-1 rounded-full hover:bg-surface-hover transition-colors"
              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          ) : undefined
        }
        value={value}
        onChange={onChange}
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";

// ============================================
// Number Input Component
// ============================================

interface NumberInputProps extends Omit<InputProps, "type" | "rightIcon"> {
  min?: number;
  max?: number;
  step?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ min, max, step = 1, onIncrement, onDecrement, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="number"
          min={min}
          max={max}
          step={step}
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          {...props}
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
          <button
            type="button"
            onClick={onIncrement}
            className="p-0.5 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
            aria-label="Increment"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDecrement}
            className="p-0.5 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
            aria-label="Decrement"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";

// ============================================
// Exports
// ============================================

export { Input, inputVariants, Textarea, SearchInput, NumberInput };
export default Input;
