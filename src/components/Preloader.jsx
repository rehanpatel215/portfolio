import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef();
  const sunRef = useRef();
  const waveRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    // Simulate natural fluid loading steps
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 3;
        return Math.min(prev + increment, 100);
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    if (progress === 100) {
      const tl = gsap.timeline({
        onComplete: onComplete
      });
      // Preloader exit animations
      tl.to(sunRef.current, {
        scale: 1.6,
        filter: 'drop-shadow(0 0 25px #F4C87A)',
        duration: 0.6,
        ease: 'power3.out'
      })
      .to(textRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.3
      }, "-=0.3")
      .to(containerRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 0.9,
        ease: 'power4.inOut'
      }, "-=0.2");
    }
  }, { scope: containerRef, dependencies: [progress] });

  // Animate the sun rising based on progress
  useEffect(() => {
    if (sunRef.current) {
      const yVal = 55 - (progress / 100) * 55;
      gsap.to(sunRef.current, {
        y: yVal,
        duration: 0.15,
        ease: 'sine.out'
      });
    }
  }, [progress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-deep-sea z-50 flex flex-col items-center justify-center select-none"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
    >
      <div className="relative w-48 h-48 flex items-center justify-center overflow-hidden">
        {/* Coastal SVG loader animation */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Sun */}
          <circle
            ref={sunRef}
            cx="50"
            cy="60"
            r="16"
            fill="#F4C87A"
            className="drop-shadow-[0_0_12px_rgba(255,127,92,0.8)]"
          />
          {/* Waves / Water surface */}
          <path
            ref={waveRef}
            d="M -10 68 Q 15 63 40 68 T 90 68 T 140 68 L 140 105 L -10 105 Z"
            fill="#123B4F"
            className="animate-wave-drift"
            style={{ width: '200%' }}
          />
          <path
            d="M -10 72 Q 20 68 50 72 T 110 72 L 110 105 L -10 105 Z"
            fill="#0B2A3D"
            opacity="0.85"
          />
        </svg>
      </div>

      <div ref={textRef} className="mt-8 text-center">
        <p className="font-mono text-[10px] tracking-[0.3em] text-shallow-water uppercase">
          Warming the Sands
        </p>
        <h2 className="font-display text-5xl font-bold text-golden-sand mt-3 select-none">
          {progress}%
        </h2>
      </div>
    </div>
  );
}
