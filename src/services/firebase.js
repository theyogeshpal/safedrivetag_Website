import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { playNotificationBellSound, showToast, showEmergencyPushAlert } from '../utils/swal';

const firebaseConfig = {
  apiKey: "AIzaSyDESqu4IKryXORUhd4CbHe35WffjdFQrDE",
  authDomain: "sdtp-b9f43.firebaseapp.com",
  projectId: "sdtp-b9f43",
  storageBucket: "sdtp-b9f43.firebasestorage.app",
  messagingSenderId: "688948312180",
  appId: "1:688948312180:web:245d15e269d2dfd5ed3921",
  measurementId: "G-KECG86S5MN"
};

const VAPID_KEY = "BCc2xzV1Pcu6gow45ZxMwwukmHD-A_hR2Mf-QJ8hTn2HEk0Qk9Z5g5Q4vkc9Vb_bJrf4QD53KJldm-hctH1VugY";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const initFirebaseMessaging = async () => {
  try {
    const supported = await isSupported();
    if (!supported || typeof window === 'undefined') {
      console.log('FCM is not supported on this browser/environment.');
      return null;
    }

    const messaging = getMessaging(app);

    // Wait for the main Service Worker to be ready
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => {
          console.log('Firebase using active Service Worker:', reg.scope);
        })
        .catch((err) => {
          console.warn('Firebase Service Worker wait notice:', err);
        });

      // Listen for background service worker ringtone trigger
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PLAY_RINGTONE') {
          const title = event.data.payload?.notification?.title || event.data.payload?.data?.title || '🚨 Vehicle QR Alert';
          const body = event.data.payload?.notification?.body || event.data.payload?.data?.message || 'New vehicle scan event detected!';
          showEmergencyPushAlert(title, body, event.data.payload?.data || {});
        }
      });
    }

    // Handle Foreground FCM Messages
    onMessage(messaging, (payload) => {
      console.log('[Foreground FCM Message Received]:', payload);
      const title = payload.notification?.title || payload.data?.title || '🚨 Vehicle QR Alert';
      const body = payload.notification?.body || payload.data?.message || 'New scan received on your SafeDrive pass!';
      showEmergencyPushAlert(title, body, payload.data || {});
    });

    // Auto-fetch token if permission is already granted so backend knows where to push
    if ('Notification' in window && Notification.permission === 'granted') {
      requestFcmToken().catch(err => console.log('Silent FCM fetch failed', err));
    }

    return messaging;
  } catch (error) {
    console.error('Error initializing Firebase Messaging:', error);
    return null;
  }
};

export const requestFcmToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      alert('FCM is not supported on this browser/device.');
      return null;
    }

    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Notification permission denied by user.');
        return null;
      }
    }

    const messaging = getMessaging(app);
    let swReg;
    if ('serviceWorker' in navigator) {
      swReg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Service Worker timeout')), 3000))
      ]).catch(e => {
        console.warn('Service worker not ready in time:', e);
        return undefined;
      });
    }

    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });

    if (currentToken) {
      console.log('FCM Token generated:', currentToken);
      try {
        localStorage.setItem('safedrive_fcm_token', currentToken);
        // Send token to backend so it knows where to send push notifications
        import('./api').then(({ default: api, getAuthToken }) => {
          if (getAuthToken()) {
            api.registerFcmToken(currentToken).catch(err => {
              console.log('FCM token backend registration failed:', err.message);
            });
          }
        });
      } catch (e) {}
      return currentToken;
    } else {
      console.log('Failed to generate FCM Token. Check VAPID keys or Firebase config.');
    }
    return null;
  } catch (err) {
    alert('Error retrieving FCM token: ' + err.message);
    console.error('Error retrieving FCM token:', err);
    return null;
  }
};

export { app };
export default app;
