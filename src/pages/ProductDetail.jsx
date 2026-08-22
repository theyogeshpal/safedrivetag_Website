import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, ShieldCheck, RefreshCcw, CheckCircle, ArrowRight, Minus, Plus, CreditCard } from 'lucide-react';
import PageHero from '../components/PageHero';
import api from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [liveProduct, setLiveProduct] = useState(null);

  // Fetch product from live backend if valid ID
  useEffect(() => {
    async function loadProduct() {
      if (id && id.length > 10) {
        try {
          const res = await api.getProductById(id);
          if (res.success && res.product) {
            setLiveProduct(res.product);
          }
        } catch (e) {
          console.log('Using catalog fallback for product id:', id);
        }
      }
    }
    loadProduct();
  }, [id]);

  const getProductData = () => {
    if (liveProduct) {
      return {
        _id: liveProduct._id,
        name: liveProduct.title || 'SafeDrive QR Kit',
        sub: liveProduct.description || 'Premium SafeDrive QR Protection',
        price: liveProduct.price || 299,
        oldPrice: liveProduct.originalPrice || liveProduct.price + 100,
        rating: 4.8,
        reviews: 2150,
        desc: liveProduct.description || 'Premium reflective waterproof QR stickers for your vehicle.',
        features: liveProduct.features || [
          'Instant Masked Voice Calling to Owner',
          'WhatsApp Emergency Alert',
          '2 Physical Reflective Waterproof Stickers',
          '1-Year Validity Included'
        ],
        images: [
          liveProduct.imageUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80'
        ],
        dark: true,
      };
    }

    if (id === 'car') {
      return {
        _id: 'prod_car_kit',
        name: 'SafeDrive Car Tag',
        sub: 'Pack of 2 Premium QR Stickers',
        price: 399,
        oldPrice: 499,
        rating: 4.8,
        reviews: 2341,
        desc: 'The ultimate privacy protection for your 4-wheeler. Apply one sticker on the front windshield and one on the rear to ensure anyone can reach you securely from any angle.',
        features: ['2x Premium QR Tags', 'Front & rear windshield coverage', 'Priority masked call routing', 'Instant WhatsApp & SMS alerts', '1 Year Free Cloud Quota Included'],
        images: [
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80'
        ],
        dark: true,
      };
    } else if (id === 'luggage' || id === 'bag') {
      return {
        _id: 'prod_luggage_kit',
        name: 'SafeDrive Luggage & Bag Tag',
        sub: 'Pack of 2 Metallic QR Badges with Steel Cables',
        price: 249,
        oldPrice: 349,
        rating: 4.9,
        reviews: 1420,
        desc: 'Never lose your flight suitcase, backpack, or laptop bag during commutes. When someone scans your luggage tag, you receive immediate WhatsApp location alerts and private phone calls without exposing your private phone number or home address.',
        features: ['2x Heavy-Duty Metallic Luggage QR Badges', 'Stainless steel braided loop cables included', 'Instant lost baggage WhatsApp GPS notification', 'Private masked calling (No personal number visible)', '1 Year Cloud Protection Included'],
        images: [
          'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&fit=crop&w=800&q=80'
        ],
        dark: false,
      };
    } else {
      return {
        _id: 'prod_bike_kit',
        name: 'SafeDrive Bike Tag',
        sub: 'Pack of 1 Premium QR Sticker',
        price: 299,
        oldPrice: 399,
        rating: 4.7,
        reviews: 1892,
        desc: 'Designed specifically for two-wheelers. Stick it securely on your bike visor or fuel tank. Weatherproof, anti-fade, and built to last in harsh conditions.',
        features: ['1x Premium QR Tag', 'Secure masked calling', 'WhatsApp & SMS Alerts', 'Weather & Water proof', 'Anti-fade coating'],
        images: [
          'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80'
        ],
        dark: false,
      };
    }
  };

  const product = getProductData();

  const handleBuyNow = () => {
    navigate('/checkout', {
      state: {
        product: {
          productId: product._id,
          title: product.name,
          description: product.sub,
          price: product.price,
          originalPrice: product.oldPrice,
          imageUrl: product.images[0],
          qrType: 'PHYSICAL',
        },
        quantity: qty,
      },
    });
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24 selection:bg-orange-500/30">
      
      {/* Uniform Hero Banner */}
      <PageHero
        badge="🏷️ OFFICIAL PRODUCT STORE"
        title={product.name}
        description={product.sub}
      >
        {/* Breadcrumb inside Hero */}
        <div className="flex items-center justify-center gap-2 text-xs text-white/50 font-bold uppercase tracking-wider pt-1">
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-orange-500 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white font-extrabold">{product.name}</span>
        </div>
      </PageHero>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-black/5 border border-black/5 flex flex-col md:flex-row gap-10">
          
          {/* Images Gallery */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-black/5 relative group">
              <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {product.dark && (
                <span className="absolute top-4 left-4 bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                  Best Seller
                </span>
              )}
            </div>
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeImage === idx ? 'border-orange-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col">
            <h1 className="text-4xl font-black text-black mb-2">{product.name}</h1>
            <p className="text-lg text-black/50 font-medium mb-4">{product.sub}</p>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <Star className="w-4 h-4 fill-orange-500 text-orange-500 mr-1" />
                <span className="text-sm font-bold text-orange-700">{product.rating}</span>
              </div>
              <span className="text-sm font-medium text-black/40 underline decoration-black/20 underline-offset-4">{product.reviews.toLocaleString()} verified reviews</span>
            </div>

            <div className="flex items-end gap-3 mb-8">
              <span className="text-5xl font-black text-black">₹{product.price}</span>
              <span className="text-2xl text-black/40 line-through mb-1">₹{product.oldPrice}</span>
              <span className="mb-2 ml-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Save ₹{product.oldPrice - product.price}</span>
            </div>

            <p className="text-black/60 leading-relaxed mb-8">{product.desc}</p>

            <div className="bg-white rounded-2xl p-6 border border-black/5 mb-8">
              <h3 className="font-bold text-black mb-4 uppercase tracking-wider text-xs">What's included</h3>
              <ul className="space-y-3">
                {product.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-black/80 font-medium text-sm">
                    <CheckCircle className="w-5 h-5 text-orange-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <div className="flex items-center justify-between bg-black/5 rounded-full px-4 py-3 sm:w-32 border border-black/10">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-black/50 hover:text-black transition-colors p-1 cursor-pointer"><Minus size={18} /></button>
                <span className="font-bold text-black">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="text-black/50 hover:text-black transition-colors p-1 cursor-pointer"><Plus size={18} /></button>
              </div>
              
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-green-500 text-white flex items-center justify-center gap-2 rounded-full py-4 font-black text-lg hover:bg-green-600 transition-all shadow-[0_8px_30px_rgba(34,197,94,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(34,197,94,0.4)] cursor-pointer"
              >
                Buy Now — ₹{product.price * qty} <ArrowRight size={20} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0"><Truck className="w-5 h-5 text-green-500" /></div>
                <div><p className="text-sm font-bold text-black">Free Shipping</p><p className="text-xs text-black/50">Across India</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0"><CreditCard className="w-5 h-5 text-green-500" /></div>
                <div><p className="text-sm font-bold text-black">Secure Pay</p><p className="text-xs text-black/50">COD Available</p></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
