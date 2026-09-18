import React from 'react';
import SEO from '../components/SEO';

const PrivateContact = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <SEO 
        title="How to Contact a Vehicle Owner Without Sharing Your Phone Number | SafeDriveTag"
        description="Learn how to contact a vehicle owner privately using a SafeDriveTag QR tag without sharing your personal phone number."
        url="/contact-vehicle-owner-privately"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact a Vehicle Owner Privately Using a QR Tag</h1>
        
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">How it works</h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-700">
            <li><strong>Scan the SafeDriveTag QR code</strong> on the vehicle.</li>
            <li>A secure contact page opens in your browser.</li>
            <li>Select the reason for contact (e.g., parking alert, emergency).</li>
            <li>Use the available communication option.</li>
            <li>The system handles the communication according to SafeDriveTag's privacy mechanism, masking your personal details.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PrivateContact;
