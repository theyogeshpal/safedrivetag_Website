import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  LogIn, 
  LayoutDashboard, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  ShoppingBag,
  PhoneCall,
  Package,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { currentUser, openLoginModal, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 15);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/shop', label: 'Store', badge: 'Popular' },
    { to: '/contact', label: 'Contact' },
  ];

  const isHome = path === '/';

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-200 pointer-events-auto bg-white border-b border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-50">
        
        {/* ======================================================== */}
        {/* 1. BRAND LOGO */}
        {/* ======================================================== */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center shrink-0 relative z-50 cursor-pointer group py-0.5">
            <img 
              src="/logos/primary.jpeg" 
              alt="SafeDrive-Tag" 
              className="h-16 sm:h-20 md:h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              style={{ maxHeight: '78px', width: 'auto' }}
            />
          </Link>
        </div>

        {/* ======================================================== */}
        {/* 2. DESKTOP CENTER NAVIGATION (Clean Links with Active Underline) */}
        {/* ======================================================== */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 relative z-50">
          {links.map(({ to, label, badge }) => {
            const isActive = path === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative py-2 text-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-gray-950 font-extrabold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-500 after:rounded-full'
                    : 'text-gray-600 hover:text-gray-950 font-semibold'
                }`}
              >
                <span>{label}</span>
                {badge && (
                  <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full shadow-2xs tracking-wide">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ======================================================== */}
        {/* 3. RIGHT ACTIONS & USER MENU */}
        {/* ======================================================== */}
        <div className="flex items-center gap-4 sm:gap-6 relative z-50">
          
          {/* User Logged In Profile Pill */}
          {currentUser ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 text-gray-900 pl-2 pr-3.5 py-1.5 rounded-xl font-bold text-xs border border-gray-200 shadow-2xs transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <p className="text-[11px] font-black text-gray-900 truncate max-w-[90px]">
                    {currentUser.name ? currentUser.name.split(' ')[0] : 'Owner'}
                  </p>
                  <p className="text-[9px] text-orange-600 font-bold flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Protected
                  </p>
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu Card */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2.5 z-50 animate-fade-up">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl mb-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Signed In Account</p>
                    <p className="text-sm font-black text-gray-900 truncate mt-0.5">{currentUser.name || 'Vehicle Owner'}</p>
                    <p className="text-xs text-gray-500 font-medium font-mono">+91 {currentUser.phone}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard/tags"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-[#2874f0] transition-colors"
                    >
                      <LayoutDashboard size={15} className="text-[#2874f0]" />
                      <span>My Vehicle Tags</span>
                    </Link>

                    <Link
                      to="/dashboard/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-[#2874f0] transition-colors"
                    >
                      <Package size={15} className="text-amber-500" />
                      <span>My Orders & Passes</span>
                    </Link>

                    <Link
                      to="/dashboard/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-[#2874f0] transition-colors"
                    >
                      <User size={15} className="text-indigo-500" />
                      <span>Profile & Settings</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="hidden md:flex items-center gap-1.5 text-gray-700 hover:text-gray-950 font-bold text-sm px-2 py-1.5 transition-colors cursor-pointer"
            >
              <User size={18} className="text-gray-500" />
              <span>Login</span>
            </button>
          )}

          {/* Clean Buy Safety Tag CTA Button */}
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <ShoppingBag size={17} className="text-white" />
            <span>Buy Safety Tag</span>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="md:hidden text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. MOBILE MENU OVERLAY & SIDEBAR */}
      {/* ======================================================== */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center">
            <img 
              src="/logos/primary.jpeg" 
              alt="SafeDrive-Tag" 
              className="h-10 sm:h-11 w-auto object-contain" 
              style={{ maxHeight: '46px', width: 'auto' }}
            />
          </div>
          <button 
            onClick={() => setMenuOpen(false)} 
            className="text-gray-400 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col gap-2 p-5 flex-1 overflow-y-auto">
          
          {/* User Account Info on Mobile */}
          {currentUser ? (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 rounded-2xl p-4 mb-2 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">{currentUser.name || 'Owner'}</p>
                  <p className="text-xs text-gray-500 font-mono">+91 {currentUser.phone}</p>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="w-full bg-[#2874f0] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <LayoutDashboard size={14} /> Open My Dashboard
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                openLoginModal();
              }}
              className="w-full bg-orange-50 text-orange-600 border border-orange-200 text-xs font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-2 cursor-pointer shadow-2xs hover:bg-orange-100 transition-colors"
            >
              <LogIn size={16} /> Owner Login / My Tags
            </button>
          )}

          {/* Navigation Links */}
          <div className="space-y-1">
            {links.map(({ to, label, badge }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-bold py-2.5 px-3.5 rounded-xl transition-colors flex items-center justify-between ${
                  path === to 
                    ? 'bg-orange-50 text-orange-600 font-black' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>{label}</span>
                {badge && (
                  <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {currentUser && (
            <div className="pt-2 border-t border-gray-100 mt-2">
              <Link
                to="/dashboard/orders"
                onClick={() => setMenuOpen(false)}
                className="text-xs font-bold text-gray-700 py-2 px-3.5 rounded-xl hover:bg-gray-50 flex items-center gap-2.5"
              >
                <Package size={15} className="text-amber-500" /> My Orders & Passes
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-xs font-bold text-red-600 py-2 px-3.5 rounded-xl hover:bg-red-50 flex items-center gap-2.5 mt-1 cursor-pointer"
              >
                <LogOut size={15} /> Logout Account
              </button>
            </div>
          )}
          
          {/* Bottom Actions */}
          <div className="mt-auto pt-4 border-t border-gray-100 space-y-2.5">
            <Link 
              to="/shop" 
              onClick={() => setMenuOpen(false)}
              className="bg-gradient-to-r from-orange-500 via-orange-600 to-emerald-600 text-white px-5 py-3 rounded-xl font-black text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
            >
              <ShieldCheck size={16} />
              <span>Buy Safety Tag</span>
            </Link>
          </div>

        </div>
      </div>

    </header>
  );
}
