import React from 'react';
import SEO from '../components/SEO';

const FAQ = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <SEO 
        title="Frequently Asked Questions | SafeDriveTag"
        description="Find answers to all your questions about SafeDriveTag smart QR tags, privacy, installation, and more."
        url="/faq"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
        
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2">What is SafeDriveTag?</h2>
            <p className="text-gray-600">SafeDriveTag is a QR-based communication tag for vehicles and luggage. When someone scans the QR code, they can use the available contact options to reach the owner without publicly displaying the owner's personal contact information.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">How does a car QR tag work?</h2>
            <p className="text-gray-600">You apply the sticker to your car. When scanned by any smartphone camera, it opens a secure page where people can contact you regarding parking or emergencies without seeing your phone number.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Does the person scanning need an app?</h2>
            <p className="text-gray-600">No, anyone with a standard smartphone camera can scan the tag and use the web-based communication portal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
