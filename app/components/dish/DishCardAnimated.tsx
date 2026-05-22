/**
 * DishCardAnimated Component
 * Extended dish card with video animation support
 * State machine: idle → exploding → exploded → assembling → idle
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus, Minus, Info, ChefHat, X, Play, RotateCcw } from 'lucide-react';
import { Dish, AnimationState } from '@/app/types';
import { useCart } from '@/app/hooks/useCart';
import { useFavorites } from '@/app/hooks/useFavorites';
import { useActiveCard } from '@/app/hooks/useActiveCard';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/app/components/ui/dialog';
import { cn, getImageUrl } from '@/app/lib/utils';

interface DishCardAnimatedProps {
  dish: Dish;
  className?: string;
}

export function DishCardAnimated({ dish, className }: DishCardAnimatedProps) {
  const { addToCart, getQuantityForDish, incrementQuantity, decrementQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showComposition, setShowComposition] = useState(false);
  const [showCompositionModal, setShowCompositionModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const hasVideo = !!(dish.explodeVideo && dish.assembleVideo);
  
  const {
    isActive,
    animationState,
    startExplodeAnimation,
    startAssembleAnimation,
    resetAnimation,
    isExploded,
  } = useActiveCard({
    cardId: dish.id,
    hasVideo,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const quantity = getQuantityForDish(dish.id);
  const isFav = isFavorite(dish.id);
  const hasOrderStep = dish.orderStep > 1;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  // Handle video playback based on animation state
  useEffect(() => {
    if (videoRef.current && isActive) {
      if (animationState === 'exploding') {
        videoRef.current.src = dish.explodeVideo || '';
        videoRef.current.play();
      } else if (animationState === 'assembling') {
        videoRef.current.src = dish.assembleVideo || '';
        videoRef.current.play();
      }
    }
  }, [isActive, animationState, dish.explodeVideo, dish.assembleVideo]);

  const handleAddToCart = () => {
    addToCart(dish, dish.orderStep);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(dish.id, dish.title);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    incrementQuantity(dish.id, dish);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    decrementQuantity(dish.id, dish);
  };

  const handleToggleComposition = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hasVideo) {
      if (showComposition) {
        // Start assemble animation
        startAssembleAnimation();
        setShowComposition(false);
      } else {
        // Start explode animation
        const started = startExplodeAnimation();
        if (started) {
          setShowComposition(true);
        }
      }
    } else {
      // Fallback: show composition modal
      setShowCompositionModal(true);
    }
  };

  const handleCloseComposition = () => {
    if (hasVideo && isActive) {
      startAssembleAnimation();
    }
    setShowComposition(false);
  };

  // Get animation overlay content
  const getAnimationOverlay = () => {
    if (!isActive) return null;

    switch (animationState) {
      case 'exploding':
        return (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              muted
              playsInline
            />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-center text-gold text-body-sm animate-pulse">
                Разбираем блюдо...
              </p>
            </div>
          </div>
        );
      
      case 'exploded':
        return (
          <div className="absolute inset-0 bg-black/90 flex flex-col z-20">
            {/* Exploded view with ingredients */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <ChefHat className="w-16 h-16 text-gold mx-auto mb-4" />
                <h4 className="font-serif text-heading-md text-text-primary mb-2">
                  Состав блюда
                </h4>
                <ul className="flex flex-wrap justify-center gap-2 max-w-[200px]">
                  {(Array.isArray(dish.composition) ? dish.composition : (dish.composition || '').split(', ')).filter(Boolean).map((item, index) => (
                    <li
                      key={index}
                      className="px-3 py-1 rounded-full text-body-sm bg-surface-tertiary text-text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Close button */}
            <div className="p-4">
              <Button
                onClick={handleCloseComposition}
                className="w-full gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Собрать блюдо
              </Button>
            </div>
          </div>
        );
      
      case 'assembling':
        return (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              muted
              playsInline
            />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-center text-gold text-body-sm animate-pulse">
                Собираем блюдо...
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <Link href={`/dish/${dish.slug}`}>
        <div
          className={cn(
            'group relative bg-surface-secondary rounded-2xl overflow-hidden',
            'border border-border hover:border-gold/30',
            'transition-all duration-300 hover:-translate-y-1',
            'shadow-card hover:shadow-card-hover',
            isActive && 'border-gold/50',
            className
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={getImageUrl(dish.coverImage)}
              alt={dish.title}
              fill
              className={cn(
                'object-cover transition-transform duration-500',
                !isActive && 'group-hover:scale-105'
              )}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2 z-10">
              {dish.isHit && (
                <span className="badge-hit">Хит</span>
              )}
              {dish.isNew && (
                <span className="badge-new">Новинка</span>
              )}
            </div>
            
            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className={cn(
                'absolute top-3 right-3 w-10 h-10 rounded-full z-10',
                'flex items-center justify-center',
                'bg-black/50 backdrop-blur-sm',
                'transition-all duration-200 hover:scale-110',
                isFav ? 'text-red-500' : 'text-white/70 hover:text-white'
              )}
            >
              <Heart className={cn('w-5 h-5', isFav && 'fill-current')} />
            </button>
            
            {/* Order Step Badge */}
            {hasOrderStep && (
              <div className="absolute bottom-3 left-3 z-10">
                <span className="px-2 py-1 rounded-full text-caption font-medium bg-black/60 backdrop-blur-sm text-gold">
                  Кратно {dish.orderStep} шт
                </span>
              </div>
            )}
            
            {/* Animation Overlay */}
            {getAnimationOverlay()}
          </div>
          
          {/* Content */}
          <div className="p-4">
            {/* Title & Description */}
            <h3 className="font-serif text-heading-sm text-text-primary mb-1 line-clamp-1">
              {dish.title}
            </h3>
            <p className="text-body-sm text-text-secondary line-clamp-2 mb-3 min-h-[2.5rem]">
              {dish.shortDescription}
            </p>
            
            {dish.weight && (
              <div className="flex items-center gap-3 mb-4">
                <span className="text-body-xs text-text-muted">
                  {dish.weight} {dish.weightUnit || 'г'}
                </span>
              </div>
            )}
            
            {/* Price & Actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="price-display text-heading-md">
                  {formatPrice(dish.price)} ₽
                </span>
                {hasOrderStep && (
                  <span className="text-caption text-text-muted">
                    за {dish.orderStep} шт
                  </span>
                )}
              </div>
              
              {/* Cart Controls */}
              {quantity > 0 ? (
                <div className="quantity-stepper">
                  <button onClick={handleDecrement}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span>{quantity}</span>
                  <button onClick={handleIncrement}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  В корзину
                </Button>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Composition Modal (Fallback) */}
      <Dialog open={showCompositionModal} onOpenChange={setShowCompositionModal}>
        <DialogContent className="bg-surface-secondary border-border max-w-md">
          <DialogTitle className="font-serif text-heading-lg text-text-primary flex items-center gap-3">
            <ChefHat className="w-6 h-6 text-gold" />
            Состав блюда
          </DialogTitle>
          
          <div className="mt-4">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
              <Image
                src={getImageUrl(dish.coverImage)}
                alt={dish.title}
                fill
                className="object-cover"
              />
            </div>
            
            <h4 className="font-serif text-heading-md text-text-primary mb-3">
              {dish.title}
            </h4>
            
            <p className="text-body-sm text-text-secondary mb-4">
              {dish.fullDescription}
            </p>
            
            <div className="space-y-2">
              <p className="text-body-sm font-medium text-text-primary">Ингредиенты:</p>
              <ul className="grid grid-cols-2 gap-2">
                {(Array.isArray(dish.composition) ? dish.composition : (dish.composition || '').split(', ')).filter(Boolean).map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-body-sm text-text-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {dish.allergens && dish.allergens.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-error/10">
                <p className="text-body-xs text-error">
                  <span className="font-medium">Аллергены:</span> {dish.allergens.join(', ')}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
