/**
 * Tabs Component
 * Premium tab navigation component with elegant styling
 * 
 * Built on Radix UI Tabs primitive for accessibility
 */

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// Tabs Variants
// ============================================

const tabsListVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        // Default underline tabs
        default: "w-full border-b border-border",
        // Pill-style tabs
        pills: "gap-1 p-1 bg-surface-tertiary rounded-lg",
        // Boxed tabs
        boxed: "gap-1 p-1 bg-surface-secondary border border-border rounded-lg",
        // Ghost tabs (minimal)
        ghost: "gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          "relative px-4 py-3 text-sm text-text-muted",
          "hover:text-text-secondary",
          "data-[state=active]:text-text-primary",
          "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
          "after:bg-gold after:scale-x-0 after:transition-transform after:duration-200",
          "data-[state=active]:after:scale-x-100",
        ],
        pills: [
          "px-4 py-2 text-sm text-text-muted rounded-md",
          "hover:text-text-secondary hover:bg-surface-hover",
          "data-[state=active]:bg-gold data-[state=active]:text-background-primary",
          "data-[state=active]:shadow-sm",
        ],
        boxed: [
          "px-4 py-2 text-sm text-text-muted rounded-md border border-transparent",
          "hover:text-text-secondary hover:bg-surface-hover",
          "data-[state=active]:bg-surface-tertiary data-[state=active]:text-text-primary",
          "data-[state=active]:border-border",
        ],
        ghost: [
          "px-2 py-2 text-sm text-text-muted",
          "hover:text-text-secondary",
          "data-[state=active]:text-gold",
          "border-b-2 border-transparent",
          "data-[state=active]:border-gold",
        ],
      },
      size: {
        default: "text-sm",
        sm: "text-xs py-2",
        lg: "text-base py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const tabsContentVariants = cva(
  "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "",
        pills: "mt-4",
        boxed: "mt-4",
        ghost: "mt-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// ============================================
// Tabs Root Components
// ============================================

const Tabs = TabsPrimitive.Root;

// ============================================
// Tabs List Component
// ============================================

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
));

TabsList.displayName = TabsPrimitive.List.displayName;

// ============================================
// Tabs Trigger Component
// ============================================

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size }), className)}
    {...props}
  />
));

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// ============================================
// Tabs Content Component
// ============================================

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> &
    VariantProps<typeof tabsContentVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant }), className)}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

// ============================================
// Food Tabs Component (Pre-configured)
// ============================================

interface FoodTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: React.ReactNode;
}

const FoodTabs: React.FC<FoodTabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  children,
}) => {
  return (
    <Tabs defaultValue={defaultTab || tabs[0]?.id} onValueChange={onChange}>
      <TabsList variant="pills" className="w-full sm:w-auto">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} variant="pills" className="flex-1 sm:flex-none">
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
};

// ============================================
// Category Tabs Component (Pre-configured)
// ============================================

interface CategoryTabsProps {
  categories: { id: string; name: string; count?: number }[];
  defaultCategory?: string;
  onChange?: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  defaultCategory,
  onChange,
}) => {
  return (
    <Tabs
      defaultValue={defaultCategory || categories[0]?.id}
      onValueChange={onChange}
      className="w-full"
    >
      <TabsList variant="default" className="w-full overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id} variant="default">
            {category.name}
            {category.count !== undefined && (
              <span className="ml-2 text-xs text-text-muted">({category.count})</span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

// ============================================
// Toggle Tabs Component (for "Состав"/"Собрать блюдо")
// ============================================

interface ToggleTabsProps {
  leftLabel: string;
  rightLabel: string;
  defaultValue?: "left" | "right";
  onChange?: (value: "left" | "right") => void;
}

const ToggleTabs: React.FC<ToggleTabsProps> = ({
  leftLabel,
  rightLabel,
  defaultValue = "left",
  onChange,
}) => {
  return (
    <Tabs
      defaultValue={defaultValue}
      onValueChange={(v) => onChange?.(v as "left" | "right")}
      className="w-full"
    >
      <TabsList variant="boxed" className="w-full grid grid-cols-2">
        <TabsTrigger value="left" variant="boxed">
          {leftLabel}
        </TabsTrigger>
        <TabsTrigger value="right" variant="boxed">
          {rightLabel}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

// ============================================
// Exports
// ============================================

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  FoodTabs,
  CategoryTabs,
  ToggleTabs,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
};
export default Tabs;
