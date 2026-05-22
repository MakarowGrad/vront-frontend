'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Printer,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  Truck,
  Package,
  User,
  Calendar,
  MessageSquare,
  Loader2,
  X,
  Check,
  ChevronDown,
  Lock,
  Unlock,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { StatusBadge, PaymentStatusBadge } from '../../components/StatusBadge';
import { useOrder, useUpdateOrderStatus } from '@/app/hooks/useOrders';
import { useCreateBlockedSlot } from '@/app/hooks/useAvailability';
import { Order, OrderStatus } from '@/app/types';

const statusOptions = [
  { value: OrderStatus.PENDING, label: 'Ожидает' },
  { value: OrderStatus.CONFIRMED, label: 'Подтвержден' },
  { value: OrderStatus.PREPARING, label: 'Готовится' },
  { value: OrderStatus.READY, label: 'Готов' },
  { value: OrderStatus.DELIVERING, label: 'В доставке' },
  { value: OrderStatus.DELIVERED, label: 'Доставлен' },
  { value: OrderStatus.CANCELLED, label: 'Отменен' },
  { value: OrderStatus.REFUNDED, label: 'Возвращен' },
];

const paymentMethodLabels: Record<string, string> = {
  cash: 'Наличными',
  bank_transfer: 'Банковский перевод',
  by_agreement: 'По договоренности',
};

