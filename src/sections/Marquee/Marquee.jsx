import React, { useRef } from 'react';
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

  useAnimationFrame((time, delta) => {
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

  // Calculate wrap offset for infinite loop
  const x = useTransform(baseX, (v) => {
    // Limit to -50% to 0% range for smooth wrap
    const modX = ((v % 50) + 50) % 50;
    return `-${modX}%`;
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap flex-nowrap w-full">
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
    { text: 'React', color: 'text-foam-white' },
    { text: 'Three.js', color: 'text-golden-sand' },
    { text: 'GSAP', color: 'text-sunset-coral' },
    { text: 'WebGL', color: 'text-foam-white' },
    { text: 'Shaders', color: 'text-golden-sand' },
    { text: 'Framer Motion', color: 'text-shallow-water' },
    { text: 'Edge Compute', color: 'text-sunset-coral' },
    { text: 'Tailwind CSS', color: 'text-foam-white' },
    { text: 'UI Design', color: 'text-golden-sand' }
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
        <MarqueeRow baseVelocity={-20}>
          {skills.map((skill, index) => (
            <span key={index} className={`${skill.color} flex items-center gap-12`}>
              <span>{skill.text}</span>
              <span className="text-twilight-teal">•</span>
            </span>
          ))}
        </MarqueeRow>

        {/* Row 2 (Scrolled Right) */}
        <MarqueeRow baseVelocity={20}>
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
