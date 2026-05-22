'use client';

/**
 * DishCard Component
 * Premium dish card with fly animation
 */

import React, { useRef, useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, Plus, Minus } from 'lucide-react';
import { Dish } from '@/app/types';
import { useCartStore } from '@/app/store/cartStore';
import { useFavorites } from '@/app/hooks/useFavorites';
import { Button } from '@/app/components/ui/button';
import { cn, getImageUrl } from '@/app/lib/utils';
import { useFlyingDish } from '@/app/components/cart/FlyingDishAnimation';
import { CartRefContext } from '@/app/context/CartRefContext';

interface DishCardProps {
  dish: Dish;
  variant?: 'default' | 'compact';
  onToggleComposition?: () => void;
  showComposition?: boolean;
  className?: string;
}

const getDishGradient = (title: string) => {
  const gradients = [
    'from-amber-600/40 via-orange-900/60 to-stone-950',
    'from-orange-600/40 via-red-900/60 to-stone-950',
    'from-yellow-600/40 via-amber-900/60 to-stone-950',
    'from-red-700/40 via-orange-900/60 to-stone-950',
    'from-rose-600/40 via-red-900/60 to-stone-950',
  ];
  const index = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
  return gradients[index];
};

export function DishCard({
  dish,
  variant = 'default',
  className,
}: DishCardProps) {
  // Card reference for flying dish animation
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { triggerFlyAnimation } = useFlyingDish();
  const cartButtonRef = useContext(CartRefContext);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const quantity = useCartStore(state => state.getItemCount(dish.id));
  const addToCart = useCartStore(state => state.addToCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  
  const handleIncrement = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const newQty = quantity + (dish.orderStep || 1);
    if (newQty <= (dish.maxQty || 100)) {
      if (cardRef.current && cartButtonRef?.current) {
        triggerFlyAnimation(dish, cardRef.current, cartButtonRef.current);
      }
      updateQuantity(dish.id, newQty);
    }
  };
  
  const handleDecrement = () => {
    const newQty = quantity - (dish.orderStep || 1);
    if (newQty >= (dish.minQty || 1)) {
      updateQuantity(dish.id, newQty);
    } else {
      removeFromCart(dish.id);
    }
  };
  
  const isFav = mounted ? isFavorite(dish.id) : false;
  const gradient = getDishGradient(dish.title);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const unitLabel = (() => {
    if (dish.weightUnit && dish.weightUnit !== 'г') return dish.weightUnit;
    if (dish.weight) return `${dish.weight}г`;
    return 'шт';
  })();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (cardRef.current && cartButtonRef?.current) {
      triggerFlyAnimation(dish, cardRef.current, cartButtonRef.current);
    }
    
    addToCart(dish, dish.orderStep || 1);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    router.push(`/dish/${dish.slug}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(dish.id, dish.title);
  };

  if (variant === 'compact') {
    return (
      <div
        ref={cardRef}
        onClick={handleCardClick}
        className={cn(
          'group relative bg-surface-secondary/90 rounded-xl overflow-hidden',
          'border border-border hover:border-gold/50',
          'transition-all duration-300 cursor-pointer',
          'shadow-lg h-full flex flex-col',
          className
        )}
      >
          {/* Image */}
          <div className={cn("relative aspect-[4/3] overflow-hidden bg-gradient-to-br", gradient)}>
            <Image
              src={getImageUrl(dish.coverImage)}
              alt={dish.title}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex gap-1.5">
              {dish.isHit && (
                <span className="px-2 py-0.5 rounded-full bg-gold text-background-primary text-[10px] font-bold uppercase">Хит</span>
              )}
              {dish.isNew && (
                <span className="px-2 py-0.5 rounded-full bg-success text-white text-[10px] font-bold uppercase">Новинка</span>
              )}
            </div>
            
            {/* Favorite */}
            <button
              onClick={handleToggleFavorite}
              className={cn(
                'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center',
                'bg-black/50 backdrop-blur-sm transition-all duration-200',
                isFav ? 'text-red-500' : 'text-white/70 hover:text-white'
              )}
            >
              <Heart className={cn('w-4 h-4', isFav && 'fill-current')} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-3 flex-1 flex flex-col">
            <h3 className="font-serif text-sm text-text-primary line-clamp-1 mb-1">{dish.title}</h3>
            {dish.weight && (
              <p className="text-xs text-text-muted line-clamp-1 mb-2">{dish.weight} {dish.weightUnit || 'г'}</p>
            )}
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-sm sm:text-base font-bold text-gold whitespace-nowrap">{formatPrice(dish.price)} ₽</span>
                <span className="text-[10px] text-text-muted">/ {unitLabel}</span>
              </div>
              
              {mounted && quantity > 0 ? (
                <div className="flex items-center gap-2 bg-surface rounded-xl px-1 py-1 shadow-inner">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDecrement(); }}
                    className="w-7 h-7 rounded-lg bg-surface-secondary text-text-secondary hover:bg-gold hover:text-background-primary active:scale-90 transition-all flex items-center justify-center shadow-sm"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="min-w-[1.5rem] text-center text-base font-bold text-text-primary">{quantity}</span>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleIncrement(); }}
                    className="w-7 h-7 rounded-lg bg-gold text-background-primary hover:bg-gold-light active:scale-90 transition-all flex items-center justify-center shadow-sm shadow-gold/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="px-2 py-1.5 rounded-lg bg-gold text-background-primary text-xs font-medium hover:bg-gold-light active:scale-95 transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">В корзину</span>
                </button>
              )}
            </div>
          </div>
        </div>
    );
  }

  // Default variant
  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={cn(
        'group relative bg-surface-secondary/90 rounded-2xl overflow-hidden',
        'border border-border hover:border-gold/50',
        'transition-all duration-300 hover:-translate-y-1 cursor-pointer',
        'shadow-lg h-full flex flex-col',
        className
      )}
    >
        {/* Image */}
        <div className={cn("relative aspect-[4/3] overflow-hidden bg-gradient-to-br", gradient)}>
          <Image
            src={getImageUrl(dish.coverImage)}
            alt={dish.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {dish.isHit && (
              <span className="px-2.5 py-1 rounded-full bg-gold text-background-primary text-xs font-bold uppercase">Хит</span>
            )}
            {dish.isNew && (
              <span className="px-2.5 py-1 rounded-full bg-success text-white text-xs font-bold uppercase">Новинка</span>
            )}
          </div>
          
          {/* Favorite */}
          <button
            onClick={handleToggleFavorite}
            className={cn(
              'absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center',
              'bg-black/50 backdrop-blur-sm transition-all duration-200',
              isFav ? 'text-red-500' : 'text-white/70 hover:text-white'
            )}
          >
            <Heart className={cn('w-5 h-5', isFav && 'fill-current')} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-serif text-lg text-text-primary line-clamp-1 mb-1">{dish.title}</h3>
          <p className="text-sm text-text-muted line-clamp-2 mb-3">{dish.shortDescription}</p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl font-bold text-gold">{formatPrice(dish.price)} ₽</span>
              <span className="text-xs text-text-muted">/ {unitLabel}</span>
            </div>
            
            {mounted && quantity > 0 ? (
              <div className="flex items-center gap-3 bg-surface rounded-xl px-2 py-1.5 shadow-inner">
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDecrement(); }}
                  className="w-9 h-9 rounded-lg bg-surface-secondary text-text-secondary hover:bg-gold hover:text-background-primary active:scale-90 transition-all flex items-center justify-center shadow-sm"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="min-w-[2rem] text-center text-lg font-bold text-text-primary">{quantity}</span>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleIncrement(); }}
                  className="w-9 h-9 rounded-lg bg-gold text-background-primary hover:bg-gold-light active:scale-90 transition-all flex items-center justify-center shadow-md shadow-gold/30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-gold text-background-primary text-xs sm:text-sm font-medium hover:bg-gold-light active:scale-95 transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">В корзину</span>
              </button>
            )}
          </div>
        </div>
      </div>
  );
}
