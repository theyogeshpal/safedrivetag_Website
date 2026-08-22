import React from 'react';

export default function PageHero({
  badge,
  title,
  highlightText,
  description,
  badges = [],
  children,
  className = ''
}) {
  return (
    <section className={`relative bg-[#0A0A0A] pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 text-center overflow-hidden ${className}`}>
      {/* Texture Pattern Overlay */}
      <div 
        className="absolute inset-0 carbon-texture-bg opacity-40 pointer-events-none"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
          backgroundRepeat: "repeat"
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto space-y-4 sm:space-y-5 animate-fade-up">
        {/* Top Pill */}
        {badge && (
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/90 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
            {badge}
          </div>
        )}

        {/* Main Headline */}
        {title && (
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
            {title}{' '}
            {highlightText && (
              <span className="text-orange-500 block sm:inline">
                {highlightText}
              </span>
            )}
          </h1>
        )}

        {/* Subtitle / Description */}
        {description && (
          <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            {description}
          </p>
        )}

        {/* Key Value Badges */}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            {badges.map((b, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1.5 bg-white text-slate-900 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md"
              >
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
