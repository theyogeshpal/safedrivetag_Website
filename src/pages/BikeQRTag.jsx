import React from 'react';
import SEO from '../components/SEO';

const BikeQRTag = () => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Bike QR Tag",
    "image": "https://safedrivetag.com/safedrivetag-bike-qr-tag.webp",
    "description": "Smart QR tag for bikes and motorcycles. Let people alert or contact you when needed without exposing your personal phone number.",
    "brand": {
      "@type": "Brand",
      "name": "SafeDriveTag"
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <SEO 
        title="Bike QR Tag & QR Sticker for Private Owner Contact | SafeDriveTag"
        description="Smart QR tag for bikes and motorcycles. Let people alert or contact you when needed without exposing your personal phone number."
        url="/bike-qr-tag"
        schema={schema}
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Smart QR Tag for Bikes & Motorcycles</h1>
        
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">What is a Bike QR Tag?</h2>
          <p className="text-gray-600 mb-4">
            SafeDriveTag for bikes is a smart communication tag. When someone scans the QR code on your motorcycle or bike, they can use the available contact options to reach you without publicly displaying your personal contact information.
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

export default BikeQRTag;
