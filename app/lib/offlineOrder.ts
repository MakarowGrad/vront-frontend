import { db, PendingOrder } from './db';
import { encryptData } from './crypto';

export interface OfflineOrderPayload {
  items: { dishId: string; quantity: number }[];
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  pickupTime?: string;
  comment?: string;
}

// SECURITY-FIX-IDB-001: Encrypt sensitive fields before storing in IndexedDB [2026-05-18]
export async function saveOrderOffline(payload: OfflineOrderPayload): Promise<string> {
  const order: PendingOrder = {
    id: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
    items: payload.items,
    total: payload.total,
    customerName: await encryptData(payload.customerName),
    customerPhone: await encryptData(payload.customerPhone),
    deliveryAddress: await encryptData(payload.deliveryAddress),
    pickupTime: payload.pickupTime,
    comment: payload.comment,
    status: 'pending',
  };

  await db.pendingOrders.put(order);

  // Register background sync
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    // Store orders in SW for processing
    const allPending = await db.pendingOrders.where('status').anyOf('pending', 'error').toArray();
    const channel = new MessageChannel();
    registration.active?.postMessage(
      { type: 'STORE_PENDING_ORDERS', orders: allPending },
      [channel.port2]
    );
    (registration as any).sync.register('sync-orders');
  }

  return order.id;
}

export async function getPendingOrdersCount(): Promise<number> {
  return db.pendingOrders.where('status').anyOf('pending', 'error').count();
}

export async function clearSyncedOrders(): Promise<void> {
  await db.pendingOrders.where('status').equals('synced').delete();
}
