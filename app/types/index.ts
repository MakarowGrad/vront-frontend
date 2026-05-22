/**
 * TypeScript Types - Luxury Food Delivery
 * Aligned with backend API contracts
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  BY_AGREEMENT = 'by_agreement',
}

export enum FulfillmentType {
  DELIVERY = 'delivery',
  PICKUP = 'pickup',
  CATERING = 'catering',
}

// ============================================================================
// DISH
// ============================================================================

export interface Dish {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  shortDescription?: string;
  description?: string;
  fullDescription?: string;
  composition?: string;
  allergens?: string[];
  calories?: number;
  proteins?: number;
  fats?: number;
  carbohydrates?: number;
  price: number;
  weight?: number;
  weightUnit?: string;
  preparationTime?: number;
  servingTemperature?: string;
  orderStep: number;
  minQty: number;
  maxQty?: number;
  isHit: boolean;
  isNew: boolean;
  isAvailable: boolean;
  availability?: string;
  coverImage?: string;
  gallery?: string[];
  images?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  reviewCount?: number;
  explodeVideo?: string | null;
  assembleVideo?: string | null;
  sortOrder?: number;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
  };
}

// ============================================================================
// CATEGORY
// ============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  dishCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'dishCount'>;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;
export type CreateDishInput = Omit<Dish, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDishInput = Partial<Dish>;
export type UpdateOrderInput = Partial<Order>;
export type CreateOrderInput = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber' | 'status'>;
export type AnimationState = 'idle' | 'exploding' | 'exploded' | 'assembling' | 'assembled';

export interface OrderFilters {
  status?: OrderStatus;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  startDate?: string;
  endDate?: string;
  fulfillmentType?: FulfillmentType;
  paymentStatus?: string;
}

// ============================================================================
// CART
// ============================================================================

export interface CartItem {
  dishId: string;
  dish: Dish;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  addedAt: string;
}

// ============================================================================
// ADDRESS
// ============================================================================

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  deliveryInstructions?: string;
}

// ============================================================================
// CUSTOMER
// ============================================================================

export interface CustomerPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  favoriteCategories: string[];
  newsletterSubscribed: boolean;
}

export interface Customer {
  id: string;
  email?: string | null;
  phone: string;
  name?: string | null;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  addresses?: Address[];
  defaultAddressId?: string;
  preferences?: CustomerPreferences;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// ORDER
// ============================================================================

export interface OrderItemDish {
  id: string;
  title: string;
  image?: string;
  coverImage?: string;
}

export interface OrderItem {
  id: string;
  dishId: string;
  dish: OrderItemDish;
  quantity: number;
  price: number;
  unitPrice?: number;
  totalPrice?: number;
  specialInstructions?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  statusHistory?: StatusHistoryEntry[];
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  pickupTime?: string;
  deliveryTime?: string;
  comment?: string;
  subtotal?: number;
  deliveryFee?: number;
  tax?: number;
  discount?: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  specialInstructions?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  customer?: {
    phone: string;
    name?: string | null;
    email?: string | null;
  };
}

// ============================================================================
// FILTER & SORT
// ============================================================================

export type SortOption = 
  | 'popular' 
  | 'price_asc' 
  | 'price_desc' 
  | 'name_asc' 
  | 'name_desc' 
  | 'newest';

export interface DishFilters {
  category?: string;
  search?: string;
  isHit?: boolean;
  isNew?: boolean;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

// ============================================================================
// CHECKOUT FORM
// ============================================================================

export interface CheckoutFormData {
  name: string;
  phone: string;
  fulfillmentType: FulfillmentType;
  address?: string;
  date: string;
  time: string;
  paymentMethod: PaymentMethod;
  comment?: string;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
  error?: { code: string; message: string; };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
