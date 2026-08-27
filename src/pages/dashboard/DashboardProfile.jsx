import React, { useState } from 'react';
import { User, Mail, Phone, Edit2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DashboardLayout from './DashboardLayout';
import { showToast, showConfirmDialog } from '../../utils/swal';

export default function DashboardProfile() {
  const { currentUser, updateUserProfile } = useAuth();

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [firstName, setFirstName] = useState(currentUser?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(currentUser?.name?.split(' ').slice(1).join(' ') || '');
  const [gender, setGender] = useState(currentUser?.gender || 'Male');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const res = await api.updateProfile({
        name: fullName,
        email: email.trim(),
        gender,
      });

      if (res.success) {
        if (updateUserProfile) {
          updateUserProfile({
            name: fullName,
            email: email.trim(),
            gender,
          });
        }
        setIsEditingPersonal(false);
        showToast.success('Personal Information updated successfully!');
      } else {
        showToast.error(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      showToast.error('Error updating profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // const handleDeactivate = async () => {
  //   const confirmed = await showConfirmDialog({
  //     title: 'Deactivate Account?',
  //     text: 'Are you sure you want to deactivate your SafeDrive account? This will pause all QR protections.',
  //     confirmText: 'Yes, Deactivate',
  //     cancelText: 'Cancel',
  //     icon: 'warning',
  //   });

  //   if (confirmed) {
  //     try {
  //       await api.deactivateAccount();
  //       showToast.success('Account deactivated.');
  //       window.location.href = '/';
  //     } catch (err) {
  //       console.error(err);
  //       showToast.error('Could not deactivate account.');
  //     }
  //   }
  // };

  return (
    <DashboardLayout currentTab="profile" pageTitle="Profile Information" saveSuccessMsg={saveSuccessMsg}>
      <div className="bg-white rounded-sm shadow-sm border border-gray-200/80 p-4 sm:p-6 space-y-6 text-[#212121]">
        
        {/* Personal Information Section */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-base font-bold text-[#212121]">Personal Information</h3>
            <button
              onClick={() => setIsEditingPersonal(!isEditingPersonal)}
              className="ml-auto bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2874f0] px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Edit2 size={14} /> {isEditingPersonal ? 'Cancel' : 'Update Profile'}
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div>
                <label className="block text-xs font-semibold text-[#878787] mb-1">First Name</label>
                <input
                  type="text"
                  required
                  disabled={!isEditingPersonal}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full border rounded-sm px-3 py-2 text-sm outline-none transition-colors ${
                    isEditingPersonal ? 'border-[#2874f0] bg-white' : 'border-gray-200 bg-[#fafafa] text-gray-700'
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#878787] mb-1">Last Name</label>
                <input
                  type="text"
                  disabled={!isEditingPersonal}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full border rounded-sm px-3 py-2 text-sm outline-none transition-colors ${
                    isEditingPersonal ? 'border-[#2874f0] bg-white' : 'border-gray-200 bg-[#fafafa] text-gray-700'
                  }`}
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#878787] mb-2">Your Gender</label>
              <div className="flex items-center gap-6 text-sm">
                {['Male', 'Female'].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      disabled={!isEditingPersonal}
                      checked={gender === g}
                      onChange={(e) => setGender(e.target.value)}
                      className="accent-[#2874f0]"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {isEditingPersonal && (
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-sm text-xs shadow-sm transition-all uppercase cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'SAVE CHANGES'}
              </button>
            )}
          </form>
        </div>

        {/* Email Address Section */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-base font-bold text-[#212121]">Email Address</h3>
          </div>
          <div className="max-w-lg">
            <div className="flex items-center gap-2 border border-gray-200 bg-[#fafafa] rounded-sm px-3 py-2 text-sm text-gray-700">
              <Mail size={15} className="text-gray-400" />
              <span>{currentUser?.email || 'No email linked'}</span>
            </div>
          </div>
        </div>

        {/* Mobile Number Section */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-base font-bold text-[#212121]">Mobile Number</h3>
          </div>
          <div className="max-w-lg">
            <div className="flex items-center gap-2 border border-gray-200 bg-[#fafafa] rounded-sm px-3 py-2 text-sm text-gray-700">
              <Phone size={15} className="text-gray-400" />
              <span>+91 {currentUser?.phone}</span>
              <span className="ml-auto bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#878787]">FAQs</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div>
              <p className="font-bold text-gray-800">What happens when I update my email address (or mobile number)?</p>
              <p className="mt-0.5">Your login details will be updated, and all emergency scan alerts will be delivered to the new contact details.</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">Why is my vehicle plate number locked?</p>
              <p className="mt-0.5">Vehicle plate numbers are cryptographically linked to your physical QR kit to prevent unauthorized transfer or counterfeit stickers.</p>
            </div>
          </div>
        </div>

        {/* Deactivate Account
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handleDeactivate}
            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert size={14} /> Deactivate Account
          </button>
        </div> */}

      </div>
    </DashboardLayout>
  );
}
