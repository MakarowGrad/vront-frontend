'use client';

/**
 * Cart Page
 * Shopping cart with items and checkout CTA
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Package, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/app/store/cartStore';
import { CartItem } from '@/app/components/cart/CartItem';
import { useMaxBackButton } from '@/app/hooks/useMaxBackButton';

export default function CartPage() {
  useMaxBackButton();
  const router = useRouter();
  const { items, getCartCount, clearCart, getSubtotal } = useCartStore();

  const itemCount = getCartCount();
  const isEmpty = items.length === 0;
  const cartTotal = getSubtotal();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  // Empty cart state
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-secondary flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-text-muted" />
            </div>

            {/* Title */}
            <h1 className="font-serif text-display-sm text-text-primary mb-3">
              Корзина пуста
            </h1>

            {/* Description */}
            <p className="text-body-md text-text-secondary mb-8">
              Добавьте блюда в корзину, чтобы сделать заказ
            </p>

            {/* CTA */}
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold-light text-background font-semibold rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Перейти в меню
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-body-sm text-text-muted mb-8">
          <Link href="/" className="hover:text-gold transition-colors">
            Главная
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary">Корзина</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-gold" />
            <h1 className="font-serif text-display-sm text-text-primary">
              Корзина
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="px-4 py-2 text-body-sm text-text-muted hover:text-error border border-border hover:border-error rounded-lg transition-colors"
          >
            Очистить
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items List */}
            <section className="space-y-4">
              <h2 className="text-body-md font-medium text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4" />
                Выбранные блюда
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.dishId} item={item} />
                ))}
              </div>
            </section>

            {/* Continue Shopping */}
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-body-md text-gold hover:text-gold-light transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Продолжить покупки
            </Link>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Simple Summary */}
              <div className="bg-surface-secondary rounded-xl border border-border/50 overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50 bg-surface/50">
                  <h3 className="font-serif text-heading-sm text-text-primary">
                    Сумма заказа
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-body-md text-text-secondary">
                      {itemCount} {itemCount === 1 ? 'позиция' : itemCount < 5 ? 'позиции' : 'позиций'}
                    </span>
                    <span className="text-body-md font-medium text-text-primary font-mono">
                      {formatPrice(cartTotal)} ₽
                    </span>
                  </div>
                  <div className="divider-gold" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-heading-sm font-serif text-text-primary">Итого</span>
                    <span className="text-display-sm font-serif text-gradient-gold">
                      {formatPrice(cartTotal)} ₽
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 px-6 bg-gold hover:bg-gold-light text-background font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                Оформить заказ
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Security Note */}
              <p className="text-center text-caption text-text-muted">
                Безопасное оформление заказа
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
