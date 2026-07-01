const STATIC_CACHE = 'vtar-static-v5';

// Minimal install: just claim clients quickly.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Empty fetch handler is enough for PWA installability.
// We intentionally do NOT intercept requests: the old caching logic caused
// deadlocks/timeouts with the static export and cross-origin backend.
self.addEventListener('fetch', () => {});

// Background Sync: process pending orders
const API_BASE = 'https://makarowgrad-vront-backend-53ee.twc1.net/api';

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(
      getPendingOrdersFromDB().then((orders) => {
        if (orders.length === 0) return;
        return self.registration.showNotification('Синхронизация заказов', {
          body: `Отправить ${orders.length} накопленных заказа?`,
          icon: '/icons/icon-192x192.png',
          tag: 'sync-orders-confirm',
          requireInteraction: true,
          actions: [
            { action: 'sync-now', title: 'Отправить' },
            { action: 'cancel', title: 'Отмена' },
          ],
          data: { orders },
        });
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'sync-now' && event.notification.data?.orders) {
    event.waitUntil(processPendingOrders(event.notification.data.orders));
  }
});

const DB_NAME = 'LuxuryFoodDB';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getPendingOrdersFromDB() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('pendingOrders', 'readonly');
      const store = tx.objectStore('pendingOrders');
      const getAll = store.getAll();
      getAll.onsuccess = () => {
        const result = getAll.result.filter(
          (o) => o.status === 'pending' || o.status === 'error'
        );
        resolve(result);
      };
      getAll.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

async function updatePendingOrderStatus(id, status, errorMessage) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('pendingOrders', 'readwrite');
      const store = tx.objectStore('pendingOrders');
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const order = getReq.result;
        if (order) {
          order.status = status;
          if (errorMessage) order.errorMessage = errorMessage;
          store.put(order);
        }
        resolve();
      };
      getReq.onerror = () => resolve();
    });
  } catch {
    // ignore
  }
}

async function deleteSyncedOrders() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('pendingOrders', 'readwrite');
      const store = tx.objectStore('pendingOrders');
      const getAll = store.getAll();
      getAll.onsuccess = () => {
        getAll.result.forEach((order) => {
          if (order.status === 'synced') {
            store.delete(order.id);
          }
        });
        resolve();
      };
      getAll.onerror = () => resolve();
    });
  } catch {
    // ignore
  }
}

self.addEventListener('message', (event) => {
  if (event.data?.type === 'STORE_PENDING_ORDERS') {
    event.ports[0]?.postMessage({ success: true });
  }
  if (event.data?.type === 'GET_PENDING_COUNT') {
    getPendingOrdersFromDB().then((orders) => {
      event.ports[0]?.postMessage({ count: orders.length });
    });
  }
  if (event.data?.type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
    );
  }
});

async function processPendingOrders(pendingOrders) {
  if (!pendingOrders || !pendingOrders.length) {
    pendingOrders = await getPendingOrdersFromDB();
  }
  if (!pendingOrders.length) return;

  const clientsList = await self.clients.matchAll({ type: 'window' });
  clientsList.forEach((client) =>
    client.postMessage({ type: 'SYNC_STATUS', isSyncing: true })
  );

  const results = [];
  for (const order of pendingOrders) {
    try {
      const base = API_BASE;
      const headers = { 'Content-Type': 'application/json' };
      if (order.accessToken) {
        headers['Authorization'] = `Bearer ${order.accessToken}`;
      }
      const res = await fetch(`${base}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: order.items,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          deliveryAddress: order.deliveryAddress,
          pickupTime: order.pickupTime,
          comment: order.comment,
        }),
      });

      if (res.ok) {
        await updatePendingOrderStatus(order.id, 'synced');
        results.push({ id: order.id, status: 'synced' });
      } else {
        const err = await res.json().catch(() => ({}));
        await updatePendingOrderStatus(order.id, 'error', err.message || 'Ошибка сервера');
        results.push({ id: order.id, status: 'error', error: err.message || 'Ошибка сервера' });
      }
    } catch (e) {
      await updatePendingOrderStatus(order.id, 'error', 'Нет соединения');
      results.push({ id: order.id, status: 'error', error: 'Нет соединения' });
    }
  }

  await deleteSyncedOrders();

  const hasErrors = results.some((r) => r.status === 'error');
  clientsList.forEach((client) =>
    client.postMessage({
      type: 'SYNC_STATUS',
      isSyncing: false,
      results,
      error: hasErrors ? 'Часть заказов не удалось синхронизировать' : null,
    })
  );
}
