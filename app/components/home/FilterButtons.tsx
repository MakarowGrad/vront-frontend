"use client";

/**
 * FilterButtons Component - Mobile optimized
 * Two filter pills: "Новинки" and "Хит"
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface FilterButtonsProps {
  onFilterChange?: (filter: "new" | "hit") => void;
  className?: string;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  onFilterChange,
  className,
}) => {
  const [activeFilter, setActiveFilter] = useState<"new" | "hit">("new");

  const handleFilterClick = (filter: "new" | "hit") => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <div id="menu-section" className={cn("max-w-[900px] mx-auto px-4 py-4", className)}>
      <div className="flex justify-center gap-2">
        {/* Новинки */}
        <button
          onClick={() => handleFilterClick("new")}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-medium transition-all",
            activeFilter === "new"
              ? "bg-gold text-background-primary font-semibold"
              : "bg-surface text-text-secondary border border-border hover:border-gold"
          )}
        >
          Новинки
        </button>

        {/* Хит */}
        <button
          onClick={() => handleFilterClick("hit")}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-medium transition-all",
            activeFilter === "hit"
              ? "bg-gold text-background-primary font-semibold"
              : "bg-surface text-text-secondary border border-border hover:border-gold"
          )}
        >
          Хит
        </button>
      </div>
    </div>
  );
};

export default FilterButtons;
