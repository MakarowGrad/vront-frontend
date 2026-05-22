/**
 * Application Constants - В СВОЕЙ ТАРЕЛКЕ
 * Centralized configuration and constants
 */

import { OrderStatus, PaymentMethod, FulfillmentType } from '@/app/types';

// ============================================================================
// App Configuration
// ============================================================================

export const APP_NAME = 'В СВОЕЙ ТАРЕЛКЕ';
export const APP_TAGLINE = 'Фуршеты и праздничные столы от Жанны';
export const APP_DESCRIPTION = 'Фуршеты и праздничные столы в Жигалово. Готовлю с душой и с любовью.';

export const CONTACT = {
  phone: '8 (902) 547-55-44',
  email: 'info@vsvoitar.ru',
  address: 'Жигалово',
  workingHours: '9:00 - 21:00',
};

export const SOCIAL_LINKS = {
  instagram: '',
  telegram: '',
  whatsapp: 'https://wa.me/79025475544',
  vk: '',
};

// ============================================================================
// Business Rules
// ============================================================================

export const CART_CONFIG = {
  FREE_DELIVERY_THRESHOLD: 5000, // RUB
  BASE_DELIVERY_FEE: 500, // RUB
  TAX_RATE: 0.1, // 10%
  MAX_ITEMS: 100,
  MAX_QUANTITY_PER_ITEM: 1000,
};

export const ORDER_CONFIG = {
  MIN_ORDER_AMOUNT: 1000, // RUB
  MAX_ORDER_AMOUNT: 500000, // RUB
  PREPARATION_TIME_BUFFER: 30, // minutes
  SAME_DAY_CUTOFF_HOUR: 16, // orders after 16:00 for next day
};

// ============================================================================
// Display Settings
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  LIMIT_OPTIONS: [12, 24, 48],
};

export const DISH_DISPLAY = {
  HERO_SLIDES: 5,
  FEATURED_DISHES: 6,
  RELATED_DISHES: 4,
  MAX_GALLERY_IMAGES: 8,
};

export const ANIMATION = {
  CARD_ANIMATION_DURATION: 300, // ms
  TOAST_DURATION: 5000, // ms
  DEBOUNCE_DELAY: 300, // ms
  SCROLL_THRESHOLD: 100, // px
};

// ============================================================================
// Status Configurations
// ============================================================================

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  [OrderStatus.PENDING]: {
    label: 'Ожидает подтверждения',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: 'Clock',
  },
  [OrderStatus.CONFIRMED]: {
    label: 'Подтвержден',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: 'CheckCircle',
  },
  [OrderStatus.PREPARING]: {
    label: 'Готовится',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: 'ChefHat',
  },
  [OrderStatus.READY]: {
    label: 'Готов к выдаче',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: 'Package',
  },
  [OrderStatus.DELIVERING]: {
    label: 'В пути',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    icon: 'Truck',
  },
  [OrderStatus.DELIVERED]: {
    label: 'Доставлен',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: 'CheckCircle2',
  },
  [OrderStatus.CANCELLED]: {
    label: 'Отменен',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: 'XCircle',
  },
  [OrderStatus.REFUNDED]: {
    label: 'Возвращен',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: 'RotateCcw',
  },
};

export const PAYMENT_METHOD_CONFIG: Record<
  PaymentMethod,
  { label: string; description: string; icon: string }
> = {
  [PaymentMethod.CASH]: {
    label: 'Наличными',
    description: 'Оплата при получении',
    icon: 'Banknote',
  },
  [PaymentMethod.BANK_TRANSFER]: {
    label: 'Банковский перевод',
    description: 'Перевод на расчетный счет',
    icon: 'Building2',
  },
  [PaymentMethod.BY_AGREEMENT]: {
    label: 'По договоренности',
    description: 'Индивидуальные условия',
    icon: 'Handshake',
  },
};

export const FULFILLMENT_TYPE_CONFIG: Record<
  FulfillmentType,
  { label: string; description: string; icon: string; estimatedTime: string }
