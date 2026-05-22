"use client";

/**
 * CategoryGrid Component
 * Featured categories grid with elegant cards and hover effects
 */

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCategories } from "@/app/hooks/useCategories";
import { Category } from "@/app/types";

// ============================================
// Types
// ============================================

interface CategoryGridProps {
  className?: string;
}

// ============================================
// Category Icons Mapping
// ============================================

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  appetizers: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  soups: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  salads: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  "main-courses": ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  desserts: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
    </svg>
  ),
  beverages: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

// Default icon for categories without specific icon
const DefaultIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

// ============================================
// Arrow Icon
// ============================================

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// ============================================
// CategoryCard Component
// ============================================

interface CategoryCardProps {
  category: Category;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  const IconComponent = categoryIcons[category.slug] || DefaultIcon;

  return (
    <Link
      href={`/catalog?category=${category.slug}`}
      className={cn(
        "group relative flex flex-col items-center p-6 lg:p-8",
        "bg-surface-secondary rounded-2xl border border-border",
        "transition-all duration-300 ease-out",
        "hover:border-gold/30 hover:bg-surface",
        "hover:shadow-lg hover:shadow-gold/5",
        "hover:-translate-y-1"
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Icon Container */}
      <div className="relative mb-4">
        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-surface-tertiary flex items-center justify-center transition-all duration-300 group-hover:bg-gold/10 group-hover:scale-110">
          <IconComponent className="w-8 h-8 lg:w-10 lg:h-10 text-gold transition-transform duration-300 group-hover:scale-110" />
        </div>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Category Name */}
      <h3 className="font-serif text-heading-sm text-text-primary text-center mb-2 group-hover:text-gold transition-colors duration-300">
        {category.name}
      </h3>

      {/* Description */}
      <p className="text-body-xs text-text-muted text-center mb-4 line-clamp-2">
        {category.description}
      </p>

      {/* Link indicator */}
      <div className="flex items-center gap-1 text-body-xs text-gold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <span>Смотреть</span>
        <ArrowRightIcon className="w-3 h-3" />
      </div>
    </Link>
  );
};

// ============================================
// CategoryGrid Component
// ============================================

export const CategoryGrid: React.FC<CategoryGridProps> = ({ className }) => {
  const { data: categories = [] } = useCategories();
  return (
    <section className={cn("py-16 lg:py-24", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block text-caption uppercase tracking-wider text-gold mb-3">
            Категории
          </span>
          <h2 className="font-serif text-display-sm md:text-display-md text-text-primary mb-4">
            Выберите по вкусу
          </h2>
          <p className="text-body-md text-text-secondary max-w-2xl mx-auto">
            От изысканных закусок до десертов — найдите идеальное блюдо для любого случая
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
