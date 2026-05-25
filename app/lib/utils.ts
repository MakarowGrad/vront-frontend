/**
 * Utility Functions - Luxury Food Delivery
 * Common utility functions used across the application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Dish, Order, OrderStatus, PaymentMethod, FulfillmentType } from '@/app/types';
import { API_BASE } from '@/app/lib/api';

// ============================================================================
// Image URL Helper
// ============================================================================

/**
 * Convert relative image URL to full URL using backend host
 */
export function getImageUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('blob:')) return '/icons/icon-192x192.png';
  if (url.startsWith('http')) return url;
  const apiBase = API_BASE.replace('/api', '');
  return `${apiBase}${url.startsWith('/') ? url : '/' + url}`;
}

// ============================================================================
// CSS Utilities
// ============================================================================

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Format price with currency
 */
export function formatPrice(
  price: number,
  options: {
    currency?: string;
    locale?: string;
    decimals?: boolean;
  } = {}
): string {
  const { currency = 'RUB', locale = 'ru-RU', decimals = false } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(price);
}

/**
 * Format weight with unit
 */
export function formatWeight(
  weight: number,
  unit: string = 'g',
  options: { locale?: string } = {}
): string {
  const { locale = 'ru-RU' } = options;

  const unitLabels: Record<string, string> = {
    g: 'г',
    kg: 'кг',
    ml: 'мл',
    l: 'л',
    pcs: 'шт',
  };

  return `${new Intl.NumberFormat(locale).format(weight)} ${unitLabels[unit] || unit}`;
}

/**
 * Format date
 */
export function formatDate(
  date: string | Date,
  options: {
    locale?: string;
    format?: 'short' | 'medium' | 'long' | 'full';
    includeTime?: boolean;
  } = {}
): string {
  const { locale = 'ru-RU', format = 'medium', includeTime = false } = options;
  const d = typeof date === 'string' ? new Date(date) : date;

  const dateStyle = format;
  const timeStyle = includeTime ? 'short' : undefined;

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle,
  }).format(d);
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
  }
  
  if (cleaned.length === 10) {
    return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`;
  }
  
  return phone;
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Russian format)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11 || cleaned.length === 10;
}

/**
 * Validate quantity for a dish
 */
export function validateDishQuantity(
  dish: Dish,
  quantity: number
): { valid: boolean; message?: string } {
  if (quantity < dish.minQty) {
    return {
      valid: false,
      message: `Минимальное количество: ${dish.minQty}`,
    };
  }

  if ((dish.maxQty || 100) && quantity > (dish.maxQty || 100)) {
    return {
      valid: false,
      message: `Максимальное количество: ${dish.maxQty || 100}`,
    };
  }

  if (quantity % dish.orderStep !== 0) {
    return {
      valid: false,
      message: `Количество должно быть кратно ${dish.orderStep}`,
    };
  }

  return { valid: true };
}

// ============================================================================
// Dish Utilities
// ============================================================================

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Get nearest valid quantity for a dish
 */
export function getNearestValidQuantity(dish: Dish, quantity: number): number {
  const minQty = dish.minQty;
  const step = dish.orderStep;

  if (quantity < minQty) return minQty;

  const remainder = (quantity - minQty) % step;
  let validQty = quantity - remainder;

  if (remainder > step / 2) {
    validQty += step;
  }

  if ((dish.maxQty || 100) && validQty > (dish.maxQty || 100)) {
    return (dish.maxQty || 100);
  }

  return Math.max(minQty, validQty);
}

/**
 * Calculate dish price for a given quantity
 */
export function calculateDishPrice(dish: Dish, quantity: number): number {
  const validQty = getNearestValidQuantity(dish, quantity);
  return dish.price * validQty;
}

// ============================================================================
// Order Utilities
// ============================================================================

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `GE-${year}${month}${day}-${random}`;
}

/**
 * Get order status label
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Ожидает подтверждения',
    [OrderStatus.CONFIRMED]: 'Подтвержден',
    [OrderStatus.PREPARING]: 'Готовится',
    [OrderStatus.READY]: 'Готов к выдаче',
    [OrderStatus.DELIVERING]: 'В пути',
    [OrderStatus.DELIVERED]: 'Доставлен',
    [OrderStatus.CANCELLED]: 'Отменен',
    [OrderStatus.REFUNDED]: 'Возвращен',
  };

  return labels[status] || status;
}

/**
 * Get order status color
 */
export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'yellow',
    [OrderStatus.CONFIRMED]: 'blue',
    [OrderStatus.PREPARING]: 'orange',
    [OrderStatus.READY]: 'green',
    [OrderStatus.DELIVERING]: 'indigo',
    [OrderStatus.DELIVERED]: 'green',
    [OrderStatus.CANCELLED]: 'red',
    [OrderStatus.REFUNDED]: 'gray',
  };

  return colors[status] || 'gray';
}

/**
 * Get payment method label
 */
export function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: 'Наличными',
    [PaymentMethod.BANK_TRANSFER]: 'Банковский перевод',
    [PaymentMethod.BY_AGREEMENT]: 'По договоренности',
  };

  return labels[method] || method;
}

/**
 * Get fulfillment type label
 */
export function getFulfillmentTypeLabel(type: FulfillmentType): string {
  const labels: Record<FulfillmentType, string> = {
    [FulfillmentType.DELIVERY]: 'Доставка',
    [FulfillmentType.PICKUP]: 'Самовывоз',
    [FulfillmentType.CATERING]: 'Кейтеринг',
  };

  return labels[type] || type;
}

// ============================================================================
// Array/Object Utilities
// ============================================================================

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    return {
      ...groups,
      [groupKey]: [...(groups[groupKey] || []), item],
    };
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// Local Storage Utilities
// ============================================================================

/**
 * Safely get item from localStorage
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Safely set item to localStorage
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Safely remove item from localStorage
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage errors
  }
}
