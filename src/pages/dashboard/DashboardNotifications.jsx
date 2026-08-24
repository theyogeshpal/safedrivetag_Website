import React, { useState } from 'react';
import { Bell, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

export default function DashboardNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to SafeDrive-Tag Protection',
      message: 'Your account is live. You will receive private vehicle alerts whenever someone scans your QR pass.',
      time: '1 day ago',
      read: true,
    },
    {
      id: 2,
      title: 'Voice Call Masking Active',
      message: 'Call Masking Bridge is active on all your vehicle tags to keep your personal phone number private.',
      time: '2 days ago',
      read: true,
    }
  ]);

  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <DashboardLayout currentTab="notifications" pageTitle="All Notifications">
      <div className="bg-white rounded-sm shadow-sm border border-gray-200/80 p-4 sm:p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#212121]">
              All Notifications
            </h2>
            <p className="text-xs text-[#878787] mt-0.5">
              Instant alerts regarding tag scans, subscription validity, and critical safety notifications
            </p>
          </div>
        </div>

        {/* Notification Settings Toggle */}
        <div className="bg-[#fcfcfc] border border-gray-200 rounded-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center">
              <Smartphone size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Mobile Push & WhatsApp Alerts</p>
              <p className="text-xs text-gray-500">Receive real-time push notifications when someone scans your vehicle sticker</p>
            </div>
          </div>
          <button
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              pushEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              pushEnabled ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="border border-gray-200 p-4 rounded-sm bg-white space-y-1 text-xs hover:border-gray-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  {n.title}
                </h4>
                <span className="text-gray-400 text-[11px]">{n.time}</span>
              </div>
              <p className="text-gray-600 pl-4 leading-relaxed font-medium">
                {n.message}
              </p>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
