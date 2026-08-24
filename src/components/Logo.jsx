import React from 'react';

export default function Logo({ 
  theme = 'auto', // 'auto' | 'light' | 'dark'
  className = 'h-9 w-auto',
  iconOnly = false,
  iconClass = 'h-full width-auto aspect-square'
}) {
  const isDark = theme === 'dark';

  return (
    <div className={'inline-flex items-center gap-2.5 select-none ' + className}>
      {/* Modern Aesthetic Shield & Vehicle Vector Mark */}
      <svg 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={"h-full w-auto aspect-square shrink-0 filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105 " + iconClass}
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff781f" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="glowRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path 
          d="M24 3L42 9.5V22C42 33.2 34.3 43.1 24 45.8C13.7 43.1 6 33.2 6 22V9.5L24 3Z" 
          fill="url(#shieldGrad)" 
        />
        
        <path 
          d="M24 4.5L40 10.5V22C40 32.1 33.1 41.2 24 43.9V4.5Z" 
          fill="url(#glowRing)" 
        />

        <path 
          d="M17 14.5C19.1 13 21.5 12.2 24 12.2C26.5 12.2 28.9 13 31 14.5" 
          stroke="#ffffff" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeOpacity="0.95" 
        />
        <path 
          d="M20 18C21.2 17.2 22.6 16.7 24 16.7C25.4 16.7 26.8 17.2 28 18" 
          stroke="#ffffff" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeOpacity="0.95" 
        />

        <circle cx="24" cy="20.5" r="1.75" fill="#ffffff" />


        <g transform="translate(0, 1.5)">
          <path 
            d="M18.5 28.5L21.2 24H26.8L29.5 28.5H18.5Z" 
            fill="#ffffff" 
            fillOpacity="0.95" 
          />
          <path 
            d="M13.5 30.5C13.5 29.4 14.4 28.5 15.5 28.5H32.5C33.6 28.5 34.5 29.4 34.5 30.5V33.5C34.5 34.6 33.6 35.5 32.5 35.5H31C30.2 35.5 29.5 34.8 29.5 34C29.5 33.2 28.8 32.5 28 32.5H20C19.2 32.5 18.5 33.2 18.5 34C18.5 34.8 17.8 35.5 17 35.5H15.5C14.4 35.5 13.5 34.6 13.5 33.5V30.5Z" 
            fill="#0f172a" 
          />
          <rect x="15" y="30" width="3.5" height="1.8" rx="0.9" fill="#10b981" />
          <rect x="29.5" y="30" width="3.5" height="1.8" rx="0.9" fill="#10b981" />
          <line x1="20.5" y1="31" x2="27.5" y2="31" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
        </g>
      </svg>

      {!iconOnly && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black text-xl sm:text-2xl tracking-tight ${
            isDark ? 'text-white' : 'text-gray-950'
          }`}>
            Safe<span className="text-orange-500">Drive</span>
          </span>
          
          <span className="bg-gradient-to-r no-underline from-orange-500 to-amber-500 text-white font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            TAG
          </span>
        </div>
      )}
    </div>
  );
}
