import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { playNotificationBellSound, showToast } from '../utils/swal';

const firebaseConfig = {
  apiKey: "AIzaSyDESqu4IKryXORUhd4CbHe35WffjdFQrDE",
  authDomain: "sdtp-b9f43.firebaseapp.com",
  projectId: "sdtp-b9f43",
  storageBucket: "sdtp-b9f43.firebasestorage.app",
  messagingSenderId: "688948312180",
  appId: "1:688948312180:web:245d15e269d2dfd5ed3921",
  measurementId: "G-KECG86S5MN"
};

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
          playNotificationBellSound();
          const title = event.data.payload?.notification?.title || event.data.payload?.data?.title || '🚨 Vehicle QR Alert';
          const body = event.data.payload?.notification?.body || event.data.payload?.data?.message || 'New vehicle scan event detected!';
          showToast.success(`🔔 ${title}: ${body}`);
        }
      });
    }

    // Handle Foreground FCM Messages
    onMessage(messaging, (payload) => {
      console.log('[Foreground FCM Message Received]:', payload);
      playNotificationBellSound();
      const title = payload.notification?.title || payload.data?.title || '🚨 Vehicle QR Alert';
      const body = payload.notification?.body || payload.data?.message || 'New scan received on your SafeDrive pass!';
      showToast.success(`🔔 ${title}: ${body}`);
    });

    return messaging;
  } catch (error) {
    console.error('Error initializing Firebase Messaging:', error);
    return null;
  }
};

export const requestFcmToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) return null;

    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return null;
      }
    }

    const messaging = getMessaging(app);
    let swReg;
    if ('serviceWorker' in navigator) {
      swReg = await navigator.serviceWorker.ready;
    }

    const currentToken = await getToken(messaging, {
      serviceWorkerRegistration: swReg,
    });

    if (currentToken) {
      console.log('FCM Token generated:', currentToken);
      try {
        localStorage.setItem('safedrive_fcm_token', currentToken);
        // Send token to backend so it knows where to send push notifications
        import('./api').then(({ default: api }) => {
          api.registerFcmToken(currentToken).catch(err => console.log('Failed to save FCM token to backend', err));
        });
      } catch (e) {}
      return currentToken;
    }
    return null;
  } catch (err) {
    console.error('Error retrieving FCM token:', err);
    return null;
  }
};

export { app };
export default app;
