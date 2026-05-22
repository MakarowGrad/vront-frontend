/**
 * Skeleton Component
 * Premium loading skeleton component with shimmer effect
 * 
 * Features:
 * - Shimmer animation
 * - Multiple variants (text, circle, rectangle)
 * - Customizable sizes
 * - Pulse animation option
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// Skeleton Variants
// ============================================

const skeletonVariants = cva(
  "relative overflow-hidden bg-surface-tertiary",
  {
    variants: {
      variant: {
        // Text skeleton (for headings, paragraphs)
        text: "rounded-md",
        // Circle skeleton (for avatars, icons)
        circle: "rounded-full",
        // Rectangle skeleton (for cards, images)
        rectangle: "rounded-lg",
        // Rounded skeleton
        rounded: "rounded-xl",
      },
      // Animation type
      animation: {
        shimmer: "",
        pulse: "animate-pulse",
        none: "",
      },
    },
    defaultVariants: {
      variant: "text",
      animation: "shimmer",
    },
  }
);

// ============================================
// Skeleton Component
// ============================================

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant,
      animation,
      width,
      height,
      style,
      ...props
    },
    ref
  ) => {
    const customStyles: React.CSSProperties = {
      width: width,
      height: height,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant, animation }), className)}
        style={customStyles}
        {...props}
      >
        {animation === "shimmer" && (
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
            }}
          />
        )}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

// ============================================
// Text Skeleton Component
// ============================================

interface TextSkeletonProps extends Omit<SkeletonProps, "variant"> {
  lines?: number;
  lineHeight?: number;
  lastLineWidth?: string;
}

const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  lineHeight = 16,
  lastLineWidth = "60%",
  className,
  ...props
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height={lineHeight}
          width={index === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
};

// ============================================
// Avatar Skeleton Component
// ============================================

interface AvatarSkeletonProps extends Omit<SkeletonProps, "variant"> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({
  size = "md",
  className,
  ...props
}) => {
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
  };

  return (
    <Skeleton
      variant="circle"
      width={sizeMap[size]}
      height={sizeMap[size]}
      className={className}
      {...props}
    />
  );
};

// ============================================
// Card Skeleton Component
// ============================================

interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showFooter?: boolean;
  imageHeight?: number;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showImage = true,
  showTitle = true,
  showDescription = true,
  showFooter = true,
  imageHeight = 200,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-surface-secondary rounded-xl border border-border p-4 space-y-4",
        className
      )}
      {...props}
    >
      {showImage && (
        <Skeleton variant="rectangle" height={imageHeight} className="w-full" />
      )}
      {showTitle && <Skeleton variant="text" height={24} width="70%" />}
      {showDescription && (
        <div className="space-y-2">
          <Skeleton variant="text" height={16} width="100%" />
          <Skeleton variant="text" height={16} width="80%" />
        </div>
      )}
      {showFooter && (
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant="text" height={20} width="30%" />
          <Skeleton variant="rectangle" height={36} width={100} />
        </div>
      )}
    </div>
  );
};

// ============================================
// Food Card Skeleton Component
// ============================================

interface FoodCardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
}

const FoodCardSkeleton: React.FC<FoodCardSkeletonProps> = ({
  count = 1,
  className,
  ...props
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "bg-surface-secondary rounded-xl border border-border overflow-hidden",
            className
          )}
          {...props}
        >
          {/* Image */}
          <Skeleton variant="rectangle" height={180} className="w-full" animation="shimmer" />
          
          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <Skeleton variant="text" height={22} width="75%" />
            
            {/* Description */}
            <div className="space-y-1.5">
              <Skeleton variant="text" height={14} width="100%" />
              <Skeleton variant="text" height={14} width="60%" />
            </div>
            
            {/* Price and Button */}
            <div className="flex items-center justify-between pt-2">
              <Skeleton variant="text" height={24} width="30%" />
              <Skeleton variant="rectangle" height={36} width={90} className="rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

// ============================================
// List Item Skeleton Component
// ============================================

interface ListItemSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  showAvatar?: boolean;
  showSubtitle?: boolean;
  showAction?: boolean;
}

const ListItemSkeleton: React.FC<ListItemSkeletonProps> = ({
  showAvatar = true,
  showSubtitle = true,
  showAction = true,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 bg-surface-secondary rounded-lg",
        className
      )}
      {...props}
    >
      {showAvatar && <AvatarSkeleton size="md" />}
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height={18} width="40%" />
        {showSubtitle && <Skeleton variant="text" height={14} width="60%" />}
      </div>
      {showAction && <Skeleton variant="rectangle" height={32} width={80} />}
    </div>
  );
};

// ============================================
// Page Skeleton Component
// ============================================

interface PageSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  showHeader?: boolean;
  showFilters?: boolean;
  cardCount?: number;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({
  showHeader = true,
  showFilters = true,
  cardCount = 6,
  className,
  ...props
}) => {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Header */}
      {showHeader && (
        <div className="space-y-4">
          <Skeleton variant="text" height={36} width="40%" />
          <Skeleton variant="text" height={18} width="60%" />
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={36} width={100} />
          ))}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FoodCardSkeleton count={cardCount} />
      </div>
    </div>
  );
};

// ============================================
// Skeleton Group Component
// ============================================

interface SkeletonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  loading: boolean;
  fallback?: React.ReactNode;
}

const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  children,
  loading,
  fallback,
  className,
  ...props
}) => {
  if (loading) {
    return (
      <div className={cn("animate-pulse", className)} {...props}>
        {fallback || children}
      </div>
    );
  }

  return <>{children}</>;
};

// ============================================
// Exports
// ============================================

export {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  CardSkeleton,
  FoodCardSkeleton,
  ListItemSkeleton,
  PageSkeleton,
  SkeletonGroup,
  skeletonVariants,
};
export default Skeleton;