const fulfillmentLabels: Record<string, string> = {
  delivery: 'Доставка',
  pickup: 'Самовывоз',
  catering: 'Кейтеринг',
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  const { data: backendOrder, isLoading: apiLoading } = useOrder(orderId);
  const updateOrderStatus = useUpdateOrderStatus();
  const createBlockedSlot = useCreateBlockedSlot();

  useEffect(() => {
    if (apiLoading) return;
    if (backendOrder) {
      // Adapt backend order to frontend Order type
      const adapted: Order = {
        ...backendOrder,
        customerId: (backendOrder as any).customer?.phone || '',
        items: (backendOrder.items || []).map((item: any) => ({
          id: item.id || `${item.dishId}-${Date.now()}`,
          dishId: item.dishId,
          dish: item.dish,
          quantity: item.quantity,
          price: item.price,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          specialInstructions: item.specialInstructions,
        })),
        status: backendOrder.status as OrderStatus,
        statusHistory: (backendOrder.statusHistory || [{ status: backendOrder.status, timestamp: backendOrder.createdAt }]) as any,
        fulfillmentType: backendOrder.fulfillmentType as any,
        deliveryAddress: backendOrder.deliveryAddress,
        subtotal: backendOrder.subtotal || backendOrder.total,
        deliveryFee: backendOrder.deliveryFee || 0,
        paymentMethod: backendOrder.paymentMethod as any,
        paymentStatus: backendOrder.paymentStatus || 'pending',
        specialInstructions: backendOrder.specialInstructions || (backendOrder as any).comment,
        createdAt: backendOrder.createdAt,
        updatedAt: backendOrder.updatedAt,
      };
      setOrder(adapted);
    }
    setIsLoading(false);
  }, [backendOrder, apiLoading]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order || newStatus === order.status) return;

    if (newStatus === OrderStatus.CONFIRMED) {
      setPendingStatus(newStatus);
      setConfirmDialogOpen(true);
      setShowStatusDropdown(false);
      return;
    }

    applyStatusChange(newStatus);
  };

  const applyStatusChange = (newStatus: OrderStatus) => {
    if (!order) return;
    setIsUpdating(true);
    updateOrderStatus.mutate(
      { orderId, status: newStatus },
      {
        onSuccess: () => {
          setOrder((prev) => prev ? { ...prev, status: newStatus } : null);
          setShowStatusDropdown(false);
          setIsUpdating(false);
          setPendingStatus(null);
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Ошибка при обновлении статуса');
          setIsUpdating(false);
        },
      }
    );
  };

  const handleBlockAndConfirm = (isFullDay: boolean) => {
    if (!order?.pickupTime) {
      applyStatusChange(pendingStatus!);
      return;
    }
    const d = new Date(order.pickupTime);
    const dateStr = d.toISOString().split('T')[0];
    const timeStr = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' });

    createBlockedSlot.mutate(
      {
        date: dateStr,
        timeSlots: isFullDay ? [] : [timeStr],
        isFullDay,
        reason: `Заказ ${order.orderNumber}`,
      },
      {
        onSuccess: () => {
          toast.success(isFullDay ? 'День заблокирован' : 'Слот заблокирован');
          applyStatusChange(pendingStatus!);
          setConfirmDialogOpen(false);
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Ошибка при блокировке');
        },
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
        <p className="text-body-sm text-text-muted">Загрузка заказа...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
          <X className="w-8 h-8 text-error" />
        </div>
        <h2 className="font-serif text-heading-lg text-text-primary mb-2">Заказ не найден</h2>
        <p className="text-body-sm text-text-muted mb-4">Запрашиваемый заказ не существует</p>
        <Link href="/admin/orders">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к списку
          </Button>
        </Link>
      </div>
    );
  }

  const customer = {
    fullName: (backendOrder as any)?.customer?.name || '—',
    phone: (backendOrder as any)?.customer?.phone || '—',
    email: (backendOrder as any)?.customer?.email || '—',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-heading-xl text-text-primary">{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-body-sm text-text-muted mt-1">
              Создан {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-body-sm text-text-primary hover:bg-surface-hover transition-colors"
            >
              Изменить статус
              <ChevronDown className="w-4 h-4" />
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface-primary border border-border rounded-lg shadow-lg z-10">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`w-full px-4 py-2.5 text-left text-body-sm hover:bg-surface-hover transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      order.status === option.value ? 'text-gold bg-gold/5' : 'text-text-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {option.label}
                      {order.status === option.value && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Печать
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-surface-primary rounded-xl border border-border p-6">
            <h2 className="font-serif text-heading-lg text-text-primary mb-4">Состав заказа</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-surface-secondary rounded-lg"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-tertiary flex-shrink-0">
                    {item.dish.coverImage ? (
                      <Image
                        src={item.dish.coverImage}
                        alt={item.dish.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-text-muted" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body-sm font-medium text-text-primary truncate">
                      {item.dish.title}
                    </h3>
                    <p className="text-caption text-text-muted">
                      {item.quantity} × {(item.unitPrice || item.price || 0).toLocaleString('ru-RU')} ₽
                    </p>
                    {item.specialInstructions && (
                      <p className="text-caption text-warning mt-1">
                        Примечание: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-body-sm font-medium text-gold">
                      {(item.totalPrice || (item.price || 0) * item.quantity).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Breakdown */}
            <div className="mt-6 pt-6 border-t border-border space-y-2">
              <div className="flex justify-between text-body-sm">
                <span className="text-text-secondary">Подытог</span>
                <span className="text-text-primary">{(order.subtotal || order.total).toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-text-secondary">НДС (10%)</span>
                <span className="text-text-primary">{(order.tax || 0).toLocaleString('ru-RU')} ₽</span>
              </div>
              {(order.deliveryFee || 0) > 0 && (
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-secondary">Доставка</span>
                  <span className="text-text-primary">{(order.deliveryFee || 0).toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              {(order.discount || 0) > 0 && (
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-secondary">Скидка</span>
                  <span className="text-success">-{(order.discount || 0).toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              <div className="flex justify-between pt-4 border-t border-border">
                <span className="text-body-md font-medium text-text-primary">Итого</span>
                <span className="text-heading-md font-semibold text-gold">
                  {order.total.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-surface-primary rounded-xl border border-border p-6">
            <h2 className="font-serif text-heading-lg text-text-primary mb-4">История статусов</h2>
            <div className="space-y-4">
              {(order.statusHistory || []).map((history, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={history.status} size="sm" />
                      <span className="text-caption text-text-muted">
                        {new Date(history.timestamp).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {history.note && (
                      <p className="text-body-xs text-text-secondary mt-1">{history.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          {(order.specialInstructions || order.internalNotes) && (
            <div className="bg-surface-primary rounded-xl border border-border p-6">
              <h2 className="font-serif text-heading-lg text-text-primary mb-4">Комментарии</h2>
              <div className="space-y-4">
                {order.specialInstructions && (
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-body-xs font-medium text-text-muted uppercase tracking-wider">
                        От клиента
                      </span>
                      <p className="text-body-sm text-text-secondary mt-1">
                        {order.specialInstructions}
                      </p>
                    </div>
                  </div>
                )}
                {order.internalNotes && (
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-body-xs font-medium text-text-muted uppercase tracking-wider">
                        Внутренние заметки
                      </span>
                      <p className="text-body-sm text-text-secondary mt-1">
                        {order.internalNotes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-surface-primary rounded-xl border border-border p-6">
            <h2 className="font-serif text-heading-md text-text-primary mb-4">Клиент</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-body-sm font-medium text-text-primary">
                    {customer?.fullName || '—'}
                  </p>
                  <p className="text-caption text-text-muted">{customer?.email || '—'}</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-body-sm">
                  <Phone className="w-4 h-4 text-text-muted" />
                  <span className="text-text-secondary">{customer?.phone || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm">
                  <Mail className="w-4 h-4 text-text-muted" />
                  <span className="text-text-secondary">{customer?.email || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fulfillment Info */}
          <div className="bg-surface-primary rounded-xl border border-border p-6">
            <h2 className="font-serif text-heading-md text-text-primary mb-4">Доставка</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-body-sm font-medium text-text-primary">
                    {fulfillmentLabels[order.fulfillmentType]}
                  </p>
                  <p className="text-caption text-text-muted">
                    {order.fulfillmentType === 'delivery' ? 'Доставка' : 'Самовывоз'}
                  </p>
                </div>
              </div>

              {order.deliveryAddress && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-body-sm text-text-secondary">
                        {order.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {order.pickupTime && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    <span className="text-body-sm text-text-secondary">
                      {new Date(order.pickupTime).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-surface-primary rounded-xl border border-border p-6">
            <h2 className="font-serif text-heading-md text-text-primary mb-4">Оплата</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-body-sm font-medium text-text-primary">
                    {paymentMethodLabels[order.paymentMethod]}
                  </p>
                  <p className="text-caption text-text-muted">
                    {order.paymentStatus === 'paid' ? 'Оплачено' : 'Ожидает оплаты'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <PaymentStatusBadge status={order.paymentStatus || 'pending'} />
              </div>
            </div>
          </div>

          {/* Order Meta */}
          <div className="bg-surface-primary rounded-xl border border-border p-6">
            <h2 className="font-serif text-heading-md text-text-primary mb-4">Информация</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-body-sm">
                <Clock className="w-4 h-4 text-text-muted" />
                <span className="text-text-muted">Создан:</span>
                <span className="text-text-secondary">
                  {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {order.completedAt && (
                <div className="flex items-center gap-2 text-body-sm">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-text-muted">Завершен:</span>
                  <span className="text-text-secondary">
                    {new Date(order.completedAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-body-sm">
                <Package className="w-4 h-4 text-text-muted" />
                <span className="text-text-muted">Позиций:</span>
                <span className="text-text-secondary">{order.items.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog with Calendar */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent size="default">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              Подтверждение заказа
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Вы подтверждаете заказ на:
            </p>
            {order?.pickupTime ? (
              <div className="p-3 rounded-lg bg-surface border border-border">
                <p className="text-lg font-medium text-text-primary">
                  {new Date(order.pickupTime).toLocaleDateString('ru-RU', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  Время: {new Date(order.pickupTime).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-text-muted">Время заказа не указано</p>
            )}

            <p className="text-sm text-text-secondary">
              Хотите заблокировать это время, чтобы другие заказы не попали на эту же дату/время?
            </p>
          </div>

          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <button
              onClick={() => setConfirmDialogOpen(false)}
              className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:bg-surface-hover transition-colors text-sm font-medium"
            >
              Отмена
            </button>
            <button
              onClick={() => applyStatusChange(pendingStatus!)}
              className="px-4 py-2 rounded-lg border border-gold text-gold hover:bg-gold/10 transition-colors text-sm font-medium"
            >
              <Unlock className="w-4 h-4 inline mr-1" />
              Подтвердить без блокировки
            </button>
            {order?.pickupTime && (
              <>
                <button
                  onClick={() => handleBlockAndConfirm(false)}
                  disabled={createBlockedSlot.isPending}
                  className="px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/50 text-orange-400 hover:bg-orange-500/20 transition-colors text-sm font-medium"
                >
                  <Lock className="w-4 h-4 inline mr-1" />
                  Заблокировать этот слот
                </button>
                <button
                  onClick={() => handleBlockAndConfirm(true)}
                  disabled={createBlockedSlot.isPending}
                  className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
                >
                  <Lock className="w-4 h-4 inline mr-1" />
                  Заблокировать весь день
                </button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
