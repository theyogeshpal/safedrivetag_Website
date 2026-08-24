import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import Logo from './Logo';

export default function Footer() {
  const location = useLocation();
  const isScanPage = location.pathname.startsWith('/scan');

  const FooterLink = ({ to, label, isExternal = false }) => (
    <li>
      {isExternal ? (
        <a href={to} className="inline-block text-gray-400 hover:text-orange-400 transition-colors">
          {label}
        </a>
      ) : (
        <Link to={to} className="inline-block text-gray-400 hover:text-orange-400 transition-colors">
          {label}
        </Link>
      )}
    </li>
  );

  return isScanPage ? (
    <footer className="bg-[#060910] text-gray-500 py-6 text-center text-[10px] font-medium border-t border-white/10">
      <p>Secured by SafeDrive-Tag &copy; {new Date().getFullYear()}</p>
    </footer>
  ) : (
    <footer className="relative bg-[#060910] text-gray-300 pt-16 pb-12 overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 relative z-10">
        
        {/* Brand Column */}
        <div className="col-span-2 lg:col-span-4 pr-0 lg:pr-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto flex sm:inline-flex items-center justify-center mb-6 bg-white p-3 sm:px-4 sm:py-2.5 rounded-2xl sm:rounded-3xl shadow-md border border-white/10 group hover:shadow-lg transition-all"
          >
            <img 
              src="/logos/primary.jpeg" 
              alt="SafeDrive-Tag Logo" 
              className="h-12 sm:h-14 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105" 
              style={{ maxHeight: '56px', width: 'auto' }}
            />
          </Link>
          <p className="text-sm text-gray-400 mb-6 font-medium leading-relaxed max-w-sm">
            SafeDrive-Tag — Smart QR emergency contacts for vehicles. Protect your car, preserve your privacy. Shielding vehicles in wrong parking & emergency situations.
          </p>
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <a href="https://www.instagram.com/safedrivetag/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 text-gray-300 border border-white/10 shadow-2xs flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:-translate-y-1 transition-all">
              <FaInstagram className="w-4 h-4" />
            </a>
            <a href="https://www.facebook.com/safedrivetag" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 text-gray-300 border border-white/10 shadow-2xs flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:-translate-y-1 transition-all">
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a href="https://x.com/safedrivetag" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 text-gray-300 border border-white/10 shadow-2xs flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:-translate-y-1 transition-all">
              <FaXTwitter className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/company/safedrivetag/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 text-gray-300 border border-white/10 shadow-2xs flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:-translate-y-1 transition-all">
              <FaLinkedinIn className="w-4 h-4" />
            </a>
            <a href="https://www.youtube.com/@SafeDriveTag" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 text-gray-300 border border-white/10 shadow-2xs flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:-translate-y-1 transition-all">
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Company Column (Side-by-Side on mobile) */}
        <div className="col-span-1 lg:col-span-2">
          <h4 className="font-extrabold text-white mb-5 uppercase tracking-wider text-xs sm:text-sm">Company</h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <FooterLink to="/about" label="About Us" />
            <FooterLink to="/shop" label="Shop Tags" />
            <FooterLink to="/contact" label="Contact" />
          </ul>
        </div>

        {/* Legal Column (Side-by-Side on mobile) */}
        <div className="col-span-1 lg:col-span-3">
          <h4 className="font-extrabold text-white mb-5 uppercase tracking-wider text-xs sm:text-sm">Legal</h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <FooterLink to="/privacy" label="Privacy Policy" />
            <FooterLink to="/terms" label="Terms of Service" />
            <FooterLink to="/refund" label="Refund Policy" />
            <FooterLink to="/shipping" label="Shipping Info" />
          </ul>
        </div>

        {/* Reach Us Column */}
        <div className="col-span-2 lg:col-span-3">
          <h4 className="font-extrabold text-white mb-5 uppercase tracking-wider text-xs sm:text-sm">Reach Us</h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-orange-400 shrink-0" />
              <a href="mailto:safedrivetag@gmail.com" className="text-gray-400 hover:text-orange-400 transition-colors break-all">safedrivetag@gmail.com</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-orange-400 shrink-0" />
              <a href="tel:+919876543210" className="text-gray-400 hover:text-orange-400 transition-colors">+91 98765 43210</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span className="leading-snug text-gray-400">123 Innovation Drive, Tech Park, India 400001</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 font-medium text-center md:text-left gap-4">
        <p>&copy; {new Date().getFullYear()} SafeDrive-Tag. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
