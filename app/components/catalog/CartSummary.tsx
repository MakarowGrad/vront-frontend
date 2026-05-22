/**
 * CartSummary Component
 * Sticky cart mini-summary for catalog page
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ChevronRight, X } from 'lucide-react';
import { useCartStore } from '@/app/store/cartStore';
import { cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';

interface CartSummaryProps {
  className?: string;
  onClose?: () => void;
}

export function CartSummary({ className, onClose }: CartSummaryProps) {
  const router = useRouter();
  const { items, getCartTotal, getCartCount, clearCart } = useCartStore();
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-surface-secondary/95 backdrop-blur-lg',
        'border-t border-border',
        'shadow-2xl',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center justify-between gap-4">
          {/* Cart Info */}
          <div className="flex items-center gap-4">
            {/* Icon & Count */}
            <div 
              className="relative cursor-pointer"
              onClick={() => router.push('/cart')}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-xl',
                  'flex items-center justify-center',
                  'bg-gold/20 hover:bg-gold/30',
                  'transition-colors'
                )}
              >
                <ShoppingBag className="w-6 h-6 text-gold" />
              </div>
              {cartCount > 0 && (
                <span
                  className={cn(
                    'absolute -top-1 -right-1',
                    'w-5 h-5 rounded-full',
                    'flex items-center justify-center',
                    'bg-gold text-background',
                    'text-caption font-bold'
                  )}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="hidden sm:block">
              <p className="text-body-sm text-text-secondary">
                {items.length} {getItemsWord(items.length)} · {cartCount} {getPiecesWord(cartCount)}
              </p>
              <p className="price-display text-heading-sm">
                {formatPrice(cartTotal)} ₽
              </p>
            </div>

            {/* Mobile Details */}
            <div className="sm:hidden">
              <p className="price-display text-heading-sm">
                {formatPrice(cartTotal)} ₽
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Clear Button (Desktop) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="hidden sm:inline-flex text-text-muted hover:text-error"
            >
              Очистить
            </Button>

            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Checkout Button */}
            <Button 
              className="gap-2" 
              onClick={() => router.push('/cart')}
            >
              <span className="hidden sm:inline">Оформить заказ</span>
              <span className="sm:hidden">Корзина</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Safe Area Padding for Mobile */}
      <div className="h-safe-area-inset-bottom bg-surface-secondary" />
    </div>
  );
}

interface CartSummaryFloatingProps {
  className?: string;
}

export function CartSummaryFloating({ className }: CartSummaryFloatingProps) {
  const router = useRouter();
  const { items, getCartTotal, getCartCount } = useCartStore();
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'flex items-center justify-between',
        'px-4 py-3',
        'bg-surface-secondary/95 backdrop-blur-xl',
        'border-t border-border',
        'shadow-2xl',
        className
      )}
    >
      {/* Left - Cart name */}
      <button
        onClick={() => router.push('/cart')}
        className="flex items-center gap-2 text-text-primary hover:text-gold transition-colors"
      >
        <div className="relative">
          <ShoppingBag className="w-6 h-6 text-gold" />
          {cartCount > 0 && (
            <span
              className={cn(
                'absolute -top-1 -right-1',
                'w-5 h-5 rounded-full',
                'flex items-center justify-center',
                'bg-gold text-background',
                'text-caption font-bold'
              )}
            >
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>
        <span className="font-medium">Корзина</span>
      </button>

      {/* Right - Total */}
      <button
        onClick={() => router.push('/cart')}
        className="font-mono font-semibold text-gold"
      >
        {formatPrice(cartTotal)} ₽
      </button>
    </div>
  );
}

function getItemsWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'товаров';
  }

  if (lastDigit === 1) {
    return 'товар';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'товара';
  }

  return 'товаров';
}

function getPiecesWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'шт';
  }

  if (lastDigit === 1) {
    return 'шт';
  }

  return 'шт';
}
