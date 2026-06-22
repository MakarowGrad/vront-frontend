/**
 * CategoryFilter Component
 * Horizontal category tabs for filtering dishes
 */

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '@/app/types';
import { cn } from '@/app/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  activeCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  activeCategoryId,
  onCategoryChange,
  className,
}: CategoryFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollability, 300);
    }
  };

  const handleScroll = () => {
    checkScrollability();
  };

  return (
    <div className={cn('relative', className)}>
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 z-10',
            'w-8 h-8 rounded-full',
            'flex items-center justify-center',
            'bg-surface-secondary border border-border',
            'text-text-secondary hover:text-text-primary',
            'transition-all duration-200 hover:scale-110',
            'shadow-lg'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Categories */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={cn(
          'flex gap-2 overflow-x-auto scrollbar-hide',
          'py-2 px-1',
          canScrollLeft && 'pl-10',
          canScrollRight && 'pr-10'
        )}
      >
        {/* Category Buttons -- no "All" button, first category selected by default */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'flex-shrink-0 px-5 py-2.5 rounded-full',
              'text-body-sm font-medium whitespace-nowrap',
              'transition-all duration-200',
              activeCategoryId === category.id
                ? 'bg-gold text-background'
                : 'bg-surface-tertiary text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 z-10',
            'w-8 h-8 rounded-full',
            'flex items-center justify-center',
            'bg-surface-secondary border border-border',
            'text-text-secondary hover:text-text-primary',
            'transition-all duration-200 hover:scale-110',
            'shadow-lg'
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Mobile scroll hint */}
      {canScrollRight && (
        <div className="lg:hidden absolute -bottom-5 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-1 text-[10px] text-text-muted animate-pulse">
            <span>Листайте вправо</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
}
