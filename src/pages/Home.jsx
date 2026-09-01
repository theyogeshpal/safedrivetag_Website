import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, QrCode, Lock, BellRing, Phone, Car, Bike, Truck, ChevronDown, CheckCircle, Star, AlertTriangle, ArrowRight, Zap, Play, Briefcase, ShieldCheck, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { BsQuestion } from 'react-icons/bs';

const liveStats = [
  { 
    tag: "TRUSTED USERS", 
    value: "9.5L+ Across India", 
    desc: "Protecting vehicles and luggage with smart QR tags", 
    icon: <Shield size={18} className="text-emerald-500" />,
    badgeBg: "bg-gradient-to-r from-emerald-600 to-teal-600"
  },
  { 
    tag: "RATING", 
    value: "4.9 ★ User Rating", 
    desc: "From over 50,000+ verified customer reviews", 
    icon: <Star size={18} className="fill-amber-400 text-amber-400" />,
    badgeBg: "bg-gradient-to-r from-amber-500 to-orange-500"
  },
  { 
    tag: "TOTAL SCANS", 
    value: "5000+ All Time", 
    desc: "Masked calls & emergency contacts bridged successfully", 
    icon: <QrCode size={18} className="text-orange-500" />,
    badgeBg: "bg-gradient-to-r from-orange-600 to-amber-600"
  },
  { 
    tag: "TODAY'S SCANS", 
    value: "1,204 Live Scans", 
    desc: "Live real-time scan updates across cities today", 
    icon: <TrendingUp size={18} className="text-emerald-500" />,
    badgeBg: "bg-gradient-to-r from-emerald-600 to-teal-600"
  }
];

