import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Phone, Car, Shield, AlertTriangle, ShieldCheck, Info, ArrowLeft, Smartphone, QrCode, X, MessageSquare } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default function QRScan() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [activeModal, setActiveModal] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // We could fetch vehicle details or validate the QR here.
  }, [id]);

  const handleAction = (action) => {
    // Dummy actions for frontend simulation
    if (action === 'initiate_call') {
      if(!phoneNumber) return alert("Please enter your number");
      alert(`Backend API called. You will receive a secure masked call on ${phoneNumber} shortly.`);
      setActiveModal(null);
      setPhoneNumber('');
    } else if (action === 'send_whatsapp') {
      const text = encodeURIComponent(`Vehicle ID: ${id}\nMessage: ${message}`);
      window.open(`https://wa.me/910000000000?text=${text}`, '_blank');
      setActiveModal(null);
      setMessage('');
    } else if (action === 'submit_issue') {
      alert(`Issue reported securely for vehicle ${id}.`);
      setActiveModal(null);
      setMessage('');
    } else if (action === 'emergency') {
      alert(`Emergency contacts for vehicle ${id} have been notified!`);
      setActiveModal(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 px-4 font-sans text-black relative">
      <div className="max-w-md mx-auto relative">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 mb-6 hover:text-black transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="pr-4">
            <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">
              Aapne QR scan<br/>kyu kiya?
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Kripya bataye aap kis wajah se<br/>is QR code ko scan kiye hain.
            </p>
          </div>
          {/* Illustration Placeholder */}
          <div className="flex-shrink-0 relative w-24 h-24 bg-orange-100 rounded-2xl flex items-center justify-center overflow-hidden">
             <Smartphone size={40} className="text-orange-500 absolute rotate-[-10deg]" />
             <div className="absolute bg-white p-1 rounded shadow-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <QrCode size={16} className="text-black" />
             </div>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-4 mb-6">
          
          {/* Call Option */}
          <div onClick={() => setActiveModal('call')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Phone size={24} className="text-blue-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-gray-900 text-[15px]">Vehicle Owner se baat karni hai</h3>
              <p className="text-gray-500 text-xs mt-0.5">Owner se directly call par baat karein. <span className="text-blue-600 font-semibold">(Number Masked)</span></p>
            </div>
            <div className="text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>

          {/* WhatsApp Option */}
          <div onClick={() => setActiveModal('whatsapp')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <FaWhatsapp size={24} className="text-green-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-gray-900 text-[15px]">Message bhejna hai</h3>
              <p className="text-gray-500 text-xs mt-0.5">Owner ko WhatsApp par message karein. <span className="text-green-600 font-semibold">(Hidden Identity)</span></p>
            </div>
            <div className="text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>

          {/* Vehicle Issue Option */}
          <div onClick={() => setActiveModal('issue')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Car size={24} className="text-orange-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-gray-900 text-[15px]">Vehicle se related issue hai</h3>
              <p className="text-gray-500 text-xs mt-0.5">Accident, parking, rash driving ya kisi aur issue ki report karein.</p>
            </div>
            <div className="text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>

          {/* General Information Option */}
          <div onClick={() => setActiveModal('info')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Shield size={24} className="text-purple-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-gray-900 text-[15px]">General Information</h3>
              <p className="text-gray-500 text-xs mt-0.5">General information ya koi aur madad chahiye.</p>
            </div>
            <div className="text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>

          {/* Emergency Option */}
          <div onClick={() => setActiveModal('emergency')} className="bg-red-50 p-4 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow mt-6">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-red-600 text-[15px]">Emergency</h3>
              <p className="text-red-500/80 text-xs mt-0.5">Turant madad ke liye yahan tap karein.</p>
            </div>
            <div className="text-red-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>

        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <ShieldCheck size={16} className="text-gray-400" />
          Aapki jankari surakshit hai. Ye seva sirf aapki madad ke liye hai.
        </div>

        {/* Disclaimer Info Box */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-gray-900 text-[14px] mb-2">Dhyan dein</h4>
            <ul className="text-gray-600 text-xs space-y-1.5 list-disc pl-3">
              <li>Galat purpose se use karna kanooni apradh ho sakta hai.</li>
              <li>Sirf genuine reason ke liye hi contact karein.</li>
              <li>Misuse karne par legal action liya ja sakta hai.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Modals for Interactivity */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative animate-fade-up shadow-xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black bg-gray-100 rounded-full p-1">
               <X size={20} />
            </button>
            
            {activeModal === 'call' && (
              <>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                   <Phone size={24} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-black mb-2">Secure Masked Call</h3>
                <p className="text-sm text-gray-500 mb-6">Enter your number to receive a secure bridge call connecting you to the vehicle owner. Your number remains hidden.</p>
                <input 
                  type="tel" 
                  placeholder="Enter your mobile number" 
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 mb-4 focus:border-blue-500 focus:outline-none transition-colors"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <button onClick={() => handleAction('initiate_call')} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                  Initiate Call
                </button>
              </>
            )}

            {activeModal === 'whatsapp' && (
              <>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                   <FaWhatsapp size={24} className="text-green-500" />
                </div>
                <h3 className="text-xl font-black mb-2">Anonymous WhatsApp</h3>
                <p className="text-sm text-gray-500 mb-6">Send an anonymous message to the owner via our secure WhatsApp bot.</p>
                <textarea 
                  placeholder="Type your message here..." 
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 mb-4 focus:border-green-500 focus:outline-none transition-colors resize-none h-24"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={() => handleAction('send_whatsapp')} className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                  Send Message
                </button>
              </>
            )}

            {(activeModal === 'issue' || activeModal === 'info') && (
              <>
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                   <MessageSquare size={24} className="text-orange-500" />
                </div>
                <h3 className="text-xl font-black mb-2">{activeModal === 'issue' ? 'Report Issue' : 'General Info'}</h3>
                <p className="text-sm text-gray-500 mb-6">Please provide details. We will notify the owner immediately.</p>
                <textarea 
                  placeholder="Describe the situation..." 
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 mb-4 focus:border-orange-500 focus:outline-none transition-colors resize-none h-24"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={() => handleAction('submit_issue')} className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                  Submit Report
                </button>
              </>
            )}

            {activeModal === 'emergency' && (
              <>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                   <AlertTriangle size={24} className="text-red-600" />
                </div>
                <h3 className="text-xl font-black mb-2 text-red-600">Emergency Alert</h3>
                <p className="text-sm text-gray-600 mb-6">Are you sure you want to trigger an emergency alert? This will immediately call and notify the owner and their emergency contacts.</p>
                <div className="flex gap-3">
                  <button onClick={() => setActiveModal(null)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => handleAction('emergency')} className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                    Yes, Alert
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
