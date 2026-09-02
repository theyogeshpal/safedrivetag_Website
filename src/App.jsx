import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { initFirebaseMessaging } from './services/firebase';
import Home from './pages/Home';

// Lazy-loaded routes for ultra-fast initial bundle & snappy UX
const Shop = lazy(() => import('./pages/Shop'));
const Membership = lazy(() => import('./pages/Membership'));
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
const DashboardIndex = lazy(() => import('./pages/dashboard/DashboardIndex'));
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
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center gap-3">
    <RefreshCw size={32} className="text-[#fb641b] animate-spin" style={{ animationDuration: '1.2s' }} />
    <h3 className="text-sm font-bold text-[#1a2a4a]">Loading SafeDrive...</h3>
    <p className="text-[11px] text-gray-500">Please wait while we secure your connection</p>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    const lastCrash = sessionStorage.getItem('sd_last_crash');
    const now = Date.now();
    
    // Auto-refresh once if it crashes
    if (!lastCrash || now - parseInt(lastCrash) > 5000) {
      sessionStorage.setItem('sd_last_crash', now.toString());
      window.location.reload();
    } else {
      // If it crashes repeatedly in a loop, fallback to safe home route automatically
      window.location.replace('/');
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <RefreshCw size={32} className="text-[#fb641b] animate-spin mb-4" style={{ animationDuration: '1s' }} />
          <h2 className="text-xl font-bold mb-2 text-gray-900">Restoring Connection...</h2>
          <p className="text-sm text-gray-500 mb-6">Automatically redirecting you to a safe page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoadingAuth } = useAuth();
  
  if (isLoadingAuth) {
    return <RouteFallback />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, isLoadingAuth } = useAuth();
  
  if (isLoadingAuth) {
    return <RouteFallback />;
  }
  
  if (!currentUser || !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    initFirebaseMessaging();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 4000 }} />
        <LoginModal />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flexGrow: 1 }}>
            <ErrorBoundary>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/membership" element={<Membership />} />
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
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardIndex /></ProtectedRoute>} />
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
            </ErrorBoundary>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
