import React from 'react';
import { ArrowUp, Waves } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-deep-sea pt-20 pb-10 border-t border-twilight-teal/20 text-foam-white/50">
      
      {/* Decorative Wave Divider at top of Footer */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-[99%]">
        <svg
          className="relative block w-full h-16 text-deep-sea fill-current"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {/* Double overlapping waves for coastal parallax depth */}
          <path
            d="M0,60 C150,100 350,20 500,60 C650,100 850,20 1000,60 C1150,100 1250,80 1300,60 L1300,120 L0,120 Z"
            className="opacity-40 fill-twilight-teal"
            style={{
              animation: 'wave-drift 25s linear infinite'
            }}
          />
          <path
            d="M0,80 C180,110 300,50 480,80 C660,110 820,50 1000,80 C1180,110 1200,90 1250,80 L1250,120 L0,120 Z"
            className="fill-deep-sea"
            style={{
              animation: 'wave-drift-reverse 15s linear infinite'
            }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo Monogram */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center border border-golden-sand/20 rounded-full">
            <span className="font-display font-semibold text-xs text-golden-sand">C</span>
          </div>
          <span className="font-display tracking-[0.15em] text-xs uppercase font-bold text-foam-white">
            Coast.Dev
          </span>
        </div>

        {/* Copyright and credit */}
        <div className="text-center md:text-left text-xs font-mono tracking-wider">
          <p>© {new Date().getFullYear()} Coast.Dev. All rights reserved.</p>
          <p className="mt-1 opacity-70">
            Crafted with care, inspired by the tide.
          </p>
        </div>

        {/* Back to top button - styled as a rising bubble */}
        <button
          onClick={scrollToTop}
          className="group relative w-10 h-10 rounded-full bg-twilight-teal border border-golden-sand/20 hover:border-sunset-coral/50 flex items-center justify-center text-golden-sand hover:text-sunset-coral hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] focus:outline-none"
          aria-label="Back to Top"
          data-hover
        >
          {/* Pulsing ring inside button */}
          <span className="absolute inset-0 rounded-full border border-golden-sand/35 scale-100 group-hover:scale-125 group-hover:opacity-0 transition-all duration-500" />
          <ArrowUp className="w-4 h-4" />
        </button>

      </div>
    </footer>
  );
}
