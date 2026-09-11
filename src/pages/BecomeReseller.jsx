import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ShieldCheck, ArrowRight, User, Phone, Mail, Building2, MapPin, KeyRound } from 'lucide-react';

const BecomeReseller = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    shopName: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    address: ''
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (formData.phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/send-otp`, { phone: formData.phone });
      if (res.data.success) {
        toast.success(res.data.message || 'OTP sent successfully');
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/partner-register`, { ...formData, otp });
      if (res.data.success) {
        toast.success('Registration successful! Check your email for details.');
        setTimeout(() => {
          window.location.href = import.meta.env.VITE_RESELLER_DOMAIN;
        }, 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col font-sans">

      <main className="flex-grow flex items-center justify-center pt-40 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">

          {/* Left Side: Info & Marketing */}
          <div className="lg:w-2/5 bg-[#060910] p-10 text-white flex flex-col justify-center relative overflow-hidden border-r border-white/10">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#fb641b] opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500 opacity-20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <ShieldCheck className="w-16 h-16 text-[#fb641b] mb-6" />
              <h2 className="text-3xl font-black mb-4 leading-tight">Partner With SafeDrive</h2>
              <p className="text-gray-400 font-medium mb-8 leading-relaxed">
                Join our network of authorized resellers. Provide innovative vehicle safety tags to your customers and grow your business with our trusted platform.
              </p>

              <ul className="space-y-4">
                <li className="flex items-center text-sm font-medium text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-[#fb641b]/20 text-[#fb641b] flex items-center justify-center mr-3">✓</div>
                  High Profit Margins
                </li>
                <li className="flex items-center text-sm font-medium text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-[#fb641b]/20 text-[#fb641b] flex items-center justify-center mr-3">✓</div>
                  Dedicated Partner Portal
                </li>
                <li className="flex items-center text-sm font-medium text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-[#fb641b]/20 text-[#fb641b] flex items-center justify-center mr-3">✓</div>
                  Instant Activations
                </li>
                <li className="flex items-center text-sm font-medium text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-[#fb641b]/20 text-[#fb641b] flex items-center justify-center mr-3">✓</div>
                  Marketing Support
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="lg:w-3/5 p-8 lg:p-12">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Create Reseller Account</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">Fill in your details below. OTP verification is required to register.</p>

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                      <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:bg-white focus:border-[#fb641b] focus:outline-none transition" placeholder="e.g. Ramesh Kumar" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                      <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:bg-white focus:border-[#fb641b] focus:outline-none transition" placeholder="10-digit mobile number" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:bg-white focus:border-[#fb641b] focus:outline-none transition" placeholder="you@example.com" />
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Shop / Business Name *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                    <input required type="text" name="shopName" value={formData.shopName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:bg-white focus:border-[#fb641b] focus:outline-none transition" placeholder="e.g. Sharma Motors & Accessories" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                      <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:bg-white focus:border-[#fb641b] focus:outline-none transition" placeholder="City" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:border-[#fb641b] focus:outline-none transition" placeholder="State" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Pincode *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                      <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:bg-white focus:border-[#fb641b] focus:outline-none transition" placeholder="e.g. 110001" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Landmark</label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:border-[#fb641b] focus:outline-none transition" placeholder="Nearby Landmark" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-[#fb641b] hover:bg-[#e05615] text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-500/20 flex items-center justify-center disabled:opacity-70"
                >
                  {loading ? 'Sending OTP...' : (
                    <>
                      Next: Verify Phone <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-slate-500 font-medium mt-4">
                  Already have an account?{' '}
                  <a href={import.meta.env.VITE_RESELLER_DOMAIN} className="text-[#fb641b] hover:underline font-bold">
                    Login here
                  </a>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm font-medium mb-6">
                  An OTP has been sent to +91 {formData.phone}. Please enter it below to complete registration.
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Enter OTP *</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                    <input required type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-bold tracking-widest text-center focus:bg-white focus:border-[#fb641b] focus:outline-none transition" placeholder="••••••" />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3.5 rounded-xl transition flex items-center justify-center"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center disabled:opacity-70"
                  >
                    {loading ? 'Verifying...' : 'Verify & Register'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BecomeReseller;
