'use client';

/**
 * Order History Page
 * List of past orders with filtering and reorder functionality
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  ChevronRight, 
  ShoppingBag,
  Filter,
  RotateCcw,
  LogOut,
  User,
  Loader2
} from 'lucide-react';
import { Order, OrderStatus } from '@/app/types';
import { decryptData } from '@/app/lib/crypto';
import { OrderCard } from '@/app/components/orders/OrderCard';
import { ReorderModal } from '@/app/components/orders/ReorderModal';

const mockOrders: any[] = [];

const API_URL = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3001/api` : 'http://localhost:3001/api';

const STATUS_FILTERS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Все заказы' },
  { value: OrderStatus.PENDING, label: 'Ожидают' },
  { value: OrderStatus.CONFIRMED, label: 'Подтверждены' },
  { value: OrderStatus.PREPARING, label: 'Готовятся' },
  { value: OrderStatus.READY, label: 'Готовы' },
  { value: OrderStatus.DELIVERING, label: 'В пути' },
  { value: OrderStatus.DELIVERED, label: 'Доставлены' },
  { value: OrderStatus.CANCELLED, label: 'Отменены' },
];

interface ApiOrder {
  id: string;
  orderNumber: string;
  status: string;
  items: any[];
  total: number;
  paymentMethod: string;
  fulfillmentType: string;
  createdAt: string;
  updatedAt: string;
  customer: { phone: string; name?: string };
  deliveryAddress?: any;
  pickupTime?: string;
  specialInstructions?: string;
  statusHistory?: any[];
}

function adaptApiOrder(apiOrder: ApiOrder): Order {
  return {
    ...apiOrder,
    customerId: apiOrder.customer?.phone || '',
    status: apiOrder.status as OrderStatus,
    statusHistory: apiOrder.statusHistory || [{ status: apiOrder.status as OrderStatus, timestamp: apiOrder.createdAt }],
    paymentMethod: apiOrder.paymentMethod as any,
    fulfillmentType: apiOrder.fulfillmentType as any,
    subtotal: apiOrder.total,
    deliveryFee: 0,
    discount: 0,
    paymentStatus: 'pending',
    createdAt: apiOrder.createdAt,
    updatedAt: apiOrder.updatedAt,
  } as Order;
}

export default function OrdersPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [reorderOrder, setReorderOrder] = useState<Order | null>(null);
  const [showReorderSuccess, setShowReorderSuccess] = useState(false);
  
  const [customerPhone, setCustomerPhone] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [useMock, setUseMock] = useState(false);

  // SECURITY-FIX-LS-002: Decrypt PII from localStorage [2026-05-18]
  useEffect(() => {
    (async () => {
      const phone = await decryptData(localStorage.getItem('customer_phone') || '');
      const name = await decryptData(localStorage.getItem('customer_name') || '');
      
      if (!phone) {
        router.push('/login');
        return;
      }
      
      setCustomerPhone(phone);
      setCustomerName(name);
      
      // Load orders from API
      fetch(`${API_URL}/orders/customer/${encodeURIComponent(phone)}`)
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки заказов');
        return res.json();
      })
      .then((data: ApiOrder[]) => {
        if (Array.isArray(data)) {
          setOrders(data.map(adaptApiOrder));
        } else {
          setOrders([]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load orders:', err);
        setError('Не удалось загрузить заказы. Показаны демо-данные.');
        setOrders(mockOrders);
        setUseMock(true);
        setIsLoading(false);
      });
    })();
  }, [router]);

  const handleLogout = useCallback(() => {
    // SECURITY-FIX-LS-002: Clear encrypted PII on logout [2026-05-18]
    localStorage.removeItem('customer_phone');
    localStorage.removeItem('customer_name');
    router.push('/login');
  }, [router]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (selectedStatus === 'all') return orders;
    return orders.filter((order) => order.status === selectedStatus);
  }, [selectedStatus, orders]);

  // Sort by date (newest first)
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filteredOrders]);

  const handleReorder = (order: Order) => {
    setReorderOrder(order);
  };

  const handleReorderSuccess = () => {
    setShowReorderSuccess(true);
    setTimeout(() => {
      setShowReorderSuccess(false);
      router.push('/cart');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="text-text-secondary">Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-secondary flex items-center justify-center">
              <Package className="w-12 h-12 text-text-muted" />
            </div>

            {/* Title */}
            <h1 className="font-serif text-display-sm text-text-primary mb-3">
              Нет заказов
            </h1>

            {/* Description */}
            <p className="text-body-md text-text-secondary mb-8">
              У вас пока нет оформленных заказов. Сделайте свой первый заказ!
            </p>

            {/* CTA */}
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold-light text-background font-semibold rounded-xl transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
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
          <span className="text-text-primary">Мои заказы</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-display-sm text-text-primary flex items-center gap-3">
              <Package className="w-8 h-8 text-gold" />
              Мои заказы
              <span className="text-heading-md text-text-muted font-normal">
                ({orders.length})
              </span>
            </h1>
            {customerPhone && (
              <div className="flex items-center gap-2 mt-2 text-body-sm text-text-secondary">
                <User className="w-4 h-4" />
                <span>{customerName || customerPhone}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-3 border border-border hover:border-error/50 text-text-secondary hover:text-error rounded-xl transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-background font-medium rounded-xl transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
              Новый заказ
            </Link>
          </div>
        </div>

        {/* API Error Warning */}
        {error && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm">
            {error}
          </div>
        )}

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedStatus === filter.value
                  ? 'bg-gold text-background'
                  : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {sortedOrders.length > 0 ? (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onReorder={handleReorder}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-secondary rounded-xl border border-border/50">
            <p className="text-body-lg text-text-muted">
              Нет заказов с выбранным статусом
            </p>
            <button
              onClick={() => setSelectedStatus('all')}
              className="mt-4 text-gold hover:text-gold-light transition-colors"
            >
              Показать все заказы
            </button>
          </div>
        )}
      </div>

      {/* Reorder Modal */}
      {reorderOrder && (
        <ReorderModal
          order={reorderOrder}
          isOpen={!!reorderOrder}
          onClose={() => setReorderOrder(null)}
          onSuccess={handleReorderSuccess}
        />
      )}

      {/* Reorder Success Toast */}
      {showReorderSuccess && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="flex items-center gap-3 px-6 py-4 bg-success/90 backdrop-blur-sm text-white rounded-xl shadow-lg">
            <RotateCcw className="w-5 h-5" />
            <span className="text-body-md font-medium">Заказ добавлен в корзину</span>
          </div>
        </div>
      )}
    </div>
  );
}
