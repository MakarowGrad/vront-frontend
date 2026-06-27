const STATIC_CACHE = 'vtar-static-v3';
const API_CACHE = 'vtar-api-v3';
const IMAGE_CACHE = 'vtar-images-v3';
const NEXT_CACHE = 'vtar-next-v3';

const STATIC_ASSETS = [
  '/',
  '/catalog',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![STATIC_CACHE, API_CACHE, IMAGE_CACHE, NEXT_CACHE].includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// API base for backend (Timeweb)
const API_BASE = 'https://makarowgrad-vront-backend-53ee.twc1.net/api';

// SECURITY-FIX-SW-003: Validate response before caching [2026-05-18]
function isCacheableResponse(res) {
  if (!res || !res.ok || res.status !== 200) return false;
  const contentType = res.headers.get('Content-Type') || '';
  const allowedTypes = [
    'application/json',
    'text/html',
    'text/javascript',
    'application/javascript',
    'image/',
    'font/',
    'text/css',
  ];
  return allowedTypes.some((t) => contentType.includes(t));
}

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (except sync handled separately)
  if (request.method !== 'GET') return;

  // Next.js static chunks: stale-while-revalidate
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((res) => {
          if (isCacheableResponse(res)) {
            const clone = res.clone();
            caches.open(NEXT_CACHE).then((cache) => cache.put(request, clone));
          }
          return res;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Images: cache-first
  if (url.pathname.startsWith('/images/') || url.pathname.startsWith('/uploads/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          if (isCacheableResponse(res)) {
            const clone = res.clone();
            caches.open(IMAGE_CACHE).then((cache) => cache.put(request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // API catalog/dishes: network-first with cache fallback (for offline menu)
  if (url.pathname.startsWith('/api/catalog/dishes') || url.pathname.startsWith('/api/catalog/categories')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (isCacheableResponse(res)) {
            const clone = res.clone();
            caches.open(API_CACHE).then((cache) => cache.put(request, clone));
          }
          return res;
        })
        .catch(() => caches.match(request).then((cached) => {
          if (cached) return cached;
          // Fallback empty response for catalog
          if (url.pathname.includes('/dishes')) {
            return new Response(JSON.stringify({ data: [] }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return new Response(JSON.stringify({ data: [] }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }))
    );
    return;
  }

  // Other API: network-only (don't cache admin/auth)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // SECURITY: admin pages must never be served from cache —
  // otherwise the browser back button can restore the admin UI after logout.
  if (url.pathname.startsWith('/admin')) {
    return;
  }

  // Static pages: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (isCacheableResponse(res) && res.status !== 206) {
          const clone = res.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return res;
      });
    })
  );
});

// Background Sync: process pending orders
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    // SECURITY-FIX-PWA-002: Ask for confirmation before syncing [2026-05-18]
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

// SECURITY-FIX-SW-004: IndexedDB helpers for persistent pending orders [2026-05-18]
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

// Message handling from client
self.addEventListener('message', (event) => {
  if (event.data?.type === 'STORE_PENDING_ORDERS') {
    // No longer needed — SW reads directly from IndexedDB
    event.ports[0]?.postMessage({ success: true });
  }
  if (event.data?.type === 'GET_PENDING_COUNT') {
    getPendingOrdersFromDB().then((orders) => {
      event.ports[0]?.postMessage({ count: orders.length });
    });
  }
  if (event.data?.type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(keys.map((k) => caches.delete(k)))
      ).then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
    );
  }
});

// SECURITY-FIX-SW-002: Include Authorization header from order payload [2026-05-18]
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
