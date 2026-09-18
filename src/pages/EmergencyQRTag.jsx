import React from 'react';
import SEO from '../components/SEO';

const EmergencyQRTag = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <SEO 
        title="Vehicle Emergency QR Tag for Cars & Bikes | SafeDriveTag"
        description="Be prepared for emergencies with a SafeDriveTag emergency QR sticker for your car or bike. Allow fast, secure contact in critical situations."
        url="/vehicle-emergency-qr-tag"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Vehicle Emergency QR Tag</h1>
        
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Emergency Contact Made Simple</h2>
          <p className="text-gray-600 mb-4">
            In situations like an accident, leaving your lights on, or an unlocked vehicle, a vehicle emergency QR tag allows anyone to contact you immediately through a secure scan, protecting your privacy while ensuring your vehicle's safety.
          </p>
        </div>

        {/* Facts Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">SafeDriveTag at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-medium">Product</span>
              <span className="text-gray-900 font-semibold">Smart QR communication tag</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-medium">Available for</span>
              <span className="text-gray-900 font-semibold">Cars, bikes and luggage</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-medium">Primary purpose</span>
              <span className="text-gray-900 font-semibold">Vehicle/luggage owner communication</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-medium">Scan method</span>
              <span className="text-gray-900 font-semibold">QR code</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-medium">App required for scanner</span>
              <span className="text-gray-900 font-semibold">No app required to scan</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-medium">Phone number visibility</span>
              <span className="text-gray-900 font-semibold">Hidden (Privacy Masking)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyQRTag;
