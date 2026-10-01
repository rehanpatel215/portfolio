import React, { useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue
} from 'framer-motion';

// Wrap text block for infinite marquee loop
function MarqueeRow({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  // Transform scroll velocity into marquee movement speed multiplier
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const directionFactor = useRef(1);
  const containerRef = useRef(null);
  const isHovered = useRef(false);

  useAnimationFrame((time, delta) => {
    if (isHovered.current) return; // Pause on hover

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // If scrolling down, speed up. If scrolling up, reverse and speed up.
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  // Handle manual scrolling on hover or touch
  const touchStartRef = useRef({ x: 0, y: 0 });
  const isScrollingVertically = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (!isHovered.current) return;
      e.preventDefault(); // Trap scroll inside the marquee row
      
      // Map vertical scroll (deltaY) to horizontal movement
      baseX.set(baseX.get() + e.deltaY * 0.03); 
    };

    const onTouchStart = (e) => {
      isHovered.current = true;
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      isScrollingVertically.current = false;
    };

    const onTouchMove = (e) => {
      if (!isHovered.current) return;
  
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      
      const diffX = touchStartRef.current.x - currentX;
      const diffY = touchStartRef.current.y - currentY;
  
      // If the user is swiping up/down more than left/right, let the page scroll natively
      if (!isScrollingVertically.current && Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 5) {
        isScrollingVertically.current = true;
      }
  
      if (isScrollingVertically.current) {
        isHovered.current = false; // Unpause marquee if they are just scrolling the page
        return;
      }
  
      // Trap horizontal scroll
      if (e.cancelable) e.preventDefault(); 
      
      baseX.set(baseX.get() + diffX * 0.08); // Multiply by a factor for comfortable touch scrubbing
      touchStartRef.current.x = currentX;
      touchStartRef.current.y = currentY;
    };

    const onTouchEnd = () => {
      isHovered.current = false;
      isScrollingVertically.current = false;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  // Calculate wrap offset for infinite loop
  const x = useTransform(baseX, (v) => {
    // Limit to -50% to 0% range for smooth wrap
    const modX = ((v % 50) + 50) % 50;
    return `-${modX}%`;
  });

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
      className="flex overflow-hidden whitespace-nowrap flex-nowrap w-full cursor-default"
    >
      <motion.div 
        className="flex whitespace-nowrap flex-nowrap font-display text-5xl md:text-7xl font-extrabold uppercase select-none tracking-wider gap-x-12"
        style={{ x }}
      >
        {/* Render duplicate text segments for infinite scrolling */}
        <div className="flex gap-x-12">{children}</div>
        <div className="flex gap-x-12">{children}</div>
        <div className="flex gap-x-12">{children}</div>
        <div className="flex gap-x-12">{children}</div>
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  const skills = [
    { text: 'Python', color: 'text-foam-white' },
    { text: 'Deep Learning', color: 'text-golden-sand' },
    { text: 'RAG', color: 'text-sunset-coral' },
    { text: 'LangChain', color: 'text-shallow-water' },
    { text: 'Data Analysis', color: 'text-foam-white' },
    { text: 'Model Evaluation', color: 'text-golden-sand' },
    { text: 'OpenCV', color: 'text-sunset-coral' },
    { text: 'Matplotlib', color: 'text-shallow-water' },
    { text: 'React & Node.js', color: 'text-foam-white' },
    { text: 'REST APIs', color: 'text-golden-sand' },
    { text: 'C & Java', color: 'text-sunset-coral' },
    { text: 'JavaScript', color: 'text-shallow-water' },
    { text: 'HTML & CSS', color: 'text-foam-white' },
    { text: 'Statistics', color: 'text-golden-sand' },
    { text: 'Model Development', color: 'text-sunset-coral' },
    { text: 'Data Preprocessing', color: 'text-shallow-water' },
    { text: 'EDA', color: 'text-foam-white' },
    { text: 'Git & GitHub', color: 'text-golden-sand' },
    { text: 'Data Validation', color: 'text-sunset-coral' }
  ];

  return (
    <section className="relative py-16 bg-[#0a2333] border-y border-twilight-teal/30 overflow-hidden">
      
      {/* Background drifting wave SVG loop behind the text */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <svg 
          className="w-[200%] h-full text-shallow-water fill-none stroke-current stroke-[1.5] animate-wave-drift-reverse"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C150,90 350,30 500,60 C650,90 850,30 1000,60 C1150,90 1250,70 1300,60 L1300,120 L0,120 Z" />
        </svg>
      </div>

      {/* Marquee scrolling wrapper */}
      <div className="relative z-10 w-full flex flex-col gap-8">
        
        {/* Row 1 (Scrolled Left) */}
        <MarqueeRow baseVelocity={-5}>
          {skills.map((skill, index) => (
            <span key={index} className={`${skill.color} flex items-center gap-12`}>
              <span>{skill.text}</span>
              <span className="text-twilight-teal">•</span>
            </span>
          ))}
        </MarqueeRow>

        {/* Row 2 (Scrolled Right) */}
        <MarqueeRow baseVelocity={5}>
          {[...skills].reverse().map((skill, index) => (
            <span key={index} className={`${skill.color} flex items-center gap-12`}>
              <span>{skill.text}</span>
              <span className="text-twilight-teal">•</span>
            </span>
          ))}
        </MarqueeRow>

      </div>
    </section>
  );
}
