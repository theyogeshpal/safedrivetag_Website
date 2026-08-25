import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Package, 
  Users, 
  QrCode, 
  TrendingUp, 
  Printer, 
  FileText, 
  Search, 
  RefreshCw, 
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Phone,
  Eye
} from 'lucide-react';
import PageLoader from '../components/PageLoader';
import api from '../services/api';
import downloadInvoicePdf from '../utils/invoiceGenerator';
import { openDigitalPdf, printDigitalPdfInColor } from '../utils/digitalPdfGenerator';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'kits' | 'stats'
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Products
      try {
        const prodRes = await api.getProducts();
        if (prodRes.success && prodRes.products) {
          setProducts(prodRes.products);
        }
      } catch (e) {
        console.error('Error loading admin products', e);
      }

      // 2. Fetch Orders
      try {
        const ordRes = await api.getUserOrders();
        if (ordRes.success && ordRes.orders) {
          setOrders(ordRes.orders);
        }
      } catch (e) {
        console.error('Error loading admin orders', e);
      }

      // 3. Fetch Dashboard & Kits
      try {
        const dashRes = await api.getDashboard();
        if (dashRes.success) {
          setDashboardData(dashRes);
        }
      } catch (e) {
        console.error('Error loading admin stats', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pt-36 sm:pt-40 lg:pt-44 pb-20 font-sans selection:bg-orange-500/30">
      
      {/* Admin Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-lg shadow-slate-900/20">
              <ShieldCheck className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">SafeDrive Admin Console</h1>
                <span className="bg-orange-500/10 text-orange-600 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-orange-500/20">
                  Live Operations
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Central management for Physical & Digital QR Kits, Orders, Invoices, and Voice Quota.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: 'orders', label: 'Customer Orders', icon: <Package size={16} />, badge: orders.length },
            { id: 'products', label: 'Products & Digital Kits', icon: <Sparkles size={16} />, badge: products.length },
            { id: 'kits', label: 'Active Vehicle Tags', icon: <QrCode size={16} />, badge: dashboardData?.kits?.length || 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {loading ? (
          <div className="bg-white rounded-3xl p-16 shadow-sm border border-slate-200/80">
            <PageLoader text="Syncing Admin Data & Telemetry..." fullScreen={false} />
          </div>
        ) : (
          <div>
            
            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Orders & Fulfillment</h2>
                    <p className="text-xs text-slate-500">View real-time customer purchases, tax invoices, and instant digital PDF prints</p>
                  </div>
                  
                  <div className="relative w-full sm:w-72">
                    <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search order ID or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-4">Product / Kit Type</th>
                        <th className="py-3 px-4">Customer Info</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions & PDF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                            No orders found in live database.
                          </td>
                        </tr>
                      ) : (
                        orders
                          .filter((ord) => 
                            !searchQuery || 
                            ord.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            ord._id?.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((ord, idx) => {
                            const isDigital = ord.items?.[0]?.qrType === 'DIGITAL' || ord.qrType === 'DIGITAL';
                            const orderItem = {
                              id: ord.orderNumber || ord._id || `ORD-${idx + 1}`,
                              title: ord.items?.[0]?.title || 'SafeDrive Smart QR Kit',
                              price: ord.totalAmount || ord.amount || 299,
                              date: ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN') : 'Recent',
                              publicToken: ord.items?.[0]?.publicToken || `pk_live_${idx + 10}`,
                              qrType: isDigital ? 'DIGITAL' : 'PHYSICAL',
                            };

                            return (
                              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                                  {ord.orderNumber || ord._id || `ORD-2026-${idx}`}
                                  <div className="text-[10px] text-slate-400 font-sans font-medium">{orderItem.date}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-bold text-slate-900">{orderItem.title}</div>
                                  <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded uppercase mt-0.5 ${
                                    isDigital 
                                      ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}>
                                    {isDigital ? '⚡ DIGITAL E-KIT' : '📦 PHYSICAL (SHIPPED)'}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-bold text-slate-900">{ord.name || 'Valued Customer'}</div>
                                  <div className="text-slate-500 text-[11px]">+91 {ord.phone || '9876543210'}</div>
                                </td>
                                <td className="py-3 px-4 font-black text-slate-900 text-sm">
                                  ₹{orderItem.price}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 font-bold px-2.5 py-1 rounded-full text-[10px]">
                                    <CheckCircle size={11} /> PAID (Razorpay)
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => downloadInvoicePdf(orderItem)}
                                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                                      title="Download Tax Invoice"
                                    >
                                      <FileText size={12} /> Invoice
                                    </button>

                                    {isDigital && (
                                      <>
                                        <button
                                          onClick={() => openDigitalPdf(orderItem)}
                                          className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold px-2.5 py-1.5 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                                          title="Open Digital PDF"
                                        >
                                          <Eye size={12} /> Open PDF
                                        </button>
                                        <button
                                          onClick={() => printDigitalPdfInColor(orderItem)}
                                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-2.5 py-1.5 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                                          title="Print Color PDF Sheet"
                                        >
                                          <Printer size={12} /> Print Color
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS & DIGITAL KITS */}
            {activeTab === 'products' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => {
                  const isDigital = prod.qrType === 'DIGITAL';
                  return (
                    <div key={prod._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                      <div>
                        <div className="w-full aspect-video rounded-2xl bg-slate-50 overflow-hidden mb-4 border border-slate-100 relative">
                          <img 
                            src={prod.imageUrl || 'https://res.cloudinary.com/dofqiruh7/image/upload/v1787403231/safedrive/products/wf5u8xfkhdfa1v2ndajx.jpg'} 
                            alt={prod.title} 
                            className="w-full h-full object-cover" 
                          />
                          <span className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            isDigital ? 'bg-purple-600 text-white' : 'bg-orange-500 text-white'
                          }`}>
                            {isDigital ? 'DIGITAL E-KIT' : 'PHYSICAL PRODUCT'}
                          </span>
                        </div>

                        <h3 className="font-black text-base text-slate-900 mb-1">{prod.title || prod.name}</h3>
                        <p className="text-xs text-slate-500 mb-4 line-clamp-2">{prod.description}</p>
                        
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-black text-slate-900">₹{prod.price}</span>
                          <span className="text-sm text-slate-400 line-through">₹{prod.originalPrice}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => openDigitalPdf({ title: prod.title, publicToken: prod._id, qrType: 'DIGITAL' })}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye size={13} /> Open PDF
                        </button>
                        <button
                          onClick={() => printDigitalPdfInColor({ title: prod.title, publicToken: prod._id, qrType: 'DIGITAL' })}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-500/20 cursor-pointer"
                        >
                          <Printer size={13} /> Print Color
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: VEHICLE TAGS & COPIES */}
            {activeTab === 'kits' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Vehicle Tags & Telemetry</h2>
                    <p className="text-xs text-slate-500">Live vehicle protections, cloud calling bridges, and emergency SOS contacts</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {dashboardData?.kits?.map((kit, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded">
                          {kit.copies?.[0]?.copyCode || kit.productId}
                        </span>
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          {kit.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-sm text-slate-900">
                          {kit.vehicle?.vehicleBrand} {kit.vehicle?.vehicleName} ({kit.vehicle?.vehicleNumber})
                        </h4>
                        <p className="text-xs text-slate-500">
                          Calls Left: <strong>{kit.wallet?.callBalance}</strong> | SMS Left: <strong>{kit.wallet?.messageBalance}</strong>
                        </p>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => openDigitalPdf({ title: `${kit.vehicle?.vehicleBrand} ${kit.vehicle?.vehicleName}`, publicToken: kit.copies?.[0]?.publicToken || kit.productId, vehicleNumber: kit.vehicle?.vehicleNumber })}
                          className="flex-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye size={12} /> View Badge PDF
                        </button>
                        <button
                          onClick={() => printDigitalPdfInColor({ title: `${kit.vehicle?.vehicleBrand} ${kit.vehicle?.vehicleName}`, publicToken: kit.copies?.[0]?.publicToken || kit.productId, vehicleNumber: kit.vehicle?.vehicleNumber })}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                        >
                          <Printer size={12} /> Print Color
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
