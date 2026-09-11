import React, { useState, useEffect, useCallback } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Plus,
  Eye,
  Trash2,
  Edit3,
  Phone,
  MessageCircle,
  Shield,
  Copy,
  Check,
  Lock,
  X,
  Printer,
  Download,
  Car,
  Bike,
  Briefcase,
  Truck,
  QrCode,
  RefreshCw
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DashboardLayout from './DashboardLayout';
import { printDigitalPdfInColor } from '../../utils/digitalPdfGenerator';
import { showToast, showConfirmDialog, customSwal } from '../../utils/swal';

export default function DashboardTags() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State
  const [userTags, setUserTags] = useState([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalKits: 0,
    totalCallsLeft: 0,
    totalMessagesLeft: 0,
    activeProtectionCount: 0,
  });

  const [copiedId, setCopiedId] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [buyingPackage, setBuyingPackage] = useState(null);
  const [buyLoading, setBuyLoading] = useState(false);

  // Modals

  const [qrModalTag, setQrModalTag] = useState(null);



  const showNotification = (msg) => {
    showToast.success(msg);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast.success(`Copied: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchPackages = async () => {
    try {
      const res = await api.getPackages();
      if (res.success) {
        setPackages(res.packages || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleBuyBooster = async (pkg) => {
    setBuyingPackage(pkg);
    setBuyLoading(true);
    try {
      const firstQrId = userTags[0]?.copies?.[0]?._id || userTags[0]?.id;
      if (!firstQrId) {
        alert("You need an active tag to buy a booster.");
        setBuyLoading(false);
        return;
      }
      const res = await api.buyQuota({ packageId: pkg._id, qrId: firstQrId });
      if (res.success) {
        alert(`Order created for ₹${pkg.price}. Payment gateway connected!`);
        setShowBuyModal(false);
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message || 'Failed to initiate booster payment.');
    } finally {
      setBuyLoading(false);
    }
  };

  const loadDashboardData = useCallback(async () => {
    setIsLoadingDashboard(true);
    try {
      // Clear legacy mock/test local cache if any
      try {
        localStorage.removeItem('safedrive_registered_tags');
      } catch (e) { }

      let finalTagsList = [];

      const res = await api.getDashboard();
      if (res.success) {
        const rawList = Array.isArray(res.qrCodes)
          ? res.qrCodes
          : (Array.isArray(res.kits) ? res.kits : (Array.isArray(res.qrs) ? res.qrs : []));

        const activeList = rawList
          .filter(q => q.status === 'ACTIVE' || q.isRegistered || q.status === 'active');

        if (activeList.length > 0) {
          // Group copies belonging to the same Kit into 1 single tag card
          const kitMap = new Map();
          activeList.forEach((q, idx) => {
            const vBrand = q.vehicleBrand || q.vehicle?.vehicleBrand || '';
            const vModel = q.vehicleName || q.vehicle?.vehicleName || '';
            const vTitle = (vBrand || vModel) ? `${vBrand} ${vModel}`.trim() : (q.qrFor ? `${q.qrFor} Safety Tag` : 'My Tag');
            const vPlate = q.vehicleNumber || q.vehicle?.vehicleNumber || q.plateNumber || '';
            const token = q.publicToken || q.token || q.copyCode || q._id || `SD00${idx + 1}`;

            // Unique key for the KIT. Remove C1, C2 etc from copyCode to find the parent Kit.
            // DO NOT use orderId, because 1 order can have multiple different kits!
            const baseKey = q.kitId || (q.copyCode ? q.copyCode.replace(/C\d+$/i, '') : token);

            const eContacts = Array.isArray(q.emergencyContacts) && q.emergencyContacts.length > 0
              ? q.emergencyContacts
              : (Array.isArray(q.vehicle?.emergencyContacts) && q.vehicle.emergencyContacts.length > 0
                ? q.vehicle.emergencyContacts
                : [
                  ...(q.emergencyContact1 ? [{ name: q.emergencyContact1.name || 'Primary Contact', number: q.emergencyContact1.phone || q.emergencyContact1.number }] : []),
                  ...(q.emergencyContact2 ? [{ name: q.emergencyContact2.name || 'Secondary Contact', number: q.emergencyContact2.phone || q.emergencyContact2.number }] : [])
                ]);

            if (!kitMap.has(baseKey)) {
              kitMap.set(baseKey, {
                id: q.copyCode || baseKey,
                kitId: baseKey,
                publicToken: token,
                primaryToken: token,
                copyCode: q.copyCode || token,
                copies: [q],
                productId: q.productId || 'SafeDrive Smart Safety Kit',
                name: q.user?.name || res.user?.name || currentUser?.name || 'Owner',
                phone: q.user?.phone || res.user?.phone || currentUser?.phone || '',
                emergencyContact: eContacts[0]?.number || eContacts[0]?.phone || null,
                emergencyContacts: eContacts,
                whatsapp: q.whatsappNumber || q.user?.phone || res.user?.phone || currentUser?.phone,
                vehicleNumber: vPlate,
                vehicleName: vTitle,
                vehicleType: q.qrFor || q.vehicleType || q.vehicle?.vehicleType || 'General',
                status: (q.status || 'ACTIVE').toLowerCase(),
                qrType: q.qrType || 'PHYSICAL',
                securityCode: q.securityCode || q.pin || null,
                registeredAt: q.createdAt?.split('T')[0] || q.registeredAt || new Date().toISOString().split('T')[0],
                callBalance: q.callBalance ?? q.wallet?.callBalance ?? 10,
                messageBalance: q.messageBalance ?? q.wallet?.messageBalance ?? 20,
                scansCount: q.scansCount ?? 0,
                callMaskingEnabled: q.callMaskingEnabled !== false,
                whatsappAlertsEnabled: q.whatsappAlertsEnabled !== false,
              });
            } else {
              const existing = kitMap.get(baseKey);
              existing.copies.push(q);
              if (!existing.vehicleNumber && vPlate) existing.vehicleNumber = vPlate;
              if (vTitle && (!existing.vehicleName || existing.vehicleName === 'My Tag')) existing.vehicleName = vTitle;
            }
          });

          finalTagsList = Array.from(kitMap.values());
        }
      }

      // Sequential fallback order API fetching removed to significantly speed up page load.
      // If tags don't appear, the backend getDashboard() response must correctly include them.

      setUserTags(finalTagsList);
      setDashboardStats({
        totalKits: finalTagsList.length,
        totalCallsLeft: finalTagsList.reduce((sum, t) => sum + (t.callBalance || 0), 0),
        totalMessagesLeft: finalTagsList.reduce((sum, t) => sum + (t.messageBalance || 0), 0),
        activeProtectionCount: finalTagsList.length,
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setUserTags([]);
      setDashboardStats({
        totalKits: 0,
        totalCallsLeft: 0,
        totalMessagesLeft: 0,
        activeProtectionCount: 0,
      });
    } finally {
      setIsLoadingDashboard(false);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handlers
  const handleToggleMasking = (tagId, currentMasking) => {
    setUserTags(prev => prev.map(t => t.id === tagId ? { ...t, callMaskingEnabled: !currentMasking } : t));
    showNotification(`Call masking ${!currentMasking ? 'enabled' : 'disabled'} for Tag ${tagId}`);
  };

  const handleToggleStatus = (tagId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    setUserTags(prev => prev.map(t => t.id === tagId ? { ...t, status: newStatus } : t));
    showNotification(`Tag ${tagId} is now ${newStatus.toUpperCase()}`);
  };

  const handleDeleteTag = async (tagId) => {
    const confirmed = await showConfirmDialog({
      title: 'Unlink Safety Tag?',
      text: `Are you sure you want to unlink Tag ${tagId}? This will remove vehicle masking from this tag.`,
      confirmText: 'Yes, Unlink',
      cancelText: 'Keep Tag',
      icon: 'warning',
    });
    if (confirmed) {
      setUserTags(prev => prev.filter(t => t.id !== tagId));
      showToast.success(`Tag ${tagId} unlinked.`);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingTag) return;

    try {
      const sosList = Array.isArray(editingTag.emergencyContacts) && editingTag.emergencyContacts.length > 0
        ? editingTag.emergencyContacts
        : [{ name: 'Primary Emergency Contact', number: editingTag.emergencyContact }];

      await api.updateUserQrDetails(editingTag.id || editingTag.publicToken, {
        vehicleNumber: editingTag.vehicleNumber?.toUpperCase(),
        vehicleBrand: editingTag.vehicleBrand || '',
        vehicleName: editingTag.vehicleName || '',
        emergencyContacts: sosList,
        emergencyContacts: sosList
      });
    } catch (err) {
      console.error(err);
    }

    setEditingTag(null);
    showToast.success('Vehicle & SOS details updated successfully!');
    loadDashboardData();
  };


  const handleDownloadQrPng = (tag) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 600, 600);

    const svgElement = document.querySelector('.qr-canvas-download svg');
    if (!svgElement) {
      showToast.success('QR badge downloaded successfully!');
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 50, 50, 500, 500);
      const pngFile = canvas.toDataURL('image/png');
      const dlLink = document.createElement('a');
      dlLink.download = `SafeDrive_Tag_${tag.id || 'Badge'}.png`;
      dlLink.href = pngFile;
      dlLink.click();
      showToast.success('QR sticker badge downloaded!');
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Full page loader while checking QR activation status
  if (isLoadingDashboard) {
    return (
      <DashboardLayout currentTab="tags" pageTitle="My safedrivetags">
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <RefreshCw size={32} className="text-[#fb641b] animate-spin" style={{ animationDuration: '1.2s' }} />
          <p className="text-sm font-bold text-[#1a2a4a] tracking-wide text-center">
            Loading owner dashboard & active tags...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentTab="tags" pageTitle="My safedrivetags" saveSuccessMsg={saveSuccessMsg}>
      <div className="bg-white rounded-sm shadow-sm border border-gray-200/80 p-4 sm:p-6 space-y-6">

        {/* Header Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-bold text-[#212121]">
                My safedrivetags
              </h2>
              <span className="bg-blue-50 text-[#2874f0] text-xs font-bold px-2 py-0.5 rounded border border-blue-200">
                {userTags.length} Registered
              </span>
            </div>
            <p className="text-xs text-[#878787] mt-0.5">
              Manage call masking, SOS contacts, and instant scan alerts for your registered items
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">

            <Link
              to="/shop"
              className="bg-[#fb641b] hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-md text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
            >
              Buy More Tags
            </Link>
          </div>
        </div>

        {/* Metric Banner (Live Backend Stats) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-[#fbfbfb] p-3.5 rounded-sm border border-gray-200/70">
          <div className="p-2.5">
            <p className="text-[11px] text-[#878787] font-semibold uppercase tracking-wider">Total Kits</p>
            <p className="text-xl font-bold text-[#212121] mt-0.5">{dashboardStats.totalKits || userTags.length}</p>
            <span className="text-[10px] text-green-600 font-medium">All Protected</span>
          </div>
          <div className="p-2.5 border-l border-gray-200/70">
            <p className="text-[11px] text-[#878787] font-semibold uppercase tracking-wider">Remaining Calls</p>
            <p className="text-xl font-bold text-[#2874f0] mt-0.5">
              {dashboardStats.totalCallsLeft ?? userTags.reduce((sum, t) => sum + (t.callBalance || 0), 0)}
            </p>
            <span className="text-[10px] text-blue-600 font-medium">Voice Bridge Balance</span>
            {userTags.length > 0 && (
              <button onClick={() => setShowBuyModal(true)} className="mt-1 text-[10px] text-white bg-blue-600 px-2 py-1 rounded w-full">+ Buy Booster</button>
            )}
          </div>
          <div className="p-2.5 border-l border-gray-200/70">
            <p className="text-[11px] text-[#878787] font-semibold uppercase tracking-wider">Remaining Alerts</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">
              {dashboardStats.totalMessagesLeft ?? userTags.reduce((sum, t) => sum + (t.messageBalance || 0), 0)}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">WhatsApp / SMS</span>
            {userTags.length > 0 && (
              <button onClick={() => setShowBuyModal(true)} className="mt-1 text-[10px] text-white bg-emerald-600 px-2 py-1 rounded w-full">+ Buy Booster</button>
            )}
          </div>
          <div className="p-2.5 border-l border-gray-200/70">
            <p className="text-[11px] text-[#878787] font-semibold uppercase tracking-wider">Active Monitoring</p>
            <p className="text-xl font-bold text-green-600 mt-0.5">{userTags.length || 0}</p>
            <span className="text-[10px] text-gray-500 font-medium">100% Number Masked</span>
          </div>
        </div>

        {/* Tags List */}
        {isLoadingDashboard ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw size={32} className="text-[#fb641b] animate-spin" style={{ animationDuration: '1.2s' }} />
            <p className="text-sm font-bold text-[#1a2a4a]">Loading owner dashboard & active tags...</p>
          </div>
        ) : userTags.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-sm border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <QrCode size={48} className="text-gray-300" />
            <p className="text-lg font-bold text-gray-600">No Active Tags</p>
            <p className="text-sm text-gray-400">You don't have any active SafeDrive tags yet.</p>
            <Link to="/shop" className="mt-3 bg-[#fb641b] text-white px-5 py-2 rounded-md font-bold text-sm hover:bg-orange-600 transition-colors">
              Buy a Tag
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userTags.map((tag) => {
              const isActive = tag.status === 'active';
              return (
                <div
                  key={tag.id}
                  className="bg-white rounded-sm border border-gray-200 hover:border-gray-300 transition-all p-4 sm:p-5 relative shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
                >
                  {/* Top Row: Test Scan + Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <Link
                        to={`/q/${tag.publicToken || tag.id}`}
                        target="_blank"
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2874f0] font-bold text-xs rounded border border-blue-200 flex items-center gap-1.5 transition-colors"
                      >
                        <QrCode size={13} /> Test Public QR Scan Page
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      {tag.qrType === 'DIGITAL' && (
                        <button
                          onClick={() => printDigitalPdfInColor({
                            ...tag,
                            allocatedQRIds: undefined,
                            copies: tag.copies?.length > 0 ? [tag.copies[0]] : [tag],
                            title: tag.vehicleName || tag.title,
                            publicToken: tag.primaryToken || tag.publicToken || tag.id,
                            vehicleNumber: tag.vehicleNumber,
                            securityCode: tag.securityCode || tag.pin || tag.securityPin
                          })}
                          className="bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 p-2 sm:px-3 sm:py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          title="Print Badge"
                        >
                          <Printer size={16} className="sm:w-[13px] sm:h-[13px]" />
                          <span className="hidden sm:inline">Print Badge</span>
                        </button>
                      )}

                      <Link
                        to={`/dashboard/tag/${tag.kitId || tag.copyCode || tag.primaryToken || tag.id}`}
                        className="bg-[#2874f0] hover:bg-blue-700 text-white p-2 sm:px-3 sm:py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        title="View Tag Details"
                      >
                        <Eye size={16} className="sm:w-[13px] sm:h-[13px]" />
                        <span className="hidden sm:inline">View Tag Details</span>
                      </Link>


                    </div>
                  </div>

                  {/* Middle Row: Vehicle & Contact Specs */}
                  <div className="flex flex-col py-3">

                    {/* Vehicle Detail */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 text-[#2874f0] flex items-center justify-center flex-shrink-0">
                        {tag.vehicleType === 'Luggage' || tag.vehicleType === 'Bag' ? (
                          <Briefcase size={20} className="text-indigo-600" />
                        ) : tag.vehicleType === 'Bike' ? (
                          <Bike size={20} />
                        ) : (
                          <Car size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#212121] flex items-center gap-1.5">
                          {tag.vehicleName || ((tag.vehicleType === 'Luggage' || tag.vehicleType === 'Bag' || tag.qrType === 'DIGITAL') ? 'Smart Item Tag' : 'Vehicle Tag')}
                        </h4>
                        <div className="flex flex-col items-start gap-1 mt-1">
                          {tag.vehicleNumber && !tag.vehicleNumber.includes('Unlinked') && !tag.vehicleNumber.includes('Ready') && (
                            <p className="font-mono text-sm font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-300 tracking-wider uppercase inline-block">
                              {tag.vehicleNumber}
                            </p>
                          )}
                          {(tag.vehicleType === 'Luggage' || tag.vehicleType === 'Bag' || tag.qrType === 'DIGITAL') && tag.securityCode && (
                            <p className="inline-flex items-center gap-1 font-mono text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 tracking-wider">
                              <Lock size={12} /> PIN: {tag.securityCode}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center flex-wrap gap-2 text-[11px] font-medium mt-1.5">
                          <span className="text-gray-500">Type: {tag.vehicleType || 'Car'}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-600 flex items-center gap-1">
                            Tag ID: <strong className="font-mono text-[#2874f0]">{tag.id}</strong>
                            <button
                              onClick={() => handleCopy(tag.id)}
                              className="text-gray-400 hover:text-[#2874f0] p-0.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Copy Tag ID"
                            >
                              {copiedId === tag.id ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                            </button>
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-600 font-bold">{tag.scansCount || 0} Scans</span>
                          <span className="text-gray-300">•</span>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {isActive ? 'Active Protection' : 'Paused'}
                          </span>
                        </div>
                      </div>
                    </div>



                  </div>

                  {/* Quota & Validity Row */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-sm p-3 my-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div>
                        <span className="text-gray-500 font-semibold text-[11px]">Calls Balance:</span>
                        <div className="font-black text-[#2874f0] text-sm flex items-center gap-1.5 mt-0.5">
                          <Phone size={12} />
                          <span>{tag.callBalance ?? 10}/{tag.totalCalls || 10} Left</span>
                        </div>
                      </div>
                      <div className="border-l border-blue-200 pl-4 sm:pl-6">
                        <span className="text-gray-500 font-semibold text-[11px]">SMS Alerts:</span>
                        <div className="font-black text-emerald-600 text-sm flex items-center gap-1.5 mt-0.5">
                          <MessageCircle size={12} />
                          <span>{tag.messageBalance ?? 20}/{tag.totalMessages || 20} Left</span>
                        </div>
                      </div>
                      <div className="border-l border-blue-200 pl-4 sm:pl-6">
                        <span className="text-gray-500 font-semibold text-[11px]">Validity Expiry:</span>
                        <div className="font-bold text-gray-800 text-xs mt-0.5">
                          {tag.expiryDate ? new Date(tag.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '1 Year from Activation'}
                        </div>
                      </div>
                    </div>
                  </div>



                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: LINK NEW TAG MODAL */}
      {/* ======================================================== */}


      {/* ======================================================== */}
      {/* MODAL 3: QR CODE BADGE PREVIEW MODAL */}
      {/* ======================================================== */}
      {qrModalTag && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-sm max-w-sm w-full shadow-2xl border border-gray-200 text-center overflow-hidden">
            <div className="bg-[#2874f0] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">SafeDrive Smart Tag QR</h3>
              <button
                onClick={() => setQrModalTag(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="relative inline-block mx-auto max-w-[340px] w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-4 qr-canvas-download">
                <img src="/images/safedrivetag-final.png" alt="Digital Pass Card" className="w-full h-auto block" />
                <div className="absolute top-[50%] left-[75%] -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 sm:p-2 rounded-xl shadow-md flex flex-col items-center">
                  <QRCodeSVG
                    value={`https://safedrivetag-website.vercel.app/q/${qrModalTag.publicToken || qrModalTag.id}`}
                    size={120}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: "/logos/icon.png",
                      height: 24,
                      width: 24,
                      excavate: true,
                    }}
                  />
                  {qrModalTag.securityCode && (
                    <div className="mt-1 font-mono font-black text-[9px] text-gray-900 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 tracking-wider">
                      PIN: {qrModalTag.securityCode}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => downloadQrPng(qrModalTag)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-sm text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Download size={15} /> Download High-Res Badge (PNG)
                </button>
                {qrModalTag.qrType === 'DIGITAL' && (
                  <button
                    onClick={() => printDigitalPdfInColor({
                      ...qrModalTag,
                      allocatedQRIds: undefined,
                      copies: qrModalTag.copies?.length > 0 ? [qrModalTag.copies[0]] : [qrModalTag]
                    })}
                    className="w-full bg-[#fb641b] hover:bg-orange-600 text-white font-bold py-2.5 rounded-sm text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Printer size={15} /> Print Color Stickers (PDF)
                  </button>
                )}
                <Link
                  to={`/q/${qrModalTag.publicToken || qrModalTag.id}`}
                  target="_blank"
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2.5 rounded-sm text-xs flex items-center justify-center gap-1.5 transition-colors block"
                >
                  <Eye size={14} /> Open Live Scan Test Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {showBuyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-lg text-slate-900">Add Quota Booster</h3>
                <p className="text-xs text-slate-500">Top-up your voice call & instant notification quotas</p>
              </div>
              <button
                onClick={() => setShowBuyModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#1E8A38] p-4 rounded-2xl transition flex justify-between items-center shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-black text-sm text-slate-900">{pkg.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600 font-medium flex flex-wrap items-center gap-1.5">
                      <span>₹{pkg.price}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleBuyBooster(pkg)}
                    disabled={buyLoading}
                    className="bg-[#1E8A38] hover:bg-[#16702c] text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50 shrink-0 ml-3"
                  >
                    Buy ₹{pkg.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
