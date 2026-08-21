import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Legal() {
  const location = useLocation();
  const path = location.pathname;

  let title = '';
  let content = [];

  if (path === '/privacy') {
    title = 'Privacy Policy';
    content = [
      'We value your privacy. This policy outlines how we collect, use, and protect your personal information.',
      '1. Information Collection: We only collect information necessary to provide our services, such as shipping details and contact information.',
      '2. Data Usage: Your data is used exclusively for fulfilling orders and communicating with you regarding your SafeDriveTag.',
      '3. Data Protection: We employ industry-standard security measures to ensure your data remains safe and is never sold to third parties.'
    ];
  } else if (path === '/terms') {
    title = 'Terms of Service';
    content = [
      'Welcome to SafeDriveTag. By using our website and products, you agree to the following terms.',
      '1. Acceptance of Terms: By accessing this website, you are agreeing to be bound by these Terms and Conditions of Use.',
      '2. Use License: Permission is granted to temporarily download one copy of the materials on SafeDriveTag\'s website for personal, non-commercial transitory viewing only.',
      '3. Disclaimer: The materials on SafeDriveTag\'s website are provided "as is". We make no warranties, expressed or implied.'
    ];
  } else if (path === '/refund') {
    title = 'Refund Policy';
    content = [
      'We want you to be completely satisfied with your SafeDriveTag.',
      '1. 60-Day Returns: If you are not satisfied, you may return the product within 60 days of purchase for a full refund.',
      '2. Condition: Returned items must be in their original packaging and in unused condition.',
      '3. Process: To initiate a return, please contact our support team with your order number.'
    ];
  } else if (path === '/shipping') {
    title = 'Shipping Info';
    content = [
      'Here is everything you need to know about how we ship your SafeDriveTag.',
      '1. Processing Time: Orders are processed within 1-2 business days.',
      '2. Delivery Time: Standard shipping takes 3-5 business days. Express shipping is available at checkout.',
      '3. Tracking: Once your order ships, you will receive a confirmation email with tracking information.'
    ];
  } else {
    title = 'Legal Information';
    content = ['Please select a specific legal document from the footer.'];
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-black/10">
        <h1 className="text-4xl font-black text-black mb-8 pb-4 border-b border-black/10">{title}</h1>
        <div className="space-y-6 text-black/80 font-medium leading-relaxed">
          {content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
