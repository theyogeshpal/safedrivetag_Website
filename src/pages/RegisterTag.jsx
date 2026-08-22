import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Car, 
  Bike, 
  Truck, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  QrCode, 
  Sparkles,
  Lock,
  ChevronRight,
  Briefcase,
  User,
  Smartphone,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterTag() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { registerTag } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    emergencyContact: '',
    whatsapp: '',
    vehicleType: 'Car',
    vehicleName: '',
    vehicleNumber: '',
    vehicleColor: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const setVehicleType = (type) => {
    setFormData((prev) => ({ ...prev, vehicleType: type }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.phone || formData.phone.length < 10) {
      alert('Please enter a valid 10-digit primary phone number.');
      return;
    }

    registerTag({
      id: id || `SD-${Math.floor(10000 + Math.random() * 90000)}`,
      tagId: id,
      name: formData.name,
      phone: formData.phone.replace(/\D/g, ''),
      primaryPhone: formData.phone.replace(/\D/g, ''),
      emergencyContact: formData.emergencyContact.replace(/\D/g, ''),
      emergencyPhone: formData.emergencyContact.replace(/\D/g, ''),
      whatsapp: formData.whatsapp.replace(/\D/g, ''),
      vehicleName: formData.vehicleName.trim() || `${formData.vehicleType}`,
      vehicleNumber: formData.vehicleNumber.trim().toUpperCase() || 'LUGGAGE-TAG',
      vehicleType: formData.vehicleType,
      vehicleColor: formData.vehicleColor.trim(),
      status: 'active',
      registeredAt: new Date().toISOString().split('T')[0],
      scansCount: 0,
      callMaskingEnabled: true,
      whatsappAlertsEnabled: true,
    });

    setIsSuccess(true);
  };

  const vehicleTypes = [
    { id: 'Car', label: 'Car / SUV', icon: <Car className="w-4 h-4" /> },
    { id: 'Bike', label: 'Bike / Scooter', icon: <Bike className="w-4 h-4" /> },
    { id: 'Luggage', label: 'Luggage / Bag', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'Truck', label: 'Commercial / Truck', icon: <Truck className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-orange-50/30 flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 relative z-10 overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none z-0" />

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-black/5 p-6 sm:p-9 relative z-10 border border-black/5">
        
        {isSuccess ? (
          <div className="text-center py-6 animate-fade-up">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black mb-2">Tag Registered Successfully!</h2>
            <p className="text-sm text-black/60 font-medium mb-6">
              Tag ID <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">{id}</span> is now linked with <strong className="text-black">{formData.vehicleName} ({formData.vehicleNumber})</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                to="/dashboard" 
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-black px-7 py-3.5 rounded-xl text-sm transition-all shadow-md shadow-green-500/20"
              >
                Go to My Dashboard &rarr;
              </Link>
              <Link 
                to={`/scan/${id}`} 
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
              <div className="shrink-0 bg-[#fdf8d5] border border-[#f4e28e] p-3 rounded-2xl text-center">
                <div className="text-[10px] font-black text-[#6d5516] uppercase tracking-wider">Tag ID</div>
                <div className="font-mono font-black text-sm text-black">{id || 'NEW-TAG'}</div>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* SECTION 1: VEHICLE OR BAG DETAILS */}
              <div className="bg-orange-50/40 border border-orange-100/80 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-orange-100">
                  <h3 className="text-sm font-black text-black uppercase tracking-wider flex items-center gap-2">
                    {formData.vehicleType === 'Luggage' ? <Briefcase className="w-4 h-4 text-orange-600" /> : <Car className="w-4 h-4 text-orange-600" />}
                    1. {formData.vehicleType === 'Luggage' ? 'Luggage / Bag Details (बैग की जानकारी)' : 'Vehicle Details (वाहन की जानकारी)'}
                  </h3>
                  <span className="text-[11px] font-bold text-orange-600 bg-white px-2 py-0.5 rounded-md border border-orange-200">Required</span>
                </div>

                {/* Vehicle / Item Type Radio Chips */}
                <div>
                  <label className="block text-xs font-bold text-black/70 mb-2">Select Item Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {vehicleTypes.map((vt) => (
                      <button
                        key={vt.id}
                        type="button"
                        onClick={() => setVehicleType(vt.id)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          formData.vehicleType === vt.id
                            ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20 scale-[1.02]'
                            : 'bg-white text-black/70 border-black/10 hover:border-black/20 hover:bg-black/[0.02]'
                        }`}
                      >
                        {vt.icon}
                        <span>{vt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model & Registration / Bag Identifier */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black/80 flex items-center gap-1">
                      {formData.vehicleType === 'Luggage' ? 'Bag Name / Model / Brand' : 'Vehicle Model / Make'} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="vehicleName"
                      required
                      value={formData.vehicleName}
                      onChange={handleChange}
                      placeholder={formData.vehicleType === 'Luggage' ? 'e.g. American Tourister Suitcase / Dell Backpack' : 'e.g. Hyundai Creta / Honda City'} 
                      className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black/80 flex items-center gap-1">
                      {formData.vehicleType === 'Luggage' ? 'Bag Identifier / PNR / Serial (Optional)' : 'Vehicle Registration Number'} <span className={formData.vehicleType === 'Luggage' ? 'text-black/40' : 'text-red-500'}>{formData.vehicleType === 'Luggage' ? '' : '*'}</span>
                    </label>
                    <input 
                      type="text" 
                      name="vehicleNumber"
                      required={formData.vehicleType !== 'Luggage'}
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      placeholder={formData.vehicleType === 'Luggage' ? 'e.g. BAG-01 or My Suitcase' : 'e.g. DL 01 AB 1234'} 
                      className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-black font-bold uppercase tracking-wider font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black/70 flex items-center gap-1">
                    {formData.vehicleType === 'Luggage' ? 'Bag Color / Appearance (Optional)' : 'Vehicle Color / Variant (Optional)'}
                  </label>
                  <input 
                    type="text" 
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleChange}
                    placeholder="e.g. Polar White / Titanium Grey" 
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-xs"
                  />
                </div>
              </div>

              {/* SECTION 2: OWNER & CONTACT DETAILS */}
              <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-black/5">
                  <h3 className="text-sm font-black text-black uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-600" /> 2. Owner & Contact Details
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-500" /> Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma" 
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-orange-500" /> Primary Mobile Number (Your Login ID) <span className="text-red-500">*</span>
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
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-sm"
                  />
                  <p className="text-[11px] text-black/50 ml-1">This number acts as your account login ID via OTP.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-green-500" /> Emergency SOS Contact <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="emergencyContact"
                      required
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit phone number"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="e.g. 9811223344" 
                      className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-green-500" /> WhatsApp Alert Number <span className="text-red-500">*</span>
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
                      className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-3.5 flex gap-3 items-start">
                <Lock className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-green-900 mb-0.5">100% Two-Way Privacy Masking</p>
                  <p className="text-[11px] text-green-700/90 leading-relaxed">Your personal number and vehicle details are protected. Callers will only be connected through a secure masked bridge.</p>
                </div>
              </div>

              <div>
                <button 
                  type="submit" 
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-green-500/25 cursor-pointer text-base hover:scale-[1.01]"
                >
                  Register Tag & Save Vehicle
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
