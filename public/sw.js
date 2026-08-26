// SafeDriveTag Official Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

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

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDESqu4IKryXORUhd4CbHe35WffjdFQrDE",
  authDomain: "sdtp-b9f43.firebaseapp.com",
  projectId: "sdtp-b9f43",
  storageBucket: "sdtp-b9f43.firebasestorage.app",
  messagingSenderId: "688948312180",
  appId: "1:688948312180:web:245d15e269d2dfd5ed3921",
  measurementId: "G-KECG86S5MN"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Background Message Handler
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message: ', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || '🚨 Safe Drive Alert';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.message || 'New scan alert received regarding your vehicle.',
    icon: '/logos/primary.jpeg',
    badge: '/logos/primary.jpeg',
    vibrate: [200, 100, 200, 100, 400],
    tag: 'safe-drive-alert',
    renotify: true,
    data: payload.data || {},
    actions: [
      { action: 'open_dashboard', title: 'Open Dashboard ↗' }
    ]
  };

  // Broadcast to all active client windows to trigger audio ringtone immediately
  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
    clientList.forEach((client) => {
      client.postMessage({ type: 'PLAY_RINGTONE', payload });
    });
  });

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

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

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/dashboard') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/dashboard');
      }
    })
  );
});
