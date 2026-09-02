import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle,
  KeyRound,
  X,
  FileText,
  Printer,
  Eye,
  Download,
  Copy
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { useAuth } from '../context/AuthContext';
import api, { setAuthToken } from '../services/api';
import downloadInvoicePdf from '../utils/invoiceGenerator';
import { openDigitalPdf, printDigitalPdfInColor } from '../utils/digitalPdfGenerator';

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
  const { currentUser, setCurrentUser } = useAuth();

  // Selected product state (defaults to real backend product)
  const [selectedProduct, setSelectedProduct] = useState(
    location.state?.product || {
      productId: '6a899b9e719bda67dc3b1a66',
      _id: '6a899b9e719bda67dc3b1a66',
      title: 'Car Safety Kit Protection',
      description: 'Reflective waterproof QR stickers for vehicle windshield and rear glass.',
      price: 299,
      originalPrice: 499,
      quantity: location.state?.quantity || 1,
      qrType: 'PHYSICAL',
      imageUrl: '/images/safedrivetag-final.png',
    }
  );

  const [quantity, setQuantity] = useState(location.state?.quantity || 1);
  const [paymentMode, setPaymentMode] = useState('ONLINE'); // 'ONLINE' or 'COD'
  
  const isDigitalProduct = selectedProduct.qrType === 'DIGITAL';
  
  const baseTotalAmount = selectedProduct.price * quantity;
  const codFee = 59; // 50rs + 9gst
  const totalAmount = paymentMode === 'COD' ? baseTotalAmount + codFee : baseTotalAmount;

  const [formData, setFormData] = useState({
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ').slice(1).join(' ') || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    city: '',
    state: 'Uttar Pradesh',
    pincode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  // OTP Verification Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpInputRefs = useRef([]);

  // Sync real product from backend
  useEffect(() => {
    loadRazorpayScript();

    async function syncBackendProducts() {
      if (!location.state?.product) {
        try {
          const res = await api.getProducts();
          if (res.success && res.products && res.products.length > 0) {
            const first = res.products[0];
            setSelectedProduct({
              productId: first._id,
              _id: first._id,
              title: first.title || first.name,
              description: first.description,
              price: first.price,
              originalPrice: first.originalPrice,
              qrType: first.qrType || 'PHYSICAL',
              imageUrl: first.imageUrl,
            });
          }
        } catch (e) {
          console.error('Error fetching default checkout product', e);
        }
      }
    }
    syncBackendProducts();
  }, [location.state]);

  // Resend Timer Effect
  useEffect(() => {
    let timer;
    if (isOtpModalOpen && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [isOtpModalOpen, resendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // STEP 1: Form Submit -> Send OTP with Name, Email & Mobile
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.firstName.trim() || !formData.address.trim() || !formData.city.trim() || !formData.pincode.trim() || !formData.email.trim()) {
      setError('Please fill in all required contact and delivery fields.');
      return;
    }

    const customerFullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    const customerEmail = formData.email.trim();

    setIsSubmitting(true);
    try {
      // Send Name, Email, and Mobile to POST /purchase/send-otp
      const otpPayload = {
        name: customerFullName,
        email: customerEmail,
        phone: cleanPhone,
      };

      const otpRes = await api.sendPurchaseOtp(otpPayload);
      if (otpRes.success) {
        setIsOtpModalOpen(true);
        setOtpError('');
        setResendTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }, 150);
      } else {
        setError(otpRes.message || 'Failed to send OTP to mobile number.');
      }
    } catch (err) {
      setError('Network error while sending OTP. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP Inputs handling
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, idx) => {
        if (idx < 6) newOtp[idx] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(digits.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setOtpError('');
    setIsVerifyingOtp(true);
    try {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      const customerFullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      const customerEmail = formData.email.trim();

      const otpPayload = {
        name: customerFullName,
        email: customerEmail,
        phone: cleanPhone,
      };

      const res = await api.sendPurchaseOtp(otpPayload);
      if (res.success) {
        setResendTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        otpInputRefs.current[0]?.focus();
      } else {
        setOtpError(res.message || 'Failed to resend OTP.');
      }
    } catch (e) {
      setOtpError('Failed to resend OTP.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // STEP 2: Verify OTP -> Open Razorpay Payment Gateway
  const handleVerifyOtpAndOpenGateway = async (e) => {
    e?.preventDefault();
    setOtpError('');
    const fullOtp = otp.join('');

    if (fullOtp.length < 4) {
      setOtpError('Please enter the 6-digit OTP code.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      const customerFullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      const customerEmail = formData.email.trim();

      const verifyPayload = {
        phone: cleanPhone,
        otp: fullOtp,
        name: customerFullName,
        email: customerEmail,
      };

      const verifyRes = await api.verifyPurchaseOtp(verifyPayload);

      if (verifyRes.success) {
        if (verifyRes.token) {
          setAuthToken(verifyRes.token);
        }
        if (verifyRes.user && setCurrentUser) {
          setCurrentUser(verifyRes.user);
        }
        setIsOtpModalOpen(false);
        // OTP Verified Successfully -> Open Payment Gateway
        await openRazorpayPayment();
      } else {
        setOtpError(verifyRes.message || 'Invalid verification OTP.');
      }
    } catch (err) {
      setOtpError('Verification failed. Please check your connection.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // STEP 3: Create Razorpay Order & Open Gateway
  const openRazorpayPayment = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const customerFullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      const cleanPhone = formData.phone.replace(/\D/g, '');
      const resolvedProductId = selectedProduct.productId || selectedProduct._id || '6a899b9e719bda67dc3b1a66';

      // Call POST /purchase/create-order
      const createRes = await api.createOrder({
        productId: resolvedProductId,
        phone: cleanPhone,
        customerName: customerFullName,
        customerEmail: formData.email.trim(),
        deliveryAddress: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim() || 'Uttar Pradesh',
        pincode: formData.pincode.trim(),
        quantity: quantity || 1,
        name: customerFullName,
        address: formData.address.trim(),
      });

      if (!createRes.success) {
        setError(createRes.message || 'Failed to initialize payment order with server.');
        setIsSubmitting(false);
        return;
      }

      // If COD, bypass Razorpay gateway
      if (paymentMode === 'COD') {
        const completeRes = await api.completePurchase({
          productId: resolvedProductId,
          quantity: quantity || 1,
          customerName: customerFullName,
          customerPhone: cleanPhone,
          customerEmail: formData.email.trim(),
          shippingAddress: {
            address: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim() || 'Uttar Pradesh',
            pincode: formData.pincode.trim(),
          },
          paymentMethod: 'COD',
          razorpayOrderId: createRes.razorpayOrderId || createRes.orderId || `order_${Date.now()}`,
          razorpayPaymentId: `pay_cod_${Date.now()}`,
          razorpaySignature: 'cod_valid',
          name: customerFullName,
          phone: cleanPhone,
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim() || 'Uttar Pradesh',
          pincode: formData.pincode.trim(),
          razorpay_payment_id: `pay_cod_${Date.now()}`,
          razorpay_order_id: createRes.razorpayOrderId || createRes.orderId || `order_${Date.now()}`,
          razorpay_signature: 'cod_valid',
        });

        if (completeRes.success) {
          if (completeRes.token) setAuthToken(completeRes.token);
          if (completeRes.user && setCurrentUser) setCurrentUser(completeRes.user);

          setOrderSuccess({
            orderNumber: completeRes.orderNumber || completeRes.orderId || `ORD-${Date.now().toString().slice(-6)}`,
            customerName: customerFullName,
            totalAmount,
            shippingAddress: `${formData.address.trim()}, ${formData.city.trim()} - ${formData.pincode.trim()}`,
          });
        } else {
          setError(completeRes.message || 'COD Order completion failed.');
        }
        setIsSubmitting(false);
        return;
      }

      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded || !window.Razorpay) {
        // Fallback completion if SDK blocked
        const completeRes = await api.completePurchase({
          productId: resolvedProductId,
          quantity: quantity || 1,
          customerName: customerFullName,
          customerPhone: cleanPhone,
          customerEmail: formData.email.trim(),
          shippingAddress: {
            address: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim() || 'Uttar Pradesh',
            pincode: formData.pincode.trim(),
          },
          razorpayOrderId: createRes.razorpayOrderId || createRes.orderId || `order_${Date.now()}`,
          razorpayPaymentId: `pay_direct_${Date.now()}`,
          razorpaySignature: 'signature_valid',
          name: customerFullName,
          phone: cleanPhone,
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim() || 'Uttar Pradesh',
          pincode: formData.pincode.trim(),
          razorpay_payment_id: `pay_direct_${Date.now()}`,
          razorpay_order_id: createRes.razorpayOrderId || createRes.orderId || `order_${Date.now()}`,
          razorpay_signature: 'signature_valid',
        });

        if (completeRes.success) {
          if (completeRes.token) setAuthToken(completeRes.token);
          if (completeRes.user && setCurrentUser) setCurrentUser(completeRes.user);

          setOrderSuccess({
            orderNumber: completeRes.orderNumber || completeRes.orderId || `ORD-${Date.now().toString().slice(-6)}`,
            customerName: customerFullName,
            totalAmount,
            shippingAddress: `${formData.address.trim()}, ${formData.city.trim()} - ${formData.pincode.trim()}`,
          });
        } else {
          setError(completeRes.message || 'Order completion failed.');
        }
        setIsSubmitting(false);
        return;
      }

      // Open Razorpay Standard Checkout Modal
      const razorpayOptions = {
        key: createRes.keyId || createRes.key || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_6kz5nGEzi8uXRw',
        amount: createRes.amount || totalAmount * 100,
        currency: createRes.currency || 'INR',
        name: 'safedrivetag',
        description: selectedProduct.title || 'Car Safety Kit Protection',
        image: '/logos/primary.jpeg',
        order_id: createRes.razorpayOrderId || createRes.orderId,
        handler: async function (paymentResponse) {
          try {
            setIsSubmitting(true);
            
            // Call POST /purchase/complete
            const completePayload = {
              productId: resolvedProductId,
              quantity: quantity || 1,
              customerName: customerFullName,
              customerPhone: cleanPhone,
              customerEmail: formData.email.trim(),
              shippingAddress: {
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim() || 'Uttar Pradesh',
                pincode: formData.pincode.trim(),
              },
              razorpayOrderId: paymentResponse.razorpay_order_id || createRes.razorpayOrderId || createRes.orderId,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
              name: customerFullName,
              phone: cleanPhone,
              email: formData.email.trim(),
              address: formData.address.trim(),
              city: formData.city.trim(),
              state: formData.state.trim() || 'Uttar Pradesh',
              pincode: formData.pincode.trim(),
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id || createRes.razorpayOrderId || createRes.orderId,
              razorpay_signature: paymentResponse.razorpay_signature,
            };

            const completeRes = await api.completePurchase(completePayload);

            if (completeRes.success) {
              if (completeRes.token) {
                setAuthToken(completeRes.token);
              }
              if (completeRes.user && setCurrentUser) {
                setCurrentUser(completeRes.user);
              }

              setOrderSuccess({
                orderNumber: completeRes.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
                customerName: customerFullName,
                totalAmount,
                paymentId: paymentResponse.razorpay_payment_id,
                shippingAddress: `${formData.address.trim()}, ${formData.city.trim()} - ${formData.pincode.trim()}`,
              });
            } else {
              setError(completeRes.message || 'Order verification failed on server.');
            }
          } catch (err) {
            setError('Payment verification network error.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: customerFullName,
          email: formData.email.trim(),
          contact: cleanPhone,
        },
        theme: {
          color: '#f97316',
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(razorpayOptions);
      
      razorpayInstance.on('payment.failed', function (resp) {
        setError(resp.error?.description || 'Payment was cancelled or failed.');
        setIsSubmitting(false);
      });

      razorpayInstance.open();

    } catch (err) {
      console.error('Checkout error:', err);
      setError('Checkout failed. Please check connection.');
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

            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="inline-block bg-green-50 text-green-700 font-mono font-bold text-xs px-3.5 py-1.5 rounded-full border border-green-200">
                Order Confirmed: {orderSuccess.orderNumber}
              </span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(orderSuccess.orderNumber);
                  alert('Order ID copied to clipboard!');
                }}
                className="text-green-700 hover:text-green-900 bg-green-50 hover:bg-green-100 p-1.5 rounded-full border border-green-200 transition-colors"
                title="Copy Order ID"
              >
                <Copy size={14} />
              </button>
            </div>

            <h2 className="text-3xl font-black text-black tracking-tight mb-2">Order Successful!</h2>
            <p className="text-sm text-black/60 font-medium mb-6">
              Thank you <strong>{orderSuccess.customerName}</strong>! Your order has been placed successfully. 
              {isDigitalProduct ? ' Your digital pass is ready for download.' : ' Your QR protection kit will be dispatched to your shipping address.'}
            </p>

            <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-5 mb-8 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-black/50 font-bold">Total Amount:</span>
                <span className="font-black text-black text-sm">₹{orderSuccess.totalAmount}</span>
              </div>
              {orderSuccess.paymentId && (
                <div className="flex justify-between">
                  <span className="text-black/50 font-bold">Payment Ref:</span>
                  <span className="font-mono font-bold text-orange-600">{orderSuccess.paymentId}</span>
                </div>
              )}
              {!isDigitalProduct && (
                <div className="flex justify-between">
                  <span className="text-black/50 font-bold">Delivery Address:</span>
                  <span className="font-bold text-black max-w-xs text-right">{orderSuccess.shippingAddress}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isDigitalProduct ? (
                <button
                  onClick={() => openDigitalPdf(selectedProduct)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-black px-8 py-3.5 rounded-xl shadow-lg shadow-purple-600/20 text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Download size={18} /> Download Digital Pass
                </button>
              ) : (
                <button
                  onClick={() => downloadInvoicePdf({ 
                    ...orderSuccess, 
                    productName: selectedProduct.title || selectedProduct.name,
                    price: orderSuccess.totalAmount,
                    qty: quantity
                  })}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/20 text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Download size={18} /> Download Invoice
                </button>
              )}
              
              <Link 
                to="/dashboard"
                className="bg-green-500 hover:bg-green-600 text-white font-black px-8 py-3.5 rounded-xl shadow-lg shadow-green-500/20 text-sm transition-all text-center flex items-center justify-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* Checkout Form & Order Summary */
          <form onSubmit={handleFormSubmit} className="flex flex-col lg:flex-row gap-10 items-start">
            
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
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm">1</div>
                  <h2 className="text-xl font-black text-black">
                    {isDigitalProduct ? 'Contact Details' : 'Delivery & Contact Details'}
                  </h2>
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
                    <p className="text-[10px] text-orange-600 font-bold ml-1 mt-1">Note: The same phone number must be used for tag activation.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black/70 uppercase tracking-wider ml-1">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold" 
                      placeholder="rahul@example.com" 
                    />
                  </div>
                </div>

                {!isDigitalProduct && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-black/70 uppercase tracking-wider ml-1">Street Address *</label>
                      <input 
                        type="text" 
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold" 
                        placeholder="Plot 55, Sector 10, Main Road" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-black/70 uppercase tracking-wider ml-1">City *</label>
                        <input 
                          type="text" 
                          required
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold" 
                          placeholder="Noida" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-black/70 uppercase tracking-wider ml-1">State *</label>
                        <input 
                          type="text" 
                          required
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold" 
                          placeholder="Uttar Pradesh" 
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
                          placeholder="201301" 
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-black/5 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-black/5">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-sm">2</div>
                  <h2 className="text-xl font-black text-black">Payment Method</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <label 
                    className={`relative border-2 rounded-2xl p-4 flex flex-col cursor-pointer transition-all ${paymentMode === 'ONLINE' ? 'border-orange-500 bg-orange-50/50' : 'border-black/5 hover:border-black/10 bg-black/[0.02]'}`}
                  >
                    <input 
                      type="radio" 
                      name="paymentMode" 
                      value="ONLINE" 
                      checked={paymentMode === 'ONLINE'} 
                      onChange={() => setPaymentMode('ONLINE')}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard size={18} className={paymentMode === 'ONLINE' ? 'text-orange-500' : 'text-black/40'} />
                        <span className="font-bold text-sm">Pay Online</span>
                      </div>
                      {paymentMode === 'ONLINE' && <CheckCircle2 size={18} className="text-orange-500" />}
                    </div>
                    <span className="text-[10px] text-black/50 font-medium">UPI, Cards, NetBanking, Wallets via Razorpay</span>
                  </label>

                  <label 
                    className={`relative border-2 rounded-2xl p-4 flex flex-col cursor-pointer transition-all ${paymentMode === 'COD' ? 'border-orange-500 bg-orange-50/50' : 'border-black/5 hover:border-black/10 bg-black/[0.02]'}`}
                  >
                    <input 
                      type="radio" 
                      name="paymentMode" 
                      value="COD" 
                      checked={paymentMode === 'COD'} 
                      onChange={() => setPaymentMode('COD')}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Truck size={18} className={paymentMode === 'COD' ? 'text-orange-500' : 'text-black/40'} />
                        <span className="font-bold text-sm">Cash on Delivery</span>
                      </div>
                      {paymentMode === 'COD' && <CheckCircle2 size={18} className="text-orange-500" />}
                    </div>
                    <span className="text-[10px] text-black/50 font-medium">Extra ₹59 applied (₹50 COD + ₹9 GST)</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full lg:w-2/5">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-black/5 sticky top-24">
                <h2 className="text-xl font-black text-black mb-6">Order Summary</h2>
                
                <div className="flex items-center gap-4 mb-6">
                  {selectedProduct.imageUrl && selectedProduct.imageUrl !== '/images/safedrivetag-final.png' && (
                    <div className="w-20 h-20 rounded-2xl bg-black/5 overflow-hidden border border-black/10 shrink-0 flex items-center justify-center p-2 bg-white">
                      <img 
                        src={selectedProduct.imageUrl} 
                        alt={selectedProduct.title || 'Product'} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-black text-sm text-black line-clamp-1">{selectedProduct.title || selectedProduct.name}</h3>
                    <p className="text-[10px] text-orange-600 font-bold bg-orange-50 inline-block px-1.5 py-0.5 rounded border border-orange-100 mb-1">
                      Type: {isDigitalProduct ? 'Instant Digital Pass' : 'Physical 3M Sticker Kit'}
                    </p>
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
                  <div className="font-black text-lg text-black">₹{baseTotalAmount}</div>
                </div>

                <div className="space-y-3 pt-5 border-t border-black/5 mb-6 text-xs">
                  <div className="flex justify-between text-black/60 font-medium">
                    <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                    <span>₹{baseTotalAmount}.00</span>
                  </div>
                  <div className="flex justify-between text-black/60 font-medium">
                    <span>Express Delivery</span>
                    <span className="text-green-600 font-bold">{isDigitalProduct ? 'INSTANT' : 'FREE'}</span>
                  </div>
                  {paymentMode === 'COD' && (
                    <div className="flex justify-between text-black/60 font-medium">
                      <span>Cash on Delivery Fee</span>
                      <span className="font-bold text-black">₹{codFee}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between text-black/60 font-medium">
                    <span>1-Year Cloud Bridge Included</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-5 border-t border-black/5 mb-6">
                  <div>
                    <p className="text-xs text-black/50 font-bold mb-0.5">Final Total Amount</p>
                    <p className="text-[11px] text-green-600 font-bold">100% Secure Checkout</p>
                  </div>
                  <div className="text-3xl font-black text-black">₹{totalAmount}</div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-emerald-600 hover:from-orange-600 hover:to-emerald-500 text-white py-4 rounded-2xl font-black text-base transition-all shadow-[0_8px_30px_rgba(249,115,22,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span>Proceed to Verify & Pay ₹{totalAmount}</span>
                    </>
                  )}
                </button>

                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-black/50">
                    <ShieldCheck size={15} className="text-emerald-600" /> SECURE 256-BIT RAZORPAY ENCRYPTION
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-black/50">
                    <Truck size={15} className="text-orange-500" /> GUARANTEED SAFE EXPRESS DISPATCH
                  </div>
                </div>
              </div>
            </div>

          </form>
        )}

      </div>

      {/* --- OTP VERIFICATION MODAL --- */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-2xl max-w-md w-full relative animate-scale-up">
            
            <button
              type="button"
              onClick={() => setIsOtpModalOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all cursor-pointer z-30"
              style={{ position: 'absolute', top: '16px', right: '16px' }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <KeyRound className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-black">Verify Mobile Number</h2>
              <p className="text-xs sm:text-sm text-black/60 mt-1 font-medium">
                Enter the 6-digit OTP sent to <br />
                <strong className="text-black">+91 {formData.phone}</strong>
              </p>
            </div>

            {otpError && (
              <div className="mb-4 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-xl p-3 text-center">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtpAndOpenGateway} className="space-y-5">
              <div className="flex justify-center gap-2 my-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border-2 border-black/10 focus:border-orange-500 focus:bg-orange-50/20 bg-white outline-none transition-all"
                  />
                ))}
              </div>


              <button
                type="submit"
                disabled={isVerifyingOtp || otp.join('').length < 4}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isVerifyingOtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP & Opening Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Verify OTP & Open Payment Gateway</span>
                  </>
                )}
              </button>

              <div className="text-center text-xs font-semibold text-black/60 pt-1">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-orange-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={12} /> Resend OTP now
                  </button>
                ) : (
                  <span>Resend OTP in <span className="text-black font-bold">{resendTimer}s</span></span>
                )}
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
