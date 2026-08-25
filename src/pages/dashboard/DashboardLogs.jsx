import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Phone, MessageCircle, MapPin, Lock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DashboardLayout from './DashboardLayout';

export default function DashboardLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasActiveTags, setHasActiveTags] = useState(() => {
    try {
      const locallyRegistered = JSON.parse(localStorage.getItem('safedrive_registered_tags') || '{}');
      return Object.keys(locallyRegistered).length > 0;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        let activeCount = 0;
        try {
          const locallyRegistered = JSON.parse(localStorage.getItem('safedrive_registered_tags') || '{}');
          activeCount = Object.keys(locallyRegistered).length;
        } catch (e) {}

        const res = await api.getDashboard();
        if (res.success && res.kits) {
          const activeKits = res.kits.filter(k => k.isRegistered || k.status === 'ACTIVE' || (Array.isArray(k.emergencyContacts) && k.emergencyContacts.length > 0));
          if (activeKits.length > 0) activeCount = Math.max(activeCount, activeKits.length);

          const allScans = [];
          activeKits.forEach(k => {
            if (Array.isArray(k.scans)) {
              k.scans.forEach(s => allScans.push({ ...s, tagId: k.kitId || k.productId }));
            }
          });
          setLogs(allScans);
        }
        setHasActiveTags(activeCount > 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <DashboardLayout currentTab="logs" pageTitle="Scan & SOS Activity Logs">
      <div className="bg-white rounded-sm shadow-sm border border-gray-200/80 p-4 sm:p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#212121]">
              Scan & SOS Activity Logs
            </h2>
            <p className="text-xs text-[#878787] mt-0.5">
              Live audit trail of public scans, automated voice bridge calls, and WhatsApp notifications
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Loading activity logs...</p>
          </div>
        ) : !hasActiveTags ? (
          <div className="py-12 px-4 text-center border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/80 max-w-2xl mx-auto my-4 shadow-sm">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Lock size={32} />
            </div>
            <span className="inline-block bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3 border border-amber-200">
              🔒 Activity Logs Disabled — Activation Required
            </span>
            <h3 className="text-xl font-black text-[#212121] tracking-tight">No Active SafeDrive-Tag</h3>
            <p className="text-xs sm:text-sm text-[#878787] max-w-md mx-auto mt-2 mb-6 leading-relaxed font-medium">
              Activity and scan logs are locked because there is no activated QR safety tag registered to this account. Once a tag is activated, live scan audits and voice bridge logs will appear here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register/SDT-FIRST"
                className="w-full sm:w-auto bg-[#2874f0] hover:bg-blue-700 text-white text-xs font-black px-6 py-3 rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>+ ACTIVATE NEW TAG</span>
              </Link>
              <Link
                to="/shop"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black px-6 py-3 rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2"
              >
                <span>🛒 BUY SAFETY TAG</span>
              </Link>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-14 text-center border border-dashed border-gray-300 rounded-sm bg-gray-50/50">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-sm font-bold text-gray-800">24/7 Live Monitoring Active</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              Whenever someone scans your vehicle QR sticker, the exact timestamp and bridge call log will be recorded here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((l, idx) => (
              <div key={idx} className="border border-gray-200 p-3.5 rounded-sm flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center">
                    {l.type === 'CALL' ? <Phone size={14} /> : <MessageCircle size={14} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{l.action || 'Public QR Code Scanned'}</p>
                    <p className="text-gray-400 text-[11px]">{l.timestamp || 'Just Now'} • {l.tagId}</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Processed
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
