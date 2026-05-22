/**
 * Sheet Component
 * Premium side sheet component for overlays and panels
 * 
 * Built on Radix UI Dialog primitive for accessibility
 * Features:
 * - Multiple side positions (left, right, top, bottom)
 * - Smooth animations
 * - Backdrop blur
 * - Customizable sizes
 */

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// Sheet Variants
// ============================================

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-surface-secondary p-6 shadow-elevated-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-border data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t border-border data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-[85vw] max-w-[320px] sm:max-w-sm border-r border-border data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right: "inset-y-0 right-0 h-full w-[85vw] max-w-[320px] sm:max-w-sm border-l border-border data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
      },
      size: {
        default: "",
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
        full: "sm:max-w-full",
      },
    },
    compoundVariants: [
      { side: "top", size: "default", className: "h-auto max-h-64" },
      { side: "top", size: "sm", className: "h-auto max-h-48" },
      { side: "top", size: "md", className: "h-auto max-h-80" },
      { side: "top", size: "lg", className: "h-auto max-h-96" },
      { side: "top", size: "xl", className: "h-auto max-h-[28rem]" },
      { side: "top", size: "full", className: "h-full max-h-screen" },
      { side: "bottom", size: "default", className: "h-auto max-h-64" },
      { side: "bottom", size: "sm", className: "h-auto max-h-48" },
      { side: "bottom", size: "md", className: "h-auto max-h-80" },
      { side: "bottom", size: "lg", className: "h-auto max-h-96" },
      { side: "bottom", size: "xl", className: "h-auto max-h-[28rem]" },
      { side: "bottom", size: "full", className: "h-full max-h-screen" },
    ],
    defaultVariants: {
      side: "right",
      size: "default",
    },
  }
);

// ============================================
// Sheet Root Components
// ============================================

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

// ============================================
// Sheet Overlay Component
// ============================================

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

// ============================================
// Sheet Content Component
// ============================================

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(
  (
    { side = "right", size = "default", showCloseButton = true, className, children, ...props },
    ref
  ) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side, size }), className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            className={cn(
              "absolute right-4 top-4 rounded-full p-2",
              "text-text-muted opacity-70",
              "transition-opacity hover:opacity-100 hover:bg-surface-hover hover:text-text-primary",
              "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface-secondary",
              "disabled:pointer-events-none"
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
);

SheetContent.displayName = SheetPrimitive.Content.displayName;

// ============================================
// Sheet Header Component
// ============================================

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);

SheetHeader.displayName = "SheetHeader";

// ============================================
// Sheet Footer Component
// ============================================

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);

SheetFooter.displayName = "SheetFooter";

// ============================================
// Sheet Title Component
// ============================================

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      "font-serif text-lg font-semibold text-text-primary",
      className
    )}
    {...props}
  />
));

SheetTitle.displayName = SheetPrimitive.Title.displayName;

// ============================================
// Sheet Description Component
// ============================================

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-text-muted", className)}
    {...props}
  />
));

SheetDescription.displayName = SheetPrimitive.Description.displayName;

// ============================================
// Cart Sheet Component (Pre-configured)
// ============================================

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const CartSheet: React.FC<CartSheetProps> = ({
  open,
  onOpenChange,
  title = "Корзина",
  children,
  footer,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" size="md" className="flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto py-4">{children}</div>
        {footer && (
          <SheetFooter className="border-t border-border pt-4">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

// ============================================
// Filter Sheet Component (Pre-configured)
// ============================================

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  onApply?: () => void;
  onReset?: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({
  open,
  onOpenChange,
  title = "Фильтры",
  children,
  onApply,
  onReset,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" size="md" className="flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto py-4">{children}</div>
        <SheetFooter className="border-t border-border pt-4 gap-2">
          {onReset && (
            <SheetClose asChild>
              <button
                onClick={onReset}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-text-secondary hover:bg-surface-hover transition-colors"
              >
                Сбросить
              </button>
            </SheetClose>
          )}
          {onApply && (
            <button
              onClick={onApply}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gold text-background-primary font-medium hover:bg-gold-400 transition-colors"
            >
              Применить
            </button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

// ============================================
// Exports
// ============================================

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  CartSheet,
  FilterSheet,
  sheetVariants,
};
export default Sheet;
