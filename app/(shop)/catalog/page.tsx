/**
 * Catalog Page
 * Main dish catalog with filters, search, and grid
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';

import { Dish, Category, SortOption } from '@/app/types';
import { useDishes } from '@/app/hooks/useDishes';
import { useCategories } from '@/app/hooks/useCategories';
import { DishCard } from '@/app/components/dish/DishCard';
import { CategoryFilter } from '@/app/components/catalog/CategoryFilter';
import { FilterBar } from '@/app/components/catalog/FilterBar';
import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';

import { cn } from '@/app/lib/utils';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

export default function CatalogPage() {
  // State
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHitsOnly, setShowHitsOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [compositionCardId, setCompositionCardId] = useState<string | null>(null);

  const { data: dishes = [], isLoading: dishesLoading } = useDishes({ limit: 100 });
  const { data: categories = [] } = useCategories();

  // Auto-select first category on load
  useEffect(() => {
    if (categories.length > 0 && activeCategoryId === null && !searchQuery) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId, searchQuery]);

  // Filter and sort dishes
  const filteredDishes = useMemo(() => {
    let result = [...dishes];

    // Filter by category
    if (activeCategoryId) {
      result = result.filter((dish) => dish.categoryId === activeCategoryId);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (dish) =>
          dish.title.toLowerCase().includes(query) ||
          dish.shortDescription?.toLowerCase().includes(query) ||
          dish.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by hits
    if (showHitsOnly) {
      result = result.filter((dish) => dish.isHit);
    }

    // Filter by new
    if (showNewOnly) {
      result = result.filter((dish) => dish.isNew);
    }

    // Filter by available
    if (showAvailableOnly) {
      result = result.filter((dish) => dish.isAvailable);
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name_desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
    }

    return result;
  }, [dishes, activeCategoryId, searchQuery, showHitsOnly, showNewOnly, showAvailableOnly, sortBy]);

  // Get active category name
  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId) return 'Все блюда';
    const category = categories.find((cat) => cat.id === activeCategoryId);
    return category?.name || 'Все блюда';
  }, [activeCategoryId]);

  // Clear all filters
  const clearFilters = () => {
    setActiveCategoryId(null);
    setSearchQuery('');
    setShowHitsOnly(false);
    setShowNewOnly(false);
    setShowAvailableOnly(true);
    setSortBy('popular');
  };

  // Check if any filters are active
  const hasActiveFilters =
    activeCategoryId !== null ||
    searchQuery !== '' ||
    showHitsOnly ||
    showNewOnly ||
    !showAvailableOnly ||
    sortBy !== 'popular';

  // Toggle composition for a card
  const toggleComposition = (dishId: string) => {
    setCompositionCardId((current) => (current === dishId ? null : dishId));
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden fixed top-16 right-4 z-30">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className={cn(
            'w-12 h-12 rounded-xl',
            'flex items-center justify-center',
            'bg-surface-secondary/90 backdrop-blur border border-border',
            'text-text-secondary hover:text-text-primary',
            'transition-all duration-200 shadow-lg',
            showMobileFilters && 'border-gold text-gold'
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Category Filter */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <CategoryFilter
            categories={categories}
            activeCategoryId={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className={cn('border-b border-border', !showMobileFilters && 'hidden md:block')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <FilterBar
            showHitsOnly={showHitsOnly}
            showNewOnly={showNewOnly}
            showAvailableOnly={showAvailableOnly}
            sortBy={sortBy}
            onToggleHits={() => setShowHitsOnly(!showHitsOnly)}
            onToggleNew={() => setShowNewOnly(!showNewOnly)}
            onToggleAvailable={() => setShowAvailableOnly(!showAvailableOnly)}
            onSortChange={setSortBy}
            resultsCount={filteredDishes.length}
          />

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-body-sm text-text-muted hover:text-gold transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Loading State */}
        {dishesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 items-stretch">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-surface-secondary rounded-2xl overflow-hidden">
                <Skeleton className="aspect-[4/3]" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDishes.length > 0 ? (
          /* Dish Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 items-stretch">
            {filteredDishes.map((dish) => (
              <div key={dish.id} className="h-full">
                <DishCard
                  dish={dish}
                  showComposition={compositionCardId === dish.id}
                  onToggleComposition={() => toggleComposition(dish.id)}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-surface-tertiary flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="font-serif text-heading-lg text-text-primary mb-2">
              Блюда не найдены
            </h3>
            <p className="text-body-md text-text-secondary max-w-md mb-6">
              Попробуйте изменить параметры поиска или сбросить фильтры
            </p>
            <Button onClick={clearFilters} variant="ghost" className="gap-2">
              <X className="w-4 h-4" />
              Сбросить фильтры
            </Button>
          </div>
        )}
      </main>


    </div>
  );
}

