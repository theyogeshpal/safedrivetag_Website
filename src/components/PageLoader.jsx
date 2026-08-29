import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function PageLoader({ text = 'Loading...', fullScreen = true }) {
  if (!fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center gap-3">
        <RefreshCw size={28} className="text-[#fb641b] animate-spin" style={{ animationDuration: '1.2s' }} />
        <p className="text-xs font-bold text-[#1a2a4a]">{text}</p>
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
