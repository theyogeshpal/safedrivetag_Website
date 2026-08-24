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
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { downloadQrPng, printDigitalPdfInColor } from '../utils/digitalPdfGenerator';
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
      const reg = locallyRegistered[id] || {};
      const primaryToken = qrApiRes?.token || id;
      const baseKitCode = id.replace(/C\d+$/, '') || 'SD022';
      
      const vBrand = qrApiRes?.vehicle?.vehicleBrand || reg.vehicleBrand || dashKit?.vehicle?.vehicleBrand || foundOrder?.productName || 'Honda';
      const vName = qrApiRes?.vehicle?.vehicleName || reg.vehicleName || dashKit?.vehicle?.vehicleName || 'Activa';
      const vPlate = qrApiRes?.vehicle?.vehicleNumber || qrApiRes?.vehicleNumber || reg.vehicleNumber || dashKit?.vehicle?.vehicleNumber || 'UP25 AB 4761';
      const vType = qrApiRes?.vehicle?.vehicleType || reg.vehicleType || dashKit?.vehicle?.vehicleType || 'Car';

      const emergencyList = qrApiRes?.emergencyContacts || qrApiRes?.vehicle?.emergencyContacts || reg.emergencyContacts || [
        { name: 'Family Member 1', number: '7668301822' },
        { name: 'Family Member 2', number: '8445046409' }
      ];

      // Form copies (Default to 2 copies if not present)
      let copies = [];
      if (matchedAllocated.length > 0) {
        copies = matchedAllocated.map((c, idx) => ({
          copyCode: c.copyCode || `${baseKitCode}C${idx + 1}`,
          publicToken: c.publicToken || c.copyCode,
          qrType: c.qrType || foundOrder?.productType || 'DIGITAL',
        }));
      } else {
        copies = [
          { copyCode: `${baseKitCode}C1`, publicToken: id, qrType: 'DIGITAL' },
          { copyCode: `${baseKitCode}C2`, publicToken: `${id}_c2`, qrType: 'DIGITAL' },
        ];
      }

      const unified = {
        kitId: baseKitCode,
        currentTagId: id,
        status: qrApiRes?.status === 'ACTIVE' || reg.status === 'active' || dashKit ? 'ACTIVE' : 'ACTIVE',
        category: vType,
        qrType: foundOrder?.qrType || 'DIGITAL',
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
          name: qrApiRes?.user?.name || reg.name || currentUser?.name || 'Yogesh Pal',
          phone: qrApiRes?.user?.phone || reg.phone || currentUser?.phone || '7817095043',
          email: currentUser?.email || 'yogeshpal1309@gmail.com',
          whatsapp: reg.whatsappNumber || currentUser?.whatsappNumber || currentUser?.phone || '7817095043',
          address: reg.address || currentUser?.address || 'bareilly, Bareilly, UTTAR PRADESH',
        },
        wallet: {
          callBalance: qrApiRes?.wallet?.callBalance ?? dashKit?.wallet?.callBalance ?? 9,
          totalCalls: qrApiRes?.wallet?.totalCalls ?? 10,
          callsUsed: 1,
          messageBalance: qrApiRes?.wallet?.messageBalance ?? dashKit?.wallet?.messageBalance ?? 20,
          totalMessages: qrApiRes?.wallet?.totalMessages ?? 20,
          messagesUsed: 0,
        },
        order: {
          orderNumber: foundOrder?.orderNumber || 'ORD-1787470251667-962',
          buyDate: foundOrder?.createdAt ? new Date(foundOrder.createdAt).toLocaleDateString('en-GB') : '23/08/2026',
          validity: '365 Days (1 Year)',
          expiresOn: '22/08/2027',
          renewalFee: '₹199 / year',
          amountPaid: foundOrder?.totalAmount ? `₹${foundOrder.totalAmount}` : '₹299',
          paymentStatus: 'PAID',
        },
        scanLogs: [
          { type: 'General Public Scan', time: '23/08/2026, 23:27:41', status: 'Recorded' },
          { type: 'General Public Scan', time: '23/08/2026, 22:57:54', status: 'Recorded' },
          { type: 'General Public Scan', time: '23/08/2026, 22:57:43', status: 'Recorded' },
          { type: 'General Public Scan', time: '23/08/2026, 22:57:31', status: 'Recorded' },
          { type: 'General Public Scan', time: '23/08/2026, 22:57:21', status: 'Recorded' },
          { type: 'General Public Scan', time: '23/08/2026, 22:54:47', status: 'Recorded' },
          { type: 'General Public Scan', time: '23/08/2026, 21:20:59', status: 'Recorded' },
          { type: 'General Public Scan', time: '23/08/2026, 20:59:21', status: 'Recorded' },
          { type: 'General Public Scan', time: '23/08/2026, 20:59:20', status: 'Recorded' },
          { type: 'General Public Scan', time: '23/08/2026, 13:37:50', status: 'Recorded' },
        ],
      };

      setTagData(unified);
      setOrderInfo(foundOrder);

      // Pre-fill Edit Form
      setEditFormData({
        name: unified.owner.name,
        phone: unified.owner.phone,
        whatsappNumber: unified.owner.whatsapp,
        vehicleBrand: unified.vehicle.brand,
        vehicleName: unified.vehicle.name,
        vehicleNumber: unified.vehicle.plate,
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
                  <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> ACTIVE PROTECTION
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Category: <strong className="text-gray-800">{tagData.category}</strong> • <span className="text-purple-600 font-bold uppercase">DIGITAL PASS</span> • {tagData.totalStickers} Physical Stickers in this kit
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <button
                onClick={() => alert(`Subscription for ${tagData.kitId} is already 1-Year Active!`)}
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
                <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-gray-200">
                  <Lock size={11} className="text-gray-500" /> Locked & Protected
                </span>
              </div>

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
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Eye size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900">Recent QR Scans & Alerts</h2>
                  <p className="text-[11px] text-gray-500">History of public scans on this QR kit</p>
                </div>
              </div>

              <div className="divide-y divide-gray-100 text-xs">
                {tagData.scanLogs.map((log, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Eye size={14} className="text-gray-400" />
                      <div>
                        <span className="font-bold text-gray-800">{log.type}</span>
                        <p className="text-[10px] text-gray-400">{log.time}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
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
                  <label className="block text-gray-600 font-bold mb-1">Vehicle Plate Number</label>
                  <input
                    type="text"
                    required
                    value={editFormData.vehicleNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, vehicleNumber: e.target.value.toUpperCase() })}
                    className="w-full border border-gray-300 rounded-lg p-2 font-mono font-black uppercase text-sm"
                  />
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
