/**
 * Badge Component
 * Premium badge component for labels, status indicators, and tags
 * 
 * Variants:
 * - default: Gold badge for premium/hit items
 * - secondary: Dark surface badge
 * - outline: Bordered badge
 * - destructive: Error/warning badge
 * - success: Success/available badge
 * - new: New item badge
 * - unavailable: Out of stock badge
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// Badge Variants
// ============================================

const badgeVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-1.5 font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-200",
  {
    variants: {
      variant: {
        // Default Gold Badge (for "Хит" / Hit items)
        default: [
          "bg-gradient-to-r from-gold to-gold-400",
          "text-background-primary",
          "shadow-sm shadow-gold/20",
        ],

        // Secondary Dark Badge
        secondary: [
          "bg-surface-secondary",
          "text-text-secondary",
          "border border-border",
        ],

        // Outline Badge
        outline: [
          "bg-transparent",
          "text-text-secondary",
          "border border-border",
          "hover:border-gold/50 hover:text-text-primary",
        ],

        // Ghost Badge
        ghost: [
          "bg-transparent",
          "text-text-muted",
          "hover:text-text-secondary",
        ],

        // Destructive Badge (for errors/warnings)
        destructive: [
          "bg-error",
          "text-white",
          "shadow-sm shadow-error/20",
        ],

        // Success Badge (for available items)
        success: [
          "bg-success",
          "text-white",
          "shadow-sm shadow-success/20",
        ],

        // New Badge (for new items)
        new: [
          "bg-success",
          "text-white",
          "shadow-sm shadow-success/20",
        ],

        // Unavailable Badge (for out of stock)
        unavailable: [
          "bg-surface-tertiary",
          "text-text-muted",
        ],

        // Premium Badge (shiny gold)
        premium: [
          "bg-gradient-to-r from-gold via-gold-400 to-gold",
          "text-background-primary",
          "shadow-md shadow-gold/30",
        ],

        // Info Badge
        info: [
          "bg-info",
          "text-white",
          "shadow-sm shadow-info/20",
        ],

        // Warning Badge
        warning: [
          "bg-warning",
          "text-background-primary",
          "shadow-sm shadow-warning/20",
        ],
      },

      // Size variants
      size: {
        default: "px-2.5 py-1 text-xs rounded-full",
        sm: "px-2 py-0.5 text-[10px] rounded-full",
        lg: "px-3 py-1.5 text-sm rounded-full",
        xl: "px-4 py-2 text-sm rounded-full",
      },

      // Shape variants
      shape: {
        default: "rounded-full",
        square: "rounded-md",
        pill: "rounded-full",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
);

// ============================================
// Badge Component Interface
// ============================================

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
  removable?: boolean;
  onRemove?: () => void;
}

// ============================================
// Badge Component
// ============================================

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      dot = false,
      dotColor,
      removable = false,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, shape }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0",
              dotColor || "bg-current"
            )}
          />
        )}
        {children}
        {removable && (
          <button
            onClick={onRemove}
            className="ml-1 -mr-0.5 p-0.5 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Remove"
          >
            <svg
              className="w-3 h-3"
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
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = "Badge";

// ============================================
// Status Badge Component (Pre-configured)
// ============================================

interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: "available" | "unavailable" | "limited" | "preorder" | "new" | "hit";
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, children, ...props }, ref) => {
    const statusConfig = {
      available: { variant: "success" as const, label: "В наличии" },
      unavailable: { variant: "unavailable" as const, label: "Недоступно" },
      limited: { variant: "warning" as const, label: "Ограниченное количество" },
      preorder: { variant: "info" as const, label: "Предзаказ" },
      new: { variant: "new" as const, label: "Новинка" },
      hit: { variant: "default" as const, label: "Хит" },
    };

    const config = statusConfig[status];

    return (
      <Badge ref={ref} variant={config.variant} {...props}>
        {children || config.label}
      </Badge>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

// ============================================
// Dot Badge Component (Status indicator)
// ============================================

interface DotBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: "green" | "red" | "yellow" | "blue" | "gold" | "gray";
  pulse?: boolean;
  size?: "sm" | "md" | "lg";
}

const DotBadge = React.forwardRef<HTMLSpanElement, DotBadgeProps>(
  ({ color = "green", pulse = false, size = "md", className, ...props }, ref) => {
    const colorClasses = {
      green: "bg-success",
      red: "bg-error",
      yellow: "bg-warning",
      blue: "bg-info",
      gold: "bg-gold",
      gray: "bg-text-muted",
    };

    const sizeClasses = {
      sm: "w-2 h-2",
      md: "w-2.5 h-2.5",
      lg: "w-3 h-3",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex rounded-full",
          colorClasses[color],
          sizeClasses[size],
          pulse && "animate-pulse",
          className
        )}
        {...props}
      />
    );
  }
);

DotBadge.displayName = "DotBadge";

// ============================================
// Badge Group Component
// ============================================

interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: "sm" | "md" | "lg";
}

const BadgeGroup = React.forwardRef<HTMLDivElement, BadgeGroupProps>(
  ({ children, gap = "md", className, ...props }, ref) => {
    const gapClasses = {
      sm: "gap-1",
      md: "gap-2",
      lg: "gap-3",
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap items-center", gapClasses[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BadgeGroup.displayName = "BadgeGroup";

// ============================================
// Exports
// ============================================

export { Badge, badgeVariants, StatusBadge, DotBadge, BadgeGroup };
export default Badge;
