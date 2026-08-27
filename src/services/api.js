const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://safedrive-backend-phqx.onrender.com/api';

export const getAuthToken = () => {
  try {
    return localStorage.getItem('safedrive_token') || '';
  } catch {
    return '';
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('safedrive_token', token);
    } else {
      localStorage.removeItem('safedrive_token');
    }
  } catch (e) {
    console.error('Failed to save auth token', e);
  }
};

async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`API Error on [${config.method || 'GET'} ${endpoint}]:`, err);
    return {
      success: false,
      message: err.message || 'Network error, please check connection.',
    };
  }
}

export const api = {
  // =========================================================================
  // MODULE 1: AUTHENTICATION & USER LOGIN
  // =========================================================================
  sendLoginOtp: (phoneOrData) => {
    const body = typeof phoneOrData === 'object' && phoneOrData !== null 
      ? phoneOrData 
      : { phone: String(phoneOrData).replace(/\D/g, '') };
    return apiRequest('/auth/send-login-otp', {
      method: 'POST',
      body,
    });
  },

  sendOtp: (phoneOrData) => {
    const body = typeof phoneOrData === 'object' && phoneOrData !== null 
      ? phoneOrData 
      : { phone: String(phoneOrData).replace(/\D/g, '') };
    return apiRequest('/auth/send-login-otp', {
      method: 'POST',
      body,
    });
  },

  verifyLoginOtp: (phoneOrData, otp) => {
    const body = typeof phoneOrData === 'object' && phoneOrData !== null 
      ? { ...phoneOrData, ...(otp ? { otp } : {}) }
      : { phone: String(phoneOrData).replace(/\D/g, ''), otp: String(otp).trim() };
    return apiRequest('/auth/verify-login-otp', {
      method: 'POST',
      body,
    });
  },

  verifyOtp: (phoneOrData, otp) => {
    const body = typeof phoneOrData === 'object' && phoneOrData !== null 
      ? { ...phoneOrData, ...(otp ? { otp } : {}) }
      : { phone: String(phoneOrData).replace(/\D/g, ''), otp: String(otp).trim() };
    return apiRequest('/auth/verify-login-otp', {
      method: 'POST',
      body,
    });
  },

  getCurrentUser: () => apiRequest('/auth/me'),

  // =========================================================================
  // MODULE 2: LANDING PAGE & PUBLIC FORMS
  // =========================================================================
  getLandingData: () => apiRequest('/public/landing-data'),
  
  submitContact: async (contactData) => {
    const res = await apiRequest('/public/contact', {
      method: 'POST',
      body: contactData,
    });
    if (res.success || !res.message?.toLowerCase().includes('not found')) {
      return res;
    }
    return apiRequest('/public/contact-inquiry', {
      method: 'POST',
      body: contactData,
    });
  },

  subscribeNewsletter: (email) =>
    apiRequest('/public/subscribe-newsletter', {
      method: 'POST',
      body: { email },
    }),

  // =========================================================================
  // MODULE 3: STORE & E-COMMERCE ORDER FLOW
  // =========================================================================
  getProducts: () => apiRequest('/purchase/products'),
  getProductById: (id) => apiRequest(`/purchase/products/${id}`),

  sendPurchaseOtp: (phoneOrData) => {
    const body = typeof phoneOrData === 'object' && phoneOrData !== null 
      ? phoneOrData 
      : { phone: String(phoneOrData).replace(/\D/g, '') };
    return apiRequest('/purchase/send-otp', {
      method: 'POST',
      body,
    });
  },

  verifyPurchaseOtp: (phoneOrData, otp) => {
    const body = typeof phoneOrData === 'object' && phoneOrData !== null 
      ? { ...phoneOrData, ...(otp ? { otp } : {}) }
      : { phone: String(phoneOrData).replace(/\D/g, ''), otp: String(otp).trim() };
    return apiRequest('/purchase/verify-otp', {
      method: 'POST',
      body,
    });
  },

  createOrder: (orderData) =>
    apiRequest('/purchase/create-order', {
      method: 'POST',
      body: orderData,
    }),

  completePurchase: (paymentData) =>
    apiRequest('/purchase/complete', {
      method: 'POST',
      body: paymentData,
    }),

  // =========================================================================
  // MODULE 4: USER PORTAL & DASHBOARD
  // =========================================================================
  getDashboard: () => apiRequest('/user/dashboard'),

  updateProfile: (profileData) =>
    apiRequest('/user/profile', {
      method: 'PUT',
      body: profileData,
    }),

  registerFcmToken: (fcmToken) =>
    apiRequest('/user/fcm-token', {
      method: 'POST',
      body: { fcmToken },
    }),

  getUserOrders: () => apiRequest('/user/orders'),

  getUserNotifications: () => apiRequest('/user/notifications'),

  getUserTransactions: async () => {
    try {
      const res = await apiRequest('/user/ledger');
      
      // If backend returns the specific new format with subscriptions and wallets
      if (res.success && (res.subscriptions || res.wallets)) {
        let synthTransactions = [];
        let index = 0;
        
        if (Array.isArray(res.subscriptions)) {
          res.subscriptions.forEach(sub => {
            synthTransactions.push({
              id: sub.paymentId || `SUB-${sub._id || Date.now()}`,
              orderNumber: sub._id || `SUB-ORD-${index++}`,
              amount: Number(sub.amount || 299),
              currency: 'INR',
              paymentMethod: 'Subscription / Gateway',
              status: sub.status || 'SUCCESS',
              date: sub.startDate || sub.createdAt || new Date().toISOString(),
              productName: sub.planName || 'SafeDrive Subscription',
            });
          });
        }
        
        if (Array.isArray(res.wallets)) {
          res.wallets.forEach(wall => {
            if (wall.totalCallsPurchased > 0 || wall.totalMessagesPurchased > 0) {
              synthTransactions.push({
                id: `WALL-${wall._id || Date.now()}`,
                orderNumber: wall._id || `WALL-ORD-${index++}`,
                amount: Number(wall.amount || 0), // Default to 0 if we don't know the wallet purchase price
                currency: 'INR',
                paymentMethod: 'Wallet Topup',
                status: 'SUCCESS',
                date: wall.updatedAt || wall.createdAt || new Date().toISOString(),
                productName: 'Quota Topup (Calls/Messages)',
              });
            }
          });
        }
        
      // If we still found no synthesized transactions from the wallet/sub, but res has generic transactions
      if (synthTransactions.length === 0 && Array.isArray(res.transactions || res.ledger || res.data)) {
         const rawTxns = res.transactions || res.ledger || res.data || [];
         synthTransactions = rawTxns.map((txn, idx) => ({
           id: txn.paymentId || txn.transactionId || txn.id || `TXN-RZP-${(txn.orderNumber || txn._id || '').toString().replace(/\D/g, '').slice(-8) || (Date.now() - idx * 864000).toString().slice(-8)}`,
           orderNumber: txn.orderNumber || txn._id || `ORD-2026-${idx + 101}`,
           amount: Number(txn.totalAmount || txn.amount || txn.price) || 299,
           currency: txn.currency || 'INR',
           paymentMethod: txn.paymentMethod || 'Razorpay Gateway',
           paymentGateway: 'Razorpay',
           status: txn.status || txn.paymentStatus || 'SUCCESS',
           date: txn.createdAt || txn.date || txn.updatedAt || new Date().toISOString(),
           productName: txn.productName || txn.title || 'SafeDrive Safety Kit',
           customerName: txn.customerName || '',
           customerPhone: txn.customerPhone || '',
           orderData: txn,
         }));
      }
      
      if (synthTransactions.length > 0) {
        return { success: true, transactions: synthTransactions };
      }
    }

    // If res had a standard array of transactions but not returned yet
    if (res && res.success && Array.isArray(res.transactions || res.data || res.ledger)) {
      const rawTxns = res.transactions || res.ledger || res.data || [];
      return {
        success: true,
        transactions: rawTxns.map((txn, idx) => ({
           id: txn.paymentId || txn.transactionId || txn.id || `TXN-RZP-${(txn.orderNumber || txn._id || '').toString().replace(/\D/g, '').slice(-8) || (Date.now() - idx * 864000).toString().slice(-8)}`,
           orderNumber: txn.orderNumber || txn._id || `ORD-2026-${idx + 101}`,
           amount: Number(txn.totalAmount || txn.amount || txn.price) || 299,
           currency: txn.currency || 'INR',
           paymentMethod: txn.paymentMethod || 'Razorpay Gateway',
           paymentGateway: 'Razorpay',
           status: txn.status || txn.paymentStatus || 'SUCCESS',
           date: txn.createdAt || txn.date || txn.updatedAt || new Date().toISOString(),
           productName: txn.productName || txn.title || 'SafeDrive Safety Kit',
           customerName: txn.customerName || '',
           customerPhone: txn.customerPhone || '',
           orderData: txn,
        }))
      };
    }
      
      // Fallback: build from orders
      const ordersRes = await apiRequest('/user/orders');
      if (ordersRes.success && Array.isArray(ordersRes.orders)) {
        const transactions = ordersRes.orders.map((ord, idx) => ({
          id: ord.paymentId || ord.transactionId || `TXN-RZP-${(ord.orderNumber || ord._id || '').toString().replace(/\D/g, '').slice(-8) || (Date.now() - idx * 86400000).toString().slice(-8)}`,
          orderNumber: ord.orderNumber || ord._id || `ORD-2026-${idx + 101}`,
          amount: Number(ord.totalAmount || ord.amount || ord.price) || 299,
          currency: 'INR',
          paymentMethod: ord.paymentMethod || 'Razorpay Gateway (UPI / Cards)',
          paymentGateway: 'Razorpay',
          status: ord.paymentStatus || 'SUCCESS',
          date: ord.createdAt || ord.date || new Date(Date.now() - idx * 86400000).toISOString(),
          productName: ord.productName || ord.title || 'SafeDrive Smart Vehicle QR Safety Kit',
          customerName: ord.customerName || '',
          customerPhone: ord.customerPhone || '',
          orderData: ord,
        }));
        return { success: true, transactions };
      }
      
      return res;
    } catch (e) {
      console.log('Synthesize transactions error', e);
      return { success: false };
    }
  },

  // =========================================================================
  // MODULE 5: QR TAG DETAILS, TOP-UP & RENEWAL
  // =========================================================================
  getUserQrDetails: (id) => apiRequest(`/user/qr/${id}`),

  updateUserQrDetails: (id, detailsData) =>
    apiRequest(`/user/qr/${id}/details`, {
      method: 'PUT',
      body: detailsData,
    }),

  getPackages: () => apiRequest('/user/packages'),

  buyQrQuota: (id, quotaData) =>
    apiRequest(`/user/qr/${id}/buy-quota`, {
      method: 'POST',
      body: quotaData,
    }),

  renewQrValidity: (id, renewData) =>
    apiRequest(`/user/qr/${id}/renew`, {
      method: 'POST',
      body: renewData || {},
    }),

  buyQuota: (data) =>
    apiRequest(data?.id ? `/user/qr/${data.id}/buy-quota` : '/user/quota/buy', {
      method: 'POST',
      body: data,
    }),

  renewSubscription: (data) =>
    apiRequest(data?.id ? `/user/qr/${data.id}/renew` : '/user/subscription/renew', {
      method: 'POST',
      body: data,
    }),

  updateEmergencyContacts: (data) =>
    apiRequest('/user/emergency-contacts', {
      method: 'PUT',
      body: data,
    }),

  getLedger: () => apiRequest('/user/ledger'),

  // =========================================================================
  // MODULE 6: PUBLIC QR SCAN, ACTIVATION & MASKED CALL
  // =========================================================================
  getPublicQrInfo: (token) => apiRequest(`/public/qr/${token}`),

  sendActivationOtp: (phoneOrData) => {
    const body = typeof phoneOrData === 'object' && phoneOrData !== null 
      ? phoneOrData 
      : { phone: String(phoneOrData).replace(/\D/g, '') };
    return apiRequest('/public/send-activation-otp', {
      method: 'POST',
      body,
    });
  },

  verifyActivationOtp: (phoneOrData, otp) => {
    const body = typeof phoneOrData === 'object' && phoneOrData !== null 
      ? { ...phoneOrData, ...(otp ? { otp } : {}) }
      : { phone: String(phoneOrData).replace(/\D/g, ''), otp: String(otp).trim() };
    return apiRequest('/public/verify-activation-otp', {
      method: 'POST',
      body,
    });
  },

  registerQrKit: (token, registrationData) =>
    apiRequest(`/public/qr/${token}/register`, {
      method: 'POST',
      body: registrationData,
    }),

  getScanReasons: (token) => 
    apiRequest(token ? `/public/scan-reasons?token=${token}` : '/public/scan-reasons'),

  verifyPlate: (token, last4Digits) =>
    apiRequest(`/public/qr/${token}/verify-plate`, {
      method: 'POST',
      body: { 
        last4: String(last4Digits).trim(),
        last4Digits: String(last4Digits).trim()
      },
    }),

  initiateCall: (token, callerPhone, reason, last4Digits) => {
    const cleanPhone = String(callerPhone || '').replace(/\D/g, '');
    return apiRequest(`/public/qr/${token}/call`, {
      method: 'POST',
      body: { 
        callerPhone: cleanPhone,
        scannerPhone: cleanPhone,
        reason: reason || 'General Inquiry',
        last4Digits: last4Digits || '',
        last4: last4Digits || ''
      },
    });
  },

  sendMessage: (token, messageOrPayload) => {
    const body = typeof messageOrPayload === 'string'
      ? { message: messageOrPayload, messageText: messageOrPayload, reason: messageOrPayload }
      : messageOrPayload;
    return apiRequest(`/public/qr/${token}/message`, {
      method: 'POST',
      body,
    });
  },

  sendPushNotification: (token, reasonText) => {
    const text = typeof reasonText === 'string' ? reasonText : reasonText?.reason || 'Alert';
    return apiRequest(`/public/qr/${token}/push-notification`, {
      method: 'POST',
      body: { messageText: text, reason: text },
    });
  },

  triggerEmergency: (token, data) =>
    apiRequest(`/public/qr/${token}/emergency`, {
      method: 'POST',
      body: data || {},
    }),

  // Admin Scan Reasons APIs
  getAdminScanReasons: () => apiRequest('/admin/scan-reasons?showDeleted=true'),
  createScanReason: (data) => apiRequest('/admin/scan-reasons', { method: 'POST', body: data }),
  updateScanReason: (id, data) => apiRequest(`/admin/scan-reasons/${id}`, { method: 'PUT', body: data }),
  deleteScanReason: (id) => apiRequest(`/admin/scan-reasons/${id}`, { method: 'DELETE' }),
  restoreScanReason: (id) => apiRequest(`/admin/scan-reasons/${id}/restore`, { method: 'PUT' }),
};

export default api;
