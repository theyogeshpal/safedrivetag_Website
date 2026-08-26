import React from 'react';

export default function PageLoader({ text = 'Loading...', fullScreen = true }) {
  if (!fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-orange-500 rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-gray-500 font-medium">{text}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="w-10 h-10 border-4 border-gray-100 border-t-[#2874f0] rounded-full animate-spin mb-4 shadow-sm"></div>
      <p className="text-sm font-medium text-gray-600 tracking-wide">{text}</p>
    </div>
  );
}
