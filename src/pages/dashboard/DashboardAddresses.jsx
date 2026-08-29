import React, { useState, useEffect } from 'react';
import { MapPin, Edit3, X, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DashboardLayout from './DashboardLayout';

export default function DashboardAddresses() {
  const { currentUser, setCurrentUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAddress = async () => {
      setIsLoading(true);
      try {
        // 1. Check local storage
        const userId = currentUser?._id || currentUser?.id || currentUser?.phone || 'guest';
        let cached = null;
        try {
          cached = JSON.parse(localStorage.getItem(`safedrive_addresses_${userId}`) || 'null');
        } catch (e) {
          console.error(e);
        }

        if (Array.isArray(cached) && cached.length > 0) {
          setAddresses(cached);
          return;
        }

        // 2. Fetch from orders
        try {
          const ordersRes = await api.getUserOrders();
          if (ordersRes.success && ordersRes.orders && ordersRes.orders.length > 0) {
            const ord = ordersRes.orders[0];
            const parsed = {
              id: 'addr_purchase_1',
              name: ord.customerName || currentUser?.name || 'Customer',
              phone: ord.customerPhone || currentUser?.phone || '',
              pincode: ord.pincode || ord.shippingAddress?.split('-')?.[1]?.trim() || '243001',
              locality: ord.city || 'Civil Lines',
              address: ord.shippingAddress || ord.deliveryAddress || 'Delivery Address Provided During Purchase',
              city: ord.city || 'Bareilly',
              state: ord.state || 'Uttar Pradesh',
              addressType: 'HOME',
              isDefault: true,
            };
            setAddresses([parsed]);
            localStorage.setItem(`safedrive_addresses_${userId}`, JSON.stringify([parsed]));
            return;
          }
        } catch (e) {
          console.error(e);
        }

        // 3. Fallback to currentUser profile
        if (currentUser?.deliveryAddress || currentUser?.address) {
          const addr = {
            id: 'addr_profile_1',
            name: currentUser.name || 'Customer',
            phone: currentUser.phone || '',
            pincode: '243001',
            locality: 'Civil Lines',
            address: currentUser.deliveryAddress || currentUser.address,
            city: 'Bareilly',
            state: 'Uttar Pradesh',
            addressType: 'HOME',
            isDefault: true,
          };
          setAddresses([addr]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAddress();
  }, [currentUser]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!editingAddress) return;

    const fullAddrString = `${editingAddress.address}, ${editingAddress.locality}, ${editingAddress.city}, ${editingAddress.state} - ${editingAddress.pincode}`;
    const updatedList = addresses.map(a => a.id === editingAddress.id ? { ...editingAddress } : a);
    setAddresses(updatedList);

    const userId = currentUser?._id || currentUser?.id || currentUser?.phone || 'guest';
    try {
      localStorage.setItem(`safedrive_addresses_${userId}`, JSON.stringify(updatedList));
      await api.updateProfile({
        deliveryAddress: fullAddrString,
        address: fullAddrString,
      });
      if (setCurrentUser) {
        setCurrentUser({
          ...currentUser,
          deliveryAddress: fullAddrString,
          address: fullAddrString,
        });
      }
    } catch (err) {
      console.error(err);
    }

    setEditingAddress(null);
    setSaveSuccessMsg('Delivery Address updated successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  return (
    <DashboardLayout currentTab="addresses" pageTitle="Manage Addresses" saveSuccessMsg={saveSuccessMsg}>
      <div className="bg-white rounded-sm shadow-sm border border-gray-200/80 p-4 sm:p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#212121]">
              Manage Delivery Addresses
            </h2>
            <p className="text-xs text-[#878787] mt-0.5">
              Address synchronized from your tag purchase order
            </p>
          </div>
        </div>

        {/* Address Cards List */}
        <div className="space-y-4 max-w-2xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <RefreshCw size={32} className="text-[#fb641b] animate-spin" style={{ animationDuration: '1.2s' }} />
              <p className="text-sm font-bold text-[#1a2a4a]">Loading delivery addresses...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">No saved addresses found.</p>
            </div>
          ) : addresses.map((addr) => (
            <div
              key={addr.id}
              className="border border-gray-200 rounded-sm p-4 sm:p-5 relative bg-[#fcfcfc] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {addr.addressType || 'HOME'}
                  </span>
                  <span className="text-sm font-bold text-[#212121]">{addr.name}</span>
                  <span className="font-bold text-xs text-gray-700 ml-2">+91 {addr.phone}</span>
                </div>

                <button
                  onClick={() => setEditingAddress({ ...addr })}
                  className="text-xs font-bold text-[#2874f0] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 size={13} /> Edit Address
                </button>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <strong className="text-gray-900">{addr.pincode}</strong>
              </p>

              <div className="pt-2 flex items-center gap-2 text-[11px] text-green-700 font-semibold">
                <CheckCircle2 size={13} className="text-green-600" />
                <span>Primary delivery address used for physical QR kits dispatch</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Edit Address Modal */}
      {editingAddress && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-sm max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-[#2874f0] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <h3 className="text-base font-bold">Edit Delivery Address</h3>
              </div>
              <button
                onClick={() => setEditingAddress(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold uppercase mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editingAddress.name}
                    onChange={(e) => setEditingAddress({ ...editingAddress, name: e.target.value })}
                    className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold uppercase mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={editingAddress.phone}
                    onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold uppercase mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  value={editingAddress.pincode}
                  onChange={(e) => setEditingAddress({ ...editingAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2 text-sm font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold uppercase mb-1">Street Address / House No.</label>
                <textarea
                  rows={2}
                  required
                  value={editingAddress.address}
                  onChange={(e) => setEditingAddress({ ...editingAddress, address: e.target.value })}
                  className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2 text-sm outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold uppercase mb-1">City / District</label>
                  <input
                    type="text"
                    required
                    value={editingAddress.city}
                    onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                    className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold uppercase mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={editingAddress.state}
                    onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                    className="w-full border border-gray-300 focus:border-[#2874f0] rounded-sm px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingAddress(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-2.5 rounded-sm text-xs shadow-sm cursor-pointer uppercase"
                >
                  SAVE ADDRESS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
