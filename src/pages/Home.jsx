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
        
        {/* Car Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=2000&q=80" 
            alt="Car Background" 
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>

        {/* Abstract Glowing Orbs (Light Mode Adjusted) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_0.8fr] gap-10 items-center relative z-10 w-full">
          <div className="space-y-6 animate-fade-up">
            
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              🚨 Prevent Towing & Parking Fines
            </div>

            <h1 className="text-[2.5rem] font-black text-black leading-[1.1] tracking-tighter">
              Stay reachable in emergencies, stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">private.</span>
            </h1>

            <p className="text-lg text-black/60 leading-relaxed max-w-lg font-medium">
              SafeDriveTag — Smart QR emergency contacts for vehicles. Protect your car, preserve your privacy. 🚗 Shielding vehicles in wrong parking & emergency situations.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/shop" className="group relative inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-black text-base overflow-hidden transition-all hover:scale-105 hover:shadow-[0_10px_30px_rgba(34,197,94,0.3)]">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-400 to-green-600"></span>
                <span className="relative flex items-center gap-2">
                  Buy Safe Tag <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 pt-6 border-t border-black/10 mt-4">
              <div>
                <div className="text-2xl font-black text-black">9.5L+</div>
                <div className="text-xs font-bold text-black/50 uppercase tracking-wider">Tags Sold</div>
              </div>
              <div className="w-px h-10 bg-black/10"></div>
              <div>
                <div className="flex items-center gap-1 text-2xl font-black text-black">4.8 <Star className="w-5 h-5 fill-orange-500 text-orange-500 -mt-0.5" /></div>
                <div className="text-xs font-bold text-black/50 uppercase tracking-wider">2M+ Scans</div>
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

