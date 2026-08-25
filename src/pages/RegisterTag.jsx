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

  // Wizard Step: 1 = Phone Entry, 2 = OTP Verification, 3 = Vehicle & 2 Emergency Contacts
  const [step, setStep] = useState(currentUser?.phone ? 3 : 1);
  
  // Phone & Auth State
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isPhoneVerified, setIsPhoneVerified] = useState(!!currentUser?.phone);
  const otpInputRefs = useRef([]);

  // Vehicle & Mandatory 2 Emergency Contacts Details
  const [formData, setFormData] = useState({
    vehicleBrand: 'Hyundai',
    vehicleName: 'Creta',
    vehicleNumber: '',
    vehicleType: 'Car',
    whatsappNumber: currentUser?.whatsappNumber || currentUser?.phone || '',
    address: currentUser?.address || '',
    emergencyContact1Name: 'Family Member 1',
    emergencyContact1Number: '',
    emergencyContact2Name: 'Family Member 2',
    emergencyContact2Number: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

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
      });

      if (res.success || res.status === 200) {
        setStep(2);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        setError(res.message || 'Failed to send OTP to this number. Please check the number and try again.');
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
      });

      if (res.success || res.status === 200) {
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

  const setVehicleType = (type) => {
    setFormData((prev) => ({ ...prev, vehicleType: type }));
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

    // Strictly Validate 2 Mandatory Emergency Contacts
    const c1 = formData.emergencyContact1Number.replace(/\D/g, '');
    const c2 = formData.emergencyContact2Number.replace(/\D/g, '');

    if (!c1 || c1.length !== 10) {
      setError('Please enter a valid 10-digit mobile number for Emergency SOS Contact 1.');
      return;
    }

    if (!c2 || c2.length !== 10) {
      setError('Please enter a valid 10-digit mobile number for Emergency SOS Contact 2.');
      return;
    }

    if (c1 === c2) {
      setError('Emergency Contact 1 and Contact 2 must be two different mobile numbers.');
      return;
    }

    if (c1 === cleanPhone || c2 === cleanPhone) {
      setError('Emergency contacts must be different from your own registered phone number.');
      return;
    }

    setIsLoading(true);
    try {
      const emergencyContacts = [
        {
          name: formData.emergencyContact1Name.trim() || 'Primary Family Member',
          number: c1,
        },
        {
          name: formData.emergencyContact2Name.trim() || 'Alternate Emergency Contact',
          number: c2,
        },
      ];

      const contact1Name = formData.emergencyContact1Name.trim() || 'Primary Family Member';
      const contact2Name = formData.emergencyContact2Name.trim() || 'Alternate Emergency Contact';

      const payload = {
        name: name.trim() || currentUser?.name || 'Tag Owner',
        phone: cleanPhone || currentUser?.phone || '',
        email: currentUser?.email || '',
        whatsappNumber: formData.whatsappNumber?.replace(/\D/g, '') || cleanPhone || currentUser?.phone || '',
        vehicleBrand: 'SafeDrive',
        vehicleName: 'Protected Tag',
        vehicleNumber: '',
        vehicleType: 'General',
        securityCode: '9921',
        contact1Name,
        contact1Phone: c1,
        contact2Name,
        contact2Phone: c2,
        address: formData.address?.trim() || currentUser?.address || '',
        emergencyContacts,
      };

      const res = await api.registerQrKit(token, payload);
      if (res.success || res.status === 200 || res.message?.toLowerCase().includes('success') || res.kit) {
        setIsSuccess(true);
        setSuccessData(res);
        if (res.token) {
          setAuthenticatedSession(res.token, res.user);
        }
      } else {
        setError(res.message || 'Tag registration failed. Please ensure both emergency contacts are valid.');
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
              Tag ID <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">{token}</span> is now active and linked to <strong className="text-black">{name || 'your account'}</strong>.
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
                  Link & Activate SafeDrive-Tag
                </h1>
                <p className="text-xs sm:text-sm text-black/60 font-medium mt-1">
                  Step-by-step verification with 2 mandatory emergency SOS contacts for complete safety.
                </p>
              </div>

              {/* Tag Token Pill */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Tag Token</span>
                <div className="flex items-center gap-1.5 bg-black/5 border border-black/10 px-3 py-1.5 rounded-xl text-xs font-mono font-black text-black">
                  <QrCode size={14} className="text-orange-600" />
                  <span>{token || 'SD-TAG'}</span>
                </div>
              </div>
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
            {/* STEP 3: CONTACT DETAILS & MANDATORY 2 EMERGENCY CONTACTS */}
            {/* ======================================================== */}
            {step === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fade-up">
                
                {/* Verified Mobile Callout */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-green-800">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span>Registered Phone: +91 {phone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPhoneVerified(false);
                      setStep(1);
                    }}
                    className="text-xs text-green-700 underline font-bold cursor-pointer hover:text-green-900"
                  >
                    Change Number
                  </button>
                </div>

                {/* Section 1: Owner Profile & Contact Details */}
                <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 sm:p-5 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-black/80 flex items-center gap-2">
                    <User size={14} className="text-orange-500" /> 1. Owner Details
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-black/60 mb-1">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-black/60 mb-1">
                        WhatsApp Number <span className="text-xs font-normal text-black/40">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder={phone || "9876543210"}
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleFormChange}
                        className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: MANDATORY 2 EMERGENCY CONTACTS */}
                <div className="bg-red-50/50 border border-red-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-red-700 flex items-center gap-2">
                      <HeartPulse size={16} className="text-red-600" />
                      <span>2. Mandatory Emergency SOS Contacts (2 Required)</span>
                    </h3>
                    <span className="text-[10px] font-black bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full uppercase">
                      Mandatory
                    </span>
                  </div>

                  <p className="text-xs text-red-900/70 leading-relaxed font-medium">
                    SafeDrive instantly alerts these <strong>2 verified family/emergency contacts</strong> with live location in case of an accident or SOS trigger.
                  </p>

                  <div className="space-y-3.5">
                    
                    {/* Emergency Contact 1 */}
                    <div className="bg-white border border-red-200 rounded-xl p-3.5 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-red-800 flex items-center gap-1.5">
                          <User size={12} className="text-red-600" /> Contact 1 (Primary Family Member) *
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-black/50 mb-0.5">Relation / Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Papa / Spouse"
                            name="emergencyContact1Name"
                            value={formData.emergencyContact1Name}
                            onChange={handleFormChange}
                            className="w-full bg-gray-50 border border-black/10 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:bg-white focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-black/50 mb-0.5">10-Digit Mobile Number *</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-2.5 text-[11px] font-bold text-black/40">+91</span>
                            <input
                              type="tel"
                              maxLength={10}
                              required
                              placeholder="9876500001"
                              name="emergencyContact1Number"
                              value={formData.emergencyContact1Number}
                              onChange={handleFormChange}
                              className="w-full bg-gray-50 border border-black/10 rounded-lg py-2 pl-11 pr-3 text-xs font-bold font-mono outline-none focus:bg-white focus:border-red-500 tracking-wider"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact 2 */}
                    <div className="bg-white border border-red-200 rounded-xl p-3.5 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-red-800 flex items-center gap-1.5">
                          <User size={12} className="text-red-600" /> Contact 2 (Alternate Emergency Contact) *
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-black/50 mb-0.5">Relation / Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Brother / Friend"
                            name="emergencyContact2Name"
                            value={formData.emergencyContact2Name}
                            onChange={handleFormChange}
                            className="w-full bg-gray-50 border border-black/10 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:bg-white focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-black/50 mb-0.5">10-Digit Mobile Number *</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-2.5 text-[11px] font-bold text-black/40">+91</span>
                            <input
                              type="tel"
                              maxLength={10}
                              required
                              placeholder="9876500002"
                              name="emergencyContact2Number"
                              value={formData.emergencyContact2Number}
                              onChange={handleFormChange}
                              className="w-full bg-gray-50 border border-black/10 rounded-lg py-2 pl-11 pr-3 text-xs font-bold font-mono outline-none focus:bg-white focus:border-red-500 tracking-wider"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-emerald-600 hover:from-orange-600 hover:to-emerald-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Activating Tag Kit...
                    </>
                  ) : (
                    <>
                      <span>Complete & Activate SafeDrive-Tag</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-[11px] text-black/50 flex items-center justify-center gap-1">
                    <Lock size={12} className="text-green-600" />
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
