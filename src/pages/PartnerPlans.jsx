import React from 'react';
import { ShieldCheck, TrendingUp, Package, Crown, Target, Zap, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';

export default function PartnerPlans() {
  const tiers = [
    {
      name: "Starter / Shop Partner",
      tags: "50 Tags",
      icon: <Package className="w-10 h-10 text-blue-500" />,
      desc: "Perfect for local retail shops, helmet stores, or small garages to test the market.",
      benefits: [
        "High profit margin per tag",
        "Free Basic Marketing Kit (Posters)",
        "Partner Dashboard Access",
        "WhatsApp Support"
      ],
      bg: "bg-blue-50",
      border: "border-blue-100",
      btnClass: "bg-blue-500 hover:bg-blue-600 text-white"
    },
    {
      name: "Growth Distributor",
      tags: "200 Tags",
      icon: <TrendingUp className="w-10 h-10 text-orange-500" />,
      desc: "Ideal for agencies and multi-brand showrooms looking for serious secondary income.",
      isPopular: true,
      benefits: [
        "Very High profit margin per tag",
        "Premium Marketing Kit (Standees + Posters)",
        "Priority Dashboard Access & Analytics",
        "Dedicated Account Manager",
        "Lead forwarding for your city"
      ],
      bg: "bg-orange-50",
      border: "border-orange-200",
      btnClass: "bg-gradient-to-r from-orange-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-white shadow-lg shadow-orange-500/30"
    },
    {
      name: "Master Franchise",
      tags: "1000+ Tags",
      icon: <Crown className="w-10 h-10 text-purple-500" />,
      desc: "For city-level master distributors aiming to cover large territories and multiple shops.",
      benefits: [
        "Maximum profit margin / Wholesale rates",
        "Complete Marketing & Branding Setup",
        "Exclusive Area Rights (City Level)",
        "Direct company training & support",
        "Custom billing solutions"
      ],
      bg: "bg-purple-50",
      border: "border-purple-100",
      btnClass: "bg-purple-600 hover:bg-purple-700 text-white"
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-20 selection:bg-orange-500/30">
      <PageHero
        badge="💼 PARTNER PLANS & BENEFITS"
        title="Choose Your"
        highlightText="Growth Path"
        description="Whether you have a single shop or a state-wide distribution network, we have a highly profitable plan tailored for you."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 lg:pt-16 relative z-10">
        
        {/* Pricing/Tiers Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div key={idx} className={`relative bg-white rounded-3xl p-8 border shadow-lg ${tier.isPopular ? 'border-orange-400 shadow-orange-500/10 scale-100 lg:scale-105 z-10' : 'border-gray-200 shadow-gray-200/50'}`}>
              {tier.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-emerald-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className={`w-20 h-20 rounded-2xl ${tier.bg} ${tier.border} border flex items-center justify-center mb-6`}>
                {tier.icon}
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-2">{tier.name}</h3>
              <div className="text-sm font-bold text-gray-500 mb-4 bg-gray-100 inline-block px-3 py-1 rounded-lg">Starts at {tier.tags}</div>
              <p className="text-gray-600 font-medium text-sm mb-6 leading-relaxed min-h-[60px]">{tier.desc}</p>
              
              <div className="space-y-4 mb-8">
                {tier.benefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="flex gap-3 items-start">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/become-partner" className={`w-full block text-center font-bold py-3.5 rounded-xl transition-all ${tier.btnClass}`}>
                Apply for this Plan
              </Link>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-24 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Why Distributors Love Us</h2>
          <div className="grid sm:grid-cols-2 gap-8 text-left mt-12">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
              <Zap className="w-10 h-10 text-orange-500 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Fast Moving Product</h4>
                <p className="text-sm text-gray-500 mt-1 font-medium">Vehicle safety is a priority for everyone. Our tags practically sell themselves once customers understand the privacy benefits.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
              <Target className="w-10 h-10 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Marketing Materials</h4>
                <p className="text-sm text-gray-500 mt-1 font-medium">We provide high-quality physical standees, posters, and digital creatives for your WhatsApp marketing.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
