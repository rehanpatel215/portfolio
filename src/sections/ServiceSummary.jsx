import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ServiceSummary() {
  const containerRef = useRef(null);
  const textRowRef = useRef(null);

  useGSAP(() => {
    // Scroll-linked horizontal translation of the summary text
    gsap.fromTo(textRowRef.current,
      { x: '10%' },
      {
        x: '-25%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2 // High scrub duration creates a smooth lag/tide effect
        }
      }
    );
  }, { scope: containerRef });

  const capabilities = [
    { num: '01', title: 'Creative Engineering' },
    { num: '02', title: 'Interactive Prototypes' },
    { num: '03', title: 'Immersive 3D/WebGL' },
    { num: '04', title: 'Organic Motion Design' },
    { num: '05', title: 'Performance Optimization' }
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-12 bg-twilight-teal border-y border-golden-sand/10 overflow-hidden select-none"
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

      <div 
        ref={textRowRef} 
        className="flex items-center gap-16 whitespace-nowrap will-change-transform"
      >
        {/* Repeat list twice for continuous scrolling feel */}
        {[...capabilities, ...capabilities].map((cap, index) => (
          <div 
            key={index}
            className="flex items-center gap-6"
          >
            <span className="font-mono text-xs tracking-widest text-golden-sand border border-golden-sand/20 rounded px-2.5 py-0.5 bg-deep-sea/20">
              {cap.num}
            </span>
            <span className="font-display text-2xl md:text-3xl font-semibold tracking-wide text-foam-white uppercase">
              {cap.title}
            </span>
            <span className="text-sunset-coral font-bold text-lg">•</span>
          </div>
        ))}
      </div>
    </section>
  );
}
