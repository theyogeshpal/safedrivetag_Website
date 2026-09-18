import React from 'react';
import SEO from '../components/SEO';

const ParkingQRTag = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <SEO 
        title="Parking QR Tag — Contact Car Owner Without Sharing Phone Number"
        description="Need to contact a parked car owner? Scan a SafeDriveTag parking QR sticker to alert them about wrong parking or blocking without revealing their phone number."
        url="/parking-qr-tag"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact a Parked Vehicle Owner with a QR Scan</h1>
        
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">How can I contact a parked car owner?</h2>
          <p className="text-gray-600 mb-4">
            If a car is blocking your driveway or parked wrongly, simply scan the SafeDriveTag QR sticker on their vehicle. You can alert them immediately without needing an app, and their personal phone number stays hidden.
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

export default ParkingQRTag;
