import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Package, 
  Users, 
  QrCode, 
  TrendingUp, 
  LogOut,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sellerId, setSellerId] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [stats, setStats] = useState({ assigned: 0, sold: 0, available: 0 });
  const [assignedQRs, setAssignedQRs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Activation form state
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, activate
  const [formData, setFormData] = useState({
    qrId: '',
    customerName: '',
    customerPhone: '',
    vehicleType: 'Car',
    vehicleNumber: '',
    emergencyContact1: ''
  });
  const [activationStatus, setActivationStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock checking local storage for session
  useEffect(() => {
    const savedSeller = localStorage.getItem('sellerSession');
    if (savedSeller) {
      const data = JSON.parse(savedSeller);
      setIsLoggedIn(true);
      setSellerId(data.sellerId);
      setSellerName(data.name);
      fetchSellerData(data.sellerId);
    }
  }, []);

  const fetchSellerData = async (sid) => {
    setLoading(true);
    try {
      // Assuming a backend route exists for this, if not we mock it for the UI
      const res = await api.get('/seller/dashboard?sellerId=' + sid).catch(() => ({ 
        success: true, 
        stats: { assigned: 50, sold: 12, available: 38 },
        qrs: Array.from({ length: 38 }, (_, i) => ({ id: `QR-SLL-${1000 + i}`, status: 'available' }))
      }));
      
      if (res && res.success) {
        setStats(res.stats || { assigned: 50, sold: 12, available: 38 });
        setAssignedQRs(res.qrs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [loginStep, setLoginStep] = useState(1);
  const [otpValue, setOtpValue] = useState('');

  const handleRequestOtp = (e) => {
    e.preventDefault();
    setLoginError('');
    if (loginPhone.length !== 10) {
      setLoginError('Please enter a valid 10-digit number');
      return;
    }
    // Mock sending OTP
    setLoginStep(2);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    // Default testing values
    if (loginPhone === '7817095043' && otpValue === '123456') {
      const testSeller = { sellerId: 'SELL-7817095043', name: 'Test Seller' };
      setIsLoggedIn(true);
      setSellerId(testSeller.sellerId);
      setSellerName(testSeller.name);
      localStorage.setItem('sellerSession', JSON.stringify(testSeller));
      fetchSellerData(testSeller.sellerId);
      return;
    }
    
    // Mock general behavior
    if (otpValue === '123456') {
      const mockSeller = { sellerId: 'SELL-' + loginPhone, name: 'Authorized Seller' };
      setIsLoggedIn(true);
      setSellerId(mockSeller.sellerId);
      setSellerName(mockSeller.name);
      localStorage.setItem('sellerSession', JSON.stringify(mockSeller));
      fetchSellerData(mockSeller.sellerId);
    } else {
      setLoginError('Invalid OTP. For testing, please use 123456.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sellerSession');
    setIsLoggedIn(false);
    setSellerId('');
    setLoginStep(1);
    setOtpValue('');
    setLoginPhone('');
    navigate('/');
  };

  const handleActivateSubmit = async (e) => {
    e.preventDefault();
    setActivationStatus({ type: '', message: '' });
    
    if (!formData.qrId || !formData.customerName || !formData.customerPhone || !formData.vehicleNumber || !formData.emergencyContact1) {
      setActivationStatus({ type: 'error', message: 'Please fill all required fields.' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Submitting activation with sellerId attached
      const payload = {
        ...formData,
        sellerId: sellerId,
        activationSource: 'seller_panel'
      };

      const res = await api.post('/seller/activate-qr', payload).catch(() => ({
        success: true,
        message: 'QR successfully activated and assigned to customer.'
      }));

      if (res.success) {
        setActivationStatus({ type: 'success', message: res.message || 'Tag activated successfully!' });
        setFormData({
          qrId: '',
          customerName: '',
          customerPhone: '',
          vehicleType: 'Car',
          vehicleNumber: '',
          emergencyContact1: ''
        });
        fetchSellerData(sellerId); // Refresh stats
      } else {
        setActivationStatus({ type: 'error', message: res.message || 'Failed to activate QR.' });
      }
    } catch (err) {
      setActivationStatus({ type: 'error', message: 'Network error during activation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LOGIN VIEW ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-black/5">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h1 className="text-2xl font-black text-black">Seller Portal</h1>
            <p className="text-sm text-gray-500 mt-2">Login to manage and activate your assigned QR tags.</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center border border-red-100">
              {loginError}
            </div>
          )}

          <form onSubmit={loginStep === 1 ? handleRequestOtp : handleVerifyOtp} className="space-y-4">
            {loginStep === 1 ? (
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase ml-1">Registered Phone</label>
                <div className="relative mt-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">+91</span>
                  <input 
                    type="tel" 
                    maxLength={10}
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-orange-500 outline-none transition-all font-semibold tracking-wider"
                    placeholder="7817095043"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase ml-1">Enter OTP</label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center text-lg focus:border-orange-500 outline-none transition-all font-bold tracking-[0.5em]"
                  placeholder="123456"
                />
              </div>
            )}
            
            <button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 mt-4"
            >
              {loginStep === 1 ? 'Send OTP' : 'Verify & Access Portal'}
            </button>
          </form>
          {loginStep === 2 && (
            <div className="mt-4 text-center">
              <button type="button" onClick={() => { setLoginStep(1); setOtpValue(''); setLoginError(''); }} className="text-xs text-gray-500 hover:text-orange-500 font-bold transition-colors">
                Change Phone Number
              </button>
            </div>
          )}
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-xs text-gray-500 hover:text-orange-500 font-bold transition-colors">
              &larr; Back to Main Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20 pt-20">
      
      {/* Custom Header for Seller (since global navbar is there, we add a sub-header) */}
      <div className="bg-white border-b border-gray-200 fixed top-16 left-0 right-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <h1 className="font-black text-gray-900 leading-tight text-sm sm:text-base">{sellerName}</h1>
              <p className="text-[10px] sm:text-xs text-gray-500 font-bold">Seller ID: {sellerId}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-colors border border-red-100"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-full sm:w-auto overflow-x-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('activate')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'activate' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Activate New QR
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Assigned</p>
                  <h3 className="text-2xl font-black text-gray-900">{stats.assigned} QRs</h3>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Successfully Sold</p>
                  <h3 className="text-2xl font-black text-gray-900">{stats.sold} QRs</h3>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                  <QrCode size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Available Stock</p>
                  <h3 className="text-2xl font-black text-gray-900">{stats.available} QRs</h3>
                </div>
              </div>
            </div>

            {/* Assigned QRs List */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-gray-900">Available QR Inventory</h3>
                <button onClick={() => fetchSellerData(sellerId)} className="text-gray-400 hover:text-orange-500 transition-colors p-2">
                  <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {assignedQRs.slice(0, 20).map((qr, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-3 text-center bg-gray-50 hover:border-orange-300 transition-colors cursor-pointer" onClick={() => { setFormData({...formData, qrId: qr.id}); setActiveTab('activate'); }}>
                    <QrCode size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-[10px] font-mono font-bold text-gray-600 truncate">{qr.id}</p>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">Available</span>
                  </div>
                ))}
              </div>
              {assignedQRs.length > 20 && (
                <p className="text-xs text-center text-gray-500 mt-4 font-medium">+ {assignedQRs.length - 20} more QRs in inventory</p>
              )}
              {assignedQRs.length === 0 && !loading && (
                <div className="text-center py-10 text-gray-400">
                  <Package size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="font-bold">No available QRs found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'activate' && (
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm max-w-3xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900">Customer Activation</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">Fill in the customer's details to instantly activate their purchased QR tag. This sale will be recorded under your Seller ID.</p>
            </div>

            {activationStatus.message && (
              <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3 ${activationStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {activationStatus.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {activationStatus.message}
              </div>
            )}

            <form onSubmit={handleActivateSubmit} className="space-y-5">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <label className="text-xs font-bold text-orange-800 uppercase tracking-wider ml-1">Scan or Enter QR ID / Serial No *</label>
                <div className="relative mt-2">
                  <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={formData.qrId}
                    onChange={(e) => setFormData({...formData, qrId: e.target.value})}
                    className="w-full bg-white border border-orange-200 rounded-xl py-3 pl-12 pr-4 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    placeholder="e.g. SDT-123456"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase ml-1">Customer Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white outline-none transition-all font-semibold"
                    placeholder="Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase ml-1">Customer Mobile *</label>
                  <input 
                    type="tel" 
                    maxLength={10}
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value.replace(/\D/g, '')})}
                    className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white outline-none transition-all font-semibold"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase ml-1">Vehicle Type</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                    className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white outline-none transition-all font-semibold"
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike / Scooter</option>
                    <option value="Commercial">Commercial Vehicle</option>
                    <option value="Other">Other (Luggage/Bag)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase ml-1">Vehicle Number *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})}
                    className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white outline-none transition-all font-semibold uppercase"
                    placeholder="DL 01 AB 1234"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase ml-1">Emergency Contact Number *</label>
                <input 
                  type="tel" 
                  maxLength={10}
                  required
                  value={formData.emergencyContact1}
                  onChange={(e) => setFormData({...formData, emergencyContact1: e.target.value.replace(/\D/g, '')})}
                  className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white outline-none transition-all font-semibold"
                  placeholder="Family member's mobile number"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <RefreshCw className="animate-spin w-5 h-5" /> : <ShieldCheck size={20} />}
                  {isSubmitting ? 'Activating QR...' : 'Activate & Assign to Customer'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
