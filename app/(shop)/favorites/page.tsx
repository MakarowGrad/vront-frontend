/**
 * Favorites Page
 * Grid of favorite dishes with management options
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Heart, ArrowLeft, ShoppingBag, Trash2, UtensilsCrossed } from 'lucide-react';

import { Dish } from '@/app/types';
import { useDishes } from '@/app/hooks/useDishes';
import { useFavoritesStore } from '@/app/store/favoritesStore';
import { useCart } from '@/app/hooks/useCart';

import { DishCard } from '@/app/components/dish/DishCard';
import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';
import { cn } from '@/app/lib/utils';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export default function FavoritesPage() {
  const { favorites, clearFavorites, getFavoritesCount } = useFavoritesStore();
  const { addToCart } = useCart();
  const { data: dishes = [], isLoading } = useDishes();

  // Note: we intentionally do NOT clear missing dish IDs from favorites here.
  // The API may lag or return empty on first mount; aggressive cleanup causes
  // favorites to disappear on mobile. Dishes that are no longer available are
  // simply filtered out in the render below.

  // Get favorite dishes
  const favoriteDishes = useMemo(() => {
    return dishes.filter((dish) => favorites.includes(dish.id));
  }, [dishes, favorites]);

  // Handle add all to cart
  const handleAddAllToCart = () => {
    favoriteDishes.forEach((dish) => {
      addToCart(dish, dish.orderStep);
    });
  };

  // Handle clear favorites
  const handleClearFavorites = () => {
    if (confirm('Вы уверены, что хотите очистить избранное?')) {
      clearFavorites();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb & Back */}
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-body-sm text-text-secondary hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад в каталог
            </Link>
          </div>

          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h1 className="font-serif text-heading-xl text-text-primary">
                  Избранное
                </h1>
                {!isLoading && (
                  <p className="text-body-sm text-text-muted">
                    {favoriteDishes.length} {getDishesWord(favoriteDishes.length)}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            {!isLoading && favoriteDishes.length > 0 && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFavorites}
                  className="gap-2 text-error hover:text-error hover:bg-error/10"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Очистить</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddAllToCart}
                  className="gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Добавить все</span>
                  <span className="sm:hidden">В корзину</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-surface-secondary rounded-2xl overflow-hidden">
                <Skeleton className="aspect-[4/3]" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favoriteDishes.length > 0 ? (
          /* Favorites Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {favoriteDishes.map((dish) => (
                <motion.div
                  key={dish.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <DishCard dish={dish} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            {/* Illustration */}
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full bg-surface-tertiary flex items-center justify-center">
                <UtensilsCrossed className="w-14 h-14 text-text-muted" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-surface-secondary border-2 border-background flex items-center justify-center">
                <Heart className="w-6 h-6 text-text-muted" />
              </div>
            </div>

            <h2 className="font-serif text-heading-lg text-text-primary mb-3">
              Избранное пусто
            </h2>
            <p className="text-body-md text-text-secondary max-w-md mb-8">
              Добавляйте понравившиеся блюда в избранное, чтобы быстро найти их позже
            </p>

            <Link href="/catalog">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="w-5 h-5" />
                Перейти в каталог
              </Button>
            </Link>

            {/* Quick Tips */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
              {[
                {
                  icon: Heart,
                  title: 'Сохраняйте',
                  description: 'Нажмите на сердечко на карточке блюда',
                },
                {
                  icon: ShoppingBag,
                  title: 'Заказывайте',
                  description: 'Быстро добавляйте избранное в корзину',
                },
                {
                  icon: UtensilsCrossed,
                  title: 'Наслаждайтесь',
                  description: 'Ваши любимые блюда всегда под рукой',
                },
              ].map((tip, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-surface-secondary border border-border"
                >
                  <tip.icon className="w-6 h-6 text-gold mb-3 mx-auto" />
                  <h3 className="font-medium text-text-primary mb-1">{tip.title}</h3>
                  <p className="text-body-xs text-text-muted">{tip.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function getDishesWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'блюд';
  }

  if (lastDigit === 1) {
    return 'блюдо';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'блюда';
  }

  return 'блюд';
}
