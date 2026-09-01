import React, { useState } from 'react';
import { Mail, ChevronRight, ChevronDown, Clock, ShieldCheck, Headphones, Send, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import api from '../services/api';
import { showToast } from '../utils/swal';

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "What is SafeDrive-Tag?", a: "SafeDrive-Tag is a smart QR tag for your vehicles and travel luggage that lets anyone contact you without revealing your private phone number." },
    { q: "How does the private calling work?", a: "Calls are routed through a secure masked bridge server — the caller never sees your real number." },
    { q: "Can I use SafeDrive-Tag on my luggage and travel bags?", a: "Yes! We offer heavy-duty metallic luggage tags with braided steel cables. If your flight bag, suitcase or backpack is misplaced or left behind in a cab or train, anyone can scan it to privately connect with you." },
    { q: "Do I need to download an app?", a: "No app needed. Anyone can scan the QR with their default phone camera." },
    { q: "How do I stick it on my car or attach to bags?", a: "Car & bike tags come with industrial peel-and-stick weather proof adhesive. Luggage tags come with stainless steel braided loop cables for suitcases and backpacks." },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast.error('Please enter your name.');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      showToast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.message.trim()) {
      showToast.error('Please enter your message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitContact({
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim() || undefined,
        subject: formData.subject || 'General Inquiry',
        message: formData.message.trim(),
      });
      if (res.success === true || (res.success !== false && res.status === 200)) {
        showToast.success(res.message || 'Your inquiry has been submitted successfully! Our team will contact you soon.');
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } else {
        showToast.error(res.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      showToast.error('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] font-sans text-black/90 min-h-screen selection:bg-orange-500/30 selection:text-orange-900 pb-20">

      {/* --- HERO --- */}
      <PageHero
        badge="💬 24/7 CUSTOMER SUPPORT"
        title="We're Here to"
        highlightText="Help You."
        description="Questions about your safety tag, an order status, or a partnership? Reach out to our dedicated support team."
        badges={[
          { icon: <Headphones size={14} className="text-orange-500" />, label: 'Fast Response' },
          { icon: <Clock size={14} className="text-blue-500" />, label: 'Mostly replies same day' },
          { icon: <ShieldCheck size={14} className="text-green-600" />, label: '100% Privacy Protected' }
        ]}
      />

      {/* --- MAIN CONTENT --- */}
      <section className="pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12">

          {/* Contact Methods */}
          <div className="space-y-6">
            {[
              {
                icon: <Mail className="w-7 h-7 text-orange-500" />,
                bg: 'bg-orange-50',
                border: 'border-orange-200',
                title: 'Email Support',
                sub: 'For orders, billing & support',
                action: 'safedrivetag@gmail.com',
                actionColor: 'text-orange-600 group-hover:text-orange-700',
                href: 'mailto:safedrivetag@gmail.com',
              },
            ].map(({ icon, bg, border, title, sub, action, actionColor, href }) => (
              <a
                key={title}
                href={href}
                className="flex items-center gap-5 p-6 bg-white border border-black/10 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${bg} ${border}`}>
                  {icon}
                </div>
                <div>
                  <h3 className="font-bold text-black text-lg">{title}</h3>
                  <p className="text-sm text-black/50 mb-1">{sub}</p>
                  <span className={`text-sm font-bold transition-colors ${actionColor}`}>{action}</span>
                </div>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-black/10 rounded-[2rem] p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-black text-black mb-8">Send us a message</h2>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/80">Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-black placeholder:text-black/40" 
                    placeholder="Your name" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/80">
                    Email <span className="text-xs font-normal text-black/40">(Optional)</span>
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-black placeholder:text-black/40" 
                    placeholder="you@email.com (Optional)" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-black/80">Phone *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-sm font-bold text-black/50">IN +91</span>
                  <input 
                    type="tel" 
                    maxLength={10}
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-white border border-black/10 rounded-xl py-3 pl-20 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-black placeholder:text-black/40" 
                    placeholder="9876543210" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-black/80">Message *</label>
                <textarea 
                  rows="4" 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-black placeholder:text-black/40 resize-none" 
                  placeholder="How can we help?" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-emerald-600 hover:from-orange-600 hover:to-emerald-500 text-white font-black text-lg py-4 rounded-xl transition-all shadow-md hover:shadow-lg shadow-orange-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto bg-white border border-black/10 rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="text-2xl font-black text-black mb-8 text-center">FAQ</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl bg-white border border-black/5 transition-colors overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex items-center w-full justify-between p-5 hover:bg-black/5 group transition-colors text-left"
                >
                  <span className="font-bold text-black/80 group-hover:text-black">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-black/40 group-hover:text-orange-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`px-5 text-black/60 font-medium overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
