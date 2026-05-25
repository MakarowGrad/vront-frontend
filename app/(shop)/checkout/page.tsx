'use client';

/**
 * Checkout Page
 * Complete checkout form with validation and order summary
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Shield, WifiOff } from 'lucide-react';
import { useCartStore } from '@/app/store/cartStore';
import { PaymentMethod } from '@/app/types';
import { CheckoutForm, CheckoutFormData } from '@/app/components/checkout/CheckoutForm';
import { OrderSummary } from '@/app/components/checkout/OrderSummary';
import { saveOrderOffline } from '@/app/lib/offlineOrder';
import { encryptData } from '@/app/lib/crypto';
import { useMaxBackButton } from '@/app/hooks/useMaxBackButton';
import { getMaxUser } from '@/app/lib/max-bridge';
import { API_BASE } from '@/lib/api';

export default function CheckoutPage() {
  useMaxBackButton();
  const router = useRouter();
  const { items, getSubtotal, getDeliveryFee, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // Load preferences from cart page
  useEffect(() => {
    const prefs = sessionStorage.getItem('checkoutPrefs');
    if (prefs) {
      const parsed = JSON.parse(prefs);
      setFormData({
        name: '',
        phone: '',
        fulfillmentType: parsed.fulfillmentType || 'delivery',
        address: parsed.address || '',
        date: '',
        time: '',
        comment: parsed.comment || '',
        paymentMethod: PaymentMethod.CASH,
      });
    }
  }, []);

  // Redirect if cart is empty (but not after successful submission)
  useEffect(() => {
    if (items.length === 0 && !isLoading && !orderSubmitted) {
      router.push('/cart');
    }
  }, [items, router, isLoading, orderSubmitted]);

  const handleSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true);
    setFormData(data);
    setIsOffline(false);

    const maxUser = getMaxUser();
    const orderPayload = {
      phone: data.phone,
      customerName: data.name,
      paymentMethod: ({
        [PaymentMethod.CASH]: 'cash',
        [PaymentMethod.BANK_TRANSFER]: 'card',
        [PaymentMethod.BY_AGREEMENT]: 'online',
      } as Record<string, string>)[data.paymentMethod] || 'cash',
      fulfillmentType: data.fulfillmentType,
      deliveryAddress: data.fulfillmentType === 'delivery' ? data.address || '' : undefined,
      pickupTime: data.date && data.time ? `${data.date} ${data.time}` : undefined,
      comment: data.comment,
      maxChatId: maxUser?.id ? String(maxUser.id) : undefined,
      items: items.map((item) => ({
        dishId: item.dishId,
        quantity: item.quantity,
      })),
    };

    // Offline mode
    if (!navigator.onLine) {
      try {
        await saveOrderOffline({
          items: orderPayload.items,
          total: getSubtotal() + (data.fulfillmentType === 'delivery' ? getDeliveryFee() : 0),
          customerName: data.name,
          customerPhone: data.phone,
          deliveryAddress: orderPayload.deliveryAddress || '',
          comment: data.comment,
        });

        // SECURITY-FIX-LS-002: Encrypt PII before storing in localStorage [2026-05-18]
        localStorage.setItem('customer_phone', await encryptData(data.phone));
        if (data.name) localStorage.setItem('customer_name', await encryptData(data.name));

        setIsOffline(true);
        setOrderSubmitted(true);
        clearCart();
        router.push('/checkout/success?offline=1');
      } catch (err: any) {
        alert('Не удалось сохранить заказ. Попробуйте ещё раз.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Online mode
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Ошибка при оформлении заказа');
      }

      const result = await response.json();
      const createdOrder = result.data || result;

      const orderData = {
        orderNumber: createdOrder.orderNumber,
        items: items.map((item) => ({
          dishId: item.dishId,
          dish: item.dish,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          specialInstructions: item.specialInstructions,
        })),
        customer: { name: data.name, phone: data.phone },
        fulfillmentType: data.fulfillmentType,
        address: data.address,
        date: data.date,
        time: data.time,
        paymentMethod: data.paymentMethod,
        comment: data.comment,
        subtotal: getSubtotal(),
        deliveryFee: data.fulfillmentType === 'delivery' ? getDeliveryFee() : 0,
        total: createdOrder.total,
      };

      // SECURITY-FIX-LS-002: Encrypt PII before storing in localStorage [2026-05-18]
      localStorage.setItem('customer_phone', await encryptData(data.phone));
      if (data.name) localStorage.setItem('customer_name', await encryptData(data.name));

      sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
      setOrderSubmitted(true);
      clearCart();
      router.push('/checkout/success');
    } catch (err: any) {
      alert(err.message || 'Ошибка при оформлении заказа');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking cart
  if (items.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-body-sm text-text-muted mb-8">
          <Link href="/" className="hover:text-gold transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-gold transition-colors">
            Корзина
          </Link>
          <span>/</span>
          <span className="text-text-primary">Оформление</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-display-sm text-text-primary">
            Оформление заказа
          </h1>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-body-md text-gold hover:text-gold-light transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Вернуться в корзину
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-surface-secondary rounded-xl border border-border/50 p-6">
              <CheckoutForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                initialValues={formData || undefined}
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            {formData && <OrderSummary formData={formData} />}
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-12 flex items-center justify-center gap-2 text-caption text-text-muted">
          <Shield className="w-4 h-4" />
          <span>Ваши данные защищены и не передаются третьим лицам</span>
        </div>
      </div>
    </div>
  );
}
