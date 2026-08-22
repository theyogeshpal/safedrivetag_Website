import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, LayoutDashboard, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
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
    { to: '/about', label: 'About' },
    { to: '/shop', label: 'Store' },
    { to: '/contact', label: 'Contact' },
  ];

  const isHome = path === '/';

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 md:py-4' : (isHome ? 'bg-transparent py-4 md:py-6' : 'bg-white py-4 md:py-6')}`}>
      <div className="max-w-7xl mx-auto px-5 md:px-6 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-50">
          <img src="/logo.png" alt="SafeDriveTag Logo" className="h-8 sm:h-11 w-auto object-contain" />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-bold transition-all px-4 py-2 rounded-full ${
                path === to 
                  ? 'bg-orange-50 text-orange-600 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.2)]' 
                  : 'text-black/70 hover:text-black hover:bg-black/5'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4 relative z-50">
          
          {/* Auth State Button */}
          {currentUser ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 bg-orange-50 hover:bg-orange-100 text-orange-950 px-4 py-2 rounded-full font-bold text-sm border border-orange-200/80 shadow-sm transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>My Dashboard</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-black/5 py-2 z-50 animate-fade-up">
                  <div className="px-4 py-2.5 border-b border-black/5">
                    <p className="text-xs text-black/50 font-bold uppercase tracking-wider">Logged In As</p>
                    <p className="text-sm font-black text-black truncate">{currentUser.name || 'Owner'}</p>
                    <p className="text-xs text-black/60 font-medium">+91 {currentUser.phone}</p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-black/80 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <LayoutDashboard size={16} /> My Tags Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="hidden md:flex items-center gap-2 text-black/80 hover:text-black font-bold text-sm px-4 py-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer border border-transparent hover:border-black/5"
            >
              <LogIn size={16} className="text-orange-500" />
              <span>Login</span>
            </button>
          )}

          {/* Buy Tag CTA */}
          <div className="hidden md:flex items-center">
            <Link to="/shop" className="bg-green-500 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:bg-green-600 transition-colors">
              Buy Safety Tag
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-black p-1.5 rounded-xl hover:bg-black/5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-[290px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
          <span className="font-black text-lg text-black">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="text-black/60 hover:text-black">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col gap-2 p-6 flex-1 overflow-y-auto">
          
          {/* User Account Info on Mobile */}
          {currentUser ? (
            <div className="bg-orange-50/80 border border-orange-100 rounded-2xl p-4 mb-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-sm">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-black text-black text-sm">{currentUser.name || 'Owner'}</p>
                  <p className="text-xs text-black/60 font-medium">+91 {currentUser.phone}</p>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="w-full bg-orange-500 text-white text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <LayoutDashboard size={14} /> Open My Tags Dashboard
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                openLoginModal();
              }}
              className="w-full bg-orange-50 text-orange-600 border border-orange-200 text-sm font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-2 cursor-pointer shadow-sm"
            >
              <LogIn size={17} /> Owner Login / My Tags
            </button>
          )}

          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`text-base font-bold py-3 px-4 rounded-xl transition-colors ${path === to ? 'bg-orange-50 text-orange-600' : 'text-black/70 hover:bg-black/5 hover:text-black'}`}
            >
              {label}
            </Link>
          ))}

          {currentUser && (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="text-left text-sm font-bold text-red-600 py-3 px-4 rounded-xl hover:bg-red-50 flex items-center gap-2 mt-2 cursor-pointer"
            >
              <LogOut size={16} /> Logout Account
            </button>
          )}
          
          <div className="mt-auto pt-6 border-t border-black/5">
            <Link 
              to="/shop" 
              onClick={() => setMenuOpen(false)}
              className="bg-green-500 text-white px-6 py-3.5 rounded-xl font-bold text-base text-center block shadow-[0_4px_15px_rgba(34,197,94,0.3)]"
            >
              Buy Safety Tag
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
