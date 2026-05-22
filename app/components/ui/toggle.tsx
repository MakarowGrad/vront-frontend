/**
 * Toggle Component
 * Premium toggle button component for "Состав"/"Собрать блюдо"
 * 
 * Built on Radix UI Toggle primitive for accessibility
 */

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// Toggle Variants
// ============================================

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        // Default toggle with background change
        default: [
          "bg-transparent text-text-muted",
          "hover:bg-surface-hover hover:text-text-secondary",
          "data-[state=on]:bg-gold data-[state=on]:text-background-primary",
          "data-[state=on]:hover:bg-gold-400",
        ],
        // Outline toggle
        outline: [
          "bg-transparent border border-border text-text-muted",
          "hover:bg-surface-hover hover:text-text-secondary",
          "data-[state=on]:bg-gold data-[state=on]:text-background-primary data-[state=on]:border-gold",
        ],
        // Ghost toggle (subtle)
        ghost: [
          "bg-transparent text-text-muted",
          "hover:text-text-primary",
          "data-[state=on]:text-gold data-[state=on]:bg-gold/10",
        ],
        // Underline toggle
        underline: [
          "bg-transparent text-text-muted border-b-2 border-transparent rounded-none",
          "hover:text-text-secondary",
          "data-[state=on]:text-text-primary data-[state=on]:border-gold",
        ],
      },
      size: {
        default: "h-10 px-3",
        sm: "h-8 px-2.5 text-xs",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ============================================
// Toggle Component
// ============================================

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

// ============================================
// Toggle Group Component
// ============================================

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

const toggleGroupVariants = cva("inline-flex items-center justify-center gap-1", {
  variants: {
    variant: {
      default: "bg-surface-tertiary p-1 rounded-lg",
      outline: "border border-border p-1 rounded-lg",
      ghost: "gap-2",
    },
    size: {
      default: "",
      sm: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleGroupVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn(toggleGroupVariants({ variant, size, className }))}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

// ============================================
// Toggle Group Item Component
// ============================================

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, variant = "default", size = "default", children, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
));

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

// ============================================
// Toggle Switch Component (Alternative to Toggle)
// ============================================

import * as SwitchPrimitive from "@radix-ui/react-switch";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-gold data-[state=unchecked]:bg-surface-tertiary",
        success: "data-[state=checked]:bg-success data-[state=unchecked]:bg-surface-tertiary",
        error: "data-[state=checked]:bg-error data-[state=unchecked]:bg-surface-tertiary",
      },
      size: {
        default: "h-6 w-11",
        sm: "h-5 w-9",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-text-primary shadow-lg ring-0 transition-transform",
  {
    variants: {
      size: {
        default: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        sm: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        lg: "h-6 w-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, variant, size, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(switchVariants({ variant, size, className }))}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb className={cn(switchThumbVariants({ size }))} />
  </SwitchPrimitive.Root>
));

Switch.displayName = SwitchPrimitive.Root.displayName;

// ============================================
// Content Toggle Component (for "Состав"/"Собрать блюдо")
// ============================================

interface ContentToggleProps {
  leftLabel: string;
  rightLabel: string;
  value: "left" | "right";
  onChange: (value: "left" | "right") => void;
  variant?: "default" | "outline" | "ghost";
}

const ContentToggle: React.FC<ContentToggleProps> = ({
  leftLabel,
  rightLabel,
  value,
  onChange,
  variant = "default",
}) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as "left" | "right")}
      variant={variant}
      className="w-full grid grid-cols-2"
    >
      <ToggleGroupItem value="left" variant={variant} className="w-full">
        {leftLabel}
      </ToggleGroupItem>
      <ToggleGroupItem value="right" variant={variant} className="w-full">
        {rightLabel}
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

// ============================================
// Segmented Control Component
// ============================================

interface SegmentedControlProps {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  variant?: "default" | "outline" | "ghost";
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  variant = "default",
}) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v)}
      variant={variant}
      className="w-full"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          variant={variant}
          className="flex-1"
        >
          {option.icon && <span className="mr-2">{option.icon}</span>}
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

// ============================================
// Exports
// ============================================

export {
  Toggle,
  toggleVariants,
  ToggleGroup,
  ToggleGroupItem,
  Switch,
  switchVariants,
  ContentToggle,
  SegmentedControl,
};
export default Toggle;
