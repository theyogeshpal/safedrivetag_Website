import React from 'react';
import { ShieldCheck, TrendingUp, Users, Store, Zap, Handshake, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BecomePartner() {
  const benefits = [
    {
      icon: <TrendingUp className="text-emerald-500 w-8 h-8" />,
      title: "High Profit Margins",
      desc: "Enjoy lucrative margins on every tag sold. The more you sell, the higher your commission bracket."
    },
    {
      icon: <Users className="text-orange-500 w-8 h-8" />,
      title: "Massive Market Demand",
      desc: "Every vehicle owner, biker, and frequent traveler is a potential customer. High conversion rates guaranteed."
    },
    {
      icon: <Zap className="text-emerald-500 w-8 h-8" />,
      title: "Incredibly Easy to Sell",
      desc: "With 100% two-way number masking and zero app installation required, the value proposition is instant and clear."
    },
    {
      icon: <Store className="text-orange-500 w-8 h-8" />,
      title: "Marketing & POS Support",
      desc: "We provide standees, flyers, digital banners, and product training to help you maximize your daily sales."
    }
  ];

  const partnerTypes = [
    {
      title: "Retail Auto Shops",
      desc: "Perfect for helmet stores, car accessory shops, and service centers looking to add a fast-moving premium product to their counter."
    },
    {
      title: "Freelance Agents",
      desc: "Ideal for insurance agents, RTO consultants, or independent sellers wanting to earn extra income by direct selling in their network."
    },
    {
      title: "Distributors",
      desc: "Scale your business by taking city-level or state-level distributorships and managing your own network of retailers."
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-28 sm:pt-36 pb-20 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-up">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Handshake size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 mb-6 tracking-tight leading-tight">
            Partner with <span className="text-orange-500">SafeDriveTag</span> <br className="hidden sm:block" />
            Grow Your Business
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Join India's fastest-growing smart vehicle safety network. Offer your customers peace of mind while enjoying high profit margins and dedicated support.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Why Partner With Us?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:-translate-y-1.5 transition-transform duration-300 group flex items-start gap-5"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-gray-100 shadow-sm">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    {benefit.description || benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Types Section */}
        <div className="bg-gray-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden mb-20 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">Who Can Partner?</h2>
            <p className="text-gray-400 font-medium max-w-xl mx-auto">We offer flexible partnership models tailored to your business scale and target audience.</p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerTypes.map((type, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:bg-white/15 transition-colors">
                <h3 className="text-xl font-bold text-emerald-400 mb-3">{type.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-tr from-emerald-50 to-orange-50 rounded-3xl p-8 sm:p-12 text-center border border-emerald-100 shadow-xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
            Ready to become a SafeDrive Partner?
          </h2>
          <p className="text-gray-600 font-medium mb-8 max-w-lg mx-auto">
            Fill out the partnership inquiry form or contact our sales team directly to get started on your journey with us.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-gray-900/25 hover:-translate-y-1"
          >
            <span>Contact Our Sales Team</span>
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
