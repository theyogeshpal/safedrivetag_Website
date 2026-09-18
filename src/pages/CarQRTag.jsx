import React from 'react';
import SEO from '../components/SEO';

const CarQRTag = () => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Car QR Tag",
    "image": "https://safedrivetag.com/safedrivetag-car-qr-tag.webp",
    "description": "Smart QR tag for cars. Anyone can scan to send a parking or emergency alert and connect with you without seeing your personal phone number.",
    "brand": {
      "@type": "Brand",
      "name": "SafeDriveTag"
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <SEO 
        title="Car QR Tag & QR Sticker to Contact Owner Privately | SafeDriveTag"
        description="Get a smart QR tag for your car. Anyone can scan to send a parking or emergency alert and connect with you without seeing your personal phone number."
        url="/car-qr-tag"
        schema={schema}
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Car QR Tag for Private Vehicle Communication</h1>
        
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">What is a Car QR Tag?</h2>
          <p className="text-gray-600 mb-4">
            A Car QR Tag by SafeDriveTag is a smart sticker placed on your vehicle. When someone scans the QR code, they can use the available contact options to reach the owner without publicly displaying the owner's personal contact information.
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

export default CarQRTag;
