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
        description="SafeDriveTag started with a simple frustration: leaving your phone number on vehicle dashboards or luggage tags meant spam, scams, and zero privacy. We built an instant smart QR bridge that connects people without exposing numbers."
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
            <p className="about-subtitle">Our Values</p>
            <h2 className="section-title">What we stand for</h2>
          </div>
          <div className="values-grid">
            {[
              { icon: <Lock size={28} />, title: 'Privacy by default', desc: 'Your number is never the product. Everything we build keeps it hidden securely behind our systems.' },
              { icon: <Handshake size={28} />, title: 'Useful, not flashy', desc: 'A tag that just works, exactly the moment someone needs to reach you — no complicated apps required.' },
              { icon: <MapPin size={28} />, title: 'Made in India', desc: 'Designed, built and supported locally by a passionate team working right here in India.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="value-card hover-lift">
                <div className="value-icon-wrapper">
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
      <section className="stats-section">
        <div className="max-w-7xl mx-auto stats-grid">
          <div>
            <span className="stats-badge">
              <Star size={16} fill="#facc15" stroke="#facc15" /> As Seen on TV
            </span>
            <h2 className="stats-title">
              From a parking problem<br />to <span className="gradient-text">9.5 lakh tags.</span>
            </h2>
            <p className="stats-desc">
              We started with a vision that privacy-first contact belongs on every vehicle. Since then, we've crossed 950,000 active tags across the country.
            </p>
            <div className="stats-cards">
              {[
                { val: '950k+', label: 'Active tags' },
                { val: '4x', label: 'Revenue growth' },
                { val: '98.7%', label: 'Satisfaction' },
                { val: '28', label: 'States served' },
              ].map(({ val, label }) => (
                <div key={label} className="glass stat-card">
                  <div className="stat-val">{val}</div>
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
            <p className="about-subtitle">B2B</p>
            <h2 className="section-title">Custom solutions</h2>
          </div>
          <div className="solutions-grid">
            {[
              { icon: <Building2 size={28} />, color: 'blue', title: 'Housing Societies', desc: 'Maintain secure vehicle logs and manage visitor parking directly from our QR platform.' },
              { icon: <Wrench size={28} />, color: 'orange', title: 'Garages', desc: 'Get co-branded tags for your customers to build long-term loyalty and recurring service revenue.' },
              { icon: <CircleParking size={28} />, color: 'green', title: 'Commercial Parking', desc: 'Manage parking chaos with ease. Contact wrong-parked vehicle owners instantly and privately.' },
            ].map(({ icon, color, title, desc }) => (
              <div key={title} className="solution-card hover-lift">
                <div className={`solution-icon-wrapper ${color}`}>{icon}</div>
                <h3 className="solution-title">{title}</h3>
                <p className="value-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-overlay" />
        <div className="cta-content">
          <h2 className="cta-title">Be part of the 9.5 lakh.</h2>
          <p className="cta-desc">Get your SafeDriveTag today and drive with ultimate privacy.</p>
          <Link to="/shop" className="cta-btn">
            Buy the Safe Tag @ ₹299 <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
