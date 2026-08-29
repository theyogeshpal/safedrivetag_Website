import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { getAuthToken, setAuthToken } from '../services/api';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'safedrive_user';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) return JSON.parse(savedUser);
      // Fallback: If token exists in localStorage, initialize user
      const token = localStorage.getItem('safedrive_token');
      if (token) {
        return { name: 'SafeDrive Customer', phone: '' };
      }
      return null;
    } catch {
      return null;
    }
  });

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isInitializingAuth, setIsInitializingAuth] = useState(true);

  // Sync user object to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to sync user to localStorage', e);
    }
  }, [currentUser]);

  // Fetch logged-in user profile on load if token exists
  const checkAuth = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setIsInitializingAuth(false);
      return;
    }

    try {
      setIsLoadingAuth(true);
      const res = await api.getCurrentUser();
      if (res.success && res.user) {
        setCurrentUser(res.user);
      }
    } catch (err) {
      console.error('Failed to fetch current user profile', err);
    } finally {
      setIsLoadingAuth(false);
      setIsInitializingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch Dashboard Kits & Balances
  const fetchDashboard = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return null;

    try {
      setIsLoadingAuth(true);
      const res = await api.getDashboard();
      if (res.success) {
        setDashboardData(res);
        if (res.user) {
          setCurrentUser((prev) => ({ ...prev, ...res.user }));
        }
        return res;
      }
      return null;
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      return null;
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Send Login OTP to Mobile Number
  const sendOtp = async (phoneOrData) => {
    try {
      const res = await api.sendLoginOtp(phoneOrData);
      return res;
    } catch (err) {
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  };

  // Verify Login OTP & Store Auth Token
  const verifyOtp = async (phoneOrData, otp) => {
    try {
      const res = await api.verifyLoginOtp(phoneOrData, otp);

      if (res.success && res.token) {
        setAuthToken(res.token);
        const cleanPhone = typeof phoneOrData === 'object' ? phoneOrData.phone : phoneOrData;
        const userObj = res.user || {
          phone: cleanPhone,
          name: `User ${String(cleanPhone).slice(-4)}`,
        };
        setCurrentUser(userObj);
        closeLoginModal();
        // Trigger dashboard load
        fetchDashboard();
        return { success: true, user: userObj, token: res.token };
      } else {
        return { success: false, message: res.message || 'Invalid OTP code' };
      }
    } catch (err) {
      return { success: false, message: 'Verification failed. Please try again.' };
    }
  };

  const logout = () => {
    setAuthToken('');
    setCurrentUser(null);
    setDashboardData(null);
  };

  // Update user profile locally & state
  const updateUserProfile = (profileData) => {
    setCurrentUser((prev) => ({ ...prev, ...profileData }));
  };

  // Set Auth state directly (e.g. after first-time QR registration)
  const setAuthenticatedSession = (token, user) => {
    if (token) setAuthToken(token);
    if (user) setCurrentUser(user);
    fetchDashboard();
  };

  // Global Notification Polling (ensures push alerts ring on ANY page, not just Notifications page)
  useEffect(() => {
    if (!currentUser) return;
    
    let intervalId;
    let lastTopNotificationId = sessionStorage.getItem('sd_global_last_noti_id');

    const pollGlobalNotifications = async () => {
      try {
        const { default: globalApi } = await import('../services/api');
        const res = await globalApi.getUserNotifications();
        if (res.success && res.notifications && res.notifications.length > 0) {
          const newTopId = res.notifications[0].id || res.notifications[0]._id;
          
          if (lastTopNotificationId && lastTopNotificationId !== newTopId) {
            const { showEmergencyPushAlert } = await import('../utils/swal');
            showEmergencyPushAlert(res.notifications[0].title, res.notifications[0].message);
          }
          
          lastTopNotificationId = newTopId;
          sessionStorage.setItem('sd_global_last_noti_id', newTopId);
        }
      } catch(e) { 
        // ignore polling errors
      }
    };

    // Delay the first check slightly to let initial app mount finish
    setTimeout(pollGlobalNotifications, 2000);

    // Poll every 10 seconds globally
    intervalId = setInterval(pollGlobalNotifications, 10000);

    return () => clearInterval(intervalId);
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        dashboardData,
        isLoadingAuth,
        isInitializingAuth,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        sendOtp,
        verifyOtp,
        logout,
        fetchDashboard,
        updateUserProfile,
        setAuthenticatedSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
