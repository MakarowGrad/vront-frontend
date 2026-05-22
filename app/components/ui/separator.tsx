/**
 * Separator Component
 * Premium separator/divider component for visual separation
 * 
 * Built on Radix UI Separator primitive for accessibility
 */

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// Separator Variants
// ============================================

const separatorVariants = cva("shrink-0", {
  variants: {
    variant: {
      // Default subtle separator
      default: "bg-border",
      // Light separator
      light: "bg-border-light",
      // Gold accent separator
      gold: "bg-gold/30",
      // Gradient separator
      gradient: "",
      // Dashed separator
      dashed: "border-dashed bg-transparent border-border",
    },
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
    thickness: {
      thin: "",
      default: "",
      thick: "",
    },
  },
  compoundVariants: [
    { orientation: "horizontal", thickness: "thin", className: "h-px" },
    { orientation: "horizontal", thickness: "default", className: "h-px" },
    { orientation: "horizontal", thickness: "thick", className: "h-0.5" },
    { orientation: "vertical", thickness: "thin", className: "w-px" },
    { orientation: "vertical", thickness: "default", className: "w-px" },
    { orientation: "vertical", thickness: "thick", className: "w-0.5" },
  ],
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
    thickness: "default",
  },
});

// ============================================
// Separator Component
// ============================================

interface SeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>, 'orientation'>,
    VariantProps<typeof separatorVariants> {
  decorative?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { className, orientation = "horizontal", decorative = true, variant, thickness, ...props },
    ref
  ) => {
    // Gradient separator needs special handling
    if (variant === "gradient") {
      return (
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={cn(
            "shrink-0",
            orientation === "horizontal"
              ? "h-px w-full"
              : "h-full w-px",
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "w-full h-full",
              orientation === "horizontal"
                ? "bg-gradient-to-r from-transparent via-border to-transparent"
                : "bg-gradient-to-b from-transparent via-border to-transparent"
            )}
          />
        </SeparatorPrimitive.Root>
      );
    }

    // Dashed separator needs special handling
    if (variant === "dashed") {
      return (
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={cn(
            "shrink-0",
            orientation === "horizontal"
              ? "w-full border-t border-dashed"
              : "h-full border-l border-dashed",
            "border-border",
            className
          )}
          {...props}
        />
      );
    }

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(separatorVariants({ variant, orientation, thickness }), className)}
        {...props}
      />
    );
  }
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

// ============================================
// Divider with Text Component
// ============================================

interface DividerWithTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  position?: "left" | "center" | "right";
  variant?: "default" | "gold";
}

const DividerWithText = React.forwardRef<HTMLDivElement, DividerWithTextProps>(
  ({ text, position = "center", variant = "default", className, ...props }, ref) => {
    const positionClasses = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center",
          positionClasses[position],
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 flex items-center">
          <div
            className={cn(
              "w-full border-t",
              variant === "gold" ? "border-gold/30" : "border-border"
            )}
          />
        </div>
        <span
          className={cn(
            "relative px-4 text-sm font-medium uppercase tracking-wider",
            variant === "gold" ? "text-gold bg-surface-secondary" : "text-text-muted bg-surface-secondary"
          )}
        >
          {text}
        </span>
      </div>
    );
  }
);

DividerWithText.displayName = "DividerWithText";

// ============================================
// Section Divider Component
// ============================================

interface SectionDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

const SectionDivider = React.forwardRef<HTMLDivElement, SectionDividerProps>(
  ({ title, subtitle, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("py-8", className)}
        {...props}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-border" />
          {(title || subtitle) && (
            <div className="text-center">
              {title && (
                <h3 className="font-serif text-lg font-semibold text-text-primary">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-text-muted mt-1">{subtitle}</p>
              )}
            </div>
          )}
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-border" />
        </div>
      </div>
    );
  }
);

SectionDivider.displayName = "SectionDivider";

// ============================================
// Gold Divider Component
// ============================================

const GoldDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent",
        className
      )}
      {...props}
    />
  );
});

GoldDivider.displayName = "GoldDivider";

// ============================================
// Exports
// ============================================

export {
  Separator,
  DividerWithText,
  SectionDivider,
  GoldDivider,
  separatorVariants,
};
export default Separator;