const faqs = [
  { q: "What is SafeDrive-Tag?", a: "SafeDrive-Tag is a smart QR tag for your vehicles and travel luggage that lets anyone contact you without revealing your private phone number." },
  { q: "How does the private calling work?", a: "Calls are routed through a secure masked bridge server — the caller never sees your real number." },
  { q: "Can I use SafeDrive-Tag on my luggage and travel bags?", a: "Yes! We offer heavy-duty metallic luggage tags with braided steel cables. If your flight bag, suitcase or backpack is misplaced or left behind in a cab or train, anyone can scan it to privately connect with you." },
  { q: "Do I need to download an app?", a: "No app needed. Anyone can scan the QR with their default phone camera." },
  { q: "How do I stick it on my car or attach to bags?", a: "Car & bike tags come with industrial peel-and-stick weather proof adhesive. Luggage tags come with stainless steel braided loop cables for suitcases and backpacks." },
];

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  // Auto-cycle live news ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % liveStats.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Auto-cycle How We Work animated steps
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => (prev % 3) + 1);
    }, 2800);
    return () => clearInterval(stepTimer);
  }, []);

  // Auto-redirect logged-in users or PWA standalone launch directly to Dashboard
  useEffect(() => {
    const isStandalonePWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const hasToken = localStorage.getItem('safedrive_auth_token') || localStorage.getItem('safedrive_current_user');
    // Only auto-redirect in PWA standalone mode, not in browser
    if (isStandalonePWA && hasToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="bg-white font-sans text-black/80 overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-900">
      
      {/* --- HERO SECTION --- */}
      <section className="relative flex items-center pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 overflow-hidden bg-white w-full">
        {/* Background Graphic with Smooth Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-end">
          {/* Subtle Ambient Radial Glow (Dual Orange & Emerald Green) */}
          <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[110px]"></div>
          
          {/* 1. SEPARATE HERO BACKGROUND IMAGE TAG */}
          <img 
            src="/hero-bg.png" 
            alt="Hero Background" 
            decoding="async"
            className="w-full max-w-[650px] lg:max-w-[850px] object-contain opacity-15 lg:opacity-20 translate-x-12 lg:translate-x-20 select-none pointer-events-none drop-shadow-2xl" 
          />

          {/* Light Grid Overlay (Checkboxes/Grid Pattern) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
      
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10 w-full min-w-0">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7 animate-fade-up w-full min-w-0">

            {/* Headline with Dual Orange & Green Highlights */}
            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black text-gray-950 leading-[1.14] tracking-tight">
              Stay reachable in emergencies,<br className="hidden sm:inline" />
              <span className="text-orange-500"> stay safe.</span>
              <span className="text-emerald-600"> Stay private.</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg font-medium">
              SafeDrive-Tag is the next-generation smart QR emergency contact tag for your vehicles and travel luggage. Protect your car, bike, and bags without ever exposing your private phone number.
            </p>

            {/* 1. Top 3-Value Props Bar with Orange & Green Harmony */}
            <div className="bg-white/95 border border-gray-200/80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-2 items-center w-full">
              {/* Item 1 */}
              <div className="flex items-center gap-3 px-1 sm:px-2">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 shrink-0 shadow-inner">
                  <span className="text-base font-bold">🚫</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 leading-tight">No spamming</h4>
                  <p className="text-[11px] text-gray-500 font-medium">100% spam-free</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-3 px-1 sm:px-2 sm:border-l sm:border-gray-100">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
                  <QrCode size={19} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 leading-tight">No app needed</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Instantly works</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-3 px-1 sm:px-2 sm:border-l sm:border-gray-100">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
                  <Lock size={18} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 leading-tight">No number shared</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Your privacy protected</p>
                </div>
              </div>
            </div>

            {/* 2. Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 w-full">
              {/* Buy Safety Tag Primary CTA */}
              <Link 
                to="/shop" 
                className="group flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 sm:p-3 pr-4 sm:pr-5 rounded-2xl sm:rounded-3xl shadow-[0_10px_25px_rgba(16,185,129,0.35)] transition-all duration-200 flex items-center justify-between gap-3 overflow-hidden active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-sm">
                      <ShieldCheck size={18} />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-black text-base sm:text-lg leading-tight tracking-tight text-white">Buy Safety Tag</div>
                    <div className="text-[11px] text-white/90 font-medium">Secure &bull; Smart &bull; Reliable</div>
                  </div>
                </div>

                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-emerald-700 flex items-center justify-center shrink-0 shadow-md group-hover:translate-x-1 transition-transform">
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
                className=" border p-2.5 sm:p-3 px-5 sm:px-6 rounded-2xl sm:rounded-3xl transition-all flex items-center justify-center sm:justify-start gap-3.5 cursor-pointer text-left shrink-0 active:scale-[0.98]"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-orange-400 text-white rounded-full flex items-center justify-center shrink-0">
                  <Play size={15} className=" ml-0.5" />
                </div>

                <div>
                  <div className="font-extrabold text-sm sm:text-base leading-tight ">Live Demo</div>
                  <div className="text-[11px] font-medium ">See how it works</div>
                </div>
              </button>
            </div>
            
            {/* 3. Live News Chyron / Ticker Bar */}
            <div className="bg-white/95 border border-gray-200/90 rounded-2xl sm:rounded-3xl shadow-sm flex items-stretch overflow-hidden relative backdrop-blur-sm min-h-[46px] sm:min-h-[56px] w-full">
              {/* Dynamic Category Chevron / Arrow Badge */}
              <div 
                key={`badge-${currentNewsIndex}`} 
                className={`${liveStats[currentNewsIndex].badgeBg} animate-slide-in-left text-white font-black text-[10px] sm:text-xs pl-3 sm:pl-5 pr-4 sm:pr-6.5 py-2.5 sm:py-3 flex items-center gap-1.5 sm:gap-2 shrink-0 shadow-md relative [clip-path:polygon(0_0,calc(100%-10px)_0,100%_50%,calc(100%-10px)_100%,0_100%)]`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="tracking-wider uppercase whitespace-nowrap font-black">
                  {liveStats[currentNewsIndex].tag}
                </span>
              </div>

              {/* News Headline & Description */}
              <div className="flex-1 min-w-0 overflow-hidden py-1.5 px-2 sm:px-3.5 flex items-center">
                <div 
                  key={`content-${currentNewsIndex}`} 
                  className="animate-slide-in-right flex flex-col sm:flex-row sm:items-center sm:gap-3 justify-between w-full min-w-0"
                >
                  <div className="flex items-center gap-2 min-w-0 w-full">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100/80 border border-gray-200/50 flex items-center justify-center shrink-0">
                      {liveStats[currentNewsIndex].icon}
                    </div>
                    <div className="min-w-0 flex-1 truncate">
                      <div className="font-black text-xs sm:text-base text-gray-950 truncate tracking-tight">
                        {liveStats[currentNewsIndex].value}
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">
                        {liveStats[currentNewsIndex].desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticker Indicator Dots / Navigation */}
              <div className="hidden sm:flex items-center gap-1.5 shrink-0 pr-4 self-center">
                {liveStats.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentNewsIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentNewsIndex === idx ? 'w-5 bg-gray-900' : 'w-1.5 bg-gray-200 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Clean White Stage Showcase Card */}
          <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center animate-fade-up w-full" style={{ animationDelay: '200ms' }}>
            
            <div className="relative w-full max-w-[480px] bg-white rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col gap-4">
              
              {/* Top Two-Way Privacy Card (Emerald Green) */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <BsQuestion size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 mb-0.5">Blocked a driveway or parked in a tight spot?</h4>
                  <p className="text-[11px] text-gray-600 leading-snug font-medium">
                     With SafeDrive-Tag's two-way masking, anyone can alert you about your vehicle instantly
                  </p>
                </div>
              </div>

              {/* Center Car Graphic with Interactive Tag Pointer */}
              <div className="relative bg-gray-50/70 rounded-2xl p-4 pt-6 flex flex-col items-center justify-center overflow-hidden border border-gray-100">
                {/* Floating QR Tag pointer badge */}
                <div className="absolute top-3 right-6 flex items-center gap-1.5 z-20">
                  <div className="w-12 h-14 bg-white border border-gray-200 rounded-xl p-1 shadow-md flex flex-col items-center justify-center text-center">
                    <QrCode size={24} className="text-gray-900 mb-0.5" />
                    <span className="text-[7px] font-black tracking-widest text-emerald-600">SCAN</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-dashed animate-spin flex items-center justify-center opacity-60" style={{ animationDuration: '8s' }} />
                </div>

                <img 
                  src="/hero-car.png" 
                  alt="SafeDrive-Tag on Car" 
                  decoding="async"
                  className="w-full max-w-[340px] object-contain drop-shadow-xl" 
                />

                {/* Dark Live QR Shield Pill with Emerald Green live dot */}
                <div className="w-full max-w-[360px] bg-[#0c1427] text-white rounded-2xl p-3 flex items-center gap-3.5 border border-white/10 shadow-xl mt-2">
                  <div className="w-10 h-10 bg-white rounded-xl p-1.5 shrink-0 flex items-center justify-center text-gray-950 shadow-xs">
                    <QrCode size={28} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE QR SHIELD
                    </div>
                    <div className="text-xs font-bold text-gray-100">Scan to Call Owner Privately</div>
                  </div>
                </div>
              </div>

              {/* Bottom Cloud Bridge Status Card */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-gray-900">instant Notifications</p>
                    <p className="text-[10px] text-gray-500 font-medium">Message & Alerts Forwarding</p>
                  </div>
                </div>
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                  ACTIVE
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* --- MARQUEE WITH DUAL ORANGE & GREEN ICONS --- */}
      <div className="w-full overflow-hidden">
        <div className="border-y border-neutral-800 bg-[#0c0f17] py-4 sm:py-5 overflow-hidden shadow-md relative z-20">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 sm:gap-12 px-4 sm:px-6">
                {[
                  { icon: <Lock className="text-emerald-400" />, text: "100% Privacy Preserved" },
                  { icon: <Smartphone className="text-orange-400" />, text: "Works Without Any App" },
                  { icon: <Shield className="text-emerald-400" />, text: "24/7 Reliable Service" },
                  { icon: <Zap className="text-orange-400" />, text: "Instant Call Routing" },
                  { icon: <CheckCircle className="text-emerald-400" />, text: "Weather proof Tags" },
                ].map((item, j) => (
                  <div key={j} className="flex items-center gap-2.5 sm:gap-3 text-gray-300 font-bold uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap">
                    <span>{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- WHAT IS SAFEDRIVETAG (SLATE NEUTRAL LIGHT SECTION) --- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#f8fafc] text-gray-900 relative overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-emerald-600 font-bold tracking-widest text-xs sm:text-sm uppercase mb-2 sm:mb-3 block">About</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight">What is SafeDrive-Tag?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-xl mx-auto lg:max-w-none w-full">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 sm:mb-10 font-medium">
                SafeDrive-Tag is a weather proof QR code tag for your vehicle that lets anyone contact you instantly without revealing your phone number. When someone scans the QR code with their phone camera, you receive a WhatsApp-SMS alert within seconds. Perfect for parking issues, emergencies, or when someone needs to reach you about your bike, auto, car, SUV, or truck.
              </p>
              
              {/* Stat Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { val: "9.5L+", lbl: "Vehicles Protected", color: "text-orange-500" },
                  { val: "5000+", lbl: "Scans Completed", color: "text-emerald-600" },
                  { val: "4.9★", lbl: "User Rating", color: "text-amber-500" },
                  { val: "100%", lbl: "Privacy Guaranteed", color: "text-emerald-600" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-gray-200/80 rounded-2xl p-3 sm:p-4 text-center shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all">
                    <div className={`text-xl sm:text-2xl font-black mb-1 ${stat.color}`}>{stat.val}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Content: The Visual Tag with Pointers */}
            <div className="relative flex justify-center items-center py-8 sm:py-12 lg:py-12 w-full max-w-xl mx-auto">
              
              {/* The Official SafeDrive-Tag Sticker Card */}
              <div className="relative w-full rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-200 bg-white group transition-transform duration-300 hover:scale-[1.02]">
                {/* Sticker Template Image */}
                <img 
                  src="/images/safedrive-tag-final.png" 
                  alt="SafeDrive-Tag Vehicle QR Sticker" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain block select-none" 
                />

                {/* Real Working QR Code Overlay inside the white section */}
                <div 
                  className="absolute flex items-center justify-center pointer-events-auto"
                  style={{
                    top: '7%',
                    left: '57%',
                    width: '38%',
                    height: '64%'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center p-1 sm:p-2.5">
                    <QRCodeSVG 
                      value="https://safedrivetag.in"
                      size={180}
                      level="H"
                      includeMargin={false}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Pointers (absolute positioned) - Hidden on mobile, visible on lg */}
              <div className="absolute -top-6 left-[6%] hidden lg:flex flex-col items-center animate-fade-up z-20">
                <div className="bg-gray-900 text-orange-400 text-[11px] sm:text-xs font-black px-3.5 py-1.5 rounded-full mb-1.5 border border-orange-500/60 shadow-lg tracking-wide whitespace-nowrap">
                  Unique QR per vehicle
                </div>
                <div className="w-0.5 h-6 bg-orange-400"></div>
                <div className="w-2.5 h-2.5 bg-orange-400 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
              </div>

              <div className="absolute -top-6 right-[6%] hidden lg:flex flex-col items-center animate-fade-up z-20" style={{ animationDelay: '100ms' }}>
                <div className="bg-gray-900 text-emerald-400 text-[11px] sm:text-xs font-black px-3.5 py-1.5 rounded-full mb-1.5 border border-emerald-400/60 shadow-lg tracking-wide whitespace-nowrap">
                  Scan with any camera
                </div>
                <div className="w-0.5 h-6 bg-emerald-400"></div>
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              </div>

              <div className="absolute -bottom-6 left-[8%] hidden lg:flex flex-col items-center animate-fade-up z-20" style={{ animationDelay: '200ms' }}>
                <div className="w-2.5 h-2.5 bg-orange-400 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                <div className="w-0.5 h-6 bg-orange-400 mt-0.5"></div>
                <div className="bg-gray-900 text-orange-300 text-[11px] sm:text-xs font-black px-3.5 py-1.5 rounded-full mt-1.5 border border-orange-400/60 shadow-lg tracking-wide whitespace-nowrap">
                  Wrong Parking & SOS Alert
                </div>
              </div>

              <div className="absolute -bottom-6 right-[8%] hidden lg:flex flex-col items-center animate-fade-up z-20" style={{ animationDelay: '300ms' }}>
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <div className="w-0.5 h-6 bg-emerald-400 mt-0.5"></div>
                <div className="bg-gray-900 text-emerald-300 text-[11px] sm:text-xs font-black px-3.5 py-1.5 rounded-full mt-1.5 border border-emerald-400/60 shadow-lg tracking-wide whitespace-nowrap">
                  Weather-proof sticker
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (PURE WHITE SECTION) --- */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 animate-fade-up">
            <span className="text-emerald-600 font-black tracking-widest text-xs sm:text-sm uppercase mb-3 block">Process</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950">How We Work</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3 max-w-2xl mx-auto font-medium">We give you a premium tag to stick on your vehicle. Whenever there is a casualty, accident, or parking issue, anyone can scan it to contact you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* The Connecting Line with Perfectly Centered Alignment */}
            <div className="hidden md:block absolute top-[40px] sm:top-[44px] lg:top-[48px] left-[17%] w-[66%] h-1 bg-gray-200 z-0 overflow-hidden rounded-full">
              <div className="h-full bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-500 transition-all duration-1000 ease-in-out rounded-full" style={{ width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%' }}></div>
            </div>
            
            {/* Step 1 */}
            <div 
              className="relative z-10 flex flex-col items-center text-center group cursor-pointer" 
              onClick={() => setActiveStep(1)}
              onMouseEnter={() => setActiveStep(1)}
            >
              <div className={`w-20 sm:w-24 h-20 sm:h-24 bg-white border-4 rounded-full flex items-center justify-center transition-all duration-500 mb-5 relative ${
                activeStep === 1 
                  ? 'border-orange-500 scale-110 shadow-[0_0_35px_rgba(249,115,22,0.5)] ring-8 ring-orange-500/20 z-20' 
                  : 'border-gray-100 shadow-md hover:border-orange-300'
              }`}>
                <Car className={`w-8 sm:w-10 h-8 sm:h-10 transition-colors duration-500 ${activeStep === 1 ? 'text-orange-500' : 'text-gray-700'}`} />
                <span className={`absolute -top-1.5 -right-1.5 w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-white transition-colors duration-500 shadow-sm ${activeStep === 1 ? 'bg-orange-500 text-white' : 'bg-gray-900 text-white'}`}>1</span>
              </div>
              <div className={`bg-gray-50/60 p-5 sm:p-6 rounded-2xl border transition-all duration-500 w-full ${activeStep === 1 ? 'bg-white shadow-xl shadow-orange-500/15 border-orange-300 -translate-y-1.5' : 'border-gray-200/80 shadow-sm'}`}>
                <h4 className="font-black text-gray-950 mb-2 text-base sm:text-lg">Stick the Tag</h4>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Place the premium QR sticker on your car or bike's windshield.</p>
              </div>
            </div>

            {/* Step 2 (Emerald Green Highlight) */}
            <div 
              className="relative z-10 flex flex-col items-center text-center group cursor-pointer" 
              onClick={() => setActiveStep(2)}
              onMouseEnter={() => setActiveStep(2)}
            >
              <div className={`w-20 sm:w-24 h-20 sm:h-24 bg-white border-4 rounded-full flex items-center justify-center transition-all duration-500 mb-5 relative ${
                activeStep === 2 
                  ? 'border-emerald-500 scale-110 shadow-[0_0_35px_rgba(16,185,129,0.5)] ring-8 ring-emerald-500/20 z-20' 
                  : 'border-gray-100 shadow-md hover:border-emerald-300'
              }`}>
                <QrCode className={`w-8 sm:w-10 h-8 sm:h-10 transition-colors duration-500 ${activeStep === 2 ? 'text-emerald-600' : 'text-gray-700'}`} />
                <span className={`absolute -top-1.5 -right-1.5 w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-white transition-colors duration-500 shadow-sm ${activeStep === 2 ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-white'}`}>2</span>
              </div>
              <div className={`bg-gray-50/60 p-5 sm:p-6 rounded-2xl border transition-all duration-500 w-full ${activeStep === 2 ? 'bg-white shadow-xl shadow-emerald-500/15 border-emerald-300 -translate-y-1.5' : 'border-gray-200/80 shadow-sm'}`}>
                <h4 className="font-black text-gray-950 mb-2 text-base sm:text-lg">Someone Scans It</h4>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">In case of accident or wrong parking, any random person can scan it.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div 
              className="relative z-10 flex flex-col items-center text-center group cursor-pointer" 
              onClick={() => setActiveStep(3)}
              onMouseEnter={() => setActiveStep(3)}
            >
              <div className={`w-20 sm:w-24 h-20 sm:h-24 bg-white border-4 rounded-full flex items-center justify-center transition-all duration-500 mb-5 relative ${
                activeStep === 3 
                  ? 'border-orange-500 scale-110 shadow-[0_0_35px_rgba(249,115,22,0.5)] ring-8 ring-orange-500/20 z-20' 
                  : 'border-gray-100 shadow-md hover:border-orange-300'
              }`}>
                <Phone className={`w-8 sm:w-10 h-8 sm:h-10 transition-colors duration-500 ${activeStep === 3 ? 'text-orange-500' : 'text-gray-700'}`} />
                <span className={`absolute -top-1.5 -right-1.5 w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-white transition-colors duration-500 shadow-sm ${activeStep === 3 ? 'bg-orange-500 text-white' : 'bg-gray-900 text-white'}`}>3</span>
              </div>
              <div className={`bg-gray-50/60 p-5 sm:p-6 rounded-2xl border transition-all duration-500 w-full ${activeStep === 3 ? 'bg-white shadow-xl shadow-orange-500/15 border-orange-300 -translate-y-1.5' : 'border-gray-200/80 shadow-sm'}`}>
                <h4 className="font-black text-gray-950 mb-2 text-base sm:text-lg">Contact Privately</h4>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">They choose an option (e.g., Wrong Parking) and contact you via WhatsApp or Masked Call.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* --- THEMATIC DARK ZONE: CATEGORIES & SMART BENTO FEATURES --- */}
      {/* ======================================================== */}

      {/* --- PART A: FOR EVERY VEHICLE & TRAVEL BAG (DARK SECTION) --- */}
      <section className="pt-16 md:pt-24 pb-10 md:pb-14 px-4 sm:px-6 bg-[#080c14] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16 animate-fade-up">
            <span className="text-emerald-400 font-bold tracking-widest text-xs sm:text-sm uppercase mb-2 sm:mb-3 block">One QR for all your needs</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Cars. Bikes. Luggage. Backpacks.</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-medium">
              SafeDrive-Tag protects your daily commute vehicles and your travel luggage — with instant emergency and lost bag recovery QR alerts.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {[
              { icon: <Car size={34} className="text-blue-400 mb-2" />, title: "Cars & Sedans", desc: "Front & rear windshield tags.", color: "bg-orange-500" },
              { icon: <Bike size={34} className="text-orange-400 mb-2" />, title: "2-Wheelers", desc: "Bikes & scooters weather proof tag.", color: "bg-emerald-600" },
              { icon: <Briefcase size={34} className="text-emerald-400 mb-2" />, title: "Flight Luggage", desc: "Metallic tag with steel cable.", color: "bg-emerald-600" },
              { icon: <Car size={34} className="text-purple-400 mb-2" />, title: "SUVs & MUVs", desc: "Heavy-duty reflective badges.", color: "bg-orange-500" },
              { icon: <Car size={34} className="text-emerald-400 mb-2" />, title: "Autos & 3W", desc: "Commercial & taxi emergency tag.", color: "bg-emerald-600" },
              { icon: <Truck size={34} className="text-amber-400 mb-2" />, title: "Trucks & Fleets", desc: "Commercial logistics & fleet tags.", color: "bg-orange-500" }
            ].map((v, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:bg-white/[0.08] hover:shadow-[0_10px_25px_rgba(16,185,129,0.15)] shadow-lg group">
                <div>
                  <div className="text-2xl sm:text-3xl mb-2.5 flex justify-center group-hover:scale-110 transition-transform">{v.icon}</div>
                  <h3 className="font-black text-white text-xs sm:text-sm md:text-base mb-1">{v.title}</h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium mb-3 sm:mb-4 leading-relaxed">{v.desc}</p>
                </div>
                <Link to="/shop" className={`${v.color} text-white text-[10px] sm:text-[11px] font-black px-4 py-1.5 rounded-full tracking-wide shadow-xs hover:opacity-90 transition-opacity cursor-pointer inline-block`}>
                  Buy Tag
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PART B: BENTO GRID: SMART FEATURES (DARK CONTINUATION) --- */}
      <section className="pt-6 pb-16 sm:pb-24 px-4 sm:px-6 relative bg-[#080c14] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 md:mb-14 animate-fade-up">
            <span className="text-emerald-400 font-black tracking-widest text-xs sm:text-sm uppercase mb-1 block">Innovation</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">Smart features, simple setup.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Big Bento 1 (Emerald Green Security Theme) */}
            <div className="md:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors z-0"></div>
              
              <div className="relative z-10 flex-1">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-3 border border-emerald-500/30">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white mb-2">100% Two-Way Number Masking</h4>
                <p className="text-gray-300 text-sm sm:text-base max-w-md leading-relaxed font-medium">
                  Total privacy for everyone. When a stranger scans and calls, <strong className="text-emerald-400">their number is hidden from you</strong>, and <strong className="text-emerald-400">your number is hidden from them</strong>. Complete anonymity guaranteed.
                </p>
              </div>

              <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center self-center">
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-lg flex items-center justify-center animate-play-glow">
                  <div className="w-full h-full bg-[#0d1424] rounded-2xl flex flex-col items-center justify-center p-2 text-center border border-white/10">
                    <ShieldCheck size={28} className="text-emerald-400 mb-1" />
                    <span className="text-[9px] font-black text-gray-200 uppercase tracking-widest">100% SAFE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Bento 1 */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-orange-500/50 transition-all shadow-xl">
              <div className="absolute -bottom-6 -right-6 text-[80px] sm:text-[100px] font-black text-white/[0.04] group-hover:text-orange-500/10 transition-colors leading-none pointer-events-none">01</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-3 border border-orange-500/30">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="text-lg sm:text-xl font-black text-white mb-1">Universal Scan</h4>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Scannable by any default iOS or Android camera. No app downloads required.</p>
              </div>
            </div>

            {/* Small Bento 2 */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-xl">
              <div className="absolute -bottom-6 -right-6 text-[80px] sm:text-[100px] font-black text-white/[0.04] group-hover:text-emerald-500/10 transition-colors leading-none pointer-events-none">02</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-3 border border-emerald-500/30">
                  <BellRing className="w-5 h-5" />
                </div>
                <h4 className="text-lg sm:text-xl font-black text-white mb-1">Instant Alerts</h4>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Get WhatsApp and SMS notifications the moment someone scans your tag.</p>
              </div>
            </div>

            {/* Big Bento 2 */}
            <div className="md:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-orange-500/50 transition-all shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative z-10 flex-1">
                <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-3 border border-orange-500/30">
                  <BellRing className="w-5 h-5" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white mb-2">Unlimited Push Notifications</h4>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-medium">Get instantly notified on your phone whenever someone scans your vehicle tag. Pay once and stay connected forever without any limits.</p>
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 relative self-center">
                <div className="absolute inset-0 border-[4px] border-white/10 rounded-full border-t-orange-500 animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-2 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/15">
                  <span className="text-lg sm:text-xl font-black text-white">∞</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* --- THEMATIC LIGHT ZONE: TRUST, PRIVACY & FAQ SUPPORT --- */}
      {/* ======================================================== */}

      {/* --- PART A: WHY US (CLEAN LIGHT SECTION) --- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#f8fafc] relative overflow-hidden border-t border-gray-100">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16 animate-fade-up">
            <span className="text-emerald-600 font-black tracking-widest text-xs sm:text-sm uppercase mb-3 block">Why Us</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950">Your Privacy & Safety First</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: <Lock size={24} className="text-emerald-600" />, iconBg: "bg-emerald-50 border-emerald-100 text-emerald-600", hoverBorder: "hover:border-emerald-400/80", title: "100% Privacy", desc: "Your real phone number is always hidden through our secure masked calling engine." },
              { icon: <AlertTriangle size={24} className="text-orange-600" />, iconBg: "bg-orange-50 border-orange-100 text-orange-600", hoverBorder: "hover:border-orange-400/80", title: "Multiple Options", desc: "Scan options include Wrong Parking, Accident, and generic emergency contacts." },
              { icon: <Smartphone size={24} className="text-emerald-600" />, iconBg: "bg-emerald-50 border-emerald-100 text-emerald-600", hoverBorder: "hover:border-emerald-400/80", title: "No App Needed", desc: "Scannable directly from any default iOS or Android smartphone camera." },
              { icon: <Zap size={24} className="text-orange-600" />, iconBg: "bg-orange-50 border-orange-100 text-orange-600", hoverBorder: "hover:border-orange-400/80", title: "Instant Alerts", desc: "Receive immediate SMS and WhatsApp notifications the exact moment someone scans your tag." }
            ].map((item, i) => (
              <div key={i} className={`bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl ${item.hoverBorder} group`}>
                <div className={`w-12 h-12 ${item.iconBg} border rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-950 mb-2 text-base sm:text-lg">{item.title}</h4>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PART B: FAQ (PURE WHITE SECTION) --- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          
          <div className="text-center md:text-left mb-6 md:mb-0 animate-fade-up">
            <h2 className="text-emerald-600 font-black tracking-widest text-xs sm:text-sm uppercase mb-2 sm:mb-4">Support</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 mb-4 sm:mb-6">Got Questions?</h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 font-medium">Everything you need to know about SafeDrive-Tag. If you can't find your answer, our support team is just a click away.</p>
            <div className="relative rounded-[2rem] overflow-hidden border border-gray-200/90 shadow-md hidden md:flex flex-col items-center justify-center bg-white p-8 min-h-[260px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-inner border border-emerald-100">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-lg font-black text-gray-950 mb-1">24/7 Priority Support</h4>
              <p className="text-xs text-gray-500 font-medium max-w-xs">Have questions about order tracking, tag activation, or privacy? We are here to help!</p>
              <a href="mailto:safedrivetag@gmail.com" className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline">
                safedrivetag@gmail.com
              </a>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map(({ q, a }, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 shadow-sm ${openFaq === i ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.12)] bg-orange-50/20' : 'border-gray-200/80 hover:border-gray-300'}`}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <div className="flex justify-between items-center px-5 sm:px-8 py-4 sm:py-6">
                  <h4 className={`font-bold text-base sm:text-lg ${openFaq === i ? 'text-orange-600' : 'text-gray-900'}`}>{q}</h4>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 shrink-0 ml-3 ${openFaq === i ? 'rotate-180 text-orange-500' : 'text-gray-400'}`} />
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <p className="px-5 sm:px-8 pb-5 sm:pb-6 text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-emerald-600">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight">Ready to drive smarter?</h2>
          <p className="text-orange-100 text-base sm:text-xl font-medium mb-8 sm:mb-10 max-w-xl mx-auto">Join 9.5 lakh+ vehicle owners who park with absolute peace of mind.</p>
          <Link to="/shop" className="inline-flex items-center gap-2.5 sm:gap-3 bg-white text-gray-950 px-7 sm:px-10 py-4 sm:py-5 rounded-full font-black text-base sm:text-xl hover:scale-105 transition-transform shadow-2xl">
            <span className="text-orange-600 font-black">Get Your Tag Now</span> <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
          </Link>
        </div>
      </section>
      
    </div>
  );
}

