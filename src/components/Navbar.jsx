import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // IntersectionObserver to track the currently viewed section for nav highlighting
  useEffect(() => {
    const sections = ['home', 'works', 'about', 'articles', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Trigger in center scroll area
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = window.innerWidth >= 768 ? 0 : 70;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { label: 'Projects', target: 'works' },
    { label: 'Details', target: 'about' },
    { label: 'Articles', target: 'articles' },
    { label: 'Contact', target: 'contact' }
  ];

  return (
    <>
      {/* ====================================================
          DESKTOP SIDEBAR NAVBAR (Visible screens >= md)
          Transparent floating overlay taking zero document flow width
         ==================================================== */}
      <aside 
        className="fixed left-0 top-0 w-20 h-screen flex flex-col justify-between pt-16 pb-0 px-0 items-center z-40 hidden md:flex pointer-events-none bg-transparent border-none"
      >
        {/* Top: Logo Monogram */}
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, 'home')}
          className="flex flex-col items-center group pointer-events-auto"
          aria-label="Home"
          data-hover
        >
          <span className="font-display font-semibold text-2xl tracking-wider text-foam-white hover:text-golden-sand transition-all duration-300">
            RP
          </span>
        </a>

        {/* Center: Vertical Primary Nav Links (Sideways-Rotated) */}
        <nav className="flex flex-col items-center justify-center pointer-events-auto my-auto py-8">
          {navLinks.map((link) => (
            <div key={link.target} className="h-24 w-20 flex items-center justify-center relative">
              <a
                href={`#${link.target}`}
                onClick={(e) => scrollToSection(e, link.target)}
                className={`transform -rotate-90 origin-center whitespace-nowrap text-[11px] font-mono uppercase tracking-[0.25em] transition-all duration-300 py-3 ${
                  activeSection === link.target 
                    ? 'text-golden-sand font-bold scale-105' 
                    : 'text-foam-white/55 hover:text-golden-sand'
                }`}
                data-hover
              >
                {link.label}
              </a>
            </div>
          ))}
        </nav>

        {/* Bottom: Desktop Social Icons (Stacked Vertically) */}
        <div className="flex flex-col items-center gap-6 pb-16 justify-center pointer-events-auto">
          <a
            href="https://github.com/rehanpatel215"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foam-white/55 hover:text-sunset-coral transition-colors duration-300 flex items-center justify-center"
            aria-label="GitHub"
            data-hover
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/rehan-patel215"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foam-white/55 hover:text-sunset-coral transition-colors duration-300 flex items-center justify-center"
            aria-label="LinkedIn"
            data-hover
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
        </div>
      </aside>

      {/* ====================================================
          MOBILE TOP NAVBAR HEADER (Visible screens < md)
         ==================================================== */}
      <header
        className="fixed top-0 left-0 w-full h-[70px] bg-deep-sea/90 border-b border-twilight-teal/30 backdrop-blur-md flex md:hidden items-center justify-between px-6 z-40"
      >
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, 'home')}
          className="flex items-center gap-2.5 group"
        >
          <span className="font-display font-bold text-xl text-golden-sand transition-colors duration-300">
            RP
          </span>
          <span className="font-display tracking-[0.12em] text-xs uppercase font-semibold text-foam-white">
            REHAN PATEL
          </span>
        </a>

        <button
          onClick={toggleMobileMenu}
          className="text-foam-white hover:text-golden-sand transition-colors focus:outline-none"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* ====================================================
          MOBILE FULL-SCREEN MENU OVERLAY (Visible < md)
         ==================================================== */}
      <div
        className={`fixed inset-0 z-50 bg-deep-sea md:hidden transition-all duration-700 ease-in-out ${
          isMobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(135deg, var(--color-deep-sea) 0%, var(--color-twilight-teal) 100%)',
          clipPath: isMobileMenuOpen 
            ? 'circle(150% at 90% 5%)' 
            : 'circle(0% at 90% 5%)',
          transition: 'clip-path 0.8s ease-in-out, opacity 0.5s ease'
        }}
      >
        {/* Close Button top-right */}
        <button
          onClick={toggleMobileMenu}
          className="absolute top-5 right-6 text-foam-white hover:text-golden-sand focus:outline-none"
          aria-label="Close Menu"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col justify-center h-full px-12 gap-8">
          <span className="font-mono text-[10px] tracking-[0.3em] text-golden-sand uppercase border-b border-twilight-teal/30 pb-2">
            Navigation
          </span>
          <div className="flex flex-col gap-6">
            {navLinks.map((link, idx) => (
              <a
                key={link.target}
                href={`#${link.target}`}
                onClick={(e) => scrollToSection(e, link.target)}
                className={`font-display text-4xl font-semibold text-foam-white hover:text-sunset-coral transition-colors duration-300 ${
                  isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{
                  transition: `transform 0.5s ease ${idx * 0.1}s, color 0.3s ease, opacity 0.5s ease ${idx * 0.1}s`
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div 
            className={`flex gap-6 mt-8 border-t border-twilight-teal/30 pt-6 transition-all duration-500 ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{
              transitionDelay: '0.4s'
            }}
          >
            <a
              href="https://github.com/rehanpatel215"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foam-white/60 hover:text-sunset-coral flex items-center gap-2 text-sm font-mono"
            >
              <GithubIcon className="w-5 h-5" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/rehan-patel215"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foam-white/60 hover:text-sunset-coral flex items-center gap-2 text-sm font-mono"
            >
              <LinkedinIcon className="w-5 h-5" /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
