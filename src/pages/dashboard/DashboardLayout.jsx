import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  User, 
  MapPin, 
  Bell, 
  LogOut, 
  ChevronRight, 
  QrCode, 
  Activity, 
  Smartphone, 
  Download,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children, currentTab, pageTitle, saveSuccessMsg }) {
  const navigate = useNavigate();
  const { currentUser, logout, isInitializingAuth, isLoadingAuth } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPwaInstalled(true);
    }
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsPwaInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install SafeDrive App:\n1. Tap Menu (⋮) on Chrome/Safari\n2. Select "Install App" or "Add to Home Screen"');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of your SafeDrive Account?')) {
      logout();
      navigate('/login');
    }
  };

  // 1. Animated Full Screen Dashboard Loader
  if (isInitializingAuth || (isLoadingAuth && !currentUser)) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-20 h-20 mb-5">
          <div className="absolute inset-0 rounded-3xl bg-[#2874f0]/20 animate-ping" />
          <div className="relative w-20 h-20 bg-gradient-to-tr from-[#2874f0] to-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30">
            <QrCode className="w-10 h-10 text-white animate-pulse" />
          </div>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-1.5">
          Loading Your SafeDrive Account...
        </h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
          Verifying security session and fetching your active vehicle tags, live quotas, and recent activity...
        </p>
        <div className="mt-5 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#2874f0] rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-[#2874f0] rounded-full flex items-center justify-center mx-auto">
            <User size={32} />
          </div>
          <h2 className="text-xl font-black text-gray-900">Please Sign In</h2>
          <p className="text-sm text-gray-500">You need to log in to access your SafeDrive account dashboard.</p>
          <Link
            to="/login"
            className="w-full bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'orders', label: 'My Orders', path: '/dashboard/orders', icon: <Package size={16} /> },
    { id: 'tags', label: 'My SafeDrive-Tags', path: '/dashboard/tags', icon: <QrCode size={16} /> },
    { id: 'logs', label: 'Activity Logs', path: '/dashboard/logs', icon: <Activity size={16} /> },
    { id: 'profile', label: 'Profile Info', path: '/dashboard/profile', icon: <User size={16} /> },
    { id: 'addresses', label: 'Addresses', path: '/dashboard/addresses', icon: <MapPin size={16} /> },
    { id: 'notifications', label: 'Alerts', path: '/dashboard/notifications', icon: <Bell size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-[#212121] pt-20 sm:pt-24 pb-16 font-sans">
      
      {/* Toast Alert Message */}
      {saveSuccessMsg && (
        <div className="fixed top-20 right-5 z-50 bg-[#2874f0] text-white px-5 py-3 rounded shadow-xl flex items-center gap-3 animate-fade-up text-sm font-medium border border-white/20">
          <CheckCircle2 size={18} className="text-green-300" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Flipkart Style Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#878787] mb-3 font-medium">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <ChevronRight size={12} />
          <Link to="/dashboard" className="text-[#2874f0]">My Account</Link>
          {pageTitle && (
            <>
              <ChevronRight size={12} />
              <span className="capitalize text-gray-700 font-semibold">{pageTitle}</span>
            </>
          )}
        </div>

        {/* 2-Column Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          
          {/* ======================================================== */}
          {/* LEFT SIDEBAR PANEL */}
          {/* ======================================================== */}
          <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-3">
            
            {/* User Profile Card Header */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-200/80 p-3 sm:p-4 flex items-center justify-between gap-3.5">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-full bg-[#2874f0] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] text-[#878787] font-medium leading-none mb-1">Hello,</p>
                  <h3 className="text-sm sm:text-base font-bold text-[#212121] truncate">
                    {currentUser.name || 'SafeDrive Customer'}
                  </h3>
                </div>
              </div>

              {/* Mobile Quick App Install Pill */}
              <button
                onClick={handleInstallPwa}
                className="lg:hidden bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-[11px] px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-all"
                title="Install SafeDrive App on Phone"
              >
                <Smartphone size={13} />
                <span>App</span>
              </button>
            </div>

            {/* Mobile Download App Banner Widget */}
            {!isPwaInstalled && (
              <div className="lg:hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-xl p-3 text-white shadow-md flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src="/logos/icon.png" alt="App" className="w-9 h-9 rounded-xl bg-white p-0.5 shrink-0 object-contain shadow-xs" />
                  <div className="min-w-0">
                    <p className="font-black text-xs leading-tight truncate">Install SafeDrive Mobile App</p>
                    <p className="text-[10px] text-white/90 font-medium truncate">1-Tap Direct Dashboard & Alerts</p>
                  </div>
                </div>
                <button
                  onClick={handleInstallPwa}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm shrink-0 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <Download size={13} /> Install
                </button>
              </div>
            )}

            {/* Mobile Tab Navigation Bar (Sticky Horizontal Scroll on Mobile) */}
            <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md rounded-lg shadow-sm border border-gray-200 p-1.5 overflow-x-auto flex gap-1.5 no-scrollbar">
              {menuItems.map((m) => (
                <Link
                  key={m.id}
                  to={m.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    currentTab === m.id
                      ? 'bg-[#2874f0] text-white shadow-xs'
                      : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </Link>
              ))}

              <button
                onClick={handleInstallPwa}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-black whitespace-nowrap transition-all cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shrink-0"
              >
                <Download size={13} />
                <span>Download App</span>
              </button>
            </div>

            {/* Flipkart Navigation Menu Box (Desktop) */}
            <div className="hidden lg:block bg-white rounded-sm shadow-sm border border-gray-200/80 divide-y divide-gray-100 text-[13px]">
              
              {/* SECTION 1: MY ORDERS */}
              <div className="p-3">
                <Link
                  to="/dashboard/orders"
                  className={`w-full flex items-center justify-between font-bold py-1.5 transition-colors ${
                    currentTab === 'orders' ? 'text-[#2874f0]' : 'text-[#878787] hover:text-[#2874f0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package size={17} className="text-[#2874f0]" />
                    <span className="uppercase text-xs tracking-wider">MY ORDERS</span>
                  </div>
                  <ChevronRight size={14} className="text-[#878787]" />
                </Link>
              </div>

              {/* SECTION 2: VEHICLE TAGS & SAFETY */}
              <div className="p-3">
                <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-wider text-[#878787] mb-2">
                  <QrCode size={17} className="text-[#2874f0]" />
                  <span>VEHICLE TAGS & SAFETY</span>
                </div>
                <div className="space-y-1 pl-7">
                  <Link
                    to="/dashboard/tags"
                    className={`block py-1.5 text-xs font-semibold transition-colors ${
                      currentTab === 'tags' ? 'text-[#2874f0] font-bold' : 'text-[#212121] hover:text-[#2874f0]'
                    }`}
                  >
                    My SafeDrive-Tags
                  </Link>
                  <Link
                    to="/dashboard/logs"
                    className={`block py-1.5 text-xs font-semibold transition-colors ${
                      currentTab === 'logs' ? 'text-[#2874f0] font-bold' : 'text-[#212121] hover:text-[#2874f0]'
                    }`}
                  >
                    Scan & SOS Activity Logs
                  </Link>
                </div>
              </div>

              {/* SECTION 3: ACCOUNT SETTINGS */}
              <div className="p-3">
                <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-wider text-[#878787] mb-2">
                  <User size={17} className="text-[#2874f0]" />
                  <span>ACCOUNT SETTINGS</span>
                </div>
                <div className="space-y-1 pl-7">
                  <Link
                    to="/dashboard/profile"
                    className={`block py-1.5 text-xs font-semibold transition-colors ${
                      currentTab === 'profile' ? 'text-[#2874f0] font-bold' : 'text-[#212121] hover:text-[#2874f0]'
                    }`}
                  >
                    Profile Information
                  </Link>
                  <Link
                    to="/dashboard/addresses"
                    className={`block py-1.5 text-xs font-semibold transition-colors ${
                      currentTab === 'addresses' ? 'text-[#2874f0] font-bold' : 'text-[#212121] hover:text-[#2874f0]'
                    }`}
                  >
                    Manage Addresses
                  </Link>
                  <Link
                    to="/dashboard/notifications"
                    className={`block py-1.5 text-xs font-semibold transition-colors ${
                      currentTab === 'notifications' ? 'text-[#2874f0] font-bold' : 'text-[#212121] hover:text-[#2874f0]'
                    }`}
                  >
                    All Notifications
                  </Link>
                </div>
              </div>

              {/* SECTION 4: DOWNLOAD APP (PWA) */}
              <div className="p-3">
                <div
                  onClick={handleInstallPwa}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg p-3 transition-all cursor-pointer shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-white/20 rounded-md">
                      <Smartphone size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-black text-white text-xs">Download App</p>
                      <p className="text-[10px] text-white/80">1-Tap Install PWA</p>
                    </div>
                  </div>
                  <Download size={16} className="text-white" />
                </div>
              </div>

              {/* SECTION 5: LOGOUT */}
              <div className="p-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 font-bold text-xs uppercase tracking-wider text-[#878787] hover:text-red-600 transition-colors py-1 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>LOGOUT</span>
                </button>
              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT CONTENT WORKSPACE */}
          {/* ======================================================== */}
          <div className="flex-1 w-full overflow-hidden">
            {children}
          </div>

        </div>

      </div>

    </div>
  );
}
