import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
const DashboardTransactions = lazy(() => import('./pages/dashboard/DashboardTransactions'));
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 4000 }} />
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
                <Route path="/dashboard/transactions" element={<DashboardTransactions />} />
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
