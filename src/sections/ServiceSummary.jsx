import React, { useRef, useEffect } from 'react';

export default function ServiceSummary() {
  const containerRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const contentRef = useRef(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const el = scrollWrapperRef.current;
    const content = contentRef.current;
    if (!el || !content) return;

    let animationFrameId;
    let exactScrollLeft = 0;

    const loop = () => {
      const loopWidth = content.offsetWidth;
      
      if (!isHovered.current) {
        exactScrollLeft += 1; // Steady automatic speed
        
        // Seamless loop reset
        if (exactScrollLeft >= loopWidth) {
          exactScrollLeft -= loopWidth;
        } else if (exactScrollLeft <= 0) {
          exactScrollLeft += loopWidth;
        }
        
        el.scrollLeft = exactScrollLeft;
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    const onWheel = (e) => {
      e.preventDefault(); // Trap scroll inside the box completely
      
      el.scrollLeft += e.deltaY * 3; // Improved scroll sensitivity
      
      const loopWidth = content.offsetWidth;
      if (el.scrollLeft >= loopWidth) {
        el.scrollLeft -= loopWidth;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += loopWidth;
      }
      
      exactScrollLeft = el.scrollLeft;
    };
    
    // { passive: false } is required to use e.preventDefault()
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(animationFrameId);
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  const capabilities = [
    'Machine Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Full Stack',
    'Problem Solving',
    'Data Processing',
    'Open Source Contribution',
    'N8N'
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-12 bg-twilight-teal border-y border-golden-sand/10 select-none"
    >
      {/* Subtle wave SVG pattern backdrop */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="wave-pattern" width="100" height="20" patternUnits="userSpaceOnUse">
            <path d="M 0 10 Q 25 5, 50 10 T 100 10" fill="none" stroke="#F4C87A" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#wave-pattern)" />
        </svg>
      </div>

      {/* Horizontally scrollable wrapper */}
      <div 
        ref={scrollWrapperRef} 
        onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={() => (isHovered.current = false)}
        className="flex items-center overflow-x-hidden relative z-10 w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Set 1 */}
        <div ref={contentRef} className="flex items-center gap-16 pr-16 shrink-0">
          {capabilities.map((title, index) => (
            <div 
              key={`set1-${index}`}
              className="flex items-center gap-6 shrink-0"
            >
              <span className="font-display text-2xl md:text-3xl font-semibold tracking-wide text-foam-white uppercase">
                {title}
              </span>
              <span className="text-sunset-coral font-bold text-lg">•</span>
            </div>
          ))}
        </div>
        
        {/* Set 2 (Duplicate for seamless loop) */}
        <div className="flex items-center gap-16 pr-16 shrink-0">
          {capabilities.map((title, index) => (
            <div 
              key={`set2-${index}`}
              className="flex items-center gap-6 shrink-0"
            >
              <span className="font-display text-2xl md:text-3xl font-semibold tracking-wide text-foam-white uppercase">
                {title}
              </span>
              <span className="text-sunset-coral font-bold text-lg">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
