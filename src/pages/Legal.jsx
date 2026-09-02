import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  ArrowLeft, 
  Truck, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  Mail, 
  MapPin, 
  HelpCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import PageHero from '../components/PageHero';

export default function Legal() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const currentYear = new Date().getFullYear();

  const tabs = [
    { path: '/privacy', label: 'Privacy Policy', icon: Shield },
    { path: '/terms', label: 'Terms of Service', icon: FileText },
    { path: '/refund', label: 'Refund & Cancellation', icon: RefreshCw },
    { path: '/shipping', label: 'Shipping Policy', icon: Truck },
  ];

  let contentData = {
    title: '',
    icon: null,
    badge: '⚖️ LEGAL & COMPLIANCE',
    updatedAt: `January 2026`,
    intro: '',
    sections: []
  };

  if (path === '/privacy') {
    contentData.title = 'Privacy Policy';
    contentData.icon = <Shield className="w-8 h-8 text-orange-500" />;
    contentData.badge = '🔒 100% TWO-WAY PRIVACY & DATA PROTECTION';
    contentData.intro = 'At safedrivetag, your privacy and personal safety are the foundational pillars of our platform. This Privacy Policy outlines how your personal information is securely collected, processed, and safeguarded when using our smart QR tags, mobile web bridges, and emergency routing infrastructure.';
    contentData.sections = [
      {
        heading: "1. Information We Collect",
        body: "We only collect the minimum essential information required to operate our emergency contact bridge and authenticate your vehicle tags.",
        points: [
          "Account Registration: Your primary mobile number, full name, email address, and optional password/OTP authentication records.",
          "Tag & Vehicle Profile: Assigned QR Tag ID, vehicle registration number (e.g. DL 01 AB 1234), vehicle category (Car, Bike, SUV, Luggage), and custom emergency driver notes.",
          "Emergency Contact Contacts: Primary and secondary emergency phone numbers designated by you to receive alerts.",
          "Cloud Communication Logs: Timestamp of scans, masked call connection durations, and delivery status of automated SMS / WhatsApp notifications."
        ]
      },
      {
        heading: "2. Proprietary Two-Way Number Masking",
        body: "safedrivetag operates on zero-knowledge telephony bridges designed to eliminate spam, harassment, and phone number leakage.",
        points: [
          "Complete Caller Anonymity: When a bystander scans your QR code and initiates a call, their phone number is never revealed to you.",
          "Complete Owner Anonymity: Your personal mobile number is never visible to the person scanning your tag. All voice calls are routed through a secure cloud virtual relay.",
          "WhatsApp Privacy Alerts: When someone triggers a Wrong Parking or Emergency alert, notifications arrive from the official verified safedrivetag business gateway."
        ]
      },
      {
        heading: "3. How We Use and Protect Your Data",
        body: "Your information is used exclusively to facilitate vehicle safety and emergency communication.",
        points: [
          "We NEVER sell, trade, rent, or lease your personal data or phone number to any third-party marketing companies, advertisers, or lead brokers.",
          "Data is utilized solely to bridge voice calls, send SMS/WhatsApp alerts, process store orders, and verify tag ownership.",
          "All communication pipelines are secured with high-grade TLS 1.3 in-transit encryption and AES-256 encrypted database storage."
        ]
      },
      {
        heading: "4. User Control & Data Deletion",
        body: "You maintain full autonomy and sovereignty over your vehicle profiles and emergency contact numbers.",
        points: [
          "Real-Time Updates: You can update your emergency contact numbers, notification preferences, and vehicle details 24/7 directly via your Owner Dashboard.",
          "Instant Tag Deactivation: If you sell your vehicle or misplace a luggage tag, you can temporarily pause or permanently transfer the tag in one click.",
          "Account & Data Erasure: You can request complete permanent deletion of your account and communication records by contacting our Data Grievance Officer at safedrivetag@gmail.com."
        ]
      },
      {
        heading: "5. Compliance & Grievance Redressal",
        body: "In accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection (DPDP) Act, our appointed Grievance Officer can be contacted at: safedrivetag@gmail.com | safedrivetag Legal Compliance Cell, India."
      }
    ];
  } else if (path === '/terms') {
    contentData.title = 'Terms of Service';
    contentData.icon = <FileText className="w-8 h-8 text-orange-500" />;
    contentData.badge = '📜 USER TERMS & SERVICE AGREEMENT';
    contentData.intro = 'These Terms of Service govern your access to and usage of safedrivetag products, QR codes, website (safedrivetag.in / safedrivetag.com), and associated cloud telephony bridge services. By purchasing, activating, or scanning a tag, you accept these terms in full.';
    contentData.sections = [
      {
        heading: "1. Acceptance & Service Description",
        body: "safedrivetag provides intelligent QR emergency contact stickers, metallic luggage tags, and cloud communication bridges that allow vehicle owners and travelers to remain reachable without sharing their private phone numbers."
      },
      {
        heading: "2. Account Registration & User Obligations",
        body: "To activate and manage your tags, you agree to:",
        points: [
          "Provide accurate and up-to-date emergency phone numbers during tag registration.",
          "Maintain sole responsibility for maintaining the accuracy of secondary emergency contact numbers.",
          "Refrain from registering vehicle numbers or property that you do not own or are not legally authorized to manage."
        ]
      },
      {
        heading: "3. Acceptable Use Policy",
        body: "The safedrivetag network is engineered for vehicle safety, parking assistance, and emergency response. You strictly agree not to:",
        points: [
          "Use the platform for harassment, stalking, spamming, unsolicited marketing, or abusive communications.",
          "Attempt to reverse-engineer, decompile, or tamper with our QR routing algorithms or server endpoints.",
          "Transmit false SOS emergency alarms or fraudulent distress signals."
        ]
      },
      {
        heading: "4. Telephony Infrastructure & Service Availability",
        body: "We strive to maintain a 99.9% uptime target across our cloud routing and notification servers. However, voice call connectivity and SMS delivery speed may depend on third-party telecom carrier networks (Jio, Airtel, Vi, BSNL) and local cellular coverage.",
        points: [
          "safedrivetag is not liable for carrier-level network downtimes or cellular outages beyond our direct operational control.",
          "In high-traffic emergency events, WhatsApp and SMS alerts are dispatched concurrently to ensure redundancy."
        ]
      },
      {
        heading: "5. Intellectual Property & Brand Trademarks",
        body: "The safedrivetag name, logo, sticker graphic artwork, user interface designs, and proprietary QR routing workflows are the exclusive intellectual property of safedrivetag. Unauthorized duplication or commercial imitation is strictly prohibited."
      },
      {
        heading: "6. Limitation of Liability & Governing Law",
        body: "safedrivetag operates as a communication medium and does not assume custody of your vehicle or property. safedrivetag is not liable for vehicle damages caused by third parties, towing, or parking violations. These terms are governed under the Laws of India, subject to exclusive court jurisdiction in India."
      }
    ];
  } else if (path === '/refund') {
    contentData.title = 'Refund & Cancellation Policy';
    contentData.icon = <RefreshCw className="w-8 h-8 text-green-500" />;
    contentData.badge = '🔄 100% SATISFACTION & 30-DAY GUARANTEE';
    contentData.intro = 'We take immense pride in crafting the highest quality weather proof vehicle safety tags. If you are not completely satisfied with your order or if your tag arrives damaged, our transparent refund and replacement policy ensures complete peace of mind.';
    contentData.sections = [
      {
        heading: "1. 7-Day Money-Back Guarantee",
        body: "If for any reason you are not satisfied with your safedrivetag physical kit, you can request a return and refund within 30 days from the date of delivery."
      },
      {
        heading: "2. Free Replacement for Damaged Items",
        body: "If your tag arrives folded, torn, or defective during postal transit, we will dispatch a brand-new replacement kit at zero extra cost within 24-48 hours.",
        points: [
          "Simply send a photo of the damaged package/tag via Email to safedrivetag@gmail.com.",
          "No complicated return shipping is required for defective tags — your replacement will be dispatched immediately."
        ]
      },
      {
        heading: "3. Order Cancellation Before Dispatch",
        body: "You can cancel your order any time prior to shipment dispatch for an immediate 100% full refund.",
        points: [
          "To cancel, email safedrivetag@gmail.com.",
          "Prepaid cancellations are refunded immediately to your original payment method (UPI, Card, Net Banking)."
        ]
      },
      {
        heading: "4. Return Eligibility & Process",
        body: "To be eligible for a standard return:",
        points: [
          "The tag must remain unpeeled, unused, not yet registered or activated, and intact in its original backing sleeve and packaging.",
          "Once your return package is received at our fulfillment center, our quality team inspects it within 24-48 hours.",
          "Approved refunds are automatically credited back to your original source of payment within 5 to 7 working days."
        ]
      },
      {
        heading: "5. Digital Tag & PDF Downloads",
        body: "Instant digital printable QR tags and downloadable passes are delivered immediately. If you encounter any generation error or formatting issue, our tech team will regenerate your digital pass immediately."
      }
    ];
  } else if (path === '/shipping') {
    contentData.title = 'Shipping & Delivery Policy';
    contentData.icon = <Truck className="w-8 h-8 text-green-500" />;
    contentData.badge = '🚚 PAN-INDIA FREE FAST COURIER DELIVERY';
    contentData.intro = 'We partner with India’s leading express logistics networks to ensure your safedrivetag safety kit arrives safely at your doorstep in top condition.';
    contentData.sections = [
      {
        heading: "1. Free Express Shipping Across India",
        body: "We offer 100% Free Standard Courier Shipping on all prepaid orders across 28 states and 8 Union Territories in India with minimum order of 299 and must be prepaid for cash on delivery shiping charges may apply."
      },
      {
        heading: "2. Dispatch & Delivery Timelines",
        body: "All physical kit orders are packed and dispatched swiftly from our central fulfillment hubs:",
        points: [
          "Dispatch Time: Orders placed before 2:00 PM IST are dispatched on the same business day. All other orders ship within 24 hours.",
          "Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune): 2 to 4 business days.",
          "Tier-2 & Tier-3 Cities and Towns: 3 to 5 business days.",
          "Remote & Hill Stations: 5 to 7 business days via India Post Speed Post."
        ]
      },
      {
        heading: "3. Premium Courier Partners",
        body: "We ship via trusted logistics carriers including BlueDart, Delhivery, DTDC, Xpressbees, Shadowfax, and India Post Speed Post."
      },
      {
        heading: "4. Live SMS & WhatsApp Tracking",
        body: "As soon as your package is scanned at the courier depot, you will receive an SMS and WhatsApp notification containing your live AWB tracking link to track delivery progress in real time."
      },
      {
        heading: "5. Safe & Tamper-Proof Packaging",
        body: "Every safedrivetag kit is sealed in industrial moisture-proof, bubble-padded envelopes with protective rigid card backing to prevent any bending or folding during transit."
      },
      {
        heading: "6. Non-Delivery & Address Corrections",
        body: "If you entered an incomplete address or need to modify your delivery location, please message us immediately at safedrivetag@gmail.com before dispatch to update the courier manifest."
      }
    ];
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24 font-sans selection:bg-orange-500/30 selection:text-orange-900">
      
      {/* Hero Banner */}
      <PageHero
        badge={contentData.badge}
        title={contentData.title}
        description={contentData.intro}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        
        {/* Navigation Bar / Policy Tabs Switcher */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-xl shadow-black/5 border border-gray-200/80 mb-6 sm:mb-8 grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = path === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => navigate(tab.path)}
                className={`flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/80'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-orange-500'} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Back Link */}
        <div className="mb-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold text-xs transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
            <Clock size={13} className="text-gray-400" /> Last Updated: {contentData.updatedAt}
          </span>
        </div>

        {/* Main Card Content */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-6 sm:p-10 border border-gray-200/90 relative overflow-hidden">
          
          {/* Header Title with Icon */}
          <div className="flex items-center gap-3.5 pb-6 mb-8 border-b border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 shadow-inner">
              {contentData.icon}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">{contentData.title}</h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Official safedrivetag Legal & Customer Protection Document</p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8 sm:space-y-10">
            {contentData.sections.map((section, idx) => (
              <div key={idx} className="animate-fade-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <h3 className="text-base sm:text-lg font-black text-gray-950 mb-2.5 flex items-start sm:items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-orange-500 shrink-0 mt-0.5 sm:mt-0" />
                  <span>{section.heading}</span>
                </h3>
                
                {section.body && (
                  <p className="text-gray-600 leading-relaxed font-medium text-xs sm:text-sm pl-7 sm:pl-7">
                    {section.body}
                  </p>
                )}

                {section.points && section.points.length > 0 && (
                  <ul className="mt-3 space-y-2 pl-7 sm:pl-7">
                    {section.points.map((point, pIdx) => (
                      <li key={pIdx} className="text-gray-600 font-medium text-xs sm:text-sm flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Dedicated Grievance & Help Callout Card */}
          <div className="mt-12 bg-gradient-to-r from-orange-50/70 via-amber-50/50 to-orange-50/70 border border-orange-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <HelpCircle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-950">Have questions about our {contentData.title.toLowerCase()}?</h4>
                <p className="text-xs text-gray-600 font-medium mt-0.5">Our support team and grievance cell are available 24/7 to assist you.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link 
                to="/contact" 
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-black px-5 py-2.5 rounded-xl text-center shadow-md transition-all whitespace-nowrap"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Quick Contact Line */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 font-medium gap-3">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-orange-500" />
              <span>Email: <a href="mailto:safedrivetag@gmail.com" className="text-orange-600 font-bold hover:underline">safedrivetag@gmail.com</a></span>
            </div>
            <div>
              &copy; {currentYear} safedrivetag. All rights reserved.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


