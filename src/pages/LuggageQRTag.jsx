import React from 'react';
import SEO from '../components/SEO';

const LuggageQRTag = () => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Luggage QR Tag",
    "image": "https://safedrivetag.com/safedrivetag-luggage-qr-tag.webp",
    "description": "Smart luggage QR tag that helps people contact the owner if a bag is lost or found, without publicly exposing personal contact details.",
    "brand": {
      "@type": "Brand",
      "name": "SafeDriveTag"
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <SEO 
        title="Luggage QR Tag for Lost Bags & Easy Owner Contact | SafeDriveTag"
        description="Smart luggage QR tag that helps people contact the owner if a bag is lost or found, without publicly exposing personal contact details."
        url="/luggage-qr-tag"
        schema={schema}
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Smart QR Luggage Tag for Lost & Found Bags</h1>
        
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">What is a Luggage QR Tag?</h2>
          <p className="text-gray-600 mb-4">
            A Luggage QR Tag by SafeDriveTag helps travelers secure their bags. When someone scans the QR code on a lost bag, they can contact the owner safely without publicly exposing personal contact details.
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

export default LuggageQRTag;
