'use client';

/**
 * OrderCard Component
 * Individual order card for order history
 */

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, RotateCcw, Package, Calendar, Clock, Truck, Store } from 'lucide-react';
import { Order, OrderStatus } from '@/app/types';
import { getImageUrl } from '@/app/lib/utils';
import { 
  formatPrice, 
  formatDate, 
  getOrderStatusLabel, 
  getFulfillmentTypeLabel 
} from '@/app/lib/utils';

interface OrderCardProps {
  order: Order;
  onReorder: (order: Order) => void;
}

const statusColors: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  [OrderStatus.PENDING]: { 
    bg: 'bg-yellow-500/10', 
    text: 'text-yellow-500',
    border: 'border-yellow-500/30'
  },
  [OrderStatus.CONFIRMED]: { 
    bg: 'bg-blue-500/10', 
    text: 'text-blue-500',
    border: 'border-blue-500/30'
  },
  [OrderStatus.PREPARING]: { 
    bg: 'bg-orange-500/10', 
    text: 'text-orange-500',
    border: 'border-orange-500/30'
  },
  [OrderStatus.READY]: { 
    bg: 'bg-green-500/10', 
    text: 'text-green-500',
    border: 'border-green-500/30'
  },
  [OrderStatus.DELIVERING]: { 
    bg: 'bg-indigo-500/10', 
    text: 'text-indigo-500',
    border: 'border-indigo-500/30'
  },
  [OrderStatus.DELIVERED]: { 
    bg: 'bg-success/10', 
    text: 'text-success',
    border: 'border-success/30'
  },
  [OrderStatus.CANCELLED]: { 
    bg: 'bg-error/10', 
    text: 'text-error',
    border: 'border-error/30'
  },
  [OrderStatus.REFUNDED]: { 
    bg: 'bg-gray-500/10', 
    text: 'text-gray-500',
    border: 'border-gray-500/30'
  },
};

export function OrderCard({ order, onReorder }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusStyle = statusColors[order.status];
  const itemCount = order.items.length;
  const canReorder = [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status);

  return (
    <div className="bg-surface-secondary rounded-xl border border-border/50 overflow-hidden transition-all duration-200 hover:border-border-light">
      {/* Header - Always visible */}
      <div 
        className="p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Order Number & Date */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3 rounded-lg bg-surface">
              <Package className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-body-md font-semibold text-text-primary">
                  {order.orderNumber}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-caption font-medium ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                  {getOrderStatusLabel(order.status)}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-caption text-text-muted flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {order.pickupTime
                    ? new Date(order.pickupTime).toLocaleDateString('ru-RU', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' })
                    : formatDate(order.createdAt, { format: 'short' })}
                </span>
                {order.pickupTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(order.pickupTime).toLocaleTimeString('ru-RU', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  {order.fulfillmentType === 'delivery' ? (
                    <Truck className="w-3 h-3" />
                  ) : (
                    <Store className="w-3 h-3" />
                  )}
                  {getFulfillmentTypeLabel(order.fulfillmentType)}
                </span>
              </div>
            </div>
          </div>

          {/* Total & Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-right">
              <p className="price-display text-body-lg">{formatPrice(order.total)}</p>
              <p className="text-caption text-text-muted">
                {itemCount} {itemCount === 1 ? 'позиция' : itemCount < 5 ? 'позиции' : 'позиций'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {canReorder && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorder(order);
                  }}
                  className="p-2 rounded-lg bg-surface hover:bg-gold/10 text-text-muted hover:text-gold transition-colors"
                  title="Повторить заказ"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <div className={`p-2 rounded-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-5 h-5 text-text-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border/50 animate-fade-in">
          <div className="p-5 space-y-4">
            {/* Items */}
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-surface-tertiary">
                    <Image
                      src={getImageUrl(item.dish.coverImage || item.dish.image || '')}
                      alt={item.dish.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-medium text-text-primary truncate">
                      {item.dish.title}
                    </p>
                    <p className="text-caption text-text-muted">
                      {item.quantity} × {formatPrice(item.unitPrice || item.price || 0)}
                    </p>
                  </div>
                  <p className="text-body-sm font-medium text-gold font-mono">
                    {formatPrice(item.totalPrice || (item.price || 0) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="divider" />

            {/* Order Details */}
            <div className="grid sm:grid-cols-2 gap-4 text-body-sm">
              <div>
                <span className="text-text-muted">Стоимость блюд:</span>
                <span className="ml-2 text-text-primary font-mono">{formatPrice(order.subtotal || order.total)}</span>
              </div>
              {(order.deliveryFee || 0) > 0 && (
                <div>
                  <span className="text-text-muted">Доставка:</span>
                  <span className="ml-2 text-text-primary font-mono">{formatPrice(order.deliveryFee || 0)}</span>
                </div>
              )}
              {(order.discount || 0) > 0 && (
                <div>
                  <span className="text-text-muted">Скидка:</span>
                  <span className="ml-2 text-success font-mono">-{formatPrice(order.discount || 0)}</span>
                </div>
              )}
            </div>

            {/* Status History */}
            {(order.statusHistory || []).length > 0 && (
              <>
                <div className="divider" />
                <div>
                  <h4 className="text-caption text-text-muted uppercase tracking-wider mb-3">
                    История заказа
                  </h4>
                  <div className="space-y-2">
                    {(order.statusHistory || []).map((history, index) => (
                      <div key={index} className="flex items-center gap-3 text-body-sm">
                        <div className="w-2 h-2 rounded-full bg-gold" />
                        <span className="text-text-secondary">{getOrderStatusLabel(history.status)}</span>
                        <span className="text-text-muted">
                          {formatDate(history.timestamp, { format: 'short', includeTime: true })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Special Instructions */}
            {order.specialInstructions && (
              <>
                <div className="divider" />
                <div>
                  <h4 className="text-caption text-text-muted uppercase tracking-wider mb-2">
                    Комментарий
                  </h4>
                  <p className="text-body-sm text-text-secondary">{order.specialInstructions}</p>
                </div>
              </>
            )}

            {/* Reorder Button */}
            {canReorder && (
              <div className="pt-2">
                <button
                  onClick={() => onReorder(order)}
                  className="w-full py-3 px-4 bg-gold/10 hover:bg-gold/20 text-gold font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Повторить заказ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
