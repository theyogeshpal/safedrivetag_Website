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
    { to: '/shop', label: 'Store' },
    { to: '/contact', label: 'Contact' },
  ];

  const isHome = path === '/';

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 md:py-4' : (isHome ? 'bg-transparent py-4 md:py-6' : 'bg-white py-4 md:py-6')}`}>
      <div className="max-w-7xl mx-auto px-5 md:px-6 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-50">
          <img src="/logo.jpg" alt="SafeDriveTag Logo" className="h-9 sm:h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
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
        <div className="flex items-center gap-3 md:gap-5 relative z-50">
          
          <div className="hidden md:flex items-center">
            <Link to="/shop" className="bg-green-500 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:bg-green-600 transition-colors">
              Buy Safety Tag
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

      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
          <span className="font-black text-lg text-black">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="text-black/60 hover:text-black">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col gap-2 p-6 flex-1 overflow-y-auto">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-base font-bold py-3.5 px-5 rounded-xl transition-colors ${path === to ? 'bg-orange-50 text-orange-600' : 'text-black/70 hover:bg-black/5 hover:text-black'}`}
            >
              {label}
            </Link>
          ))}
          
          <div className="mt-auto pt-6 border-t border-black/5">
            <Link to="/shop" className="bg-green-500 text-white px-6 py-3.5 rounded-xl font-bold text-base text-center block shadow-[0_4px_15px_rgba(34,197,94,0.3)]">
              Buy Safety Tag
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
