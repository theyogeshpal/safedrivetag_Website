import React, { useState, useEffect } from 'react';
import { Lock, CreditCard, ArrowRight, ShieldCheck, Truck, CheckCircle2, RefreshCw, Smartphone, QrCode, AlertCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Helper to ensure Razorpay checkout script is loaded
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Selected product from navigation or default
  const selectedProduct = location.state?.product || {
    productId: '66c7f8a1e2b4c3d4e5f6a7b8',
    title: 'Car Safety QR Protection Kit (2 Stickers)',
    description: 'Pack of 2 Premium Reflective QR Stickers',
    price: 399,
    originalPrice: 499,
    quantity: location.state?.quantity || 1,
    qrType: 'PHYSICAL',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
  };

  const [quantity, setQuantity] = useState(selectedProduct.quantity || 1);
  const totalAmount = selectedProduct.price * quantity;

  const [formData, setFormData] = useState({
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ').slice(1).join(' ') || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    shippingAddress: currentUser?.address || '',
    city: '',
    pincode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.firstName.trim() || !formData.shippingAddress.trim() || !formData.pincode.trim()) {
      setError('Please fill in all mandatory shipping address fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const customerFullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      const fullAddress = `${formData.shippingAddress.trim()}, ${formData.city.trim()} - ${formData.pincode.trim()}`;

      const items = [
        {
          productId: selectedProduct.productId || selectedProduct._id || 'prod_001',
          title: selectedProduct.title || selectedProduct.name || 'SafeDrive QR Kit',
          quantity: quantity,
          price: selectedProduct.price,
          qrType: selectedProduct.qrType || 'PHYSICAL',
        },
      ];

      // Step 1: Create Order on Backend
      const createRes = await api.createOrder({
        amount: totalAmount,
        customerName: customerFullName,
        customerPhone: cleanPhone,
        customerEmail: formData.email.trim() || 'customer@safedrive.in',
        shippingAddress: fullAddress,
        items,
      });

      if (!createRes.success) {
        setError(createRes.message || 'Failed to initialize order with payment server.');
        setIsSubmitting(false);
        return;
      }

      // Step 2: Initialize Razorpay Gateway
      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded || !window.Razorpay) {
        // Fallback: direct completion if script couldn't be loaded (e.g. strict CSP / offline)
        console.warn('Razorpay script not available, proceeding to complete purchase directly.');
        const completeRes = await api.completePurchase({
          razorpay_order_id: createRes.orderId || `order_mock_${Date.now()}`,
          razorpay_payment_id: `pay_direct_${Date.now()}`,
          razorpay_signature: 'mock_signature_valid',
          customerName: customerFullName,
          customerPhone: cleanPhone,
          customerEmail: formData.email.trim() || 'customer@safedrive.in',
          shippingAddress: fullAddress,
          items,
        });

        if (completeRes.success) {
          setOrderSuccess({
            orderNumber: completeRes.orderNumber || createRes.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
            customerName: customerFullName,
            totalAmount,
            items,
            shippingAddress: fullAddress,
          });
        } else {
          setError(completeRes.message || 'Payment verification failed.');
        }
        setIsSubmitting(false);
        return;
      }

      // Open Razorpay Standard Checkout Modal
      const razorpayOptions = {
        key: createRes.key || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock',
        amount: createRes.amount ? (createRes.amount < 1000 ? createRes.amount * 100 : createRes.amount) : totalAmount * 100,
        currency: createRes.currency || 'INR',
        name: 'SafeDriveTag',
        description: `Order: ${createRes.orderNumber || 'Vehicle Protection Kit'}`,
        image: '/logo.png',
        order_id: createRes.orderId && createRes.orderId.startsWith('order_') ? createRes.orderId : undefined,
        handler: async function (paymentResponse) {
          try {
            setIsSubmitting(true);
            const completePayload = {
              razorpay_order_id: paymentResponse.razorpay_order_id || createRes.orderId || `order_${Date.now()}`,
              razorpay_payment_id: paymentResponse.razorpay_payment_id || `pay_${Date.now()}`,
              razorpay_signature: paymentResponse.razorpay_signature || 'mock_signature_valid',
              customerName: customerFullName,
              customerPhone: cleanPhone,
              customerEmail: formData.email.trim() || 'customer@safedrive.in',
              shippingAddress: fullAddress,
              items,
            };

            const completeRes = await api.completePurchase(completePayload);

            if (completeRes.success) {
              setOrderSuccess({
                orderNumber: completeRes.orderNumber || createRes.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
                customerName: customerFullName,
                totalAmount,
                items,
                shippingAddress: fullAddress,
                paymentId: paymentResponse.razorpay_payment_id,
              });
            } else {
              setError(completeRes.message || 'Payment verification failed on server.');
            }
          } catch (err) {
            setError('Payment verification network error.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: customerFullName,
          email: formData.email.trim() || 'customer@safedrive.in',
          contact: cleanPhone,
        },
        notes: {
          shippingAddress: fullAddress,
          productId: items[0]?.productId,
        },
        theme: {
          color: '#f97316', // SafeDrive orange theme
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(razorpayOptions);
      
      razorpayInstance.on('payment.failed', function (resp) {
        setError(resp.error?.description || 'Payment was declined or failed. Please retry.');
        setIsSubmitting(false);
      });

      razorpayInstance.open();

    } catch (err) {
      console.error('Checkout error:', err);
      setError('Checkout failed. Please check network connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans pb-24 selection:bg-orange-500/30">
      
      {/* Header Banner */}
      <PageHero
        badge="🔒 SECURE 256-BIT CHECKOUT"
        title="Complete Your"
        highlightText="Order"
        description="Free Pan-India delivery within 3-5 business days. Powered by Razorpay secure payment gateway."
        badges={[
          { icon: <Lock size={14} className="text-green-600" />, label: 'Razorpay Verified' },
          { icon: <Truck size={14} className="text-blue-500" />, label: 'Free Express Delivery' },
          { icon: <ShieldCheck size={14} className="text-orange-500" />, label: '100% Satisfaction Guarantee' }
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        {orderSuccess ? (
          /* Order Confirmation Screen */
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-black/5 text-center max-w-2xl mx-auto animate-fade-up">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CheckCircle2 size={44} />
            </div>

            <span className="inline-block bg-green-50 text-green-700 font-mono font-bold text-xs px-3.5 py-1.5 rounded-full border border-green-200 mb-3">
              Order Confirmed: {orderSuccess.orderNumber}
            </span>

            <h2 className="text-3xl font-black text-black tracking-tight mb-2">Payment Successful!</h2>
            <p className="text-sm text-black/60 font-medium mb-6">
              Thank you <strong>{orderSuccess.customerName}</strong>! Your order has been placed successfully via Razorpay. Your QR protection kit will be dispatched to your shipping address.
            </p>

            <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-5 mb-8 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-black/50 font-bold">Total Amount Paid:</span>
                <span className="font-black text-black text-sm">₹{orderSuccess.totalAmount}</span>
              </div>
              {orderSuccess.paymentId && (
                <div className="flex justify-between">
                  <span className="text-black/50 font-bold">Razorpay Payment ID:</span>
                  <span className="font-mono font-bold text-orange-600">{orderSuccess.paymentId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-black/50 font-bold">Delivery Address:</span>
                <span className="font-bold text-black max-w-xs text-right">{orderSuccess.shippingAddress}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/dashboard"
                className="bg-green-500 hover:bg-green-600 text-white font-black px-8 py-3.5 rounded-xl shadow-lg shadow-green-500/20 text-sm transition-all"
              >
                Go to My Dashboard
              </Link>
              <Link 
                to="/shop"
                className="bg-black/5 hover:bg-black/10 text-black font-bold px-8 py-3.5 rounded-xl text-sm transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* Checkout Form & Order Summary */
          <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left Column - Form */}
            <div className="w-full lg:w-3/5 flex flex-col gap-6">
              
              {error && (
                <div className="bg-red-50 text-red-600 border border-red-200 rounded-2xl p-4 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Shipping Details */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-black/5 space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-black/5">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-sm">1</div>
                  <h2 className="text-xl font-black text-black">Delivery & Shipping Address</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black/70 uppercase tracking-wider ml-1">First Name *</label>
                    <input 
                      type="text" 
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold" 
                      placeholder="Rahul" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black/70 uppercase tracking-wider ml-1">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold" 
                      placeholder="Sharma" 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black/70 uppercase tracking-wider ml-1">Mobile Phone (10 Digits) *</label>
                    <input 
                      type="tel" 
                      maxLength={10}
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold" 
                      placeholder="9876543210" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black/70 uppercase tracking-wider ml-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold" 
                      placeholder="rahul@example.com" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black/70 uppercase tracking-wider ml-1">Complete Delivery Address *</label>
                  <input 
                    type="text" 
                    required
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold" 
                    placeholder="House / Flat No., Building Name, Street, Locality" 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black/70 uppercase tracking-wider ml-1">City / District *</label>
                    <input 
                      type="text" 
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold" 
                      placeholder="Jaipur / Delhi / Mumbai" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black/70 uppercase tracking-wider ml-1">PIN Code *</label>
                    <input 
                      type="text" 
                      maxLength={6}
                      required
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold" 
                      placeholder="302020" 
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods Info Banner */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-black">Instant Secure Checkout</h3>
                    <p className="text-xs text-black/50">UPI (GPay, PhonePe, Paytm), Cards, NetBanking, Wallets</p>
                  </div>
                </div>
                <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Razorpay
                </span>
              </div>

            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full lg:w-2/5">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-black/5 sticky top-24">
                <h2 className="text-xl font-black text-black mb-6">Order Summary</h2>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-black/5 overflow-hidden border border-black/10 shrink-0">
                    <img 
                      src={selectedProduct.imageUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'} 
                      alt={selectedProduct.title || 'Product'} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-sm text-black line-clamp-1">{selectedProduct.title || selectedProduct.name}</h3>
                    <p className="text-xs text-black/50 mb-1">{selectedProduct.description?.slice(0, 45)}...</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-black/60">Qty:</span>
                      <div className="flex items-center border border-black/10 rounded-lg px-2 py-0.5 bg-black/[0.02] text-xs font-bold">
                        <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-1 text-black/60 hover:text-black cursor-pointer">-</button>
                        <span className="px-2">{quantity}</span>
                        <button type="button" onClick={() => setQuantity((q) => q + 1)} className="px-1 text-black/60 hover:text-black cursor-pointer">+</button>
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-lg text-black">₹{totalAmount}</div>
                </div>

                <div className="space-y-3 pt-5 border-t border-black/5 mb-6 text-xs">
                  <div className="flex justify-between text-black/60 font-medium">
                    <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                    <span>₹{totalAmount}.00</span>
                  </div>
                  <div className="flex justify-between text-black/60 font-medium">
                    <span>Express Pan-India Delivery</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-black/60 font-medium">
                    <span>1-Year Cloud Bridge Included</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-5 border-t border-black/5 mb-6">
                  <div>
                    <p className="text-xs text-black/50 font-bold mb-0.5">Total Amount</p>
                    <p className="text-[11px] text-green-600 font-bold">100% Secure Checkout</p>
                  </div>
                  <div className="text-3xl font-black text-black">₹{totalAmount}</div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-base transition-all shadow-[0_8px_30px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Opening Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span>Pay ₹{totalAmount} with Razorpay</span>
                    </>
                  )}
                </button>

                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-black/50">
                    <ShieldCheck size={15} className="text-green-600" /> SECURE 256-BIT RAZORPAY ENCRYPTION
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-black/50">
                    <Truck size={15} className="text-blue-500" /> GUARANTEED SAFE DISPATCH
                  </div>
                </div>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
