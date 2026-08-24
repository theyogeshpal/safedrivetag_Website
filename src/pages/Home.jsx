import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, QrCode, Lock, BellRing, Phone, Car, Bike, Truck, ChevronDown, CheckCircle, Star, AlertTriangle, ArrowRight, Zap, Play, Briefcase, ShieldCheck, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(0);
  const [activeStep, setActiveStep] = useState(1);

  // Auto-redirect logged-in users or PWA standalone launch directly to Dashboard
  useEffect(() => {
    const isStandalonePWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const hasToken = localStorage.getItem('safedrive_auth_token') || localStorage.getItem('safedrive_current_user');
    if (currentUser || (isStandalonePWA && hasToken)) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const faqs = [
    { q: "What is SafeDrive-Tag?", a: "SafeDrive-Tag is a smart QR tag for your vehicles and travel luggage that lets anyone contact you without revealing your private phone number." },
    { q: "How does the private calling work?", a: "Calls are routed through a secure masked bridge server — the caller never sees your real number." },
    { q: "Can I use SafeDrive-Tag on my luggage and travel bags?", a: "Yes! We offer heavy-duty metallic luggage tags with braided steel cables. If your flight bag, suitcase or backpack is misplaced or left behind in a cab or train, anyone can scan it to privately connect with you." },
    { q: "Do I need to download an app?", a: "No app needed. Anyone can scan the QR with their default phone camera." },
    { q: "How do I stick it on my car or attach to bags?", a: "Car & bike tags come with industrial peel-and-stick weatherproof adhesive. Luggage tags come with stainless steel braided loop cables for suitcases and backpacks." },
  ];

  return (
    <div className="bg-white font-sans text-black/80 overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-900">
      
      {/* --- HERO SECTION --- */}
      <section className="relative flex items-center pt-24 lg:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10 w-full">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 animate-fade-up">

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-gray-950 leading-[1.12] tracking-tight">
              Stay reachable in emergencies,<br />
              <span className="text-orange-500">stay private.</span>
            </h1>

            {/* Description */}
            <p className="text-base text-gray-600 leading-relaxed max-w-lg font-medium">
              SafeDrive-Tag is the next-generation smart QR emergency contact tag for your vehicles and travel luggage. Protect your car, bike, and bags without ever exposing your private phone number.
            </p>

            {/* 1. Top 3-Value Props Bar (Exact Reference) */}
            <div className="bg-white/95 border border-gray-200/80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2 items-center">
              {/* Item 1 */}
              <div className="flex items-center gap-3 px-2">
                <div className="w-11 h-11 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 shrink-0 shadow-inner">
                  <span className="text-base font-bold">🚫</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 leading-tight">No spamming</h4>
                  <p className="text-[11px] text-gray-500 font-medium">100% spam-free</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-3 px-2 sm:border-l sm:border-gray-100">
                <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
                  <QrCode size={19} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 leading-tight">No app needed</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Instantly works</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-3 px-2 sm:border-l sm:border-gray-100">
                <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shrink-0 shadow-inner">
                  <Lock size={18} className="text-amber-500" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 leading-tight">No number shared</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Your privacy protected</p>
                </div>
              </div>
            </div>

            {/* 2. Action Buttons Row (Exact Reference) */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5 pt-1">
              {/* Buy Safety Tag Primary CTA */}
              <Link 
                to="/shop" 
                className="group flex-1 min-w-[240px] bg-gradient-to-r from-[#009b3a] via-[#00a843] to-[#00b84c] hover:from-[#008f35] hover:to-[#00a843] text-white p-2.5 sm:p-3 pr-4 sm:pr-5 rounded-2xl sm:rounded-3xl shadow-[0_10px_25px_rgba(0,168,67,0.3)] transition-all duration-200 flex items-center justify-between gap-3 overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner">
                    <div className="w-8 h-8 rounded-full bg-white text-[#009b3a] flex items-center justify-center shadow-sm">
                      <ShieldCheck size={19} />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-black text-base sm:text-lg leading-tight tracking-tight text-white">Buy Safety Tag</div>
                    <div className="text-[11px] text-white/90 font-medium">Secure. Smart. Reliable.</div>
                  </div>
                </div>

                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#009b3a] flex items-center justify-center shrink-0 shadow-md group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={18} className="stroke-[2.5]" />
                </div>
              </Link>

              {/* Watch Video Secondary CTA */}
              <button 
                type="button"
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="animate-watch-btn-glow border p-2.5 sm:p-3 pr-6 sm:pr-7 rounded-2xl sm:rounded-3xl transition-all flex items-center gap-3.5 cursor-pointer text-left shrink-0 active:scale-95"
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center animate-watch-btn-icon shrink-0">
                  <Play size={16} className="animate-watch-btn-play ml-0.5" />
                </div>

                <div>
                  <div className="font-extrabold text-sm sm:text-base leading-tight animate-watch-btn-title">Watch Video</div>
                  <div className="text-[11px] font-medium animate-watch-btn-subtitle">See how it works</div>
                </div>
              </button>
            </div>
            
            {/* 3. 4 Soft-Tinted Metric Cards (Exact Reference) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {/* Card 1: TRUSTED USERS */}
              <div className="bg-gradient-to-b from-white via-white to-orange-50/40 border border-orange-100 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-orange-100/70 border border-orange-200/60 flex items-center justify-center text-orange-600 shrink-0">
                  <Shield size={19} className="text-orange-600" />
                </div>
                <div>
                  <span className="text-orange-600 text-[10px] font-extrabold uppercase tracking-wider block mb-0.5">Trusted Users</span>
                  <span className="text-gray-950 font-black text-lg leading-none block">9.5L+</span>
                  <span className="text-[10px] text-gray-500 font-medium block mt-0.5">Across India</span>
                </div>
              </div>

              {/* Card 2: RATING */}
              <div className="bg-gradient-to-b from-white via-white to-amber-50/40 border border-amber-100 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-200/60 flex items-center justify-center text-amber-500 shrink-0">
                  <Star size={19} className="fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <span className="text-amber-600 text-[10px] font-extrabold uppercase tracking-wider block mb-0.5">Rating</span>
                  <span className="text-gray-950 font-black text-lg leading-none flex items-center gap-1">
                    4.8 <Star size={12} className="fill-amber-400 text-amber-400" />
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium block mt-0.5">From 50K+ reviews</span>
                </div>
              </div>

              {/* Card 3: TOTAL SCANS */}
              <div className="bg-gradient-to-b from-white via-white to-blue-50/40 border border-blue-100 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
                  <QrCode size={19} className="text-blue-600" />
                </div>
                <div>
                  <span className="text-blue-600 text-[10px] font-extrabold uppercase tracking-wider block mb-0.5">Total Scans</span>
                  <span className="text-blue-600 font-black text-lg leading-none block">2.4M+</span>
                  <span className="text-[10px] text-gray-500 font-medium block mt-0.5">All time scans</span>
                </div>
              </div>

              {/* Card 4: TODAY'S SCANS */}
              <div className="bg-gradient-to-b from-white via-white to-emerald-50/40 border border-emerald-100 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
                  <QrCode size={19} className="text-emerald-600" />
                </div>
                <div>
                  <span className="text-emerald-600 text-[10px] font-extrabold uppercase tracking-wider block mb-0.5">Today's Scans</span>
                  <span className="text-emerald-700 font-black text-lg leading-none flex items-center gap-1">
                    1,204 
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px]">
                      <TrendingUp size={9} className="stroke-[3]" />
                    </span>
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium block mt-0.5">Live updates</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Clean White Stage Showcase Card */}
          <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center animate-fade-up w-full" style={{ animationDelay: '200ms' }}>
            
            <div className="relative w-full max-w-[480px] bg-white rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col gap-4">
              
              {/* Top Two-Way Privacy Card */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Lock size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 mb-0.5">100% Two-Way Number Masking</h4>
                  <p className="text-[11px] text-gray-600 leading-snug font-medium">
                    With SafeDrive-Tag's two-way masking, you can give out your phone number, and you can text them back. Complete anonymity.
                  </p>
                </div>
              </div>

              {/* Center Car Graphic with Interactive Tag Pointer */}
              <div className="relative bg-gray-50/70 rounded-2xl p-4 pt-6 flex flex-col items-center justify-center overflow-hidden border border-gray-100">
                {/* Floating QR Tag pointer badge */}
                <div className="absolute top-3 right-6 flex items-center gap-1.5 z-20">
                  <div className="w-12 h-14 bg-white border border-gray-200 rounded-xl p-1 shadow-md flex flex-col items-center justify-center text-center">
                    <QrCode size={24} className="text-gray-900 mb-0.5" />
                    <span className="text-[7px] font-black tracking-widest text-orange-500">SCAN</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-orange-400 border-dashed animate-spin flex items-center justify-center opacity-60" style={{ animationDuration: '8s' }} />
                </div>

                <img 
                  src="/hero-car.png" 
                  alt="SafeDrive-Tag on Car" 
                  className="w-full max-w-[340px] object-contain drop-shadow-xl" 
                />

                {/* Dark Live QR Shield Pill */}
                <div className="w-full max-w-[360px] bg-[#0c1427] text-white rounded-2xl p-3 flex items-center gap-3.5 border border-white/10 shadow-xl mt-2">
                  <div className="w-10 h-10 bg-white rounded-xl p-1.5 shrink-0 flex items-center justify-center text-gray-950 shadow-xs">
                    <QrCode size={28} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-wider text-orange-400 uppercase">LIVE QR SHIELD</div>
                    <div className="text-xs font-bold text-gray-100">Scan to Call Owner Privately</div>
                  </div>
                </div>
              </div>

              {/* Bottom Cloud Bridge Status Card */}
              <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-gray-900">Instant Masked Cloud Call</p>
                    <p className="text-[10px] text-gray-500 font-medium">WhatsApp Alert &bull; Call & Text Forwarding</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                  ACTIVE
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <div className="w-full overflow-hidden my-4 sm:my-8">
        <div className="border-y border-black/10 bg-white py-4 sm:py-5 overflow-hidden shadow-sm relative z-20 -rotate-2 scale-105">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 sm:gap-12 px-4 sm:px-6">
                {[
                  { icon: <Lock />, text: "100% Privacy Preserved" },
                  { icon: <Smartphone />, text: "Works Without Any App" },
                  { icon: <Shield />, text: "24/7 Reliable Service" },
                  { icon: <Zap />, text: "Instant Call Routing" },
                  { icon: <CheckCircle />, text: "Weatherproof Tags" },
                ].map((item, j) => (
                  <div key={j} className="flex items-center gap-2.5 sm:gap-3 text-black/60 font-bold uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap">
                    <span className="text-orange-500">{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- WHAT IS SAFEDRIVETAG --- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#fcfaf5] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-orange-500 font-bold tracking-widest text-xs sm:text-sm uppercase mb-2 sm:mb-3 block">About</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight">What is SafeDrive-Tag?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-xl mx-auto lg:max-w-none w-full">
              <p className="text-base sm:text-lg text-black/70 leading-relaxed mb-8 sm:mb-10 font-medium">
                SafeDrive-Tag is a weatherproof QR code tag for your vehicle that lets anyone contact you instantly without revealing your phone number. When someone scans the QR code with their phone camera, you receive a WhatsApp-SMS alert within seconds. Perfect for parking issues, emergencies, or when someone needs to reach you about your bike, auto, car, SUV, or truck.
              </p>
              
              {/* Stat Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { val: "1200+", lbl: "Vehicles Protected" },
                  { val: "5000+", lbl: "Scans Completed" },
                  { val: "4.9★", lbl: "User Rating" },
                  { val: "100%", lbl: "Privacy Guaranteed" }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#fdf8d5] border border-[#f4e28e] rounded-xl p-3 sm:p-4 text-center shadow-sm">
                    <div className="text-xl sm:text-2xl font-black text-black mb-1">{stat.val}</div>
                    <div className="text-[10px] sm:text-xs text-black/60 font-bold uppercase tracking-wider">{stat.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Content: The Visual Tag with Pointers */}
            <div className="relative flex justify-center items-center py-6 sm:py-10 lg:py-0 w-full max-w-md mx-auto">
              
              {/* The Tag Itself */}
              <div className="relative bg-[#fcd34d] rounded-2xl sm:rounded-3xl w-full shadow-2xl overflow-hidden flex flex-col border-2 sm:border-4 border-[#fcd34d]">
                {/* Yellow/Black striped border top */}
                <div className="w-full h-2.5 sm:h-3 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fcd34d_10px,#fcd34d_20px)]"></div>
                
                {/* Tag Content */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl mx-1 my-1">
                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="font-black text-xl sm:text-2xl mb-1 flex items-center justify-center sm:justify-start">
                      SafeDrive<span className="bg-black text-white px-1.5 ml-1 rounded text-base sm:text-lg py-0.5">Tag</span>
                    </div>
                    <div className="text-[8px] sm:text-[9px] text-gray-500 mb-3 sm:mb-4 font-bold tracking-wide">Vehicle alert sticker • safedrivetag.com</div>
                    <h3 className="font-black text-lg sm:text-xl leading-tight mb-3 sm:mb-4">Scan to contact<br className="hidden sm:inline"/><span className="border-b-4 border-[#fcd34d] pb-0.5">the owner.</span></h3>
                    
                    <div className="space-y-1.5 sm:space-y-2 text-xs font-bold text-black/80 text-left">
                      <div className="flex items-center gap-2"><span className="bg-black text-white w-5 h-5 rounded flex items-center justify-center text-[10px] shrink-0">P</span> Wrong Parking</div>
                      <div className="flex items-center gap-2"><span className="bg-black text-white w-5 h-5 rounded flex items-center justify-center text-[12px] shrink-0">!</span> Vehicle Issue</div>
                      <div className="flex items-center gap-2"><span className="bg-red-500 text-white px-1.5 h-5 rounded flex items-center justify-center text-[9px] tracking-widest shrink-0">SOS</span> Emergency</div>
                    </div>
                    <div className="text-[8px] text-gray-400 mt-4 sm:mt-6 font-bold uppercase tracking-wider">Use phone camera or any QR scanner app to scan</div>
                  </div>
                  
                  <div className="w-28 sm:w-32 shrink-0 flex flex-col items-center bg-[#fcd34d] p-2.5 sm:p-3 rounded-2xl">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://safedrivetag.com" alt="QR Code" className="w-full aspect-square bg-white rounded-xl p-1.5 sm:p-2" />
                    <div className="mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] font-black tracking-widest text-black">▲ SCAN ME ▲</div>
                  </div>
                </div>

                {/* Yellow/Black striped border bottom */}
                <div className="w-full h-2.5 sm:h-3 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fcd34d_10px,#fcd34d_20px)]"></div>
              </div>

              {/* Pointers (absolute positioned) - Hidden on mobile, visible on lg */}
              <div className="absolute -top-2 left-[15%] hidden lg:flex flex-col items-center animate-fade-up">
                <div className="bg-black text-[#fcd34d] text-[10px] font-bold px-3 py-1.5 rounded-full mb-1 border border-black/20">Unique QR per vehicle</div>
                <div className="w-0.5 h-8 bg-[#fcd34d]"></div>
                <div className="w-2 h-2 bg-[#fcd34d] rounded-full"></div>
              </div>

              <div className="absolute -top-2 right-[15%] hidden lg:flex flex-col items-center animate-fade-up" style={{ animationDelay: '100ms' }}>
                <div className="bg-black text-[#fcd34d] text-[10px] font-bold px-3 py-1.5 rounded-full mb-1 border border-black/20">Scan with any camera</div>
                <div className="w-0.5 h-8 bg-[#fcd34d]"></div>
                <div className="w-2 h-2 bg-[#fcd34d] rounded-full"></div>
              </div>

              <div className="absolute -bottom-2 left-[20%] hidden lg:flex flex-col items-center animate-fade-up" style={{ animationDelay: '200ms' }}>
                <div className="w-2 h-2 bg-[#fcd34d] rounded-full"></div>
                <div className="w-0.5 h-8 bg-[#fcd34d] mt-0.5"></div>
                <div className="bg-black text-[#fcd34d] text-[10px] font-bold px-3 py-1.5 rounded-full mt-1 border border-black/20">SOS / Emergency label</div>
              </div>

              <div className="absolute -bottom-2 right-[20%] hidden lg:flex flex-col items-center animate-fade-up" style={{ animationDelay: '300ms' }}>
                <div className="w-2 h-2 bg-[#fcd34d] rounded-full"></div>
                <div className="w-0.5 h-8 bg-[#fcd34d] mt-0.5"></div>
                <div className="bg-black text-[#fcd34d] text-[10px] font-bold px-3 py-1.5 rounded-full mt-1 border border-black/20">Weather-proof sticker</div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 animate-fade-up">
            <span className="text-orange-500 font-black tracking-widest text-xs sm:text-sm uppercase mb-3 block">Process</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black">How We Work</h2>
            <p className="text-sm sm:text-base text-black/60 mt-3 max-w-2xl mx-auto font-medium">We give you a premium tag to stick on your vehicle. Whenever there is a casualty, accident, or parking issue, anyone can scan it to contact you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* The Connecting Line with Left-to-Right Fill Animation */}
            <div className="hidden md:block absolute top-[48px] left-[16%] w-[68%] h-1 bg-black/5 z-0 overflow-hidden rounded-full">
              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-1000 ease-in-out rounded-full" style={{ width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%' }}></div>
            </div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group cursor-pointer" onMouseEnter={() => setActiveStep(1)}>
              <div className={`w-20 sm:w-24 h-20 sm:h-24 bg-white border-4 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 mb-5 relative ${activeStep === 1 ? 'border-orange-500 scale-105 shadow-orange-500/20' : 'border-white hover:border-orange-300'}`}>
                <Car className={`w-8 sm:w-10 h-8 sm:h-10 transition-colors duration-500 ${activeStep === 1 ? 'text-orange-500' : 'text-black/80'}`} />
                <span className={`absolute -top-1.5 -right-1.5 w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-white transition-colors duration-500 ${activeStep === 1 ? 'bg-orange-500 text-white' : 'bg-black text-white'}`}>1</span>
              </div>
              <div className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all duration-500 w-full ${activeStep === 1 ? 'shadow-xl shadow-orange-500/10 border-orange-200 -translate-y-1' : 'border-black/5 shadow-sm'}`}>
                <h4 className="font-black text-black mb-2 text-base sm:text-lg">Stick the Tag</h4>
                <p className="text-black/60 text-xs sm:text-sm">Place the premium QR sticker on your car or bike's windshield.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group cursor-pointer" onMouseEnter={() => setActiveStep(2)}>
              <div className={`w-20 sm:w-24 h-20 sm:h-24 bg-white border-4 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 mb-5 relative ${activeStep === 2 ? 'border-orange-500 scale-105 shadow-orange-500/20' : 'border-white hover:border-orange-300'}`}>
                <QrCode className={`w-8 sm:w-10 h-8 sm:h-10 transition-colors duration-500 ${activeStep === 2 ? 'text-orange-500' : 'text-black/80'}`} />
                <span className={`absolute -top-1.5 -right-1.5 w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-white transition-colors duration-500 ${activeStep === 2 ? 'bg-orange-500 text-white' : 'bg-black text-white'}`}>2</span>
              </div>
              <div className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all duration-500 w-full ${activeStep === 2 ? 'shadow-xl shadow-orange-500/10 border-orange-200 -translate-y-1' : 'border-black/5 shadow-sm'}`}>
                <h4 className="font-black text-black mb-2 text-base sm:text-lg">Someone Scans It</h4>
                <p className="text-black/60 text-xs sm:text-sm">In case of accident or wrong parking, any random person can scan it.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group cursor-pointer" onMouseEnter={() => setActiveStep(3)}>
              <div className={`w-20 sm:w-24 h-20 sm:h-24 bg-white border-4 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 mb-5 relative ${activeStep === 3 ? 'border-orange-500 scale-105 shadow-orange-500/20' : 'border-white hover:border-orange-300'}`}>
                <Phone className={`w-8 sm:w-10 h-8 sm:h-10 transition-colors duration-500 ${activeStep === 3 ? 'text-orange-500' : 'text-black/80'}`} />
                <span className={`absolute -top-1.5 -right-1.5 w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-white transition-colors duration-500 ${activeStep === 3 ? 'bg-orange-500 text-white' : 'bg-black text-white'}`}>3</span>
              </div>
              <div className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all duration-500 w-full ${activeStep === 3 ? 'shadow-xl shadow-orange-500/10 border-orange-200 -translate-y-1' : 'border-black/5 shadow-sm'}`}>
                <h4 className="font-black text-black mb-2 text-base sm:text-lg">Direct Contact</h4>
                <p className="text-black/60 text-xs sm:text-sm">They choose an option (e.g., Wrong Parking) and contact you via WhatsApp or Masked Call.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOR EVERY VEHICLE & TRAVEL BAG --- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#fcfaf5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 animate-fade-up">
            <span className="text-[#c29623] font-bold tracking-widest text-xs sm:text-sm uppercase mb-2 sm:mb-3 block">For Vehicles & Travel Belongings</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-4">Cars. Bikes. Luggage. Backpacks.</h2>
            <p className="text-sm sm:text-base md:text-lg text-black/60 max-w-2xl mx-auto font-medium">
              SafeDrive-Tag protects your daily commute vehicles and your travel luggage — with instant emergency and lost bag recovery QR alerts.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {[
              { icon: <Car size={34} className="text-blue-500 mb-2" />, title: "Cars & Sedans", desc: "Front & rear windshield tags.", price: "From ₹399", highlight: true },
              { icon: <Bike size={34} className="text-orange-500 mb-2" />, title: "2-Wheelers", desc: "Bikes & scooters weatherproof tag.", price: "From ₹299", highlight: false },
              { icon: <Briefcase size={34} className="text-indigo-600 mb-2" />, title: "Flight Luggage", desc: "Metallic tag with steel cable.", price: "From ₹249", highlight: true },
              { icon: <Car size={34} className="text-purple-600 mb-2" />, title: "SUVs & MUVs", desc: "Heavy-duty reflective badges.", price: "From ₹399", highlight: false },
              { icon: <Car size={34} className="text-green-600 mb-2" />, title: "Autos & 3W", desc: "Commercial & taxi emergency tag.", price: "From ₹299", highlight: false },
              { icon: <Truck size={34} className="text-yellow-600 mb-2" />, title: "Trucks & Fleets", desc: "Commercial logistics & fleet tags.", price: "From ₹399", highlight: false }
            ].map((v, i) => (
              <div key={i} className={`bg-[#fdf8d5] rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1 ${v.highlight ? 'border-2 border-[#fcd34d] shadow-[0_10px_30px_rgba(252,211,77,0.3)] sm:scale-105 z-10' : 'border border-[#f4e28e] shadow-sm'}`}>
                <div>
                  <div className="text-2xl sm:text-3xl mb-2.5 flex justify-center">{v.icon}</div>
                  <h3 className="font-black text-black text-xs sm:text-sm md:text-base mb-1">{v.title}</h3>
                  <p className="text-[10px] sm:text-[11px] text-black/60 font-medium mb-3 sm:mb-4 leading-relaxed">{v.desc}</p>
                </div>
                <div className="bg-black text-[#fcd34d] text-[9px] sm:text-[10px] font-black px-3 py-1 rounded-full tracking-wide">
                  {v.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY US --- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16 animate-fade-up">
            <span className="text-orange-500 font-black tracking-widest text-xs sm:text-sm uppercase mb-3 block">Why Us</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">Your Privacy & Safety First</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: <Lock size={24} />, title: "100% Privacy", desc: "Your real phone number is always hidden through our secure masked calling engine." },
              { icon: <AlertTriangle size={24} />, title: "Multiple Options", desc: "Scan options include Wrong Parking, Accident, and generic emergency contacts." },
              { icon: <Smartphone size={24} />, title: "No App Needed", desc: "Scannable directly from any default iOS or Android smartphone camera." },
              { icon: <Zap size={24} />, title: "Instant Alerts", desc: "Receive immediate SMS and WhatsApp notifications the exact moment someone scans your tag." }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 sm:p-6 hover:-translate-y-1.5 transition-transform duration-300 shadow-xl group hover:border-orange-500/50">
                <div className="w-12 h-12 bg-white/5 text-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  {item.icon}
                </div>
                <h4 className="font-bold text-white mb-2 text-base sm:text-lg">{item.title}</h4>
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENTO GRID: FEATURES --- */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12 animate-fade-up">
            <span className="text-orange-500 font-black tracking-widest text-xs sm:text-sm uppercase mb-1 block">Innovation</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black">Smart features, simple setup.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Big Bento 1 */}
            <div className="md:col-span-2 bg-white border border-black/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-orange-500/50 transition-colors shadow-sm hover:shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors z-0"></div>
              
              <div className="relative z-10 flex-1">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-3 border border-orange-100">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-black mb-2">100% Two-Way Number Masking</h4>
                <p className="text-black/60 text-sm sm:text-base max-w-md leading-relaxed">
                  Total privacy for everyone. When a stranger scans and calls, <strong className="text-orange-500">their number is hidden from you</strong>, and <strong className="text-orange-500">your number is hidden from them</strong>. Complete anonymity guaranteed.
                </p>
              </div>

              <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center self-center">
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-lg flex items-center justify-center animate-play-glow">
                  <div className="w-full h-full bg-white rounded-2xl flex flex-col items-center justify-center p-2 text-center">
                    <ShieldCheck size={28} className="text-orange-500 mb-1" />
                    <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">100% SAFE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Bento 1 */}
            <div className="bg-white border border-black/10 rounded-3xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-colors shadow-sm hover:shadow-lg">
              <div className="absolute -bottom-6 -right-6 text-[80px] sm:text-[100px] font-black text-black/[0.03] group-hover:text-green-50 transition-colors leading-none pointer-events-none">01</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3 border border-green-100">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="text-lg sm:text-xl font-black text-black mb-1">Universal Scan</h4>
                <p className="text-black/60 text-xs sm:text-sm">Scannable by any default iOS or Android camera. No app downloads required.</p>
              </div>
            </div>

            {/* Small Bento 2 */}
            <div className="bg-white border border-black/10 rounded-3xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-colors shadow-sm hover:shadow-lg">
              <div className="absolute -bottom-6 -right-6 text-[80px] sm:text-[100px] font-black text-black/[0.03] group-hover:text-green-50 transition-colors leading-none pointer-events-none">02</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3 border border-green-100">
                  <BellRing className="w-5 h-5" />
                </div>
                <h4 className="text-lg sm:text-xl font-black text-black mb-1">Instant Alerts</h4>
                <p className="text-black/60 text-xs sm:text-sm">Get WhatsApp and SMS notifications the moment someone scans your tag.</p>
              </div>
            </div>

            {/* Big Bento 2 */}
            <div className="md:col-span-2 bg-white border border-black/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-orange-500/50 transition-colors shadow-sm hover:shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative z-10 flex-1">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-3 border border-orange-100">
                  <BellRing className="w-5 h-5" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-black mb-2">Unlimited Push Notifications</h4>
                <p className="text-black/60 text-sm sm:text-base leading-relaxed">Get instantly notified on your phone whenever someone scans your vehicle tag. Pay once and stay connected forever without any limits.</p>
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

      {/* --- FAQ --- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#fcfaf5]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          
          <div className="text-center md:text-left mb-6 md:mb-0 animate-fade-up">
            <h2 className="text-orange-500 font-black tracking-widest text-xs sm:text-sm uppercase mb-2 sm:mb-4">Support</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-4 sm:mb-6">Got Questions?</h3>
            <p className="text-sm sm:text-base md:text-lg text-black/60 mb-6 sm:mb-8">Everything you need to know about SafeDrive-Tag. If you can't find your answer, our support team is just a click away.</p>
            <div className="relative rounded-[2rem] overflow-hidden border border-gray-200/80 shadow-md hidden md:flex flex-col items-center justify-center bg-white p-8 min-h-[260px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-100/80 text-orange-600 flex items-center justify-center mb-4 shadow-inner">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-lg font-black text-gray-950 mb-1">24/7 Priority Support</h4>
              <p className="text-xs text-gray-500 font-medium max-w-xs">Have questions about order tracking, tag activation, or privacy? We are here to help!</p>
              <a href="mailto:safedrivetag@gmail.com" className="mt-4 text-xs font-bold text-orange-600 hover:text-orange-700 underline">
                safedrivetag@gmail.com
              </a>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map(({ q, a }, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 shadow-sm ${openFaq === i ? 'border-orange-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-black/5 hover:border-black/20'}`}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <div className="flex justify-between items-center px-5 sm:px-8 py-4 sm:py-6">
                  <h4 className={`font-bold text-base sm:text-lg ${openFaq === i ? 'text-orange-600' : 'text-black/90'}`}>{q}</h4>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 shrink-0 ml-3 ${openFaq === i ? 'rotate-180 text-orange-500' : 'text-black/40'}`} />
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <p className="px-5 sm:px-8 pb-5 sm:pb-6 text-black/60 text-xs sm:text-sm leading-relaxed">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-500"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight">Ready to drive smarter?</h2>
          <p className="text-orange-100 text-base sm:text-xl font-medium mb-8 sm:mb-10 max-w-xl mx-auto">Join 9.5 lakh+ vehicle owners who park with absolute peace of mind.</p>
          <Link to="/shop" className="inline-flex items-center gap-2.5 sm:gap-3 bg-white text-orange-600 px-7 sm:px-10 py-4 sm:py-5 rounded-full font-black text-base sm:text-xl hover:scale-105 transition-transform shadow-2xl">
            Get Your Tag Now <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </div>
      </section>
      
    </div>
  );
}

