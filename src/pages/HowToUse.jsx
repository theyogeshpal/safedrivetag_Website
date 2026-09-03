import React from 'react';
import { PackageOpen, Smartphone, Maximize, ShieldCheck, ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowToUse() {
  const steps = [
    {
      icon: <PackageOpen className="text-orange-500 w-10 h-10" />,
      title: "Step 1: Get Your Tag",
      description: "Order your Smart QR Safety Tag from our official store. It will be delivered straight to your doorstep within a few days."
    },
    {
      icon: <Smartphone className="text-blue-500 w-10 h-10" />,
      title: "Step 2: Scan & Register",
      description: "Use your smartphone's camera to scan the QR code. You'll be prompted to enter your vehicle details and emergency contact numbers. It takes less than 2 minutes."
    },
    {
      icon: <Maximize className="text-emerald-500 w-10 h-10" />,
      title: "Step 3: Stick on Vehicle",
      description: "Clean the surface and paste the premium quality, weather-resistant sticker on your car's windshield or bike's visor where it's easily visible."
    },
    {
      icon: <ShieldCheck className="text-amber-500 w-10 h-10" />,
      title: "Step 4: Stay Protected",
      description: "You're all set! If someone needs to contact you regarding your vehicle (wrong parking, emergency, lights left on), they can scan the tag to connect securely."
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-28 sm:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            How it <span className="text-orange-500">Works</span>
          </h1>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            Securing your vehicle is as easy as scanning a barcode. Follow these simple steps to activate your SafeDrive Tag and keep your privacy intact.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20 relative">
          {/* Connector Line (visible only on lg screens) */}
          <div className="hidden lg:block absolute top-[52px] left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-orange-100 via-orange-300 to-orange-100 z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl shadow-gray-200/50 border-4 border-[#FAF8F5] flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium px-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Setup Guide Video Section */}
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-[2rem] p-2 mb-20 shadow-2xl relative overflow-hidden">
          <div className="aspect-video bg-black rounded-[1.5rem] flex items-center justify-center border border-gray-700 relative overflow-hidden">
            <video 
              controls 
              playsInline
              className="w-full h-full object-contain"
              preload="metadata"
            >
              <source src="/video/in_want_ki_isme_bolkar_batana.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 text-center shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
            Ready to secure your vehicle?
          </h2>
          <p className="text-gray-500 font-medium mb-8 max-w-lg mx-auto">
            Get your smart tag today and join thousands of responsible drivers prioritizing their privacy and vehicle safety.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/shop" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:-translate-y-1"
            >
              <span>Buy Tag Now</span>
              <ArrowRight size={18} />
            </Link>
            <Link 
              to="/contact" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all"
            >
              <span>Need Help?</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
