'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/app/hooks/useOrders';
import { useUpdateOrderStatus } from '@/app/hooks/useOrders';
import { Skeleton } from '@/app/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  ShoppingBag,
  Calendar,
  Phone,
  User,
  ChevronDown,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<string, { label: string; color: string; next: string[] }> = {
  pending: { label: 'В обработке', color: 'bg-blue-500/20 text-blue-400', next: ['confirmed', 'cancelled'] },
  confirmed: { label: 'Подтверждён', color: 'bg-green-500/20 text-green-400', next: ['preparing', 'cancelled'] },
  preparing: { label: 'Готовится', color: 'bg-orange-500/20 text-orange-400', next: ['ready', 'cancelled'] },
  ready: { label: 'Готов', color: 'bg-emerald-500/20 text-emerald-400', next: ['delivered', 'cancelled'] },
  delivered: { label: 'Доставлен', color: 'bg-text-muted/20 text-text-muted', next: [] },
  cancelled: { label: 'Отменён', color: 'bg-red-500/20 text-red-400', next: [] },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const { data: orders, isLoading, error } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (statusFilter === 'all') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status: newStatus });
      toast.success(`Статус заказа обновлён: ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при обновлении статуса');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Ошибка загрузки заказов
          </h2>
          <p className="text-sm text-text-secondary">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-gold" />
            Заказы
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Управление заказами и их статусами
          </p>
        </div>
        <div className="text-sm text-text-muted">
          Всего: {isLoading ? '...' : filteredOrders.length}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              statusFilter === status
                ? 'bg-gold text-background-primary'
                : 'bg-surface-secondary text-text-secondary hover:bg-surface-hover'
            )}
          >
            {status === 'all' ? 'Все' : STATUS_CONFIG[status]?.label || status}
            {status !== 'all' && orders && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter((o) => o.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-surface-secondary rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">
              {statusFilter === 'all' ? 'Нет заказов' : `Нет заказов со статусом "${STATUS_CONFIG[statusFilter]?.label}"`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 hover:bg-background-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-text-primary">
                        #{order.orderNumber || order.id.slice(0, 8)}
                      </span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', STATUS_CONFIG[order.status]?.color || 'bg-blue-500/20 text-blue-400')}>
                        {STATUS_CONFIG[order.status]?.label || order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {order.customer?.name || '—'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {order.customer?.phone || '—'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                      </span>
                    </div>

                    {selectedOrder === order.id && order.items && (
                      <div className="mt-3 pl-3 border-l-2 border-border space-y-1">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="text-sm text-text-secondary flex justify-between">
                            <span>
                              {item.quantity}x {item.dish?.title || 'Блюдо'}
                            </span>
                            <span className="text-text-primary">
                              {(item.price * item.quantity).toLocaleString()} ₽
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-semibold text-text-primary text-lg">
                      {order.total?.toLocaleString() || 0} ₽
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted transition-colors"
                        title="Детали"
                      >
                        <ChevronDown className={cn('w-4 h-4 transition-transform', selectedOrder === order.id && 'rotate-180')} />
                      </button>

                      {STATUS_CONFIG[order.status]?.next.length > 0 && (
                        <div className="relative group">
                          <button className="px-2 py-1 text-xs bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors flex items-center gap-1">
                            Изменить <ChevronDown className="w-3 h-3" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 bg-surface-primary border border-border rounded-lg shadow-lg overflow-hidden hidden group-hover:block z-10 min-w-[140px]">
                            {STATUS_CONFIG[order.status].next.map((nextStatus) => (
                              <button
                                key={nextStatus}
                                onClick={() => handleStatusChange(order.id, nextStatus)}
                                disabled={updateStatus.isPending}
                                className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-surface-hover transition-colors flex items-center gap-2"
                              >
                                {updateStatus.isPending && updateStatus.variables?.orderId === order.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <span className={cn('w-2 h-2 rounded-full', STATUS_CONFIG[nextStatus]?.color.split(' ')[0] || 'bg-blue-500')} />
                                )}
                                {STATUS_CONFIG[nextStatus]?.label || nextStatus}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
