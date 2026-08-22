import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'safedrive_user';
const STORAGE_KEY_TAGS = 'safedrive_registered_tags';

// Initial demo seed data so users can test immediately with 9876543210 or new numbers
const INITIAL_DEMO_TAGS = [
  {
    id: 'SD-84920',
    name: 'Rahul Sharma',
    phone: '9876543210',
    emergencyContact: '9811223344',
    whatsapp: '9876543210',
    vehicleNumber: 'DL 01 AB 1234',
    vehicleName: 'Hyundai Creta',
    vehicleType: 'Car',
    status: 'active',
    registeredAt: '2025-01-15',
    scansCount: 4,
    callMaskingEnabled: true,
    whatsappAlertsEnabled: true,
  },
  {
    id: 'SD-19384',
    name: 'Rahul Sharma',
    phone: '9876543210',
    emergencyContact: '9811223344',
    whatsapp: '9876543210',
    vehicleNumber: 'HR 26 DQ 8821',
    vehicleName: 'Royal Enfield Classic 350',
    vehicleType: 'Bike',
    status: 'active',
    registeredAt: '2025-02-02',
    scansCount: 1,
    callMaskingEnabled: true,
    whatsappAlertsEnabled: true,
  }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [tags, setTags] = useState(() => {
    try {
      const savedTags = localStorage.getItem(STORAGE_KEY_TAGS);
      if (savedTags) {
        return JSON.parse(savedTags);
      }
      localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(INITIAL_DEMO_TAGS));
      return INITIAL_DEMO_TAGS;
    } catch {
      return INITIAL_DEMO_TAGS;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync tags to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(tags));
    } catch (e) {
      console.error('Failed to save tags to localStorage', e);
    }
  }, [tags]);

  // Sync user to localStorage
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

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Mock OTP Generation & Sending
  const sendOtp = async (phone) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      otp: '1234',
      message: `OTP sent successfully to +91 ${phone}`,
    };
  };

  // Verify OTP and Log In
  const verifyOtp = async (phone, otp) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Accept demo OTP '1234' or any 4-digit code in dev
    if (otp === '1234' || otp.length === 4) {
      const userTags = tags.filter((t) => t.phone === phone);
      const existingName = userTags.length > 0 ? userTags[0].name : '';

      const userObj = {
        phone,
        name: existingName || `User ${phone.slice(-4)}`,
        loginAt: new Date().toISOString(),
      };

      setCurrentUser(userObj);
      closeLoginModal();
      return { success: true, user: userObj };
    } else {
      return { success: false, message: 'Invalid OTP! Please enter 1234 for demo.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Get all tags for currently logged in user (or by phone)
  const getUserTags = (phone = currentUser?.phone) => {
    if (!phone) return [];
    return tags.filter((t) => t.phone === phone);
  };

  // Register a new tag or link to phone
  const registerTag = (tagData) => {
    const existingIndex = tags.findIndex((t) => t.id === tagData.id);
    const newTag = {
      id: tagData.id,
      name: tagData.name || '',
      phone: tagData.phone,
      emergencyContact: tagData.emergencyContact || '',
      whatsapp: tagData.whatsapp || tagData.phone,
      vehicleNumber: tagData.vehicleNumber || 'Not Specified',
      vehicleName: tagData.vehicleName || 'My Vehicle',
      vehicleType: tagData.vehicleType || 'Car',
      status: tagData.status || 'active',
      registeredAt: tagData.registeredAt || new Date().toISOString().split('T')[0],
      scansCount: tagData.scansCount || 0,
      callMaskingEnabled: tagData.callMaskingEnabled ?? true,
      whatsappAlertsEnabled: tagData.whatsappAlertsEnabled ?? true,
    };

    if (existingIndex >= 0) {
      setTags((prev) => {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...newTag };
        return updated;
      });
    } else {
      setTags((prev) => [newTag, ...prev]);
    }

    if (currentUser && currentUser.phone === tagData.phone && tagData.name) {
      setCurrentUser((prev) => ({ ...prev, name: tagData.name }));
    }

    return newTag;
  };

  // Update existing tag
  const updateTag = (tagId, updatedFields) => {
    setTags((prev) =>
      prev.map((t) => (t.id === tagId ? { ...t, ...updatedFields } : t))
    );
  };

  // Delete / Unlink tag
  const deleteTag = (tagId) => {
    setTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  // Update user profile info
  const updateUserProfile = (profileData) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...profileData };
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        sendOtp,
        verifyOtp,
        logout,
        tags,
        getUserTags,
        registerTag,
        updateTag,
        deleteTag,
        updateUserProfile,
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
