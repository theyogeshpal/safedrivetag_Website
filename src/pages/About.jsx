import React from 'react';
import { Lock, Handshake, MapPin, Building2, Wrench, CircleParking, ArrowRight, Star, Shield, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import './About.css';

export default function About() {
  return (
    <div className="about-wrapper bg-white font-sans text-black/90 min-h-screen selection:bg-orange-500/30 selection:text-orange-900">

      {/* --- HERO / HEADER BANNER --- */}
      <PageHero
        badge="📖 OUR MISSION & STORY"
        title="Privacy Shouldn't Cost You"
        highlightText="A Phone Call."
        description="SafeDrive-Tag started with a simple frustration: leaving your phone number on vehicle dashboards or luggage tags meant spam, scams, and zero privacy. We built an instant smart QR bridge that connects people without exposing numbers."
        badges={[
          { icon: <Shield size={14} className="text-green-600" />, label: '100% Number Masked' },
          { icon: <Users size={14} className="text-orange-500" />, label: '9.5 Lakh+ Active Users' },
          { icon: <Award size={14} className="text-blue-500" />, label: 'Made in India' }
        ]}
      />

      {/* Values */}
      <section className="values-section">
        <div className="max-w-7xl mx-auto">
          <div className="section-header">
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-3">Our Core Values</p>
            <h2 className="section-title">What we stand for</h2>
          </div>
          <div className="values-grid">
            {[
              { icon: <Lock size={28} className="text-emerald-600" />, iconBg: 'bg-emerald-50 border-emerald-200/80', title: 'Privacy by default', desc: 'Your number is never the product. Everything we build keeps it hidden securely behind our systems.' },
              { icon: <Handshake size={28} className="text-orange-500" />, iconBg: 'bg-orange-50 border-orange-200/80', title: 'Useful, not flashy', desc: 'A tag that just works, exactly the moment someone needs to reach you — no complicated apps required.' },
              { icon: <MapPin size={28} className="text-emerald-600" />, iconBg: 'bg-emerald-50 border-emerald-200/80', title: 'Made in India', desc: 'Designed, built and supported locally by a passionate team working right here in India.' },
            ].map(({ icon, iconBg, title, desc }) => (
              <div key={title} className="value-card hover-lift">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${iconBg} shadow-inner`}>
                  {icon}
                </div>
                <h3 className="value-title">{title}</h3>
                <p className="value-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto stats-grid relative z-10">
          <div>
            <span className="stats-badge">
              <Star size={16} fill="#facc15" stroke="#facc15" /> Trusted Across India
            </span>
            <h2 className="stats-title">
              From a parking problem<br />to <span className="bg-gradient-to-r from-orange-400 to-emerald-400 bg-clip-text text-transparent">9.5 lakh tags.</span>
            </h2>
            <p className="stats-desc">
              We started with a vision that privacy-first contact belongs on every vehicle. Since then, we've crossed 950,000 active tags across the country.
            </p>
            <div className="stats-cards">
              {[
                { val: '950k+', label: 'Active tags', color: 'text-orange-400' },
                { val: '4x', label: 'Safety Index', color: 'text-emerald-400' },
                { val: '98.7%', label: 'Satisfaction', color: 'text-emerald-400' },
                { val: '28', label: 'States served', color: 'text-orange-400' },
              ].map(({ val, label, color }) => (
                <div key={label} className="glass stat-card">
                  <div className={`stat-val ${color}`}>{val}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="stats-img-wrapper">
            <div className="stats-img-blob" />
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"
              alt="Team"
              className="stats-img"
            />
          </div>
        </div>
      </section>

      {/* Custom Solutions */}
      <section className="solutions-section">
        <div className="max-w-7xl mx-auto">
          <div className="section-header">
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-3">Enterprise & B2B</p>
            <h2 className="section-title">Custom solutions</h2>
          </div>
          <div className="solutions-grid">
            {[
              { icon: <Building2 size={28} className="text-emerald-600" />, iconBg: 'bg-emerald-50 border-emerald-200', title: 'Housing Societies', desc: 'Maintain secure vehicle logs and manage visitor parking directly from our QR platform.' },
              { icon: <Wrench size={28} className="text-orange-500" />, iconBg: 'bg-orange-50 border-orange-200', title: 'Garages & Dealers', desc: 'Get co-branded tags for your customers to build long-term loyalty and recurring service revenue.' },
              { icon: <CircleParking size={28} className="text-emerald-600" />, iconBg: 'bg-emerald-50 border-emerald-200', title: 'Commercial Parking', desc: 'Manage parking chaos with ease. Contact wrong-parked vehicle owners instantly and privately.' },
            ].map(({ icon, iconBg, title, desc }) => (
              <div key={title} className="solution-card hover-lift">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${iconBg} shadow-inner`}>{icon}</div>
                <h3 className="solution-title">{title}</h3>
                <p className="value-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-emerald-600 text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">Be part of the 9.5 lakh.</h2>
          <p className="text-orange-100 text-base sm:text-lg mb-8 max-w-lg mx-auto font-medium">Get your SafeDrive-Tag today and drive with ultimate privacy & peace of mind.</p>
          <Link to="/shop" className="inline-flex items-center gap-2.5 bg-white text-gray-950 px-8 py-4 rounded-full font-black text-base hover:scale-105 transition-transform shadow-2xl">
            <span className="text-orange-600 font-black">Buy the Safe Tag @ ₹299</span> <ArrowRight size={20} className="text-emerald-600" />
          </Link>
        </div>
      </section>
    </div>
  );
}
