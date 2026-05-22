'use client';

/**
 * CartSummary Component
 * Order summary with totals and delivery fee
 */

import { useCartStore } from '@/app/store/cartStore';
import { formatPrice } from '@/app/lib/utils';
import { Package, Truck, Receipt } from 'lucide-react';

interface CartSummaryProps {
  fulfillmentType?: 'delivery' | 'pickup';
}

export function CartSummary({ fulfillmentType = 'delivery' }: CartSummaryProps) {
  const { getSubtotal, getDeliveryFee, getTotal, getTotalQuantity } = useCartStore();
  
  const subtotal = getSubtotal();
  const deliveryFee = fulfillmentType === 'delivery' ? getDeliveryFee() : 0;
  const total = fulfillmentType === 'delivery' ? getTotal() : subtotal;
  const itemCount = getTotalQuantity();
  const totalQuantity = getTotalQuantity();

  const isFreeDelivery = deliveryFee === 0 && fulfillmentType === 'delivery';

  return (
    <div className="bg-surface-secondary rounded-xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 bg-surface/50">
        <h3 className="font-serif text-heading-sm text-text-primary flex items-center gap-2">
          <Receipt className="w-5 h-5 text-gold" />
          Сумма заказа
        </h3>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Item Count */}
        <div className="flex items-center gap-2 text-body-sm text-text-secondary">
          <Package className="w-4 h-4" />
          <span>
            {itemCount} {itemCount === 1 ? 'позиция' : itemCount < 5 ? 'позиции' : 'позиций'} 
            {' '}({totalQuantity} {totalQuantity === 1 ? 'шт.' : 'шт.'})
          </span>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-body-md text-text-secondary">Стоимость блюд</span>
          <span className="text-body-md font-medium text-text-primary font-mono">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Delivery Fee */}
        {fulfillmentType === 'delivery' && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-text-muted" />
              <span className="text-body-md text-text-secondary">Доставка</span>
              {isFreeDelivery && (
                <span className="px-2 py-0.5 rounded-full bg-success/20 text-caption text-success">
                  Бесплатно
                </span>
              )}
            </div>
            <span className={`text-body-md font-medium font-mono ${isFreeDelivery ? 'text-success line-through' : 'text-text-primary'}`}>
              {formatPrice(deliveryFee === 0 ? 500 : deliveryFee)}
            </span>
          </div>
        )}

        {/* Free Delivery Hint */}
        {fulfillmentType === 'delivery' && !isFreeDelivery && (
          <div className="p-3 rounded-lg bg-gold/5 border border-gold/20">
            <p className="text-body-xs text-gold">
              Бесплатная доставка при заказе от {formatPrice(5000)}
            </p>
            <div className="mt-2 h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gold rounded-full transition-all duration-500"
                style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-caption text-text-muted">
              До бесплатной доставки: {formatPrice(5000 - subtotal)}
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="divider-gold" />

        {/* Total */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-heading-sm font-serif text-text-primary">Итого</span>
          <span className="text-display-sm font-serif text-gradient-gold">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
