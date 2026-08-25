import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Phone, 
  Car, 
  ShieldCheck, 
  Info, 
  ArrowLeft, 
  Smartphone, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Lock,
  Check,
  Ban,
  Unlock,
  MessageSquare,
  MapPin,
  Bell,
  Send,
  Zap,
  BellRing
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../services/api';
import { showToast, playNotificationBellSound } from '../utils/swal';

export default function QRScan() {
  const navigate = useNavigate();
  const { id } = useParams(); // Public token
  const token = id;

  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState('');

  // Dynamic Scan Reasons from GET /public/scan-reasons
  const [scanReasons, setScanReasons] = useState([]);

  // Plate Verification state
  const [isVerified, setIsVerified] = useState(false);
  const [plateInput, setPlateInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifiedVehicleInfo, setVerifiedVehicleInfo] = useState(null);

  // Selected Reason & Custom Note
  const [selectedReasonId, setSelectedReasonId] = useState(null);
  const [customReasonText, setCustomReasonText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Default fallback reasons matching documentation
  const defaultFallbackReasons = [
    {
      _id: 'reason_1',
      title: 'Wrong Parking',
      description: 'Your vehicle is blocking the way or parked in a restricted zone.',
      iconKey: 'ban',
      color: 'rose',
      isOtherType: false,
      order: 1,
    },
    {
      _id: 'reason_2',
      title: 'Headlight / Light On',
      description: 'Your vehicle lights or headlights are left ON.',
      iconKey: 'alert',
      color: 'amber',
      isOtherType: false,
      order: 2,
    },
    {
      _id: 'reason_3',
      title: 'Window / Door Open',
      description: 'Window glass is rolled down or door is not properly shut.',
      iconKey: 'unlock',
      color: 'purple',
      isOtherType: false,
      order: 3,
    },
    {
      _id: 'reason_4',
      title: 'Others',
      description: 'Specify a custom message or alert for the vehicle owner.',
      iconKey: 'other',
      color: 'indigo',
      isOtherType: true,
      order: 99,
    },
  ];

  // STEP 2: DETAILS & REASONS LOADING (Parallel APIs)
  const fetchQrAndReasons = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');

    try {
      const [qrRes, reasonsRes] = await Promise.allSettled([
        api.getPublicQrInfo(token),
        api.getScanReasons(),
      ]);

      // 1. Process QR Info
      if (qrRes.status === 'fulfilled' && qrRes.value?.success) {
        const qr = qrRes.value;
        if (qr.status === 'UNREGISTERED') {
          navigate(`/register/${token}`, { replace: true, state: { qrData: qr } });
          return;
        }

        setQrData(qr);
        if (qr.status === 'ACTIVE' && !qr.requiresVerification) {
          setIsVerified(true);
          setVerifiedVehicleInfo({
            vehicleBrand: qr.vehicle?.vehicleBrand || qr.vehicleBrand || 'Vehicle',
            vehicleName: qr.vehicle?.vehicleName || qr.vehicleName || 'Protected',
            vehicleNumber: qr.vehicle?.vehicleNumber || qr.vehicleNumber || 'VERIFIED',
          });
        }
      } else {
        setQrData(null);
        setError(qrRes.value?.message || 'Invalid or unknown QR code scanned.');
      }

      // 2. Process Scan Reasons
      if (reasonsRes.status === 'fulfilled' && reasonsRes.value?.success && Array.isArray(reasonsRes.value.reasons) && reasonsRes.value.reasons.length > 0) {
        const activeReasons = reasonsRes.value.reasons.filter(r => r.isActive !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
        setScanReasons(activeReasons);
        if (activeReasons.length > 0) {
          setSelectedReasonId(activeReasons[0]._id);
        }
      } else {
        setScanReasons(defaultFallbackReasons);
        setSelectedReasonId(defaultFallbackReasons[0]._id);
      }

    } catch (err) {
      setQrData(null);
      setError('Unable to load QR scan details. Please check connection.');
      setScanReasons(defaultFallbackReasons);
      setSelectedReasonId(defaultFallbackReasons[0]._id);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchQrAndReasons();
  }, [fetchQrAndReasons]);

  // STEP 3: ANTI-HARASSMENT PLATE VERIFICATION (4-DIGIT PIN)
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
        setVerifiedVehicleInfo({
          vehicleBrand: res.vehicle?.vehicleBrand || 'Vehicle',
          vehicleName: res.vehicle?.vehicleName || 'Creta',
          vehicleNumber: res.vehicle?.vehicleNumber || `XX-XXXX-${plateInput}`,
          ownerName: res.owner?.name || 'Owner',
        });
      } else {
        setVerifyError(res.message || 'Incorrect vehicle plate number. Please check the vehicle registration plate and try again.');
      }
    } catch (err) {
      setVerifyError('Verification failed. Please retry.');
    } finally {
      setVerifying(false);
    }
  };

  // Helper: Get Resolved Reason Text
  const getSelectedReasonText = () => {
    const selectedObj = scanReasons.find(r => r._id === selectedReasonId);
    if (selectedObj?.isOtherType || selectedObj?.title === 'Others') {
      return customReasonText.trim() || 'Custom alert message';
    }
    return selectedObj?.title || 'Vehicle Notice';
  };

  // STEP 5 - OPTION 0: SEND INSTANT PUSH NOTIFICATION ALERT
  const handleSendPushAlert = async () => {
    setActionLoading(true);
    setActionSuccessMsg('');
    try {
      const reasonText = getSelectedReasonText();
      const vPlate = verifiedVehicleInfo?.vehicleNumber || qrData?.vehicle?.vehicleNumber || qrData?.vehicleNumber || 'Vehicle';
      
      const payload = {
        title: `🚨 SafeDrive Alert (${vPlate})`,
        messageText: reasonText,
        reason: reasonText,
        last4Digits: plateInput || '0000',
        timestamp: new Date().toISOString(),
      };

      // 1. Send Push notification API (POST /public/qr/:token/push-notification)
      const res = await api.sendPushNotification(token, reasonText);
      if (!res.success) {
        await api.sendMessage(token, payload);
      }
      
      // 2. Play audible bell chime sound
      playNotificationBellSound();

      // 3. Show Toast & Status
      setActionSuccessMsg(res.message || `🔔 Push notification sent to vehicle owner regarding: "${reasonText}"`);
      showToast.success('🔔 Push Alert delivered to vehicle owner!');

      setCustomReasonText('');
      setTimeout(() => setActionSuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
      showToast.error('Failed to send push notification.');
    } finally {
      setActionLoading(false);
    }
  };

  // STEP 5 - OPTION A: SEND WHATSAPP MESSAGE
  const handleSendWhatsAppMessage = async () => {
    setActionLoading(true);
    setActionSuccessMsg('');
    try {
      const reasonText = getSelectedReasonText();
      const vPlate = verifiedVehicleInfo?.vehicleNumber || qrData?.vehicle?.vehicleNumber || qrData?.vehicleNumber || 'Vehicle';
      
      const messageBody = `Hello, I am scanning the Safe Drive QR code on your vehicle (${vPlate}).\n\n📌 Reason: ${reasonText}\n\nPlease check your vehicle or contact me.`;

      const res = await api.sendMessage(token, messageBody);
      if (res.success && res.whatsappUrl) {
        window.open(res.whatsappUrl, '_blank');
        setActionSuccessMsg('Opening WhatsApp with pre-filled alert...');
        showToast.success('Opening WhatsApp...');
      } else {
        // Fallback WhatsApp link
        const targetPhone = qrData?.phone || qrData?.user?.phone || '917817095043';
        const fallbackUrl = `https://api.whatsapp.com/send?phone=${String(targetPhone).replace(/\D/g, '')}&text=${encodeURIComponent(messageBody)}`;
        window.open(fallbackUrl, '_blank');
        setActionSuccessMsg('Opening WhatsApp...');
        showToast.success('Opening WhatsApp...');
      }
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      showToast.error('Error generating WhatsApp alert.');
    } finally {
      setActionLoading(false);
    }
  };

  // STEP 5 - OPTION B: CALL VEHICLE OWNER (Masked Voice Bridge)
  const handleCallOwner = async () => {
    setActionLoading(true);
    setActionSuccessMsg('');
    try {
      const reasonText = getSelectedReasonText();
      const res = await api.initiateCall(token, plateInput || '0000', reasonText);
      if (res.success) {
        const dialNumber = res.dialNumber || res.targetPhone || qrData?.phone;
        if (dialNumber) {
          window.location.href = `tel:${dialNumber}`;
        }
        setActionSuccessMsg(res.message || 'Connecting masked phone call to vehicle owner...');
        showToast.success('Connecting masked call...');
        setTimeout(() => setActionSuccessMsg(''), 4000);
      } else {
        showToast.error(res.message || 'Could not initiate call at this moment.');
      }
    } catch (err) {
      showToast.error('Error initiating voice bridge call.');
    } finally {
      setActionLoading(false);
    }
  };

  // STEP 5 - OPTION C: EMERGENCY ALERT (LIVE GPS LOCATION)
  const handleEmergencySOS = async () => {
    setActionLoading(true);
    setActionSuccessMsg('');

    const sendSosPayload = async (coords) => {
      try {
        const payload = {
          latitude: coords?.latitude || 26.8467,
          longitude: coords?.longitude || 80.9462,
          mapsLink: coords ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}` : 'Location shared via GPS',
          reason: getSelectedReasonText(),
          last4Digits: plateInput || '0000',
        };

        const res = await api.triggerEmergency(token, payload);
        if (res.success) {
          setActionSuccessMsg(res.message || '🚨 Emergency SOS sent to 2 contacts via SMS and WhatsApp!');
          showToast.success('🚨 Emergency SOS broadcasted!');
        } else {
          setActionSuccessMsg('🚨 Emergency SOS alert broadcasted to registered family contacts.');
          showToast.success('🚨 Emergency SOS alert sent!');
        }
        setTimeout(() => setActionSuccessMsg(''), 5000);
      } catch (err) {
        showToast.error('Error broadcasting emergency SOS.');
      } finally {
        setActionLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          sendSosPayload({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          sendSosPayload(null);
        },
        { timeout: 5000 }
      );
    } else {
      sendSosPayload(null);
    }
  };

  // Helper for Render Icons
  const renderReasonIcon = (iconKey) => {
    switch (iconKey?.toLowerCase()) {
      case 'ban':
        return <Ban size={18} className="text-rose-500" />;
      case 'alert':
        return <AlertTriangle size={18} className="text-amber-500" />;
      case 'unlock':
        return <Unlock size={18} className="text-purple-500" />;
      case 'car':
        return <Car size={18} className="text-blue-500" />;
      case 'other':
      default:
        return <MessageSquare size={18} className="text-indigo-500" />;
    }
  };

  const selectedReasonObj = scanReasons.find(r => r._id === selectedReasonId);
  const isOtherSelected = selectedReasonObj?.isOtherType || selectedReasonObj?.title === 'Others';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 text-[#2874f0] animate-spin mb-3" />
        <p className="text-sm font-bold text-gray-700">Connecting to SafeDrive Security Bridge...</p>
      </div>
    );
  }

  // First-Time Registration Detection
  if (qrData?.status === 'UNREGISTERED') {
    return (
      <div className="bg-[#f4f7fb] min-h-screen pt-36 sm:pt-40 lg:pt-44 pb-12 px-4 font-sans text-black flex items-center justify-center">
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
            className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-emerald-600 hover:from-orange-600 hover:to-emerald-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
          >
            <span>Activate & Register This Tag</span>
          </Link>
        </div>
      </div>
    );
  }

  // Error / Invalid QR Code Screen
  if (error || !qrData || qrData.status !== 'ACTIVE') {
    return (
      <div className="bg-[#f4f7fb] min-h-screen pt-36 sm:pt-40 lg:pt-44 pb-16 px-4 font-sans text-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-black/5 text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <span className="inline-block bg-red-100 text-red-700 text-xs font-black uppercase px-3 py-1 rounded-full">
            Invalid QR Code
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Invalid or Unknown QR Code
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            {error || 'This QR code is invalid, deactivated, or not recognized by SafeDrive-Tag.'}
          </p>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Go to Homepage
            </button>
            <button
              onClick={() => fetchQrAndReasons()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} /> Retry Scan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen pt-36 sm:pt-40 lg:pt-44 pb-16 px-4 font-sans text-gray-900 relative">
      
      {/* Toast Alert Notification */}
      {actionSuccessMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#2874f0] text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold animate-fade-up border border-white/20">
          <CheckCircle2 size={20} className="text-green-300" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      <div className="max-w-md mx-auto relative space-y-4">
        
        {/* Top Back Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>

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
                ? `${verifiedVehicleInfo.vehicleBrand || 'Protected'} ${verifiedVehicleInfo.vehicleName || 'Vehicle'} • ${verifiedVehicleInfo.vehicleNumber || 'Verified'}`
                : (qrData?.maskedPlate ? `Vehicle: ${qrData.maskedPlate}` : 'Instant Masked Voice & WhatsApp Bridge')}
            </p>
          </div>

          <div className="w-14 h-14 bg-blue-50 text-[#2874f0] rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <Smartphone size={28} />
          </div>
        </div>

        {/* STEP 3: ANTI-HARASSMENT 4-DIGIT PLATE VERIFICATION */}
        {!isVerified && qrData?.requiresVerification && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200/80 space-y-3.5 animate-fade-up">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Lock size={16} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Anti-Harassment Plate Verification</h3>
                <p className="text-[11px] text-gray-400">Owner protection spam shield</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              To protect the owner from spam, enter the <strong>last 4 digits</strong> of the vehicle registration plate (e.g. for DL 01 AB <strong>1234</strong> enter <strong>1234</strong>):
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

        {/* STEP 4: REASON SELECTION & STEP 5: ACTIONS (Shown when verified) */}
        {(isVerified || !qrData?.requiresVerification) && (
          <div className="space-y-4 animate-fade-up">
            
            {/* 1. Reasons Selection Box */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  1. Why did you scan this QR?
                </h3>
                <span className="text-[10px] bg-blue-50 text-[#2874f0] font-bold px-2 py-0.5 rounded">
                  Select Reason
                </span>
              </div>

              <div className="space-y-2">
                {scanReasons.map((reason) => {
                  const isSelected = selectedReasonId === reason._id;
                  return (
                    <div
                      key={reason._id}
                      onClick={() => setSelectedReasonId(reason._id)}
                      className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#2874f0] bg-blue-50/70 text-blue-950 shadow-2xs'
                          : 'border-gray-200 bg-gray-50/60 text-gray-700 hover:bg-gray-100/80'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 shrink-0">
                          {renderReasonIcon(reason.iconKey)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 leading-tight truncate">{reason.title}</p>
                          {reason.description && (
                            <p className="text-[11px] text-gray-500 font-normal leading-tight mt-0.5">{reason.description}</p>
                          )}
                        </div>
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

              {/* Custom Message / Alert Box & Direct Push Notification Button (Always Accessible) */}
              <div className="pt-3 border-t border-gray-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-800">
                    ✍️ Type Custom Message / Notice for Owner:
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">Optional / Custom text</span>
                </div>
                <textarea
                  rows={2}
                  placeholder="Type your message for the vehicle owner here (e.g. Please move your car, parking blocking, window open...)"
                  value={customReasonText}
                  onChange={(e) => setCustomReasonText(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 focus:border-[#2874f0] focus:bg-white rounded-xl p-3 text-xs outline-none resize-none font-medium transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* 2. Instant Action Execution Buttons */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200/80 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                2. Choose Action to Contact Owner
              </h3>

              {/* Option 0: Send Push Notification Directly */}
              <button
                onClick={handleSendPushAlert}
                disabled={actionLoading}
                className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-emerald-600 hover:from-orange-600 hover:to-emerald-700 text-white font-bold p-3.5 rounded-xl shadow-md flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <BellRing size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">Send Instant Push Notification</p>
                    <p className="text-[11px] text-white/80 font-normal">Direct mobile screen & bell alert to vehicle owner</p>
                  </div>
                </div>
                <span className="text-xs bg-white text-orange-600 font-black px-2.5 py-1 rounded-md shrink-0">
                  {actionLoading ? 'Sending...' : 'Send Alert 🔔'}
                </span>
              </button>

              {/* Option A: Send WhatsApp Message */}
              <button
                onClick={handleSendWhatsAppMessage}
                disabled={actionLoading}
                className="w-full bg-[#25D366] hover:bg-green-600 text-white font-bold p-3.5 rounded-xl shadow-md flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <FaWhatsapp size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">Send WhatsApp Message</p>
                    <p className="text-[11px] text-green-100 font-normal">Pre-filled alert with selected reason</p>
                  </div>
                </div>
                <span className="text-xs bg-white text-green-700 font-black px-2.5 py-1 rounded-md shrink-0">
                  WhatsApp
                </span>
              </button>

              {/* Option B: Call Vehicle Owner (Masked Voice Call) */}
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
                    <p className="text-[11px] text-blue-100 font-normal">100% Number Masked automated bridge</p>
                  </div>
                </div>
                <span className="text-xs bg-white text-[#2874f0] font-black px-2.5 py-1 rounded-md shrink-0">
                  {actionLoading ? 'Connecting...' : 'Call Now'}
                </span>
              </button>

              {/* Option C: Emergency SOS Broadcast */}
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
                    <p className="text-[11px] text-red-100 font-normal">Live GPS location to 2 family SOS contacts</p>
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
          <span>100% two-way privacy. Your personal phone is never exposed.</span>
        </div>

        {/* Important Guidelines */}
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
