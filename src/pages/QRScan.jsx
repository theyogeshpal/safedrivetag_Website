import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Phone, 
  Car, 
  Shield, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  ArrowLeft, 
  Smartphone, 
  QrCode, 
  X, 
  CheckCircle2, 
  MessageSquare,
  RefreshCw,
  Sparkles,
  MapPin
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../services/api';

export default function QRScan() {
  const navigate = useNavigate();
  const { id } = useParams(); // This is the public token
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

  // Modals & Action States
  const [activeModal, setActiveModal] = useState(null);
  const [selectedReason, setSelectedReason] = useState('Vehicle is blocking my driveway / parking');
  const [customReason, setCustomReason] = useState('');
  const [emergencyLocation, setEmergencyLocation] = useState('');
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
        // If not requiring verification or already active without plate requirement
        if (res.status === 'ACTIVE' && !res.requiresVerification) {
          setIsVerified(true);
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
      setVerifyError('Please enter exactly 4 digits of the vehicle registration plate.');
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
        setVerifyError(res.message || 'Incorrect vehicle number. Please check the physical plate and try again.');
      }
    } catch (err) {
      setVerifyError('Verification failed. Please retry.');
    } finally {
      setVerifying(false);
    }
  };

  // 5.3 Initiate Masked Voice Call
  const handleCallOwner = async () => {
    setActionLoading(true);
    setActionSuccessMsg('');
    try {
      const reason = customReason || selectedReason;
      const res = await api.initiateCall(token, plateInput || '0000', reason);
      if (res.success) {
        if (res.dialNumber) {
          window.location.href = `tel:${res.dialNumber}`;
        }
        setActionSuccessMsg(res.message || 'Connecting masked call to vehicle owner...');
        setTimeout(() => setActiveModal(null), 2500);
      } else {
        alert(res.message || 'Could not initiate call at this moment.');
      }
    } catch (err) {
      alert('Error initiating call.');
    } finally {
      setActionLoading(false);
    }
  };

  // 5.4 Send Masked WhatsApp / SMS Alert
  const handleSendMessage = async () => {
    setActionLoading(true);
    try {
      const reason = customReason || selectedReason;
      const res = await api.sendMessage(token, plateInput || '0000', reason);
      if (res.success && res.whatsappUrl) {
        window.open(res.whatsappUrl, '_blank');
        setActiveModal(null);
      } else {
        alert(res.message || 'Could not generate WhatsApp alert link.');
      }
    } catch (err) {
      alert('Error generating message.');
    } finally {
      setActionLoading(false);
    }
  };

  // 5.5 Trigger SOS Emergency Alert
  const handleEmergencySOS = async () => {
    setActionLoading(true);
    try {
      const res = await api.triggerEmergency(token, plateInput || '0000', emergencyLocation || 'Location shared via GPS');
      if (res.success) {
        setActionSuccessMsg(res.message || 'Emergency SOS broadcasted to registered emergency contacts.');
        setTimeout(() => setActiveModal(null), 3000);
      } else {
        alert(res.message || 'Could not broadcast SOS alert.');
      }
    } catch (err) {
      alert('Error triggering emergency alert.');
    } finally {
      setActionLoading(false);
    }
  };

  const defaultReasons = verifiedVehicleInfo?.reasons || [
    'Vehicle is blocking my driveway / parking',
    'Car window is open / lights are ON',
    'Vehicle was towed or in a no-parking zone',
    'Emergency or minor scratch noticed'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mb-3" />
        <p className="text-sm font-bold text-black/60">Scanning & decrypting Safe Drive QR Tag...</p>
      </div>
    );
  }

  // If QR is Unregistered -> First Time Setup
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
            This QR kit ({qrData.copyCode || token}) is ready to be linked to your vehicle or travel luggage.
          </p>

          <Link
            to={`/register/${token}`}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.02]"
          >
            <span>Activate & Register This Tag</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 px-4 font-sans text-black relative">
      <div className="max-w-md mx-auto relative">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 mb-6 hover:text-black transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-2xl p-4 mb-6 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="pr-4">
            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-[11px] font-black uppercase px-3 py-1 rounded-full mb-2">
              <ShieldCheck size={13} /> Active Protected Tag
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-1">
              Contact Vehicle Owner
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {verifiedVehicleInfo 
                ? `${verifiedVehicleInfo.vehicleBrand || ''} ${verifiedVehicleInfo.vehicleName || ''} (${verifiedVehicleInfo.maskedPhone || 'Protected'})`
                : (qrData?.maskedPlate ? `Vehicle Plate: ${qrData.maskedPlate}` : 'Instant 100% Number Masked Bridge')}
            </p>
          </div>
          <div className="flex-shrink-0 relative w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center overflow-hidden">
             <Smartphone size={36} className="text-orange-500 absolute rotate-[-10deg]" />
             <div className="absolute bg-white p-1 rounded shadow-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <QrCode size={14} className="text-black" />
             </div>
          </div>
        </div>

        {/* Security Anti-Harassment Gate: Verify Last 4 Digits if required */}
        {!isVerified && qrData?.requiresVerification && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 mb-6 animate-fade-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Car size={20} />
              </div>
              <div>
                <h3 className="font-black text-sm text-black">Security Verification</h3>
                <p className="text-xs text-black/50">Anti-harassment verification</p>
              </div>
            </div>

            <p className="text-xs text-black/70 mb-4 leading-relaxed">
              To protect the owner from spam calls, please enter the <strong>last 4 digits</strong> of the vehicle registration plate (e.g. for DL-01-AB-<strong>1234</strong> enter <strong>1234</strong>):
            </p>

            <form onSubmit={handleVerifyPlate} className="space-y-3">
              <input
                type="text"
                maxLength={4}
                autoFocus
                placeholder="Last 4 digits (e.g. 1234)"
                value={plateInput}
                onChange={(e) => setPlateInput(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-black/5 border border-black/10 focus:border-orange-500 focus:bg-white rounded-xl py-3 px-4 text-center font-black text-lg tracking-widest outline-none transition-all"
              />

              {verifyError && (
                <p className="text-xs text-red-600 font-bold text-center">{verifyError}</p>
              )}

              <button
                type="submit"
                disabled={verifying || plateInput.length !== 4}
                className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  plateInput.length === 4 && !verifying
                    ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                    : 'bg-black/10 text-black/40 cursor-not-allowed'
                }`}
              >
                {verifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <span>Verify & Unlock Contact</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Action Options List (Accessible when verified or no verification required) */}
        <div className={`space-y-4 mb-6 transition-opacity ${(!isVerified && qrData?.requiresVerification) ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Call Option */}
          <div onClick={() => setActiveModal('call')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Phone size={24} className="text-blue-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-gray-900 text-[15px]">Call Vehicle Owner</h3>
              <p className="text-gray-500 text-xs mt-0.5">Connect instantly via masked phone call. <span className="text-blue-600 font-semibold">(Number Masked)</span></p>
            </div>
            <div className="text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>

          {/* WhatsApp Option */}
          <div onClick={() => setActiveModal('whatsapp')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <FaWhatsapp size={24} className="text-green-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-gray-900 text-[15px]">Send WhatsApp Alert</h3>
              <p className="text-gray-500 text-xs mt-0.5">Send a masked WhatsApp message to the owner.</p>
            </div>
            <div className="text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>

          {/* Emergency SOS Option */}
          <div onClick={() => setActiveModal('emergency')} className="bg-red-50 p-4 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow mt-6">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-red-600 text-[15px]">Emergency SOS Broadcast</h3>
              <p className="text-red-500/80 text-xs mt-0.5">Broadcast instant alert to registered family emergency contacts.</p>
            </div>
            <div className="text-red-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>

        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <ShieldCheck size={16} className="text-gray-400" />
          100% two-way privacy. Your personal number is never shared with the owner.
        </div>

        {/* Disclaimer Info Box */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-gray-900 text-[14px] mb-2">Important Guidelines</h4>
            <ul className="text-gray-600 text-xs space-y-1.5 list-disc pl-3">
              <li>Use only for vehicle or parking emergency alerts.</li>
              <li>Prank calls or harassment will result in immediate IP blocking.</li>
              <li>Emergency SOS broadcasts alerts to family contacts.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Modals for Interactivity */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md relative animate-fade-up shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black bg-gray-100 rounded-full p-1 cursor-pointer">
               <X size={20} />
            </button>

            {actionSuccessMsg ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-black text-black">Action Executed</h3>
                <p className="text-sm text-black/70">{actionSuccessMsg}</p>
              </div>
            ) : (
              <>
                {activeModal === 'call' && (
                  <>
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                      <Phone size={24} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl font-black mb-1">Initiate Masked Call</h3>
                    <p className="text-xs text-gray-500 mb-4">Choose the reason so the owner is aware:</p>

                    <div className="space-y-2 mb-4">
                      {defaultReasons.map((r, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedReason(r)}
                          className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                            selectedReason === r
                              ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                              : 'border-black/5 bg-black/[0.02] text-black/70 hover:bg-black/5'
                          }`}
                        >
                          {r}
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={handleCallOwner} 
                      disabled={actionLoading}
                      className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Phone size={18} />}
                      <span>{actionLoading ? 'Connecting...' : 'Call Owner Now'}</span>
                    </button>
                  </>
                )}

                {activeModal === 'whatsapp' && (
                  <>
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                      <FaWhatsapp size={24} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-black mb-1">Send WhatsApp Alert</h3>
                    <p className="text-xs text-gray-500 mb-4">Select or type your message:</p>

                    <div className="space-y-2 mb-4">
                      {defaultReasons.map((r, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedReason(r)}
                          className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                            selectedReason === r
                              ? 'border-green-500 bg-green-50/50 text-green-900'
                              : 'border-black/5 bg-black/[0.02] text-black/70 hover:bg-black/5'
                          }`}
                        >
                          {r}
                        </div>
                      ))}
                    </div>

                    <textarea
                      placeholder="Optional custom message..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full border border-black/10 rounded-xl p-3 text-xs outline-none focus:border-green-500 mb-4 resize-none h-20"
                    />

                    <button 
                      onClick={handleSendMessage} 
                      disabled={actionLoading}
                      className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FaWhatsapp size={18} />}
                      <span>Open WhatsApp</span>
                    </button>
                  </>
                )}

                {activeModal === 'emergency' && (
                  <>
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                      <AlertTriangle size={24} className="text-red-600" />
                    </div>
                    <h3 className="text-xl font-black mb-1 text-red-600">Broadcast SOS Alert</h3>
                    <p className="text-xs text-gray-600 mb-4">
                      This sends an urgent emergency notification to the owner and both registered emergency contacts.
                    </p>

                    <div className="space-y-2 mb-4">
                      <label className="block text-xs font-bold text-black/70">Current Location / Landmark</label>
                      <input
                        type="text"
                        placeholder="e.g. Near City Mall, MG Road"
                        value={emergencyLocation}
                        onChange={(e) => setEmergencyLocation(e.target.value)}
                        className="w-full border border-black/10 rounded-xl p-3 text-xs outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setActiveModal(null)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
                        Cancel
                      </button>
                      <button 
                        onClick={handleEmergencySOS} 
                        disabled={actionLoading}
                        className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <AlertTriangle size={18} />}
                        <span>Send SOS Now</span>
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
