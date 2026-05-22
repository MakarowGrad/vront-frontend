/**
 * useCart Hook
 * Convenient hook for cart operations with toast notifications
 */

import { useCallback } from 'react';
import { useCartStore } from '@/app/store/cartStore';
import { Dish } from '@/app/types';
import { toast } from '@/app/components/ui/toast';

export function useCart() {
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateSpecialInstructions,
    clearCart,
    getCartTotal,
    getCartCount,
    getItemCount,
    getItemById,
    isInCart,
  } = useCartStore();

  const addToCartWithToast = useCallback(
    (dish: Dish, quantity?: number, specialInstructions?: string) => {
      addToCart(dish, quantity, specialInstructions);
      
      const qty = quantity || dish.orderStep;
      toast.success({
        title: 'Добавлено в корзину',
        description: `${dish.title} × ${qty} добавлено в корзину`
      });
    },
    [addToCart]
  );

  const removeFromCartWithToast = useCallback(
    (dishId: string, dishTitle: string) => {
      removeFromCart(dishId);
      toast.info({ title: 'Удалено из корзины', description: `${dishTitle} удалено из корзины` });
    },
    [removeFromCart]
  );

  const updateQuantityWithValidation = useCallback(
    (dishId: string, quantity: number, dish: Dish) => {
      // Ensure quantity respects orderStep
      let qty = quantity;
      if (qty % dish.orderStep !== 0) {
        qty = Math.round(qty / dish.orderStep) * dish.orderStep;
      }
      
      // Respect min/max constraints
      qty = Math.max(dish.minQty, Math.min(qty, (dish.maxQty || 100)));
      
      updateQuantity(dishId, qty);
    },
    [updateQuantity]
  );

  const incrementQuantity = useCallback(
    (dishId: string, dish: Dish) => {
      const currentCount = getItemCount(dishId);
      const newQuantity = currentCount + dish.orderStep;
      
      if (newQuantity <= (dish.maxQty || 100)) {
        updateQuantity(dishId, newQuantity);
      } else {
        toast.warning({
          title: 'Достигнут лимит',
          description: `Максимальное количество: ${dish.maxQty || 100}`
        });
      }
    },
    [getItemCount, updateQuantity]
  );

  const decrementQuantity = useCallback(
    (dishId: string, dish: Dish) => {
      const currentCount = getItemCount(dishId);
      const newQuantity = currentCount - dish.orderStep;
      
      if (newQuantity >= dish.minQty) {
        updateQuantity(dishId, newQuantity);
      } else if (currentCount > 0) {
        // Remove item if going below minQty
        removeFromCart(dishId);
        toast.info({ title: 'Удалено из корзины', description: `${dish.title} удалено из корзины` });
      }
    },
    [getItemCount, updateQuantity, removeFromCart]
  );

  const getQuantityForDish = useCallback(
    (dishId: string) => {
      return getItemCount(dishId);
    },
    [getItemCount]
  );

  const getStepText = useCallback((dish: Dish) => {
    if (dish.orderStep === 1) return null;
    return `Кратно ${dish.orderStep} шт`;
  }, []);

  const getValidQuantities = useCallback((dish: Dish): number[] => {
    const quantities: number[] = [];
    for (let i = dish.minQty; i <= (dish.maxQty || 100); i += dish.orderStep) {
      quantities.push(i);
    }
    return quantities;
  }, []);

  return {
    // State
    items,
    cartTotal: getCartTotal(),
    cartCount: getCartCount(),
    
    // Actions
    addToCart: addToCartWithToast,
    removeFromCart: removeFromCartWithToast,
    updateQuantity: updateQuantityWithValidation,
    incrementQuantity,
    decrementQuantity,
    updateSpecialInstructions,
    clearCart,
    
    // Getters
    getQuantityForDish,
    isInCart,
    getItemById,
    getStepText,
    getValidQuantities,
  };
}
