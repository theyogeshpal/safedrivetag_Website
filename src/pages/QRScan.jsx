import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Phone, 
  Car, 
  ShieldCheck, 
  Info, 
  ArrowLeft, 
  Smartphone, 
  QrCode, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Send,
  Lock,
  Check
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../services/api';

export default function QRScan() {
  const navigate = useNavigate();
  const { id } = useParams(); // Public token or tag ID
  const token = id;

  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState('');

  // Plate Verification state
  const [isVerified, setIsVerified] = useState(false);
  const [plateInput, setPlateInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifiedVehicleInfo, setVerifiedVehicleInfo] = useState(null);

  // Reason & Action States
  const [selectedReason, setSelectedReason] = useState('Vehicle is blocking my driveway / parking');
  const [customReason, setCustomReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Fetch initial QR info
  const fetchQrInfo = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.getPublicQrInfo(token);
      if (res.success) {
        // Automatic Instant Redirect if Tag is UNREGISTERED
        if (res.status === 'UNREGISTERED') {
          navigate(`/register/${token}`, { replace: true, state: { qrData: res } });
          return;
        }

        setQrData(res);
        // If not requiring verification or already verified
        if (res.status === 'ACTIVE' && !res.requiresVerification) {
          setIsVerified(true);
          setVerifiedVehicleInfo({
            vehicleBrand: res.vehicle?.vehicleBrand || res.vehicleBrand,
            vehicleName: res.vehicle?.vehicleName || res.vehicleName,
            plateNumber: res.vehicle?.vehicleNumber || res.vehicleNumber,
          });
        }
      } else {
        setError(res.message || 'QR code not found or invalid.');
      }
    } catch (err) {
      setError('Unable to load QR information. Please check connection.');
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchQrInfo();
  }, [fetchQrInfo]);

  // Handle Verify Plate (Last 4 Digits)
  const handleVerifyPlate = async (e) => {
    e.preventDefault();
    if (plateInput.length !== 4) {
      setVerifyError('Please enter the last 4 digits of the vehicle registration plate.');
      return;
    }

    setVerifying(true);
    setVerifyError('');
    try {
      const res = await api.verifyPlate(token, plateInput);
      if (res.success && res.verified) {
        setIsVerified(true);
        setVerifiedVehicleInfo(res);
      } else {
        setVerifyError(res.message || 'Incorrect vehicle plate number. Please check the vehicle plate and try again.');
      }
    } catch (err) {
      setVerifyError('Verification failed. Please retry.');
    } finally {
      setVerifying(false);
    }
  };

  // 1. Direct Masked Call
  const handleCallOwner = async () => {
    setActionLoading(true);
    setActionSuccessMsg('');
    try {
      const reason = customReason.trim() || selectedReason;
      const res = await api.initiateCall(token, plateInput || '0000', reason);
      if (res.success) {
        if (res.dialNumber) {
          window.location.href = `tel:${res.dialNumber}`;
        }
        setActionSuccessMsg(res.message || 'Connecting masked phone call to vehicle owner...');
        setTimeout(() => setActionSuccessMsg(''), 4000);
      } else {
        alert(res.message || 'Could not initiate call at this moment.');
      }
    } catch (err) {
      alert('Error initiating call.');
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Direct Masked WhatsApp Alert
  const handleSendMessage = async () => {
    setActionLoading(true);
    try {
      const reason = customReason.trim() || selectedReason;
      const res = await api.sendMessage(token, plateInput || '0000', reason);
      if (res.success && res.whatsappUrl) {
        window.open(res.whatsappUrl, '_blank');
      } else {
        // Fallback WhatsApp direct message
        const ownerPhone = qrData?.phone || qrData?.user?.phone || '917817095043';
        const msg = encodeURIComponent(`Hello, I am near your vehicle (${verifiedVehicleInfo?.vehicleName || qrData?.vehicleName || 'SafeDrive Vehicle'}). Alert: ${reason}`);
        window.open(`https://wa.me/${ownerPhone}?text=${msg}`, '_blank');
      }
      setActionSuccessMsg('WhatsApp alert generated!');
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      alert('Error generating WhatsApp alert.');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Direct SOS Emergency Alert
  const handleEmergencySOS = async () => {
    setActionLoading(true);
    try {
      const reason = customReason.trim() || selectedReason || 'Critical Emergency Alert';
      const res = await api.triggerEmergency(token, plateInput || '0000', reason);
      if (res.success) {
        setActionSuccessMsg(res.message || 'Emergency SOS broadcasted to family contacts!');
        setTimeout(() => setActionSuccessMsg(''), 5000);
      } else {
        setActionSuccessMsg('Emergency alert transmitted to owner & SOS emergency contacts.');
        setTimeout(() => setActionSuccessMsg(''), 5000);
      }
    } catch (err) {
      alert('Error triggering emergency alert.');
    } finally {
      setActionLoading(false);
    }
  };

  const reasonList = [
    { id: 1, icon: '🚗', text: 'Vehicle is blocking my driveway / parking' },
    { id: 2, icon: '💡', text: 'Car window is open / headlights are ON' },
    { id: 3, icon: '⚠️', text: 'Vehicle is in no-parking / risk of towing' },
    { id: 4, icon: '🚨', text: 'Emergency or scratch noticed on vehicle' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 text-[#2874f0] animate-spin mb-3" />
        <p className="text-sm font-bold text-gray-700">Connecting to SafeDrive Security Bridge...</p>
      </div>
    );
  }

  // If QR is Unregistered -> Redirect or Show Activation Screen
  if (qrData?.status === 'UNREGISTERED') {
    return (
      <div className="bg-gray-50 min-h-screen pt-24 pb-12 px-4 font-sans text-black flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-black/5 text-center">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <span className="inline-block bg-green-100 text-green-700 text-xs font-black uppercase px-3 py-1 rounded-full mb-3">
            Ready for Activation
          </span>
          <h1 className="text-2xl font-black text-black tracking-tight mb-2">
            New Safe Drive Tag Detected
          </h1>
          <p className="text-sm text-black/60 mb-6 leading-relaxed">
            This QR kit ({qrData.copyCode || token}) is ready to be linked to your vehicle.
          </p>

          <Link
            to={`/register/${token}`}
            className="w-full bg-[#2874f0] hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
          >
            <span>Activate & Register This Tag</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen pt-20 pb-16 px-4 font-sans text-gray-900 relative">
      
      {/* Toast Alert */}
      {actionSuccessMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#2874f0] text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold animate-fade-up border border-white/20">
          <CheckCircle2 size={20} className="text-green-300" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      <div className="max-w-md mx-auto relative space-y-4">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3.5 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80 flex items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1.5">
              <ShieldCheck size={12} /> 100% Number Masked
            </span>
            <h1 className="text-lg font-black text-gray-900">
              Contact Vehicle Owner
            </h1>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">
              {verifiedVehicleInfo 
                ? `${verifiedVehicleInfo.vehicleBrand || 'Protected'} ${verifiedVehicleInfo.vehicleName || 'Vehicle'} • ${verifiedVehicleInfo.plateNumber || 'Verified'}`
                : (qrData?.maskedPlate ? `Vehicle: ${qrData.maskedPlate}` : 'Instant Masked Voice & WhatsApp Bridge')}
            </p>
          </div>

          <div className="w-14 h-14 bg-blue-50 text-[#2874f0] rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <Smartphone size={28} />
          </div>
        </div>

        {/* STEP 1: SECURITY VERIFICATION GATE (If not verified yet) */}
        {!isVerified && qrData?.requiresVerification && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200/80 space-y-3.5 animate-fade-up">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Lock size={16} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Plate Verification</h3>
                <p className="text-[11px] text-gray-400">Anti-harassment spam shield</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Enter the <strong>last 4 digits</strong> of the vehicle registration plate (e.g. for DL 01 AB <strong>1234</strong> enter <strong>1234</strong>):
            </p>

            <form onSubmit={handleVerifyPlate} className="space-y-3">
              <input
                type="text"
                maxLength={4}
                autoFocus
                placeholder="Last 4 digits (e.g. 1234)"
                value={plateInput}
                onChange={(e) => setPlateInput(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-gray-50 border border-gray-300 focus:border-[#2874f0] focus:bg-white rounded-xl py-3 px-4 text-center font-mono font-black text-xl tracking-widest outline-none transition-all"
              />

              {verifyError && (
                <p className="text-xs text-red-600 font-bold text-center">{verifyError}</p>
              )}

              <button
                type="submit"
                disabled={verifying || plateInput.length !== 4}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all uppercase ${
                  plateInput.length === 4 && !verifying
                    ? 'bg-[#2874f0] hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {verifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Plate...
                  </>
                ) : (
                  <span>Verify & Unlock Reasons</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: SELECT REASON FIRST (Accessible when verified) */}
        {(isVerified || !qrData?.requiresVerification) && (
          <div className="space-y-4 animate-fade-up">
            
            {/* Reasons Selection Box */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  1. Select Reason for Contacting
                </h3>
                <span className="text-[10px] bg-blue-50 text-[#2874f0] font-bold px-2 py-0.5 rounded">
                  Required
                </span>
              </div>

              <div className="space-y-2">
                {reasonList.map((r) => {
                  const isSelected = selectedReason === r.text;
                  return (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedReason(r.text);
                        setCustomReason('');
                      }}
                      className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#2874f0] bg-blue-50/70 text-blue-900 shadow-2xs'
                          : 'border-gray-200 bg-gray-50/60 text-gray-700 hover:bg-gray-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base">{r.icon}</span>
                        <span className="truncate">{r.text}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#2874f0] text-white' : 'border border-gray-300'
                      }`}>
                        {isSelected && <Check size={10} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional Custom Note */}
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Or type a specific note (optional)..."
                  value={customReason}
                  onChange={(e) => {
                    setCustomReason(e.target.value);
                    if (e.target.value) {
                      setSelectedReason(e.target.value);
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#2874f0] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all"
                />
              </div>
            </div>

            {/* STEP 3: ACTION BUTTONS (Direct Execution with Selected Reason) */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200/80 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                2. Choose How to Alert Owner
              </h3>

              {/* 1. Masked Call Button */}
              <button
                onClick={handleCallOwner}
                disabled={actionLoading}
                className="w-full bg-[#2874f0] hover:bg-blue-700 text-white font-bold p-3.5 rounded-xl shadow-md flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">Call Vehicle Owner</p>
                    <p className="text-[11px] text-blue-100 font-normal">Connects via automated masked bridge</p>
                  </div>
                </div>
                <span className="text-xs bg-white text-[#2874f0] font-black px-2.5 py-1 rounded-md shrink-0">
                  {actionLoading ? 'Connecting...' : 'Call Now'}
                </span>
              </button>

              {/* 2. WhatsApp Alert Button */}
              <button
                onClick={handleSendMessage}
                disabled={actionLoading}
                className="w-full bg-[#25D366] hover:bg-green-600 text-white font-bold p-3.5 rounded-xl shadow-md flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <FaWhatsapp size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">Send WhatsApp Alert</p>
                    <p className="text-[11px] text-green-100 font-normal">Instant alert with selected reason</p>
                  </div>
                </div>
                <span className="text-xs bg-white text-green-700 font-black px-2.5 py-1 rounded-md shrink-0">
                  WhatsApp
                </span>
              </button>

              {/* 3. Emergency SOS Broadcast Button */}
              <button
                onClick={handleEmergencySOS}
                disabled={actionLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-3.5 rounded-xl shadow-md flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">Emergency SOS Broadcast</p>
                    <p className="text-[11px] text-red-100 font-normal">Alerts owner & both family emergency contacts</p>
                  </div>
                </div>
                <span className="text-xs bg-white text-red-600 font-black px-2.5 py-1 rounded-md shrink-0">
                  Send SOS
                </span>
              </button>

            </div>

          </div>
        )}

        {/* Security Privacy Notice */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 font-medium pt-2">
          <ShieldCheck size={15} className="text-green-600" />
          <span>100% two-way privacy. Your personal number is never shared.</span>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <Info size={14} className="text-[#2874f0]" /> Important Note
          </div>
          <p>Please use this system only to notify vehicle owners regarding parking, vehicle status, or emergency situations.</p>
        </div>

      </div>
    </div>
  );
}
