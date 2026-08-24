import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on desktop screens (>= 1024px)
    if (window.innerWidth < 1024) return;

    setIsVisible(true);

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    // Use GSAP quickTo for highly efficient, frame-rate independent pointer movement
    const xCursorTo = gsap.quickTo(cursor, "x", { duration: 0.05, ease: "power3.out" });
    const yCursorTo = gsap.quickTo(cursor, "y", { duration: 0.05, ease: "power3.out" });

    const xFollowerTo = gsap.quickTo(follower, "x", { duration: 0.35, ease: "power3.out" });
    const yFollowerTo = gsap.quickTo(follower, "y", { duration: 0.35, ease: "power3.out" });

    const onMouseMove = (e) => {
      xCursorTo(e.clientX);
      yCursorTo(e.clientY);
      xFollowerTo(e.clientX);
      yFollowerTo(e.clientY);
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.hasAttribute('data-hover') ||
        target.closest('[data-hover]');
      
      if (isInteractive) {
        setIsHovered(true);
      }
    };

    const onMouseOut = () => {
      setIsHovered(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Tiny inner physical cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-sunset-coral rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
      {/* Glowing outer liquid follower ring */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          isHovered 
            ? 'w-14 h-14 bg-sunset-coral/15 border border-sunset-coral scale-110 shadow-[0_0_20px_rgba(255,127,92,0.4)]' 
            : 'w-8 h-8 bg-golden-sand/5 border border-golden-sand/25 shadow-[0_0_10px_rgba(244,200,122,0.15)]'
        }`}
      />
    </>
  );
}
