'use client';

/**
 * OrderSummary Component
 * Final order review for checkout page
 */

import Image from 'next/image';
import { useCartStore } from '@/app/store/cartStore';
import { formatPrice, getPaymentMethodLabel, getFulfillmentTypeLabel, getImageUrl } from '@/app/lib/utils';
import { FulfillmentType } from '@/app/types';
import { CheckoutFormData } from './CheckoutForm';
import { 
  Package, 
  User, 
  Phone, 
  MapPin, 
  Store,
  Calendar, 
  Clock, 
  CreditCard,
  Truck,
  Receipt
} from 'lucide-react';

interface OrderSummaryProps {
  formData: CheckoutFormData;
}

export function OrderSummary({ formData }: OrderSummaryProps) {
  const { items, getSubtotal, getDeliveryFee } = useCartStore();
  
  const subtotal = getSubtotal();
  const deliveryFee = formData.fulfillmentType === 'delivery' ? getDeliveryFee() : 0;
  const total = formData.fulfillmentType === 'delivery' ? subtotal + deliveryFee : subtotal;

  return (
    <div className="bg-surface-secondary rounded-xl border border-border/50 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 bg-surface/50">
        <h3 className="font-serif text-heading-sm text-text-primary flex items-center gap-2">
          <Receipt className="w-5 h-5 text-gold" />
          Ваш заказ
        </h3>
      </div>

      <div className="p-5 space-y-6">
        {/* Items List */}
        <section>
          <h4 className="text-body-sm font-medium text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Блюда ({items.length})
          </h4>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.dishId} className="flex gap-3">
                <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-surface-tertiary">
                  <Image
                    src={getImageUrl(item.dish.coverImage)}
                    alt={item.dish.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-medium text-text-primary truncate">
                    {item.dish.title}
                  </p>
                  <p className="text-caption text-text-muted">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-body-sm font-medium text-gold font-mono">
                    {formatPrice(item.totalPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="divider" />

        {/* Customer Info */}
        <section>
          <h4 className="text-body-sm font-medium text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Контакты
          </h4>
          <div className="space-y-2">
            {formData.name && (
              <div className="flex items-center gap-2 text-body-sm">
                <User className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">{formData.name}</span>
              </div>
            )}
            {formData.phone && (
              <div className="flex items-center gap-2 text-body-sm">
                <Phone className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">{formData.phone}</span>
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="divider" />

        {/* Fulfillment Details */}
        <section>
          <h4 className="text-body-sm font-medium text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Получение
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-body-sm">
              {formData.fulfillmentType === 'delivery' ? (
                <Truck className="w-4 h-4 text-text-muted" />
              ) : (
                <Store className="w-4 h-4 text-text-muted" />
              )}
              <span className="text-text-secondary">
                {getFulfillmentTypeLabel(formData.fulfillmentType === 'delivery' ? FulfillmentType.DELIVERY : FulfillmentType.PICKUP)}
              </span>
            </div>
            
            {formData.fulfillmentType === 'delivery' && formData.address && (
              <div className="flex items-start gap-2 text-body-sm">
                <MapPin className="w-4 h-4 text-text-muted mt-0.5" />
                <span className="text-text-secondary">{formData.address}</span>
              </div>
            )}

            {formData.fulfillmentType === 'pickup' && (
              <div className="flex items-start gap-2 text-body-sm">
                <Store className="w-4 h-4 text-text-muted mt-0.5" />
                <span className="text-text-secondary">
                  Жигалово
                </span>
              </div>
            )}

            {formData.date && (
              <div className="flex items-center gap-2 text-body-sm">
                <Calendar className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">
                  {new Date(formData.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
            )}

            {formData.time && (
              <div className="flex items-center gap-2 text-body-sm">
                <Clock className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">{formData.time}</span>
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="divider" />

        {/* Payment Method */}
        <section>
          <h4 className="text-body-sm font-medium text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Оплата
          </h4>
          <div className="flex items-center gap-2 text-body-sm">
            <CreditCard className="w-4 h-4 text-text-muted" />
            <span className="text-text-secondary">
              {getPaymentMethodLabel(formData.paymentMethod)}
            </span>
          </div>
        </section>

        {/* Divider */}
        <div className="divider-gold" />

        {/* Totals */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-body-md text-text-secondary">Стоимость блюд</span>
            <span className="text-body-md font-medium text-text-primary font-mono">
              {formatPrice(subtotal)}
            </span>
          </div>

          {formData.fulfillmentType === 'delivery' && (
            <div className="flex justify-between items-center">
              <span className="text-body-md text-text-secondary">Доставка</span>
              <span className={`text-body-md font-medium font-mono ${deliveryFee === 0 ? 'text-success' : 'text-text-primary'}`}>
                {deliveryFee === 0 ? 'Бесплатно' : formatPrice(deliveryFee)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-border/50">
            <span className="text-heading-sm font-serif text-text-primary">Итого</span>
            <span className="text-display-sm font-serif text-gradient-gold">
              {formatPrice(total)}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
