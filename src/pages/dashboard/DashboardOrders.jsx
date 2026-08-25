import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  FileText, 
  Eye, 
  X, 
  Printer, 
  Download, 
  ChevronRight, 
  MapPin, 
  ExternalLink,
  QrCode,
  Zap,
  ShieldCheck,
  Lock,
  KeyRound
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DashboardLayout from './DashboardLayout';
import { downloadInvoicePdf } from '../../utils/invoiceGenerator';
import { printDigitalPdfInColor } from '../../utils/digitalPdfGenerator';
import { showToast } from '../../utils/swal';

export default function DashboardOrders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Modals
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [digitalPassModalOrder, setDigitalPassModalOrder] = useState(null);
  const [activePassCopyIdx, setActivePassCopyIdx] = useState(0);
  const [productsMap, setProductsMap] = useState({});

  const DEFAULT_PRODUCT_IMG = 'https://res.cloudinary.com/dofqiruh7/image/upload/v1787403231/safedrive/products/wf5u8xfkhdfa1v2ndajx.jpg';

  const loadOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const [ordersRes, productsRes] = await Promise.allSettled([
        api.getUserOrders(),
        api.getProducts(),
      ]);

      const pMap = {};
      if (productsRes.status === 'fulfilled' && productsRes.value?.success && Array.isArray(productsRes.value.products)) {
        productsRes.value.products.forEach((p) => {
          if (p._id) pMap[p._id] = p;
          if (p.title) pMap[p.title.toLowerCase().trim()] = p;
          if (p.name) pMap[p.name.toLowerCase().trim()] = p;
        });
        setProductsMap(pMap);
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value?.success && ordersRes.value.orders) {
        setOrders(ordersRes.value.orders);
      }
    } catch (e) {
      console.error('Error fetching orders', e);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  const getProductImage = (ord) => {
    if (ord.imageUrl && !ord.imageUrl.includes('primary.jpeg') && !ord.imageUrl.includes('logo')) {
      return ord.imageUrl;
    }
    if (ord.productImageUrl) return ord.productImageUrl;
    if (ord.productId && productsMap[ord.productId]?.imageUrl) {
      return productsMap[ord.productId].imageUrl;
    }
    const nameKey = (ord.productName || ord.title || '').toLowerCase().trim();
    if (nameKey && productsMap[nameKey]?.imageUrl) {
      return productsMap[nameKey].imageUrl;
    }
    for (const key in productsMap) {
      if (nameKey.includes(key) || key.includes(nameKey)) {
        if (productsMap[key]?.imageUrl) return productsMap[key].imageUrl;
      }
    }
    return DEFAULT_PRODUCT_IMG;
  };

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleDownloadInvoice = (order) => {
    try {
      downloadInvoicePdf(order, currentUser);
      showToast.success('Tax invoice generated!');
    } catch (err) {
      console.error('Invoice download error', err);
      showToast.error('Could not download invoice at this moment.');
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const q = orderSearchQuery.toLowerCase();
    const matchesSearch = 
      ord.orderNumber?.toLowerCase().includes(q) ||
      ord.productName?.toLowerCase().includes(q) ||
      ord.title?.toLowerCase().includes(q);

    if (orderStatusFilter === 'ALL') return matchesSearch;
    if (orderStatusFilter === 'DELIVERED') return matchesSearch && (ord.deliveryStatus === 'DELIVERED' || ord.status === 'DELIVERED');
    if (orderStatusFilter === 'PROCESSING') return matchesSearch && (ord.deliveryStatus !== 'DELIVERED' && ord.status !== 'DELIVERED');
    return matchesSearch;
  });

  return (
    <DashboardLayout currentTab="orders" pageTitle="My Orders">
      <div className="bg-white rounded-sm shadow-sm border border-gray-200/80 p-4 sm:p-6 space-y-6">
        
        {/* Header Title + Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-bold text-[#212121]">
                My Orders
              </h2>
              <span className="bg-blue-50 text-[#2874f0] text-xs font-bold px-2 py-0.5 rounded border border-blue-200">
                {orders.length} Total
              </span>
            </div>
            <p className="text-xs text-[#878787] mt-0.5">
              View invoices, printable digital passes, and track shipping deliveries
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search orders..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-8 pr-3 text-xs outline-none focus:border-[#2874f0]"
              />
              <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md text-xs font-bold">
              {['ALL', 'PROCESSING', 'DELIVERED'].map((f) => (
                <button
                  key={f}
                  onClick={() => setOrderStatusFilter(f)}
                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                    orderStatusFilter === f ? 'bg-white text-[#2874f0] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoadingOrders ? (
          <div className="py-12 text-center">
            <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-gray-700">Loading Orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-gray-300 rounded-sm bg-gray-50/50">
            <Package size={36} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No Orders Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
              You haven't placed any orders matching this criteria yet.
            </p>
            <Link
              to="/shop"
              className="bg-[#2874f0] text-white text-xs font-bold px-6 py-2.5 rounded-sm shadow-sm"
            >
              Browse Safety Tags Store
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((ord) => {
              const isDigital = ord.productType === 'DIGITAL' || ord.qrType === 'DIGITAL' || ord.productName?.toLowerCase().includes('digital');
              const isDelivered = ord.deliveryStatus === 'DELIVERED' || ord.status === 'DELIVERED';
              const firstAllocated = Array.isArray(ord.allocatedQRIds) && ord.allocatedQRIds.length > 0 ? ord.allocatedQRIds[0] : null;
              const primaryToken = firstAllocated?.publicToken || firstAllocated?.copyCode || ord._id;
              const isTagActive = firstAllocated?.status === 'ACTIVE' || ord.isClaimed === true;

              return (
                <div
                  key={ord._id || ord.orderNumber}
                  className="border border-gray-200 rounded-sm p-4 sm:p-5 hover:border-gray-300 transition-all space-y-3.5 bg-white shadow-2xs"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 text-xs">
                    <div>
                      <span className="text-gray-400 font-medium">Order: </span>
                      <span className="font-mono font-bold text-gray-900">{ord.orderNumber}</span>
                      <span className="text-gray-300 mx-2">•</span>
                      <span className="text-gray-500">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-gray-900 text-sm">
                        ₹{ord.totalAmount || ord.amount || 299}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        isDelivered ? 'bg-green-100 text-green-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {isDelivered ? 'Delivered' : 'Confirmed & Active'}
                      </span>
                    </div>
                  </div>

                  {/* Order Body Details */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-gray-200 shadow-2xs overflow-hidden">
                        <img 
                          src={getProductImage(ord)} 
                          alt={ord.productName || ord.title || "Product"} 
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PRODUCT_IMG;
                          }}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">
                          {ord.productName || ord.title || 'SafeDrive Smart Vehicle Safety Tag'}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Format: <strong className="text-purple-700 uppercase">{isDigital ? 'Digital E-Kit Pass' : 'Physical Sticker Kit'}</strong> • Qty: {ord.quantity || 1}
                        </p>
                      </div>
                    </div>

                    {/* Actions on this Order */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      {isDigital && !isTagActive && (
                        <Link
                          to={`/register/${primaryToken}`}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-3.5 py-1.5 rounded text-xs flex items-center gap-1.5 shadow-sm transition-all animate-pulse"
                        >
                          <Zap size={13} /> Activate Pass
                        </Link>
                      )}

                      {isDigital && (
                        <button
                          onClick={() => {
                            setActivePassCopyIdx(0);
                            setDigitalPassModalOrder(ord);
                          }}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-3.5 py-1.5 rounded text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Eye size={13} /> View Digital Pass
                        </button>
                      )}

                      {!isDigital && (
                        <button
                          onClick={() => setTrackingModalOrder(ord)}
                          className="bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck size={13} /> Track Delivery
                        </button>
                      )}

                      <button
                        onClick={() => handleDownloadInvoice(ord)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText size={13} /> Invoice
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* IN-APP DIGITAL PASS MODAL */}
      {/* ======================================================== */}
      {digitalPassModalOrder && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden text-center flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={18} />
                <h3 className="text-sm font-bold">SafeDrive Digital Safety Pass Kit</h3>
              </div>
              <button
                onClick={() => setDigitalPassModalOrder(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {/* Copy Selector Tabs */}
              {Array.isArray(digitalPassModalOrder.allocatedQRIds) && digitalPassModalOrder.allocatedQRIds.length > 1 && (
                <div className="flex items-center justify-center gap-2 bg-gray-100 p-1 rounded-lg">
                  {Array.from(new Map(digitalPassModalOrder.allocatedQRIds?.map(item => [item.copyCode || item.publicToken, item])).values()).map((c, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => setActivePassCopyIdx(cIdx)}
                      className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                        activePassCopyIdx === cIdx 
                          ? 'bg-[#a855f7] text-white shadow-md' 
                          : 'bg-white text-gray-500 hover:bg-purple-50'
                      }`}
                    >
                      {c.copyCode || `Copy ${cIdx + 1}`}
                    </button>
                  ))}
                </div>
              )}

              {/* Scannable Vector QR Card */}
              {(() => {
                const uniqueCopies = Array.from(new Map(digitalPassModalOrder.allocatedQRIds?.map(item => [item.copyCode || item.publicToken, item])).values());
                const currentCopy = uniqueCopies[activePassCopyIdx] || {};
                const token = currentCopy.publicToken || currentCopy.copyCode || digitalPassModalOrder._id;
                const copyCode = currentCopy.copyCode || 'COPY-1';
                const isCopyActive = currentCopy.status === 'ACTIVE' || digitalPassModalOrder.isClaimed === true;
                const securityCode = currentCopy.securityCode || currentCopy.pin || digitalPassModalOrder.securityCode || digitalPassModalOrder.pin || '9921';
                const scanUrl = `https://safedrivetag-website.vercel.app/q/${token}`;

                return (
                  <div className="bg-[#fcfaff] border-2 border-purple-200 rounded-2xl p-5 text-center space-y-3.5 shadow-inner">
                    {/* Status Badge */}
                    <div className="flex items-center justify-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        isCopyActive 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {isCopyActive ? (
                          <>
                            <ShieldCheck size={14} className="text-emerald-600" /> Active Protection
                          </>
                        ) : (
                          <>
                            <Zap size={14} className="text-amber-600" /> Ready to Activate
                          </>
                        )}
                      </span>
                    </div>

                    <div className="relative inline-block mx-auto max-w-[340px] w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                      <img src="/images/sticker_template.jpg" alt="Digital Pass Card" className="w-full h-auto block" />
                      <div className="absolute top-[41%] left-[74.5%] -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 sm:p-2 rounded-xl shadow-md flex flex-col items-center">
                        <QRCodeSVG
                          value={scanUrl}
                          size={95}
                          level="H"
                          includeMargin={false}
                          imageSettings={{
                            src: "/logos/icon.png",
                            height: 24,
                            width: 24,
                            excavate: true,
                          }}
                        />
                        {securityCode && (
                          <div className="mt-1 font-mono font-black text-[9px] text-gray-900 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 tracking-wider">
                            PIN: {securityCode}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="font-mono font-black text-sm text-purple-950 uppercase tracking-wider">
                        {copyCode}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {digitalPassModalOrder.productName || 'SafeDrive Digital QR Protection'}
                      </p>
                      {securityCode && (
                        <div className="inline-flex items-center gap-1.5 mt-2 bg-purple-100/70 border border-purple-200 text-purple-900 text-xs px-2.5 py-1 rounded-md font-mono">
                          <KeyRound size={12} /> Security Code: <strong>{securityCode}</strong>
                        </div>
                      )}
                    </div>

                    {/* Activation CTA if unactivated */}
                    {!isCopyActive && (
                      <div className="pt-2">
                        <Link
                          to={`/register/${token}`}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                        >
                          <Zap size={15} /> ⚡ Activate This Digital Pass Now
                        </Link>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => printDigitalPdfInColor({
                          ...digitalPassModalOrder,
                          title: digitalPassModalOrder.productName,
                          publicToken: token,
                          securityCode: (activeCopy && (activeCopy.securityCode || activeCopy.pin)) || digitalPassModalOrder.securityCode || digitalPassModalOrder.pin,
                          vehicleNumber: isCopyActive ? 'ACTIVE PROTECTED' : 'READY TO ACTIVATE',
                        })}
                        className="bg-[#fb641b] hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Printer size={14} /> Print in Color
                      </button>

                      <Link
                        to={`/q/${token}`}
                        target="_blank"
                        className="bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <ExternalLink size={14} /> Test Live Scan
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PHYSICAL TRACKING MODAL */}
      {/* ======================================================== */}
      {trackingModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden text-left">
            <div className="bg-[#2874f0] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={18} />
                <h3 className="text-sm font-bold">Tracking Order #{trackingModalOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl border border-blue-200">
                <CheckCircle2 size={20} className="text-green-600 shrink-0" />
                <div>
                  <p className="font-bold text-gray-900">Order Dispatched & In Transit</p>
                  <p className="text-[11px] text-gray-500">Estimated Delivery: Within 3-4 Business Days via Bluedart / Delhivery</p>
                </div>
              </div>

              <div className="space-y-2 border-l-2 border-blue-500 pl-4 ml-2">
                <p className="font-bold text-gray-800">1. Order Placed & Confirmed</p>
                <p className="font-bold text-gray-800">2. Printed with High-Resolution Laminate</p>
                <p className="font-bold text-[#2874f0]">3. Handed to Courier Partner</p>
                <p className="text-gray-400 font-medium">4. Out for Delivery</p>
              </div>

              <button
                onClick={() => setTrackingModalOrder(null)}
                className="w-full bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
