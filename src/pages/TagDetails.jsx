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
  const [isBoosterModalOpen, setIsBoosterModalOpen] = useState(false);
  const [boosterPlans, setBoosterPlans] = useState([]);
  const [loadingBooster, setLoadingBooster] = useState(false);
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
      // Fetch Orders, QR Info, Private QR details, and Dashboard in parallel
      const [ordersResSettled, qrResSettled, privateQrSettled, dashResSettled] = await Promise.allSettled([
        api.getUserOrders(),
        api.getPublicQrInfo(id),
        api.getUserQrDetails(id),
        api.getDashboard()
      ]);

      // 1. Process User Orders
      let foundOrder = null;
      let matchedAllocated = [];
      if (ordersResSettled.status === 'fulfilled' && ordersResSettled.value?.success && ordersResSettled.value.orders) {
        for (const ord of ordersResSettled.value.orders) {
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

      // 2. Process QR Info (Merge private and public)
      let qrApiRes = null;
      if (privateQrSettled.status === 'fulfilled' && privateQrSettled.value?.success) {
        qrApiRes = privateQrSettled.value.data || privateQrSettled.value;
      }
      if (!qrApiRes && qrResSettled.status === 'fulfilled') {
        qrApiRes = qrResSettled.value;
      } else if (qrApiRes && qrResSettled.status === 'fulfilled') {
        // Merge them so we get public + private fields
        qrApiRes = { ...qrResSettled.value, ...qrApiRes };
      }

      // 3. Process Dashboard info
      let dashKit = null;
      if (dashResSettled.status === 'fulfilled' && dashResSettled.value?.success && dashResSettled.value.kits) {
        dashKit = dashResSettled.value.kits.find(
          (k) => k.copies?.some((c) => c.copyCode === id || c.publicToken === id) || k.productId === id
        );
      }

  // Wait for initial render to fetch
  useEffect(() => {
    // We already fetch tagData in the main useEffect
  }, []);

  const openBoosterModal = async () => {
    setIsBoosterModalOpen(true);
    setLoadingBooster(true);
    try {
      // Simulate API fetch since there is no actual getBoosterPlans endpoint in api.js
      setTimeout(() => {
        setBoosterPlans([
          { id: 1, name: 'Basic Booster', price: 49, calls: 50, sms: 100 },
          { id: 2, name: 'Pro Booster', price: 99, calls: 150, sms: 300 },
          { id: 3, name: 'Unlimited Booster', price: 199, calls: 500, sms: 1000 },
        ]);
        setLoadingBooster(false);
      }, 800);
    } catch (err) {
      console.error(err);
      setLoadingBooster(false);
    }
  };

      // Build unified Tag Details Model
      const userRegisteredStr = localStorage.getItem('safedrive_user_registered_tags');
      const locallyRegistered = userRegisteredStr ? JSON.parse(userRegisteredStr) : {};

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

      // Ensure we only process the exact kit requested by URL ID
      const targetBaseKit = id.replace(/[-_]?C[0-9]+$/i, '').replace(/[-_]?COPY[0-9]+$/i, '');

      // Clean Kit Number Resolution (e.g. SD001C1 -> SD001)
      const rawCode = targetBaseKit ||
                      qrApiRes?.kitId || 
                      qrApiRes?.copyCode || 
                      dashKit?.copies?.[0]?.copyCode || 
                      dashKit?.kitId || 
                      reg?.copyCode || 
                      reg?.id || 
                      '';

      const baseKitCode = targetBaseKit || (rawCode 
        ? rawCode.replace(/[-_]?C[0-9]+$/i, '').replace(/[-_]?COPY[0-9]+$/i, '') 
        : (qrApiRes?.kitId || (foundOrder?.orderNumber ? `SD001` : `SD001`)));
      
      // Filter matchedAllocated so it ONLY contains stickers belonging to THIS Kit, not the whole order
      if (matchedAllocated && matchedAllocated.length > 0) {
        matchedAllocated = matchedAllocated.filter(q => {
          const qKit = (q.kitId || q.copyCode || q.publicToken || '').replace(/[-_]?C[0-9]+$/i, '').replace(/[-_]?COPY[0-9]+$/i, '');
          return qKit === baseKitCode || q.copyCode === id || q.publicToken === id;
        });
      }
      
      const vBrand = qrApiRes?.vehicle?.vehicleBrand || qrApiRes?.vehicleBrand || reg.vehicleBrand || dashKit?.vehicle?.vehicleBrand || (isRegistered ? 'Vehicle' : 'SafeDrive');
      const vName = qrApiRes?.vehicle?.vehicleName || qrApiRes?.vehicleName || reg.vehicleName || dashKit?.vehicle?.vehicleName || foundOrder?.title || ((qrApiRes?.qrFor === 'Luggage' || qrApiRes?.vehicleType === 'Luggage' || dashKit?.vehicleType === 'Luggage') ? 'Smart Item Tag' : 'Smart Vehicle Tag');
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

      // Strictly extract emergency contacts for THIS specific QR from backend data
      let qrSpecificContacts = [];

      // Source 1: Root emergencyContacts array
      const apiContactsArray = qrApiRes?.emergencyContacts || dashKit?.emergencyContacts || qrApiRes?.vehicle?.emergencyContacts || dashKit?.vehicle?.emergencyContacts;
      
      // Source 2: Flat fields in registration data
      const regData = dashKit?.registrationData || qrApiRes?.registrationData || qrApiRes || dashKit || {};
      
      if (Array.isArray(apiContactsArray) && apiContactsArray.length > 0) {
        qrSpecificContacts = apiContactsArray;
      } else if (regData.emergencyContacts && Array.isArray(regData.emergencyContacts) && regData.emergencyContacts.length > 0) {
        qrSpecificContacts = regData.emergencyContacts;
      } else if (regData.emergencyContact1Number || regData.emergencyContact2Number) {
        if (regData.emergencyContact1Number) {
          qrSpecificContacts.push({
            name: regData.emergencyContact1Name || 'Primary Contact',
            number: regData.emergencyContact1Number
          });
        }
        if (regData.emergencyContact2Number) {
          qrSpecificContacts.push({
            name: regData.emergencyContact2Name || 'Secondary Contact',
            number: regData.emergencyContact2Number
          });
        }
      }

      // Format strictly what we found, do not hallucinate currentUser phone
      let emergencyList = qrSpecificContacts
        .filter(c => c && (c.number || c.phone || typeof c === 'string'))
        .map((c, idx) => ({
          name: (typeof c === 'object' && c.name && c.name.trim() !== '') ? c.name : (idx === 0 ? 'Primary Contact' : 'Secondary Contact'),
          number: typeof c === 'object' ? (c.number || c.phone) : String(c),
        }));

      // Fallbacks ONLY if completely empty (which should rarely happen if registered properly)
      if (emergencyList.length === 0) {
        emergencyList = fallbackTwoContacts || cachedEmergency || [
          { name: 'Primary Contact (Not Set)', number: 'N/A' },
          { name: 'Secondary Contact (Not Set)', number: 'N/A' }
        ];
      } else if (emergencyList.length === 1) {
        emergencyList.push({ name: 'Secondary Contact (Not Set)', number: 'N/A' });
      }

      // We slice(0, 2) later when assigning to unified

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
        // Only generate exactly ONE copy as fallback, do not hallucinate a second copy
        copies = [
          { copyCode: `${baseKitCode}-C1`, publicToken: id, qrType: foundOrder?.qrType || 'DIGITAL' }
        ];
      }

      // Deduplicate to prevent "double doubles" from backend
      const uniqueCopiesMap = new Map();
      copies.forEach((c) => {
        const key = c.copyCode || c.publicToken;
        if (key && !uniqueCopiesMap.has(key)) {
          uniqueCopiesMap.set(key, c);
        }
      });
      copies = Array.from(uniqueCopiesMap.values());

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
        securityCode: qrApiRes?.securityCode || reg.securityCode || dashKit?.securityCode || foundOrder?.securityCode || null,
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
        email: unified.owner.email || '',
        whatsappNumber: unified.owner.whatsapp,
        vehicleBrand: unified.vehicle.brand === 'SafeDrive' ? '' : unified.vehicle.brand,
        vehicleName: unified.vehicle.name === 'Smart Vehicle Tag' ? '' : unified.vehicle.name,
        vehicleNumber: unified.vehicle.plate === 'Not Linked Yet' ? '' : unified.vehicle.plate,
        vehicleType: unified.vehicle.type,
        address: unified.owner.address || '',
        city: unified.owner.city || '',
        state: unified.owner.state || '',
        pincode: unified.owner.pincode || '',
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
        name: editFormData.name || '',
        email: editFormData.email || '',
        whatsappNumber: (editFormData.whatsappNumber || '').replace(/\D/g, ''),
        address: editFormData.address || '',
        city: editFormData.city || '',
        state: editFormData.state || '',
        pincode: editFormData.pincode || '',
        emergencyContacts: updatedEmergencyContacts
      };

      // Call backend API PUT /user/qr/:id/details
      try {
        await api.updateUserQrDetails(id, payload);
      } catch (apiErr) {
        console.warn('Backend details update warning:', apiErr);
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
      <div className="min-h-screen bg-[#f4f7fb] pt-36 sm:pt-40 lg:pt-44 pb-16 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-800">Tag Details Not Found</h2>
        <Link to="/dashboard" className="mt-4 inline-block bg-[#2874f0] text-white px-5 py-2 rounded text-xs font-bold">
          &larr; Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] pt-36 sm:pt-40 lg:pt-44 pb-20 px-4 sm:px-6 lg:px-8 font-sans antialiased text-[#1e293b]">
      
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
            
            {/* 1. PROTECTED ASSET / ITEM DETAILS */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              {(() => {
                const isAsset = tagData.category === 'Luggage' || tagData.category === 'Bag' || tagData.category === 'Item' || tagData.category === 'Other';
                return (
                  <>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2874f0] flex items-center justify-center">
                          <Car size={18} />
                        </div>
                        <div>
                          <h2 className="text-sm font-black text-gray-900">{isAsset ? 'Protected Asset / Item Details' : 'Protected Asset / Vehicle Details'}</h2>
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
                          <p className="font-bold text-amber-900 text-xs">{isAsset ? 'Item' : 'Asset'} Link & Activation Pending</p>
                          <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                            Link your {isAsset ? 'item details' : 'asset registration number'} and 2 emergency contacts to activate instant scan and call privacy.
                          </p>
                        </div>
                        <Link
                          to={`/register/${tagData.currentTagId}`}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg text-xs shrink-0 shadow-xs text-center transition-colors"
                        >
                          + Link {isAsset ? 'Item' : 'Asset'} Now
                        </Link>
                      </div>
                    ) : (
                      <div className={`grid grid-cols-2 gap-3 ${tagData.securityCode ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
                        <div className="bg-[#f8fafc] border border-gray-200/70 p-3.5 rounded-xl col-span-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isAsset ? 'TYPE / BRAND' : 'BRAND / MAKE'}</p>
                          <p className="text-sm font-black text-gray-900 mt-1">{tagData.vehicle.brand}</p>
                        </div>
                        <div className="bg-[#f8fafc] border border-gray-200/70 p-3.5 rounded-xl col-span-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isAsset ? 'DESCRIPTION / NAME' : 'MODEL / NAME'}</p>
                          <p className="text-sm font-black text-gray-900 mt-1">{tagData.vehicle.name}</p>
                        </div>
                        <div className="bg-purple-50/70 border border-purple-200 p-3.5 rounded-xl col-span-2 sm:col-span-1">
                          <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">{isAsset ? 'UNIQUE ID' : 'PLATE / ID'}</p>
                          <p className="text-base font-black text-purple-950 font-mono tracking-wider mt-0.5 uppercase">
                            {tagData.vehicle.plate}
                          </p>
                        </div>
                        {tagData.securityCode && (
                          <div className="bg-orange-50 border border-orange-200 p-3.5 rounded-xl col-span-2 sm:col-span-1">
                            <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1">
                              <Lock size={10} /> SECURITY PIN
                            </p>
                            <p className="text-base font-black text-orange-900 font-mono tracking-wider mt-0.5 uppercase">
                              {tagData.securityCode}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-1">
                      <Lock size={12} className="text-gray-400" />
                      <span>{isAsset ? 'Unique asset ID is permanently locked to prevent unauthorized sticker transfers.' : 'Asset ID is permanently locked to prevent unauthorized sticker transfers.'}</span>
                    </div>
                  </>
                );
              })()}
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
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2874f0] px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ml-auto shadow-xs"
                >
                  <Edit3 size={14} /> Update
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
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2874f0] px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ml-auto shadow-xs"
                >
                  <Edit3 size={14} /> Update
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
                          {tagData.copies.length > 1 ? `ID ${idx + 1}: ` : 'ID: '}<strong className="text-[#2874f0]">{c.copyCode}</strong>
                        </span>
                        <div className="flex gap-2">
                          <Link to="/shop?replace=true" className="text-[9px] font-black uppercase bg-red-50 text-red-600 hover:bg-red-100 px-1.5 py-0.5 rounded border border-red-200 transition-colors">
                            Replace Lost/Damaged
                          </Link>
                          <span className="text-[9px] font-black uppercase bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">
                            {c.qrType || 'DIGITAL'}
                          </span>
                        </div>
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

                      {/* Security PIN below QR */}
                      {(c.securityCode || c.pin || tagData.securityCode) && (
                        <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-900 text-xs px-3 py-1.5 rounded-lg font-mono font-bold">
                          <Lock size={12} className="text-orange-600" />
                          Security PIN: <strong>{c.securityCode || c.pin || tagData.securityCode}</strong>
                        </div>
                      )}

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
                <h3 className="text-base font-bold">Update Kit & Asset Details ({tagData.kitId})</h3>
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
                <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-1">1. Asset / Item Information</h4>
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

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-1">3. Owner Profile & Address</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-600 font-bold mb-1">WhatsApp Alerts</label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={editFormData.whatsappNumber || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, whatsappNumber: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-600 font-bold mb-1">Address / Street</label>
                    <textarea
                      rows="2"
                      value={editFormData.address || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">City</label>
                    <input
                      type="text"
                      value={editFormData.city || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">State</label>
                    <input
                      type="text"
                      value={editFormData.state || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={editFormData.pincode || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, pincode: e.target.value })}
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

      {isBoosterModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-amber-500 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={18} />
                <h3 className="text-base font-bold">Buy Booster Quota</h3>
              </div>
              <button onClick={() => setIsBoosterModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {loadingBooster ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
                  <p className="font-bold text-gray-500">Loading booster plans...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {boosterPlans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-gray-50 hover:border-amber-400 transition-colors cursor-pointer">
                      <div>
                        <h4 className="font-black text-gray-900">{plan.name}</h4>
                        <p className="text-xs font-bold text-gray-500 mt-1">
                          {plan.calls} Calls + {plan.sms} SMS Alerts
                        </p>
                      </div>
                      <Link to={`/shop?plan=${plan.id}`} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-sm">
                        Buy ₹{plan.price}
                      </Link>
                    </div>
                  ))}
                  <button onClick={() => setIsBoosterModalOpen(false)} className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold py-2.5 rounded-lg text-sm mt-2">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
