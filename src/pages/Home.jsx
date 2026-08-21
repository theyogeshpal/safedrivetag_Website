import React, { useState } from 'react';
import { Shield, Smartphone, QrCode, Lock, BellRing, Phone, Car, Bike, Truck, ChevronDown, CheckCircle, Star, AlertTriangle, ArrowRight, Zap, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { q: "What is SafeDriveTag?", a: "SafeDriveTag is a smart QR sticker for your vehicle that lets anyone contact you without revealing your phone number." },
    { q: "How does the private calling work?", a: "Calls are routed through a secure masked bridge server — the caller never sees your real number." },
    { q: "Do I need to download an app?", a: "No app needed. Anyone can scan the QR with their default phone camera." },
    
    { q: "How do I stick it on my car?", a: "Peel and stick on the inside of your windshield. Takes under 2 minutes." },
  ];

  return (
    <div className="bg-white font-sans text-black/80 overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-900">
      
      {/* --- HERO SECTION --- */}
      <section className="relative flex items-center lg:items-start pt-24 lg:pt-28 pb-12 px-6 overflow-hidden bg-black">
        
        {/* Car Background Video */}
        <div className="absolute inset-0 z-0 flex justify-end">
          <div className="w-full lg:w-[60%] h-full relative flex items-center justify-center p-6 lg:p-0">
            <video 
              src="/hero-video.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-[80%] object-contain object-right lg:object-center opacity-100 rounded-2xl lg:rounded-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent"></div>
          </div>
        </div>

        {/* Abstract Glowing Orbs (Light Mode Adjusted) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_0.8fr] gap-10 items-center relative z-10 w-full">
          <div className="space-y-6 animate-fade-up">
            
            
            <h1 className="text-[2.5rem] font-black text-black leading-[1.1] tracking-tighter">
              Stay reachable in emergencies, stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">private.</span>
            </h1>

            <p className="text-lg text-black/60 leading-relaxed max-w-lg font-medium">
              SafeDriveTag — Smart QR emergency contacts for vehicles. Protect your car, preserve your privacy. 🚗 Shielding vehicles in wrong parking & emergency situations.
            </p>

            <div className="flex flex-wrap items-center gap-3 py-2">
              <span className="flex items-center gap-2 bg-[#fdf8d5] border border-[#f4e28e] text-[#6d5516] px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                <span className="text-base leading-none">🚫</span> No spamming
              </span>
              <span className="flex items-center gap-2 bg-[#fdf8d5] border border-[#f4e28e] text-[#6d5516] px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                <span className="text-base leading-none">📲</span> No app needed
              </span>
              <span className="flex items-center gap-2 bg-[#fdf8d5] border border-[#f4e28e] text-[#6d5516] px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                <span className="text-base leading-none">🔒</span> No number shared
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/shop" className="group relative inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-black text-base overflow-hidden transition-all hover:scale-105 hover:shadow-[0_10px_30px_rgba(34,197,94,0.3)]">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-400 to-green-600"></span>
                <span className="relative flex items-center gap-2">
                  Buy Safety Tag <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <button className="group inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-black/10 px-8 py-3.5 rounded-full font-black text-base transition-all hover:bg-black/5 hover:border-black/20 hover:scale-105">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Play className="w-4 h-4 text-orange-600 ml-0.5" fill="currentColor" />
                </div>
                Watch Video
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-black/10 mt-4">
              <div className="bg-orange-50/80 border border-orange-200/60 px-4 py-2 rounded-xl flex flex-col justify-center cursor-default hover:bg-orange-100 transition-colors">
                <span className="text-orange-600 text-[9px] font-bold uppercase tracking-wider mb-0.5">Trusted Customers</span>
                <span className="text-orange-700 font-black text-lg leading-none">9.5L+</span>
              </div>
              
              <div className="bg-yellow-50/80 border border-yellow-200/60 px-4 py-2 rounded-xl flex flex-col justify-center cursor-default hover:bg-yellow-100 transition-colors">
                <span className="text-yellow-600 text-[9px] font-bold uppercase tracking-wider mb-0.5">Rating</span>
                <span className="text-yellow-700 font-black text-lg leading-none flex items-center gap-1">
                  4.8 <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                </span>
              </div>

              <div className="bg-blue-50/80 border border-blue-200/60 px-4 py-2 rounded-xl flex flex-col justify-center cursor-default hover:bg-blue-100 transition-colors">
                <span className="text-blue-600 text-[9px] font-bold uppercase tracking-wider mb-0.5">Total QR Scans</span>
                <span className="text-blue-700 font-black text-lg leading-none">2,450,892</span>
              </div>
              
              <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-xl flex flex-col justify-center shadow-sm cursor-default hover:shadow-md transition-all">
                <span className="text-green-600 text-[9px] font-bold uppercase tracking-wider mb-0.5">Today's Scans</span>
                <span className="text-green-700 font-black text-lg leading-none flex items-center gap-2">
                  1,204 
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Floating Premium Card */}
          <div className="relative hidden lg:flex justify-center items-center animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-green-500/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            
            <div className="relative w-72 bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transform hover:-translate-y-2 transition-transform duration-500">
              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-lg text-black tracking-tight">SafeDrive<span className="text-orange-500">TAG</span></span>
                <QrCode className="w-6 h-6 text-black/40" />
              </div>
              
              {/* Card Background image added back as requested earlier */}
              <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-5 text-center mb-6 shadow-inner overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503371476106-049f3e3e232f?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay group-hover:scale-110 transition-transform duration-700"></div>
                <p className="relative z-10 font-black text-white/90 text-xs mb-3 uppercase tracking-widest drop-shadow-md">Scan to contact</p>
                <div className="relative z-10 bg-white rounded-xl p-2.5 inline-block shadow-xl transform group-hover:scale-105 transition-transform duration-500 border border-white/50">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://safedrivetag.com" alt="QR" className="w-24 h-24 rounded-lg" />
                </div>
              </div>
              
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-[11px] font-bold text-black/80 bg-white rounded-lg px-3 py-2.5 border border-black/5">
                  <Lock className="w-3.5 h-3.5 text-green-500" /> 256-bit Encrypted
                </div>
                <div className="flex items-center gap-2.5 text-[11px] font-bold text-black/80 bg-white rounded-lg px-3 py-2.5 border border-black/5">
                  <BellRing className="w-3.5 h-3.5 text-orange-500" /> Instant Alerts
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <div className="border-y border-black/10 bg-white py-5 overflow-hidden shadow-sm relative z-20">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              {[
                { icon: <Lock />, text: "100% Privacy Preserved" },
                { icon: <Smartphone />, text: "Works Without Any App" },
                { icon: <Shield />, text: "24/7 Reliable Service" },
                { icon: <Zap />, text: "Instant Call Routing" },
                { icon: <CheckCircle />, text: "Weatherproof Tags" },
              ].map((item, j) => (
                <div key={j} className="flex items-center gap-3 text-black/60 font-bold uppercase tracking-wider text-sm whitespace-nowrap">
                  <span className="text-orange-500">{item.icon}</span> {item.text}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* --- WHAT IS SAFEDRIVETAG --- */}
      <section className="py-24 px-6 bg-[#fcfaf5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold tracking-widest text-sm uppercase mb-3 block">About</span>
            <h2 className="text-4xl md:text-5xl font-black text-black">What is SafeDriveTag?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <p className="text-lg text-black/70 leading-relaxed mb-10 font-medium">
                SafeDriveTag is a weatherproof QR code tag for your vehicle that lets anyone contact you instantly without revealing your phone number. When someone scans the QR code with their phone camera, you receive a WhatsApp-SMS alert within seconds. Perfect for parking issues, emergencies, or when someone needs to reach you about your bike, auto, car, SUV, or truck.
              </p>
              
              {/* Stat Boxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { val: "1200+", lbl: "Vehicles Protected" },
                  { val: "5000+", lbl: "Scans Completed" },
                  { val: "4.9★", lbl: "User Rating" },
                  { val: "100%", lbl: "Privacy Guaranteed" }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#fdf8d5] border border-[#f4e28e] rounded-xl p-4 text-center shadow-sm">
                    <div className="text-2xl font-black text-black mb-1">{stat.val}</div>
                    <div className="text-xs font-bold text-[#6d5516] leading-tight">{stat.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Content: The Visual Tag with Pointers */}
            <div className="relative flex justify-center items-center py-10 lg:py-0">
              
              {/* The Tag Itself */}
              <div className="relative bg-[#fcd34d] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col border-4 border-[#fcd34d]">
                {/* Yellow/Black striped border top */}
                <div className="w-full h-3 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fcd34d_10px,#fcd34d_20px)]"></div>
                
                {/* Tag Content */}
                <div className="flex-1 p-6 flex items-center gap-4 bg-white rounded-xl mx-1 my-1">
                  <div className="flex-1">
                    <div className="font-black text-2xl mb-1 flex items-center">SafeDrive<span className="bg-black text-white px-1.5 ml-1 rounded text-lg py-0.5">Tag</span></div>
                    <div className="text-[9px] text-gray-500 mb-4 font-bold tracking-wide">Vehicle alert sticker • safedrivetag.com</div>
                    <h3 className="font-black text-xl leading-tight mb-4">Scan to contact<br/><span className="border-b-4 border-[#fcd34d] pb-1">the owner.</span></h3>
                    
                    <div className="space-y-2 text-xs font-bold text-black/80">
                      <div className="flex items-center gap-2"><span className="bg-black text-white w-5 h-5 rounded flex items-center justify-center text-[10px]">P</span> Wrong Parking</div>
                      <div className="flex items-center gap-2"><span className="bg-black text-white w-5 h-5 rounded flex items-center justify-center text-[12px]">!</span> Vehicle Issue</div>
                      <div className="flex items-center gap-2"><span className="bg-red-500 text-white px-1.5 h-5 rounded flex items-center justify-center text-[9px] tracking-widest">SOS</span> Emergency</div>
                    </div>
                    <div className="text-[8px] text-gray-400 mt-6 font-bold uppercase tracking-wider">Use phone camera or any QR scanner app to scan</div>
                  </div>
                  <div className="w-32 flex flex-col items-center bg-[#fcd34d] p-3 rounded-2xl">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://safedrivetag.com" alt="QR Code" className="w-full aspect-square bg-white rounded-xl p-2" />
                    <div className="mt-2 text-[10px] font-black tracking-widest text-black">▲ SCAN ME ▲</div>
                  </div>
                </div>

                {/* Yellow/Black striped border bottom */}
                <div className="w-full h-3 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fcd34d_10px,#fcd34d_20px)]"></div>
              </div>

              {/* Pointers (absolute positioned) - Hidden on mobile, visible on lg */}
              <div className="absolute -top-2 left-[15%] hidden lg:flex flex-col items-center animate-fade-up">
                <div className="bg-black text-[#fcd34d] text-[10px] font-bold px-3 py-1.5 rounded-full mb-1 border border-black/20">Unique QR per vehicle</div>
                <div className="w-0.5 h-8 bg-[#fcd34d]"></div>
                <div className="w-2 h-2 bg-[#fcd34d] rounded-full"></div>
              </div>

              <div className="absolute -top-2 right-[15%] hidden lg:flex flex-col items-center animate-fade-up" style={{ animationDelay: '100ms' }}>
                <div className="bg-black text-[#fcd34d] text-[10px] font-bold px-3 py-1.5 rounded-full mb-1 border border-black/20">Scan without app</div>
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
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <span className="text-orange-500 font-black tracking-widest text-sm uppercase mb-4 block">Process</span>
            <h2 className="font-black text-black">How We Work</h2>
            <p className="text-black/60 mt-4 max-w-2xl mx-auto">We give you a premium tag to stick on your vehicle. Whenever there is a casualty, accident, or parking issue, anyone can scan it to contact you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* The Connecting Line with Left-to-Right Fill Animation */}
            <div className="hidden md:block absolute top-[48px] left-[16%] w-[68%] h-1 bg-black/5 z-0 overflow-hidden rounded-full">
              <div className="h-full bg-gradient-to-r from-orange-300 to-orange-500 w-full animate-progress rounded-full"></div>
            </div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-4 border-white rounded-full flex items-center justify-center shadow-xl group-hover:border-orange-500 group-hover:scale-110 transition-all duration-500 mb-6 relative">
                <Car className="w-10 h-10 text-black/80 group-hover:text-orange-500 transition-colors" />
                <span className="absolute -top-2 -right-2 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white">1</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-black/5 group-hover:shadow-lg transition-all w-full">
                <h4 className="font-black text-black mb-3">Stick the Tag</h4>
                <p className="text-black/60">Place the premium QR sticker on your car or bike's windshield.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-4 border-white rounded-full flex items-center justify-center shadow-xl group-hover:border-orange-500 group-hover:scale-110 transition-all duration-500 mb-6 relative">
                <QrCode className="w-10 h-10 text-black/80 group-hover:text-orange-500 transition-colors" />
                <span className="absolute -top-2 -right-2 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white">2</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-black/5 group-hover:shadow-lg transition-all w-full">
                <h4 className="font-black text-black mb-3">Someone Scans It</h4>
                <p className="text-black/60">In case of accident or wrong parking, any random person can scan it.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-4 border-white rounded-full flex items-center justify-center shadow-xl group-hover:border-orange-500 group-hover:scale-110 transition-all duration-500 mb-6 relative">
                <Phone className="w-10 h-10 text-black/80 group-hover:text-orange-500 transition-colors" />
                <span className="absolute -top-2 -right-2 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white">3</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-black/5 group-hover:shadow-lg transition-all w-full">
                <h4 className="font-black text-black mb-3">Direct Contact</h4>
                <p className="text-black/60">They choose an option (e.g., Wrong Parking) and contact you via WhatsApp or Masked Call.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOR EVERY VEHICLE --- */}
      <section className="py-24 px-6 bg-[#fcfaf5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <span className="text-[#c29623] font-bold tracking-widest text-sm uppercase mb-3 block">For Every Vehicle</span>
            <h2 className="text-4xl md:text-5xl font-black text-black mb-6">Bikes. Autos. Cars. SUVs. Trucks.</h2>
            <p className="text-lg text-black/60 max-w-2xl mx-auto font-medium">
              With Digital E-Tag, SafeDriveTag now supports every vehicle type in India — from your daily commute bike to a fleet of trucks.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: <Bike size={40} className="text-orange-500 mb-2" />, title: "2-Wheelers", desc: "Bikes & scooters. Digital E-Tag only.", price: "E-Tag ₹299", highlight: false },
              { icon: <Car size={40} className="text-green-600 mb-2" />, title: "3-Wheelers", desc: "Autos & e-rickshaws. Digital E-Tag only.", price: "E-Tag ₹299", highlight: false },
              { icon: <Car size={40} className="text-blue-500 mb-2" />, title: "Cars & Hatchbacks", desc: "Physical tag or Digital E-Tag.", price: "From ₹299", highlight: true },
              { icon: <Car size={40} className="text-purple-600 mb-2" />, title: "SUVs & MUVs", desc: "Physical tag or Digital E-Tag.", price: "From ₹299", highlight: false },
              { icon: <Truck size={40} className="text-yellow-600 mb-2" />, title: "Trucks & Commercial", desc: "Physical tag or Digital E-Tag.", price: "From ₹299", highlight: false }
            ].map((v, i) => (
              <div key={i} className={`bg-[#fdf8d5] rounded-2xl p-6 text-center flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1 ${v.highlight ? 'border-2 border-[#fcd34d] shadow-[0_10px_30px_rgba(252,211,77,0.3)] scale-105 z-10' : 'border border-[#f4e28e] shadow-sm'}`}>
                <div>
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-black text-black text-base md:text-lg mb-2">{v.title}</h3>
                  <p className="text-[11px] md:text-xs text-black/60 font-medium mb-6 leading-relaxed">{v.desc}</p>
                </div>
                <div className="bg-black text-[#fcd34d] text-[10px] font-black px-4 py-1.5 rounded-full tracking-wide">
                  {v.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY US --- */}
      <section className="py-24 px-6 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-up">
            <span className="text-orange-500 font-black tracking-widest text-sm uppercase mb-4 block">Why Us</span>
            <h2 className="font-black text-white">Your Privacy & Safety First</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Lock />, title: "100% Privacy", desc: "Your real phone number is always hidden through our secure masked calling engine." },
              { icon: <AlertTriangle />, title: "Multiple Options", desc: "Scan options include Wrong Parking, Accident, and generic emergency contacts." },
              { icon: <Smartphone />, title: "No App Needed", desc: "Scannable directly from any default iOS or Android smartphone camera." },
              { icon: <Zap />, title: "Instant Alerts", desc: "Receive immediate SMS and WhatsApp notifications the exact moment someone scans your tag." }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300 shadow-xl group hover:border-orange-500/50">
                <div className="w-14 h-14 bg-white/5 text-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  {item.icon}
                </div>
                <h4 className="font-bold text-white mb-3">{item.title}</h4>
                <p className="text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENTO GRID: FEATURES --- */}
      <section className="py-8 px-6 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 animate-fade-up">
            <span className="text-orange-500 font-black tracking-widest text-[10px] uppercase mb-1 block">Innovation</span>
            <h2 className="text-3xl md:text-4xl font-black text-black">Smart features, simple setup.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
            {/* Big Bento 1 */}
            <div className="md:col-span-2 bg-white border border-black/10 rounded-3xl p-6 relative overflow-hidden group hover:border-orange-500/50 transition-colors shadow-sm hover:shadow-lg flex flex-col md:flex-row items-center gap-6">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors z-0"></div>
              
              <div className="relative z-10 flex-1">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-3 border border-orange-100">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-black text-black mb-1">Masked Calling Engine</h4>
                <p className="text-black/60 text-sm max-w-md leading-relaxed">Our secure bridge routes calls to your phone without ever exposing your real number to the scanner.</p>
              </div>

              <div className="relative z-10 w-28 h-28 shrink-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <DotLottieReact
                  src="https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie"
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Small Bento 1 */}
            <div className="bg-white border border-black/10 rounded-3xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-colors shadow-sm hover:shadow-lg">
              <div className="absolute -bottom-6 -right-6 text-[100px] font-black text-white group-hover:text-green-50 transition-colors leading-none">01</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3 border border-green-100">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="text-base font-black text-black mb-1">Universal Scan</h4>
                <p className="text-black/60 text-xs">Scannable by any default iOS or Android camera. No app downloads required.</p>
              </div>
            </div>

            {/* Small Bento 2 */}
            <div className="bg-white border border-black/10 rounded-3xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-colors shadow-sm hover:shadow-lg">
              <div className="absolute -bottom-6 -right-6 text-[100px] font-black text-white group-hover:text-green-50 transition-colors leading-none">02</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3 border border-green-100">
                  <BellRing className="w-5 h-5" />
                </div>
                <h4 className="text-base font-black text-black mb-1">Instant Alerts</h4>
                <p className="text-black/60 text-xs">Get WhatsApp and SMS notifications the moment someone scans your tag.</p>
              </div>
            </div>

            {/* Big Bento 2 */}
            <div className="md:col-span-2 bg-white border border-black/10 rounded-3xl p-6 relative overflow-hidden group hover:border-orange-500/50 transition-colors shadow-sm hover:shadow-lg flex flex-col md:flex-row items-center gap-6">
              <div className="relative z-10 flex-1">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-3 border border-orange-100">
                  <BellRing className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-black text-black mb-1">Unlimited Push Notifications</h4>
                <p className="text-black/60 text-sm leading-relaxed">Get instantly notified on your phone whenever someone scans your vehicle tag. Pay once and stay connected forever without any limits.</p>
              </div>
              <div className="w-24 h-24 shrink-0 relative">
                <div className="absolute inset-0 border-[4px] border-orange-100 rounded-full border-t-orange-500 animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xl font-black text-black/40">∞</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          <div className="text-center md:text-left mb-10 md:mb-0 animate-fade-up">
            <h2 className="text-orange-500 font-black tracking-widest text-sm uppercase mb-4">Support</h2>
            <h3 className="text-4xl md:text-5xl font-black text-black mb-8">Got Questions?</h3>
            <p className="text-lg text-black/60 mb-10">Everything you need to know about SafeDriveTag. If you can't find your answer, our support team is just a click away.</p>
            <div className="relative rounded-[2rem] overflow-hidden border border-black/10 shadow-xl hidden md:flex items-center justify-center bg-white p-12 min-h-[300px]">
              <DotLottieReact
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f914/lottie.json"
                loop
                autoplay
                className="w-full h-full max-h-[300px]"
              />
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 shadow-sm ${openFaq === i ? 'border-orange-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-black/5 hover:border-black/20'}`}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <div className="flex justify-between items-center px-8 py-6">
                  <h4 className={`font-bold text-lg ${openFaq === i ? 'text-orange-600' : 'text-black/90'}`}>{q}</h4>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 shrink-0 ml-4 ${openFaq === i ? 'rotate-180 text-orange-500' : 'text-black/40'}`} />
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <p className="px-8 pb-6 text-black/60 leading-relaxed">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-500"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Ready to drive smarter?</h2>
          <p className="text-orange-100 text-xl font-medium mb-10 max-w-xl mx-auto">Join 9.5 lakh+ vehicle owners who park with absolute peace of mind.</p>
          <Link to="/shop" className="inline-flex items-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl">
            Get Your Tag Now <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
      
    </div>
  );
}

