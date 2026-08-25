import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Waves, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const textBlockRef = useRef(null);

  useGSAP(() => {
    // 1. Shoreline mask reveal on the portrait graphic
    gsap.fromTo(imageRef.current,
      { clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)' },
      {
        clipPath: 'polygon(0% 10%, 100% 0%, 100% 100%, 0% 90%)',
        duration: 1.4,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top bottom-=80',
          toggleActions: 'play none none none'
        }
      }
    );

    // 2. Line-by-line cascade text reveal
    const lines = textBlockRef.current.querySelectorAll('.reveal-line');
    gsap.fromTo(lines,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: textBlockRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none none'
        }
      }
    );
  }, { scope: containerRef });

  const handleMessageClick = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = contactSection.getBoundingClientRect().top;
      const position = elementRect - bodyRect - offset;
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative bg-bone-sand text-driftwood py-24 md:py-32 px-6 md:pl-32 md:pr-12 overflow-hidden"
    >
      {/* Decorative Beach Grass SVG Accent */}
      <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path d="M 10 90 Q 20 50, 40 30" strokeWidth="2" strokeLinecap="round" />
          <path d="M 25 90 Q 30 60, 60 40" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 40 90 Q 45 70, 75 55" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Portrait Graphic with Shoreline Mask */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            ref={imageRef}
            className="w-full max-w-[380px] aspect-[4/5] bg-gradient-to-tr from-twilight-teal to-sunset-coral rounded-2xl relative shadow-xl overflow-hidden"
            style={{ clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)' }}
          >
            {/* Background image loaded from public assets */}
            <img 
              src="/images/beach-wallpaper.jpg" 
              alt="Rehan Patel" 
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
            {/* Semi-transparent dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-deep-sea/95 via-deep-sea/20 to-transparent flex flex-col justify-end p-8 text-foam-white">
              {/* Character overlay */}
              <div className="relative z-10 space-y-1">
                <p className="font-mono text-[10px] tracking-[0.2em] text-golden-sand uppercase">
                  Based in SF / Remote
                </p>
                <h3 className="font-display text-2xl font-bold">Rehan Patel</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio Copy */}
        <div ref={textBlockRef} className="lg:col-span-7 space-y-6 md:space-y-8">
          <div className="space-y-4 reveal-line">
            <span className="font-mono text-xs tracking-[0.35em] text-sunset-coral uppercase block">
              About the Surfer
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Hi there, I'm Rehan.
            </h2>
          </div>

          <p className="font-body text-base md:text-lg text-driftwood/80 leading-relaxed reveal-line">
            I am a creative developer who builds immersive websites that feel as natural as waves rolling onto the sand. By combining structured frontend code with expressive animations, I bridge the gap between technical logic and dynamic brand storytelling.
          </p>

          <p className="font-body text-sm md:text-base text-driftwood/70 leading-relaxed reveal-line">
            When I'm not tweaking canvas buffers or polishing GSAP timelines, you can find me studying coastal currents, exploring digital photography, or designing minimalistic interfaces. I thrive at the intersection of high-fidelity prototyping and custom 3D web graphics.
          </p>

          {/* Links and CTA button */}
          <div className="flex flex-wrap items-center gap-6 pt-4 reveal-line">
            <a
              href="#contact"
              onClick={handleMessageClick}
              className="group flex items-center gap-2 bg-sunset-coral hover:bg-sunset-coral/90 text-foam-white font-mono text-xs tracking-wider uppercase px-6 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none"
              data-hover
            >
              <span>Send Me a Message</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </a>
            
            <a
              href="#resume"
              className="font-mono text-xs text-driftwood/60 hover:text-sunset-coral tracking-widest uppercase border-b border-driftwood/20 hover:border-sunset-coral pb-1 transition-all duration-300"
              data-hover
            >
              Download Résumé
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
