import React, { useState } from 'react';
import { Building2, TrendingUp, Handshake, Mail, MapPin, Briefcase, ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { showToast } from '../utils/swal';
import api from '../services/api';

export default function BecomePartner() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    businessType: 'Retail Shop',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.city.trim()) {
      showToast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitContact({
        name: formData.name,
        phone: formData.phone.replace(/\D/g, ''),
        email: formData.email,
        subject: `Partner Application: ${formData.city} - ${formData.businessType}`,
        message: formData.message || 'I am interested in becoming a partner.'
      });
      if (res.success || res.status === 200) {
        showToast.success("Partnership Request Submitted! Our team will contact you shortly.");
        setFormData({ name: '', phone: '', email: '', city: '', businessType: 'Retail Shop', message: '' });
      } else {
        showToast.error(res.message || "Failed to submit request.");
      }
    } catch (err) {
      showToast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-20 selection:bg-orange-500/30">
      <PageHero
        badge="🚀 JOIN OUR GROWING NETWORK"
        title="Become a"
        highlightText="SafeDrive Partner"
        description="Join India's fastest-growing smart vehicle safety network. Sell our premium QR tags, help save lives, and earn high margins with minimal investment."
        badges={[
          { icon: <TrendingUp size={14} className="text-emerald-500" />, label: 'High Profit Margins' },
          { icon: <Handshake size={14} className="text-orange-500" />, label: 'Dedicated Support' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 lg:pt-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column - Why Partner With Us */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Why Partner With Us?</h2>
              <p className="text-gray-600 font-medium leading-relaxed">
                SafeDriveTag is rapidly expanding across India. We are looking for passionate distributors, shop owners, and sales freelancers to take our revolutionary vehicle safety tags to every corner of the country.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { title: 'Zero Franchise Fee', desc: 'Start with just the inventory cost. No hidden charges or monthly royalty fees.' },
                { title: 'High ROI & Margins', desc: 'Earn lucrative margins on every tag sold. Fast moving product with high demand.' },
                { title: 'Marketing Support', desc: 'Get free banners, standees, digital assets, and local lead generation support.' },
                { title: 'Dedicated Partner Dashboard', desc: 'Manage your stock, activate tags on behalf of customers, and track your earnings.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Link to="/partner-plans" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors">
                View Partner Plans & Benefits <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Right Column - Application Form */}
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative">
            {/* Decorative background blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none" />
            
            <h3 className="text-2xl font-black text-gray-900 mb-6 relative z-10">Partner Application</h3>
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase ml-1">Full Name *</label>
                <input 
                  type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white outline-none transition-all font-semibold"
                  placeholder="Your Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase ml-1">Mobile *</label>
                  <input 
                    type="tel" maxLength={10} required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g,'')})}
                    className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white outline-none transition-all font-semibold"
                    placeholder="10-digit number"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase ml-1">City/State *</label>
                  <input 
                    type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white outline-none transition-all font-semibold"
                    placeholder="e.g. Mumbai, MH"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase ml-1">Email (Optional)</label>
                  <input 
                    type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white outline-none transition-all font-semibold"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase ml-1">Business Type</label>
                  <select 
                    value={formData.businessType} onChange={e => setFormData({...formData, businessType: e.target.value})}
                    className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white outline-none transition-all font-semibold"
                  >
                    <option value="Retail Shop">Retail Shop</option>
                    <option value="Garage/Mechanic">Garage / Mechanic</option>
                    <option value="Freelance Sales">Freelance Sales</option>
                    <option value="Distributor">Distributor / Agency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase ml-1">Any Message?</label>
                <textarea 
                  rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white outline-none transition-all font-semibold resize-none"
                  placeholder="Tell us a bit about your current business..."
                />
              </div>

              <button 
                type="submit" disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-emerald-600 hover:from-orange-600 hover:to-emerald-500 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting Application...' : 'Apply Now'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
