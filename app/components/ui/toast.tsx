/**
 * Toast Component
 * Premium toast notification component with elegant animations
 * 
 * Built on Radix UI Toast primitive for accessibility
 */

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// Toast Context for Managing Toasts
// ============================================

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// ============================================
// Toast Provider Component
// ============================================

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <ToastViewport />
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onOpenChange={(open) => {
              if (!open) removeToast(toast.id);
            }}
          />
        ))}
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
};

// ============================================
// Toast Variants
// ============================================

const toastVariants = cva(
  "group relative pointer-events-auto flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-elevated transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: [
          "bg-surface-secondary border-border",
          "text-text-primary",
        ],
        success: [
          "bg-success/10 border-success/30",
          "text-success-light",
        ],
        error: [
          "bg-error/10 border-error/30",
          "text-error-light",
        ],
        warning: [
          "bg-warning/10 border-warning/30",
          "text-warning-light",
        ],
        info: [
          "bg-info/10 border-info/30",
          "text-info-light",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// ============================================
// Toast Viewport Component
// ============================================

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));

ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

// ============================================
// Toast Component
// ============================================

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
  VariantProps<typeof toastVariants> {
  title: string;
  description?: string;
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(
  ({ className, variant = "default", title, description, children, ...props }, ref) => {
    // Icon based on variant
    const Icon = () => {
      switch (variant) {
        case "success":
          return (
            <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          );
        case "error":
          return (
            <svg className="w-5 h-5 text-error flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          );
        case "warning":
          return (
            <svg className="w-5 h-5 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          );
        case "info":
          return (
            <svg className="w-5 h-5 text-info flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        default:
          return (
            <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
      }
    };

    return (
      <ToastPrimitive.Root
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start gap-3">
          <Icon />
          <div className="flex-1 grid gap-1">
            {title && (
              <ToastPrimitive.Title className="text-sm font-semibold">
                {title}
              </ToastPrimitive.Title>
            )}
            {description && (
              <ToastPrimitive.Description className="text-sm opacity-90">
                {description}
              </ToastPrimitive.Description>
            )}
          </div>
        </div>
        {children}
        <ToastPrimitive.Close
          className={cn(
            "absolute right-2 top-2 rounded-md p-1",
            "text-text-muted opacity-0 transition-opacity",
            "hover:text-text-primary hover:bg-surface-hover",
            "group-hover:opacity-100",
            "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gold"
          )}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
    );
  }
);

Toast.displayName = ToastPrimitive.Root.displayName;

// ============================================
// Toast Action Component
// ============================================

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-transparent px-3 text-sm font-medium transition-colors",
      "hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-gold disabled:pointer-events-none",
      className
    )}
    {...props}
  />
));

ToastAction.displayName = ToastPrimitive.Action.displayName;

// ============================================
// Toast Close Component
// ============================================

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-text-muted opacity-0 transition-opacity hover:text-text-primary focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </ToastPrimitive.Close>
));

ToastClose.displayName = ToastPrimitive.Close.displayName;

// ============================================
// Toast Title Component
// ============================================

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));

ToastTitle.displayName = ToastPrimitive.Title.displayName;

// ============================================
// Toast Description Component
// ============================================

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));

ToastDescription.displayName = ToastPrimitive.Description.displayName;

// ============================================
// Toast Hook for Easy Usage
// ============================================

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
}

export const toast = {
  success: (options: Omit<ToastOptions, "variant">) => {
    const event = new CustomEvent("toast", {
      detail: { ...options, variant: "success" },
    });
    window.dispatchEvent(event);
  },
  error: (options: Omit<ToastOptions, "variant">) => {
    const event = new CustomEvent("toast", {
      detail: { ...options, variant: "error" },
    });
    window.dispatchEvent(event);
  },
  warning: (options: Omit<ToastOptions, "variant">) => {
    const event = new CustomEvent("toast", {
      detail: { ...options, variant: "warning" },
    });
    window.dispatchEvent(event);
  },
  info: (options: Omit<ToastOptions, "variant">) => {
    const event = new CustomEvent("toast", {
      detail: { ...options, variant: "info" },
    });
    window.dispatchEvent(event);
  },
  default: (options: Omit<ToastOptions, "variant">) => {
    const event = new CustomEvent("toast", {
      detail: { ...options, variant: "default" },
    });
    window.dispatchEvent(event);
  },
};

// ============================================
// Simple Toast Component (without provider)
// ============================================

interface SimpleToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  action?: React.ReactNode;
}

const SimpleToast: React.FC<SimpleToastProps> = ({
  open,
  onOpenChange,
  title,
  description,
  variant = "default",
  action,
}) => {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastViewport />
      <Toast
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        variant={variant}
        duration={5000}
      >
        {action && <ToastAction altText="Action">{action}</ToastAction>}
      </Toast>
    </ToastPrimitive.Provider>
  );
};

// ============================================
// Exports
// ============================================

export {
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  SimpleToast,
  toastVariants,
};
export default Toast;
