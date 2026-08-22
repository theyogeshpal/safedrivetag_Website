import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export default function PageLoader({ text = 'Loading SafeDrive Secure Portal...', fullScreen = true }) {
  if (!fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in font-sans">
        <div className="relative w-14 h-14 mb-4">
          <div className="absolute inset-0 rounded-2xl bg-orange-500/20 animate-ping" />
          <div className="relative w-14 h-14 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Shield className="w-7 h-7 text-white animate-pulse" />
          </div>
        </div>
        <p className="text-xs sm:text-sm font-bold text-gray-700">{text}</p>
        <span className="text-[11px] text-gray-400 font-medium mt-1">256-Bit Encrypted Connection</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F5]/90 backdrop-blur-md font-sans">
      <div className="relative flex flex-col items-center">
        
        {/* Animated Shield with Pulse Rings */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-orange-500/20 animate-ping duration-1000" />
          <div className="absolute -inset-2 rounded-3xl border-2 border-orange-500/30 animate-spin duration-3000" />
          <div className="relative w-20 h-20 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/35">
            <Shield className="w-10 h-10 text-white animate-bounce" />
          </div>
        </div>

        {/* Text & Status */}
        <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
          <span>SafeDrive</span>
          <span className="text-orange-600">Secure Bridge</span>
        </h3>
        <p className="text-xs sm:text-sm font-bold text-gray-600 mt-1 mb-3">{text}</p>

        {/* Loading Progress Bar */}
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-orange-500 via-amber-400 to-green-500 rounded-full animate-indeterminate" />
        </div>
        
        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold mt-3">
          <Sparkles size={12} className="text-orange-500" /> Official Privacy Protection System
        </div>
      </div>
    </div>
  );
}
