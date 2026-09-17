import React from 'react';
import { 
  CheckCircle2, PackageOpen, LayoutDashboard, TrendingUp, Users, Zap, Store, ArrowRight,
  UserPlus, FileCheck, Truck, Banknote, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BecomePartner() {
  const steps = [
    {
      title: "Apply for the program",
      desc: "Fill out the simple partner application form with your business details.",
      icon: <UserPlus className="w-5 h-5 text-orange-500" />
    },
    {
      title: "Get your Partner Account",
      desc: "Once approved, you'll get access to your dedicated partner dashboard.",
      icon: <FileCheck className="w-5 h-5 text-orange-500" />
    },
    {
      title: "Receive your Inventory",
      desc: "Order your initial stock of SafeDrive tags at wholesale partner rates.",
      icon: <Truck className="w-5 h-5 text-orange-500" />
    },
    {
      title: "Start Selling",
      desc: "Offer the tags to your customers. It's an easy upsell with instant value.",
      icon: <Zap className="w-5 h-5 text-orange-500" />
    },
    {
      title: "Earn High Margins",
      desc: "Enjoy lucrative profit margins on every single tag you sell.",
      icon: <Banknote className="w-5 h-5 text-orange-500" />
    }
  ];

  const benefits = [
    {
      icon: <PackageOpen className="text-[#fb641b] w-6 h-6" />,
      title: "Ready to Sell Product",
      desc: "Get a completely ready-to-sell, premium packaged product."
    },
    {
      icon: <LayoutDashboard className="text-[#fb641b] w-6 h-6" />,
      title: "Dedicated Dashboard",
      desc: "Track sales, inventory, and earnings in real-time."
    },
    {
      icon: <TrendingUp className="text-[#fb641b] w-6 h-6" />,
      title: "High Profit Margins",
      desc: "Lucrative margins on every tag. Sell more, earn more."
    },
    {
      icon: <Users className="text-[#fb641b] w-6 h-6" />,
      title: "Massive Demand",
      desc: "Every vehicle owner is a potential customer."
    },
    {
      icon: <Zap className="text-[#fb641b] w-6 h-6" />,
      title: "Incredibly Easy to Sell",
      desc: "100% two-way number masking, zero app installation."
    },
    {
      icon: <Store className="text-[#fb641b] w-6 h-6" />,
      title: "Marketing Support",
      desc: "Standees, flyers, digital banners, and training provided."
    }
  ];

  const partnerTypes = [
    {
      title: "Retail Auto Shops",
      desc: "Perfect for helmet stores, car accessory shops, and service centers."
    },
    {
      title: "Freelance Agents",
      desc: "Ideal for insurance agents, RTO consultants, or independent sellers."
    },
    {
      title: "Distributors",
      desc: "Take city/state-level distributorships and manage retailers."
    }
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-36 sm:pt-44 pb-20 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block bg-orange-100 text-[#fb641b] font-bold px-4 py-1.5 rounded-full text-sm mb-6 border border-orange-200">
              SAFEDRIVE PARTNER PROGRAM
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-blue-950">
              Grow Your Business. <br />
              <span className="text-[#fb641b]">Earn Real Profits.</span>
            </h1>
            <p className="text-lg text-gray-600 font-medium mb-8 max-w-xl mx-auto lg:mx-0">
              Join India's fastest-growing smart vehicle safety network. Offer your customers peace of mind while enjoying high profit margins.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/become-reseller" className="bg-[#fb641b] hover:bg-[#e05615] text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-lg w-full sm:w-auto text-center">
                Apply Now
              </Link>
              <a href="#how-it-works" className="bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-3.5 rounded-full border border-gray-200 transition-all w-full sm:w-auto text-center shadow-sm">
                How It Works
              </a>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg relative">
            <div className="grid grid-cols-2 gap-4">
               {/* Image Grid Composition */}
               <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex flex-col items-center justify-center aspect-square transform -rotate-2 hover:rotate-0 transition-all">
                  <ShieldCheck className="w-16 h-16 text-emerald-500 mb-3" />
                  <p className="font-bold text-sm text-center">Smart Protection</p>
               </div>
               <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 shadow-xl border border-orange-200 flex flex-col items-center justify-center aspect-square transform translate-y-8 hover:translate-y-4 transition-all">
                  <img src="/images/safedrivetag-final.png" alt="Tag" className="w-24 object-contain mb-2 drop-shadow-md" />
                  <p className="font-bold text-sm text-center text-orange-900">Premium Tags</p>
               </div>
               <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex flex-col items-center justify-center aspect-square transform translate-x-4 hover:translate-x-0 transition-all z-10">
                  <LayoutDashboard className="w-16 h-16 text-blue-500 mb-3" />
                  <p className="font-bold text-sm text-center">Partner Portal</p>
               </div>
               <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 shadow-xl border border-emerald-200 flex flex-col items-center justify-center aspect-square transform translate-y-4 translate-x-4 hover:translate-y-0 transition-all">
                  <Users className="w-16 h-16 text-emerald-600 mb-3" />
                  <p className="font-bold text-sm text-center text-emerald-900">Huge Network</p>
               </div>
            </div>
          </div>
        </div>

        {/* Highlight Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="bg-[#eef2f6] rounded-2xl p-8 text-center border border-[#dce4ec]">
            <h3 className="text-3xl font-black text-[#fb641b] mb-1">High</h3>
            <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">Profit Margins</p>
          </div>
          <div className="bg-[#eef6f0] rounded-2xl p-8 text-center border border-[#dcecd8]">
            <h3 className="text-3xl font-black text-[#16a34a] mb-1">Zero</h3>
            <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">Setup Cost</p>
          </div>
          <div className="bg-[#fff3ec] rounded-2xl p-8 text-center border border-[#ffe0d1]">
            <h3 className="text-3xl font-black text-[#fb641b] mb-1">24/7</h3>
            <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">Partner Support</p>
          </div>
        </div>

        {/* Steps to first payout (timeline) */}
        <div id="how-it-works" className="mb-24">
          <div className="text-center mb-10">
             <div className="inline-block bg-orange-100 text-[#fb641b] font-bold px-3 py-1 rounded-full text-xs mb-4">HOW IT WORKS</div>
             <h2 className="text-3xl md:text-4xl font-black text-blue-950">
               Steps to your <span className="text-[#fb641b]">first sale.</span>
             </h2>
             <p className="text-gray-500 font-medium mt-3">Start earning in just a few simple steps.</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 shrink-0 bg-orange-50 border border-orange-100 text-[#fb641b] font-bold rounded-lg flex items-center justify-center">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-blue-950 text-lg">{step.title}</h4>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Partner With Us (Grid of Cards) */}
        <div className="mb-24 bg-gray-50/50 py-12 rounded-3xl border border-gray-100">
           <div className="text-center mb-10">
             <div className="inline-block bg-emerald-100 text-[#16a34a] font-bold px-3 py-1 rounded-full text-xs mb-4">BENEFITS</div>
             <h2 className="text-3xl md:text-4xl font-black text-blue-950">
               Why partner with <span className="text-[#fb641b]">SafeDrive?</span>
             </h2>
             <p className="text-gray-500 font-medium mt-3">We provide everything you need to succeed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto px-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h4 className="font-bold text-blue-950 mb-2">{benefit.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Terms & Conditions (Who can partner) */}
        <div className="mb-24">
          <div className="text-center mb-10">
             <div className="inline-block bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-full text-xs mb-4">ELIGIBILITY</div>
             <h2 className="text-3xl md:text-4xl font-black text-blue-950">
               Who can <span className="text-[#fb641b]">partner?</span>
             </h2>
             <p className="text-gray-500 font-medium mt-3">Flexible models for every business scale.</p>
          </div>

          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <ul className="space-y-6">
              {partnerTypes.map((type, idx) => (
                <li key={idx} className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="mt-0.5">
                    <CheckCircle2 className="w-6 h-6 text-[#16a34a]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950">{type.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{type.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white border border-gray-200 rounded-3xl p-12 max-w-4xl mx-auto shadow-sm">
          <h2 className="text-3xl md:text-4xl font-black text-blue-950 mb-4">
            Ready to <span className="text-[#fb641b]">join?</span>
          </h2>
          <p className="text-gray-500 font-medium mb-8">
            Become an authorized SafeDriveTag partner today.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a href="mailto:safedrivetag@gmail.com" className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-100">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Email Us
            </a>
          </div>

          <Link to="/become-reseller" className="inline-block bg-[#fb641b] hover:bg-[#e05615] text-white font-bold px-10 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Apply Now
          </Link>
        </div>

      </div>
    </div>
  );
}
