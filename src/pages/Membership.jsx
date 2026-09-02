import React from 'react';
import { ShieldCheck, Heart, Zap, Gift, Headphones, Cloud, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Membership() {
  const benefits = [
    {
      icon: <Cloud className="text-orange-500 w-8 h-8" />,
      title: "Lifetime Free Cloud Profile",
      description: "As a family member, you never pay for your vehicle's digital profile hosting. It stays online, free forever."
    },
    {
      icon: <Headphones className="text-emerald-500 w-8 h-8" />,
      title: "Priority WhatsApp Support",
      description: "Skip the queue. Get direct access to our priority WhatsApp support line for any assistance, 24/7."
    },
    {
      icon: <Gift className="text-pink-500 w-8 h-8" />,
      title: "Exclusive Family Discounts",
      description: "Enjoy up to 30% secret discounts on all future purchases, additional vehicle tags, and accessories."
    },
    {
      icon: <Zap className="text-amber-500 w-8 h-8" />,
      title: "Early Access to Features",
      description: "Get early beta access to our newest app features and updates before they are rolled out to the public."
    },
    {
      icon: <ShieldCheck className="text-blue-500 w-8 h-8" />,
      title: "Damage Replacement Guarantee",
      description: "If your tag gets damaged or fades within the first 6 months, we'll send a replacement absolutely free."
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-28 sm:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Heart size={32} className="fill-red-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Welcome to the <span className="text-orange-500">SafeDrive Family</span>
          </h1>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            When you purchase a SafeDrive Tag, you don't just get a product—you become a part of our family. Here are all the exclusive benefits you unlock as a member.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-1.5 transition-transform duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <h2 className="text-2xl sm:text-3xl font-black mb-4 relative z-10">
            Not a member yet?
          </h2>
          <p className="text-gray-400 font-medium mb-8 max-w-lg mx-auto relative z-10">
            Secure your vehicle and instantly unlock all these family benefits by getting your first SafeDrive Tag today.
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:-translate-y-1 relative z-10"
          >
            <span>Get Your Safety Tag</span>
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
