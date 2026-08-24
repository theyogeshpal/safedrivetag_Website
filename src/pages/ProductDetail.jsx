import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Truck, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Minus, 
  Plus, 
  CreditCard,
  RefreshCw,
  AlertCircle,
  PackageOpen,
  Eye,
  Printer,
  Sparkles
} from 'lucide-react';
import PageHero from '../components/PageHero';
import PageLoader from '../components/PageLoader';
import api from '../services/api';
import { openDigitalPdf, printDigitalPdfInColor } from '../utils/digitalPdfGenerator';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch product strictly from live backend API
  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      setError('');
      try {
        // Try direct ID endpoint first
        let foundProduct = null;
        try {
          const res = await api.getProductById(id);
          if (res.success && res.product) {
            foundProduct = res.product;
          }
        } catch (e) {
          console.warn('Direct product fetch failed, falling back to products list', e);
        }

        // If direct fetch didn't return product, search in full catalog
        if (!foundProduct) {
          const listRes = await api.getProducts();
          if (listRes.success && listRes.products && listRes.products.length > 0) {
            foundProduct = listRes.products.find(
              (p) => p._id === id || p.productId === id || p.slug === id
            ) || listRes.products[0];
          }
        }

        if (foundProduct) {
          // Extract strictly backend images
          const backendImages = [];
          if (Array.isArray(foundProduct.images) && foundProduct.images.length > 0) {
            backendImages.push(...foundProduct.images.filter(Boolean));
          } else if (foundProduct.imageUrl) {
            backendImages.push(foundProduct.imageUrl);
          }

          setProduct({
            _id: foundProduct._id || id,
            name: foundProduct.title || foundProduct.name || 'SafeDrive Vehicle Protection Kit',
            sub: foundProduct.description || 'Smart QR Vehicle Safety Kit with Instant Cloud Call Bridge',
            price: foundProduct.price || 299,
            oldPrice: foundProduct.originalPrice || (foundProduct.price ? foundProduct.price + 200 : 499),
            rating: foundProduct.rating || 4.9,
            reviews: foundProduct.reviewsCount || 2340,
            desc: foundProduct.description || 'Premium reflective and weatherproof SafeDrive QR stickers for complete privacy and vehicle security.',
            features: Array.isArray(foundProduct.features) && foundProduct.features.length > 0 
              ? foundProduct.features 
              : [
                  'Instant Masked Voice Calling to Owner (Zero Phone Number Exposure)',
                  'Direct WhatsApp Emergency Broadcast Alert',
                  'High-Grade Reflective Waterproof 3M Vinyl Stickers',
                  '1-Year Free Cloud Relay Bridge Included',
                  'Anti-Harassment 4-Digit Plate Protection'
                ],
            images: backendImages,
            qrType: foundProduct.qrType || 'PHYSICAL',
          });
        } else {
          setError('Product not found in catalog.');
        }
      } catch (err) {
        console.error('Error loading product details', err);
        setError('Failed to load product details from server.');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleBuyNow = () => {
    if (!product) return;
    navigate('/checkout', {
      state: {
        product: {
          productId: product._id,
          _id: product._id,
          title: product.name,
          description: product.sub,
          price: product.price,
          originalPrice: product.oldPrice,
          imageUrl: product.images?.[0] || '',
          qrType: product.qrType || 'PHYSICAL',
        },
        quantity: qty,
      },
    });
  };

  // Loading State with Branded PageLoader
  if (isLoading) {
    return <PageLoader text="Loading SafeDrive product details..." fullScreen={true} />;
  }

  // Error / Not Found State
  if (error || !product) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen pb-24 font-sans">
        <PageHero
          badge="🏷️ OFFICIAL STORE"
          title="Product Not"
          highlightText="Found"
          description="The requested product could not be located in our catalog."
        />
        <div className="max-w-xl mx-auto px-4 -mt-6 relative z-10 text-center">
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-black/5">
            <PackageOpen className="w-16 h-16 text-black/30 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-black mb-2">Product Unavailable</h2>
            <p className="text-sm text-black/60 mb-6">
              {error || 'This product may have been removed or is temporarily out of stock.'}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-orange-500/25"
            >
              Browse All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isDigitalProduct = product.qrType === 'DIGITAL';

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24 selection:bg-orange-500/30 font-sans">
      
      {/* Hero Header */}
      <PageHero
        badge="🏷️ OFFICIAL PRODUCT STORE"
        title={product.name}
        description={product.sub}
      >
        {/* Breadcrumb inside Hero */}
        <div className="flex items-center justify-center gap-2 text-xs text-white/60 font-bold uppercase tracking-wider pt-1">
          <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-orange-400 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white font-extrabold line-clamp-1">{product.name}</span>
        </div>
      </PageHero>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-black/5 border border-black/5 flex flex-col md:flex-row gap-10">
          
          {/* Images Gallery - Strictly Backend Images */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-orange-50/20 border border-black/5 relative group flex items-center justify-center p-4 bg-white">
              <img 
                src={(product.images && product.images.length > 0 && product.images[activeImage || 0]) || 'https://res.cloudinary.com/dofqiruh7/image/upload/v1787403231/safedrive/products/wf5u8xfkhdfa1v2ndajx.jpg'} 
                alt={product.name} 
                onError={(e) => {
                  e.currentTarget.src = 'https://res.cloudinary.com/dofqiruh7/image/upload/v1787403231/safedrive/products/wf5u8xfkhdfa1v2ndajx.jpg';
                }}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
              />
              
              <span className={`absolute top-4 left-4 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg z-20 ${
                isDigitalProduct ? 'bg-purple-600' : 'bg-green-500'
              }`}>
                {isDigitalProduct ? 'Instant Digital Kit' : 'Official Physical Kit'}
              </span>
            </div>

            {/* Thumbnail Row only if more than 1 backend image */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${activeImage === idx ? 'border-orange-500 opacity-100 ring-2 ring-orange-500/20' : 'border-black/10 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`view-${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Digital Kit Preview Buttons */}
            {isDigitalProduct && (
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                  <Sparkles size={14} className="text-purple-600" />
                  <span>Digital E-Kit: Instant Download & Print Ready</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openDigitalPdf(product)}
                    className="flex-1 bg-white hover:bg-purple-100/50 text-purple-800 border border-purple-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye size={13} /> Open PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => printDigitalPdfInColor(product)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                  >
                    <Printer size={13} /> Print Color PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                isDigitalProduct 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : 'bg-orange-100 text-orange-700 border border-orange-200'
              }`}>
                {isDigitalProduct ? '⚡ INSTANT DIGITAL PASS' : '📦 3M PHYSICAL STICKERS'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-black mb-2 tracking-tight">{product.name}</h1>
            <p className="text-base sm:text-lg text-black/50 font-medium mb-4">{product.sub}</p>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <Star className="w-4 h-4 fill-orange-500 text-orange-500 mr-1" />
                <span className="text-sm font-bold text-orange-700">{product.rating}</span>
              </div>
              <span className="text-sm font-medium text-black/40 underline decoration-black/20 underline-offset-4">
                {product.reviews.toLocaleString()} verified buyers
              </span>
            </div>

            {/* Price Box */}
            <div className="flex items-end gap-3 mb-6 bg-black/[0.02] border border-black/5 p-4 rounded-2xl">
              <span className="text-4xl sm:text-5xl font-black text-black">₹{product.price}</span>
              {product.oldPrice > product.price && (
                <>
                  <span className="text-xl sm:text-2xl text-black/40 line-through mb-1">₹{product.oldPrice}</span>
                  <span className="mb-2 ml-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    Save ₹{product.oldPrice - product.price}
                  </span>
                </>
              )}
            </div>

            <p className="text-black/70 text-sm leading-relaxed mb-6 font-medium">{product.desc}</p>

            {/* Included Features List */}
            <div className="bg-white rounded-2xl p-5 border border-black/5 mb-6 shadow-sm">
              <h3 className="font-bold text-black mb-3 uppercase tracking-wider text-xs">What's included in this kit</h3>
              <ul className="space-y-2.5">
                {product.features.map((f, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-black/80 font-semibold text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector & Buy Now Button */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <div className="flex items-center justify-between bg-black/5 rounded-2xl px-4 py-3 sm:w-32 border border-black/10">
                <button 
                  type="button" 
                  onClick={() => setQty(Math.max(1, qty - 1))} 
                  className="text-black/60 hover:text-black font-black text-base px-2 cursor-pointer"
                >
                  <Minus size={16} />
                </button>
                <span className="font-black text-black text-base">{qty}</span>
                <button 
                  type="button" 
                  onClick={() => setQty(qty + 1)} 
                  className="text-black/60 hover:text-black font-black text-base px-2 cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <button 
                type="button"
                onClick={handleBuyNow}
                className="flex-1 bg-green-500 text-white flex items-center justify-center gap-2 rounded-2xl py-4 font-black text-base hover:bg-green-600 transition-all shadow-[0_8px_30px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Buy Now — ₹{product.price * qty}</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-black">{isDigitalProduct ? 'Instant Delivery' : 'Express Delivery'}</p>
                  <p className="text-[11px] text-black/50">{isDigitalProduct ? 'Instant PDF In Dashboard' : '3-5 Days Across India'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-black">100% Privacy</p>
                  <p className="text-[11px] text-black/50">Masked Calling Bridge</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
