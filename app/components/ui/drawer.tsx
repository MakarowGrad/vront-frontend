/**
 * Drawer Component
 * Premium slide-out drawer component for mobile and desktop
 * 
 * Features:
 * - Multiple anchor positions (left, right, top, bottom)
 * - Smooth animations
 * - Backdrop blur
 * - Swipe to close (on mobile)
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// Drawer Context
// ============================================

interface DrawerContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextType | undefined>(undefined);

const useDrawer = () => {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a Drawer");
  }
  return context;
};

// ============================================
// Drawer Variants
// ============================================

const drawerVariants = cva(
  "fixed z-50 bg-surface-secondary shadow-elevated-lg transition-transform duration-300 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      anchor: {
        left: "inset-y-0 left-0 h-full data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right: "inset-y-0 right-0 h-full data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        top: "inset-x-0 top-0 w-full data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 w-full data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
        xl: "",
        full: "",
      },
    },
    compoundVariants: [
      // Left/Right sizes
      { anchor: "left", size: "sm", className: "w-72" },
      { anchor: "left", size: "default", className: "w-80" },
      { anchor: "left", size: "lg", className: "w-96" },
      { anchor: "left", size: "xl", className: "w-[28rem]" },
      { anchor: "left", size: "full", className: "w-full max-w-md" },
      { anchor: "right", size: "sm", className: "w-72" },
      { anchor: "right", size: "default", className: "w-80" },
      { anchor: "right", size: "lg", className: "w-96" },
      { anchor: "right", size: "xl", className: "w-[28rem]" },
      { anchor: "right", size: "full", className: "w-full max-w-md" },
      // Top/Bottom sizes
      { anchor: "top", size: "sm", className: "h-auto max-h-48" },
      { anchor: "top", size: "default", className: "h-auto max-h-64" },
      { anchor: "top", size: "lg", className: "h-auto max-h-80" },
      { anchor: "top", size: "xl", className: "h-auto max-h-96" },
      { anchor: "top", size: "full", className: "h-full max-h-screen" },
      { anchor: "bottom", size: "sm", className: "h-auto max-h-48" },
      { anchor: "bottom", size: "default", className: "h-auto max-h-64" },
      { anchor: "bottom", size: "lg", className: "h-auto max-h-80" },
      { anchor: "bottom", size: "xl", className: "h-auto max-h-96" },
      { anchor: "bottom", size: "full", className: "h-full max-h-screen" },
    ],
    defaultVariants: {
      anchor: "right",
      size: "default",
    },
  }
);

// ============================================
// Drawer Root Component
// ============================================

interface DrawerProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DrawerRoot: React.FC<DrawerProps> = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  React.useEffect(() => {
    onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <DrawerContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

// ============================================
// Drawer Trigger Component
// ============================================

interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    const { setIsOpen } = useDrawer();

    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        onClick: () => setIsOpen(true),
        ...props,
      });
    }

    return (
      <button ref={ref} onClick={() => setIsOpen(true)} {...props}>
        {children}
      </button>
    );
  }
);

DrawerTrigger.displayName = "DrawerTrigger";

// ============================================
// Drawer Overlay Component
// ============================================

const DrawerOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, onClick, ...props }, ref) => {
  const { isOpen, setIsOpen } = useDrawer();

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      onClick={(e) => {
        setIsOpen(false);
        onClick?.(e);
      }}
      className={cn(
        "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm",
        "animate-in fade-in duration-200",
        className
      )}
      {...props}
    />
  );
});

DrawerOverlay.displayName = "DrawerOverlay";

// ============================================
// Drawer Content Component
// ============================================

interface DrawerContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  showCloseButton?: boolean;
  swipeToClose?: boolean;
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  (
    {
      className,
      anchor = "right",
      size = "default",
      showCloseButton = true,
      swipeToClose = true,
      children,
      ...props
    },
    ref
  ) => {
    const { isOpen, setIsOpen } = useDrawer();
    const contentRef = React.useRef<HTMLDivElement>(null);
    const touchStartY = React.useRef<number>(0);
    const touchStartX = React.useRef<number>(0);

    // Handle swipe to close
    const handleTouchStart = (e: React.TouchEvent) => {
      if (!swipeToClose) return;
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (!swipeToClose) return;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchEndY - touchStartY.current;
      const deltaX = touchEndX - touchStartX.current;

      // Swipe threshold
      const threshold = 100;

      if (anchor === "bottom" && deltaY > threshold) {
        setIsOpen(false);
      } else if (anchor === "top" && deltaY < -threshold) {
        setIsOpen(false);
      } else if (anchor === "right" && deltaX > threshold) {
        setIsOpen(false);
      } else if (anchor === "left" && deltaX < -threshold) {
        setIsOpen(false);
      }
    };

    // Handle escape key
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;

    return (
      <>
        <DrawerOverlay />
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={cn(
            drawerVariants({ anchor, size }),
            anchor === "left" || anchor === "right"
              ? "flex flex-col"
              : "",
            className
          )}
          {...props}
        >
          {/* Swipe Handle (for bottom/top drawers) */}
          {(anchor === "bottom" || anchor === "top") && swipeToClose && (
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 rounded-full bg-border" />
            </div>
          )}

          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={() => setIsOpen(false)}
              className={cn(
                "absolute z-10 rounded-full p-2",
                "text-text-muted hover:text-text-primary hover:bg-surface-hover",
                "transition-colors duration-200",
                anchor === "left" || anchor === "right"
                  ? "right-4 top-4"
                  : "right-4 top-4"
              )}
              aria-label="Close drawer"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Content */}
          <div ref={contentRef} className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </>
    );
  }
);

DrawerContent.displayName = "DrawerContent";

// ============================================
// Drawer Header Component
// ============================================

const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 p-6 pb-4",
      className
    )}
    {...props}
  />
));

DrawerHeader.displayName = "DrawerHeader";

// ============================================
// Drawer Title Component
// ============================================

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "font-serif text-xl font-semibold text-text-primary",
      className
    )}
    {...props}
  />
));

DrawerTitle.displayName = "DrawerTitle";

// ============================================
// Drawer Description Component
// ============================================

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-text-muted", className)}
    {...props}
  />
));

DrawerDescription.displayName = "DrawerDescription";

// ============================================
// Drawer Footer Component
// ============================================

const DrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4 mt-auto border-t border-border",
      className
    )}
    {...props}
  />
));

DrawerFooter.displayName = "DrawerFooter";

// ============================================
// Drawer Close Component
// ============================================

interface DrawerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ asChild, children, ...props }, ref) => {
    const { setIsOpen } = useDrawer();

    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        onClick: () => setIsOpen(false),
        ...props,
      });
    }

    return (
      <button ref={ref} onClick={() => setIsOpen(false)} {...props}>
        {children}
      </button>
    );
  }
);

DrawerClose.displayName = "DrawerClose";

// ============================================
// Main Drawer Component
// ============================================

const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Footer: DrawerFooter,
  Close: DrawerClose,
  Overlay: DrawerOverlay,
});

// ============================================
// Exports
// ============================================

export {
  Drawer,
  DrawerRoot,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerOverlay,
  drawerVariants,
  useDrawer,
};
export default Drawer;
