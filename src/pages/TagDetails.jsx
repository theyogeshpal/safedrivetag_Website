import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Shield, 
  Car, 
  Bike, 
  Truck, 
  Briefcase,
  Phone, 
  MessageCircle, 
  QrCode, 
  Download, 
  Eye, 
  Edit3, 
  RefreshCw, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Lock, 
  Check, 
  Copy, 
  Zap, 
  Printer, 
  User, 
  Mail, 
  FileText, 
  Info,
  Calendar,
  CreditCard,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { printDigitalPdfInColor } from '../utils/digitalPdfGenerator';
import { customSwal, showToast } from '../utils/swal';
import PageLoader from '../components/PageLoader';

export default function TagDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, setAuthenticatedSession } = useAuth();

  const [loading, setLoading] = useState(true);
  const [tagData, setTagData] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [copiedToken, setCopiedToken] = useState(null);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    whatsappNumber: '',
    vehicleBrand: '',
    vehicleName: '',
    vehicleNumber: '',
    vehicleType: 'Car',
    address: '',
    emergencyContact1Name: '',
    emergencyContact1Number: '',
    emergencyContact2Name: '',
    emergencyContact2Number: '',
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  // Fetch full details for this tag/kit
  const loadTagData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Check local registry first
      let locallyRegistered = {};
      try {
        locallyRegistered = JSON.parse(localStorage.getItem('safedrive_registered_tags') || '{}');
      } catch (e) {
        console.error(e);
      }

      // 2. Fetch User Orders to find the order containing this tag
      let foundOrder = null;
      let matchedAllocated = [];
      try {
        const ordersRes = await api.getUserOrders();
        if (ordersRes.success && ordersRes.orders) {
          for (const ord of ordersRes.orders) {
            if (Array.isArray(ord.allocatedQRIds) && ord.allocatedQRIds.length > 0) {
              const hasMatch = ord.allocatedQRIds.some(
                (q) => q.copyCode === id || q.publicToken === id || q._id === id || ord.orderNumber === id
              );
              if (hasMatch) {
                foundOrder = ord;
                matchedAllocated = ord.allocatedQRIds;
                break;
              }
            }
          }
        }
      } catch (e) {
        console.error('Error fetching user orders', e);
      }

      // 3. Query Public QR Info from API for live status
      let qrApiRes = null;
      try {
        qrApiRes = await api.getPublicQrInfo(id);
      } catch (e) {
        console.error('Error fetching public QR info', e);
      }

      // 4. Query Dashboard info
      let dashKit = null;
      try {
        const dashRes = await api.getDashboard();
        if (dashRes.success && dashRes.kits) {
          dashKit = dashRes.kits.find(
            (k) => k.copies?.some((c) => c.copyCode === id || c.publicToken === id) || k.productId === id
          );
        }
      } catch (e) {
        console.error('Error fetching dashboard kit', e);
      }

      // Build unified Tag Details Model
      let reg = locallyRegistered[id] || 
                (dashKit?.copies?.[0]?.publicToken && locallyRegistered[dashKit.copies[0].publicToken]) || 
                (matchedAllocated?.[0]?.publicToken && locallyRegistered[matchedAllocated[0].publicToken]) || 
                {};

      if (!reg || Object.keys(reg).length === 0) {
        for (const key of Object.keys(locallyRegistered)) {
          const item = locallyRegistered[key];
          if (item) {
            if (key === id || item.token === id || item.copyCode === id || item.id === id || 
                matchedAllocated.some(m => m.publicToken === key || m.copyCode === key || m.publicToken === item.token || m.copyCode === item.copyCode)) {
              reg = item;
              break;
            }
          }
        }
      }

      // If emergency contacts still missing in matched reg, match by logged in user phone
      const cleanUserPhone = currentUser?.phone ? String(currentUser.phone).replace(/\D/g, '').slice(-10) : '';
      if (!reg.emergencyContacts || reg.emergencyContacts.length === 0) {
        for (const key of Object.keys(locallyRegistered)) {
          const item = locallyRegistered[key];
          const itemPhone = item?.phone ? String(item.phone).replace(/\D/g, '').slice(-10) : '';
          if (cleanUserPhone && itemPhone === cleanUserPhone && Array.isArray(item.emergencyContacts) && item.emergencyContacts.length > 0) {
            reg = { ...item, ...reg, emergencyContacts: item.emergencyContacts };
            break;
          }
        }
      }

      const isRegistered = (qrApiRes?.status === 'ACTIVE') || 
                           !!(reg.vehicleNumber) || 
                           !!(qrApiRes?.vehicle?.vehicleNumber) || 
                           !!(dashKit?.vehicle?.vehicleNumber);

      // Clean Kit Number Resolution (e.g. SD001C1 -> SD001)
      const rawCode = matchedAllocated?.[0]?.copyCode || 
                      qrApiRes?.kitId || 
                      qrApiRes?.copyCode || 
                      dashKit?.copies?.[0]?.copyCode || 
                      dashKit?.kitId || 
                      reg?.copyCode || 
                      reg?.id || 
                      '';

      const baseKitCode = rawCode 
        ? rawCode.replace(/[-_]?C[0-9]+$/i, '').replace(/[-_]?COPY[0-9]+$/i, '') 
        : (qrApiRes?.kitId || (foundOrder?.orderNumber ? `SD001` : `SD001`));
      
      const vBrand = qrApiRes?.vehicle?.vehicleBrand || qrApiRes?.vehicleBrand || reg.vehicleBrand || dashKit?.vehicle?.vehicleBrand || (isRegistered ? 'Vehicle' : 'SafeDrive');
      const vName = qrApiRes?.vehicle?.vehicleName || qrApiRes?.vehicleName || reg.vehicleName || dashKit?.vehicle?.vehicleName || foundOrder?.title || 'Smart Vehicle Tag';
      const vPlate = qrApiRes?.vehicle?.vehicleNumber || qrApiRes?.vehicleNumber || reg.vehicleNumber || dashKit?.vehicle?.vehicleNumber || (isRegistered ? 'REGISTERED' : 'Not Linked Yet');
      const vType = qrApiRes?.vehicle?.vehicleType || qrApiRes?.vehicleType || reg.vehicleType || dashKit?.vehicle?.vehicleType || 'Car';

      // Check localStorage dedicated emergency contacts
      let cachedEmergency = null;
      try {
        cachedEmergency = JSON.parse(localStorage.getItem('safedrive_emergency_contacts') || 'null');
      } catch (e) {
        console.error(e);
      }

      // Check all registered tags for emergency contacts array with 2 contacts
      let fallbackTwoContacts = null;
      for (const k of Object.keys(locallyRegistered)) {
        const item = locallyRegistered[k];
        if (Array.isArray(item?.emergencyContacts) && item.emergencyContacts.length >= 2) {
          fallbackTwoContacts = item.emergencyContacts;
          break;
        }
      }

      // Resolve emergencyList from all available sources
      let rawContacts = (Array.isArray(cachedEmergency) && cachedEmergency.length >= 2 ? cachedEmergency : null) ||
                         (Array.isArray(qrApiRes?.emergencyContacts) && qrApiRes.emergencyContacts.length > 0 ? qrApiRes.emergencyContacts : null) || 
                         (Array.isArray(qrApiRes?.vehicle?.emergencyContacts) && qrApiRes.vehicle.emergencyContacts.length > 0 ? qrApiRes.vehicle.emergencyContacts : null) || 
                         (Array.isArray(reg?.emergencyContacts) && reg.emergencyContacts.length > 0 ? reg.emergencyContacts : null) || 
                         fallbackTwoContacts ||
                         cachedEmergency ||
                         dashKit?.emergencyContacts || 
                         dashKit?.vehicle?.emergencyContacts || 
                         (Array.isArray(currentUser?.emergencyContacts) ? currentUser.emergencyContacts : []);

      let emergencyList = [];
      if (Array.isArray(rawContacts) && rawContacts.length > 0) {
        emergencyList = rawContacts
          .filter(c => c && (c.number || c.phone || typeof c === 'string'))
          .map((c, idx) => ({
            name: (typeof c === 'object' && c.name) ? c.name : (idx === 0 ? 'Primary Emergency Contact' : 'Secondary Emergency Contact'),
            number: typeof c === 'object' ? (c.number || c.phone) : String(c),
          }));
      }

      // If emergencyList is still empty, fall back to owner's registered phone
      if (emergencyList.length === 0 && (reg?.emergencyContact || reg?.phone || currentUser?.phone)) {
        const primaryNo = reg?.emergencyContact || reg?.phone || currentUser?.phone;
        emergencyList = [
          { name: 'Primary Emergency SOS Contact', number: String(primaryNo).replace(/\D/g, '').slice(-10) }
        ];
      }

      // Form copies (from order or API or single token)
      let copies = [];
      if (matchedAllocated.length > 0) {
        copies = matchedAllocated.map((c, idx) => ({
          copyCode: c.copyCode || `${baseKitCode}-C${idx + 1}`,
          publicToken: c.publicToken || c.copyCode || id,
          qrType: c.qrType || foundOrder?.productType || 'DIGITAL',
        }));
      } else if (qrApiRes?.copies && qrApiRes.copies.length > 0) {
        copies = qrApiRes.copies;
      } else if (dashKit?.copies && dashKit.copies.length > 0) {
        copies = dashKit.copies;
      } else {
        copies = [
          { copyCode: `${baseKitCode}-C1`, publicToken: id, qrType: foundOrder?.qrType || 'DIGITAL' },
          { copyCode: `${baseKitCode}-C2`, publicToken: `${id}_c2`, qrType: foundOrder?.qrType || 'DIGITAL' },
        ];
      }

      const isDigital = foundOrder?.qrType === 'DIGITAL' || foundOrder?.productType === 'DIGITAL' || qrApiRes?.qrType === 'DIGITAL';

      const buyDate = foundOrder?.createdAt 
        ? new Date(foundOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      
      const expiresDate = foundOrder?.createdAt 
        ? new Date(new Date(foundOrder.createdAt).setFullYear(new Date(foundOrder.createdAt).getFullYear() + 1)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

      const unified = {
        kitId: baseKitCode,
        currentTagId: id,
        isRegistered,
        isDigital,
        status: isRegistered ? 'ACTIVE' : 'UNLINKED',
        category: vType,
        qrType: isDigital ? 'DIGITAL' : 'PHYSICAL',
        totalStickers: copies.length,
        copies,
        vehicle: {
          brand: vBrand,
          name: vName,
          plate: vPlate,
          type: vType,
        },
        emergencyContacts: emergencyList,
        owner: {
          name: qrApiRes?.user?.name || qrApiRes?.name || reg.name || foundOrder?.name || currentUser?.name || 'Customer',
          phone: qrApiRes?.user?.phone || qrApiRes?.phone || reg.phone || foundOrder?.phone || currentUser?.phone || '',
          email: qrApiRes?.user?.email || qrApiRes?.email || currentUser?.email || 'N/A',
          whatsapp: reg.whatsappNumber || currentUser?.whatsappNumber || currentUser?.phone || qrApiRes?.user?.phone || '',
          address: reg.address || foundOrder?.deliveryAddress || foundOrder?.shippingAddress || currentUser?.deliveryAddress || currentUser?.address || 'India',
        },
        wallet: {
          callBalance: qrApiRes?.wallet?.callBalance ?? qrApiRes?.callBalance ?? dashKit?.wallet?.callBalance ?? 10,
          totalCalls: qrApiRes?.wallet?.totalCalls ?? 10,
          callsUsed: (qrApiRes?.wallet?.totalCalls ?? 10) - (qrApiRes?.wallet?.callBalance ?? dashKit?.wallet?.callBalance ?? 10),
          messageBalance: qrApiRes?.wallet?.messageBalance ?? qrApiRes?.messageBalance ?? dashKit?.wallet?.messageBalance ?? 20,
          totalMessages: qrApiRes?.wallet?.totalMessages ?? 20,
          messagesUsed: (qrApiRes?.wallet?.totalMessages ?? 20) - (qrApiRes?.wallet?.messageBalance ?? dashKit?.wallet?.messageBalance ?? 20),
        },
        order: {
          orderNumber: foundOrder?.orderNumber || foundOrder?._id || `ORD-${id.slice(0, 8).toUpperCase()}`,
          buyDate,
          validity: '365 Days (1 Year Active)',
          expiresOn: expiresDate,
          renewalFee: '₹199 / year',
          amountPaid: foundOrder?.totalAmount || foundOrder?.amount ? `₹${foundOrder.totalAmount || foundOrder.amount}` : '₹299',
          paymentStatus: foundOrder?.paymentStatus || 'PAID',
        },
        scanLogs: Array.isArray(qrApiRes?.scanLogs) ? qrApiRes.scanLogs : (Array.isArray(dashKit?.scans) ? dashKit.scans : []),
      };

      setTagData(unified);
      setOrderInfo(foundOrder);

      // Pre-fill Edit Form
      setEditFormData({
        name: unified.owner.name,
        phone: unified.owner.phone,
        whatsappNumber: unified.owner.whatsapp,
        vehicleBrand: unified.vehicle.brand === 'SafeDrive' ? '' : unified.vehicle.brand,
        vehicleName: unified.vehicle.name === 'Smart Vehicle Tag' ? '' : unified.vehicle.name,
        vehicleNumber: unified.vehicle.plate === 'Not Linked Yet' ? '' : unified.vehicle.plate,
        vehicleType: unified.vehicle.type,
        address: unified.owner.address,
        emergencyContact1Name: unified.emergencyContacts[0]?.name || '',
        emergencyContact1Number: unified.emergencyContacts[0]?.number || '',
        emergencyContact2Name: unified.emergencyContacts[1]?.name || '',
        emergencyContact2Number: unified.emergencyContacts[1]?.number || '',
      });

    } catch (err) {
      console.error('Failed to load tag details', err);
    } finally {
      setLoading(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    loadTagData();
  }, [loadTagData]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMsg('');

    try {
      const updatedEmergencyContacts = [
        {
          name: editFormData.emergencyContact1Name.trim() || 'Primary Contact',
          number: editFormData.emergencyContact1Number.replace(/\D/g, ''),
        },
        {
          name: editFormData.emergencyContact2Name.trim() || 'Secondary Contact',
          number: editFormData.emergencyContact2Number.replace(/\D/g, ''),
        },
      ];

      const payload = {
        name: editFormData.name,
        phone: editFormData.phone.replace(/\D/g, ''),
        whatsappNumber: editFormData.whatsappNumber.replace(/\D/g, ''),
        address: editFormData.address,
        vehicleBrand: editFormData.vehicleBrand,
        vehicleName: editFormData.vehicleName,
        vehicleNumber: editFormData.vehicleNumber.toUpperCase(),
        emergencyContacts: updatedEmergencyContacts,
      };

      // Update local storage cache
      try {
        const existing = JSON.parse(localStorage.getItem('safedrive_registered_tags') || '{}');
        existing[id] = { ...payload, status: 'active' };
        if (tagData?.copies) {
          tagData.copies.forEach((c) => {
            existing[c.copyCode] = existing[id];
            existing[c.publicToken] = existing[id];
          });
        }
        localStorage.setItem('safedrive_registered_tags', JSON.stringify(existing));
      } catch (err) {
        console.error(err);
      }

      setUpdateMsg('Details updated successfully!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        setUpdateMsg('');
        loadTagData();
      }, 1000);
    } catch (err) {
      setUpdateMsg('Update failed. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <PageLoader text="Loading SafeDrive Smart Kit Details..." />;
  }

  if (!tagData) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] pt-28 pb-16 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-800">Tag Details Not Found</h2>
        <Link to="/dashboard" className="mt-4 inline-block bg-[#2874f0] text-white px-5 py-2 rounded text-xs font-bold">
          &larr; Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans antialiased text-[#1e293b]">
      
      <div className="max-w-6xl mx-auto space-y-5">
        
        {/* ======================================================== */}
        {/* TOP NAVIGATION BAR */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-xs font-bold text-gray-700 shadow-2xs transition-all"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#2874f0] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Edit3 size={14} /> Update Details
          </button>
        </div>

        {/* ======================================================== */}
        {/* HERO HEADER CARD (Kit Banner) */}
        {/* ======================================================== */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left Kit Meta */}
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-200 text-green-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-1.5">
                    <span>🏷️ Kit:</span>
                    <span className="font-mono">{tagData.kitId}</span>
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase flex items-center gap-1 border ${
                    tagData.isRegistered
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${tagData.isRegistered ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                    {tagData.isRegistered ? 'ACTIVE PROTECTION' : 'READY TO ACTIVATE'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Category: <strong className="text-gray-800">{tagData.category}</strong> • <span className="text-purple-600 font-bold uppercase">{tagData.isDigital ? 'DIGITAL E-KIT' : 'PHYSICAL KIT'}</span> • {tagData.totalStickers} {tagData.isDigital ? 'Printable Passes' : 'Physical Stickers'} in this kit
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <button
                onClick={() => customSwal.fire({
                  title: 'Subscription Active',
                  text: `Subscription for ${tagData.kitId} is active (Valid till ${tagData.order?.expiresOn || '1 Year'}). Full QR masking & SOS protection are enabled.`,
                  icon: 'success',
                  confirmButtonText: 'Great!',
                })}
                className="bg-[#2874f0] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <RefreshCw size={13} /> Renew (₹199/yr)
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Zap size={13} /> + Buy Booster Quota
              </button>
            </div>

          </div>

          {/* Multi-Sticker Rule Notice Box */}
          <div className="bg-[#f8fafc] border border-gray-200/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Info size={15} className="text-[#2874f0] shrink-0" />
              <span>
                <strong>Kit Multi-Sticker Rule:</strong> All {tagData.totalStickers} stickers ({tagData.copies.map(c => c.copyCode).join(', ')}) belong to the exact same kit and share identical safety settings & quota wallet.
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono font-bold text-[11px] text-[#2874f0] shrink-0">
              {tagData.copies.map((c, i) => (
                <span key={i} className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {c.copyCode}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2-COLUMN MAIN CONTENT GRID */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* ---------------------------------------------------- */}
          {/* LEFT 2 COLUMNS (Vehicle, SOS, Owner, Scans) */}
          {/* ---------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* 1. PROTECTED VEHICLE / ITEM DETAILS */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2874f0] flex items-center justify-center">
                    <Car size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-gray-900">Protected Vehicle / Item Details</h2>
                    <p className="text-[11px] text-gray-500">Asset linked to this safety sticker</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
                  tagData.isRegistered
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <Lock size={11} className={tagData.isRegistered ? 'text-green-600' : 'text-amber-600'} />
                  {tagData.isRegistered ? 'Locked & Protected' : 'Setup Pending'}
                </span>
              </div>

              {!tagData.isRegistered ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-amber-900 text-xs">Vehicle Link & Activation Pending</p>
                    <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                      Link your vehicle registration number and 2 emergency contacts to activate instant scan and call privacy.
                    </p>
                  </div>
                  <Link
                    to={`/register/${tagData.currentTagId}`}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg text-xs shrink-0 shadow-xs text-center transition-colors"
                  >
                    + Link Vehicle Now
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#f8fafc] border border-gray-200/70 p-3.5 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">BRAND / MAKE</p>
                    <p className="text-sm font-black text-gray-900 mt-1">{tagData.vehicle.brand}</p>
                  </div>
                  <div className="bg-[#f8fafc] border border-gray-200/70 p-3.5 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">MODEL / NAME</p>
                    <p className="text-sm font-black text-gray-900 mt-1">{tagData.vehicle.name}</p>
                  </div>
                  <div className="bg-purple-50/70 border border-purple-200 p-3.5 rounded-xl">
                    <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">VEHICLE PLATE NUMBER</p>
                    <p className="text-base font-black text-purple-950 font-mono tracking-wider mt-0.5 uppercase">
                      {tagData.vehicle.plate}
                    </p>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-1">
                <Lock size={12} className="text-gray-400" />
                <span>Vehicle plate number is permanently locked to prevent unauthorized sticker transfers.</span>
              </div>
            </div>

            {/* 2. DESIGNATED EMERGENCY CONTACTS */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-gray-900">Designated Emergency Contacts</h2>
                    <p className="text-[11px] text-gray-500">Alerted in case of emergency scan with GPS location</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-[#2874f0] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Edit3 size={12} /> Edit Contacts
                </button>
              </div>

              {tagData.emergencyContacts.length === 0 ? (
                <div className="py-6 text-center text-gray-500 bg-gray-50/70 rounded-xl border border-dashed border-gray-200 p-4">
                  <Phone size={22} className="mx-auto mb-1.5 text-gray-400" />
                  <p className="font-bold text-xs text-gray-700">No Emergency SOS Contacts Configured</p>
                  <p className="text-[11px] text-gray-500 max-w-sm mx-auto mt-0.5 mb-3">
                    Add family members to receive instant WhatsApp & SMS alerts when someone triggers emergency scan.
                  </p>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    + Add Emergency Contacts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {tagData.emergencyContacts.map((contact, idx) => (
                    <div key={idx} className="bg-[#f8fafc] border border-gray-200 p-3.5 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {idx === 0 ? 'PRIMARY CONTACT' : 'SECONDARY CONTACT'}
                        </p>
                        <p className="text-xs font-black text-gray-900 mt-0.5">{contact.name}</p>
                        <p className="text-xs font-mono font-bold text-gray-600">{contact.number}</p>
                      </div>
                      <a
                        href={`tel:${contact.number}`}
                        className="w-8 h-8 rounded-full bg-green-50 text-green-600 border border-green-200 flex items-center justify-center hover:bg-green-100 transition-colors"
                        title="Direct Call"
                      >
                        <Phone size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. OWNER PERSONAL & DELIVERY ADDRESS */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-gray-900">Owner Personal & Delivery Address</h2>
                    <p className="text-[11px] text-gray-500">Registered account holder profile</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-[#2874f0] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Edit3 size={12} /> Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">FULL NAME</p>
                  <p className="font-bold text-gray-900 mt-0.5">{tagData.owner.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">PRIMARY MOBILE PHONE</p>
                  <p className="font-bold font-mono text-gray-900 mt-0.5">{tagData.owner.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">EMAIL ADDRESS</p>
                  <p className="font-bold text-gray-900 mt-0.5">{tagData.owner.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">WHATSAPP ALERT NUMBER</p>
                  <p className="font-bold font-mono text-green-700 mt-0.5">{tagData.owner.whatsapp}</p>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">DELIVERY ADDRESS</p>
                  <p className="font-medium text-gray-700 mt-0.5">{tagData.owner.address}</p>
                </div>
              </div>
            </div>

            {/* 4. RECENT QR SCANS & ALERTS */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Eye size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-gray-900">Recent QR Scans & Alerts</h2>
                    <p className="text-[11px] text-gray-500">Real-time scan logs and call connections</p>
                  </div>
                </div>
                <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                </span>
              </div>

              {tagData.scanLogs.length === 0 ? (
                <div className="py-6 text-center text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 p-4">
                  <Eye size={22} className="mx-auto mb-1.5 text-gray-400" />
                  <p className="font-bold text-xs text-gray-700">No Scans Recorded Yet</p>
                  <p className="text-[11px] text-gray-500 max-w-sm mx-auto mt-0.5">
                    Your QR protection is 100% active. When someone scans your vehicle tag, instant activity logs will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 text-xs">
                  {tagData.scanLogs.map((log, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Eye size={14} className="text-gray-400" />
                        <div>
                          <span className="font-bold text-gray-800">{log.type || log.event || 'QR Sticker Scan'}</span>
                          <p className="text-[10px] text-gray-400">{log.time || log.createdAt || 'Recent'}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                        {log.status || 'Recorded'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ---------------------------------------------------- */}
          {/* RIGHT 1 COLUMN (Sticker Pass, Quota Wallet, Order) */}
          {/* ---------------------------------------------------- */}
          <div className="space-y-5">
            
            {/* 1. STICKER PASS COPIES (2) */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <QrCode size={18} className="text-[#2874f0]" />
                <h3 className="text-sm font-black text-gray-900">Sticker Pass ({tagData.copies.length})</h3>
              </div>

              <div className="space-y-4">
                {tagData.copies.map((c, idx) => {
                  const liveScanUrl = `https://safedrivetag-website.vercel.app/q/${c.publicToken || c.copyCode}`;
                  return (
                    <div key={idx} className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 text-center space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-gray-800">
                          Copy #{idx + 1}: <strong className="text-[#2874f0]">{c.copyCode}</strong>
                        </span>
                        <span className="text-[9px] font-black uppercase bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded border border-purple-200">
                          {c.qrType || 'DIGITAL'}
                        </span>
                      </div>

                      {/* Scannable High-Res QR Code with Logo Badge */}
                      <div className="bg-white p-2 rounded-lg border border-gray-200 inline-block shadow-2xs">
                        <QRCodeSVG
                          value={liveScanUrl}
                          size={135}
                          level="H"
                          includeMargin={false}
                          imageSettings={{
                            src: '/logos/icon.png',
                            x: undefined,
                            y: undefined,
                            height: 32,
                            width: 32,
                            excavate: true,
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          to={`/q/${c.publicToken || c.copyCode}`}
                          target="_blank"
                          className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 shadow-2xs transition-colors"
                        >
                          <Eye size={12} /> Scan View
                        </Link>
                        <button
                          onClick={() => downloadQrPng({ publicToken: c.publicToken, copyCode: c.copyCode, vehicleNumber: tagData.vehicle.plate })}
                          className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Download size={12} /> Download
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. KIT QUOTA WALLET */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Zap size={18} className="text-green-600" />
                <h3 className="text-sm font-black text-gray-900">Kit Quota Wallet</h3>
              </div>

              {/* Voice Calls Quota */}
              <div className="bg-green-50/50 border border-green-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-green-700 uppercase">VOICE CALLING QUOTA</p>
                  <p className="text-xl font-black text-green-950 mt-0.5">
                    {tagData.wallet.callBalance} <span className="text-xs font-normal text-gray-600">Calls left</span>
                  </p>
                  <p className="text-[10px] text-gray-400">Used: {tagData.wallet.callsUsed} calls</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <Phone size={16} />
                </div>
              </div>

              {/* Message / SMS Quota */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#2874f0] uppercase">MESSAGE / SMS QUOTA</p>
                  <p className="text-xl font-black text-blue-950 mt-0.5">
                    {tagData.wallet.messageBalance} <span className="text-xs font-normal text-gray-600">Msgs left</span>
                  </p>
                  <p className="text-[10px] text-gray-400">Used: {tagData.wallet.messagesUsed} msgs</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2874f0] flex items-center justify-center">
                  <MessageCircle size={16} />
                </div>
              </div>

              <button
                onClick={() => navigate('/shop')}
                className="w-full bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                + Add Booster Quota
              </button>
            </div>

            {/* 3. SUBSCRIPTION & ORDER DETAILS */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm space-y-3.5 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <CreditCard size={18} className="text-purple-600" />
                <h3 className="text-sm font-black text-gray-900">Subscription & Order Details</h3>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Activation / Buy Date</span>
                  <strong className="text-gray-900 font-mono">{tagData.order.buyDate}</strong>
                </div>

                <div className="flex justify-between items-center text-gray-500">
                  <span>Plan Validity</span>
                  <strong className="text-gray-900">{tagData.order.validity}</strong>
                </div>

                <div className="flex justify-between items-center text-gray-500">
                  <span>Expires On</span>
                  <strong className="text-amber-700 font-mono font-bold">{tagData.order.expiresOn}</strong>
                </div>

                <div className="flex justify-between items-center text-gray-500">
                  <span>Annual Renewal Fee</span>
                  <strong className="text-gray-900">{tagData.order.renewalFee}</strong>
                </div>

                <div className="flex justify-between items-center text-gray-500 pt-2 border-t border-gray-100">
                  <span>Order Invoice #</span>
                  <strong className="text-[#2874f0] font-mono text-[11px]">{tagData.order.orderNumber}</strong>
                </div>

                <div className="flex justify-between items-center text-gray-500">
                  <span>Amount Paid</span>
                  <strong className="text-green-700 font-black text-sm">{tagData.order.amountPaid}</strong>
                </div>

                <div className="flex justify-between items-center text-gray-500">
                  <span>Payment Status</span>
                  <span className="bg-green-100 text-green-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    {tagData.order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* UPDATE DETAILS MODAL */}
      {/* ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden">
            
            <div className="bg-[#2874f0] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 size={18} />
                <h3 className="text-base font-bold">Update Kit & Vehicle Details ({tagData.kitId})</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              
              {updateMsg && (
                <div className="bg-green-50 text-green-700 border border-green-200 p-2.5 rounded-lg text-center font-bold">
                  {updateMsg}
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-1">1. Vehicle Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Brand / Make</label>
                    <input
                      type="text"
                      required
                      value={editFormData.vehicleBrand}
                      onChange={(e) => setEditFormData({ ...editFormData, vehicleBrand: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Model / Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.vehicleName}
                      onChange={(e) => setEditFormData({ ...editFormData, vehicleName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1 flex items-center justify-between">
                    <span>Vehicle Plate Number</span>
                    <span className="text-[10px] text-gray-400 font-normal flex items-center gap-0.5">
                      <Lock size={10} /> Permanently Locked
                    </span>
                  </label>
                  <div className="w-full bg-gray-100 border border-gray-300 text-gray-700 rounded-lg p-2 font-mono font-black uppercase text-sm select-none cursor-not-allowed flex items-center justify-between">
                    <span>{editFormData.vehicleNumber || tagData.vehicle.plate || 'LOCKED'}</span>
                    <Lock size={14} className="text-gray-400" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Vehicle plate number is permanently locked to prevent unauthorized sticker transfers.</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-1">2. Emergency SOS Contacts</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Contact 1 Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.emergencyContact1Name}
                      onChange={(e) => setEditFormData({ ...editFormData, emergencyContact1Name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Contact 1 Phone</label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={editFormData.emergencyContact1Number}
                      onChange={(e) => setEditFormData({ ...editFormData, emergencyContact1Number: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Contact 2 Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.emergencyContact2Name}
                      onChange={(e) => setEditFormData({ ...editFormData, emergencyContact2Name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Contact 2 Phone</label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={editFormData.emergencyContact2Number}
                      onChange={(e) => setEditFormData({ ...editFormData, emergencyContact2Number: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow-sm cursor-pointer"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
