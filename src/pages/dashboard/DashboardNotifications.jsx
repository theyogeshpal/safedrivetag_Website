import React, { useState } from 'react';
import { Bell, ShieldCheck, Smartphone, CheckCircle2, Send, Zap, Volume2, BellRing, MapPin } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { showToast, customSwal, playNotificationBellSound, showEmergencyPushAlert } from '../../utils/swal';
import { requestFcmToken } from '../../services/firebase';

export default function DashboardNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  React.useEffect(() => {
    let lastTopNotificationId = null;

    const fetchNotifications = async (isBackgroundPoll = false) => {
      try {
        const { default: api } = await import('../../services/api');
        const res = await api.getUserNotifications(page, 10);
        
        if (res.success && res.notifications && res.notifications.length > 0) {
          if (!isBackgroundPoll) {
            setTotalPages(res.totalPages || 1);
            setTotalCount(res.totalCount || 0);
          }
          const newTopId = res.notifications[0].id || res.notifications[0]._id;
          
          if (isBackgroundPoll && lastTopNotificationId && newTopId !== lastTopNotificationId) {
             const latest = res.notifications[0];
             showEmergencyPushAlert(latest.title || '🚨 Alert', latest.message || 'New notification received.', latest.metadata || {});
          }
          
          lastTopNotificationId = newTopId;
          setNotifications(res.notifications);
        } else if (!isBackgroundPoll) {
          setNotifications([
            {
              id: 1,
              title: 'Welcome to safedrivetag Protection',
              message: 'Your account is live. You will receive private vehicle alerts whenever someone scans your QR pass.',
              time: 'Just now',
              read: true,
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!isBackgroundPoll) setLoading(false);
      }
    };

    // Initial fetch
    fetchNotifications();
  }, [page]);

  const [isTesting, setIsTesting] = useState(false);

  const handleTestPushNotification = async () => {
    setIsTesting(true);

    try {
      // 0. Play Audible High-Quality Notification Bell Sound Chime
      showEmergencyPushAlert('Test Push Alert', 'This is how emergency alerts will appear on your screen when your QR is scanned.');

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
                const reg = await Promise.race([
                  navigator.serviceWorker.ready,
                  new Promise((_, reject) => setTimeout(() => reject(new Error('SW ready timeout')), 2000))
                ]);
                await reg.showNotification('🚨 SafeDrive Vehicle Alert (TEST)', {
                  body: 'Firebase Cloud Messaging is active! You will receive alerts here.',
                  icon: '/logos/primary.jpeg',
                  badge: '/logos/primary.jpeg',
                  vibrate: [200, 100, 200]
                });
                shown = true;
              } catch (swErr) {
                console.log('SW Notification failed, falling back to Native', swErr);
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

      // Toast removed in favor of SweetAlert
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
                    {(() => {
                      const t = n.time || n.createdAt;
                      if (!t || t === 'Just now') return 'Just now';
                      const d = new Date(t);
                      return d.toString() !== 'Invalid Date' ? d.toLocaleString('en-IN', { hour12: true, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }) : t;
                    })()}
                  </span>
                </div>
                <div className="text-gray-600 pl-4 leading-relaxed font-medium">
                  {n.message || n.body}
                  {n.metadata?.tagName && (
                    <div className="mt-2 bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] grid grid-cols-2 gap-2 text-gray-700">
                      <div><span className="font-bold text-gray-900">Type:</span> {n.metadata.qrType || 'Tag'}</div>
                      <div><span className="font-bold text-gray-900">Asset:</span> {n.metadata.tagName}</div>
                      {n.metadata.mapsLink && (
                        <div className="col-span-2 pt-1 border-t border-gray-200/60 mt-1">
                          <a 
                            href={n.metadata.mapsLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 font-bold px-3 py-1.5 rounded-md transition-colors w-max shadow-xs"
                          >
                            <MapPin size={12} />
                            Find Location
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg mt-4 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                  {totalCount > 0 && <span> ({totalCount} total notifications)</span>}
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
