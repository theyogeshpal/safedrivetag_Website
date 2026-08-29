import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function PageLoader({ text = 'Loading...', fullScreen = true }) {
  if (!fullScreen) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center gap-3">
        <RefreshCw size={32} className="text-[#fb641b] animate-spin" style={{ animationDuration: '1.2s' }} />
        <h3 className="text-sm font-bold text-[#1a2a4a]">{text}</h3>
        <p className="text-[11px] text-gray-500">Please wait while we secure your connection</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm gap-3">
      <RefreshCw size={36} className="text-[#fb641b] animate-spin shadow-sm" style={{ animationDuration: '1.2s' }} />
      <p className="text-sm font-bold text-[#1a2a4a] tracking-wide">{text}</p>
    </div>
  );
}
