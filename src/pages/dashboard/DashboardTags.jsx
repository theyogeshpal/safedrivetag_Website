import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  QrCode, 
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
  Truck 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DashboardLayout from './DashboardLayout';
import { printDigitalPdfInColor } from '../../utils/digitalPdfGenerator';
import { showToast, showConfirmDialog, customSwal } from '../../utils/swal';

export default function DashboardTags() {
  const { currentUser } = useAuth();

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

  // Modals
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [qrModalTag, setQrModalTag] = useState(null);

  // Link Tag Form State
  const [newTagId, setNewTagId] = useState('');
  const [newVehicleName, setNewVehicleName] = useState('');
  const [newVehicleNumber, setNewVehicleNumber] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('Car');

  const showNotification = (msg) => {
    showToast.success(msg);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast.success(`Copied: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const loadDashboardData = useCallback(async () => {
    setIsLoadingDashboard(true);
    try {
      // Clear legacy mock/test local cache if any
      try {
        localStorage.removeItem('safedrive_registered_tags');
      } catch (e) {}

      const res = await api.getDashboard();
      if (res.success) {
        const rawList = Array.isArray(res.qrCodes) 
          ? res.qrCodes 
          : (Array.isArray(res.kits) ? res.kits : []);

        const activeList = rawList
          .filter(q => q.status === 'ACTIVE' || q.isRegistered || q.status === 'active')
          .map((q, idx) => {
            const vBrand = q.vehicleBrand || q.vehicle?.vehicleBrand || '';
            const vModel = q.vehicleName || q.vehicle?.vehicleName || '';
            const vTitle = (vBrand || vModel) ? `${vBrand} ${vModel}`.trim() : (q.qrFor ? `${q.qrFor} Safety Tag` : 'My Tag');
            const vPlate = q.vehicleNumber || q.vehicle?.vehicleNumber || q.plateNumber || '';
            const token = q.publicToken || q.token || q.copyCode || q._id || `SD00${idx + 1}`;
            const id = q.copyCode || q.kitId || q.productId || q._id || token;

            const eContacts = Array.isArray(q.emergencyContacts) && q.emergencyContacts.length > 0
              ? q.emergencyContacts
              : (Array.isArray(q.vehicle?.emergencyContacts) && q.vehicle.emergencyContacts.length > 0
                  ? q.vehicle.emergencyContacts
                  : [
                      ...(q.emergencyContact1 ? [{ name: q.emergencyContact1.name || 'Primary Contact', number: q.emergencyContact1.phone || q.emergencyContact1.number }] : []),
                      ...(q.emergencyContact2 ? [{ name: q.emergencyContact2.name || 'Secondary Contact', number: q.emergencyContact2.phone || q.emergencyContact2.number }] : [])
                    ]);

            return {
              id,
              kitId: id,
              publicToken: token,
              primaryToken: token,
              copyCode: q.copyCode || token,
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
              registeredAt: q.createdAt?.split('T')[0] || q.registeredAt || new Date().toISOString().split('T')[0],
              callBalance: q.callBalance ?? q.wallet?.callBalance ?? 10,
              messageBalance: q.messageBalance ?? q.wallet?.messageBalance ?? 20,
              scansCount: q.scansCount ?? 0,
              callMaskingEnabled: q.callMaskingEnabled !== false,
              whatsappAlertsEnabled: q.whatsappAlertsEnabled !== false,
            };
          });

        setUserTags(activeList);
        setDashboardStats({
          totalKits: res.stats?.totalQRs ?? activeList.length,
          totalCallsLeft: res.stats?.totalCalls ?? activeList.reduce((sum, t) => sum + (t.callBalance || 0), 0),
          totalMessagesLeft: res.stats?.totalMessages ?? activeList.reduce((sum, t) => sum + (t.messageBalance || 0), 0),
          activeProtectionCount: res.stats?.activeQRs ?? activeList.length,
        });
      } else {
        setUserTags([]);
        setDashboardStats({
          totalKits: 0,
          totalCallsLeft: 0,
          totalMessagesLeft: 0,
          activeProtectionCount: 0,
        });
      }
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
  }, [currentUser]);

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
        emergencyContact1: sosList[0] ? { name: sosList[0].name, phone: sosList[0].number || sosList[0].phone } : undefined,
        emergencyContact2: sosList[1] ? { name: sosList[1].name, phone: sosList[1].number || sosList[1].phone } : undefined,
        whatsappNumber: editingTag.whatsapp,
      });
    } catch (err) {
      console.error(err);
    }

    setEditingTag(null);
    showToast.success('Vehicle & SOS details updated successfully!');
    loadDashboardData();
  };

  const handleLinkNewTag = async (e) => {
    e.preventDefault();
    if (!newTagId.trim()) return;

    const formattedId = newTagId.trim().toUpperCase();
    const cleanPhone = currentUser?.phone?.replace(/\D/g, '') || '';
    const vPlate = newVehicleNumber ? newVehicleNumber.trim().toUpperCase() : '';
    const vTitle = newVehicleName?.trim() || 'My Vehicle';

    const payload = {
      phone: cleanPhone,
      name: currentUser?.name || 'Owner',
      whatsappNumber: cleanPhone,
      vehicleBrand: 'SafeDrive',
      vehicleName: vTitle,
      vehicleNumber: vPlate,
      vehicleType: newVehicleType || 'Car',
      securityCode: '9921',
      emergencyContacts: currentUser?.emergencyContacts || [
        { name: 'Emergency SOS Contact', number: cleanPhone }
      ],
    };

    try {
      const res = await api.registerQrKit(formattedId, payload);
      if (res.success) {
        showToast.success('Tag linked and activated successfully!');
      } else {
        showToast.error(res.message || 'Failed to link tag.');
      }
    } catch (apiErr) {
      console.error(apiErr);
      showToast.error('Network error linking tag.');
    }

    setNewTagId('');
    setNewVehicleName('');
    setNewVehicleNumber('');
    setNewVehicleType('Car');
    setIsLinkModalOpen(false);
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

  return (
    <DashboardLayout currentTab="tags" pageTitle="My SafeDrive-Tags" saveSuccessMsg={saveSuccessMsg}>
      <div className="bg-white rounded-sm shadow-sm border border-gray-200/80 p-4 sm:p-6 space-y-6">
        
        {/* Header Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-bold text-[#212121]">
                My SafeDrive-Tags
              </h2>
              <span className="bg-blue-50 text-[#2874f0] text-xs font-bold px-2 py-0.5 rounded border border-blue-200">
                {userTags.length} Registered
              </span>
            </div>
            <p className="text-xs text-[#878787] mt-0.5">
              Manage call masking, SOS contacts, and instant scan alerts for your registered vehicles
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsLinkModalOpen(true)}
              className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-md text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus size={15} /> + LINK TAG
            </button>
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
            <p className="text-[11px] text-[#878787] font-semibold uppercase tracking-wider">Total Vehicle Kits</p>
            <p className="text-xl font-bold text-[#212121] mt-0.5">{dashboardStats.totalKits || userTags.length}</p>
            <span className="text-[10px] text-green-600 font-medium">All Protected</span>
          </div>
          <div className="p-2.5 border-l border-gray-200/70">
            <p className="text-[11px] text-[#878787] font-semibold uppercase tracking-wider">Remaining Calls</p>
            <p className="text-xl font-bold text-[#2874f0] mt-0.5">
              {dashboardStats.totalCallsLeft ?? userTags.reduce((sum, t) => sum + (t.callBalance || 0), 0)}
            </p>
            <span className="text-[10px] text-blue-600 font-medium">Voice Bridge Balance</span>
          </div>
          <div className="p-2.5 border-l border-gray-200/70">
            <p className="text-[11px] text-[#878787] font-semibold uppercase tracking-wider">Remaining Alerts</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">
              {dashboardStats.totalMessagesLeft ?? userTags.reduce((sum, t) => sum + (t.messageBalance || 0), 0)}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">WhatsApp / SMS</span>
          </div>
          <div className="p-2.5 border-l border-gray-200/70">
            <p className="text-[11px] text-[#878787] font-semibold uppercase tracking-wider">Active Monitoring</p>
            <p className="text-xl font-bold text-green-600 mt-0.5">{userTags.length || 0}</p>
            <span className="text-[10px] text-gray-500 font-medium">100% Number Masked</span>
          </div>
        </div>

        {/* Tags List */}
        {isLoadingDashboard ? (
          <div className="py-10 space-y-4 animate-fade-in text-center">
            <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-base font-bold text-gray-800">Loading Your SafeDrive-Tags...</h3>
          </div>
        ) : userTags.length === 0 ? (
          <div className="py-12 px-4 text-center border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/80 max-w-2xl mx-auto my-4 shadow-sm">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Lock size={32} />
            </div>
            <span className="inline-block bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3 border border-amber-200">
              🔒 Tag Management Disabled — Activation Required
            </span>
            <h3 className="text-xl font-black text-[#212121] tracking-tight">No Active SafeDrive-Tag Found</h3>
            <p className="text-xs sm:text-sm text-[#878787] max-w-md mx-auto mt-2 mb-6 leading-relaxed font-medium">
              This section is disabled because no active QR tag is linked to your account yet. Once you activate your QR sticker or purchase a safety kit, full tag controls, two-way masking, and emergency alerts will unlock here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(true)}
                className="w-full sm:w-auto bg-[#2874f0] hover:bg-blue-700 text-white text-xs font-black px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>+ LINK / ACTIVATE EXISTING TAG</span>
              </button>
              <Link
                to="/shop"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black px-6 py-3 rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2"
              >
                <span>BUY A SAFETY TAG (@ ₹299)</span>
              </Link>
            </div>
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
                  {/* Top Row: Tag ID + Status Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 bg-blue-50 text-[#2874f0] font-mono font-bold text-xs rounded border border-blue-200 flex items-center gap-1.5">
                        <QrCode size={13} /> {tag.id}
                      </span>
                      <button
                        onClick={() => handleCopy(tag.id)}
                        className="text-gray-400 hover:text-[#2874f0] p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Copy Tag ID"
                      >
                        {copiedId === tag.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {isActive ? 'Active Protection' : 'Paused'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {tag.scansCount || 0} Scans
                      </span>
                    </div>
                  </div>

                  {/* Middle Row: Vehicle & Contact Specs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                    
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
                          {tag.vehicleName || 'Vehicle Tag'}
                        </h4>
                        <p className="font-mono text-sm font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-300 tracking-wider uppercase inline-block mt-1">
                          {tag.vehicleNumber && !tag.vehicleNumber.includes('Unlinked') && !tag.vehicleNumber.includes('Ready') 
                            ? tag.vehicleNumber 
                            : 'ACTIVE PROTECTED'}
                        </p>
                        <span className="block text-[11px] text-gray-400 font-medium mt-1">
                          Type: {tag.vehicleType || 'Car'}
                        </span>
                      </div>
                    </div>

                    {/* Contact Config */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-gray-400" />
                        <span className="text-gray-500 font-medium">Owner:</span>
                        <span className="font-bold text-gray-800">
                          {tag.phone ? `+91 ${String(tag.phone).replace(/\D/g, '').slice(-10)}` : 'Not Set'}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone size={12} className="text-green-600 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="text-gray-500 font-medium">Emergency SOS: </span>
                          {tag.emergencyContacts && tag.emergencyContacts.length > 0 ? (
                            <span className="font-bold text-gray-800">
                              {tag.emergencyContacts.map((c, i) => (
                                <span key={i} className="inline-block mr-1.5">
                                  {typeof c === 'object' ? `${c.name || `SOS ${i + 1}`}: +91 ${String(c.number || c.phone || '').replace(/\D/g, '').slice(-10)}` : `+91 ${String(c).replace(/\D/g, '').slice(-10)}`}
                                  {i < tag.emergencyContacts.length - 1 ? ',' : ''}
                                </span>
                              ))}
                            </span>
                          ) : tag.emergencyContact ? (
                            <span className="font-bold text-gray-800">
                              +91 {String(tag.emergencyContact).replace(/\D/g, '').slice(-10)}
                            </span>
                          ) : (
                            <span className="font-bold text-emerald-700">2 Verified Contacts</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle size={12} className="text-emerald-600 shrink-0" />
                        <span className="text-gray-500 font-medium">WhatsApp Alerts:</span>
                        <span className="font-bold text-gray-800">
                          +91 {String(tag.whatsapp || tag.phone || currentUser?.phone || '').replace(/\D/g, '').slice(-10)}
                        </span>
                      </div>
                    </div>

                    {/* Privacy & Masking Feature */}
                    <div className="bg-[#fcfcfc] p-3 rounded border border-gray-100 flex flex-col justify-between text-xs">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-700 flex items-center gap-1">
                            <Shield size={12} className="text-[#2874f0]" /> Call Masking Bridge
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            tag.callMaskingEnabled ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {tag.callMaskingEnabled ? 'ON' : 'OFF'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {tag.callMaskingEnabled 
                            ? 'Scanners speak via automated bridge without seeing your real number.'
                            : 'Scanners see direct phone button.'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleMasking(tag.id, tag.callMaskingEnabled)}
                        className="text-[11px] font-bold text-[#2874f0] hover:underline text-left mt-2 cursor-pointer"
                      >
                        {tag.callMaskingEnabled ? 'Disable Masking' : 'Enable Call Masking'}
                      </button>
                    </div>

                  </div>

                  {/* Quota & Validity Row */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-sm p-3 my-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div>
                        <span className="text-gray-500 font-semibold text-[11px]">Calls Balance:</span>
                        <div className="font-black text-[#2874f0] text-sm flex items-center gap-1.5 mt-0.5">
                          <Phone size={12} />
                          <span>{tag.callBalance ?? 10} Left</span>
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded border border-blue-200">
                            Total: {tag.totalCalls || 10}
                          </span>
                        </div>
                      </div>
                      <div className="border-l border-blue-200 pl-4 sm:pl-6">
                        <span className="text-gray-500 font-semibold text-[11px]">WhatsApp / SMS:</span>
                        <div className="font-black text-emerald-600 text-sm flex items-center gap-1.5 mt-0.5">
                          <MessageCircle size={12} />
                          <span>{tag.messageBalance ?? 20} Left</span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                            Total: {tag.totalMessages || 20}
                          </span>
                        </div>
                      </div>
                      <div className="border-l border-blue-200 pl-4 sm:pl-6">
                        <span className="text-gray-500 font-semibold text-[11px]">Validity Expiry:</span>
                        <div className="font-bold text-gray-800 text-xs mt-0.5">
                          1 Year Active
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Actions Bar (Responsive Grid on Mobile, Flex on Desktop) */}
                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setQrModalTag(tag)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                      >
                        <QrCode size={13} /> View QR Badge
                      </button>

                      {tag.qrType === 'DIGITAL' && (
                        <button
                          onClick={() => printDigitalPdfInColor({ title: tag.vehicleName, publicToken: tag.primaryToken || tag.publicToken || tag.id, vehicleNumber: tag.vehicleNumber })}
                          className="bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                        >
                          <Printer size={13} /> Print Badge
                        </button>
                      )}

                      <Link
                        to={`/dashboard/tag/${tag.primaryToken || tag.publicToken || tag.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs text-center"
                      >
                        <Eye size={13} /> View Kit Details
                      </Link>

                      <button
                        onClick={() => setEditingTag(tag)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 size={13} /> Edit Details
                      </button>
                    </div>

                    <Link
                      to={`/q/${tag.publicToken || tag.id}`}
                      target="_blank"
                      className="text-xs font-bold text-[#2874f0] hover:underline flex items-center gap-1 shrink-0 pt-1 sm:pt-0"
                    >
                      Test Public QR Scan Page
                    </Link>
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
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-sm max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-[#2874f0] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={20} />
                <h3 className="text-base font-bold">Link New SafeDrive-Tag</h3>
              </div>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleLinkNewTag} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold uppercase mb-1">
                  Tag ID printed on sticker <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SD-99210"
                  value={newTagId}
                  onChange={(e) => setNewTagId(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2.5 text-sm font-mono font-bold outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold uppercase mb-1.5">Vehicle Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'Car', label: 'Car', icon: <Car size={16} /> },
                    { id: 'Bike', label: 'Bike', icon: <Bike size={16} /> },
                    { id: 'Luggage', label: 'Luggage', icon: <Briefcase size={16} /> },
                    { id: 'Truck', label: 'Truck', icon: <Truck size={16} /> },
                  ].map((vt) => (
                    <button
                      key={vt.id}
                      type="button"
                      onClick={() => setNewVehicleType(vt.id)}
                      className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-sm text-xs font-bold transition-all border cursor-pointer ${
                        newVehicleType === vt.id
                          ? 'bg-[#2874f0] text-white border-[#2874f0]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {vt.icon}
                      <span>{vt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold uppercase mb-1">
                  Vehicle Model Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyundai Creta / Honda City"
                  value={newVehicleName}
                  onChange={(e) => setNewVehicleName(e.target.value)}
                  className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2.5 text-sm font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold uppercase mb-1">
                  Vehicle Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL 01 AB 1234"
                  value={newVehicleNumber}
                  onChange={(e) => setNewVehicleNumber(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2.5 text-sm font-mono font-bold outline-none uppercase"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#fb641b] hover:bg-orange-600 text-white font-bold py-2.5 rounded-sm text-xs shadow-sm cursor-pointer uppercase"
                >
                  LINK TO ACCOUNT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT TAG MODAL (LOCKED VEHICLE NUMBER) */}
      {/* ======================================================== */}
      {editingTag && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-sm max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-[#2874f0] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 size={18} />
                <h3 className="text-base font-bold">Edit Tag Details ({editingTag.id})</h3>
              </div>
              <button
                onClick={() => setEditingTag(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold uppercase mb-1">Owner Full Name</label>
                <input
                  type="text"
                  required
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold uppercase mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    required
                    value={editingTag.vehicleName}
                    onChange={(e) => setEditingTag({ ...editingTag, vehicleName: e.target.value })}
                    className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold uppercase mb-1 flex items-center justify-between">
                    <span>Plate Number</span>
                    <span className="text-[10px] text-gray-400 font-normal flex items-center gap-0.5 lowercase">
                      <Lock size={10} /> locked
                    </span>
                  </label>
                  <div className="w-full bg-gray-100 border border-gray-300 text-gray-700 rounded-sm px-3 py-2 text-sm font-mono font-bold select-none cursor-not-allowed uppercase flex items-center justify-between">
                    <span>{editingTag.vehicleNumber || 'LOCKED'}</span>
                    <Lock size={13} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold uppercase mb-1">Emergency SOS Phone Number</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={editingTag.emergencyContact}
                  onChange={(e) => setEditingTag({ ...editingTag, emergencyContact: e.target.value.replace(/\D/g, '') })}
                  className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold uppercase mb-1">WhatsApp Alert Phone Number</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={editingTag.whatsapp}
                  onChange={(e) => setEditingTag({ ...editingTag, whatsapp: e.target.value.replace(/\D/g, '') })}
                  className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTag(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-sm text-xs shadow-sm cursor-pointer uppercase"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <div className="p-4 bg-white border border-gray-200 inline-block mx-auto mb-4 rounded-lg shadow-sm qr-canvas-download">
                <QRCodeSVG 
                  value={`https://safedrivetag-website.vercel.app/q/${qrModalTag.publicToken || qrModalTag.id}`}
                  size={180}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/logos/icon.png",
                    height: 42,
                    width: 42,
                    excavate: true,
                  }}
                />
                <p className="text-xs font-mono font-bold text-[#2874f0] mt-3">
                  {qrModalTag.id} • {qrModalTag.vehicleNumber}
                </p>
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
                    onClick={() => printDigitalPdfInColor(qrModalTag)}
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
    </DashboardLayout>
  );
}
