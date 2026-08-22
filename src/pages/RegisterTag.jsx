import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Car, 
  Bike, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  QrCode, 
  Sparkles,
  Lock,
  Briefcase,
  User,
  Phone,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function RegisterTag() {
  const { id } = useParams();
  const token = id;
  const navigate = useNavigate();
  const { currentUser, setAuthenticatedSession } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    whatsappNumber: currentUser?.whatsappNumber || currentUser?.phone || '',
    address: currentUser?.address || '',
    vehicleBrand: 'Hyundai',
    vehicleName: 'Creta',
    vehicleNumber: '',
    vehicleType: 'Car',
    emergencyContact1Name: 'Family Contact 1',
    emergencyContact1Number: '',
    emergencyContact2Name: 'Family Contact 2',
    emergencyContact2Number: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setVehicleType = (type) => {
    setFormData((prev) => ({ ...prev, vehicleType: type }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit primary mobile number.');
      return;
    }

    if (!formData.vehicleNumber.trim()) {
      setError('Please enter your vehicle registration number.');
      return;
    }

    setIsLoading(true);
    try {
      const emergencyContacts = [];
      if (formData.emergencyContact1Number.trim()) {
        emergencyContacts.push({
          name: formData.emergencyContact1Name.trim() || 'Contact 1',
          number: formData.emergencyContact1Number.replace(/\D/g, ''),
        });
      }
      if (formData.emergencyContact2Number.trim()) {
        emergencyContacts.push({
          name: formData.emergencyContact2Name.trim() || 'Contact 2',
          number: formData.emergencyContact2Number.replace(/\D/g, ''),
        });
      }

      const payload = {
        name: formData.name.trim() || `User ${cleanPhone.slice(-4)}`,
        phone: cleanPhone,
        whatsappNumber: formData.whatsappNumber.replace(/\D/g, '') || cleanPhone,
        address: formData.address.trim() || 'Not specified',
        vehicleBrand: formData.vehicleBrand.trim() || formData.vehicleType,
        vehicleName: formData.vehicleName.trim() || 'My Vehicle',
        vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),
        emergencyContacts,
      };

      const res = await api.registerQrKit(token, payload);
      if (res.success) {
        setIsSuccess(true);
        setSuccessData(res);
        if (res.token) {
          setAuthenticatedSession(res.token, res.user);
        }
      } else {
        setError(res.message || 'Registration failed. Please check details and try again.');
      }
    } catch (err) {
      setError('Failed to activate tag. Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const vehicleTypes = [
    { id: 'Car', label: 'Car / SUV', icon: <Car className="w-4 h-4" /> },
    { id: 'Bike', label: 'Bike / Scooter', icon: <Bike className="w-4 h-4" /> },
    { id: 'Luggage', label: 'Luggage / Bag', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'Truck', label: 'Commercial / Truck', icon: <Truck className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-orange-50/30 flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 relative z-10 overflow-hidden font-sans">
      
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-black/5 p-6 sm:p-9 relative z-10 border border-black/5">
        
        {isSuccess ? (
          <div className="text-center py-6 animate-fade-up">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black mb-2">Tag Kit Activated Successfully!</h2>
            <p className="text-sm text-black/60 font-medium mb-6">
              Tag ID <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">{token}</span> is now linked with <strong className="text-black">{formData.vehicleBrand} {formData.vehicleName} ({formData.vehicleNumber})</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                to="/dashboard" 
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-black px-7 py-3.5 rounded-xl text-sm transition-all shadow-md shadow-green-500/20"
              >
                Go to My Dashboard &rarr;
              </Link>
              <Link 
                to={`/q/${token}`} 
                className="w-full sm:w-auto bg-white hover:bg-black/5 text-black font-bold px-7 py-3.5 rounded-xl text-sm border border-black/10 transition-all"
              >
                Test Live QR Scan Page
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-black/5">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={13} className="text-orange-500" /> New Tag Activation
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                  Link & Activate Your SafeDrive Tag
                </h1>
                <p className="text-xs sm:text-sm text-black/60 font-medium mt-1">
                  Connect your vehicle or travel bag to start receiving masked calls & emergency SMS alerts.
                </p>
              </div>

              {/* Tag ID Pill */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Tag Token</span>
                <div className="flex items-center gap-1.5 bg-black/5 border border-black/10 px-3 py-1.5 rounded-xl text-xs font-mono font-black text-black">
                  <QrCode size={14} className="text-orange-600" />
                  <span>{token || 'SD-DEMO'}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 text-red-600 border border-red-200 text-xs sm:text-sm font-semibold rounded-xl p-3 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Vehicle Type Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/70 mb-2">
                  1. Tag Attached To:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {vehicleTypes.map(({ id: typeId, label, icon }) => (
                    <button
                      key={typeId}
                      type="button"
                      onClick={() => setVehicleType(typeId)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        formData.vehicleType === typeId
                          ? 'border-orange-500 bg-orange-50/80 text-orange-600 shadow-sm'
                          : 'border-black/5 bg-black/[0.02] text-black/60 hover:bg-black/5'
                      }`}
                    >
                      {icon}
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 sm:p-5 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-black/80 flex items-center gap-2">
                  <Car size={14} className="text-orange-500" /> 2. Vehicle Identification
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-black/60 mb-1">Vehicle Brand / Make</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyundai, Honda, Maruti"
                      name="vehicleBrand"
                      value={formData.vehicleBrand}
                      onChange={handleChange}
                      className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-black/60 mb-1">Model Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Creta, City, Swift"
                      name="vehicleName"
                      value={formData.vehicleName}
                      onChange={handleChange}
                      className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-black/60 mb-1">
                    Registration Plate Number (e.g. RJ-14-AB-2024)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full registration plate"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-sm font-black tracking-wider outline-none focus:border-orange-500 uppercase"
                  />
                </div>
              </div>

              {/* Owner Contact Information */}
              <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 sm:p-5 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-black/80 flex items-center gap-2">
                  <User size={14} className="text-orange-500" /> 3. Owner Private Contacts
                </h3>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-black/60 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-black/60 mb-1">Primary Calling Number (10 Digits)</label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      placeholder="e.g. 9876543210"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-black/60 mb-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Same as phone or alternate"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-black/60 mb-1">City / Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Sector 5, Jaipur"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 sm:p-5 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-2">
                  <Phone size={14} className="text-red-500" /> 4. Emergency SOS Contacts (Optional)
                </h3>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-black/60 mb-1">Contact 1 Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Pooja (Wife)"
                      name="emergencyContact1Name"
                      value={formData.emergencyContact1Name}
                      onChange={handleChange}
                      className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-black/60 mb-1">Contact 1 Phone Number</label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="e.g. 9876500001"
                      name="emergencyContact1Number"
                      value={formData.emergencyContact1Number}
                      onChange={handleChange}
                      className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-[1.01]"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Activating Tag Kit...
                  </>
                ) : (
                  <>
                    <span>Activate Tag Kit Now</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-[11px] text-black/50 flex items-center justify-center gap-1">
                  <Lock size={12} className="text-green-600" />
                  Your phone number is encrypted and never shown to callers.
                </p>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
