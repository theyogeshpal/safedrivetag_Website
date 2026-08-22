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
  // --- 1. Product Catalog & Store APIs ---
  getProducts: () => apiRequest('/purchase/products'),
  getProductById: (id) => apiRequest(`/purchase/products/${id}`),

  // --- 2. User Authentication & Profile APIs ---
  sendOtp: (data) => {
    const body = typeof data === 'object' && data !== null ? data : { phone: data };
    return apiRequest('/auth/send-otp', {
      method: 'POST',
      body,
    });
  },

  sendLoginOtp: (data) => {
    const body = typeof data === 'object' && data !== null ? data : { phone: data };
    return apiRequest('/auth/send-otp', {
      method: 'POST',
      body,
    });
  },

  verifyOtp: (phoneOrData, otp) => {
    const body = typeof phoneOrData === 'object' && phoneOrData !== null 
      ? { ...phoneOrData, ...(otp ? { otp } : {}) }
      : { phone: phoneOrData, otp };
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body,
    });
  },

  verifyLoginOtp: (phoneOrData, otp) => {
    const body = typeof phoneOrData === 'object' && phoneOrData !== null 
      ? { ...phoneOrData, ...(otp ? { otp } : {}) }
      : { phone: phoneOrData, otp };
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body,
    });
  },

  getCurrentUser: () => apiRequest('/auth/me'),

  updateProfile: (profileData) =>
    apiRequest('/user/profile', {
      method: 'PUT',
      body: profileData,
    }),

  // --- 3. Checkout & Payment APIs ---
  sendPurchaseOtp: (data) => {
    const body = typeof data === 'object' && data !== null ? data : { phone: data };
    return apiRequest('/purchase/send-otp', {
      method: 'POST',
      body,
    });
  },

  verifyPurchaseOtp: (phoneOrData, otp) => {
    const body = typeof phoneOrData === 'object' && phoneOrData !== null 
      ? { ...phoneOrData, ...(otp ? { otp } : {}) }
      : { phone: phoneOrData, otp };
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

  // --- 4. Public QR Scan & Safety Features ---
  getPublicQrInfo: (token) => apiRequest(`/public/qr/${token}`),
  getScanReasons: () => apiRequest('/public/scan-reasons'),

  verifyPlate: (token, last4Digits) =>
    apiRequest(`/public/qr/${token}/verify-plate`, {
      method: 'POST',
      body: { last4Digits },
    }),

  initiateCall: (token, last4Digits, reason) =>
    apiRequest(`/public/qr/${token}/call`, {
      method: 'POST',
      body: { last4Digits, reason },
    }),

  sendMessage: (token, last4Digits, reason) =>
    apiRequest(`/public/qr/${token}/message`, {
      method: 'POST',
      body: { last4Digits, reason },
    }),

  triggerEmergency: (token, last4Digits, location) =>
    apiRequest(`/public/qr/${token}/emergency`, {
      method: 'POST',
      body: { last4Digits, location },
    }),

  // --- 5. First-Time QR Registration API ---
  registerQrKit: (token, registrationData) =>
    apiRequest(`/public/qr/${token}/register`, {
      method: 'POST',
      body: registrationData,
    }),

  // --- 6. Customer Dashboard & Vehicle Management ---
  getDashboard: () => apiRequest('/user/dashboard'),
  getPackages: () => apiRequest('/user/packages'),
  getUserOrders: () => apiRequest('/user/orders'),

  buyQuota: (data) =>
    apiRequest('/user/quota/buy', {
      method: 'POST',
      body: data,
    }),

  renewSubscription: (data) =>
    apiRequest('/user/subscription/renew', {
      method: 'POST',
      body: data,
    }),

  updateEmergencyContacts: (data) =>
    apiRequest('/user/emergency-contacts', {
      method: 'PUT',
      body: data,
    }),

  getLedger: () => apiRequest('/user/ledger'),
};

export default api;
