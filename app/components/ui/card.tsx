/**
 * Card Component
 * Premium card component with luxury hover states for food delivery app
 * 
 * Features:
 * - Multiple variants (default, elevated, outlined, ghost)
 * - Hover lift effect with shadow transition
 * - Optional gold accent border
 * - Support for header, content, footer sections
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// Card Variants
// ============================================

const cardVariants = cva(
  // Base styles
  "relative overflow-hidden transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        // Default card with subtle background
        default: [
          "bg-surface-secondary",
          "border border-border",
          "shadow-card",
          "hover:shadow-card-hover hover:-translate-y-1",
        ],

        // Elevated card with stronger shadow
        elevated: [
          "bg-surface-secondary",
          "border border-border-light",
          "shadow-elevated",
          "hover:shadow-elevated-lg hover:-translate-y-1.5",
        ],

        // Outlined card with visible border
        outlined: [
          "bg-transparent",
          "border-2 border-border",
          "shadow-none",
          "hover:border-gold/50 hover:bg-surface-secondary/30",
        ],

        // Ghost card - minimal styling
        ghost: [
          "bg-transparent",
          "border border-transparent",
          "shadow-none",
          "hover:bg-surface-secondary/50",
        ],

        // Gold accent card
        gold: [
          "bg-surface-secondary",
          "border border-gold/30",
          "shadow-glow-sm",
          "hover:border-gold/50 hover:shadow-glow",
        ],

        // Interactive card with stronger hover
        interactive: [
          "bg-surface-secondary",
          "border border-border",
          "shadow-card",
          "cursor-pointer",
          "hover:shadow-card-hover hover:-translate-y-1.5 hover:border-gold/30",
          "active:scale-[0.99] active:translate-y-0",
        ],
      },

      // Size variants
      size: {
        default: "rounded-xl",
        sm: "rounded-lg",
        lg: "rounded-2xl",
        xl: "rounded-3xl",
        none: "rounded-none",
      },

      // Padding variants
      padding: {
        default: "p-4",
        none: "p-0",
        sm: "p-3",
        lg: "p-6",
        xl: "p-8",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      padding: "default",
    },
  }
);

// ============================================
// Card Component Interface
// ============================================

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
  clickable?: boolean;
}

// ============================================
// Card Component
// ============================================

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant, size, padding, clickable = false, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size, padding }),
          clickable && "cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// ============================================
// Card Header Component
// ============================================

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-4",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// ============================================
// Card Title Component
// ============================================

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-serif font-semibold leading-tight tracking-tight text-text-primary",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// ============================================
// Card Description Component
// ============================================

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-text-muted leading-relaxed",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// ============================================
// Card Content Component
// ============================================

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 pt-0", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// ============================================
// Card Footer Component
// ============================================

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-4 pt-0",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// ============================================
// Card Image Component
// ============================================

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: "square" | "video" | "food" | "auto";
  overlay?: React.ReactNode;
}

const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, aspectRatio = "food", overlay, src, alt, ...props }, ref) => {
    const aspectRatioClasses = {
      square: "aspect-square",
      video: "aspect-video",
      food: "aspect-[4/3]",
      auto: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          aspectRatioClasses[aspectRatio],
          className
        )}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          {...props}
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
            {overlay}
          </div>
        )}
      </div>
    );
  }
);

CardImage.displayName = "CardImage";

// ============================================
// Card Badge Component
// ============================================

const CardBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "hit" | "new" | "unavailable" }
>(({ className, variant = "hit", children, ...props }, ref) => {
  const variantClasses = {
    hit: "bg-gradient-to-r from-gold to-gold-400 text-background-primary",
    new: "bg-success text-white",
    unavailable: "bg-surface-tertiary text-text-muted",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider z-10",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardBadge.displayName = "CardBadge";

// ============================================
// Food Card Component (Pre-configured)
// ============================================

interface FoodCardProps extends Omit<CardProps, "children"> {
  image: string;
  title: string;
  description?: string;
  price: number;
  weight?: string;
  badge?: "hit" | "new" | "unavailable";
  badgeText?: string;
  onAddToCart?: () => void;
  onClick?: () => void;
}

const FoodCard = React.forwardRef<HTMLDivElement, FoodCardProps>(
  (
    {
      image,
      title,
      description,
      price,
      weight,
      badge,
      badgeText,
      onAddToCart,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        variant="interactive"
        padding="none"
        className={cn("group", className)}
        onClick={onClick}
        {...props}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {badge && (
            <CardBadge variant={badge}>
              {badgeText || (badge === "hit" ? "Хит" : badge === "new" ? "Новинка" : "Недоступно")}
            </CardBadge>
          )}
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            {onAddToCart && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart();
                }}
                className="px-6 py-2.5 bg-gold text-background-primary font-medium rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:brightness-110"
              >
                В корзину
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="font-serif font-semibold text-lg text-text-primary mb-1 line-clamp-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-text-muted line-clamp-2 mb-3">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="font-mono font-semibold text-xl text-gold">
              {price.toLocaleString("ru-RU")} ₽
            </span>
            {weight && (
              <span className="text-sm text-text-muted">{weight}</span>
            )}
          </div>
        </div>
      </Card>
    );
  }
);

FoodCard.displayName = "FoodCard";

// ============================================
// Exports
// ============================================

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  CardBadge,
  FoodCard,
  cardVariants,
};
export default Card;
