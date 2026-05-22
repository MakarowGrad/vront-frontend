"use client";

/**
 * Home Page - Root
 * New landing page with Hero, Actions, Filters, Dishes Grid
 */

import React, { useState } from "react";
import { HeroSection } from "@/app/components/home/HeroSection";
import { HeroActions } from "@/app/components/home/HeroActions";
import { FilterButtons } from "@/app/components/home/FilterButtons";
import { FeaturedDishes } from "@/app/components/home/FeaturedDishes";
import { useDishes, useHitDishes, useNewDishes } from "@/app/hooks/useDishes";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "hit" | "new">("hit");
  const { data: allDishes = [], isLoading: isLoadingAll } = useDishes({ limit: 100 });
  const { data: hitDishes = [], isLoading: isLoadingHit } = useHitDishes();
  const { data: newDishes = [], isLoading: isLoadingNew } = useNewDishes();

  const dishes = activeFilter === "hit" ? hitDishes : activeFilter === "new" ? newDishes : allDishes;
  const isLoading = activeFilter === "hit" ? isLoadingHit : activeFilter === "new" ? isLoadingNew : isLoadingAll;

  return (
    <div className="relative bg-background-primary">
      {/* Hero Section */}
      <HeroSection />

      {/* Hero Actions - Buttons */}
      <HeroActions />

      {/* Filter Buttons - Все / Хит / Новинка */}
      <FilterButtons onFilterChange={setActiveFilter} />

      {/* Dishes Grid - 2 columns on mobile */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : (
        <FeaturedDishes dishes={dishes} filter={activeFilter} />
      )}
    </div>
  );
}
