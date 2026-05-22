'use client';

/**
 * ReorderModal Component
 * Modal for handling reorder with validation
 */

import { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, RotateCcw, ShoppingBag } from 'lucide-react';
import { Order, Dish } from '@/app/types';
import { useCartStore } from '@/app/store/cartStore';
import { useDishes } from '@/app/hooks/useDishes';
import { formatPrice, validateDishQuantity } from '@/app/lib/utils';

interface ReorderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ValidationResult {
  dish: Dish;
  requestedQty: number;
  validQty: number;
  issues: string[];
}

export function ReorderModal({ order, isOpen, onClose, onSuccess }: ReorderModalProps) {
  const { addItem } = useCartStore();
  const { data: dishes = [] } = useDishes();
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  if (!isOpen) return null;

  const validateReorder = (): ValidationResult[] => {
    const results: ValidationResult[] = [];

    order.items.forEach((item) => {
      // Find current dish data
      const currentDish = dishes.find((d) => d.id === item.dishId);
      const issues: string[] = [];
      let validQty = item.quantity;

      if (!currentDish) {
        issues.push('Блюдо удалено из меню');
        validQty = 0;
      } else if (!currentDish.isAvailable) {
        issues.push('Блюдо временно недоступно');
        validQty = 0;
      } else {
        // Validate quantity
        const validation = validateDishQuantity(currentDish, item.quantity);
        if (!validation.valid) {
          issues.push(validation.message || 'Некорректное количество');
          // Calculate nearest valid quantity
          const minQty = currentDish.minQty;
          const step = currentDish.orderStep;
          const maxQty = currentDish.maxQty || Infinity;
          
          if (item.quantity < minQty) {
            validQty = minQty;
          } else if (maxQty && item.quantity > maxQty) {
            validQty = maxQty;
          } else {
            const remainder = (item.quantity - minQty) % step;
            validQty = item.quantity - remainder;
            if (remainder > step / 2 && validQty + step <= maxQty) {
              validQty += step;
            }
          }
        }
      }

      if (issues.length > 0 || validQty !== item.quantity) {
        results.push({
          dish: currentDish || (item.dish as Dish),
          requestedQty: item.quantity,
          validQty,
          issues,
        });
      }
    });

    return results;
  };

  const handleValidate = () => {
    const results = validateReorder();
    setValidationResults(results);
    setShowValidation(true);
  };

  const handleConfirmReorder = async () => {
    setIsProcessing(true);

    // Add items to cart
    for (const item of order.items) {
      const currentDish = dishes.find((d) => d.id === item.dishId);
      
      if (!currentDish || !currentDish.isAvailable) continue;

      // Find validation result for this item
      const validation = validationResults.find((v) => v.dish.id === item.dishId);
      const qtyToAdd = validation ? validation.validQty : item.quantity;

      if (qtyToAdd > 0) {
        addItem(currentDish, qtyToAdd);
      }
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsProcessing(false);
    onSuccess();
    onClose();
  };

  const hasIssues = validationResults.length > 0;
  const availableItems = order.items.filter((item) => {
    const currentDish = dishes.find((d) => d.id === item.dishId);
    return currentDish?.isAvailable ?? false;
  });

  if (showValidation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-lg bg-surface-secondary rounded-2xl border border-border/50 shadow-2xl animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <h3 className="font-serif text-heading-md text-text-primary flex items-center gap-2">
              {hasIssues ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Требуется внимание
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Готово к повторению
                </>
              )}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {hasIssues ? (
              <>
                <p className="text-body-md text-text-secondary">
                  Некоторые позиции в заказе были изменены:
                </p>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {validationResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-warning/5 border border-warning/20"
                    >
                      <p className="text-body-sm font-medium text-text-primary">
                        {result.dish.title}
                      </p>
                      <div className="mt-1 space-y-1">
                        {result.issues.map((issue, i) => (
                          <p key={i} className="text-caption text-warning">
                            • {issue}
                          </p>
                        ))}
                        {result.validQty !== result.requestedQty && result.validQty > 0 && (
                          <p className="text-caption text-text-secondary">
                            Будет добавлено: {result.validQty} шт.
                          </p>
                        )}
                        {result.validQty === 0 && (
                          <p className="text-caption text-error">
                            Не будет добавлено в корзину
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center py-4">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                </div>
                <p className="text-center text-body-md text-text-secondary">
                  Все позиции из заказа <span className="font-mono text-gold">{order.orderNumber}</span> доступны и будут добавлены в корзину
                </p>
              </>
            )}

            {/* Items Summary */}
            <div className="p-4 rounded-lg bg-surface">
              <p className="text-caption text-text-muted uppercase tracking-wider mb-2">
                Состав заказа
              </p>
              <div className="space-y-1">
                {order.items.map((item, index) => {
                  const validation = validationResults.find((v) => v.dish.id === item.dishId);
                  const isSkipped = validation?.validQty === 0;
                  
                  return (
                    <div
                      key={index}
                      className={`flex justify-between text-body-sm ${isSkipped ? 'opacity-50' : ''}`}
                    >
                      <span className={isSkipped ? 'line-through text-text-muted' : 'text-text-secondary'}>
                        {item.dish.title}
                      </span>
                      <span className="font-mono text-text-primary">
                        {validation ? validation.validQty : item.quantity} шт.
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 p-5 border-t border-border/50">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-surface hover:bg-surface-hover text-text-primary font-medium rounded-lg transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleConfirmReorder}
              disabled={isProcessing || availableItems.length === 0}
              className="flex-1 py-3 px-4 bg-gold hover:bg-gold-light text-background font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Добавление...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Добавить в корзину
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-surface-secondary rounded-2xl border border-border/50 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <h3 className="font-serif text-heading-md text-text-primary flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-gold" />
            Повторить заказ
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-body-md text-text-secondary">
            Вы хотите повторить заказ <span className="font-mono text-gold">{order.orderNumber}</span>?
          </p>

          {/* Items Preview */}
          <div className="p-4 rounded-lg bg-surface">
            <p className="text-caption text-text-muted uppercase tracking-wider mb-3">
              Состав заказа ({order.items.length} позиций)
            </p>
            <div className="space-y-2">
              {order.items.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between text-body-sm">
                  <span className="text-text-secondary truncate">{item.dish.title}</span>
                  <span className="text-text-muted font-mono">× {item.quantity}</span>
                </div>
              ))}
              {order.items.length > 5 && (
                <p className="text-caption text-text-muted">
                  и еще {order.items.length - 5} позиций...
                </p>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center p-3 rounded-lg bg-gold/5">
            <span className="text-body-md text-text-secondary">Сумма заказа</span>
            <span className="text-heading-sm font-serif text-gold">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-5 border-t border-border/50">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-surface hover:bg-surface-hover text-text-primary font-medium rounded-lg transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleValidate}
            className="flex-1 py-3 px-4 bg-gold hover:bg-gold-light text-background font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Проверить
          </button>
        </div>
      </div>
    </div>
  );
}
