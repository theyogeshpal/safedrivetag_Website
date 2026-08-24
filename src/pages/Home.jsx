import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, QrCode, Lock, BellRing, Phone, Car, Bike, Truck, ChevronDown, CheckCircle, Star, AlertTriangle, ArrowRight, Zap, Play, Briefcase, Sparkles, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(0);
  const [activeStep, setActiveStep] = useState(1);

  // Auto-redirect logged-in users or PWA standalone launch directly to Dashboard
  useEffect(() => {
    const isStandalonePWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const hasToken = localStorage.getItem('safedrivetag_auth_token') || localStorage.getItem('safedrive_current_user');
    if (currentUser || (isStandalonePWA && hasToken)) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  // Interactive step rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const faqs = [
    { 
      q: "What is SafeDrive-Tag?", 
      a: "SafeDrive-Tag is an intelligent, weatherproof QR sticker tag for your vehicles and travel luggage. When someone scans it with any smartphone camera, you receive instant WhatsApp and SMS alerts, and they can contact you through our secure masked calling bridge without ever seeing your real phone number." 
    },
    { 
      q: "How does the private calling work?", 
      a: "Calls are routed through our secure cloud telephony engine. Both your number and the scanner's number remain 100% hidden, ensuring total two-way anonymity and zero spam." 
    },
    { 
      q: "Can I use SafeDrive-Tag on my flight luggage and travel bags?", 
      a: "Yes! We offer heavy-duty metallic luggage tags with braided steel cables. If your flight suitcase, laptop bag, or backpack is misplaced in a taxi, train, or airport, anyone can scan it to instantly notify you." 
    },
    { 
      q: "Do I or the scanner need to download any app?", 
      a: "No app required at all. It works instantly using the default camera app on any iPhone or Android smartphone." 
    },
    { 
      q: "How do I attach it to my vehicle or luggage?", 
      a: "Vehicle tags feature high-durability 3M peel-and-stick weatherproof adhesive for windshields and headlights. Luggage tags come with braided stainless steel loop cables." 
    },
  ];

  return (
    <div className="bg-[#FAF9F6] font-sans text-gray-900 overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-950">
      
      {/* =========================================================================
          SECTION 1: HERO SECTION (LIGHT / HIGH-TECH MINIMALIST LUXURY)
          ========================================================================= */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-[#FAF9F6]">
        
        {/* Subtle Ambient Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.06] pointer-events-none" />
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-orange-400/15 to-amber-300/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-gradient-to-bl from-blue-400/10 to-teal-300/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 w-full">
          
          {/* Left Column (7 cols): Editorial Typography & Conversion CTAs */}
          <div className="lg:col-span-7 space-y-7 animate-fade-up">
            
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-orange-200/80 px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-xs hover:border-orange-300 transition-colors">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="tracking-wide uppercase text-[11px] text-gray-700">Two-Way Number Masking &bull; 100% Privacy</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-gray-950 leading-[1.12] tracking-tight">
              Stay reachable in emergencies, stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500">private.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl font-medium">
              SafeDrive-Tag is the next-generation smart QR emergency contact tag for your vehicles and travel luggage. Protect your car, bike, and bags without ever exposing your private phone number.
            </p>

            {/* Core Value Props */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 py-1">
              {[
                { icon: <ShieldCheck size={16} className="text-emerald-600" />, text: "Zero Spam Guaranteed" },
                { icon: <Smartphone size={16} className="text-blue-600" />, text: "No App Required" },
                { icon: <Lock size={16} className="text-orange-500" />, text: "Number Never Shared" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200/90 text-gray-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-2xs hover:border-orange-300 hover:shadow-xs transition-all">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                to="/shop" 
                className="group relative inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 sm:px-10 py-4 rounded-full font-black text-sm sm:text-base shadow-[0_10px_30px_rgba(249,115,22,0.35)] hover:shadow-[0_15px_35px_rgba(249,115,22,0.45)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
              >
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                <span>Buy Safety Tag</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/about"
                className="group inline-flex items-center justify-center gap-2.5 bg-white text-gray-800 border border-gray-200/90 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all hover:bg-gray-50 hover:border-gray-300 hover:shadow-xs cursor-pointer"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Play className="w-3.5 h-3.5 text-orange-600 ml-0.5" fill="currentColor" />
                </div>
                <span>See How It Works</span>
              </Link>
            </div>
            
            {/* Live Metric Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-gray-200/80 mt-6">
              <div className="bg-white/90 backdrop-blur-md border border-gray-200/80 p-3.5 rounded-2xl flex flex-col justify-center shadow-2xs hover:border-orange-300 transition-all">
                <span className="text-gray-500 text-[10px] font-extrabold uppercase tracking-wider mb-0.5">Active Users</span>
                <span className="text-gray-950 font-black text-lg leading-tight">9.5L+</span>
              </div>
              
              <div className="bg-white/90 backdrop-blur-md border border-gray-200/80 p-3.5 rounded-2xl flex flex-col justify-center shadow-2xs hover:border-amber-300 transition-all">
                <span className="text-gray-500 text-[10px] font-extrabold uppercase tracking-wider mb-0.5">Rating</span>
                <span className="text-gray-950 font-black text-lg leading-tight flex items-center gap-1">
                  4.9 <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </span>
              </div>

              <div className="bg-white/90 backdrop-blur-md border border-gray-200/80 p-3.5 rounded-2xl flex flex-col justify-center shadow-2xs hover:border-blue-300 transition-all">
                <span className="text-gray-500 text-[10px] font-extrabold uppercase tracking-wider mb-0.5">Total Scans</span>
                <span className="text-gray-950 font-black text-lg leading-tight">2.4M+</span>
              </div>
              
              <div className="bg-white/90 backdrop-blur-md border border-gray-200/80 p-3.5 rounded-2xl flex flex-col justify-center shadow-2xs hover:border-green-300 transition-all">
                <span className="text-gray-500 text-[10px] font-extrabold uppercase tracking-wider mb-0.5">Today's Scans</span>
                <span className="text-gray-950 font-black text-lg leading-tight flex items-center gap-1.5">
                  1,204 
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </span>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): High-Tech Visual Hologram & Privacy Card Stage */}
          <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center animate-fade-up w-full" style={{ animationDelay: '200ms' }}>
            
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-3xl bg-gradient-to-br from-white/95 via-white/80 to-orange-50/50 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_rgba(0,0,0,0.07)] p-6 flex flex-col justify-between overflow-hidden">
              
              {/* Dynamic Laser Scanning Beam */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-scanline z-20 pointer-events-none opacity-70" />

              {/* Floating Two-Way Privacy Card */}
              <div className="relative z-30 bg-white/95 backdrop-blur-xl border border-emerald-200/90 shadow-md shadow-emerald-950/5 rounded-2xl p-4 flex gap-3.5 items-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-950 mb-0.5">100% Two-Way Number Masking</p>
                  <p className="text-[11px] text-gray-600 leading-snug font-medium">When someone scans your tag, they cannot see your phone number, and you cannot see theirs. Complete anonymity.</p>
                </div>
              </div>

              {/* Center Vehicle + Smart Tag Presentation */}
              <div className="relative flex-1 flex flex-col items-center justify-center my-3">
                <img 
                  src="/hero-car.png" 
                  alt="SafeDrive-Tag on Car" 
                  className="w-full max-w-[320px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
                />

                {/* Simulated Holographic Tag Pill */}
                <div className="absolute -bottom-1 bg-gray-950 text-white rounded-2xl px-4 py-3 border border-orange-500/40 shadow-2xl flex items-center gap-3 animate-pulse-glow z-30">
                  <div className="w-10 h-10 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center">
                    <QrCode className="w-7 h-7 text-gray-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                      <span className="text-[11px] font-black tracking-wide text-orange-400 uppercase">Live QR Shield</span>
                    </div>
                    <p className="text-xs font-bold text-gray-100">Scan to Call Owner Privately</p>
                  </div>
                </div>
              </div>

              {/* Bottom Cloud Bridge Alert Card */}
              <div className="relative z-30 bg-white/95 backdrop-blur-xl border border-orange-200/90 shadow-md rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Instant Masked Cloud Call</p>
                    <p className="text-[10px] text-gray-500 font-medium">WhatsApp Alert &bull; 0.4s Instant Routing</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-full">
                  ACTIVE
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          MARQUEE STRIP (DEEP OBSIDIAN ACCENT)
          ========================================================================= */}
      <div className="w-full overflow-hidden my-0">
        <div className="border-y border-white/10 bg-[#090D16] py-4 sm:py-5 overflow-hidden shadow-2xl relative z-20">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 sm:gap-12 px-4 sm:px-6">
                {[
                  { icon: <Lock size={16} />, text: "100% Privacy Preserved" },
                  { icon: <Smartphone size={16} />, text: "Works Without Any App" },
                  { icon: <Shield size={16} />, text: "24/7 Reliable Cloud Service" },
                  { icon: <Zap size={16} />, text: "Instant WhatsApp & Call Routing" },
                  { icon: <CheckCircle size={16} />, text: "Weatherproof 3M Metallic Tags" },
                ].map((item, j) => (
                  <div key={j} className="flex items-center gap-2.5 sm:gap-3 text-white/80 font-bold uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap">
                    <span className="text-orange-500">{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: WHAT IS SAFEDRIVE-TAG? (DARK THEME PRODUCT EXPLORER)
          ========================================================================= */}
      <section className="py-20 md:py-28 px-4 sm:px-6 bg-[#090D16] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-orange-500 font-extrabold tracking-widest text-xs sm:text-sm uppercase mb-2 sm:mb-3 block">Product Architecture</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">What is SafeDrive-Tag?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-xl mx-auto lg:max-w-none w-full">
              <p className="text-base sm:text-lg text-white/75 leading-relaxed mb-8 sm:mb-10 font-medium">
                SafeDrive-Tag is a weatherproof QR code tag for your vehicle that lets anyone contact you instantly without revealing your phone number. When someone scans the QR code with their phone camera, you receive a WhatsApp and SMS alert within seconds. Perfect for parking issues, emergencies, or when someone needs to reach you about your bike, auto, car, SUV, or truck.
              </p>
              
              {/* Stat Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { val: "1,200+", lbl: "Vehicles Protected" },
                  { val: "5,000+", lbl: "Scans Completed" },
                  { val: "4.9★", lbl: "User Rating" },
                  { val: "100%", lbl: "Privacy Guaranteed" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center shadow-lg backdrop-blur-md hover:border-orange-500/50 hover:bg-white/10 transition-all">
                    <div className="text-xl sm:text-2xl font-black text-white mb-1">{stat.val}</div>
                    <div className="text-[10px] sm:text-xs text-white/60 font-bold uppercase tracking-wider">{stat.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Content: Physical Tag Realistic Mockup & Pointer Callouts */}
            <div className="relative flex flex-col justify-center items-center py-10 sm:py-14 w-full max-w-md mx-auto">
              
              {/* Top Pointers (Desktop) */}
              <div className="hidden lg:flex justify-between w-full px-4 mb-2 z-20">
                <div className="flex flex-col items-center animate-fade-up">
                  <div className="bg-white/10 backdrop-blur-md text-[#fcd34d] text-[11px] font-extrabold px-3.5 py-1.5 rounded-full shadow-lg border border-white/20">
                    Unique QR per vehicle
                  </div>
                  <div className="w-0.5 h-6 bg-[#fcd34d]"></div>
                  <div className="w-2 h-2 bg-[#fcd34d] rounded-full"></div>
                </div>

                <div className="flex flex-col items-center animate-fade-up" style={{ animationDelay: '100ms' }}>
                  <div className="bg-white/10 backdrop-blur-md text-[#fcd34d] text-[11px] font-extrabold px-3.5 py-1.5 rounded-full shadow-lg border border-white/20">
                    Scan with any camera
                  </div>
                  <div className="w-0.5 h-6 bg-[#fcd34d]"></div>
                  <div className="w-2 h-2 bg-[#fcd34d] rounded-full"></div>
                </div>
              </div>

              {/* The Physical Tag Itself */}
              <div className="relative bg-[#fcd34d] rounded-2xl sm:rounded-3xl w-full shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col border-2 sm:border-4 border-[#fcd34d] z-10 my-1">
                <div className="w-full h-2.5 sm:h-3 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fcd34d_10px,#fcd34d_20px)]"></div>
                
                <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl mx-1 my-1">
                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="font-black text-xl sm:text-2xl mb-1 flex items-center justify-center sm:justify-start text-black">
                      SafeDrive<span className="bg-black text-white px-1.5 ml-1 rounded text-base sm:text-lg py-0.5">-Tag</span>
                    </div>
                    <div className="text-[9px] text-gray-500 mb-3 font-bold tracking-wide">Vehicle alert sticker &bull; safedrivetag.com</div>
                    <h3 className="font-black text-lg sm:text-xl leading-tight mb-3 text-black">Scan to contact<br className="hidden sm:inline"/><span className="border-b-4 border-[#fcd34d] pb-0.5">the owner.</span></h3>
                    
                    <div className="space-y-1.5 text-xs font-bold text-black/80 text-left">
                      <div className="flex items-center gap-2"><span className="bg-black text-white w-5 h-5 rounded flex items-center justify-center text-[10px] shrink-0">P</span> Wrong Parking</div>
                      <div className="flex items-center gap-2"><span className="bg-black text-white w-5 h-5 rounded flex items-center justify-center text-[12px] shrink-0">!</span> Vehicle Issue</div>
                      <div className="flex items-center gap-2"><span className="bg-red-500 text-white px-1.5 h-5 rounded flex items-center justify-center text-[9px] tracking-widest shrink-0">SOS</span> Emergency</div>
                    </div>
                    <div className="text-[8px] text-gray-400 mt-4 font-bold uppercase tracking-wider">Use phone camera or any QR scanner app to scan</div>
                  </div>
                  
                  <div className="w-28 sm:w-32 shrink-0 flex flex-col items-center bg-[#fcd34d] p-2.5 sm:p-3 rounded-2xl shadow-inner">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://safedrivetag.com" alt="QR Code" className="w-full aspect-square bg-white rounded-xl p-1.5 sm:p-2 shadow-xs" />
                    <div className="mt-1.5 text-[9px] sm:text-[10px] font-black tracking-widest text-black">▲ SCAN ME ▲</div>
                  </div>
                </div>

                <div className="w-full h-2.5 sm:h-3 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fcd34d_10px,#fcd34d_20px)]"></div>
              </div>

              {/* Bottom Pointers (Desktop) */}
              <div className="hidden lg:flex justify-between w-full px-6 mt-2 z-20">
                <div className="flex flex-col items-center animate-fade-up" style={{ animationDelay: '200ms' }}>
                  <div className="w-2 h-2 bg-[#fcd34d] rounded-full"></div>
                  <div className="w-0.5 h-6 bg-[#fcd34d]"></div>
                  <div className="bg-white/10 backdrop-blur-md text-[#fcd34d] text-[11px] font-extrabold px-3.5 py-1.5 rounded-full shadow-lg border border-white/20">
                    SOS / Emergency label
                  </div>
                </div>

                <div className="flex flex-col items-center animate-fade-up" style={{ animationDelay: '300ms' }}>
                  <div className="w-2 h-2 bg-[#fcd34d] rounded-full"></div>
                  <div className="w-0.5 h-6 bg-[#fcd34d]"></div>
                  <div className="bg-white/10 backdrop-blur-md text-[#fcd34d] text-[11px] font-extrabold px-3.5 py-1.5 rounded-full shadow-lg border border-white/20">
                    Weather-proof sticker
                  </div>
                </div>
              </div>

              {/* Mobile Highlight Badges */}
              <div className="grid grid-cols-2 gap-2 mt-4 w-full lg:hidden">
                <span className="bg-white/10 border border-white/15 text-[#fcd34d] text-[11px] font-bold px-3 py-1.5 rounded-xl text-center">✓ Unique QR Code</span>
                <span className="bg-white/10 border border-white/15 text-[#fcd34d] text-[11px] font-bold px-3 py-1.5 rounded-xl text-center">✓ Any Phone Camera</span>
                <span className="bg-white/10 border border-white/15 text-[#fcd34d] text-[11px] font-bold px-3 py-1.5 rounded-xl text-center">✓ SOS Emergency</span>
                <span className="bg-white/10 border border-white/15 text-[#fcd34d] text-[11px] font-bold px-3 py-1.5 rounded-xl text-center">✓ 100% Weatherproof</span>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: HOW WE WORK (LIGHT / 3-STEP FLOW)
          ========================================================================= */}
      <section className="py-20 md:py-28 px-4 sm:px-6 bg-white relative overflow-hidden border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 animate-fade-up">
            <span className="text-orange-600 font-extrabold tracking-widest text-xs sm:text-sm uppercase mb-3 block">Simple Setup</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950">How We Work</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3 max-w-2xl mx-auto font-medium">We give you a premium tag to stick on your vehicle. Whenever there is a casualty, accident, or parking issue, anyone can scan it to contact you.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* The Connecting Line with Left-to-Right Fill Animation */}
            <div className="hidden md:block absolute top-[48px] left-[16%] w-[68%] h-1 bg-gray-200 z-0 overflow-hidden rounded-full">
              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-1000 ease-in-out rounded-full" style={{ width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%' }}></div>
            </div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group cursor-pointer" onMouseEnter={() => setActiveStep(1)}>
              <div className={`w-20 sm:w-24 h-20 sm:h-24 bg-white border-4 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 mb-5 relative ${activeStep === 1 ? 'border-orange-500 scale-105 shadow-orange-500/20' : 'border-gray-100 hover:border-orange-300'}`}>
                <Car className={`w-8 sm:w-10 h-8 sm:h-10 transition-colors duration-500 ${activeStep === 1 ? 'text-orange-500' : 'text-gray-700'}`} />
                <span className={`absolute -top-1.5 -right-1.5 w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-white transition-colors duration-500 ${activeStep === 1 ? 'bg-orange-500 text-white' : 'bg-gray-900 text-white'}`}>1</span>
              </div>
              <div className={`bg-gray-50/70 p-5 sm:p-6 rounded-2xl border transition-all duration-500 w-full ${activeStep === 1 ? 'shadow-xl shadow-orange-500/10 border-orange-200 bg-white -translate-y-1' : 'border-gray-200/80 shadow-xs'}`}>
                <h4 className="font-black text-gray-950 mb-2 text-base sm:text-lg">Stick the Tag</h4>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">Place the premium QR sticker on your car or bike's windshield.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group cursor-pointer" onMouseEnter={() => setActiveStep(2)}>
              <div className={`w-20 sm:w-24 h-20 sm:h-24 bg-white border-4 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 mb-5 relative ${activeStep === 2 ? 'border-orange-500 scale-105 shadow-orange-500/20' : 'border-gray-100 hover:border-orange-300'}`}>
                <QrCode className={`w-8 sm:w-10 h-8 sm:h-10 transition-colors duration-500 ${activeStep === 2 ? 'text-orange-500' : 'text-gray-700'}`} />
                <span className={`absolute -top-1.5 -right-1.5 w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-white transition-colors duration-500 ${activeStep === 2 ? 'bg-orange-500 text-white' : 'bg-gray-900 text-white'}`}>2</span>
              </div>
              <div className={`bg-gray-50/70 p-5 sm:p-6 rounded-2xl border transition-all duration-500 w-full ${activeStep === 2 ? 'shadow-xl shadow-orange-500/10 border-orange-200 bg-white -translate-y-1' : 'border-gray-200/80 shadow-xs'}`}>
                <h4 className="font-black text-gray-950 mb-2 text-base sm:text-lg">Someone Scans It</h4>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">In case of accident or wrong parking, any random person can scan it.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group cursor-pointer" onMouseEnter={() => setActiveStep(3)}>
              <div className={`w-20 sm:w-24 h-20 sm:h-24 bg-white border-4 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 mb-5 relative ${activeStep === 3 ? 'border-orange-500 scale-105 shadow-orange-500/20' : 'border-gray-100 hover:border-orange-300'}`}>
                <Phone className={`w-8 sm:w-10 h-8 sm:h-10 transition-colors duration-500 ${activeStep === 3 ? 'text-orange-500' : 'text-gray-700'}`} />
                <span className={`absolute -top-1.5 -right-1.5 w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-white transition-colors duration-500 ${activeStep === 3 ? 'bg-orange-500 text-white' : 'bg-gray-900 text-white'}`}>3</span>
              </div>
              <div className={`bg-gray-50/70 p-5 sm:p-6 rounded-2xl border transition-all duration-500 w-full ${activeStep === 3 ? 'shadow-xl shadow-orange-500/10 border-orange-200 bg-white -translate-y-1' : 'border-gray-200/80 shadow-xs'}`}>
                <h4 className="font-black text-gray-950 mb-2 text-base sm:text-lg">Direct Contact</h4>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">They choose an option (e.g., Wrong Parking) and contact you via WhatsApp or Masked Call.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FOR EVERY VEHICLE & TRAVEL BAG (DARK LUXURY SHOWCASE)
          ========================================================================= */}
      <section className="py-20 md:py-28 px-4 sm:px-6 bg-[#090D16] text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16 animate-fade-up">
            <span className="text-amber-400 font-extrabold tracking-widest text-xs sm:text-sm uppercase mb-2 sm:mb-3 block">Universal Fleet Compatibility</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Cars. Bikes. Luggage. Backpacks.</h2>
            <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto font-medium">
              SafeDrive-Tag protects your daily commute vehicles and your travel luggage — with instant emergency and lost bag recovery QR alerts.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {[
              { icon: <Car size={32} className="text-blue-400 mb-2" />, title: "Cars & Sedans", desc: "Front & rear windshield tags.", price: "From ₹399" },
              { icon: <Bike size={32} className="text-orange-400 mb-2" />, title: "2-Wheelers", desc: "Bikes & scooters weatherproof tag.", price: "From ₹299" },
              { icon: <Briefcase size={32} className="text-indigo-400 mb-2" />, title: "Flight Luggage", desc: "Metallic tag with steel cable.", price: "From ₹249" },
              { icon: <Car size={32} className="text-purple-400 mb-2" />, title: "SUVs & MUVs", desc: "Heavy-duty reflective badges.", price: "From ₹399" },
              { icon: <Car size={32} className="text-green-400 mb-2" />, title: "Autos & 3W", desc: "Commercial & taxi emergency tag.", price: "From ₹299" },
              { icon: <Truck size={32} className="text-yellow-400 mb-2" />, title: "Trucks & Fleets", desc: "Commercial logistics & fleet tags.", price: "From ₹399" }
            ].map((v, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-between border border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/10 hover:border-orange-500/60 hover:shadow-[0_10px_30px_rgba(249,115,22,0.2)]">
                <div>
                  <div className="text-2xl sm:text-3xl mb-2.5 flex justify-center">{v.icon}</div>
                  <h3 className="font-black text-white text-xs sm:text-sm md:text-base mb-1">{v.title}</h3>
                  <p className="text-[10px] sm:text-[11px] text-white/60 font-medium mb-3 sm:mb-4 leading-relaxed">{v.desc}</p>
                </div>
                <div className="bg-orange-500 text-white text-[9px] sm:text-[10px] font-black px-3 py-1 rounded-full tracking-wide shadow-xs">
                  {v.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: BENTO GRID: INNOVATION & FEATURES (LIGHT THEME)
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-14 animate-fade-up">
            <span className="text-orange-600 font-extrabold tracking-widest text-xs sm:text-sm uppercase mb-1 block">Cutting-Edge Innovation</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950">Smart features, simple setup.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Big Bento 1 */}
            <div className="md:col-span-2 bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-orange-500/50 transition-colors shadow-xs hover:shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors z-0"></div>
              
              <div className="relative z-10 flex-1">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-3 border border-orange-100">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-gray-950 mb-2">100% Two-Way Number Masking</h4>
                <p className="text-gray-600 text-sm sm:text-base max-w-md leading-relaxed font-medium">
                  Total privacy for everyone. When a stranger scans and calls, <strong className="text-orange-500">their number is hidden from you</strong>, and <strong className="text-orange-500">your number is hidden from them</strong>. Complete anonymity guaranteed.
                </p>
              </div>

              <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity self-center">
                <DotLottieReact
                  src="https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie"
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Small Bento 1 */}
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-colors shadow-xs hover:shadow-xl">
              <div className="absolute -bottom-6 -right-6 text-[80px] sm:text-[100px] font-black text-black/[0.03] group-hover:text-green-50 transition-colors leading-none pointer-events-none">01</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3 border border-green-100">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="text-lg sm:text-xl font-black text-gray-950 mb-1">Universal Scan</h4>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Scannable by any default iOS or Android camera. No app downloads required.</p>
              </div>
            </div>

            {/* Small Bento 2 */}
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-colors shadow-xs hover:shadow-xl">
              <div className="absolute -bottom-6 -right-6 text-[80px] sm:text-[100px] font-black text-black/[0.03] group-hover:text-green-50 transition-colors leading-none pointer-events-none">02</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3 border border-green-100">
                  <BellRing className="w-5 h-5" />
                </div>
                <h4 className="text-lg sm:text-xl font-black text-gray-950 mb-1">Instant Alerts</h4>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Get WhatsApp and SMS notifications the moment someone scans your tag.</p>
              </div>
            </div>

            {/* Big Bento 2 */}
            <div className="md:col-span-2 bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-orange-500/50 transition-colors shadow-xs hover:shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative z-10 flex-1">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-3 border border-orange-100">
                  <BellRing className="w-5 h-5" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-gray-950 mb-2">Unlimited Push Notifications</h4>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">Get instantly notified on your phone whenever someone scans your vehicle tag. Pay once and stay connected forever without any limits.</p>
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 relative self-center">
                <div className="absolute inset-0 border-[4px] border-orange-100 rounded-full border-t-orange-500 animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl font-black text-black/40">∞</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FAQ (DARK THEME SUPPORT ACCORDION)
          ========================================================================= */}
      <section className="py-20 md:py-28 px-4 sm:px-6 bg-[#090D16] text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
          
          <div className="text-center md:text-left mb-6 md:mb-0 animate-fade-up">
            <h2 className="text-orange-500 font-extrabold tracking-widest text-xs sm:text-sm uppercase mb-2 sm:mb-4">24/7 Dedicated Support</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6">Got Questions?</h3>
            <p className="text-sm sm:text-base md:text-lg text-white/70 mb-6 sm:mb-8 font-medium">Everything you need to know about SafeDrive-Tag. If you can't find your answer, our support team is just a click away.</p>
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl hidden md:flex items-center justify-center bg-white/5 backdrop-blur-xl p-12 min-h-[300px]">
              <DotLottieReact
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f914/lottie.json"
                loop
                autoplay
                className="w-full h-full max-h-[300px]"
              />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map(({ q, a }, i) => (
              <div
                key={i}
                className={`bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 shadow-sm ${openFaq === i ? 'border-orange-500 bg-white/10 shadow-[0_0_20px_rgba(249,115,22,0.2)]' : 'border-white/10 hover:border-white/20'}`}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <div className="flex justify-between items-center px-5 sm:px-8 py-4 sm:py-6">
                  <h4 className={`font-bold text-base sm:text-lg ${openFaq === i ? 'text-orange-400' : 'text-white'}`}>{q}</h4>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 shrink-0 ml-3 ${openFaq === i ? 'rotate-180 text-orange-400' : 'text-white/40'}`} />
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <p className="px-5 sm:px-8 pb-5 sm:pb-6 text-white/70 text-xs sm:text-sm leading-relaxed font-medium">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: FINAL CTA BANNER (ORANGE ACCENT TO BLACK FOOTER MERGE)
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight">Ready to drive smarter?</h2>
          <p className="text-orange-100 text-base sm:text-xl font-medium mb-8 sm:mb-10 max-w-xl mx-auto">Join 9.5 lakh+ vehicle owners who park with absolute peace of mind.</p>
          <Link to="/shop" className="inline-flex items-center gap-2.5 sm:gap-3 bg-white text-orange-600 px-8 sm:px-11 py-4 sm:py-5 rounded-full font-black text-base sm:text-xl hover:scale-105 transition-transform shadow-2xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
            Get Your Tag Now <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </div>
      </section>
      
    </div>
  );
}
