import Dexie, { Table } from 'dexie';
import type { Dish, Category, CartItem } from '@/app/types';
import { decryptData } from './crypto';
import { API_BASE } from '@/lib/api';

export interface CachedImage {
  url: string;
  blob: Blob;
  updatedAt: number;
}

export interface PendingOrder {
  id: string;
  createdAt: number;
  items: { dishId: string; quantity: number }[];
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  pickupTime?: string;
  comment?: string;
  status: 'pending' | 'syncing' | 'synced' | 'error';
  errorMessage?: string;
}

class AppDatabase extends Dexie {
  categories!: Table<Category, string>;
  dishes!: Table<Dish, string>;
  cart!: Table<CartItem, string>;
  favorites!: Table<string, number>; // dishId strings
  pendingOrders!: Table<PendingOrder, string>;
  images!: Table<CachedImage, string>;

  constructor() {
    super('LuxuryFoodDB');
    this.version(1).stores({
      categories: 'id',
      dishes: 'id, categoryId',
      cart: 'dishId',
      favorites: '++id',
      pendingOrders: 'id',
      images: 'url',
    });
  }
}

export const db = new AppDatabase();

// Cache images to IndexedDB
export async function cacheImage(url: string): Promise<void> {
  try {
    const cached = await db.images.get(url);
    if (cached) return; // already cached

    const res = await fetch(url);
    if (!res.ok) return;
    const blob = await res.blob();
    await db.images.put({ url, blob, updatedAt: Date.now() });
  } catch {
    // ignore network errors
  }
}

// Get image blob URL from cache
export async function getCachedImageUrl(url: string): Promise<string | null> {
  try {
    const cached = await db.images.get(url);
    if (cached) {
      return URL.createObjectURL(cached.blob);
    }
  } catch {
    // ignore
  }
  return null;
}

// Preload all dish images
export async function preloadAllImages(dishes: Dish[]): Promise<void> {
  const base = API_BASE.replace('/api', '');

  const urls = new Set<string>();
  for (const dish of dishes) {
    if (dish.coverImage) urls.add(dish.coverImage.startsWith('http') ? dish.coverImage : `${base}${dish.coverImage}`);
    for (const img of dish.gallery || []) {
      urls.add(img.startsWith('http') ? img : `${base}${img}`);
    }
  }

  await Promise.all(Array.from(urls).map((url) => cacheImage(url).catch(() => {})));
}

// Sync menu data to IndexedDB
export async function syncMenuToDB(categories: Category[], dishes: Dish[]): Promise<void> {
  await db.transaction('rw', db.categories, db.dishes, async () => {
    await db.categories.clear();
    await db.categories.bulkPut(categories);
    await db.dishes.clear();
    await db.dishes.bulkPut(dishes);
  });
  // preload images in background
  preloadAllImages(dishes).catch(() => {});
}

// Load menu from IndexedDB
export async function loadMenuFromDB(): Promise<{ categories: Category[]; dishes: Dish[] }> {
  const [categories, dishes] = await Promise.all([
    db.categories.toArray(),
    db.dishes.toArray(),
  ]);
  return { categories, dishes };
}

// Cart helpers
export async function syncCartToDB(items: CartItem[]): Promise<void> {
  await db.transaction('rw', db.cart, async () => {
    await db.cart.clear();
    await db.cart.bulkPut(items);
  });
}

export async function loadCartFromDB(): Promise<CartItem[]> {
  return db.cart.toArray();
}

// Favorites helpers
export async function syncFavoritesToDB(dishIds: string[]): Promise<void> {
  await db.favorites.clear();
  await db.favorites.bulkAdd(dishIds);
}

export async function loadFavoritesFromDB(): Promise<string[]> {
  return db.favorites.toArray();
}

// Pending orders helpers
export async function addPendingOrder(order: PendingOrder): Promise<void> {
  await db.pendingOrders.put(order);
}

// SECURITY-FIX-IDB-001: Decrypt sensitive fields when reading from IndexedDB [2026-05-18]
export async function getPendingOrders(): Promise<PendingOrder[]> {
  const orders = await db.pendingOrders.where('status').anyOf('pending', 'error').toArray();
  return Promise.all(
    orders.map(async (order) => ({
      ...order,
      customerName: await decryptData(order.customerName) || order.customerName,
      customerPhone: await decryptData(order.customerPhone) || order.customerPhone,
      deliveryAddress: await decryptData(order.deliveryAddress) || order.deliveryAddress,
    }))
  );
}

export async function updatePendingOrder(id: string, changes: Partial<PendingOrder>): Promise<void> {
  await db.pendingOrders.update(id, changes);
}

export async function removePendingOrder(id: string): Promise<void> {
  await db.pendingOrders.delete(id);
}
