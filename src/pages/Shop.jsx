import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Zap, 
  Phone, 
  MessageSquare, 
  Clock, 
  Check, 
  ArrowRight, 
  QrCode, 
  Tag, 
  Package, 
  Smartphone,
  Star,
  Truck,
  CreditCard,
  RefreshCcw,
  Award,
  Sparkles,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';

export default function Shop() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF8F5] font-sans text-black/90 min-h-screen selection:bg-orange-500/30 selection:text-orange-900">

      {/* --- HERO / HEADER BANNER --- */}
      <PageHero
        badge="🏷️ OFFICIAL SAFEDRIVE STORE"
        title="Protect Your Vehicles & Bags with"
        highlightText="Smart QR Safety Kits"
        description="Choose your safety kit. Instant masked calling, WhatsApp direct alerts, plate verification security & 1-year free cloud quota included."
        badges={[
          { icon: <ShieldCheck size={14} className="text-green-600" />, label: 'Masked Call Bridge' },
          { icon: <Zap size={14} className="text-orange-500" />, label: 'Instant Activation' },
          { icon: <Truck size={14} className="text-blue-500" />, label: 'Free Pan-India Delivery' }
        ]}
      />

      {/* --- PRODUCT CARDS SECTION --- */}
      <section className="relative z-20 -mt-6 sm:-mt-8 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          
          {/* CARD 1: CAR SAFETY STICKERS (MOST POPULAR) */}
          <div 
            onClick={() => navigate('/shop/product/car')}
            className="relative bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-orange-500/5 border border-black/5 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
          >
            
            {/* Floating Top Badge */}
            <div className="absolute -top-3.5 left-6 z-30">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] sm:text-[11px] tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <Star size={12} className="fill-white" /> MOST POPULAR
              </span>
            </div>

            <div>
              {/* Product Visual Mockup */}
              <div 
                className="relative bg-orange-50/40 rounded-2xl p-3 sm:p-4 border border-orange-100/80 h-48 sm:h-52 flex items-center justify-center overflow-hidden mb-5"
              >
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80" 
                  alt="Car Safety Stickers"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5">
                    View details <ArrowRight size={13} />
                  </span>
                </div>
              </div>

              {/* Tag Badges Row */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-200/60 font-bold text-[10px] px-2 py-0.5 rounded-md">
                    <Tag size={10} /> 4-Wheeler / Car
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#fdf8d5] text-[#6d5516] border border-[#f4e28e] font-bold text-[10px] px-2 py-0.5 rounded-md">
                    <Package size={10} /> Courier Delivery
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shrink-0">
                  <QrCode size={14} />
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl font-black text-black tracking-tight mb-1.5 group-hover:text-orange-600 transition-colors">
                Car Safety Stickers Kit
              </h2>
              <p className="text-xs text-black/60 font-medium mb-4 leading-relaxed line-clamp-2">
                Pack of 2 high-grade reflective stickers with masked calling and 24/7 instant emergency alerts.
              </p>

              {/* Pricing Row */}
              <div className="flex items-baseline justify-between mb-4 pb-3.5 border-b border-black/5">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-black">₹399</span>
                    <span className="text-xs font-bold text-black/40 line-through">₹499</span>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200">
                      20% OFF
                    </span>
                  </div>
                  <span className="text-black/50 font-medium text-[11px]">Includes 2 Stickers + 1 Yr Quota</span>
                </div>
                <div className="text-[11px] font-bold text-black/50 text-right">
                  Renewal: <span className="text-orange-600 font-extrabold">₹199/yr</span>
                </div>
              </div>

              {/* Quota Row */}
              <div className="bg-orange-50/40 border border-orange-100/80 rounded-xl p-2.5 grid grid-cols-3 gap-1.5 text-center mb-5">
                <div>
                  <div className="text-xs font-black text-black flex items-center justify-center gap-1">
                    <Phone size={11} className="text-orange-600" /> 10
                  </div>
                  <div className="text-[9px] text-black/50 font-semibold mt-0.5">Free Calls</div>
                </div>
                <div className="border-x border-orange-200/60">
                  <div className="text-xs font-black text-black flex items-center justify-center gap-1">
                    <MessageSquare size={11} className="text-emerald-600" /> 20
                  </div>
                  <div className="text-[9px] text-black/50 font-semibold mt-0.5">Free SMS/WA</div>
                </div>
                <div>
                  <div className="text-xs font-black text-black flex items-center justify-center gap-1">
                    <Clock size={11} className="text-purple-600" /> 365d
                  </div>
                  <div className="text-[9px] text-black/50 font-semibold mt-0.5">Validity</div>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-5 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-black/40 mb-1.5">
                  Kit Inclusions:
                </p>
                {[
                  '2x Premium Reflective UV Stickers',
                  '10 Voice Calls & 20 WhatsApp Alerts',
                  'Number Masking Privacy Bridge',
                  'Live GPS Emergency SOS Dispatch'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-black/80">
                    <div className="w-3.5 h-3.5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/checkout');
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(34,197,94,0.25)] transition-all text-xs sm:text-sm cursor-pointer hover:scale-[1.01]"
            >
              <span>Order Car Safety Tag</span>
              <ArrowRight size={15} />
            </button>

          </div>

          {/* CARD 2: BIKE SAFETY STICKER */}
          <div 
            onClick={() => navigate('/shop/product/bike')}
            className="relative bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-orange-500/5 border border-black/5 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
          >
            
            <div>
              {/* Product Visual Mockup */}
              <div 
                className="relative bg-amber-50/40 rounded-2xl p-3 sm:p-4 border border-amber-100/80 h-48 sm:h-52 flex items-center justify-center overflow-hidden mb-5"
              >
                <img 
                  src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80" 
                  alt="Bike Safety Tag"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5">
                    View details <ArrowRight size={13} />
                  </span>
                </div>
              </div>

              {/* Tag Badges Row */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/60 font-bold text-[10px] px-2 py-0.5 rounded-md">
                    <Tag size={10} /> 2-Wheeler / Bike
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#fdf8d5] text-[#6d5516] border border-[#f4e28e] font-bold text-[10px] px-2 py-0.5 rounded-md">
                    <Package size={10} /> Courier Delivery
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shrink-0">
                  <QrCode size={14} />
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl font-black text-black tracking-tight mb-1.5 group-hover:text-orange-600 transition-colors">
                Bike Safety Sticker Kit
              </h2>
              <p className="text-xs text-black/60 font-medium mb-4 leading-relaxed line-clamp-2">
                Compact weather & scratch-proof helmet/visor tag for motorcycles & scooters with emergency alerts.
              </p>

              {/* Pricing Row */}
              <div className="flex items-baseline justify-between mb-4 pb-3.5 border-b border-black/5">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-black">₹299</span>
                    <span className="text-xs font-bold text-black/40 line-through">₹399</span>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200">
                      25% OFF
                    </span>
                  </div>
                  <span className="text-black/50 font-medium text-[11px]">Includes 1 Waterproof Sticker + 1 Yr Quota</span>
                </div>
                <div className="text-[11px] font-bold text-black/50 text-right">
                  Renewal: <span className="text-orange-600 font-extrabold">₹199/yr</span>
                </div>
              </div>

              {/* Quota Row */}
              <div className="bg-orange-50/40 border border-orange-100/80 rounded-xl p-2.5 grid grid-cols-3 gap-1.5 text-center mb-5">
                <div>
                  <div className="text-xs font-black text-black flex items-center justify-center gap-1">
                    <Phone size={11} className="text-orange-600" /> 10
                  </div>
                  <div className="text-[9px] text-black/50 font-semibold mt-0.5">Free Calls</div>
                </div>
                <div className="border-x border-orange-200/60">
                  <div className="text-xs font-black text-black flex items-center justify-center gap-1">
                    <MessageSquare size={11} className="text-emerald-600" /> 20
                  </div>
                  <div className="text-[9px] text-black/50 font-semibold mt-0.5">Free SMS/WA</div>
                </div>
                <div>
                  <div className="text-xs font-black text-black flex items-center justify-center gap-1">
                    <Clock size={11} className="text-purple-600" /> 365d
                  </div>
                  <div className="text-[9px] text-black/50 font-semibold mt-0.5">Validity</div>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-5 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-black/40 mb-1.5">
                  Kit Inclusions:
                </p>
                {[
                  '1x Ultra-Adhesive Bike Tag',
                  '10 Voice Calls & 20 WhatsApp Alerts',
                  'Accident SOS Broadcast to Family',
                  '1 Year Full Cloud Protection'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-black/80">
                    <div className="w-3.5 h-3.5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/checkout');
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(249,115,22,0.25)] transition-all text-xs sm:text-sm cursor-pointer hover:scale-[1.01]"
            >
              <span>Order Bike Safety Tag</span>
              <ArrowRight size={15} />
            </button>

          </div>

          {/* CARD 3: LUGGAGE & BAG SAFETY TAG (NEW) */}
          <div 
            onClick={() => navigate('/shop/product/luggage')}
            className="relative bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-orange-500/5 border border-black/5 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
          >
            
            {/* Top Badge */}
            <div className="absolute -top-3.5 left-6 z-30">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[10px] sm:text-[11px] tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                ✈️ TRAVEL ESSENTIAL
              </span>
            </div>

            <div>
              {/* Product Visual Mockup */}
              <div 
                className="relative bg-blue-50/40 rounded-2xl p-3 sm:p-4 border border-blue-100/80 h-48 sm:h-52 flex items-center justify-center overflow-hidden mb-5"
              >
                <img 
                  src="https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80" 
                  alt="Luggage & Bag Safety Tag"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5">
                    View details <ArrowRight size={13} />
                  </span>
                </div>
              </div>

              {/* Tag Badges Row */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200/60 font-bold text-[10px] px-2 py-0.5 rounded-md">
                    <Tag size={10} /> Travel Luggage & Bags
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#fdf8d5] text-[#6d5516] border border-[#f4e28e] font-bold text-[10px] px-2 py-0.5 rounded-md">
                    <Package size={10} /> 2 Metallic Badges
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                  <QrCode size={14} />
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl font-black text-black tracking-tight mb-1.5 group-hover:text-orange-600 transition-colors">
                Smart Luggage Tag Kit
              </h2>
              <p className="text-xs text-black/60 font-medium mb-4 leading-relaxed line-clamp-2">
                Heavy-duty metallic QR bag badges with braided steel loop cables for flight suitcases and laptop bags.
              </p>

              {/* Pricing Row */}
              <div className="flex items-baseline justify-between mb-4 pb-3.5 border-b border-black/5">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-black">₹249</span>
                    <span className="text-xs font-bold text-black/40 line-through">₹349</span>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200">
                      28% OFF
                    </span>
                  </div>
                  <span className="text-black/50 font-medium text-[11px]">Includes 2 Tags + Steel Loop Cables</span>
                </div>
                <div className="text-[11px] font-bold text-black/50 text-right">
                  Renewal: <span className="text-orange-600 font-extrabold">₹199/yr</span>
                </div>
              </div>

              {/* Quota Row */}
              <div className="bg-blue-50/30 border border-blue-100/80 rounded-xl p-2.5 grid grid-cols-3 gap-1.5 text-center mb-5">
                <div>
                  <div className="text-xs font-black text-black flex items-center justify-center gap-1">
                    <Phone size={11} className="text-blue-600" /> 10
                  </div>
                  <div className="text-[9px] text-black/50 font-semibold mt-0.5">Masked Calls</div>
                </div>
                <div className="border-x border-blue-200/60">
                  <div className="text-xs font-black text-black flex items-center justify-center gap-1">
                    <MessageSquare size={11} className="text-emerald-600" /> 20
                  </div>
                  <div className="text-[9px] text-black/50 font-semibold mt-0.5">WA Lost Alerts</div>
                </div>
                <div>
                  <div className="text-xs font-black text-black flex items-center justify-center gap-1">
                    <Clock size={11} className="text-purple-600" /> 365d
                  </div>
                  <div className="text-[9px] text-black/50 font-semibold mt-0.5">Cloud Validity</div>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-5 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-black/40 mb-1.5">
                  Kit Inclusions:
                </p>
                {[
                  '2x Metallic Badges + Steel Loop Cables',
                  'Instant Lost Bag GPS Location Alert',
                  'Masked Caller ID (No Personal Phone Leak)',
                  'Airport, Train & Taxi Bag Recovery'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-black/80">
                    <div className="w-3.5 h-3.5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/checkout');
              }}
              className="w-full bg-[#18181b] hover:bg-black text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-all text-xs sm:text-sm cursor-pointer hover:scale-[1.01]"
            >
              <span>Order Luggage Safety Tag</span>
              <ArrowRight size={15} />
            </button>

          </div>

        </div>
      </section>

      {/* --- THREE FEATURE PILLARS --- */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto mt-14 sm:mt-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-black/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-black/5">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center px-4 pt-4 md:pt-0">
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4 shadow-sm border border-green-100">
                <Lock size={26} />
              </div>
              <h3 className="text-lg font-black text-black mb-2">Zero Mobile Spam</h3>
              <p className="text-xs sm:text-sm text-black/60 leading-relaxed font-medium">
                Your personal phone number is never exposed to public QR scanners or marketing databases.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center px-4 pt-6 md:pt-0">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 shadow-sm border border-orange-100">
                <Zap size={26} />
              </div>
              <h3 className="text-lg font-black text-black mb-2">Instant Activation</h3>
              <p className="text-xs sm:text-sm text-black/60 leading-relaxed font-medium">
                Receive sticker, scan it with your phone, and link your vehicle in less than 30 seconds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center px-4 pt-6 md:pt-0">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 shadow-sm border border-amber-100">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-lg font-black text-black mb-2">Live SOS Alerts</h3>
              <p className="text-xs sm:text-sm text-black/60 leading-relaxed font-medium">
                Automatic WhatsApp & SMS location broadcast to your emergency family contacts.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- TRUST BAR --- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 my-14 sm:my-16">
        <div className="bg-gradient-to-tr from-[#111] to-[#222] text-white rounded-3xl py-10 px-6 sm:px-10 shadow-xl overflow-hidden relative border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {[
              { icon: <Truck className="w-6 h-6 text-orange-500" />, label: 'Free Express', sub: 'Courier Delivery' },
              { icon: <CreditCard className="w-6 h-6 text-green-500" />, label: 'Cash on Delivery', sub: 'UPI & Cards Accepted' },
              { icon: <RefreshCcw className="w-6 h-6 text-orange-500" />, label: '60-Day Easy', sub: 'Free Replacements' },
              { icon: <Award className="w-6 h-6 text-amber-400" />, label: '9.5L+ Active', sub: 'Vehicles Protected' },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2.5">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  {icon}
                </div>
                <div>
                  <div className="font-black text-sm sm:text-base text-white">{label}</div>
                  <div className="text-white/60 font-medium text-xs">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

