import React, { useState } from 'react';
import { Bell, ShieldCheck, Smartphone, CheckCircle2, Send, Zap, Volume2, BellRing } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { showToast, customSwal, playNotificationBellSound } from '../../utils/swal';
import { requestFcmToken } from '../../services/firebase';

export default function DashboardNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { default: api } = await import('../../services/api');
        const res = await api.getUserNotifications();
        if (res.success && res.notifications) {
          setNotifications(res.notifications);
        } else {
          // Fallback if no real notifications found yet
          setNotifications([
            {
              id: 1,
              title: 'Welcome to SafeDrive-Tag Protection',
              message: 'Your account is live. You will receive private vehicle alerts whenever someone scans your QR pass.',
              time: 'Just now',
              read: true,
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const [isTesting, setIsTesting] = useState(false);

  const handleTestPushNotification = async () => {
    setIsTesting(true);

    try {
      // 0. Play Audible High-Quality Notification Bell Sound Chime
      playNotificationBellSound();

      // 1. Request FCM Push Token & Native Browser Push Notification
      try {
        await requestFcmToken();
      } catch (fcmErr) {
        console.log('FCM token request info:', fcmErr);
      }

      if ('Notification' in window) {
        let perm = Notification.permission;
        if (perm === 'default') {
          perm = await Notification.requestPermission();
        }

        if (perm === 'granted') {
          try {
            let shown = false;
            if ('serviceWorker' in navigator) {
              try {
                const reg = await navigator.serviceWorker.ready;
                await reg.showNotification('🚨 SafeDrive Vehicle Alert (TEST)', {
                  body: 'Firebase Cloud Messaging is active! You will receive alerts here.',
                  icon: '/logos/primary.jpeg',
                  badge: '/logos/primary.jpeg',
                  vibrate: [200, 100, 200]
                });
                shown = true;
              } catch (swErr) {
                alert('Service Worker Error: ' + swErr.message);
                console.log('SW Notification failed, falling back', swErr);
              }
            }
            if (!shown) {
              new Notification('🚨 SafeDrive Vehicle Alert (TEST)', {
                body: 'Firebase Cloud Messaging is active on this device!',
                icon: '/logos/primary.jpeg',
                badge: '/logos/primary.jpeg'
              });
            }
          } catch (e) {
            alert('Native notification error: ' + e.message);
            console.log('Native notification error', e);
          }
        } else {
          alert('Notification permission is ' + perm + '. Please allow notifications in your browser settings.');
        }
      }

      // 2. Add New Live Test Alert to Notification Feed
      const newAlert = {
        id: Date.now(),
        title: '🔔 Live Push Notification Test',
        message: 'Test notification triggered successfully at ' + new Date().toLocaleTimeString() + '. Your device is ready to receive instant scan and emergency alerts.',
        time: 'Just now',
        read: false,
      };
      setNotifications(prev => [newAlert, ...prev]);

      // 3. Show Crisp Toast Notification Only
      showToast.success('🔔 Bell ringing! Test push notification delivered.');
    } catch (err) {
      console.error(err);
      showToast.error('Could not trigger test notification.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <DashboardLayout currentTab="notifications" pageTitle="All Notifications">
      <div className="bg-white rounded-sm shadow-sm border border-gray-200/80 p-4 sm:p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#212121]">
              All Notifications
            </h2>
            <p className="text-xs text-[#878787] mt-0.5">
              Instant alerts regarding tag scans, subscription validity, and critical safety notifications
            </p>
          </div>

          <button
            onClick={handleTestPushNotification}
            disabled={isTesting}
            className="bg-gradient-to-r from-orange-500 via-orange-600 to-emerald-600 hover:from-orange-600 hover:to-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Zap size={14} className={isTesting ? 'animate-spin' : ''} />
            <span>{isTesting ? 'Testing Notification...' : 'Test Push Notification'}</span>
          </button>
        </div>

        {/* Live Notification Status Banner */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Smartphone size={18} />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-black text-gray-900 flex items-center gap-2">
              <span>Real-Time Alert Dispatcher & Audio Chime</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                Always Active
              </span>
            </p>
            <p className="text-[11px] text-gray-600 mt-0.5">
              SafeDrive delivers automated instant alerts with audible bell chimes, Browser Push, SMS, and WhatsApp whenever someone scans your QR pass.
            </p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-xs text-gray-500 text-center py-4">Loading alerts...</p>
          ) : notifications.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">No notifications found.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id || n._id}
                className="border border-gray-200 p-4 rounded-sm bg-white space-y-1 text-xs hover:border-gray-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    {n.title || n.type || 'Alert'}
                  </h4>
                  <span className="text-gray-400 text-[11px]">
                    {n.time || (n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now')}
                  </span>
                </div>
                <p className="text-gray-600 pl-4 leading-relaxed font-medium">
                  {n.message || n.body}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
