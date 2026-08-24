import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';

// Lazy-loaded routes for ultra-fast initial bundle & snappy UX
const Shop = lazy(() => import('./pages/Shop'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Legal = lazy(() => import('./pages/Legal'));
const QRScan = lazy(() => import('./pages/QRScan'));
const RegisterTag = lazy(() => import('./pages/RegisterTag'));
const TagDetails = lazy(() => import('./pages/TagDetails'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/dashboard/DashboardTags'));
const DashboardTags = lazy(() => import('./pages/dashboard/DashboardTags'));
const DashboardOrders = lazy(() => import('./pages/dashboard/DashboardOrders'));
const DashboardProfile = lazy(() => import('./pages/dashboard/DashboardProfile'));
const DashboardAddresses = lazy(() => import('./pages/dashboard/DashboardAddresses'));
const DashboardLogs = lazy(() => import('./pages/dashboard/DashboardLogs'));
const DashboardNotifications = lazy(() => import('./pages/dashboard/DashboardNotifications'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Branded Fast Fallback Skeleton
const RouteFallback = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
    <div className="relative w-16 h-16 mb-4">
      <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-ping" />
      <div className="relative w-16 h-16 bg-[#2874f0] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
        <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
    <h3 className="text-sm font-black text-gray-800">Loading SafeDrive...</h3>
    <p className="text-[11px] text-gray-500 mt-1">Please wait while we secure your connection</p>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Global Unified Button Click Animation with Active Emerald Green & Ripple Feedback
function GlobalButtonClickEffects() {
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const btn = e.target.closest('button, [role="button"], a.btn, a[href*="shop"], a[href*="checkout"], .btn-action, .btn-primary, .btn-secondary');
      if (!btn || btn.disabled) return;

      // Add green clicked class
      btn.classList.add('btn-clicked-green');
      
      // Calculate ripple position
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple-wave';
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX ? e.clientX - rect.left - size / 2 : rect.width / 2 - size / 2;
      const y = e.clientY ? e.clientY - rect.top - size / 2 : rect.height / 2 - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      const originalPosition = window.getComputedStyle(btn).position;
      if (originalPosition === 'static') {
        btn.style.position = 'relative';
      }
      
      btn.appendChild(ripple);

      setTimeout(() => {
        btn.classList.remove('btn-clicked-green');
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 650);
    };

    document.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <GlobalButtonClickEffects />
        <LoginModal />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flexGrow: 1 }}>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Legal />} />
                <Route path="/terms" element={<Legal />} />
                <Route path="/refund" element={<Legal />} />
                <Route path="/shipping" element={<Legal />} />
                <Route path="/login" element={<Login />} />
                
                {/* Modular User Dashboard Panel Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/tags" element={<DashboardTags />} />
                <Route path="/dashboard/orders" element={<DashboardOrders />} />
                <Route path="/dashboard/profile" element={<DashboardProfile />} />
                <Route path="/dashboard/addresses" element={<DashboardAddresses />} />
                <Route path="/dashboard/logs" element={<DashboardLogs />} />
                <Route path="/dashboard/notifications" element={<DashboardNotifications />} />
                <Route path="/dashboard/tag/:id" element={<TagDetails />} />
                <Route path="/tag/:id" element={<TagDetails />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/q/:id" element={<QRScan />} />
                <Route path="/qr/:id" element={<QRScan />} />
                <Route path="/scan/:id" element={<QRScan />} />
                <Route path="/register/:id" element={<RegisterTag />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
