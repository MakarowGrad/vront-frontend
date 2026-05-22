'use client';

import { OrderStatus } from '@/app/types';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  [OrderStatus.PENDING]: {
    label: 'Ожидает',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  [OrderStatus.CONFIRMED]: {
    label: 'Подтвержден',
    className: 'bg-info/10 text-info border-info/20',
  },
  [OrderStatus.PREPARING]: {
    label: 'Готовится',
    className: 'bg-gold/10 text-gold border-gold/20',
  },
  [OrderStatus.READY]: {
    label: 'Готов',
    className: 'bg-success/10 text-success border-success/20',
  },
  [OrderStatus.DELIVERING]: {
    label: 'В доставке',
    className: 'bg-info/10 text-info border-info/20',
  },
  [OrderStatus.DELIVERED]: {
    label: 'Доставлен',
    className: 'bg-success/20 text-success border-success/30',
  },
  [OrderStatus.CANCELLED]: {
    label: 'Отменен',
    className: 'bg-error/10 text-error border-error/20',
  },
  [OrderStatus.REFUNDED]: {
    label: 'Возвращен',
    className: 'bg-error/20 text-error border-error/30',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-caption'
    : 'px-2.5 py-1 text-body-xs';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${sizeClasses}
        ${config.className}
      `}
    >
      <span className={`
        w-1.5 h-1.5 rounded-full
        ${status === OrderStatus.DELIVERED || status === OrderStatus.READY
          ? 'bg-current'
          : 'animate-pulse bg-current'
        }
      `} />
      {config.label}
    </span>
  );
}

// Payment status badge
interface PaymentStatusBadgeProps {
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  size?: 'sm' | 'md';
}

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Ожидает оплаты',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  paid: {
    label: 'Оплачен',
    className: 'bg-success/10 text-success border-success/20',
  },
  failed: {
    label: 'Ошибка',
    className: 'bg-error/10 text-error border-error/20',
  },
  refunded: {
    label: 'Возвращен',
    className: 'bg-error/20 text-error border-error/30',
  },
};

export function PaymentStatusBadge({ status, size = 'md' }: PaymentStatusBadgeProps) {
  const config = paymentStatusConfig[status];
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-caption'
    : 'px-2.5 py-1 text-body-xs';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${sizeClasses}
        ${config.className}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

// Availability toggle badge
interface AvailabilityBadgeProps {
  isAvailable: boolean;
  onToggle?: () => void;
  size?: 'sm' | 'md';
}

export function AvailabilityBadge({ isAvailable, onToggle, size = 'md' }: AvailabilityBadgeProps) {
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-caption'
    : 'px-2.5 py-1 text-body-xs';

  return (
    <button
      onClick={onToggle}
      disabled={!onToggle}
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors
        ${sizeClasses}
        ${isAvailable
          ? 'bg-success/10 text-success border-success/20 hover:bg-success/20'
          : 'bg-error/10 text-error border-error/20 hover:bg-error/20'
        }
        ${onToggle ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      <span className={`
        w-1.5 h-1.5 rounded-full
        ${isAvailable ? 'bg-success' : 'bg-error'}
      `} />
      {isAvailable ? 'Доступно' : 'Недоступно'}
    </button>
  );
}
