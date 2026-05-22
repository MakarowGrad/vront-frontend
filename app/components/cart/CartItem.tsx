'use client';

/**
 * CartItem Component
 * Mobile-optimized cart line item
 */

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/app/types';
import { useCartStore } from '@/app/store/cartStore';
import { formatPrice, getImageUrl } from '@/app/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, setItemInstructions } = useCartStore();
  const { dish, quantity, unitPrice, totalPrice, specialInstructions } = item;

  const handleDecrease = () => {
    const newQuantity = quantity - dish.orderStep;
    if (newQuantity < dish.minQty) {
      removeItem(dish.id);
    } else {
      updateQuantity(dish.id, newQuantity);
    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + dish.orderStep;
    if ((dish.maxQty || 100) && newQuantity > (dish.maxQty || 100)) {
      return;
    }
    updateQuantity(dish.id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(dish.id);
  };

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemInstructions(dish.id, e.target.value);
  };

  const isMaxReached = (dish.maxQty || 100) ? quantity >= (dish.maxQty || 100) : false;

  return (
    <div className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-surface-secondary rounded-xl border border-border/50">
      {/* Dish Image - smaller on mobile */}
      <div className="relative w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-tertiary">
        <Image
          src={getImageUrl(dish.coverImage)}
          alt={dish.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 56px, 80px"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {/* Header - more compact */}
        <div className="flex items-start justify-between gap-1">
          <h3 className="font-serif text-sm sm:text-body-md font-semibold text-text-primary truncate leading-tight">
            {dish.title}
          </h3>
          <button
            onClick={handleRemove}
            className="p-1 text-text-muted hover:text-error transition-colors flex-shrink-0"
            aria-label="Удалить"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
        
        {dish.weight && (
          <p className="text-xs sm:text-body-sm text-text-muted mt-0.5">
            {dish.weight} {dish.weightUnit || 'г'}
          </p>
        )}

        {/* Order Step Indicator - smaller */}
        {dish.orderStep > 1 && (
          <div className="mt-1.5 inline-flex items-center px-1.5 py-0.5 rounded bg-gold/10">
            <span className="text-[10px] sm:text-caption text-gold">
              кратно {dish.orderStep}
            </span>
          </div>
        )}

        {/* Special Instructions - compact */}
        <div className="mt-1.5">
          <input
            type="text"
            value={specialInstructions || ''}
            onChange={handleInstructionsChange}
            placeholder="Комментарий..."
            className="w-full px-1.5 py-0.5 text-[11px] sm:text-body-xs bg-transparent border-b border-border focus:border-gold outline-none transition-colors placeholder:text-text-muted"
          />
        </div>

        {/* Footer: Quantity & Price - compact layout */}
        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls - New Design */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-surface rounded-xl px-1 sm:px-1.5 py-0.5 sm:py-1 shadow-inner">
            <button
              onClick={handleDecrease}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-surface-secondary text-text-secondary hover:bg-gold hover:text-background-primary active:scale-90 transition-all duration-200 flex items-center justify-center shadow-sm"
              aria-label="Уменьшить"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="min-w-[1.25rem] sm:min-w-[2rem] text-center text-xs sm:text-base font-bold text-text-primary">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={isMaxReached}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gold text-background-primary hover:bg-gold-light active:scale-90 transition-all duration-200 flex items-center justify-center shadow-sm shadow-gold/30 disabled:opacity-40"
              aria-label="Увеличить"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Price - compact */}
          <div className="text-right">
            <div className="text-sm sm:text-body-md font-semibold text-gold">
              {formatPrice(totalPrice)} ₽
            </div>
            <div className="text-[10px] sm:text-caption text-text-muted">
              {formatPrice(unitPrice)} × {quantity}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
