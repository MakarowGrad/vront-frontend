/**
 * Cart Store - Zustand
 * Manages cart state with orderStep handling
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Dish } from '@/app/types';
import { hapticLight } from '@/app/lib/max-bridge';

interface CartState {
  items: CartItem[];
  
  // Actions
  addToCart: (dish: Dish, quantity?: number, specialInstructions?: string) => void;
  addItem: (dish: Dish, quantity?: number, specialInstructions?: string) => void;
  removeItem: (dishId: string) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  setItemInstructions: (dishId: string, instructions: string) => void;
  updateSpecialInstructions: (dishId: string, instructions: string) => void;
  clearCart: () => void;
  
  // Getters
  getCartTotal: () => number;
  getCartCount: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getTotalQuantity: () => number;
  getItemCount: (dishId: string) => number;
  getItemById: (dishId: string) => CartItem | undefined;
  isInCart: (dishId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (dish: Dish, quantity?: number, specialInstructions?: string) => {
        hapticLight();
        const { items } = get();
        const existingItem = items.find((item) => item.dishId === dish.id);
        
        // Validate and adjust quantity based on orderStep
        let qty = quantity || dish.orderStep;
        
        // Ensure quantity is a multiple of orderStep
        if (qty % dish.orderStep !== 0) {
          qty = Math.ceil(qty / dish.orderStep) * dish.orderStep;
        }
        
        // Respect min/max constraints
        qty = Math.max(dish.minQty, Math.min(qty, (dish.maxQty || 100)));

        if (existingItem) {
          // Update existing item
          const newQuantity = Math.min(
            existingItem.quantity + qty,
            (dish.maxQty || 100)
          );
          
          set({
            items: items.map((item) =>
              item.dishId === dish.id
                ? {
                    ...item,
                    quantity: newQuantity,
                    totalPrice: newQuantity * item.unitPrice,
                    specialInstructions: specialInstructions || item.specialInstructions,
                  }
                : item
            ),
          });
        } else {
          // Add new item
          const newItem: CartItem = {
            dishId: dish.id,
            dish,
            quantity: qty,
            unitPrice: dish.price,
            totalPrice: qty * dish.price,
            specialInstructions,
            addedAt: new Date().toISOString(),
          };
          set({ items: [...items, newItem] });
        }
      },

      addItem: (dish: Dish, quantity?: number, specialInstructions?: string) => {
        get().addToCart(dish, quantity, specialInstructions);
      },

      removeItem: (dishId: string) => {
        const { items } = get();
        set({ items: items.filter((item) => item.dishId !== dishId) });
      },

      removeFromCart: (dishId: string) => {
        get().removeItem(dishId);
      },

      updateQuantity: (dishId: string, quantity: number) => {
        const { items } = get();
        const item = items.find((i) => i.dishId === dishId);
        
        if (!item) return;
        
        const dish = item.dish;
        
        // Ensure quantity is a multiple of orderStep
        let qty = quantity;
        if (qty % dish.orderStep !== 0) {
          qty = Math.round(qty / dish.orderStep) * dish.orderStep;
        }
        
        // Respect min/max constraints
        qty = Math.max(dish.minQty, Math.min(qty, (dish.maxQty || 100)));
        
        if (qty <= 0) {
          // Remove item if quantity is 0 or less
          set({ items: items.filter((i) => i.dishId !== dishId) });
        } else {
          set({
            items: items.map((i) =>
              i.dishId === dishId
                ? {
                    ...i,
                    quantity: qty,
                    totalPrice: qty * i.unitPrice,
                  }
                : i
            ),
          });
        }
      },

      setItemInstructions: (dishId: string, instructions: string) => {
        const { items } = get();
        set({
          items: items.map((item) =>
            item.dishId === dishId
              ? { ...item, specialInstructions: instructions }
              : item
          ),
        });
      },

      updateSpecialInstructions: (dishId: string, instructions: string) => {
        get().setItemInstructions(dishId, instructions);
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.totalPrice, 0);
      },

      getCartCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.totalPrice, 0);
      },

      getDeliveryFee: () => {
        // Free delivery for orders over 5000, otherwise 500
        const subtotal = get().getSubtotal();
        return subtotal >= 5000 ? 0 : 500;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryFee();
      },

      getTotalQuantity: () => {
        return get().getCartCount();
      },

      getItemCount: (dishId: string) => {
        const { items } = get();
        const item = items.find((i) => i.dishId === dishId);
        return item?.quantity || 0;
      },

      getItemById: (dishId: string) => {
        const { items } = get();
        return items.find((i) => i.dishId === dishId);
      },

      isInCart: (dishId: string) => {
        const { items } = get();
        return items.some((i) => i.dishId === dishId);
      },
    }),
    {
      name: 'gourmet-express-cart',
      version: 1,
    }
  )
);
