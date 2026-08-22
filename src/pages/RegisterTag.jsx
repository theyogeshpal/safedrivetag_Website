import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Smartphone, User, Phone, MessageCircle, Lock } from 'lucide-react';

export default function RegisterTag() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    emergencyContact: '',
    whatsapp: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API Call will go here in the future
    console.log('Form Data:', formData);
    // Redirect to success or scan page for now
    alert('Registration successful! Redirecting...');
    navigate(`/scan/${id}`);
  };

  return (
    <div className="min-h-screen bg-orange-50/30 flex items-center justify-center pt-24 pb-12 px-6 relative z-10 overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none z-0" />

      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl shadow-black/5 p-8 relative z-10 border border-black/5">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-orange-200">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight mb-2">Register Your Tag</h1>
          <p className="text-black/60 font-medium">Link your details to Tag ID: <span className="font-bold text-black bg-orange-100 px-2 py-0.5 rounded-md">{id}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" /> Full Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Kumar" 
              className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-orange-500" /> Phone Number <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel" 
              name="phone"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 9876543210" 
              className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-500" /> Emergency Contact Number <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel" 
              name="emergencyContact"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="e.g. 9123456780" 
              className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel" 
              name="whatsapp"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="e.g. 9876543210" 
              className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
            />
            <p className="text-[11px] text-black/50 ml-1">Used to send you instant alerts when someone scans your tag.</p>
          </div>

          <div className="pt-2">
            <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex gap-3 items-start">
              <Lock className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-900 mb-0.5">100% Two-Way Privacy</p>
                <p className="text-xs text-green-700/90 leading-relaxed">Your details are completely safe! When someone scans your tag, they cannot see your number, and you cannot see theirs. Complete anonymity through our secure call bridge.</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
            >
              Register Tag Securely
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
