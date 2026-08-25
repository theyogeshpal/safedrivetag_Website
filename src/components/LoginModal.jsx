import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, Smartphone, ArrowRight, CheckCircle2, Lock, RefreshCw, KeyRound } from 'lucide-react';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Reset state on open/close
  useEffect(() => {
    if (isLoginModalOpen) {
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setStep(1);
      setError('');
      setResendTimer(30);
      setCanResend(false);
    }
  }, [isLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendOtp(cleanPhone);
      if (res.success) {
        setStep(2);
        setResendTimer(30);
        setCanResend(false);
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }, 100);
      } else {
        setError(res.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Paste handling
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, idx) => {
        if (idx < 6) newOtp[idx] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(digits.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto move to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    const fullOtp = otp.join('');

    if (fullOtp.length < 4) {
      setError('Please enter the verification OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const res = await verifyOtp(cleanPhone, fullOtp);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Invalid OTP. Please check and retry.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setError('');
    setIsLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const res = await sendOtp(cleanPhone);
      if (res.success) {
        setResendTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        otpInputRefs.current[0]?.focus();
      } else {
        setError(res.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError('Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setPhone('9876543210');
    setError('');
  };

  const fillDemoOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pt-20 sm:pt-28 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeLoginModal}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 border border-black/5 animate-fade-up overflow-hidden my-auto mt-8 sm:mt-12">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={closeLoginModal}
          className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-600 hover:text-gray-950 transition-all z-30 cursor-pointer shadow-xs"
          style={{ position: 'absolute', top: '16px', right: '16px' }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            {step === 1 ? <Smartphone className="w-7 h-7" /> : <KeyRound className="w-7 h-7" />}
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight">
            {step === 1 ? 'Owner Login' : 'Enter Verification OTP'}
          </h2>
          <p className="text-sm text-black/60 mt-1 font-medium">
            {step === 1 
              ? 'Access and manage all QR Tags linked to your mobile number' 
              : `We sent an OTP code to +91 ${phone}`}
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 text-red-600 border border-red-200 text-xs sm:text-sm font-semibold rounded-xl p-3 text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          /* Step 1: Phone Input */
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/70 mb-1.5 ml-1">
                Registered Mobile Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center gap-1.5 text-black/70 font-bold text-sm select-none border-r border-black/10 pr-2.5">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  autoFocus
                  required
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black/5 hover:bg-black/[0.07] focus:bg-white border border-transparent focus:border-orange-500 rounded-2xl py-3.5 pl-24 pr-4 font-bold text-black text-base outline-none transition-all placeholder:text-black/30"
                />
              </div>
            </div>


            <button
              type="submit"
              disabled={isLoading || phone.length !== 10}
              className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                phone.length === 10 && !isLoading
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25 cursor-pointer hover:scale-[1.01]'
                  : 'bg-black/10 text-black/40 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs text-black/50 font-medium">
                <Lock size={13} className="text-green-600" />
                <span>Your registered phone number is your secure login ID</span>
              </div>
            </div>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-black/70 ml-1">
                  6-Digit OTP
                </label>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-orange-600 font-bold hover:underline"
                >
                  Change Number
                </button>
              </div>

              {/* 6 OTP Digit Boxes */}
              <div className="flex justify-center gap-2 my-3">
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
              className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                otp.join('').length >= 4 && !isLoading
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 cursor-pointer hover:scale-[1.01]'
                  : 'bg-black/10 text-black/40 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying OTP...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Verify & Access My Dashboard</span>
                </>
              )}
            </button>

            {/* Resend Timer */}
            <div className="text-center text-xs font-semibold text-black/60 pt-1">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-orange-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} /> Resend OTP now
                </button>
              ) : (
                <span>Resend OTP in <span className="text-black font-bold">{resendTimer}s</span></span>
              )}
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
