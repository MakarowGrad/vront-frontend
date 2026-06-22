/**
 * Dish Detail Page
 * Full dish information with gallery, description, and add to cart
 */

'use client';

import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMaxBackButton } from '@/app/hooks/useMaxBackButton';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  ChefHat,
  AlertTriangle,
  Star,
  Check,
} from 'lucide-react';

import { Dish } from '@/app/types';
import { useDishes } from '@/app/hooks/useDishes';
import { useFavorites } from '@/app/hooks/useFavorites';
import { useCartStore } from '@/app/store/cartStore';

import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Separator } from '@/app/components/ui/separator';
import { cn, getImageUrl } from '@/app/lib/utils';
import { DishCard } from '@/app/components/dish/DishCard';
import { useFlyingDish } from '@/app/components/cart/FlyingDishAnimation';
import { CartRefContext } from '@/app/context/CartRefContext';


export default function DishDetailPage() {
  useMaxBackButton();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: dishes = [], isLoading } = useDishes({ limit: 100 });
  const [selectedImage, setSelectedImage] = useState(0);

  const addToCart = useCartStore(state => state.addToCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const getItemCount = useCartStore(state => state.getItemCount);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { triggerFlyAnimation } = useFlyingDish();
  const cartButtonRef = useContext(CartRefContext);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const dish = useMemo(() => dishes.find((d) => d.slug === slug) || null, [dishes, slug]);

  // Handle not found
  useEffect(() => {
    if (!isLoading && !dish) {
      router.push('/catalog');
    }
  }, [isLoading, dish, router]);

  // Get related dishes
  const relatedDishes = useMemo(() => {
    if (!dish) return [];
    return dishes
      .filter((d) => d.categoryId === dish.categoryId && d.id !== dish.id && d.isAvailable)
      .slice(0, 4);
  }, [dish, dishes]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  // Handle quantity change
  const handleIncrement = () => {
    if (!dish) return;
    const newQty = cartQuantity + dish.orderStep;
    if (mainImageRef.current && cartButtonRef?.current) {
      triggerFlyAnimation(dish, mainImageRef.current, cartButtonRef.current);
    }
    updateQuantity(dish.id, newQty);
  };

  const handleDecrement = () => {
    if (!dish) return;
    const newQty = cartQuantity - dish.orderStep;
    if (newQty >= dish.minQty) {
      updateQuantity(dish.id, newQty);
    } else if (cartQuantity > 0) {
      removeFromCart(dish.id);
    }
  };

  // Handle add to cart
  const handleNextImage = () => {
    if (!dish) return;
    setSelectedImage((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    if (!dish) return;
    setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleAddToCart = () => {
    if (!dish) return;
    
    // Trigger fly animation if refs are available
    if (mainImageRef.current && cartButtonRef?.current) {
      triggerFlyAnimation(dish, mainImageRef.current, cartButtonRef.current);
    }
    
    // Add to cart
    addToCart(dish, dish.orderStep || 1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-[4/3] rounded-2xl" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state (will redirect)
  if (!dish) {
    return null;
  }

  const isFav = isFavorite(dish.id);
  const cartQuantity = dish ? getItemCount(dish.id) : 0;
  const allImages = [dish.coverImage, ...(dish.gallery || [])].filter(Boolean).map(getImageUrl);
  const hasOrderStep = dish.orderStep > 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb & Back */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-body-sm text-text-secondary hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад в каталог
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              ref={mainImageRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-secondary group"
            >
              <Image
                src={allImages[selectedImage]}
                alt={dish.title}
                fill
                className="object-cover"
                priority
              />

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                    aria-label="Предыдущее фото"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                    aria-label="Следующее фото"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {/* Click zones for mobile (no hover) */}
                  <div
                    onClick={handlePrevImage}
                    className="absolute left-0 top-0 w-1/3 h-full cursor-w-reside lg:hidden"
                    aria-hidden="true"
                  />
                  <div
                    onClick={handleNextImage}
                    className="absolute right-0 top-0 w-1/3 h-full cursor-e-reside lg:hidden"
                    aria-hidden="true"
                  />
                  {/* Image counter */}
                  <span className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/50 text-white text-xs font-medium">
                    {selectedImage + 1} / {allImages.length}
                  </span>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {dish.isHit && <span className="badge-hit">Хит</span>}
                {dish.isNew && <span className="badge-new">Новинка</span>}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0',
                      'border-2 transition-all duration-200',
                      selectedImage === index
                        ? 'border-gold'
                        : 'border-transparent hover:border-border'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${dish.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dish Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-heading-xl lg:text-display-sm text-text-primary mb-2">
                  {dish.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="text-body-sm font-medium text-text-primary">
                      {dish.rating || 0}
                    </span>
                  </div>
                  <span className="text-text-muted">·</span>
                  <span className="text-body-sm text-text-muted">
                    {dish.reviewCount || 0} отзывов
                  </span>
                </div>
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(dish.id, dish.title)}
                className={cn(
                  'w-12 h-12 rounded-full',
                  'flex items-center justify-center',
                  'bg-surface-tertiary border border-border',
                  'transition-all duration-200 hover:scale-110',
                  isFav ? 'text-red-500' : 'text-text-muted hover:text-text-primary'
                )}
              >
                <Heart className={cn('w-5 h-5', isFav && 'fill-current')} />
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="price-display text-display-sm">
                {formatPrice(dish.price)} ₽
              </span>
              {hasOrderStep && (
                <span className="text-body-md text-text-muted">
                  за {dish.orderStep} шт
                </span>
              )}
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4">
              {dish.weight && (
                <div className="flex items-center gap-2 text-body-sm text-text-secondary bg-surface-tertiary rounded-lg px-3 py-2">
                  <span className="text-gold font-mono font-medium">{dish.weight}{dish.weightUnit ? ` ${dish.weightUnit}` : ' г'}</span>
                </div>
              )}

              {dish.preparationTime && dish.preparationTime > 0 && (
                <div className="flex items-center gap-2 text-body-sm text-text-secondary bg-surface-tertiary rounded-lg px-3 py-2">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>{dish.preparationTime} мин</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="font-serif text-heading-md text-text-primary mb-3">
                Описание
              </h2>
              <p className="text-body-md text-text-secondary leading-relaxed">
                {dish.fullDescription}
              </p>
            </div>

            {/* Composition */}
            <div>
              <h2 className="font-serif text-heading-md text-text-primary mb-3 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-gold" />
                Состав
              </h2>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(dish.composition) ? dish.composition : (dish.composition || '').split(', ')).filter(Boolean).map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-body-sm bg-surface-tertiary text-text-secondary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Allergens */}
            {dish.allergens && dish.allergens.length > 0 && (
              <div className="p-4 rounded-xl bg-error/10 border border-error/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-body-sm font-medium text-error mb-1">
                      Содержит аллергены
                    </p>
                    <p className="text-body-xs text-error/80">
                      {dish.allergens.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Nutritional Info */}
            {dish.nutritionalInfo && (
            <div>
              <h2 className="font-serif text-heading-md text-text-primary mb-3">
                Пищевая ценность
              </h2>
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-surface-tertiary text-center">
                  <p className="text-caption text-text-muted mb-1">Калории</p>
                  <p className="font-mono font-medium text-text-primary">
                    {dish.nutritionalInfo.calories}
                  </p>
                  <p className="text-caption text-text-muted">ккал</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-tertiary text-center">
                  <p className="text-caption text-text-muted mb-1">Белки</p>
                  <p className="font-mono font-medium text-text-primary">
                    {dish.nutritionalInfo.protein}г
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-surface-tertiary text-center">
                  <p className="text-caption text-text-muted mb-1">Жиры</p>
                  <p className="font-mono font-medium text-text-primary">
                    {dish.nutritionalInfo.fat}г
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-surface-tertiary text-center">
                  <p className="text-caption text-text-muted mb-1">Углеводы</p>
                  <p className="font-mono font-medium text-text-primary">
                    {dish.nutritionalInfo.carbohydrates}г
                  </p>
                </div>
              </div>
            </div>
            )}

            <Separator />

            {/* Add to Cart Section */}
            <div className="space-y-4">
              {/* Order Step Info */}
              {hasOrderStep && (
                <div className="flex items-center gap-2 text-body-sm text-gold">
                  <Check className="w-4 h-4" />
                  <span>Заказ кратно {dish.orderStep} шт</span>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                {cartQuantity > 0 ? (
                  <div className="flex items-center gap-3 bg-surface rounded-xl px-2 py-1.5 shadow-inner">
                    <button
                      onClick={handleDecrement}
                      className="w-10 h-10 rounded-lg bg-surface-secondary text-text-secondary hover:bg-gold hover:text-background-primary active:scale-90 transition-all duration-200 flex items-center justify-center shadow-sm"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="min-w-[2.5rem] text-center text-xl font-bold text-text-primary">{cartQuantity}</span>
                    <button
                      onClick={handleIncrement}
                      className="w-10 h-10 rounded-lg bg-gold text-background-primary hover:bg-gold-light active:scale-90 transition-all duration-200 flex items-center justify-center shadow-md shadow-gold/30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <motion.button
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center h-14 px-6 bg-gold hover:bg-gold-light text-background-primary font-semibold rounded-xl transition-colors shadow-lg shadow-gold/20 whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    В корзину
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Dishes */}
        {relatedDishes.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-heading-xl text-text-primary">
                Похожие блюда
              </h2>
              <Link
                href="/catalog"
                className="text-body-sm text-gold hover:text-gold-light transition-colors"
              >
                Смотреть все
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedDishes.map((relatedDish) => (
                <DishCard key={relatedDish.id} dish={relatedDish} variant="compact" />
              ))}
            </div>
          </motion.section>
        )}
      </main>


    </div>
  );
}
