import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const location = useLocation();
  const isScanPage = location.pathname.startsWith('/scan');

  const FooterLink = ({ to, label, isExternal = false }) => (
    <li className="group">
      {isExternal ? (
        <a href={to} className="inline-flex items-center hover:text-orange-500 transition-all duration-300">
          <span className="text-orange-500 opacity-0 -ml-4 w-0 overflow-hidden group-hover:w-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-0 group-hover:mr-1 flex items-center justify-center">
            <ChevronRight className="w-4 h-4 shrink-0" />
          </span>
          {label}
        </a>
      ) : (
        <Link to={to} className="inline-flex items-center hover:text-orange-500 transition-all duration-300">
          <span className="text-orange-500 opacity-0 -ml-4 w-0 overflow-hidden group-hover:w-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-0 group-hover:mr-1 flex items-center justify-center">
            <ChevronRight className="w-4 h-4 shrink-0" />
          </span>
          {label}
        </Link>
      )}
    </li>
  );

  return isScanPage ? (
    <footer className="bg-gray-50 text-gray-400 py-6 text-center text-[10px] font-medium border-t border-gray-200">
      <p>Secured by SafeDrive-Tag &copy; {new Date().getFullYear()}</p>
    </footer>
  ) : (
    <footer className="relative bg-[#FAF9F6] text-gray-700 pt-16 pb-12 overflow-hidden border-t border-gray-200/80">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 relative z-10">
        
        {/* Brand Column */}
        <div className="col-span-2 lg:col-span-4 pr-0 lg:pr-4">
          <Link to="/" className="inline-flex items-center mb-5 group">
            <img 
              src="/logos/primary.jpeg" 
              alt="SafeDrive-Tag Logo" 
              className="h-11 sm:h-12 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>
          <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed max-w-sm">
            SafeDrive-Tag — Smart QR emergency contacts for vehicles. Protect your car, preserve your privacy. 🚗 Shielding vehicles in wrong parking & emergency situations.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/safedrivetag/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white text-gray-700 border border-gray-200 shadow-2xs flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:-translate-y-1 transition-all">
              <FaInstagram className="w-4 h-4" />
            </a>
            <a href="https://www.facebook.com/safedrivetag" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white text-gray-700 border border-gray-200 shadow-2xs flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:-translate-y-1 transition-all">
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a href="https://x.com/safedrivetag" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white text-gray-700 border border-gray-200 shadow-2xs flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:-translate-y-1 transition-all">
              <FaXTwitter className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/company/safedrivetag/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white text-gray-700 border border-gray-200 shadow-2xs flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:-translate-y-1 transition-all">
              <FaLinkedinIn className="w-4 h-4" />
            </a>
            <a href="https://www.youtube.com/@SafeDriveTag" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white text-gray-700 border border-gray-200 shadow-2xs flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:-translate-y-1 transition-all">
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Company Column (Side-by-Side on mobile) */}
        <div className="col-span-1 lg:col-span-2">
          <h4 className="font-extrabold text-gray-950 mb-5 uppercase tracking-wider text-xs sm:text-sm">Company</h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <FooterLink to="/about" label="About Us" />
            <FooterLink to="/shop" label="Shop Tags" />
            <FooterLink to="/contact" label="Contact" />
          </ul>
        </div>

        {/* Legal Column (Side-by-Side on mobile) */}
        <div className="col-span-1 lg:col-span-3">
          <h4 className="font-extrabold text-gray-950 mb-5 uppercase tracking-wider text-xs sm:text-sm">Legal</h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <FooterLink to="/privacy" label="Privacy Policy" />
            <FooterLink to="/terms" label="Terms of Service" />
            <FooterLink to="/refund" label="Refund Policy" />
            <FooterLink to="/shipping" label="Shipping Info" />
          </ul>
        </div>

        {/* Reach Us Column */}
        <div className="col-span-2 lg:col-span-3">
          <h4 className="font-extrabold text-gray-950 mb-5 uppercase tracking-wider text-xs sm:text-sm">Reach Us</h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-orange-500 shrink-0" />
              <a href="mailto:safedrivetag@gmail.com" className="text-gray-600 hover:text-orange-600 transition-colors">safedrivetag@gmail.com</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-orange-500 shrink-0" />
              <a href="tel:+919876543210" className="text-gray-600 hover:text-orange-600 transition-colors">+91 98765 43210</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span className="leading-snug text-gray-600">123 Innovation Drive, Tech Park, India 400001</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-14 pt-8 border-t border-gray-200/80 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 font-medium">
        <p>&copy; {new Date().getFullYear()} SafeDrive-Tag. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-orange-600 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-orange-600 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
