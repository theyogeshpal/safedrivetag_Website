import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  FileText,
  Eye,
  EyeOff,
  X,
  Printer,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  QrCode,
  Zap,
  ShieldCheck,
  Lock,
  KeyRound,
  RefreshCw,
  ShoppingCart
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
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [expandedQRs, setExpandedQRs] = useState({}); // { copyCode: true/false }
  const [productsMap, setProductsMap] = useState({});

  const DEFAULT_PRODUCT_IMG = '/images/safedrive-tag-final.png';

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
    if (ord.imageUrl && !ord.imageUrl.includes('primary.jpeg') && !ord.imageUrl.includes('logo')) return ord.imageUrl;
    if (ord.productImageUrl) return ord.productImageUrl;
    if (ord.productId && productsMap[ord.productId]?.imageUrl) return productsMap[ord.productId].imageUrl;
    const nameKey = (ord.productName || ord.title || '').toLowerCase().trim();
    if (nameKey && productsMap[nameKey]?.imageUrl) return productsMap[nameKey].imageUrl;
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

  const toggleQR = (key) => {
    setExpandedQRs(prev => ({ ...prev, [key]: !prev[key] }));
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

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-bold text-[#212121]">My Orders</h2>
              <span className="bg-blue-50 text-[#2874f0] text-xs font-bold px-2 py-0.5 rounded border border-blue-200">
                {orders.length} Total
              </span>
            </div>
            <p className="text-xs text-[#878787] mt-0.5">
              View invoices, manage kit activation, and track your deliveries
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={32} className="text-[#fb641b] animate-spin" style={{ animationDuration: '1.2s' }} />
            <p className="text-sm font-bold text-[#1a2a4a]">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-gray-300 rounded-sm bg-gray-50/50">
            <Package size={36} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No Orders Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
              You haven't placed any orders yet.
            </p>
            <Link to="/shop" className="bg-[#fb641b] text-white text-xs font-bold px-6 py-2.5 rounded-sm shadow-sm">
              Browse Safety Tags Store
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((ord) => {
              const isDigital = ord.productType === 'DIGITAL' || ord.qrType === 'DIGITAL' || ord.productName?.toLowerCase().includes('digital');
              const isDelivered = ord.deliveryStatus === 'DELIVERED' || ord.status === 'DELIVERED';
              const isPaid = ord.paymentStatus === 'PAID' || ord.paymentStatus === 'SUCCESS' || ord.status === 'PAID';
              const allocatedCopies = Array.isArray(ord.allocatedQRIds) ? ord.allocatedQRIds : [];
              const uniqueCopies = Array.from(new Map(allocatedCopies.map(c => [c.copyCode || c.publicToken, c])).values());
              const activatedCount = uniqueCopies.filter(c => c.status === 'ACTIVE').length;
              const pendingCount = uniqueCopies.length - activatedCount;
              const qty = ord.quantity || uniqueCopies.length || 1;
              const unitPrice = Math.round((ord.totalAmount || ord.amount || 299) / qty);

              return (
                <div key={ord._id || ord.orderNumber} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">

                  {/* ── Order Top Bar ── */}
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-gray-800">Order #{ord.orderNumber}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {isDelivered && (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-black uppercase text-[10px] border border-green-300">
                          ✓ Delivered
                        </span>
                      )}
                      {isPaid && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black uppercase text-[10px] border border-blue-200">
                          ✓ Paid
                        </span>
                      )}
                      {pendingCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-black uppercase text-[10px] border border-amber-200">
                          {pendingCount} Kit{pendingCount > 1 ? 's' : ''} Pending Activation
                        </span>
                      )}
                      <span className="text-gray-500 font-medium">
                        TOTAL PAID: <span className="text-gray-900 font-black text-sm">₹{ord.totalAmount || ord.amount || 299}</span>
                      </span>
                    </div>
                  </div>

                  {/* ── Product Info Row ── */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-white shadow-xs flex items-center justify-center">
                        <img
                          src={getProductImage(ord)}
                          alt={ord.productName || 'Product'}
                          onError={(e) => { e.currentTarget.src = DEFAULT_PRODUCT_IMG; }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-gray-900 capitalize">
                          {String(ord.productName || ord.title || 'SafeDrive Smart Safety Tag').replace(/luggege/i, 'Luggage')}
                        </h4>
                        <div className="flex flex-wrap items-center text-[11px] text-gray-600 mt-1.5 gap-2">
                          {ord.qrFor && (
                            <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded font-bold border border-orange-100 uppercase tracking-wide text-[10px]">
                              🏷️ For {ord.qrFor}
                            </span>
                          )}
                          <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">Qty: <strong>{qty}</strong></span>
                          <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">Rate: <strong>₹{unitPrice}</strong></span>
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-100">
                            Total: ₹{ord.totalAmount || ord.amount || (unitPrice * qty)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      {!isDigital && (
                        <button
                          onClick={() => setTrackingModalOrder(ord)}
                          className="bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck size={12} /> Track Delivery
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadInvoice(ord)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText size={12} /> View &amp; Download Invoice Receipt
                      </button>
                      <Link
                        to="/shop"
                        className="bg-[#fb641b] hover:bg-orange-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                      >
                        <ShoppingCart size={12} /> Order Again (Buy Same Kit) →
                      </Link>
                    </div>
                  </div>

                  {/* ── Kit Sets Section (one card per copy) ── */}
                  {isDigital && uniqueCopies.length > 0 && (
                    <div className="px-4 py-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <p className="font-black text-gray-700 flex items-center gap-1.5">
                          <QrCode size={14} className="text-[#fb641b]" />
                          Safety Kit Sets Status ({uniqueCopies.length} Total Sets):
                        </p>
                        <span className="text-gray-500 font-semibold">
                          {activatedCount} of {uniqueCopies.length} Activated
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {uniqueCopies.map((copy, idx) => {
                          const copyToken = copy.publicToken || copy.copyCode || ord._id;
                          const copyCode = copy.copyCode || `COPY-${idx + 1}`;
                          const pin = copy.securityCode || copy.pin || ord.securityCode || '';
                          const isActive = copy.status === 'ACTIVE';
                          const qrKey = copyCode;
                          const isQRVisible = expandedQRs[qrKey];
                          const scanUrl = `https://safedrivetag-website.vercel.app/q/${copyToken}`;

                          return (
                            <div
                              key={qrKey}
                              className="border border-gray-200 rounded-xl overflow-hidden bg-[#fafafa]"
                            >
                              {/* Kit Set Header */}
                              <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-xs text-gray-800">Kit Set #{idx + 1}</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                    isActive
                                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                      : 'bg-purple-100 text-purple-700 border border-purple-200'
                                  }`}>
                                    {isActive ? '✓ Active' : 'Digital Ready'}
                                  </span>
                                </div>
                                {isActive && (
                                  <ShieldCheck size={14} className="text-emerald-600" />
                                )}
                              </div>

                              {/* Kit Set Body */}
                              <div className="px-3 py-2.5 space-y-2">
                                <div className="text-xs text-gray-600 space-y-1">
                                  <p>
                                    <span className="text-gray-400">Tag ID:</span>{' '}
                                    <span className="font-mono font-bold text-gray-800">{copyCode}</span>
                                    <span className="ml-1 text-gray-400">(Allotted)</span>
                                  </p>
                                  {pin && (
                                    <p className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-900 px-2 py-0.5 rounded font-mono font-black text-[11px]">
                                      <KeyRound size={10} /> PIN: {pin}
                                    </p>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 pt-1">
                                  {!isActive ? (
                                    <Link
                                      to={`/register/${copyToken}`}
                                      className="flex-1 bg-[#fb641b] hover:bg-orange-600 text-white font-black px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all animate-pulse"
                                    >
                                      <Zap size={12} /> Activate Now ▾
                                    </Link>
                                  ) : (
                                    <Link
                                      to="/dashboard"
                                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                      <CheckCircle2 size={12} /> Activated ✓
                                    </Link>
                                  )}

                                  <button
                                    onClick={() => toggleQR(qrKey)}
                                    className="flex-1 bg-white hover:bg-purple-50 border border-purple-200 text-purple-700 font-black px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                                  >
                                    {isQRVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                                    {isQRVisible ? 'Hide QR' : 'Show QR'}
                                  </button>
                                </div>

                                {/* Expandable QR Code */}
                                {isQRVisible && (
                                  <div className="mt-2 pt-3 border-t border-gray-100 flex flex-col items-center gap-3">
                                    <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-sm inline-flex flex-col items-center gap-1">
                                      <QRCodeSVG
                                        value={scanUrl}
                                        size={130}
                                        level="H"
                                        includeMargin={false}
                                        imageSettings={{
                                          src: "/logos/icon.png",
                                          height: 24,
                                          width: 24,
                                          excavate: true,
                                        }}
                                      />
                                      {pin && (
                                        <p className="font-mono font-black text-[10px] text-gray-700 mt-1">PIN: {pin}</p>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 w-full">
                                      <button
                                        onClick={() => printDigitalPdfInColor({
                                          ...ord,
                                          title: ord.productName,
                                          publicToken: copyToken,
                                          securityCode: pin,
                                          allocatedQRIds: undefined, // Fix: do not pass all QRs from the order
                                          copies: [qr] // Fix: explicitly pass only this single QR
                                        })}
                                        className="bg-[#fb641b] hover:bg-orange-600 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                      >
                                        <Printer size={12} /> Print Pass
                                      </button>
                                      <Link
                                        to={`/q/${copyToken}`}
                                        target="_blank"
                                        className="bg-white hover:bg-gray-50 text-purple-700 border border-purple-200 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5"
                                      >
                                        <ExternalLink size={12} /> Test Scan
                                      </Link>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Delivery Address ── */}
                  {(ord.shippingAddress || ord.address) && (
                    <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500 flex items-start gap-1.5">
                      <MapPin size={12} className="text-[#fb641b] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-gray-700">Delivery Address:</strong>{' '}
                        {ord.shippingAddress || `${ord.address || ''}, ${ord.city || ''} ${ord.state || ''} ${ord.pincode ? '- ' + ord.pincode : ''}`.trim()}
                        {(ord.customerName || currentUser?.name) && (
                          <span className="ml-1 text-gray-400">
                            · Recipient: {ord.customerName || currentUser?.name}
                            {(ord.customerPhone || currentUser?.phone) && ` · +91 ${(ord.customerPhone || currentUser?.phone || '').replace(/^91/, '')}`}
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-[#2874f0] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={18} />
                <h3 className="text-sm font-bold">Tracking Order #{trackingModalOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setTrackingModalOrder(null)} className="text-white/80 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl border border-blue-200">
                <CheckCircle2 size={20} className="text-green-600 shrink-0" />
                <div>
                  <p className="font-bold text-gray-900">Order Dispatched &amp; In Transit</p>
                  <p className="text-[11px] text-gray-500">Estimated Delivery: Within 3–4 Business Days via Bluedart / Delhivery</p>
                </div>
              </div>
              <div className="space-y-2 border-l-2 border-blue-500 pl-4 ml-2">
                <p className="font-bold text-gray-800">1. Order Placed &amp; Confirmed</p>
                <p className="font-bold text-gray-800">2. Printed with High-Resolution Laminate</p>
                <p className="font-bold text-[#2874f0]">3. Handed to Courier Partner</p>
                <p className="text-gray-400 font-medium">4. Out for Delivery</p>
              </div>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="w-full bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase cursor-pointer"
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
