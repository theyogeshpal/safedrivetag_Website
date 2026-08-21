import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/shop', label: 'Shop' },
    { to: '/contact', label: 'Contact' },
  ];

  const isHome = path === '/';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : (isHome ? 'bg-transparent py-6' : 'bg-white py-6')}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="SafeDriveTag Logo" className="h-10 sm:h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-bold transition-colors relative ${path === to ? 'text-orange-500' : 'text-black hover:text-orange-500'}`}
            >
              {label}
              {path === to && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-orange-500 rounded-full"></span>}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center">
          <Link to="/shop" className="bg-green-500 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:bg-green-600 transition-colors">
            Buy Safe Tag
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-black"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-black/5 shadow-xl py-4 px-6 flex flex-col gap-4 md:hidden">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-bold ${path === to ? 'text-orange-500' : 'text-black'}`}
            >
              {label}
            </Link>
          ))}
          <Link to="/shop" className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-sm text-center mt-2 shadow-[0_4px_15px_rgba(34,197,94,0.3)]">
            Buy Safe Tag
          </Link>
        </div>
      )}
    </header>
  );
}
