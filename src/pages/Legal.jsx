import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, FileText, ArrowLeft, Truck, RefreshCw } from 'lucide-react';

export default function Legal() {
  const location = useLocation();
  const path = location.pathname;

  let contentData = {
    title: '',
    icon: null,
    updatedAt: 'October 15, 2026',
    sections: []
  };

  if (path === '/privacy') {
    contentData.title = 'Privacy Policy';
    contentData.icon = <Shield className="w-8 h-8 text-orange-500" />;
    contentData.sections = [
      {
        heading: "1. Information We Collect",
        body: "We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, and other information you choose to provide."
      },
      {
        heading: "2. How We Use Your Information",
        body: "Our primary goal in collecting your information is to provide you with an enhanced experience when using our SafeDriveTag services. We use the information to connect the QR tag to your emergency contacts, ensure masking of real phone numbers, and provide immediate SMS/WhatsApp alerts when your tag is scanned."
      },
      {
        heading: "3. Data Sharing and Masking",
        body: "Your privacy is our utmost priority. We NEVER share your real phone number with the person scanning your tag. All calls are routed through our secure cloud-telephony bridge. We do not sell, rent, or trade your personal data to third parties for marketing purposes."
      },
      {
        heading: "4. Security",
        body: "We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet or email transmission is ever fully secure or error free."
      }
    ];
  } else if (path === '/terms') {
    contentData.title = 'Terms of Service';
    contentData.icon = <FileText className="w-8 h-8 text-orange-500" />;
    contentData.sections = [
      {
        heading: "1. Acceptance of Terms",
        body: "By purchasing and using a SafeDriveTag, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services or products."
      },
      {
        heading: "2. Service Availability",
        body: "While we strive for 99.9% uptime for our QR scanning and call-routing services, we cannot guarantee uninterrupted access. We are not liable for temporary service outages caused by third-party telecom providers or server maintenance."
      },
      {
        heading: "3. User Responsibilities",
        body: "You are responsible for maintaining accurate emergency contact information in your SafeDriveTag profile. You agree not to use the tag for any unlawful purpose or to impersonate any person or entity."
      },
      {
        heading: "4. Limitation of Liability",
        body: "SafeDriveTag shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of, or inability to access or use, the services."
      }
    ];
  } else if (path === '/refund') {
    contentData.title = 'Refund & Cancellation Policy';
    contentData.icon = <RefreshCw className="w-8 h-8 text-green-500" />;
    contentData.sections = [
      {
        heading: "1. 30-Day Money-Back Guarantee",
        body: "We stand behind the quality of our SafeDriveTags. If you are not completely satisfied with your purchase, you can request a full refund within 30 days of the delivery date."
      },
      {
        heading: "2. Eligibility for Returns",
        body: "To be eligible for a return, the SafeDriveTag must be unused, unpeeled, and in the exact same condition that you received it. It must also be in the original packaging."
      },
      {
        heading: "3. Return Process",
        body: "To initiate a return, please email our support team at support@safedrivetag.com with your Order ID. We will provide you with a return shipping address. Return shipping costs are the responsibility of the customer unless the item arrived defective."
      },
      {
        heading: "4. Refunds",
        body: "Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed to your original method of payment within 5-7 business days."
      }
    ];
  } else if (path === '/shipping') {
    contentData.title = 'Shipping Information';
    contentData.icon = <Truck className="w-8 h-8 text-green-500" />;
    contentData.sections = [
      {
        heading: "1. Processing Times",
        body: "All orders are processed and dispatched within 24-48 hours (excluding weekends and public holidays) after receiving your order confirmation email."
      },
      {
        heading: "2. Shipping Rates & Delivery Estimates",
        body: "We offer FREE standard shipping on all prepaid orders across India. Standard delivery typically takes 3-5 business days depending on your location. Cash on Delivery (COD) orders may incur a nominal handling fee of ₹49."
      },
      {
        heading: "3. Shipment Tracking",
        body: "You will receive a Shipment Confirmation email/SMS containing your tracking number(s) once your order has shipped. The tracking number will be active within 24 hours."
      },
      {
        heading: "4. Missing or Damaged Packages",
        body: "If your order arrives damaged or gets lost in transit, please contact us immediately. We will arrange a free replacement tag to be shipped out to you as quickly as possible."
      }
    ];
  }

  return (
    <div className="bg-[#fcfaf5] min-h-screen pt-32 pb-24 px-6 selection:bg-orange-500/30">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-black/50 hover:text-orange-500 font-bold text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-black/5 p-8 md:p-12 border border-black/5 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center gap-5 mb-10 pb-10 border-b border-black/5">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-black/5 shrink-0">
              {contentData.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight mb-2">
                {contentData.title}
              </h1>
              <p className="text-black/50 font-medium text-sm">
                Last updated: {contentData.updatedAt}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-10">
            {contentData.sections.map((section, idx) => (
              <div key={idx} className="animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <h3 className="text-xl font-black text-black mb-3">
                  {section.heading}
                </h3>
                <p className="text-black/70 leading-relaxed font-medium">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t border-black/5 text-center">
            <p className="text-black/50 text-sm font-medium">
              Have questions about our {contentData.title.toLowerCase()}? <Link to="/contact" className="text-orange-500 hover:underline">Contact our support team</Link>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
