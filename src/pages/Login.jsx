import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Smartphone, ArrowRight, CheckCircle2, Lock, RefreshCw, KeyRound } from 'lucide-react';

export default function Login() {
  const { currentUser, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpInputRefs = useRef([]);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

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
        setError(res.message || 'Invalid OTP');
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

  return (
    <div className="min-h-screen bg-orange-50/40 flex items-center justify-center pt-24 pb-16 px-4 relative overflow-hidden font-sans">
      <div className="max-w-md w-full relative z-10">
        
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-xl shadow-orange-500/5 border border-black/5 animate-fade-up">
          
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              {step === 1 ? <Smartphone className="w-8 h-8" /> : <KeyRound className="w-8 h-8" />}
            </div>
            <h1 className="text-3xl font-black text-black tracking-tight">
              {step === 1 ? 'Owner Login' : 'Enter OTP'}
            </h1>
            <p className="text-sm text-black/60 mt-1.5 font-medium">
              {step === 1 
                ? 'Your registered mobile number acts as your account ID' 
                : `Enter the code sent to +91 ${phone}`}
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-xl p-3 text-center">
              {error}
            </div>
          )}

          {step === 1 ? (
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
                    <span>Send Verification OTP</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-black/5 flex flex-col gap-2 text-center text-xs text-black/50 font-medium">
                <div className="inline-flex items-center justify-center gap-1.5">
                  <Lock size={13} className="text-green-600" />
                  <span>End-to-End Encrypted & Privacy Protected</span>
                </div>
                <div>
                  New Tag Owner? <Link to="/shop" className="text-orange-600 font-bold hover:underline">Get a SafeDrive Tag</Link>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black/70 ml-1">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    Change Number
                  </button>
                </div>

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
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/25 cursor-pointer hover:scale-[1.01]'
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
                    <span>Verify & View My Dashboard</span>
                  </>
                )}
              </button>

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
    </div>
  );
}
