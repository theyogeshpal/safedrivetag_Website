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
    <section className={`relative bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-[#FAF8F5] pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 text-center overflow-hidden ${className}`}>
      {/* Subtle Ambient Glows matching Brand */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-orange-400/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-amber-300/15 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-4 sm:space-y-5 animate-fade-up">
        {/* Top Pill */}
        {badge && (
          <div className="inline-flex items-center gap-2 bg-[#fdf8d5] border border-[#f4e28e] text-[#6d5516] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            {badge}
          </div>
        )}

        {/* Main Headline */}
        {title && (
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-black tracking-tight leading-[1.15]">
            {title}{' '}
            {highlightText && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 block sm:inline">
                {highlightText}
              </span>
            )}
          </h1>
        )}

        {/* Subtitle / Description */}
        {description && (
          <p className="text-sm sm:text-base md:text-lg text-black/60 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            {description}
          </p>
        )}

        {/* Key Value Badges */}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            {badges.map((b, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1.5 bg-white border border-black/5 text-black/70 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm"
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
