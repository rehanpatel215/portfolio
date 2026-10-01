import React, { useState, useEffect, useRef } from 'react';
import HeroScene from './HeroScene';
import { Waves } from 'lucide-react';
import gsap from 'gsap';

const nameVariants = [
  'レハン パテル', // Japanese (Katakana)
  '레한 파텔',   // Korean (Hangul)
  'रेहान पटेल',   // Hindi (Devanagari)
  'Рехан Патель', // Russian (Cyrillic)
  'REHAN PATEL'   // English (Final)
];

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?/1234567890';

export default function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [isSettled, setIsSettled] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollCueRef = useRef(null);
  const scrambleIntervalRef = useRef(null);
  const sequenceTimeoutRef = useRef(null);
  const isRunningRef = useRef(false);

  const roles = [
    'Creative Developer',
    'UI/UX Designer',
    'surfer of interfaces',
    'WebGL Enthusiast'
  ];

  // 1. Scroll listener for parallax background offset
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrambleTo = (targetText) => {
    return new Promise((resolve) => {
      let iteration = 0;
      clearInterval(scrambleIntervalRef.current);
      
      scrambleIntervalRef.current = setInterval(() => {
        setDisplayText((currentText) => {
          const currentLength = currentText ? currentText.length : 0;
          const textLength = Math.max(targetText.length, currentLength);
          return Array.from({ length: textLength })
            .map((_, index) => {
              if (index < Math.floor(iteration)) {
                return targetText[index] || '';
              }
              return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            })
            .join('');
        });
        
        iteration += 1;
        
        if (iteration > targetText.length) {
          clearInterval(scrambleIntervalRef.current);
          setDisplayText(targetText);
          resolve();
        }
      }, 30);
    });
  };

  const runScrambleSequence = async () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayText(nameVariants[nameVariants.length - 1]);
      setIsSettled(true);
      return;
    }

    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setIsScrambling(true);

    for (let i = 0; i < nameVariants.length; i++) {
      if (!isRunningRef.current) break;
      await scrambleTo(nameVariants[i]);
      if (i < nameVariants.length - 1 && isRunningRef.current) {
        await new Promise(r => { sequenceTimeoutRef.current = setTimeout(r, 100) });
      }
    }
    
    if (isRunningRef.current) {
      setIsScrambling(false);
      setIsSettled(true);
      isRunningRef.current = false;
    }
  };

  // 2. Language cycling animation on load
  useEffect(() => {
    runScrambleSequence();
    return () => {
      isRunningRef.current = false;
      clearInterval(scrambleIntervalRef.current);
      clearTimeout(sequenceTimeoutRef.current);
      setIsScrambling(false);
    };
  }, []);

  // 3. Cycle through subtitle roles
  useEffect(() => {
    if (!isSettled) return;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isSettled]);

  // 4. Reveal subtitle and scroll indicator after name settles
  useEffect(() => {
    if (isSettled) {
      const tl = gsap.timeline();
      tl.fromTo(subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      )
      .fromTo(scrollCueRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' },
        "-=0.4"
      );
    }
  }, [isSettled]);

  const handleScrollDown = (e) => {
    e.preventDefault();
    const nextSection = document.getElementById('works');
    if (nextSection) {
      const offset = window.innerWidth >= 768 ? 0 : 70; // Header height mobile
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = nextSection.getBoundingClientRect().top;
      const position = elementRect - bodyRect - offset;
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center bg-deep-sea overflow-hidden select-none"
    >
      {/* Parallax wrapping container for background photo */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden w-full h-full"
        style={{
          transform: `translate3d(0, ${scrollY * 0.35}px, 0)`,
          willChange: 'transform'
        }}
      >
        <img 
          src="/images/beach-wallpaper.jpg" 
          alt="Beach Background" 
          className="w-full h-full object-cover animate-ken-burns scale-102"
        />
        {/* Subtle gradient mask to keep text readable while keeping image bright */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-sea/10 to-deep-sea/80" />
      </div>

      {/* R3F Interactive Waves overlaid at the bottom as a subtle water accent */}
      <div className="absolute inset-x-0 bottom-0 h-[45vh] z-10 pointer-events-none opacity-40">
        <HeroScene />
      </div>

      {/* Foreground Hero Text content */}
      <div className="relative z-20 text-center px-6 max-w-4xl md:pl-20">
        
        {/* Animated multi-language name cycles */}
        <h1 
          ref={titleRef}
          onMouseEnter={runScrambleSequence}
          onTouchStart={runScrambleSequence}
          className="font-display text-6xl md:text-8xl font-black tracking-tight leading-none min-h-[70px] md:min-h-[96px] flex items-center justify-center cursor-default"
        >
          <span 
            className={`transition-all duration-300 ${
              !isScrambling && isSettled 
                ? 'text-foam-white drop-shadow-md' 
                : 'text-golden-sand font-medium scale-95 opacity-80 filter blur-[0.5px]'
            }`}
          >
            {displayText}
          </span>
        </h1>

        {/* Rotating role subheadline */}
        <div 
          ref={subtitleRef}
          className="mt-6 flex flex-col items-center justify-center gap-2 opacity-0"
        >
          <p className="font-mono text-[10px] tracking-[0.25em] text-golden-sand uppercase">
            Crafting fluid digital shorelines
          </p>
          <div className="h-8 overflow-hidden relative w-full flex justify-center mt-2">
            {roles.map((role, idx) => (
              <span
                key={role}
                className={`absolute font-body text-base md:text-xl font-light text-shallow-water tracking-wide capitalize transition-all duration-700 ease-in-out ${
                  idx === roleIndex 
                    ? 'translate-y-0 opacity-100' 
                    : idx === (roleIndex - 1 + roles.length) % roles.length
                      ? '-translate-y-8 opacity-0'
                      : 'translate-y-8 opacity-0'
                }`}
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        ref={scrollCueRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-0"
      >
        <a
          href="#works"
          onClick={handleScrollDown}
          className="group flex flex-col items-center text-foam-white/50 hover:text-golden-sand transition-colors duration-300 font-mono text-[10px] tracking-[0.2em] uppercase"
          data-hover
        >
          <span>Explore Work</span>
          <div className="w-10 h-10 mt-2 flex items-center justify-center rounded-full border border-foam-white/10 group-hover:border-golden-sand/40 bg-deep-sea/20 backdrop-blur-sm transition-all duration-300 shadow-md">
            <Waves className="w-4 h-4 text-sunset-coral group-hover:animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
