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
      <p>Secured by SafeDriveTag &copy; {new Date().getFullYear()}</p>
    </footer>
  ) : (
    <footer className="relative bg-[#000000] text-white/80 pt-24 pb-12 overflow-hidden mt-10">
      
      {/* Decorative Wave/Curve at Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 relative z-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 pr-4">
          <Link to="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 border-2 border-white/20 rounded-lg flex items-center justify-center relative bg-[#000000] group-hover:border-orange-500 transition-colors">
              <div className="w-4 h-4 border-2 border-orange-500 rounded-sm transform rotate-45"></div>
              <div className="absolute w-2 h-2 bg-black/20 rounded-full group-hover:bg-white transition-colors"></div>
            </div>
            <div>
              <div className="font-black text-xl text-white leading-none tracking-tight">SafeDrive<span className="text-orange-500">TAG</span></div>
            </div>
          </Link>
          <p className="text-sm text-white/60 mb-6 font-medium leading-relaxed">
            SafeDriveTag — Smart QR emergency contacts for vehicles. Protect your car, preserve your privacy. 🚗 Shielding vehicles in wrong parking & emergency situations.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/safedrivetag/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-orange-500 hover:text-white hover:-translate-y-1 transition-all">
              <FaInstagram className="w-4 h-4" />
            </a>
            <a href="https://www.facebook.com/safedrivetag" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-orange-500 hover:text-white hover:-translate-y-1 transition-all">
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a href="https://x.com/safedrivetag" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-orange-500 hover:text-white hover:-translate-y-1 transition-all">
              <FaXTwitter className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/company/safedrivetag/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-orange-500 hover:text-white hover:-translate-y-1 transition-all">
              <FaLinkedinIn className="w-4 h-4" />
            </a>
            <a href="https://www.youtube.com/@SafeDriveTag" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-orange-500 hover:text-white hover:-translate-y-1 transition-all">
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-1">
          <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Company</h4>
          <ul className="space-y-4 text-sm font-medium">
            <FooterLink to="/about" label="About Us" />
            <FooterLink to="/shop" label="Shop Tags" />
            <FooterLink to="/contact" label="Contact" />
          </ul>
        </div>

        {/* Legal */}
        <div className="lg:col-span-1">
          <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legal</h4>
          <ul className="space-y-4 text-sm font-medium">
            <FooterLink to="/privacy" label="Privacy Policy" />
            <FooterLink to="/terms" label="Terms of Service" />
            <FooterLink to="/refund" label="Refund Policy" />
            <FooterLink to="/shipping" label="Shipping Info" />
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-1">
          <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Reach Us</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-orange-500 shrink-0" />
              <a href="mailto:safedrivetag@gmail.com" className="hover:text-white transition-colors break-all">safedrivetag@gmail.com</a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-orange-500 shrink-0" />
              <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
              <span>123 Innovation Drive, Tech Park, India 400001</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-white/50 font-medium">
        <p>&copy; {new Date().getFullYear()} SafeDriveTag. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
