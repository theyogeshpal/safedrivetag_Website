import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import downloadInvoicePdf from '../utils/invoiceGenerator';
import { openDigitalPdf, printDigitalPdfInColor, downloadQrPng } from '../utils/digitalPdfGenerator';
import PageLoader from '../components/PageLoader';
import { QRCodeSVG } from 'qrcode.react';
import {
  User,
  Package,
  QrCode,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Shield,
  Phone,
  MessageCircle,
  Car,
  Bike,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Check,
  Eye,
  ExternalLink,
  Download,
  X,
  Search,
  MapPin,
  Star,
  Bell,
  Truck,
  CheckCircle2,
  ChevronDown,
  Briefcase,
  Zap,
  Clock,
  RefreshCw,
  FileText,
  Printer
} from 'lucide-react';

export default function Dashboard() {
  const { currentUser, logout, getUserTags, updateTag, registerTag, deleteTag, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('tags'); // 'tags' | 'profile' | 'orders' | 'addresses' | 'pan' | 'saved_upi' | 'saved_cards' | 'coupons' | 'reviews' | 'notifications' | 'wishlist' | 'logs'
  
  // Tags data & operations
  const [userTags, setUserTags] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [editingTag, setEditingTag] = useState(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [newTagId, setNewTagId] = useState('');
  const [newVehicleName, setNewVehicleName] = useState('');
  const [newVehicleNumber, setNewVehicleNumber] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('Car');
  const [qrModalTag, setQrModalTag] = useState(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  // Profile Edit State
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Addresses State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      name: currentUser?.name || 'Rahul Sharma',
      phone: currentUser?.phone || '9876543210',
      pincode: '110001',
      locality: 'Connaught Place',
      address: 'Flat 402, Block B, Heritage Residency, Barakhamba Road',
      city: 'New Delhi',
      state: 'Delhi',
      landmark: 'Near Metro Station Gate 2',
      type: 'HOME',
      isDefault: true,
    },
    {
      id: 'addr-2',
      name: currentUser?.name || 'Rahul Sharma',
      phone: currentUser?.phone || '9876543210',
      pincode: '122002',
      locality: 'Cyber City, DLF Phase 2',
      address: 'Tower 4, 8th Floor, Tech Innovation Park',
      city: 'Gurugram',
      state: 'Haryana',
      landmark: 'Opposite Cyber Hub',
      type: 'WORK',
      isDefault: false,
    }
  ]);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: 'Delhi',
    landmark: '',
    type: 'HOME'
  });

  // Orders State & Search
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [packages, setPackages] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ totalKits: 0, totalCallsLeft: 0, totalMessagesLeft: 0 });

  // FAQ Expand state
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Initial Sync from currentUser & Live Backend API
  const loadDashboardData = useCallback(async () => {
    setIsLoadingDashboard(true);
    try {
      // 1. Fetch User Orders first to get allocated QR tags
      let allOrders = [];
      let allocatedFromOrders = [];
      try {
        const ordersRes = await api.getUserOrders();
        if (ordersRes.success && ordersRes.orders && ordersRes.orders.length > 0) {
          allOrders = ordersRes.orders;
          
          // Map Orders
          const mappedOrders = ordersRes.orders.map((ord, idx) => {
            const isDigital = 
              ord.qrType === 'DIGITAL' || 
              ord.productType === 'DIGITAL' ||
              ord.items?.[0]?.qrType === 'DIGITAL' || 
              ord.productId?.qrType === 'DIGITAL' || 
              ord.batchId?.includes('DIGITAL') ||
              ord.title?.toLowerCase().includes('digital') || 
              ord.items?.[0]?.title?.toLowerCase().includes('digital') ||
              ord.productName?.toLowerCase().includes('digital') ||
              ord.productId?.title?.toLowerCase().includes('digital');

            const resolvedToken = 
              ord.publicToken || 
              ord.allocatedQRIds?.[0]?.publicToken ||
              ord.items?.[0]?.publicToken || 
              ord.copies?.[0]?.publicToken || 
              ord.copyCode ||
              ord.allocatedQRIds?.[0]?.copyCode ||
              ord.orderNumber || 
              ord._id;

            return {
              id: ord.orderNumber || ord._id || `ORD-${idx + 1}`,
              title: ord.productName || ord.items?.[0]?.title || ord.items?.[0]?.name || ord.productId?.title || ord.productId?.name || (isDigital ? 'Digital Kit' : 'SafeDrive Car Safety QR Protection Kit'),
              image: ord.productId?.imageUrl || ord.items?.[0]?.imageUrl || ord.imageUrl || 'https://res.cloudinary.com/dofqiruh7/image/upload/v1787403231/safedrive/products/wf5u8xfkhdfa1v2ndajx.jpg',
              price: ord.amount || ord.totalAmount || 299,
              date: ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
              status: ord.paymentStatus === 'PAID' ? 'Delivered' : ord.orderStatus === 'DELIVERED' ? 'Delivered' : 'Delivered',
              statusDate: ord.createdAt ? `Ordered on ${new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Processing',
              statusDesc: isDigital ? 'Instant Digital Kit - Ready to Print & Use' : (ord.deliveryAddress ? `Delivery to: ${ord.deliveryAddress}` : 'Express Pan-India Shipping'),
              vehicleType: isDigital ? 'Digital E-Kit' : 'Physical QR Kit',
              qrType: isDigital ? 'DIGITAL' : 'PHYSICAL',
              publicToken: resolvedToken,
              allocatedQRIds: ord.allocatedQRIds || [],
              rating: 5,
            };
          });
          setOrders(mappedOrders);

          // Load locally registered tags cache
          let locallyRegistered = {};
          try {
            locallyRegistered = JSON.parse(localStorage.getItem('safedrive_registered_tags') || '{}');
          } catch (e) {
            console.error('Error reading registered tags cache', e);
          }

          // Extract all allocated QR copies from orders
          ordersRes.orders.forEach((ord) => {
            if (Array.isArray(ord.allocatedQRIds) && ord.allocatedQRIds.length > 0) {
              ord.allocatedQRIds.forEach((qr, qIdx) => {
                const token = qr.publicToken || qr.copyCode || qr._id;
                const copyCode = qr.copyCode || `COPY-${qIdx + 1}`;
                const regInfo = locallyRegistered[token] || locallyRegistered[copyCode] || locallyRegistered[qr.copyCode];

                const isLinked = !!(qr.vehicleNumber || regInfo?.vehicleNumber);
                const vehicleNo = qr.vehicleNumber || regInfo?.vehicleNumber || 'Unlinked Tag (Ready to Link)';
                const vBrand = qr.vehicleBrand || regInfo?.vehicleBrand || '';
                const vName = qr.vehicleName || regInfo?.vehicleName || `${ord.productName || 'SafeDrive Smart Tag'} (Copy ${qIdx + 1})`;
                const vTitle = vBrand ? `${vBrand} ${vName}`.trim() : vName;

                allocatedFromOrders.push({
                  id: copyCode,
                  publicToken: token,
                  copyCode: copyCode,
                  productId: qr.productId || ord.productName || 'SafeDrive Smart Tag',
                  name: regInfo?.name || ord.customerName || currentUser?.name || 'Owner',
                  phone: regInfo?.phone || ord.customerPhone || currentUser?.phone,
                  emergencyContact: regInfo?.emergencyContacts?.[0]?.number || ord.customerPhone || currentUser?.phone,
                  emergencyContacts: regInfo?.emergencyContacts || [],
                  whatsapp: regInfo?.whatsappNumber || ord.customerPhone || currentUser?.phone,
                  vehicleNumber: vehicleNo,
                  vehicleName: vTitle,
                  vehicleType: qr.qrFor || regInfo?.vehicleType || 'Car',
                  status: isLinked ? 'active' : (qr.status === 'ACTIVE' ? 'active' : 'unregistered'),
                  qrType: qr.qrType || ord.productType || 'DIGITAL',
                  orderNumber: ord.orderNumber,
                  image: ord.productId?.imageUrl || ord.imageUrl || 'https://res.cloudinary.com/dofqiruh7/image/upload/v1787403231/safedrive/products/wf5u8xfkhdfa1v2ndajx.jpg',
                  registeredAt: qr.createdAt?.split('T')[0] || ord.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
                  expiryDate: null,
                  callBalance: qr.initialCalls ?? 10,
                  messageBalance: qr.initialMessages ?? 20,
                  scansCount: 0,
                  callMaskingEnabled: true,
                  whatsappAlertsEnabled: true,
                });
              });
            }
          });
        }
      } catch (e) {
        console.error('Error fetching user orders', e);
      }

      // 2. Fetch Dashboard Kits & Balances
      try {
        const res = await api.getDashboard();
        let mappedTags = [];
        if (res.success) {
          if (res.stats) {
            setDashboardStats(res.stats);
          }
          if (res.kits && res.kits.length > 0) {
            res.kits.forEach((kit, idx) => {
              const vehicleNo = kit.vehicle?.vehicleNumber || kit.vehicleNumber || kit.plateNumber || 'Protected Vehicle';
              const vBrand = kit.vehicle?.vehicleBrand || kit.vehicleBrand || '';
              const vName = kit.vehicle?.vehicleName || kit.vehicleName || kit.productName || 'My Vehicle';
              const vehicleTitle = vBrand ? `${vBrand} ${vName}`.trim() : vName;

              if (Array.isArray(kit.copies) && kit.copies.length > 0) {
                kit.copies.forEach((copy, cIdx) => {
                  mappedTags.push({
                    id: copy.copyCode || `SD-${idx + 1}C${cIdx + 1}`,
                    publicToken: copy.publicToken || copy.copyCode,
                    copyCode: copy.copyCode || `COPY-${cIdx + 1}`,
                    name: kit.user?.name || currentUser?.name || 'Owner',
                    phone: kit.user?.phone || currentUser?.phone,
                    emergencyContact: kit.vehicle?.emergencyContacts?.[0]?.number || currentUser?.phone,
                    emergencyContacts: kit.vehicle?.emergencyContacts || [],
                    whatsapp: currentUser?.phone,
                    vehicleNumber: vehicleNo,
                    vehicleName: `${vehicleTitle} (Copy ${cIdx + 1})`,
                    vehicleType: kit.vehicle?.vehicleType || kit.vehicleType || 'Car',
                    status: (copy.status || kit.status || 'ACTIVE').toLowerCase(),
                    registeredAt: kit.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
                    expiryDate: kit.expiryDate,
                    callBalance: kit.wallet?.callBalance ?? 10,
                    messageBalance: kit.wallet?.messageBalance ?? 20,
                    scansCount: (kit.wallet?.totalCallsUsed || 0) + (kit.wallet?.totalMessagesUsed || 0),
                    callMaskingEnabled: true,
                    whatsappAlertsEnabled: true,
                  });
                });
              } else {
                mappedTags.push({
                  id: kit.copyCode || kit.productId || `SD-${idx + 1}`,
                  publicToken: kit.publicToken || kit.token || kit.copies?.[0]?.publicToken || `pk_live_${idx}`,
                  copyCode: kit.copyCode || `SD-${idx + 1}`,
                  name: kit.user?.name || currentUser?.name || 'Owner',
                  phone: kit.user?.phone || currentUser?.phone,
                  emergencyContact: kit.vehicle?.emergencyContacts?.[0]?.number || currentUser?.phone,
                  emergencyContacts: kit.vehicle?.emergencyContacts || [],
                  whatsapp: currentUser?.phone,
                  vehicleNumber: vehicleNo,
                  vehicleName: vehicleTitle,
                  vehicleType: kit.vehicle?.vehicleType || kit.vehicleType || 'Car',
                  status: (kit.status || 'ACTIVE').toLowerCase(),
                  registeredAt: kit.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
                  expiryDate: kit.expiryDate,
                  callBalance: kit.wallet?.callBalance ?? 10,
                  messageBalance: kit.wallet?.messageBalance ?? 20,
                  scansCount: (kit.wallet?.totalCallsUsed || 0) + (kit.wallet?.totalMessagesUsed || 0),
                  callMaskingEnabled: true,
                  whatsappAlertsEnabled: true,
                });
              }
            });
          }
        }

        // Merge active kits with allocated QR copies
        const existingTokens = new Set(
          mappedTags.map(t => t.publicToken)
            .concat(mappedTags.map(t => t.id))
            .concat(mappedTags.map(t => t.copyCode))
        );
        const uniqueAllocated = allocatedFromOrders.filter(
          at => !existingTokens.has(at.publicToken) && !existingTokens.has(at.id) && !existingTokens.has(at.copyCode)
        );
        const allTags = [...mappedTags, ...uniqueAllocated];

        if (allTags.length > 0) {
          setUserTags(allTags);
        } else {
          const fallbackTags = getUserTags && currentUser?.phone ? getUserTags(currentUser.phone) : [];
          setUserTags(fallbackTags);
        }
      } catch (e) {
        console.error('Error loading dashboard kits', e);
        if (allocatedFromOrders.length > 0) {
          setUserTags(allocatedFromOrders);
        }
      }

      // 3. Fetch Add-On Packages
      try {
        const pkgRes = await api.getPackages();
        if (pkgRes.success && pkgRes.packages) {
          setPackages(pkgRes.packages);
        }
      } catch (e) {
        console.error('Error fetching add-on packages', e);
      }

    } catch (e) {
      console.error('Error loading dashboard data', e);
      const fallbackTags = getUserTags && currentUser?.phone ? getUserTags(currentUser.phone) : [];
      setUserTags(fallbackTags);
    } finally {
      setIsLoadingDashboard(false);
    }
  }, [currentUser, getUserTags]);

  useEffect(() => {
    const token = localStorage.getItem('safedrive_token');
    if (!currentUser && !token) {
      navigate('/login');
    } else {
      if (currentUser) {
        const parts = (currentUser.name || '').trim().split(' ');
        setFirstName(parts[0] || 'Rahul');
        setLastName(parts.slice(1).join(' ') || 'Sharma');
        setEmail(currentUser.email || 'rahul.sharma@example.com');
        setPhoneNumber(currentUser.phone || '');
        setGender(currentUser.gender || 'Male');
      }
      loadDashboardData();
    }
  }, [currentUser, navigate, loadDashboardData]);

  const showNotification = (msg) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = (tagId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateTag(tagId, { status: newStatus });
    setUserTags(getUserTags(currentUser.phone));
    showNotification(`Tag ${tagId} is now ${newStatus.toUpperCase()}`);
  };

  const handleToggleMasking = (tagId, currentMasking) => {
    updateTag(tagId, { callMaskingEnabled: !currentMasking });
    setUserTags(getUserTags(currentUser.phone));
    showNotification(`Call masking ${!currentMasking ? 'enabled' : 'disabled'} for Tag ${tagId}`);
  };

  const handleBuyBoosterQuota = async (tagId, category = 'CALL', quantity = 50, price = 99) => {
    try {
      showNotification('Processing Quota Booster Purchase...');
      const res = await api.buyQuota({
        qrId: tagId,
        category,
        quantity,
        amountPaid: price,
        paymentId: `pay_booster_${Date.now()}`,
      });
      if (res.success) {
        showNotification(res.message || `Successfully credited ${quantity} ${category} balance!`);
        loadDashboardData();
      } else {
        showNotification(res.message || 'Failed to top up quota.');
      }
    } catch (e) {
      showNotification('Error topping up quota.');
    }
  };

  const handleRenewValidity = async (tagId) => {
    try {
      showNotification('Renewing 1-Year Subscription...');
      const res = await api.renewSubscription({
        qrId: tagId,
        paymentAmount: 199,
        paymentId: `pay_renew_${Date.now()}`,
      });
      if (res.success) {
        showNotification(res.message || 'Subscription renewed for 365 days!');
        loadDashboardData();
      } else {
        showNotification(res.message || 'Renewal failed.');
      }
    } catch (e) {
      showNotification('Error renewing subscription.');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingTag) return;
    try {
      if (editingTag.emergencyContact) {
        await api.updateEmergencyContacts({
          vehicleId: editingTag.id,
          emergencyContacts: [
            { name: 'Primary Emergency Contact', number: editingTag.emergencyContact },
          ],
        });
      }
    } catch (err) {
      console.error('Error updating emergency contacts', err);
    }
    updateTag(editingTag.id, {
      name: editingTag.name,
      vehicleType: editingTag.vehicleType || 'Car',
      vehicleName: editingTag.vehicleName,
      vehicleNumber: editingTag.vehicleNumber,
      emergencyContact: editingTag.emergencyContact,
      whatsapp: editingTag.whatsapp,
    });
    setEditingTag(null);
    setUserTags(getUserTags(currentUser?.phone));
    showNotification('Vehicle Tag updated successfully!');
  };

  const handleLinkNewTag = (e) => {
    e.preventDefault();
    if (!newTagId.trim()) return;

    const formattedId = newTagId.trim().toUpperCase();
    registerTag({
      id: formattedId,
      name: currentUser.name || 'Owner',
      phone: currentUser.phone,
      emergencyContact: currentUser.phone,
      whatsapp: currentUser.phone,
      vehicleName: newVehicleName || 'My Vehicle',
      vehicleNumber: newVehicleNumber ? newVehicleNumber.toUpperCase() : 'Not Specified',
      vehicleType: newVehicleType || 'Car',
      status: 'active',
      registeredAt: new Date().toISOString().split('T')[0],
      scansCount: 0,
      callMaskingEnabled: true,
      whatsappAlertsEnabled: true,
    });

    setNewTagId('');
    setNewVehicleName('');
    setNewVehicleNumber('');
    setNewVehicleType('Car');
    setIsLinkModalOpen(false);
    setUserTags(getUserTags(currentUser.phone));
    showNotification(`New Tag ${formattedId} linked to your account!`);
  };

  const handleDeleteTag = (tagId) => {
    if (window.confirm(`Are you sure you want to unlink Tag ${tagId}?`)) {
      deleteTag(tagId);
      setUserTags(getUserTags(currentUser.phone));
      showNotification(`Tag ${tagId} has been removed.`);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    try {
      await api.updateProfile({
        name: fullName,
        email: email.trim(),
        whatsappNumber: phoneNumber.trim(),
        address: addresses[0]?.address || 'India',
      });
    } catch (err) {
      console.error('Error updating live profile', err);
    }
    updateUserProfile({
      name: fullName,
      gender,
      email,
      phone: phoneNumber
    });
    setIsEditingPersonal(false);
    setIsEditingEmail(false);
    setIsEditingPhone(false);
    showNotification('Profile details updated successfully!');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.phone || !newAddress.pincode || !newAddress.address) {
      alert('Please fill in all required address fields');
      return;
    }
    const newAddrObj = {
      id: `addr-${Date.now()}`,
      ...newAddress,
      isDefault: addresses.length === 0
    };
    setAddresses([...addresses, newAddrObj]);
    setNewAddress({
      name: '',
      phone: '',
      pincode: '',
      locality: '',
      address: '',
      city: '',
      state: 'Delhi',
      landmark: '',
      type: 'HOME'
    });
    setShowAddAddress(false);
    showNotification('New delivery address saved!');
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(a => a.id !== id));
      showNotification('Address deleted successfully.');
    }
  };

  if (!currentUser) return null;

  const totalScans = userTags.reduce((sum, t) => sum + (t.scansCount || 0), 0);
  const activeTagsCount = userTags.filter(t => t.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-[#212121] pt-20 sm:pt-24 pb-16 font-sans">
      
      {/* Toast Alert message */}
      {saveSuccessMsg && (
        <div className="fixed top-20 right-5 z-50 bg-[#2874f0] text-white px-5 py-3 rounded shadow-xl flex items-center gap-3 animate-fade-up text-sm font-medium border border-white/20">
          <CheckCircle2 size={18} className="text-green-300" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Flipkart Style Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#878787] mb-3 font-medium">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#2874f0]">My Account</span>
          {activeTab !== 'profile' && (
            <>
              <ChevronRight size={12} />
              <span className="capitalize text-gray-700 font-semibold">
                {activeTab.replace('_', ' ')}
              </span>
            </>
          )}
        </div>

        {/* 2-Column Flipkart Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          
          {/* ======================================================== */}
          {/* LEFT SIDEBAR (Flipkart User Profile Navigation Panel) */}
          {/* ======================================================== */}
          <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-3">
            
            {/* User Profile Card Header */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-200/80 p-3 sm:p-4 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#2874f0] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-[#878787] font-medium leading-none mb-1">Hello,</p>
                <h3 className="text-sm sm:text-base font-bold text-[#212121] truncate">
                  {currentUser.name || 'Flipkart Customer'}
                </h3>
              </div>
            </div>

            {/* Mobile Tab Navigation Bar (Horizontal Scroll on Mobile) */}
            <div className="lg:hidden bg-white rounded-sm shadow-sm border border-gray-200/80 p-2 overflow-x-auto flex gap-2 no-scrollbar">
              {[
                { id: 'tags', label: `My Tags (${userTags.length})`, icon: <QrCode size={15} /> },
                { id: 'orders', label: 'My Orders', icon: <Package size={15} /> },
                { id: 'profile', label: 'Profile Info', icon: <User size={15} /> },
                { id: 'addresses', label: 'Addresses', icon: <MapPin size={15} /> },
                { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === m.id
                      ? 'bg-[#2874f0] text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Flipkart Navigation Menu Box (Desktop) */}
            <div className="hidden lg:block bg-white rounded-sm shadow-sm border border-gray-200/80 divide-y divide-gray-100 text-[13px]">
              
              {/* SECTION 1: MY ORDERS */}
              <div className="p-3">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between font-bold px-3 py-2.5 rounded-sm transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-[#f5faff] text-[#2874f0]'
                      : 'text-[#878787] hover:text-[#2874f0] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package size={18} className="text-[#2874f0]" />
                    <span className="uppercase text-xs tracking-wider">MY ORDERS</span>
                  </div>
                  <ChevronRight size={14} className={activeTab === 'orders' ? 'text-[#2874f0]' : 'text-gray-400'} />
                </button>
              </div>

              {/* SECTION 2: MY VEHICLE TAGS (SafeDrive Exclusive in Flipkart Style) */}
              <div className="p-3">
                <div className="flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#878787]">
                  <QrCode size={18} className="text-[#2874f0]" />
                  <span>VEHICLE TAGS & SAFETY</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  <button
                    onClick={() => setActiveTab('tags')}
                    className={`w-full flex items-center justify-between text-left px-9 py-2 rounded-sm transition-colors text-[13px] ${
                      activeTab === 'tags'
                        ? 'text-[#2874f0] font-bold bg-[#f5faff]'
                        : 'text-[#212121] hover:bg-gray-50 hover:text-[#2874f0]'
                    }`}
                  >
                    <span>My SafeDrive Tags</span>
                    <span className="text-[11px] px-1.5 py-0.2 bg-blue-100 text-[#2874f0] font-bold rounded">
                      {userTags.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('logs')}
                    className={`w-full text-left px-9 py-2 rounded-sm transition-colors text-[13px] ${
                      activeTab === 'logs'
                        ? 'text-[#2874f0] font-bold bg-[#f5faff]'
                        : 'text-[#212121] hover:bg-gray-50 hover:text-[#2874f0]'
                    }`}
                  >
                    Scan & SOS Activity Logs
                  </button>
                </div>
              </div>

              {/* SECTION 3: ACCOUNT SETTINGS */}
              <div className="p-3">
                <div className="flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#878787]">
                  <User size={18} className="text-[#2874f0]" />
                  <span>ACCOUNT SETTINGS</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-9 py-2 rounded-sm transition-colors text-[13px] ${
                      activeTab === 'profile'
                        ? 'text-[#2874f0] font-bold bg-[#f5faff]'
                        : 'text-[#212121] hover:bg-gray-50 hover:text-[#2874f0]'
                    }`}
                  >
                    Profile Information
                  </button>

                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full text-left px-9 py-2 rounded-sm transition-colors text-[13px] ${
                      activeTab === 'addresses'
                        ? 'text-[#2874f0] font-bold bg-[#f5faff]'
                        : 'text-[#212121] hover:bg-gray-50 hover:text-[#2874f0]'
                    }`}
                  >
                    Manage Addresses
                  </button>

                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full text-left px-9 py-2 rounded-sm transition-colors text-[13px] ${
                      activeTab === 'notifications'
                        ? 'text-[#2874f0] font-bold bg-[#f5faff]'
                        : 'text-[#212121] hover:bg-gray-50 hover:text-[#2874f0]'
                    }`}
                  >
                    All Notifications
                  </button>
                </div>
              </div>

              {/* LOGOUT BUTTON */}
              <div className="p-3">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-[#878787] hover:text-[#e53935] hover:bg-red-50 transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  <LogOut size={18} className="text-[#2874f0]" />
                  <span>LOGOUT</span>
                </button>
              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT MAIN CONTENT AREA */}
          {/* ======================================================== */}
          <div className="flex-1 w-full bg-white rounded-sm shadow-sm border border-gray-200/80 p-4 sm:p-7 min-h-[580px]">
            
            {/* ---------------------------------------------------- */}
            {/* TAB 1: MY SAFEDRIVE TAGS */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'tags' && (
              <div className="space-y-6">
                
                {/* Header with Title and Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg sm:text-xl font-bold text-[#212121]">
                        My SafeDrive Tags
                      </h2>
                      <span className="text-xs bg-blue-50 text-[#2874f0] border border-blue-200 px-2 py-0.5 rounded font-bold">
                        {userTags.length} Registered
                      </span>
                    </div>
                    <p className="text-xs text-[#878787] mt-0.5">
                      Manage call masking, SOS contacts, and instant scan alerts for your registered vehicles
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setIsLinkModalOpen(true)}
                      className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-sm text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Plus size={15} /> + LINK NEW TAG
                    </button>
                    <Link
                      to="/shop"
                      className="bg-[#fb641b] hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-sm text-xs flex items-center gap-1.5 shadow-sm transition-all"
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
                    <p className="text-xl font-bold text-green-600 mt-0.5">{activeTagsCount || (userTags.length > 0 ? userTags.length : 0)}</p>
                    <span className="text-[10px] text-gray-500 font-medium">100% Number Masked</span>
                  </div>
                </div>

                {/* Tags List */}
                {isLoadingDashboard ? (
                  <div className="py-10 space-y-4 animate-fade-in text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-2xl bg-orange-500/20 animate-ping" />
                      <div className="relative w-16 h-16 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <Shield className="w-8 h-8 text-white animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-800">
                      Loading Your SafeDrive Account...
                    </h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      Fetching your registered vehicle tags, allocated QR codes, and live calling quota balances.
                    </p>

                    {/* Shimmer Skeletons */}
                    <div className="space-y-3.5 pt-4 text-left">
                      {[1, 2].map((n) => (
                        <div key={n} className="p-4 sm:p-5 rounded border border-gray-200 bg-gray-50/70 animate-pulse space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                            <div className="h-5 bg-gray-200 rounded w-32" />
                            <div className="h-5 bg-gray-200 rounded w-24" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                            <div className="h-10 bg-gray-200 rounded" />
                            <div className="h-10 bg-gray-200 rounded" />
                            <div className="h-10 bg-gray-200 rounded" />
                          </div>
                          <div className="h-9 bg-gray-200 rounded w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : userTags.length === 0 ? (
                  <div className="py-14 text-center border border-dashed border-gray-300 rounded-sm bg-gray-50/50">
                    <div className="w-16 h-16 bg-blue-50 text-[#2874f0] rounded-full flex items-center justify-center mx-auto mb-3">
                      <QrCode size={30} />
                    </div>
                    <h3 className="text-base font-bold text-[#212121]">No Vehicle Tags Linked Yet</h3>
                    <p className="text-xs text-[#878787] max-w-sm mx-auto mt-1 mb-5">
                      Link your SafeDrive QR sticker to start receiving private alerts without sharing your personal number.
                    </p>
                    <button
                      onClick={() => setIsLinkModalOpen(true)}
                      className="bg-[#2874f0] text-white text-xs font-bold px-6 py-2.5 rounded-sm shadow-sm cursor-pointer"
                    >
                      + LINK FIRST TAG
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userTags.map((tag) => {
                      const isUnlinked = tag.status === 'unregistered' || !tag.vehicleNumber || tag.vehicleNumber.includes('Unlinked') || tag.vehicleNumber.includes('Ready');
                      const isActive = tag.status === 'active' && !isUnlinked;
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
                                isUnlinked
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : isActive 
                                    ? 'bg-green-50 text-green-700 border border-green-200' 
                                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                              }`}>
                                <span className={`w-2 h-2 rounded-full ${isUnlinked ? 'bg-amber-500' : isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                                {isUnlinked ? 'Ready to Link' : isActive ? 'Active Protection' : 'Paused'}
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
                                
                                {isUnlinked ? (
                                  <div className="mt-1">
                                    <p className="text-xs text-amber-700 font-semibold mb-1">
                                      No vehicle linked yet
                                    </p>
                                    <Link
                                      to={`/register/${tag.publicToken || tag.id}`}
                                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 rounded text-xs inline-flex items-center gap-1 shadow-2xs"
                                    >
                                      🔗 Link Vehicle Now
                                    </Link>
                                  </div>
                                ) : (
                                  <p className="font-mono text-sm font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-300 tracking-wider uppercase inline-block mt-1">
                                    {tag.vehicleNumber}
                                  </p>
                                )}

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
                                <span className="font-bold text-gray-800">+91 {tag.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={12} className="text-green-600" />
                                <span className="text-gray-500 font-medium">Emergency SOS:</span>
                                <span className="font-bold text-gray-800">+91 {tag.emergencyContact || tag.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MessageCircle size={12} className="text-emerald-600" />
                                <span className="text-gray-500 font-medium">WhatsApp Alerts:</span>
                                <span className="font-bold text-gray-800">+91 {tag.whatsapp || tag.phone}</span>
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
                            <div className="flex items-center gap-4">
                              <div>
                                <span className="text-gray-500 font-semibold text-[11px]">Calls Balance:</span>
                                <div className="font-black text-[#2874f0] text-sm flex items-center gap-1">
                                  <Phone size={12} /> {tag.callBalance ?? 10} Left
                                </div>
                              </div>
                              <div className="border-l border-blue-200 pl-4">
                                <span className="text-gray-500 font-semibold text-[11px]">WhatsApp / SMS:</span>
                                <div className="font-black text-emerald-600 text-sm flex items-center gap-1">
                                  <MessageCircle size={12} /> {tag.messageBalance ?? 20} Left
                                </div>
                              </div>
                              <div className="border-l border-blue-200 pl-4">
                                <span className="text-gray-500 font-semibold text-[11px]">Validity Expiry:</span>
                                <div className="font-bold text-gray-800 text-xs">
                                  {tag.expiryDate ? new Date(tag.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '1 Year Active'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleBuyBoosterQuota(tag.id, 'CALL', 50, 99)}
                                className="bg-white hover:bg-blue-50 text-[#2874f0] border border-[#2874f0] px-3 py-1.5 rounded-sm font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                              >
                                <Zap size={12} className="text-orange-500" /> +50 Calls (₹99)
                              </button>
                              <button
                                onClick={() => handleRenewValidity(tag.id)}
                                className="bg-[#2874f0] hover:bg-blue-700 text-white px-3 py-1.5 rounded-sm font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                              >
                                <RefreshCw size={12} /> Renew 1-Yr (₹199)
                              </button>
                            </div>
                          </div>

                          {/* Bottom Row: Actions Bar */}
                          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setQrModalTag(tag)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <QrCode size={13} /> View QR Badge
                              </button>

                              <button
                                onClick={() => printDigitalPdfInColor({ title: tag.vehicleName, publicToken: tag.publicToken || tag.id, vehicleNumber: tag.vehicleNumber })}
                                className="bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Printer size={13} /> Print Color Badge
                              </button>

                              <button
                                onClick={() => handleToggleStatus(tag.id, tag.status)}
                                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                                  isActive
                                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                                }`}
                              >
                                {isActive ? 'Pause Protection' : 'Activate Protection'}
                              </button>

                              <button
                                onClick={() => setEditingTag(tag)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Edit3 size={13} /> Edit
                              </button>

                              <button
                                onClick={() => handleDeleteTag(tag.id)}
                                className="text-red-500 hover:bg-red-50 p-1.5 rounded text-xs transition-colors cursor-pointer"
                                title="Unlink Tag"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <Link
                              to={`/q/${tag.id}`}
                              target="_blank"
                              className="text-xs font-bold text-[#2874f0] hover:underline flex items-center gap-1"
                            >
                              <Eye size={13} /> Test Public QR Scan Page <ExternalLink size={11} />
                            </Link>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 2: PROFILE INFORMATION (Pure Flipkart Design) */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                
                {/* 1. Personal Information */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-[#212121]">Personal Information</h3>
                      {!isEditingPersonal && (
                        <button
                          onClick={() => setIsEditingPersonal(true)}
                          className="text-[#2874f0] text-xs font-bold hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mb-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">First Name</label>
                        <input
                          type="text"
                          disabled={!isEditingPersonal}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={`w-full border rounded-sm px-3 py-2 text-sm outline-none transition-all ${
                            isEditingPersonal
                              ? 'border-[#2874f0] bg-white text-black'
                              : 'border-gray-200 bg-gray-50 text-gray-700'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                        <input
                          type="text"
                          disabled={!isEditingPersonal}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={`w-full border rounded-sm px-3 py-2 text-sm outline-none transition-all ${
                            isEditingPersonal
                              ? 'border-[#2874f0] bg-white text-black'
                              : 'border-gray-200 bg-gray-50 text-gray-700'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs text-gray-500 mb-2">Your Gender</label>
                      <div className="flex items-center gap-6 text-sm text-gray-800">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            disabled={!isEditingPersonal}
                            checked={gender === 'Male'}
                            onChange={(e) => setGender(e.target.value)}
                            className="accent-[#2874f0]"
                          />
                          <span>Male</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            disabled={!isEditingPersonal}
                            checked={gender === 'Female'}
                            onChange={(e) => setGender(e.target.value)}
                            className="accent-[#2874f0]"
                          />
                          <span>Female</span>
                        </label>
                      </div>
                    </div>

                    {isEditingPersonal && (
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="bg-[#2874f0] text-white px-6 py-2 rounded-sm text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          SAVE
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingPersonal(false)}
                          className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-3 py-2 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                {/* 2. Email Address Section */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-[#212121]">Email Address</h3>
                      {!isEditingEmail && (
                        <button
                          onClick={() => setIsEditingEmail(true)}
                          className="text-[#2874f0] text-xs font-bold hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-w-md">
                    <div className="flex items-center gap-3">
                      <input
                        type="email"
                        disabled={!isEditingEmail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full border rounded-sm px-3 py-2 text-sm outline-none transition-all ${
                          isEditingEmail
                            ? 'border-[#2874f0] bg-white text-black'
                            : 'border-gray-200 bg-gray-50 text-gray-700'
                        }`}
                      />
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-bold whitespace-nowrap">
                        <ShieldCheck size={14} /> Verified
                      </span>
                    </div>

                    {isEditingEmail && (
                      <div className="flex items-center gap-3 pt-3">
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          className="bg-[#2874f0] text-white px-6 py-2 rounded-sm text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          SAVE
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingEmail(false)}
                          className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-3 py-2 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Mobile Number Section */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-[#212121]">Mobile Number</h3>
                      {!isEditingPhone && (
                        <button
                          onClick={() => setIsEditingPhone(true)}
                          className="text-[#2874f0] text-xs font-bold hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-w-md">
                    <div className="flex items-center gap-3">
                      <div className="relative w-full">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">+91</span>
                        <input
                          type="tel"
                          disabled={!isEditingPhone}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          className={`w-full border rounded-sm pl-11 pr-3 py-2 text-sm outline-none transition-all ${
                            isEditingPhone
                              ? 'border-[#2874f0] bg-white text-black'
                              : 'border-gray-200 bg-gray-50 text-gray-700'
                          }`}
                        />
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-bold whitespace-nowrap">
                        <ShieldCheck size={14} /> Primary Login
                      </span>
                    </div>

                    {isEditingPhone && (
                      <div className="flex items-center gap-3 pt-3">
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          className="bg-[#2874f0] text-white px-6 py-2 rounded-sm text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          SAVE
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingPhone(false)}
                          className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-3 py-2 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Flipkart Account FAQs */}
                <div className="pt-8 border-t border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-[#212121] uppercase tracking-wider">FAQS</h4>
                  
                  {[
                    {
                      q: 'What happens when I update my email address (or mobile number)?',
                      a: 'Your login ID changes to the updated mobile number. All scan alerts, invoice receipts, and vehicle emergency notifications will be routed to your new number immediately.'
                    },
                    {
                      q: 'What is SafeDrive Call Masking and how does it protect my privacy?',
                      a: 'When anyone scans your vehicle QR sticker, they can speak to you via our automated privacy bridge. Neither caller nor owner can see each other’s phone numbers, ensuring zero spam or harassment.'
                    },
                    {
                      q: 'What happens to my linked vehicle tags if I update my details?',
                      a: 'All existing active tags remain linked to your account. Your primary contact number for emergency alerts updates automatically across all QR badges.'
                    }
                  ].map((faq, idx) => (
                    <div key={idx} className="border border-gray-200/80 rounded-sm p-3.5 bg-gray-50/50">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-[#212121] hover:text-[#2874f0] cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${expandedFaq === idx ? 'rotate-180 text-[#2874f0]' : 'text-gray-400'}`} />
                      </button>
                      {expandedFaq === idx && (
                        <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200/60 leading-relaxed">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* 5. Deactivate Account Option */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to deactivate your SafeDriveTag account?')) {
                          logout();
                        }
                      }}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Deactivate Account
                    </button>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      This will unlink all tags and pause emergency alert forwarding.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 3: MY ORDERS (Pure Flipkart Design) */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                
                {/* Search orders input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search your orders here"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-sm text-xs sm:text-sm outline-none focus:border-[#2874f0]"
                    />
                  </div>
                  <button className="bg-[#2874f0] text-white px-5 py-2.5 rounded-sm font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-blue-700 cursor-pointer">
                    <Search size={14} /> Search Orders
                  </button>
                </div>

                {/* Filter tags */}
                <div className="flex items-center gap-2 text-xs border-b border-gray-200 pb-3">
                  <span className="text-gray-400 font-semibold uppercase text-[11px]">Filters:</span>
                  {['all', 'Delivered', 'In Transit', 'Cancelled'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer ${
                        orderFilter === f
                          ? 'bg-[#2874f0] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Order Cards */}
                <div className="space-y-3.5">
                  {isLoadingDashboard ? (
                    <div className="py-10 space-y-4 animate-fade-in text-center">
                      <div className="relative w-14 h-14 mx-auto mb-3">
                        <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-ping" />
                        <div className="relative w-14 h-14 bg-gradient-to-tr from-[#2874f0] to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                          <Package className="w-7 h-7 text-white animate-bounce" />
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-gray-800">
                        Syncing Your Orders & Allocated QR Kits...
                      </h3>
                      <p className="text-xs text-gray-500 max-w-md mx-auto">
                        Please wait while we retrieve your recent purchases, allocated tags, and tax invoices from the server.
                      </p>

                      {/* Order Shimmer Skeletons */}
                      <div className="space-y-3 pt-3 text-left">
                        {[1, 2].map((n) => (
                          <div key={n} className="p-4 sm:p-5 rounded border border-gray-200 bg-gray-50/70 animate-pulse flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1 w-full">
                              <div className="w-16 h-16 bg-gray-200 rounded shrink-0" />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-2/3" />
                                <div className="h-3 bg-gray-200 rounded w-1/3" />
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                              </div>
                            </div>
                            <div className="h-8 bg-gray-200 rounded w-28 hidden md:block" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-14 text-center border border-dashed border-gray-300 rounded-sm bg-gray-50/50">
                      <div className="w-16 h-16 bg-blue-50 text-[#2874f0] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Package size={30} />
                      </div>
                      <h4 className="font-bold text-base text-[#212121]">No Orders Found</h4>
                      <p className="text-xs text-[#878787] max-w-sm mx-auto mt-1 mb-5">
                        You have not placed any orders yet. Choose your smart QR safety kit from our official store.
                      </p>
                      <Link
                        to="/shop"
                        className="bg-[#2874f0] text-white text-xs font-bold px-6 py-2.5 rounded-sm shadow-sm"
                      >
                        BROWSE SAFETY KITS
                      </Link>
                    </div>
                  ) : (
                    orders
                      .filter(o => orderFilter === 'all' || o.status === orderFilter)
                      .filter(o => !orderSearchQuery || o.title.toLowerCase().includes(orderSearchQuery.toLowerCase()))
                      .map((order) => (
                        <div
                          key={order.id}
                          className="bg-white rounded-sm border border-gray-200 hover:border-gray-300 transition-all p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                        >
                          {/* Product Info */}
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
                              <img src={order.image} alt={order.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-[#212121] hover:text-[#2874f0] cursor-pointer">
                                {order.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5 font-mono">Order ID: {order.id}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-xs text-gray-500 font-medium">Type:</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  order.qrType === 'DIGITAL'
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }`}>
                                  {order.qrType === 'DIGITAL' ? '⚡ Digital E-Kit' : '📦 Physical QR Kit'}
                                </span>
                              </div>
                              <p className="text-sm font-bold text-[#212121] mt-1">₹{order.price}</p>
                            </div>
                          </div>

                          {/* Status Column */}
                          <div className="md:w-60">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
                              <span className="font-bold text-xs sm:text-sm text-[#212121]">{order.statusDate}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1 pl-4.5">{order.statusDesc}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex md:flex-col gap-2 w-full md:w-auto">
                            <button
                              onClick={() => downloadInvoicePdf(order, currentUser)}
                              className="flex-1 md:flex-none border border-[#2874f0] text-[#2874f0] hover:bg-blue-50 px-3 py-1.5 rounded-sm text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                              title="Direct 1-Click PDF Download"
                            >
                              <Download size={13} /> Invoice
                            </button>

                            <button
                              onClick={() => openDigitalPdf(order)}
                              className="flex-1 md:flex-none bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-sm text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              title="Open Digital QR Kit PDF"
                            >
                              <Eye size={13} /> Open PDF
                            </button>

                            <button
                              onClick={() => printDigitalPdfInColor(order)}
                              className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-sm text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                              title="Print High-Resolution Color PDF Badges"
                            >
                              <Printer size={13} /> Print Color PDF
                            </button>
                          </div>

                          {/* Allocated QR Copies (Live Generated from Order) */}
                          {Array.isArray(order.allocatedQRIds) && order.allocatedQRIds.length > 0 && (
                            <div className="w-full mt-4 pt-4 border-t border-gray-100 bg-gray-50/70 rounded-lg p-3.5 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                                  <QrCode size={15} className="text-[#2874f0]" />
                                  <span>Allocated QR Tags ({order.allocatedQRIds.length} Copies Included)</span>
                                </div>
                                <span className="text-[11px] font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full border border-green-200">
                                  Ready to Activate & Use
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {order.allocatedQRIds.map((qrItem, qIdx) => {
                                  const liveQrUrl = `https://safedrivetag-website.vercel.app/q/${qrItem.publicToken || qrItem.copyCode}`;
                                  return (
                                    <div key={qIdx} className="bg-white border border-gray-200 rounded-lg p-3.5 flex flex-col justify-between gap-3 shadow-xs hover:border-[#2874f0] transition-colors">
                                      
                                      {/* Top Header */}
                                      <div className="flex items-center justify-between">
                                        <span className="font-mono font-bold text-xs bg-blue-50 text-[#2874f0] px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                                          <QrCode size={12} /> {qrItem.copyCode || `COPY-${qIdx + 1}`}
                                        </span>
                                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 uppercase">
                                          {qrItem.qrType || 'DIGITAL'}
                                        </span>
                                      </div>

                                      {/* Live Scannable QR Code Box */}
                                      <div className="flex items-center gap-3 bg-gray-50/90 p-2.5 rounded-lg border border-gray-200/80">
                                        <div className="bg-white p-1 rounded border border-gray-200 shadow-2xs shrink-0">
                                          <QRCodeSVG 
                                            value={liveQrUrl}
                                            size={76}
                                            level="H"
                                            includeMargin={false}
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                          <p className="text-[11px] font-bold text-gray-800 flex items-center gap-1">
                                            <span>Scan with Camera</span>
                                          </p>
                                          <p className="text-[10px] text-gray-500 font-mono truncate mt-0.5" title={qrItem.publicToken}>
                                            {qrItem.publicToken ? `${qrItem.publicToken.slice(0, 14)}...` : 'Token Active'}
                                          </p>
                                          <span className="inline-block text-[9px] font-bold text-green-700 bg-green-100 px-1.5 py-0.2 rounded mt-1">
                                            ✓ Active Scannable
                                          </span>
                                        </div>
                                      </div>

                                      {/* Actions */}
                                      <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
                                        <Link
                                          to={`/register/${qrItem.publicToken || qrItem.copyCode}`}
                                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-colors text-center shadow-2xs"
                                        >
                                          Activate Tag
                                        </Link>
                                        <Link
                                          to={`/q/${qrItem.publicToken || qrItem.copyCode}`}
                                          target="_blank"
                                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-colors text-center"
                                        >
                                          <Eye size={12} /> Test QR
                                        </Link>
                                        <button
                                          onClick={() => printDigitalPdfInColor({ title: `${order.title} (${qrItem.copyCode})`, copyCode: qrItem.copyCode, publicToken: qrItem.publicToken || qrItem.copyCode, image: order.image })}
                                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-2.5 py-1.5 rounded text-xs flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                          title="Print Color Badge for this Copy"
                                        >
                                          <Printer size={13} />
                                        </button>
                                      </div>

                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        </div>
                      ))
                  )}
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 4: MANAGE ADDRESSES (Pure Flipkart Design) */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                
                {/* Header with Title */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h3 className="text-base font-bold text-[#212121]">Manage Addresses</h3>
                </div>

                {/* + ADD A NEW ADDRESS Button / Form */}
                {!showAddAddress ? (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="w-full border border-dashed border-[#2874f0] bg-[#f5faff] hover:bg-blue-50 text-[#2874f0] font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-sm flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Plus size={16} /> + ADD A NEW ADDRESS
                  </button>
                ) : (
                  <div className="border border-blue-200 bg-[#f5faff] rounded-sm p-4 sm:p-6 animate-fade-up">
                    <h4 className="text-xs font-bold text-[#2874f0] uppercase tracking-wider mb-4">
                      ADD A NEW DELIVERY ADDRESS
                    </h4>
                    <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">10-digit mobile number *</label>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            placeholder="e.g. 9876543210"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value.replace(/\D/g, '') })}
                            className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">Pincode *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 110001"
                            value={newAddress.pincode}
                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">Locality *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Connaught Place"
                            value={newAddress.locality}
                            onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-600 font-semibold mb-1">Address (Area and Street) *</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="House No., Building Name, Street"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">City / District / Town *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. New Delhi"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">State *</label>
                          <select
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
                          >
                            <option value="Delhi">Delhi</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Rajasthan">Rajasthan</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-600 font-semibold mb-1.5">Address Type</label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                            <input
                              type="radio"
                              name="addrType"
                              value="HOME"
                              checked={newAddress.type === 'HOME'}
                              onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                              className="accent-[#2874f0]"
                            />
                            <span>Home (All day delivery)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                            <input
                              type="radio"
                              name="addrType"
                              value="WORK"
                              checked={newAddress.type === 'WORK'}
                              onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                              className="accent-[#2874f0]"
                            />
                            <span>Work (Delivery between 10 AM - 5 PM)</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3">
                        <button
                          type="submit"
                          className="bg-[#fb641b] text-white px-7 py-2.5 rounded-sm font-bold text-xs shadow-sm hover:bg-orange-600 transition-colors cursor-pointer uppercase"
                        >
                          SAVE ADDRESS
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddAddress(false)}
                          className="text-gray-500 font-bold hover:text-gray-800 px-4 py-2 cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>

                    </form>
                  </div>
                )}

                {/* Addresses List */}
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white rounded-sm border border-gray-200 p-4 sm:p-5 relative hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase">
                            {addr.type}
                          </span>
                          <span className="font-bold text-sm text-[#212121]">{addr.name}</span>
                          <span className="font-bold text-xs text-gray-700">{addr.phone}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold p-1 rounded cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed pr-8">
                        {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-bold text-black">{addr.pincode}</span>
                      </p>
                      {addr.landmark && (
                        <p className="text-[11px] text-gray-400 mt-1">Landmark: {addr.landmark}</p>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB: SCAN & SOS ACTIVITY LOGS */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'logs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-bold text-[#212121]">Scan & SOS Activity Logs</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Real-time log of scans and call bridge connections</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'l-1',
                      tagId: 'SD-84920',
                      vehicle: 'Hyundai Creta (DL 01 AB 1234)',
                      event: 'QR Sticker Scanned',
                      location: 'Near CP Inner Circle, New Delhi',
                      time: 'Today, 02:45 PM',
                      status: 'Alert Forwarded via WhatsApp',
                      statusColor: 'text-green-600 bg-green-50 border-green-200'
                    },
                    {
                      id: 'l-2',
                      tagId: 'SD-84920',
                      vehicle: 'Hyundai Creta (DL 01 AB 1234)',
                      event: 'Masked Call Bridge Connected',
                      location: 'Parking Bay 4',
                      time: 'Yesterday, 07:15 PM',
                      status: 'Completed (Duration 42s)',
                      statusColor: 'text-blue-600 bg-blue-50 border-blue-200'
                    },
                    {
                      id: 'l-3',
                      tagId: 'SD-19384',
                      vehicle: 'Royal Enfield Classic 350',
                      event: 'System Health Check & Tag Verification',
                      location: 'System Online',
                      time: 'Feb 15, 2025, 10:00 AM',
                      status: 'Protected',
                      statusColor: 'text-gray-700 bg-gray-100 border-gray-200'
                    }
                  ].map((log) => (
                    <div
                      key={log.id}
                      className="border border-gray-200 rounded-sm p-4 hover:border-gray-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded bg-blue-50 text-[#2874f0] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bell size={15} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold bg-gray-100 px-1.5 py-0.2 rounded text-gray-700">
                              {log.tagId}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-[#212121]">{log.event}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{log.vehicle} • {log.location}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{log.time}</p>
                        </div>
                      </div>

                      <span className={`text-xs font-bold px-2.5 py-1 rounded border self-start sm:self-auto ${log.statusColor}`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB: ALL NOTIFICATIONS */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-base font-bold text-[#212121]">All Notifications</h3>
                </div>

                <div className="py-12 text-center text-gray-400 text-xs">
                  You are all caught up! No unread notifications.
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: LINK NEW TAG (Flipkart Styled) */}
      {/* ======================================================== */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-sm max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-[#2874f0] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={20} />
                <h3 className="text-base font-bold">Link New SafeDrive Tag</h3>
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
      {/* MODAL 2: EDIT TAG DETAILS (Flipkart Styled) */}
      {/* ======================================================== */}
      {editingTag && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-sm max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden">
            
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
                  <label className="block text-gray-700 font-bold uppercase mb-1">Plate Number</label>
                  <input
                    type="text"
                    required
                    value={editingTag.vehicleNumber}
                    onChange={(e) => setEditingTag({ ...editingTag, vehicleNumber: e.target.value.toUpperCase() })}
                    className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2 text-sm font-mono font-bold outline-none uppercase"
                  />
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
              <div className="p-4 bg-white border border-gray-200 inline-block mx-auto mb-4 rounded-lg shadow-sm">
                <QRCodeSVG 
                  value={`https://safedrivetag-website.vercel.app/q/${qrModalTag.publicToken || qrModalTag.id}`}
                  size={170}
                  level="H"
                  includeMargin={false}
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
                <button
                  onClick={() => printDigitalPdfInColor(qrModalTag)}
                  className="w-full bg-[#fb641b] hover:bg-orange-600 text-white font-bold py-2.5 rounded-sm text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Printer size={15} /> Print Color Stickers (PDF)
                </button>
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

    </div>
  );
}
