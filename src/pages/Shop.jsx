import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  PackageOpen,
  Headphones
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import api from '../services/api';

export default function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProducts();
      if (res.success && Array.isArray(res.products) && res.products.length > 0) {
        setProducts(res.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products from API:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = (prod) => {
    navigate(`/shop/product/${prod._id}`);
  };

  const handleOrderNow = (e, prod) => {
    e.stopPropagation();
    navigate('/checkout', {
      state: {
        product: {
          productId: prod._id,
          title: prod.title,
          description: prod.description,
          price: prod.price,
          originalPrice: prod.originalPrice,
          imageUrl: prod.imageUrl,
          qrType: prod.qrType || 'PHYSICAL',
        },
        quantity: 1,
      },
    });
  };

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

      {/* --- PRODUCT CARDS SECTION (DYNAMIC FROM API) --- */}
      <section className="relative z-20 -mt-6 sm:-mt-8 px-4 sm:px-6 max-w-7xl mx-auto">
        
        {/* State 1: Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-black/5 animate-pulse h-96 flex flex-col justify-between">
                <div className="w-full h-48 bg-black/5 rounded-2xl mb-4" />
                <div className="h-6 bg-black/5 rounded-md w-3/4 mb-2" />
                <div className="h-4 bg-black/5 rounded-md w-1/2 mb-4" />
                <div className="h-12 bg-black/5 rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* State 2: No Products Found */}
        {!isLoading && products.length === 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-black/5 border border-black/5 text-center max-w-2xl mx-auto animate-fade-up">
            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
              <PackageOpen size={40} />
            </div>
            
            <span className="inline-block bg-orange-50 text-orange-700 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-orange-200 mb-3">
              Store Catalog Empty
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-2">
              No Products Found
            </h2>
            <p className="text-sm text-black/60 font-medium max-w-md mx-auto mb-8 leading-relaxed">
              Currently there are no active products available in the store database. Please check back shortly or get in touch with our team.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={fetchProducts}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                <RefreshCcw size={15} />
                <span>Retry / Refresh</span>
              </button>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black/5 hover:bg-black/10 text-black font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm border border-black/10 transition-all"
              >
                <Headphones size={15} />
                <span>Contact Support</span>
              </Link>
            </div>
          </div>
        )}

        {/* State 3: Products Available */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {products.map((prod, idx) => {
              const discountPercent = prod.originalPrice && prod.price
                ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                : 0;

              return (
                <div 
                  key={prod._id || idx}
                  onClick={() => handleProductClick(prod)}
                  className="relative bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-orange-500/5 border border-black/5 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
                >
                  {/* Floating Top Badge */}
                  {prod.badge && (
                    <div className="absolute -top-3.5 left-6 z-30">
                      <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] sm:text-[11px] tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                        <Star size={12} className="fill-white" /> {prod.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Product Visual Mockup */}
                    <div 
                      className="relative bg-orange-50/40 rounded-2xl p-3 sm:p-4 border border-orange-100/80 h-48 sm:h-52 flex items-center justify-center overflow-hidden mb-5 bg-white"
                    >
                      <img 
                        src={prod.imageUrl || '/images/safedrive-tag-final.png'} 
                        alt={prod.title}
                        onError={(e) => {
                          e.currentTarget.src = '/images/safedrive-tag-final.png';
                        }}
                        className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500" 
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4 z-20 pointer-events-none">
                        <span className="text-white text-xs font-bold flex items-center gap-1.5">
                          View details <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>

                    {/* Tag Badges Row */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-200/60 font-bold text-[10px] px-2 py-0.5 rounded-md">
                          <Tag size={10} /> {prod.qrType === 'DIGITAL' ? 'Digital Pass' : 'Physical Sticker Kit'}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded-md">
                          <Package size={10} /> Pan-India Delivery
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shrink-0">
                        <QrCode size={14} />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h2 className="text-xl font-black text-black tracking-tight mb-1.5 group-hover:text-orange-600 transition-colors">
                      {prod.title}
                    </h2>
                    <p className="text-xs text-black/60 font-medium mb-4 leading-relaxed line-clamp-2">
                      {prod.description}
                    </p>

                    {/* Pricing Row */}
                    <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-black/5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-black">₹{prod.price}</span>
                        {prod.originalPrice && (
                          <span className="text-xs font-bold text-black/40 line-through">₹{prod.originalPrice}</span>
                        )}
                        {discountPercent > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-black">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-bold text-black/50 text-right">
                        Renewal: <span className="text-orange-600 font-extrabold">₹{prod.renewalAmount || 199}/yr</span>
                      </div>
                    </div>

                    {/* Features List */}
                    {prod.features && prod.features.length > 0 && (
                      <div className="mb-5 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-black/40 mb-1.5">
                          Kit Inclusions:
                        </p>
                        {prod.features.slice(0, 4).map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-semibold text-black/80">
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                              <Check size={10} strokeWidth={3} />
                            </div>
                            <span className="line-clamp-1">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => handleOrderNow(e, prod)}
                    className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(249,115,22,0.25)] transition-all text-xs sm:text-sm cursor-pointer hover:scale-[1.01]"
                  >
                    <span>Order Now — ₹{prod.price}</span>
                    <ArrowRight size={15} />
                  </button>

                </div>
              );
            })}
          </div>
        )}

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
