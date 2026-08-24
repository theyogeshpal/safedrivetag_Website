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
  Printer,
  Smartphone,
  Share2,
  Sparkles
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
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [digitalPdfModalOrder, setDigitalPdfModalOrder] = useState(null);
  const [activeCopyIndex, setActiveCopyIndex] = useState(0);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  // PWA App Installation State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsPwaInstalled(true);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsPwaInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowPwaModal(true);
    }
  };

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
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addresses, setAddresses] = useState(() => {
    try {
      const userId = currentUser?._id || currentUser?.id || currentUser?.phone || 'guest';
      const saved = localStorage.getItem(`safedrive_addresses_${userId}`);
      if (saved) return JSON.parse(saved);
      if (currentUser?.deliveryAddress || currentUser?.address) {
        return [{
          id: 'addr-1',
          name: currentUser.name || 'Customer',
          phone: currentUser.phone || '',
          pincode: currentUser.pincode || '',
          locality: '',
          address: currentUser.deliveryAddress || currentUser.address,
          city: currentUser.city || '',
          state: currentUser.state || 'Delhi',
          landmark: '',
          type: 'HOME',
          isDefault: true,
        }];
      }
    } catch (e) {
      console.error('Error reading saved addresses', e);
    }
    return [];
  });
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
  const loadDashboardData = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoadingDashboard(true);
    }
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

            let resolvedStatus = 'In Transit';
            if (ord.orderStatus === 'DELIVERED') {
              resolvedStatus = 'Delivered';
            } else if (ord.orderStatus === 'CANCELLED' || ord.status === 'CANCELLED') {
              resolvedStatus = 'Cancelled';
            } else if (isDigital && (ord.paymentStatus === 'PAID' || ord.status === 'PAID')) {
              resolvedStatus = 'Delivered';
            } else {
              resolvedStatus = 'In Transit';
            }

            return {
              id: ord.orderNumber || ord._id || `ORD-${idx + 1}`,
              title: ord.productName || ord.items?.[0]?.title || ord.items?.[0]?.name || ord.productId?.title || ord.productId?.name || (isDigital ? 'Digital Kit' : 'SafeDrive Car Safety QR Protection Kit'),
              image: ord.productId?.imageUrl || ord.items?.[0]?.imageUrl || ord.imageUrl || 'https://res.cloudinary.com/dofqiruh7/image/upload/v1787403231/safedrive/products/wf5u8xfkhdfa1v2ndajx.jpg',
              price: ord.amount || ord.totalAmount || 299,
              date: ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
              status: resolvedStatus,
              statusDate: resolvedStatus === 'Delivered' 
                ? (isDigital ? 'Instant Digital Pass' : (ord.deliveredAt ? `Delivered on ${new Date(ord.deliveredAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}` : `Delivered`))
                : resolvedStatus === 'Cancelled'
                  ? 'Cancelled'
                  : `In Transit • Expected in 2-3 Days`,
              statusDesc: isDigital 
                ? 'Instant Digital Kit - Ready to Print & Use' 
                : (ord.deliveryAddress ? `Courier Shipping to: ${ord.deliveryAddress}` : 'Express Courier Dispatch in progress'),
              vehicleType: isDigital ? 'Digital E-Kit' : 'Physical QR Kit',
              qrType: isDigital ? 'DIGITAL' : 'PHYSICAL',
              publicToken: resolvedToken,
              allocatedQRIds: ord.allocatedQRIds || [],
              rating: 5,
            };
          });
          setOrders(mappedOrders);

          // Extract purchase delivery address from user orders (the address entered during checkout)
          const orderWithAddress = ordersRes.orders.find(o => o.deliveryAddress || o.shippingAddress || o.address);
          if (orderWithAddress) {
            const purchaseAddrText = orderWithAddress.deliveryAddress || orderWithAddress.shippingAddress || orderWithAddress.address;
            const purchaseName = orderWithAddress.name || orderWithAddress.customerName || currentUser?.name || 'Customer';
            const purchasePhone = orderWithAddress.phone || orderWithAddress.customerPhone || currentUser?.phone || '';
            const purchasePincode = orderWithAddress.pincode || (purchaseAddrText.match(/\b\d{6}\b/) ? purchaseAddrText.match(/\b\d{6}\b/)[0] : '');
            const purchaseCity = orderWithAddress.city || '';
            const purchaseState = orderWithAddress.state || 'Delhi';

            const orderAddrObj = {
              id: `addr-order-${orderWithAddress._id || orderWithAddress.orderNumber || '1'}`,
              name: purchaseName,
              phone: purchasePhone,
              pincode: purchasePincode,
              locality: '',
              address: purchaseAddrText,
              city: purchaseCity,
              state: purchaseState,
              landmark: '',
              type: 'HOME',
              isDefault: true,
            };

            setAddresses([orderAddrObj]);
            try {
              const userId = currentUser?._id || currentUser?.id || currentUser?.phone || 'guest';
              localStorage.setItem(`safedrive_addresses_${userId}`, JSON.stringify([orderAddrObj]));
            } catch (e) {
              console.error(e);
            }
          }

          // Load locally registered tags cache
          let locallyRegistered = {};
          try {
            locallyRegistered = JSON.parse(localStorage.getItem('safedrive_registered_tags') || '{}');
          } catch (e) {
            console.error('Error reading registered tags cache', e);
          }

          // Extract all allocated QR copies from orders
          const rawAllocated = [];
          ordersRes.orders.forEach((ord) => {
            if (Array.isArray(ord.allocatedQRIds) && ord.allocatedQRIds.length > 0) {
              ord.allocatedQRIds.forEach((qr, qIdx) => {
                const token = qr.publicToken || qr.copyCode || qr._id;
                const copyCode = qr.copyCode || `COPY-${qIdx + 1}`;
                const regInfo = locallyRegistered[token] || 
                                locallyRegistered[copyCode] || 
                                locallyRegistered[qr.copyCode] || 
                                locallyRegistered[qr._id];

                const isPhysical = ord.productName?.toLowerCase().includes('physical') || 
                                   ord.title?.toLowerCase().includes('physical') || 
                                   ord.productType === 'PHYSICAL' || 
                                   qr.qrType === 'PHYSICAL' ||
                                   copyCode?.startsWith('PHY') || 
                                   token?.startsWith('PHY');

                const resolvedQrType = isPhysical ? 'PHYSICAL' : (qr.qrType || ord.productType || 'DIGITAL');
                const hasVehicle = !!(regInfo?.vehicleNumber || qr.vehicleNumber);

                rawAllocated.push({
                  id: copyCode,
                  publicToken: token,
                  copyCode: copyCode,
                  productId: qr.productId || ord.productName || 'SafeDrive Smart Tag',
                  name: regInfo?.name || ord.customerName || currentUser?.name || 'Owner',
                  phone: regInfo?.phone || ord.customerPhone || currentUser?.phone,
                  emergencyContact: regInfo?.emergencyContacts?.[0]?.number || null,
                  emergencyContacts: regInfo?.emergencyContacts || [],
                  whatsapp: regInfo?.whatsappNumber || ord.customerPhone || currentUser?.phone,
                  vehicleNumber: regInfo?.vehicleNumber || qr.vehicleNumber || null,
                  vehicleName: regInfo ? `${regInfo.vehicleBrand || ''} ${regInfo.vehicleName || ''}`.trim() : `${ord.productName || 'SafeDrive Smart Tag'} (Copy ${qIdx + 1})`,
                  vehicleType: regInfo?.vehicleType || qr.qrFor || 'Car',
                  status: hasVehicle ? 'active' : (qr.status === 'ACTIVE' ? 'active' : 'unregistered'),
                  qrType: resolvedQrType,
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

          // Fetch Live Public QR API Data in Parallel for each token
          const liveQrResults = await Promise.allSettled(
            rawAllocated.map(async (at) => {
              const regInfo = locallyRegistered[at.publicToken] || 
                              locallyRegistered[at.copyCode] || 
                              locallyRegistered[at.id];

              try {
                const qrRes = await api.getPublicQrInfo(at.publicToken);
                if (qrRes && qrRes.success) {
                  const isLiveActive = qrRes.status === 'ACTIVE' || !!(regInfo?.vehicleNumber) || (qrRes.vehicle?.vehicleNumber && qrRes.vehicle.vehicleNumber !== 'Not Linked Yet');
                  const vNumber = (qrRes.vehicle?.vehicleNumber && qrRes.vehicle.vehicleNumber !== 'Not Linked Yet') 
                    ? qrRes.vehicle.vehicleNumber 
                    : (qrRes.vehicleNumber || regInfo?.vehicleNumber || at.vehicleNumber);
                  
                  const vBrand = qrRes.vehicle?.vehicleBrand || qrRes.vehicleBrand || regInfo?.vehicleBrand || '';
                  const vModel = qrRes.vehicle?.vehicleName || qrRes.vehicleName || regInfo?.vehicleName || '';
                  const vTitle = (vBrand || vModel) ? `${vBrand} ${vModel}`.trim() : at.vehicleName;
                  const eContacts = qrRes.emergencyContacts || qrRes.vehicle?.emergencyContacts || regInfo?.emergencyContacts || at.emergencyContacts;

                  return {
                    ...at,
                    status: isLiveActive ? 'active' : (vNumber ? 'active' : 'unregistered'),
                    vehicleNumber: isLiveActive ? vNumber : (at.vehicleNumber || 'Unlinked Tag (Ready to Link)'),
                    vehicleName: vTitle,
                    vehicleType: qrRes.vehicle?.vehicleType || qrRes.vehicleType || regInfo?.vehicleType || at.vehicleType,
                    emergencyContacts: eContacts,
                    emergencyContact: eContacts?.[0]?.number || at.emergencyContact,
                    totalCalls: qrRes.wallet?.totalCalls || qrRes.totalCalls || qrRes.initialCalls || 10,
                    totalMessages: qrRes.wallet?.totalMessages || qrRes.totalMessages || qrRes.initialMessages || 20,
                    callBalance: qrRes.wallet?.callBalance ?? at.callBalance,
                    messageBalance: qrRes.wallet?.messageBalance ?? at.messageBalance,
                    scansCount: qrRes.scansCount ?? (qrRes.wallet?.totalCallsUsed || 0) + (qrRes.wallet?.totalMessagesUsed || 0),
                  };
                }
              } catch (e) {
                console.error('Error fetching live QR info for token', at.publicToken, e);
              }

              if (regInfo && regInfo.vehicleNumber) {
                return {
                  ...at,
                  status: 'active',
                  vehicleNumber: regInfo.vehicleNumber,
                  vehicleName: `${regInfo.vehicleBrand || ''} ${regInfo.vehicleName || ''}`.trim() || at.vehicleName,
                  vehicleType: regInfo.vehicleType || at.vehicleType,
                  emergencyContacts: regInfo.emergencyContacts || at.emergencyContacts,
                  emergencyContact: regInfo.emergencyContacts?.[0]?.number || at.emergencyContact,
                  whatsapp: regInfo.whatsappNumber || at.whatsapp,
                };
              }

              return {
                ...at,
                vehicleNumber: at.vehicleNumber || 'Unlinked Tag (Ready to Link)',
              };
            })
          );

          allocatedFromOrders = liveQrResults.map((r, i) => (r.status === 'fulfilled' ? r.value : rawAllocated[i]));
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

        // Also merge any standalone registered physical tags from locallyRegistered
        try {
          const localCache = JSON.parse(localStorage.getItem('safedrive_registered_tags') || '{}');
          Object.keys(localCache).forEach((tagKey) => {
            const r = localCache[tagKey];
            if (r && r.vehicleNumber && !existingTokens.has(tagKey) && !existingTokens.has(r.token) && !existingTokens.has(r.copyCode)) {
              const isPhys = r.qrType === 'PHYSICAL' || r.vehicleType === 'PHYSICAL' || tagKey.toLowerCase().includes('phy') || !r.qrType;
              allTags.push({
                id: r.copyCode || r.token || tagKey,
                publicToken: r.token || tagKey,
                copyCode: r.copyCode || tagKey,
                productId: isPhys ? 'Physical Safety Sticker Kit' : 'Digital QR Safety Pass',
                name: r.name || currentUser?.name || 'Owner',
                phone: r.phone || currentUser?.phone,
                emergencyContact: r.emergencyContacts?.[0]?.number || null,
                emergencyContacts: r.emergencyContacts || [],
                whatsapp: r.whatsappNumber || currentUser?.phone,
                vehicleNumber: r.vehicleNumber,
                vehicleName: `${r.vehicleBrand || ''} ${r.vehicleName || ''}`.trim() || 'My Vehicle',
                vehicleType: r.vehicleType || 'Car',
                status: 'active',
                qrType: isPhys ? 'PHYSICAL' : 'DIGITAL',
                registeredAt: r.registeredAt || new Date().toISOString().split('T')[0],
                callBalance: 10,
                messageBalance: 20,
                scansCount: 0,
                callMaskingEnabled: true,
                whatsappAlertsEnabled: true,
              });
              existingTokens.add(tagKey);
              if (r.token) existingTokens.add(r.token);
              if (r.copyCode) existingTokens.add(r.copyCode);
            }
          });
        } catch (localErr) {
          console.error('Error merging local registered tags cache', localErr);
        }

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

  const handleLinkNewTag = async (e) => {
    e.preventDefault();
    if (!newTagId.trim()) return;

    const formattedId = newTagId.trim().toUpperCase();
    const cleanPhone = currentUser?.phone?.replace(/\D/g, '') || '';
    const vPlate = newVehicleNumber ? newVehicleNumber.trim().toUpperCase() : 'REGISTERED';
    const vTitle = newVehicleName?.trim() || 'My Vehicle';

    const payload = {
      id: formattedId,
      token: formattedId,
      copyCode: formattedId,
      name: currentUser?.name || 'Owner',
      phone: cleanPhone,
      whatsappNumber: cleanPhone,
      vehicleBrand: 'Vehicle',
      vehicleName: vTitle,
      vehicleNumber: vPlate,
      vehicleType: newVehicleType || 'Car',
      status: 'active',
      qrType: 'PHYSICAL',
      registeredAt: new Date().toISOString().split('T')[0],
      emergencyContacts: currentUser?.emergencyContacts || [
        { name: 'Emergency SOS Contact', number: cleanPhone }
      ],
    };

    // Save to unified local cache
    try {
      const existing = JSON.parse(localStorage.getItem('safedrive_registered_tags') || '{}');
      existing[formattedId] = payload;
      existing[newTagId.trim()] = payload;
      localStorage.setItem('safedrive_registered_tags', JSON.stringify(existing));
    } catch (err) {
      console.error('Error saving local registered tag', err);
    }

    // Call backend registration endpoint
    try {
      await api.registerQrKit(formattedId, {
        ...payload,
        emergencyContacts: [
          { name: 'Emergency SOS Contact', number: cleanPhone }
        ],
      });
    } catch (apiErr) {
      console.error('Backend register API error', apiErr);
    }

    setNewTagId('');
    setNewVehicleName('');
    setNewVehicleNumber('');
    setNewVehicleType('Car');
    setIsLinkModalOpen(false);
    loadDashboardData();
    showNotification(`Physical Tag ${formattedId} linked & activated successfully!`);
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

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!editingAddress.name || !editingAddress.phone || !editingAddress.address) {
      alert('Please fill in required name, phone and address fields');
      return;
    }
    const updated = addresses.map(a => a.id === editingAddress.id ? editingAddress : a);
    if (updated.length === 0) {
      updated.push(editingAddress);
    }
    setAddresses(updated);
    try {
      const userId = currentUser?._id || currentUser?.id || currentUser?.phone || 'guest';
      localStorage.setItem(`safedrive_addresses_${userId}`, JSON.stringify(updated));
      await api.updateProfile({
        address: `${editingAddress.address}, ${editingAddress.locality || ''}, ${editingAddress.city || ''}, ${editingAddress.state || ''} - ${editingAddress.pincode || ''}`
      });
    } catch (err) {
      console.error('Error saving updated address to backend', err);
    }
    setEditingAddress(null);
    showNotification('Delivery address updated successfully!');
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updated = addresses.filter(a => a.id !== id);
      setAddresses(updated);
      try {
        const userId = currentUser?._id || currentUser?.id || currentUser?.phone || 'guest';
        localStorage.setItem(`safedrive_addresses_${userId}`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
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
            <div className="bg-white rounded-sm shadow-sm border border-gray-200/80 p-3 sm:p-4 flex items-center justify-between gap-3.5">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-full bg-[#2874f0] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] text-[#878787] font-medium leading-none mb-1">Hello,</p>
                  <h3 className="text-sm sm:text-base font-bold text-[#212121] truncate">
                    {currentUser.name || 'Flipkart Customer'}
                  </h3>
                </div>
              </div>

              {/* Mobile Quick App Install Pill */}
              <button
                onClick={handleInstallPwa}
                className="lg:hidden bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-[11px] px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-all"
                title="Install SafeDrive App on Phone"
              >
                <Smartphone size={13} />
                <span>App</span>
              </button>
            </div>

            {/* Mobile Download App Banner Widget */}
            {!isPwaInstalled && (
              <div className="lg:hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-xl p-3 text-white shadow-md flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src="/logos/icon.png" alt="App" className="w-9 h-9 rounded-xl bg-white p-0.5 shrink-0 object-contain shadow-xs" />
                  <div className="min-w-0">
                    <p className="font-black text-xs leading-tight truncate">Install SafeDrive Mobile App</p>
                    <p className="text-[10px] text-white/90 font-medium truncate">1-Tap Direct Dashboard & Alerts</p>
                  </div>
                </div>
                <button
                  onClick={handleInstallPwa}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm shrink-0 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <Download size={13} /> Install
                </button>
              </div>
            )}

            {/* Mobile Tab Navigation Bar (Sticky Horizontal Scroll on Mobile) */}
            <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md rounded-lg shadow-sm border border-gray-200 p-1.5 overflow-x-auto flex gap-1.5 no-scrollbar">
              {[
                { id: 'tags', label: `My Tags (${userTags.length})`, icon: <QrCode size={14} /> },
                { id: 'orders', label: `Orders (${orders.length})`, icon: <Package size={14} /> },
                { id: 'profile', label: 'Profile Info', icon: <User size={14} /> },
                { id: 'addresses', label: 'Addresses', icon: <MapPin size={14} /> },
                { id: 'notifications', label: 'Alerts', icon: <Bell size={14} /> },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === m.id
                      ? 'bg-[#2874f0] text-white shadow-xs'
                      : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}

              <button
                onClick={handleInstallPwa}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-black whitespace-nowrap transition-all cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shrink-0"
              >
                <Download size={13} />
                <span>Download App</span>
              </button>
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

              {/* DOWNLOAD PWA APP BUTTON */}
              <div className="p-3 pb-0">
                <button
                  onClick={handleInstallPwa}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white p-3 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm transition-all cursor-pointer group"
                  title="Install SafeDriveTag on Android & iOS"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Smartphone size={15} />
                    </div>
                    <div className="text-left leading-tight">
                      <p className="font-black text-white text-xs">Download App</p>
                      <p className="text-[10px] text-white/80 font-medium">1-Tap Install PWA</p>
                    </div>
                  </div>
                  <Download size={14} className="group-hover:translate-y-0.5 transition-transform shrink-0" />
                </button>
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
          <div className="flex-1 w-full bg-white rounded-lg shadow-sm border border-gray-200/80 p-3.5 sm:p-6 lg:p-7 min-h-[580px] min-w-0">
            
            {/* ---------------------------------------------------- */}
            {/* TAB 1: MY SAFEDRIVE TAGS */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'tags' && (
              <div className="space-y-6 min-w-0">
                
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
                                <span className="font-bold text-gray-800">
                                  {tag.phone ? `+91 ${String(tag.phone).replace(/\D/g, '').slice(-10)}` : 'Not Set'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={12} className="text-green-600" />
                                <span className="text-gray-500 font-medium">Emergency SOS:</span>
                                {tag.emergencyContacts && tag.emergencyContacts.length > 0 ? (
                                  <span className="font-bold text-gray-800">
                                    {tag.emergencyContacts.length} Emergency Contacts Configured
                                  </span>
                                ) : tag.emergencyContact && tag.emergencyContact !== tag.phone ? (
                                  <span className="font-bold text-gray-800">
                                    +91 {String(tag.emergencyContact).replace(/\D/g, '').slice(-10)}
                                  </span>
                                ) : isUnlinked ? (
                                  <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded text-[10px]">
                                    Configure during linking
                                  </span>
                                ) : (
                                  <span className="font-bold text-gray-800">+91 {String(tag.phone).replace(/\D/g, '').slice(-10)}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <MessageCircle size={12} className="text-emerald-600" />
                                <span className="text-gray-500 font-medium">WhatsApp Alerts:</span>
                                {tag.whatsapp ? (
                                  <span className="font-bold text-gray-800">
                                    +91 {String(tag.whatsapp).replace(/\D/g, '').slice(-10)}
                                  </span>
                                ) : isUnlinked ? (
                                  <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded text-[10px]">
                                    Configure during linking
                                  </span>
                                ) : (
                                  <span className="font-bold text-gray-800">+91 {String(tag.phone).replace(/\D/g, '').slice(-10)}</span>
                                )}
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
                                  {tag.expiryDate ? new Date(tag.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '1 Year Active'}
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
                                  onClick={() => printDigitalPdfInColor({ title: tag.vehicleName, publicToken: tag.publicToken || tag.id, vehicleNumber: tag.vehicleNumber })}
                                  className="bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                                >
                                  <Printer size={13} /> Print Badge
                                </button>
                              )}

                              <button
                                onClick={() => handleToggleStatus(tag.id, tag.status)}
                                className={`px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1 ${
                                  isActive
                                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                }`}
                              >
                                {isActive ? 'Pause Protection' : 'Activate Protection'}
                              </button>

                              <Link
                                to={`/dashboard/tag/${tag.publicToken || tag.id}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs text-center"
                              >
                                <Eye size={13} /> View Kit Details
                              </Link>

                              <div className="flex items-center gap-2 col-span-2 sm:col-span-1 justify-between sm:justify-start">
                                <button
                                  onClick={() => setEditingTag(tag)}
                                  className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Edit3 size={13} /> Edit
                                </button>

                                <button
                                  onClick={() => handleDeleteTag(tag.id)}
                                  className="text-red-500 hover:bg-red-50 p-2 sm:p-1.5 rounded-md text-xs transition-colors cursor-pointer border border-red-200 sm:border-0"
                                  title="Unlink Tag"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>

                            <Link
                              to={`/q/${tag.publicToken || tag.id}`}
                              target="_blank"
                              className="text-xs font-bold text-[#2874f0] hover:underline flex items-center gap-1 shrink-0 pt-1 sm:pt-0"
                            >
                              <ExternalLink size={12} /> Test Public QR Scan Page
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
                          className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all p-4 sm:p-5 flex flex-col gap-4 shadow-xs"
                        >
                          {/* Top Main Row (Product + Status + Actions) */}
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                            
                            {/* Product Info */}
                            <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200 shadow-2xs">
                                <img src={order.image} alt={order.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-sm sm:text-base text-[#212121] hover:text-[#2874f0] cursor-pointer truncate">
                                  {order.title}
                                </h4>
                                <p className="text-[11px] text-gray-500 mt-0.5 font-mono">Order ID: {order.id}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[11px] text-gray-500 font-medium">Type:</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                    order.qrType === 'DIGITAL'
                                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                                  }`}>
                                    {order.qrType === 'DIGITAL' ? '⚡ Digital E-Kit' : '📦 Physical QR Kit'}
                                  </span>
                                </div>
                                <p className="text-sm sm:text-base font-black text-[#212121] mt-1">₹{order.price}</p>
                              </div>
                            </div>

                            {/* Status Column */}
                            <div className="w-full md:w-56 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                  order.status === 'Delivered'
                                    ? 'bg-green-600'
                                    : order.status === 'Cancelled'
                                      ? 'bg-red-600'
                                      : 'bg-blue-600 animate-pulse'
                                }`} />
                                <span className="font-bold text-xs sm:text-sm text-[#212121]">{order.statusDate}</span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-1 pl-4.5">{order.statusDesc}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap md:flex-col gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                              <button
                                onClick={() => downloadInvoicePdf(order, currentUser)}
                                className="flex-1 md:flex-none border border-[#2874f0] text-[#2874f0] hover:bg-blue-50 px-3 py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                title="Direct 1-Click PDF Download"
                              >
                                <Download size={13} /> Invoice
                              </button>

                              {/* Physical Orders Have Courier & Stage Tracking */}
                              {!(order.productType === 'DIGITAL' || order.qrType === 'DIGITAL' || order.name?.toLowerCase().includes('digital') || order.title?.toLowerCase().includes('digital')) && (
                                <button
                                  onClick={() => setTrackingModalOrder(order)}
                                  className="flex-1 md:flex-none bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 px-3 py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                  title="Track Shipping & Delivery Progress"
                                >
                                  <Truck size={13} /> Track Order
                                </button>
                              )}

                              {/* Only Digital Orders Have Printable PDF Sticker Passes */}
                              {(order.productType === 'DIGITAL' || order.qrType === 'DIGITAL' || order.name?.toLowerCase().includes('digital') || order.title?.toLowerCase().includes('digital')) && (
                                <>
                                  <button
                                    onClick={() => { setDigitalPdfModalOrder(order); setActiveCopyIndex(0); }}
                                    className="flex-1 md:flex-none bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                    title="Open Digital QR Kit Passes Inside App"
                                  >
                                    <Eye size={13} /> View Digital Passes
                                  </button>

                                  <button
                                    onClick={() => printDigitalPdfInColor(order)}
                                    className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                                    title="Print High-Resolution Color PDF Badges"
                                  >
                                    <Printer size={13} /> Print Color PDF
                                  </button>
                                </>
                              )}
                            </div>

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
                                            size={78}
                                            level="H"
                                            includeMargin={false}
                                            imageSettings={{
                                              src: "/logos/icon.png",
                                              x: undefined,
                                              y: undefined,
                                              height: 18,
                                              width: 18,
                                              excavate: true,
                                            }}
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
            {/* ---------------------------------------------------- */}
            {/* TAB: MANAGE DELIVERY ADDRESS */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                
                {/* Header with Title */}
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-base font-bold text-[#212121]">Delivery Address</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your official physical QR kit shipping address. Click edit to update your delivery location.
                  </p>
                </div>

                {/* EDIT ADDRESS INLINE FORM */}
                {editingAddress ? (
                  <div className="border border-blue-200 bg-[#f5faff] rounded-xl p-4 sm:p-6 animate-fade-up shadow-sm">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-blue-200/60">
                      <h4 className="text-xs font-bold text-[#2874f0] uppercase tracking-wider flex items-center gap-1.5">
                        <Edit3 size={14} /> EDIT DELIVERY ADDRESS
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingAddress(null)}
                        className="text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <form onSubmit={handleUpdateAddress} className="space-y-4 text-xs">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-bold mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Singh"
                            value={editingAddress.name || ''}
                            onChange={(e) => setEditingAddress({ ...editingAddress, name: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#2874f0] shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-bold mb-1">10-Digit Mobile Number *</label>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            placeholder="e.g. 9876543210"
                            value={editingAddress.phone || ''}
                            onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value.replace(/\D/g, '') })}
                            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#2874f0] shadow-2xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-bold mb-1">Pincode *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 212120"
                            value={editingAddress.pincode || ''}
                            onChange={(e) => setEditingAddress({ ...editingAddress, pincode: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#2874f0] shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-bold mb-1">Locality / Landmark</label>
                          <input
                            type="text"
                            placeholder="e.g. Near Metro Station / Aliganj"
                            value={editingAddress.locality || ''}
                            onChange={(e) => setEditingAddress({ ...editingAddress, locality: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#2874f0] shadow-2xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Address (House No., Building, Street) *</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="Complete House No., Building Name, Street"
                          value={editingAddress.address || ''}
                          onChange={(e) => setEditingAddress({ ...editingAddress, address: e.target.value })}
                          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#2874f0] shadow-2xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-bold mb-1">City / District / Town *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Lucknow / Delhi"
                            value={editingAddress.city || ''}
                            onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#2874f0] shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-bold mb-1">State *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Uttar Pradesh"
                            value={editingAddress.state || ''}
                            onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#2874f0] shadow-2xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1.5">Address Type</label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                            <input
                              type="radio"
                              name="addrType"
                              value="HOME"
                              checked={editingAddress.type === 'HOME'}
                              onChange={(e) => setEditingAddress({ ...editingAddress, type: e.target.value })}
                              className="accent-[#2874f0]"
                            />
                            <span>Home (All day delivery)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                            <input
                              type="radio"
                              name="addrType"
                              value="WORK"
                              checked={editingAddress.type === 'WORK'}
                              onChange={(e) => setEditingAddress({ ...editingAddress, type: e.target.value })}
                              className="accent-[#2874f0]"
                            />
                            <span>Work (Delivery 10 AM - 5 PM)</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3">
                        <button
                          type="submit"
                          className="bg-[#2874f0] hover:bg-blue-700 text-white px-7 py-2.5 rounded-md font-bold text-xs shadow-sm transition-colors cursor-pointer uppercase"
                        >
                          SAVE CHANGES
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAddress(null)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-md text-xs transition-colors cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>

                    </form>
                  </div>
                ) : (
                  /* Addresses Display Cards */
                  <div className="space-y-3">
                    {addresses.length === 0 ? (
                      <div className="py-10 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50/60 p-6">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center mx-auto mb-2.5">
                          <MapPin size={22} />
                        </div>
                        <h4 className="font-bold text-sm text-[#212121]">No Saved Address Found</h4>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                          Add your delivery address to receive physical vehicle stickers and courier tracking.
                        </p>
                        <button
                          onClick={() => setEditingAddress({
                            id: `addr-1`,
                            name: currentUser?.name || 'Customer',
                            phone: currentUser?.phone || '',
                            pincode: '',
                            locality: '',
                            address: '',
                            city: '',
                            state: 'Delhi',
                            landmark: '',
                            type: 'HOME',
                            isDefault: true
                          })}
                          className="bg-[#2874f0] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-md shadow-xs cursor-pointer transition-colors"
                        >
                          + Set Delivery Address
                        </button>
                      </div>
                    ) : (
                      addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-4 sm:p-5 relative transition-all shadow-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[10px] font-black bg-blue-50 text-[#2874f0] border border-blue-200 px-2 py-0.5 rounded uppercase">
                                {addr.type || 'HOME'}
                              </span>
                              <span className="font-bold text-sm text-[#212121]">{addr.name}</span>
                              <span className="font-bold text-xs text-gray-700">{addr.phone}</span>
                            </div>

                            <button
                              onClick={() => setEditingAddress({ ...addr })}
                              className="bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                              title="Edit Delivery Address"
                            >
                              <Edit3 size={13} /> Edit Address
                            </button>
                          </div>

                          <p className="text-xs text-gray-600 leading-relaxed pr-4">
                            {addr.address}{addr.locality ? `, ${addr.locality}` : ''}{addr.city ? `, ${addr.city}` : ''}{addr.state ? `, ${addr.state}` : ''} {addr.pincode ? `- ${addr.pincode}` : ''}
                          </p>
                          {addr.landmark && (
                            <p className="text-[11px] text-gray-400 mt-1">Landmark: {addr.landmark}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

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
                  size={180}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/logos/icon.png",
                    x: undefined,
                    y: undefined,
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

      {/* ======================================================== */}
      {/* MODAL 4: PHYSICAL ORDER LIVE TRACKING MODAL */}
      {/* ======================================================== */}
      {trackingModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden text-left">
            
            {/* Top Header */}
            <div className="bg-gradient-to-r from-[#2874f0] to-blue-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Truck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Track Your Physical QR Delivery</h3>
                  <p className="text-[11px] text-blue-100 font-mono">
                    Order: {trackingModalOrder.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* Courier & AWB Header Card */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">COURIER PARTNER</p>
                  <p className="text-sm font-black text-gray-900 mt-0.5">BlueDart / Delhivery Express</p>
                  <p className="text-[11px] font-mono text-blue-700 font-bold mt-0.5">
                    AWB: SDT{String(trackingModalOrder.id).replace(/\D/g, '').slice(-6) || '789120'}IN
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[11px] inline-flex items-center gap-1 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> In Transit
                  </span>
                  <p className="text-[11px] text-gray-500 font-medium mt-1">Est. Delivery: 2-3 Days</p>
                </div>
              </div>

              {/* 5-Step Vertical Tracking Timeline */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                  Shipment Progress Status
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
                  
                  {/* Step 1: Order Confirmed */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-gray-900 text-xs">Order Placed & Confirmed</p>
                        <span className="text-[10px] text-gray-400 font-mono">{trackingModalOrder.date || 'Recent'}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Payment verified via Razorpay. Physical QR order allocation completed.
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Quality Checked & Packed */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-gray-900 text-xs">Quality Checked & Weatherproof Sealed</p>
                        <span className="text-[10px] text-gray-400 font-mono">Today, 09:30 AM</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        High-grade vinyl UV protection coating applied with dual windshield badges.
                      </p>
                    </div>
                  </div>

                  {/* Step 3: In Transit */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#2874f0] text-white flex items-center justify-center ring-4 ring-white shadow-xs animate-pulse">
                      <Truck size={11} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[#2874f0] text-xs">Dispatched & In Transit (Live)</p>
                        <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-1.5 py-0.2 rounded">Active Stage</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        Package handed over to courier partner. In transit from Logistics Hub.
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Out for Delivery */}
                  <div className="relative opacity-60">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center ring-4 ring-white shadow-xs">
                      <Clock size={11} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 text-xs">Out for Delivery</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Delivery executive will arrive at your door and notify via SMS.
                      </p>
                    </div>
                  </div>

                  {/* Step 5: Delivered */}
                  <div className="relative opacity-60">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center ring-4 ring-white shadow-xs">
                      <Package size={11} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 text-xs">Delivered & Protected</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Scan the physical sticker QR once to activate instant vehicle privacy.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Delivery Address Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">DELIVERING TO</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">
                    {currentUser?.name || 'Customer'} (+91 {currentUser?.phone || 'Registered'})
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    {currentUser?.address || 'Your saved delivery address'}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="w-full bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
              >
                Close Tracking Window
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: PWA APP INSTALLATION GUIDE MODAL */}
      {/* ======================================================== */}
      {showPwaModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden text-left">
            
            {/* Top Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logos/icon.png" alt="App Icon" className="w-10 h-10 rounded-xl bg-white p-1 shadow-md object-contain" />
                <div>
                  <h3 className="text-sm font-black">Install SafeDrive Mobile App</h3>
                  <p className="text-[11px] text-orange-100 font-medium">
                    Fast 1-Tap Access & Vehicle Alerts
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPwaModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              
              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2.5 bg-orange-50/70 border border-orange-200/80 rounded-xl p-3 text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span className="font-bold text-gray-800">1-Tap Direct Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span className="font-bold text-gray-800">Instant Push Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span className="font-bold text-gray-800">Zero App Store Size</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span className="font-bold text-gray-800">100% Secure & Private</span>
                </div>
              </div>

              {/* Instructions tabs / cards for Android & iPhone */}
              <div className="space-y-3 pt-1">
                <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/60">
                  <p className="font-bold text-gray-900 text-xs flex items-center gap-1.5 mb-1.5">
                    <span>📱 On Android (Chrome / Brave / Edge):</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-600 pl-1">
                    <li>Tap the <strong>Three Dots (⋮)</strong> menu in browser top right.</li>
                    <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                    <li>Confirm <strong>"Install"</strong> — SafeDriveTag is now added to your home apps!</li>
                  </ol>
                </div>

                <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/60">
                  <p className="font-bold text-gray-900 text-xs flex items-center gap-1.5 mb-1.5">
                    <span>🍎 On iPhone / iOS (Safari):</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-600 pl-1">
                    <li>Tap the <strong>Share (⎋)</strong> button at the bottom of Safari.</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen" (+)</strong>.</li>
                    <li>Tap <strong>"Add"</strong> in top right — The app icon will appear on your iPhone screen!</li>
                  </ol>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowPwaModal(false)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
              >
                Got It, Thank You!
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: DIGITAL QR KIT & PRINTABLE PASS IN-APP MODAL */}
      {/* ======================================================== */}
      {digitalPdfModalOrder && (() => {
        const copies = Array.isArray(digitalPdfModalOrder.allocatedQRIds) && digitalPdfModalOrder.allocatedQRIds.length > 0
          ? digitalPdfModalOrder.allocatedQRIds
          : [{
              publicToken: digitalPdfModalOrder.publicToken || digitalPdfModalOrder.id,
              copyCode: 'SD-TAG-1',
              qrType: 'DIGITAL'
            }];
        
        const currentCopy = copies[activeCopyIndex] || copies[0];
        const token = currentCopy.publicToken || currentCopy.copyCode || digitalPdfModalOrder.publicToken || digitalPdfModalOrder.id;
        const copyCode = currentCopy.copyCode || `COPY-${activeCopyIndex + 1}`;
        const liveScanUrl = `https://safedrivetag-website.vercel.app/q/${token}`;

        return (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-up">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden text-left max-h-[92vh] flex flex-col">
              
              {/* Modal Top Bar */}
              <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <QrCode size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black">Official Digital QR Kit Passes</h3>
                    <p className="text-[11px] text-orange-100 font-mono">
                      Order: {digitalPdfModalOrder.id} • Live Scannable
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDigitalPdfModalOrder(null)}
                  className="text-white/80 hover:text-white cursor-pointer p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
                
                {/* Copy Selection Tabs (if multiple copies) */}
                {copies.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0">
                      Sticker Passes:
                    </span>
                    {copies.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveCopyIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                          activeCopyIndex === idx
                            ? 'bg-[#2874f0] text-white shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <QrCode size={13} /> {c.copyCode || `Copy ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                )}

                {/* Info Guide Card */}
                <div className="bg-orange-50/80 border border-orange-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="font-bold text-orange-950 text-xs flex items-center gap-1.5">
                      <span>🖨️ DIY Color Printing & Placement Guide</span>
                    </p>
                    <p className="text-[11px] text-orange-800 leading-relaxed">
                      Print in full-color on sticker sheet or glossy paper. Cut along dotted lines and place on front windshield and rear visor.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> Live Scannable
                    </span>
                  </div>
                </div>

                {/* Target Redirect URL bar */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 flex items-center justify-between gap-2 text-[11px] font-mono text-gray-600">
                  <span className="text-gray-400 font-sans font-semibold">Live Target:</span>
                  <span className="text-[#2874f0] truncate font-bold">{liveScanUrl}</span>
                  <Link
                    to={`/q/${token}`}
                    target="_blank"
                    className="text-gray-500 hover:text-[#2874f0] shrink-0 font-sans font-bold flex items-center gap-1 text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200"
                  >
                    <ExternalLink size={10} /> Test Scan
                  </Link>
                </div>

                {/* 2 Printable Passes Cards Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* PASS 1: Front Windshield Badge */}
                  <div className="border-2 border-dashed border-orange-300 rounded-2xl p-2 bg-gradient-to-b from-orange-50/40 to-white flex flex-col items-center justify-between">
                    <div className="w-full text-center pb-1">
                      <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">✂ CUT HERE</span>
                    </div>

                    <div className="w-full bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-xl p-4 flex flex-col items-center text-center shadow-md">
                      <div className="w-full flex items-center justify-between mb-3 text-[10px] font-bold">
                        <span className="flex items-center gap-1">🛡️ SafeDriveTag</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-full">Front Windshield</span>
                      </div>

                      {/* Real Vector QR Code with Centered Logo */}
                      <div className="bg-white p-2.5 rounded-xl border border-white/40 shadow-inner mb-3">
                        <QRCodeSVG
                          value={liveScanUrl}
                          size={130}
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

                      <p className="font-black text-xs tracking-wider uppercase">SCAN TO CONTACT OWNER</p>
                      <p className="text-[9px] text-white/80 mt-0.5">Parking Obstruction • Emergency • Lights ON</p>

                      <div className="bg-white/20 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full mt-2 border border-white/30">
                        CODE: {copyCode}
                      </div>

                      <div className="w-full flex items-center justify-between mt-3 pt-2 border-t border-white/20 text-[9px] text-white/90">
                        <span>🔒 100% Number Privacy</span>
                        <span>⚡ Instant Masked Call</span>
                      </div>
                    </div>
                  </div>

                  {/* PASS 2: Rear Glass / Visor Badge */}
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-2 bg-gradient-to-b from-slate-50/50 to-white flex flex-col items-center justify-between">
                    <div className="w-full text-center pb-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">✂ CUT HERE</span>
                    </div>

                    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl p-4 flex flex-col items-center text-center shadow-md">
                      <div className="w-full flex items-center justify-between mb-3 text-[10px] font-bold">
                        <span className="flex items-center gap-1">🛡️ SafeDriveTag</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-full">Rear Glass / Visor</span>
                      </div>

                      {/* Real Vector QR Code with Centered Logo */}
                      <div className="bg-white p-2.5 rounded-xl border border-white/40 shadow-inner mb-3">
                        <QRCodeSVG
                          value={liveScanUrl}
                          size={130}
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

                      <p className="font-black text-xs tracking-wider uppercase text-amber-400">SCAN IN EMERGENCY / ISSUE</p>
                      <p className="text-[9px] text-slate-300 mt-0.5">Direct WhatsApp Alert & Family SOS</p>

                      <div className="bg-white/20 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full mt-2 border border-white/30">
                        CODE: {copyCode}
                      </div>

                      <div className="w-full flex items-center justify-between mt-3 pt-2 border-t border-white/20 text-[9px] text-slate-300">
                        <span>🚨 24/7 SOS Alert</span>
                        <span>💬 WhatsApp Connect</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Actions Footer */}
              <div className="bg-gray-50 border-t border-gray-200 px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => printDigitalPdfInColor(currentCopy)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Printer size={14} /> Print Color PDF Sheet
                  </button>
                  <button
                    onClick={() => downloadQrPng(currentCopy)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Download size={14} /> Download Badge (PNG)
                  </button>
                </div>

                <button
                  onClick={() => setDigitalPdfModalOrder(null)}
                  className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
