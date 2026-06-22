"use client";

/**
 * MenuSection Component
 * Hero-like menu block: categories on the left, hit/new dish cards on the right
 */

import React from "react";
import Link from "next/link";
import { DishCard } from "@/app/components/dish/DishCard";
import { useCategories } from "@/app/hooks/useCategories";
import { useDishes, useHitDishes, useNewDishes } from "@/app/hooks/useDishes";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export const MenuSection: React.FC = () => {
  const { data: categories = [] } = useCategories();
  const { data: hitDishes = [] } = useHitDishes();
  const { data: newDishes = [] } = useNewDishes();
  const { data: allDishes = [] } = useDishes({ limit: 4 });

  // Only active categories with dishes
  const activeCategories = categories
    .filter((cat) => cat.isActive && (cat.dishCount ?? 0) > 0)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  // 2 hits + 2 new, fallback to any 4 dishes if no featured
  const featuredDishes =
    hitDishes.length > 0 || newDishes.length > 0
      ? [...hitDishes.slice(0, 2), ...newDishes.slice(0, 2)].slice(0, 4)
      : allDishes.slice(0, 4);

  return (
    <section className="w-full bg-background-primary py-4">
      <div className="max-w-[900px] mx-auto px-4">
        {/* Section title */}
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-text-primary text-center mb-4">
          МЕНЮ
        </h2>

        <div className="flex gap-3 items-start">
          {/* Left column: categories */}
          <nav className="w-[38%] sm:w-[35%] flex-shrink-0" aria-label="Категории меню">
            <ul className="space-y-2">
              {activeCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/catalog?category=${category.slug}`}
                    className={cn(
                      "block w-full px-3 py-3 rounded-xl",
                      "bg-surface-secondary border-2 border-border",
                      "text-text-primary text-sm sm:text-base font-medium text-center",
                      "shadow-md active:scale-[0.98]",
                      "transition-all duration-150",
                      "hover:border-gold hover:bg-surface hover:text-gold",
                      "active:bg-surface-tertiary"
                    )}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right column: featured dishes */}
          <div className="flex-1 min-w-0">
            {featuredDishes.length > 0 ? (
              <div className="flex flex-col gap-3">
                {featuredDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    variant="compact"
                    className="h-full"
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4 bg-surface-secondary rounded-2xl border border-border">
                <p className="text-text-muted text-sm">Пока нет хитов и новинок</p>
              </div>
            )}
          </div>
        </div>

        {/* Link to full catalog */}
        <div className="mt-5 flex justify-center">
          <Link
            href="/catalog"
            className={cn(
              "inline-flex items-center gap-1 px-5 py-3 rounded-xl",
              "bg-gold text-background-primary font-semibold",
              "hover:bg-gold-light active:scale-[0.98] transition-all"
            )}
          >
            Смотреть всё меню
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
