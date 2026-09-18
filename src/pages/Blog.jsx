import React from 'react';
import SEO from '../components/SEO';

const Blog = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <SEO 
        title="Blog - Guides on Vehicle Safety & QR Communication | SafeDriveTag"
        description="Read our latest guides on smart QR tags, vehicle safety, luggage tracking, and protecting your personal privacy."
        url="/blog"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">SafeDriveTag Blog & Guides</h1>
        <p className="text-lg text-gray-700 mb-8">
          Explore our articles on vehicle safety, parking solutions, and privacy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-2">What Is a Vehicle QR Tag and How Does It Work?</h3>
            <p className="text-gray-600 mb-4">Learn the basics of smart vehicle communication and how QR tags protect your privacy...</p>
            <span className="text-[#fb641b] font-semibold cursor-pointer">Read More &rarr;</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-2">How to Contact a Car Owner Without Knowing Their Phone Number</h3>
            <p className="text-gray-600 mb-4">Discover how QR technology enables private communication for parked vehicles...</p>
            <span className="text-[#fb641b] font-semibold cursor-pointer">Read More &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