> = {
  [FulfillmentType.DELIVERY]: {
    label: 'Доставка',
    description: 'Привезу блюда к вам',
    icon: 'Truck',
    estimatedTime: 'По договоренности',
  },
  [FulfillmentType.PICKUP]: {
    label: 'Самовывоз',
    description: 'Заберите заказ самостоятельно',
    icon: 'Store',
    estimatedTime: 'По договоренности',
  },
  [FulfillmentType.CATERING]: {
    label: 'Кейтеринг',
    description: 'Полное обслуживание мероприятия',
    icon: 'Utensils',
    estimatedTime: 'По договоренности',
  },
};

// ============================================================================
// Category Images (fallback)
// ============================================================================

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'appetizers': '/images/categories/appetizers.jpg',
  'soups': '/images/categories/soups.jpg',
  'salads': '/images/categories/salads.jpg',
  'main-courses': '/images/categories/main-courses.jpg',
  'desserts': '/images/categories/desserts.jpg',
  'beverages': '/images/categories/beverages.jpg',
  'default': '/images/categories/default.jpg',
};

// ============================================================================
// Dish Badges
// ============================================================================

export const DISH_BADGES = {
  HIT: {
    label: 'Хит',
    color: 'bg-amber-500',
    textColor: 'text-white',
  },
  NEW: {
    label: 'Новинка',
    color: 'bg-emerald-500',
    textColor: 'text-white',
  },
  SEASONAL: {
    label: 'Сезонное',
    color: 'bg-purple-500',
    textColor: 'text-white',
  },
  UNAVAILABLE: {
    label: 'Недоступно',
    color: 'bg-gray-400',
    textColor: 'text-white',
  },
};

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  GENERIC: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
  NETWORK: 'Ошибка соединения. Проверьте подключение к интернету.',
  NOT_FOUND: 'Запрашиваемый ресурс не найден.',
  UNAUTHORIZED: 'Необходима авторизация.',
  FORBIDDEN: 'Доступ запрещен.',
  VALIDATION: 'Пожалуйста, проверьте введенные данные.',
  
  // Cart errors
  CART_EMPTY: 'Корзина пуста',
  CART_MAX_ITEMS: 'Достигнуто максимальное количество товаров',
  CART_MIN_ORDER: `Минимальная сумма заказа ${CART_CONFIG.FREE_DELIVERY_THRESHOLD} ₽`,
  
  // Dish errors
  DISH_UNAVAILABLE: 'Блюдо временно недоступно',
  DISH_MIN_QTY: (min: number) => `Минимальное количество: ${min}`,
  DISH_STEP_QTY: (step: number) => `Количество должно быть кратно ${step}`,
};

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  CART_ADDED: 'Товар добавлен в корзину',
  CART_REMOVED: 'Товар удален из корзины',
  CART_CLEARED: 'Корзина очищена',
  
  FAVORITE_ADDED: 'Добавлено в избранное',
  FAVORITE_REMOVED: 'Удалено из избранного',
  
  ORDER_CREATED: 'Заказ успешно создан',
  ORDER_CANCELLED: 'Заказ отменен',
  
  PROFILE_UPDATED: 'Профиль обновлен',
  ADDRESS_ADDED: 'Адрес добавлен',
  ADDRESS_REMOVED: 'Адрес удален',
};

// ============================================================================
// Routes
// ============================================================================

export const ROUTES = {
  // Customer
  HOME: '/',
  CATALOG: '/catalog',
  DISH: (slug: string) => `/dish/${slug}`,
  FAVORITES: '/favorites',
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  ORDERS: '/orders',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_DISHES: '/admin/dishes',
  ADMIN_DISH_NEW: '/admin/dishes/new',
  ADMIN_DISH_EDIT: (id: string) => `/admin/dishes/${id}/edit`,
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER_DETAIL: (id: string) => `/admin/orders/${id}`,
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
};

// ============================================================================
// API Endpoints
// ============================================================================

export const API_ENDPOINTS = {
  DISHES: '/api/dishes',
  DISH: (id: string) => `/api/dishes/${id}`,
  CATEGORIES: '/api/categories',
  ORDERS: '/api/orders',
  ORDER: (id: string) => `/api/orders/${id}`,
};

// ============================================================================
// Local Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  CART: 'vtar-cart',
  FAVORITES: 'vtar-favorites',
  UI: 'vtar-ui',
  THEME: 'vtar-theme',
  AUTH: 'vtar-auth',
};
