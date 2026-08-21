import React, { useState } from 'react';
import { Lock, CreditCard, ArrowRight, ShieldCheck, Truck, CheckCircle, Smartphone, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const [method, setMethod] = useState('upi');

  return (
    <div className="min-h-screen bg-white font-sans pb-24 pt-24">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-black mb-2">Secure Checkout</h1>
          <p className="text-black/50 font-medium flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-green-500" /> End-to-end encrypted 256-bit security
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Column - Form */}
          <div className="w-full lg:w-3/5 flex flex-col gap-8">
            
            {/* Step 1: Shipping */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-black/5">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black/5">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-sm">1</div>
                <h2 className="text-xl font-black text-black">Shipping Details</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60 uppercase tracking-wider ml-1">First Name</label>
                  <input type="text" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60 uppercase tracking-wider ml-1">Last Name</label>
                  <input type="text" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all" placeholder="Doe" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-black/60 uppercase tracking-wider ml-1">Email Address</label>
                  <input type="email" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all" placeholder="john@example.com" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-black/60 uppercase tracking-wider ml-1">Shipping Address</label>
                  <input type="text" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all" placeholder="House/Flat No., Building Name, Street" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60 uppercase tracking-wider ml-1">City</label>
                  <input type="text" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all" placeholder="City" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60 uppercase tracking-wider ml-1">PIN Code</label>
                  <input type="text" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all" placeholder="000000" />
                </div>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-black/5">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black/5">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-sm">2</div>
                <h2 className="text-xl font-black text-black">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', icon: <Smartphone className="w-5 h-5 text-black/60" /> },
                  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard className="w-5 h-5 text-black/60" /> },
                  { id: 'cod', label: 'Cash on Delivery (COD)', icon: <Banknote className="w-5 h-5 text-black/60" /> },
                ].map(m => (
                  <div 
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all ${method === m.id ? 'border-orange-500 bg-orange-50' : 'border-black/5 bg-white hover:border-black/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${method === m.id ? 'border-orange-500' : 'border-black/20'}`}>
                        {method === m.id && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                      </div>
                      <span className="font-bold text-black">{m.label}</span>
                    </div>
                    <div className="text-black/40 shrink-0">{m.icon}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-black/10/50 border border-black/5 sticky top-24">
              <h2 className="text-xl font-black text-black mb-6">Order Summary</h2>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl bg-black/5 overflow-hidden border border-black/10">
                  <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80" alt="Product" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-black">SafeDrive Car Tag</h3>
                  <p className="text-sm text-black/50 mb-1">Pack of 2 Premium QR Stickers</p>
                  <p className="font-bold text-orange-600">Qty: 1</p>
                </div>
                <div className="font-black text-lg text-black">₹399</div>
              </div>

              <div className="space-y-3 pt-6 border-t border-black/5 mb-6">
                <div className="flex justify-between text-black/60 text-sm font-medium">
                  <span>Subtotal</span>
                  <span>₹399.00</span>
                </div>
                <div className="flex justify-between text-black/60 text-sm font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-black/60 text-sm font-medium">
                  <span>Taxes (Included)</span>
                  <span>₹0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-6 border-t border-black/5 mb-8">
                <div>
                  <p className="text-sm text-black/50 font-bold mb-1">Total Due</p>
                  <p className="text-xs text-green-600 font-bold">You saved ₹100 on this order!</p>
                </div>
                <div className="text-4xl font-black text-black">₹399</div>
              </div>

              <button className="w-full bg-green-500 text-white py-4 rounded-xl font-black text-lg hover:bg-green-600 transition-all shadow-[0_8px_30px_rgba(34,197,94,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2">
                <Lock size={18} /> Place Order
              </button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-black/50">
                  <ShieldCheck size={16} className="text-black/40" /> SECURE 256-BIT SSL ENCRYPTION
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-black/50">
                  <Truck size={16} className="text-black/40" /> GUARANTEED SAFE DELIVERY
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
