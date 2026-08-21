import React from 'react';
import { Star, Truck, CreditCard, RefreshCcw, ShieldCheck, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Shop() {
  const navigate = useNavigate();
  const products = [
    {
      id: 'car',
      name: 'SafeDrive Car Tag',
      sub: 'Pack of 2 Premium QR Stickers',
      rating: 4.8,
      reviews: 2341,
      desc: 'For your 4-wheeler. Apply one sticker on the front windshield and one on the rear for maximum visibility.',
      features: ['2x Premium QR Tags', 'Front & rear coverage', 'Priority Support'],
      price: 399,
      oldPrice: 499,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
      bestSeller: true,
    },
    {
      id: 'bike',
      name: 'SafeDrive Bike Tag',
      sub: 'Pack of 1 Premium QR Sticker',
      rating: 4.7,
      reviews: 1892,
      desc: 'For your 2-wheeler. Stick it securely on your bike visor or fuel tank. Weatherproof and anti-fade.',
      features: ['1x Premium QR Tag', 'Secure masked calling', 'WhatsApp & SMS Alerts'],
      price: 299,
      oldPrice: 399,
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      bestSeller: false,
    },
  ];

  return (
    <div className="bg-white font-sans text-black/90 min-h-screen selection:bg-orange-500/30 selection:text-orange-900 pt-24 pb-20">

      {/* --- HERO --- */}
      <section className="relative pt-10 pb-16 px-6 text-center">
        <div className="relative z-10 max-w-3xl mx-auto animate-fade-up">
          <p className="text-orange-500 font-bold tracking-widest text-sm uppercase mb-4">Official Store</p>
          <h1 className="text-5xl md:text-6xl font-black text-black mb-6 tracking-tight">Pick your protection.</h1>
          <p className="text-lg text-black/60 font-medium">
            One-time buy, free services for life. Free delivery and cash on delivery available on every order.
          </p>
        </div>
      </section>

      {/* --- PRODUCTS --- */}
      <section className="pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/shop/product/${p.id}`)}
              className={`relative bg-white border rounded-3xl overflow-hidden flex flex-col hover:-translate-y-1.5 transition-all duration-500 group shadow-sm hover:shadow-xl cursor-pointer ${p.bestSeller ? 'border-orange-200 ring-2 ring-orange-500/20' : 'border-black/10'}`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-black/5">
                {p.bestSeller && (
                  <span className="absolute top-4 left-4 z-10 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    Best Seller
                  </span>
                )}
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Details */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                  <h3 className="text-xl font-black mb-1 text-black leading-tight">{p.name}</h3>
                  <p className="text-black/50 font-medium text-xs">{p.sub}</p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-orange-500">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-black/90 font-bold text-xs">{p.rating}</span>
                  <span className="text-black/40 text-[10px]">({p.reviews.toLocaleString()} reviews)</span>
                </div>

                <p className="text-black/60 text-xs leading-relaxed mb-4 h-12 line-clamp-3">{p.desc}</p>

                <ul className="space-y-2 mb-5 flex-grow">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-black/80 font-medium text-xs">
                      <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${p.bestSeller ? 'text-orange-500' : 'text-black/40'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
                  <div className="flex items-end gap-1.5">
                    <span className="text-2xl font-black text-black">₹{p.price}</span>
                    <span className="text-xs text-black/40 line-through mb-1">₹{p.oldPrice}</span>
                  </div>
                  <Link 
                    to="/checkout" 
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md ${p.bestSeller ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30' : 'bg-black text-white hover:bg-black/90'}`}
                  >
                    Buy Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- TRUST BAR --- */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="bg-black text-white rounded-3xl py-12 px-6 lg:px-12 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {[
              { icon: <Truck className="w-8 h-8 text-orange-500" />, label: 'Free Express', sub: 'Delivery' },
              { icon: <CreditCard className="w-8 h-8 text-green-500" />, label: 'Cash on', sub: 'Delivery' },
              { icon: <RefreshCcw className="w-8 h-8 text-orange-500" />, label: '60-Day', sub: 'Returns' },
              { icon: <ShieldCheck className="w-8 h-8 text-green-500" />, label: '1-Year', sub: 'Warranty' },
              { icon: <Award className="w-8 h-8 text-orange-500" />, label: '9.5L+', sub: 'Active Tags' },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:-translate-y-2 group-hover:bg-white/10 transition-all duration-300">
                  {icon}
                </div>
                <div>
                  <div className="font-black text-lg tracking-tight">{label}</div>
                  <div className="text-white/60 font-medium text-sm">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
