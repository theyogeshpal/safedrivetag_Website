import React, { useState, useRef } from 'react';
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
  MapPin,
  KeyRound,
  AlertTriangle,
  HeartPulse,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function RegisterTag() {
  const { id } = useParams();
  const token = id;
  const navigate = useNavigate();
  const { currentUser, setAuthenticatedSession } = useAuth();

  // Wizard Step: 1 = Phone Entry & OTP Send, 2 = OTP Verification, 3 = Vehicle & Emergency Contacts
  const [step, setStep] = useState(1);
  
  // Phone & Auth State
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [useSameWhatsApp, setUseSameWhatsApp] = useState(true);
  const [securityCode, setSecurityCode] = useState('5781');
  const otpInputRefs = useRef([]);

  // Vehicle & Mandatory 2 Emergency Contacts Details
  const [formData, setFormData] = useState({
    itemTitle: '',
    vehicleBrand: '',
    vehicleName: '',
    vehicleNumber: '',
    vehicleType: 'Luggage',
    gender: 'Male',
    whatsappNumber: currentUser?.whatsappNumber || currentUser?.phone || '',
    address: currentUser?.address || '',
    emergencyContact1Name: '',
    emergencyContact1Number: '',
    emergencyContact2Name: '',
    emergencyContact2Number: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  
  // Track if the QR is fundamentally a vehicle or item tag
  const [qrCategory, setQrCategory] = useState(null); // 'vehicle' | 'item' | null

  // Fetch Public QR Metadata & Security PIN on mount
  React.useEffect(() => {
    async function fetchTagMeta() {
      try {
        const res = await api.getPublicQrInfo(token);
        if (res && res.success) {
          const pin = res.securityCode || res.pin || res.qr?.securityCode || res.qr?.pin;
          if (pin) setSecurityCode(String(pin));
          
          const cat = res.qrFor || (res.qrType === 'PHYSICAL' ? 'Car' : 'Luggage');
          const isVehicleCat = ['Car', 'Bike', 'Truck', 'Commercial / Truck'].includes(cat);
          setQrCategory(isVehicleCat ? 'vehicle' : 'item');
          
          setFormData(prev => ({
            ...prev,
            vehicleType: cat,
            
          }));
        }
      } catch (err) {
        console.error('Error loading QR info', err);
      }
    }
    if (token) {
      fetchTagMeta();
    }
  }, [token]);

  // --- Step 1: Send OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.sendActivationOtp({
        phone: cleanPhone,
        name: name.trim() || 'Tag Owner',
        token: token,
      });

      if (res.success === true || (res.success !== false && res.status === 200)) {
        setStep(2);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        let errorMessage = res.message || 'Failed to send OTP to this number. Please check the number and try again.';
        if (errorMessage.toLowerCase().includes('pending order nahi mila') || errorMessage.toLowerCase().includes('is mobile number par')) {
          errorMessage = 'Eligible Order Not Found: No pending QR Kit order found for this mobile number. Please check your registered purchase mobile number or place a new order on our website.';
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError('Network error while sending OTP. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 2: Handle OTP Input & Verify ---
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/\D/g, '');
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.verifyActivationOtp({
        phone: cleanPhone,
        otp: enteredOtp,
        token: token,
      });

      if (res.success === true || (res.success !== false && res.status === 200)) {
        setIsPhoneVerified(true);
        if (res.token) {
          setAuthenticatedSession(res.token, res.user || { phone: cleanPhone, name });
        }
        setStep(3);
      } else {
        setError(res.message || 'Invalid or expired OTP. Please enter the correct code.');
      }
    } catch (err) {
      setError('Verification failed. Please check network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 3: Complete Vehicle & Mandatory 2 Emergency Contacts Registration ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/\D/g, '');
    
    // Validate Owner Name
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const isVehicle = ['Car', 'Bike', 'Truck', 'Commercial / Truck', 'General'].includes(formData.vehicleType);

    // Vehicle Specific Validations
    if (isVehicle && formData.vehicleType !== 'General') {
      if (!formData.vehicleNumber?.trim()) {
        setError('Please enter your Vehicle Registration Number (e.g. DL 01 AB 1234).');
        return;
      }
      if (!formData.vehicleBrand?.trim()) {
        setError('Please enter your Vehicle Brand / Make (e.g. Hyundai, Tata, Maruti, Honda).');
        return;
      }
      if (!formData.vehicleName?.trim() && !formData.itemTitle?.trim()) {
        setError('Please enter your Vehicle Model / Name (e.g. Creta, Swift, Nexon, Activa).');
        return;
      }
    } else {
      if (!formData.itemTitle?.trim() && !formData.vehicleName?.trim()) {
        setError('Please enter an Item / Tag Title.');
        return;
      }
    }

    // Strictly Validate Emergency Contact 1
    const c1 = formData.emergencyContact1Number.replace(/\D/g, '');
    const c2 = formData.emergencyContact2Number.replace(/\D/g, '');

    if (!c1 || c1.length !== 10) {
      setError('Please enter a valid 10-digit mobile number for Emergency SOS Contact 1.');
      return;
    }

    if (c2 && c1 === c2) {
      setError('Emergency Contact 1 and Contact 2 must be different numbers.');
      return;
    }

    if (c1 === cleanPhone || (c2 && c2 === cleanPhone)) {
      setError('Emergency contacts must be different from your own registered phone number.');
      return;
    }

    setIsLoading(true);
    try {
      const emergencyContacts = [
        {
          name: formData.emergencyContact1Name.trim() || 'Primary Emergency Contact',
          number: c1,
        },
        {
          name: formData.emergencyContact2Name.trim() || 'Secondary Emergency Contact',
          number: c2,
        },
      ];

      const contact1Name = formData.emergencyContact1Name.trim() || 'Primary Emergency Contact';
      const contact2Name = formData.emergencyContact2Name.trim() || 'Secondary Emergency Contact';
      
      const vBrand = formData.vehicleBrand?.trim() || 'SafeDrive';
      const vModel = formData.vehicleName?.trim() || formData.itemTitle?.trim() || `${formData.vehicleType} Safety Tag`;
      const vPlate = (formData.vehicleNumber?.trim() || (isVehicle ? formData.itemTitle?.trim() : token) || 'DL01XX0000').toUpperCase();

      const payload = {
        name: name.trim() || currentUser?.name || 'Tag Owner',
        phone: cleanPhone || currentUser?.phone || '',
        email: currentUser?.email || '',
        whatsappNumber: useSameWhatsApp ? cleanPhone : (formData.whatsappNumber?.replace(/\D/g, '') || cleanPhone),
        gender: formData.gender || 'Male',
        itemTitle: vModel,
        vehicleBrand: vBrand,
        vehicleName: vModel,
        vehicleNumber: vPlate,
        plateNumber: vPlate,
        vehicleType: formData.vehicleType || 'Car',
        itemCategory: formData.vehicleType || 'Car',
        securityCode: String(securityCode || '5781'),
        pin: String(securityCode || '5781'),
        contact1Name,
        contact1Phone: c1,
        contact2Name,
        contact2Phone: c2,
        address: formData.address?.trim() || currentUser?.address || '',
        emergencyContacts,
      };

      const res = await api.registerQrKit(token, payload);
      if (res.success === true || (res.success !== false && (res.status === 200 || res.message?.toLowerCase().includes('success') || res.kit))) {
        setIsSuccess(true);
        setSuccessData(res);
        if (res.token) {
          setAuthenticatedSession(res.token, res.user);
        }
      } else {
        setError(res.message || 'Tag registration failed. Please ensure all required fields are filled.');
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
    <div className="min-h-screen bg-orange-50/30 flex items-center justify-center pt-36 sm:pt-40 lg:pt-44 pb-16 px-4 sm:px-6 relative z-10 overflow-hidden font-sans">
      
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-black/5 p-6 sm:p-9 relative z-10 border border-black/5">
        
        {isSuccess ? (
          /* Confirmation Success Screen */
          <div className="text-center py-6 animate-fade-up">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black mb-2">Tag Kit Activated Successfully!</h2>
            <p className="text-sm text-black/60 font-medium mb-6">
              Your tag is now active and linked to <strong className="text-black">{name || 'your account'}</strong>.
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
            <div className="mb-6 pb-6 border-b border-black/5">
              <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles size={13} className="text-orange-500" /> New Tag Activation
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Link & Activate SafeDrive-Tag
              </h1>
              <p className="text-xs sm:text-sm text-black/60 font-medium mt-1">
                Step-by-step verification with 2 mandatory emergency SOS contacts for complete safety.
              </p>
            </div>

            {/* 3-Step Wizard Progress Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 text-center text-xs font-bold">
              <div className={`py-2 px-2.5 rounded-xl border transition-all ${
                step === 1 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs font-black' 
                  : isPhoneVerified 
                    ? 'bg-green-50 text-green-700 border-green-200 font-bold' 
                    : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                1. Mobile Number
              </div>
              <div className={`py-2 px-2.5 rounded-xl border transition-all ${
                step === 2 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs font-black' 
                  : isPhoneVerified 
                    ? 'bg-green-50 text-green-700 border-green-200 font-bold' 
                    : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                2. Verify OTP
              </div>
              <div className={`col-span-2 sm:col-span-1 py-2 px-2.5 rounded-xl border transition-all ${
                step === 3 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs font-black' 
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                3. Contact Details
              </div>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 text-red-600 border border-red-200 text-xs sm:text-sm font-semibold rounded-xl p-3 text-center">
                {error}
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 1: MOBILE NUMBER ENTRY */}
            {/* ======================================================== */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-5 animate-fade-up">
                <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-black/80">
                    <Phone size={14} className="text-orange-500" />
                    <span>Enter Owner Mobile Number</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-black/60 mb-1">
                      10-Digit Mobile Number (For Receiving Calls & SMS)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-bold text-black/50">IN +91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        autoFocus
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-white border border-black/10 rounded-xl py-3 pl-18 pr-4 text-sm font-black text-black outline-none focus:border-orange-500 tracking-wider"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phone.length !== 10}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Sending OTP Code...
                    </>
                  ) : (
                    <>
                      <span>Send Verification OTP</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-black/50 flex items-center justify-center gap-1">
                  <Lock size={12} className="text-green-600" />
                  Your phone number will stay 100% private & masked.
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* STEP 2: OTP CODE VERIFICATION */}
            {/* ======================================================== */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-up">
                <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-5 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                    <KeyRound size={22} />
                  </div>

                  <div>
                    <h3 className="font-black text-base text-black">Enter 6-Digit OTP</h3>
                    <p className="text-xs text-black/50 mt-1">
                      We sent a verification code to <strong>+91 {phone}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-orange-600 font-bold hover:underline mt-1 cursor-pointer"
                    >
                      Change Number
                    </button>
                  </div>

                  {/* 6 OTP Digit Inputs */}
                  <div className="flex justify-center gap-2 my-4">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border-2 border-black/10 focus:border-orange-500 focus:bg-orange-50/20 bg-white outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length < 4}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 transition-all cursor-pointer hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Code...
                    </>
                  ) : (
                    <>
                      <span>Verify OTP & Enter Contact Details</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ======================================================== */}
            {/* STEP 3: ITEM DETAILS, SECURITY PIN & 2 EMERGENCY CONTACTS */}
            {/* ======================================================== */}
            {step === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-5 animate-fade-up">
                
                {/* 1. 4-DIGIT SECURITY TAG PIN (Readonly / Pre-filled) */}
                <div className="bg-amber-50/60 border border-amber-200/90 rounded-2xl p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                      🔑 4-DIGIT SECURITY TAG PIN *
                    </span>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold text-xs px-2.5 py-0.5 rounded-md">
                      PIN: {securityCode || '5781'}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800/80 leading-relaxed">
                    Enter the 4-digit security PIN printed directly on your physical tag sticker or assigned to your digital pass.
                  </p>
                  <div className="pt-1">
                    <input
                      type="text"
                      readOnly
                      value={securityCode || '5781'}
                      className="w-full text-center text-3xl font-black font-mono tracking-widest bg-white border-2 border-amber-300/80 text-amber-950 py-3 rounded-xl outline-none shadow-xs"
                    />
                  </div>
                </div>

                {/* 2. Item Category / Type (Hidden) */}
                <div className="space-y-1.5 hidden">
                  <label className="block text-xs font-bold text-black/80">
                    Category / Tag Type *
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        vehicleType: newType,
                      }));
                    }}
                    className="w-full bg-gray-50/70 border border-black/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all text-black cursor-pointer"
                  >
                    {(!qrCategory || qrCategory === 'vehicle') && (
                      <>
                        <option value="Car">🚗 Car / SUV / Sedan</option>
                        <option value="Bike">🏍️ Bike / Scooter / 2-Wheeler</option>
                        <option value="Truck">🚚 Commercial / Truck / Taxi</option>
                      </>
                    )}
                    {(!qrCategory || qrCategory === 'item') && (
                      <>
                        <option value="Luggage">🧳 Luggage / Suitcase</option>
                        <option value="Personal Bag">🎒 Personal Bag / Backpack</option>
                        <option value="Pet">🐾 Pet Tag</option>
                        <option value="General">🏷️ General Asset</option>
                      </>
                    )}
                  </select>
                </div>

                {/* 3. Dynamic Vehicle Details or Item Details */}
                {['Car', 'Bike', 'Truck', 'Commercial / Truck'].includes(formData.vehicleType) ? (
                  <div className="space-y-3 bg-blue-50/40 border border-blue-100 rounded-2xl p-4">
                    <span className="text-xs font-black text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                      🚘 Vehicle Registration Details
                    </span>

                    {/* Vehicle Plate Number */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-gray-700">
                        Vehicle Number / Plate Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DL 01 AB 1234 or HR 26 DK 8392"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData(p => ({ ...p, vehicleNumber: e.target.value.toUpperCase() }))}
                        className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider outline-none focus:border-blue-500 text-blue-950 font-mono shadow-2xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Vehicle Brand */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-gray-700">
                          Vehicle Brand / Make *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hyundai, Tata, Maruti, Honda"
                          name="vehicleBrand"
                          value={formData.vehicleBrand}
                          onChange={handleFormChange}
                          className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 text-gray-900 shadow-2xs"
                        />
                      </div>

                      {/* Vehicle Model */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-gray-700">
                          Vehicle Model / Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Creta, Swift, Nexon, Activa"
                          name="vehicleName"
                          value={formData.vehicleName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(p => ({ ...p, vehicleName: val, itemTitle: val }));
                          }}
                          className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 text-gray-900 shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-purple-50/40 border border-purple-100 rounded-2xl p-4">
                    <span className="text-xs font-black text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
                      🧳 Item / Asset Details
                    </span>

                    {/* Item Title */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-gray-700">
                        Item / Tag Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Blue Safari Trolley Bag"
                        name="itemTitle"
                        value={formData.itemTitle}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(p => ({ ...p, itemTitle: val, vehicleName: val }));
                        }}
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 text-gray-900 shadow-2xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {/* Color */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-gray-700">
                          Color (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Navy Blue, Black"
                          name="vehicleColor"
                          value={formData.vehicleColor}
                          onChange={handleFormChange}
                          className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 text-gray-900 shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Owner Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-black/80">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50/70 border border-black/10 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all text-black"
                  />
                </div>

                {/* 5. Gender */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-black/80">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    className="w-full bg-gray-50/70 border border-black/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all text-black cursor-pointer"
                  >
                    <option value="Male">👦 Male</option>
                    <option value="Female">👧 Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>



                {/* 7. Emergency Contact 1 (Primary) */}
                <div className="bg-gray-50/60 border border-black/10 rounded-2xl p-4 space-y-2.5">
                  <label className="block text-xs font-bold text-emerald-700">
                    Emergency Contact 1 (Primary) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Name (e.g. Brother / Spouse / Friend)"
                    name="emergencyContact1Name"
                    value={formData.emergencyContact1Name}
                    onChange={handleFormChange}
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500"
                  />
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-black/40">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      placeholder="9876543210"
                      name="emergencyContact1Number"
                      value={formData.emergencyContact1Number}
                      onChange={handleFormChange}
                      className="w-full bg-white border border-black/10 rounded-xl py-2.5 pl-12 pr-4 text-xs font-bold font-mono outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* 8. Emergency Contact 2 (Secondary) */}
                <div className="bg-gray-50/60 border border-black/10 rounded-2xl p-4 space-y-2.5">
                  <label className="block text-xs font-bold text-orange-600">
                    Emergency Contact 2 (Secondary - Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Name (e.g. Father / Mother / Colleague)"
                    name="emergencyContact2Name"
                    value={formData.emergencyContact2Name}
                    onChange={handleFormChange}
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-orange-500"
                  />
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-black/40">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      name="emergencyContact2Number"
                      value={formData.emergencyContact2Number}
                      onChange={handleFormChange}
                      className="w-full bg-white border border-black/10 rounded-xl py-2.5 pl-12 pr-4 text-xs font-bold font-mono outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* 9. Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Activating Tag...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>Activate & Shield {formData.vehicleType || 'Luggage'} Now &rarr;</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-[11px] text-black/50 flex items-center justify-center gap-1">
                    <Lock size={12} className="text-emerald-600" />
                    All contacts are encrypted & only notified during actual SOS emergencies.
                  </p>
                </div>

              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
