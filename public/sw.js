// SafeDriveTag Official Service Worker
const CACHE_NAME = 'safedrivetag-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logos/favicon.ico',
  '/logos/icon.png',
  '/logos/primary.jpeg',
  '/logos/android-chrome-192x192.png',
  '/logos/android-chrome-512x512.png',
  '/site.webmanifest'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Network First for API, Cache First for Static)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Don't cache API calls or Razorpay
  if (url.pathname.startsWith('/api') || url.hostname.includes('razorpay')) {
    return;
  }

  // Only cache http/https requests (fixes chrome-extension unsupported scheme error)
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ========================================================
// FUTURE WEB PUSH NOTIFICATION HANDLERS
// ========================================================
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'SafeDrive Alert', body: event.data.text() };
    }
  }

  const title = data.title || '🛡️ SafeDrive Vehicle Alert';
  const options = {
    body: data.body || 'Someone scanned your SafeDrive Smart QR tag.',
    icon: '/logos/android-chrome-192x192.png',
    badge: '/logos/favicon-32x32.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/dashboard',
    },
    actions: [
      { action: 'open', title: 'Open Dashboard' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
