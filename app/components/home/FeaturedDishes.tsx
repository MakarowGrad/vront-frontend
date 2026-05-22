"use client";

/**
 * FeaturedDishes Component
 * Grid: 2 columns with working cards
 */

import React from "react";
import { DishCard } from "@/app/components/dish/DishCard";
import { cn } from "@/lib/utils";
import { Dish } from "@/app/types";

interface FeaturedDishesProps {
  dishes: Dish[];
  filter?: "all" | "hit" | "new";
  className?: string;
}

export const FeaturedDishes: React.FC<FeaturedDishesProps> = ({
  dishes,
  filter = "all",
  className,
}) => {
  const filteredDishes = dishes.filter((dish) => {
    if (filter === "hit") return dish.isHit;
    if (filter === "new") return dish.isNew;
    return true;
  });

  if (filteredDishes.length === 0) return null;

  return (
    <section className={cn("max-w-[900px] mx-auto px-4 pb-6 w-full", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 items-stretch w-full">
        {filteredDishes.slice(0, 6).map((dish) => (
          <DishCard key={dish.id} dish={dish} variant="compact" className="h-full" />
        ))}
      </div>
    </section>
  );
};

export default FeaturedDishes;
