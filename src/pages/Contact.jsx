import React, { useState } from 'react';
import { Mail, MapPin, ChevronRight, ChevronDown, Clock, ShieldCheck, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'How do I activate my tag?', a: 'To activate your tag, simply scan it with your smartphone and follow the on-screen instructions to register your vehicle details.' },
    { q: 'When will my order arrive?', a: 'Orders typically arrive within 3-5 business days depending on your location.' },
    { q: 'Do you offer reseller partnerships?', a: 'Yes, we do! Please reach out to our sales team through the contact form above for more details.' },
    { q: 'How do I transfer a tag to a new owner?', a: 'You can transfer ownership from your account dashboard by selecting the tag and choosing "Transfer Ownership".' }
  ];

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
          { icon: <Clock size={14} className="text-blue-500" />, label: 'Mon-Sat 9AM - 8PM' },
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
                title: 'Email',
                sub: 'For orders, billing & support',
                action: 'safedrivetag@gmail.com',
                actionColor: 'text-orange-600 group-hover:text-orange-700',
                href: 'mailto:safedrivetag@gmail.com',
              },
              {
                icon: <MapPin className="w-7 h-7 text-emerald-600" />,
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                title: 'Office Location',
                sub: 'SafeDrive Tech Innovations',
                action: 'Gomti Nagar, Lucknow, UP 226010',
                actionColor: 'text-emerald-600 group-hover:text-emerald-700',
                href: '#',
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
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/80">Name</label>
                  <input type="text" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-black placeholder:text-black/40" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/80">
                    Email <span className="text-xs font-normal text-black/40">(Optional)</span>
                  </label>
                  <input type="email" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-black placeholder:text-black/40" placeholder="you@email.com (Optional)" />
                </div>
              </div>

              <div className="grid md:grid-cols-[1fr_2fr] gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/80">Code</label>
                  <select className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-black appearance-none">
                    <option>🇮🇳 +91</option>
                    <option>🇺🇸 +1</option>
                    <option>🇬🇧 +44</option>
                    <option>🇦🇪 +971</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/80">Phone</label>
                  <input type="tel" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-black placeholder:text-black/40" placeholder="Phone number" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-black/80">Message</label>
                <textarea rows="4" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-black placeholder:text-black/40 resize-none" placeholder="How can we help?" />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-black/20 text-emerald-600 focus:ring-emerald-500" />
                <label htmlFor="terms" className="text-sm text-black/50 font-medium">
                  I agree to the <Link to="/terms" className="text-emerald-700 font-bold hover:underline">Terms & Conditions</Link>. We won't spam you.
                </label>
              </div>

              <button type="button" className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-emerald-600 hover:from-orange-600 hover:to-emerald-500 text-white font-black text-lg py-4 rounded-xl transition-all shadow-md hover:shadow-lg shadow-orange-500/20 cursor-pointer">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto bg-white border border-black/10 rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="text-2xl font-black text-black mb-8 text-center">Common questions</h2>
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
