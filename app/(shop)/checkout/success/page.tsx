'use client';

/**
 * Checkout Success Page
 * Order confirmation with summary
 */

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Package, 
  User, 
  Phone, 
  MapPin, 
  Store,
  Calendar, 
  Clock, 
  CreditCard,
  Truck,
  Receipt,
  ShoppingBag,
  ArrowRight,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { formatPrice, getPaymentMethodLabel, getFulfillmentTypeLabel } from '@/app/lib/utils';
import { decryptData } from '@/app/lib/crypto';
import { Dish, FulfillmentType, PaymentMethod } from '@/app/types';

interface OrderItem {
  dishId: string;
  dish: Dish;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

interface OrderData {
  orderNumber: string;
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
  };
  fulfillmentType: FulfillmentType;
  address?: string;
  date: string;
  time: string;
  paymentMethod: PaymentMethod;
  comment?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

function CheckoutSuccessInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOffline = searchParams.get('offline') === '1';
  const [order, setOrder] = useState<OrderData | null>(null);
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    (async () => {
      const raw = sessionStorage.getItem('lastOrder');
      if (raw) {
        const decrypted = await decryptData(raw);
        if (decrypted) {
          try {
            setOrder(JSON.parse(decrypted));
          } catch {
            // legacy plaintext fallback
            setOrder(JSON.parse(raw));
          }
        }
      } else if (!isOffline) {
        // Redirect if no order data (only for online orders)
        router.push('/');
      }
    })();

    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, isOffline]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Success Animation Overlay */}
        {showAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-fade-out">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <h2 className="font-serif text-display-sm text-text-primary animate-fade-in-up">
                Заказ оформлен!
              </h2>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h1 className="font-serif text-display-md text-text-primary mb-3">
              {isOffline ? 'Заказ сохранён' : 'Спасибо за заказ!'}
            </h1>
            <p className="text-body-lg text-text-secondary">
              {isOffline
                ? 'При подключении к интернету заказ будет отправлен на согласование'
                : 'Ваш заказ успешно оформлен и принят в обработку'}
            </p>
          </div>

          {/* Order Card */}
          <div className="bg-surface-secondary rounded-2xl border border-border/50 overflow-hidden mb-8">
            {/* Order Number Banner */}
            <div className="px-6 py-4 bg-gold/10 border-b border-gold/20">
              <div className="flex items-center justify-between">
                <span className="text-body-sm text-text-secondary">Номер заказа</span>
                <span className="font-mono text-heading-md text-gold">{order.orderNumber}</span>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Items Summary */}
              <section>
                <h3 className="text-body-sm font-medium text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Заказанные блюда ({order.items.length})
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                      <div className="flex-1">
                        <p className="text-body-md text-text-primary">{item.dish.title}</p>
                        <p className="text-caption text-text-muted">
                          {item.quantity} × {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <p className="text-body-md font-medium text-gold font-mono">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Customer Info */}
              <section>
                <h3 className="text-body-sm font-medium text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Контактная информация
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-text-muted" />
                    <span className="text-body-md text-text-secondary">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-text-muted" />
                    <span className="text-body-md text-text-secondary">{order.customer.phone}</span>
                  </div>
                </div>
              </section>

              {/* Fulfillment Details */}
              <section>
                <h3 className="text-body-sm font-medium text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Детали получения
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {order.fulfillmentType === 'delivery' ? (
                      <Truck className="w-5 h-5 text-text-muted" />
                    ) : (
                      <Store className="w-5 h-5 text-text-muted" />
                    )}
                    <span className="text-body-md text-text-secondary">
                      {getFulfillmentTypeLabel(order.fulfillmentType)}
                    </span>
                  </div>
                  
                  {order.fulfillmentType === 'delivery' && order.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-text-muted mt-0.5" />
                      <span className="text-body-md text-text-secondary">{order.address}</span>
                    </div>
                  )}

                  {order.fulfillmentType === 'pickup' && (
                    <div className="flex items-start gap-3">
                      <Store className="w-5 h-5 text-text-muted mt-0.5" />
                      <span className="text-body-md text-text-secondary">
                        Жигалово
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-text-muted" />
                    <span className="text-body-md text-text-secondary">
                      {new Date(order.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-text-muted" />
                    <span className="text-body-md text-text-secondary">{order.time}</span>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h3 className="text-body-sm font-medium text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Способ оплаты
                </h3>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-text-muted" />
                  <span className="text-body-md text-text-secondary">
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </span>
                </div>
              </section>

              {/* Comment */}
              {order.comment && (
                <section>
                  <h3 className="text-body-sm font-medium text-text-muted uppercase tracking-wider mb-4">
                    Комментарий
                  </h3>
                  <p className="text-body-md text-text-secondary bg-surface p-4 rounded-lg">
                    {order.comment}
                  </p>
                </section>
              )}

              {/* Divider */}
              <div className="divider-gold" />

              {/* Totals */}
              <section className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-body-md text-text-secondary">Стоимость блюд</span>
                  <span className="text-body-md font-medium text-text-primary font-mono">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                {order.fulfillmentType === 'delivery' && (
                  <div className="flex justify-between items-center">
                    <span className="text-body-md text-text-secondary">Доставка</span>
                    <span className={`text-body-md font-medium font-mono ${order.deliveryFee === 0 ? 'text-success' : 'text-text-primary'}`}>
                      {order.deliveryFee === 0 ? 'Бесплатно' : formatPrice(order.deliveryFee)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                  <span className="text-heading-md font-serif text-text-primary">Итого</span>
                  <span className="text-display-md font-serif text-gradient-gold">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </section>
            </div>
          </div>

          {/* Offline Warning */}
          {isOffline && (
            <div className="mb-8 p-6 bg-warning/10 rounded-xl border border-warning/30">
              <div className="flex items-start gap-3">
                <WifiOff className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-body-md font-medium text-text-primary">
                    Вы оформили заказ без интернета
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    Заказ сохранён на устройстве и будет автоматически отправлен, когда появится соединение.
                  </p>
                  <div className="flex items-start gap-2 text-caption text-warning">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Обратите внимание: цены, наличие блюд и их состав могли измениться с момента сохранения заказа. 
                      Если что-то изменится, я свяжусь с вами для уточнения.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Message */}
          <div className="text-center mb-8 p-6 bg-surface-secondary rounded-xl border border-border/50">
            <p className="text-body-md text-text-secondary">
              {isOffline
                ? 'Как только заказ будет отправлен, я пришлю вам подтверждение.'
                : 'Я отправила подтверждение на ваш телефон. Свяжусь с вами в ближайшее время для уточнения деталей.'}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold hover:bg-gold-light text-background font-semibold rounded-xl transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              Продолжить покупки
            </Link>
            <Link
              href="/orders"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface hover:bg-surface-hover text-text-primary font-semibold rounded-xl border border-border transition-all duration-200"
            >
              Мои заказы
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    }>
      <CheckoutSuccessInner />
    </Suspense>
  );
}
