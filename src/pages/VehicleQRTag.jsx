import React from 'react';
import SEO from '../components/SEO';

const VehicleQRTag = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <SEO 
        title="Vehicle QR Tag for Cars, Bikes & Luggage | SafeDriveTag"
        description="SafeDriveTag smart QR tags for cars, bikes and luggage. Let anyone contact the owner through a secure QR scan without revealing personal phone numbers."
        url="/vehicle-qr-tag"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Smart QR Tags for Cars, Bikes & Luggage</h1>
        <p className="text-lg text-gray-700 mb-8">
          Connect with the owner when needed without publicly exposing personal contact details.
        </p>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">What is a Vehicle QR Tag?</h2>
          <p className="text-gray-600 mb-4">
            A Vehicle QR Tag is a digital sticker for your car or bike. It allows anyone to scan the QR code to contact you regarding wrong parking, emergencies, or other important situations while keeping your personal phone number completely private.
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

export default VehicleQRTag;
