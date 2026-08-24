import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Mail, CheckCircle } from 'lucide-react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

gsap.registerPlugin(ScrollTrigger);

function ContactInput({ label, type = 'text', name, required = true }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div className="relative w-full mb-8">
      <label 
        className={`absolute left-0 top-3 font-mono text-xs tracking-widest uppercase transition-all duration-300 pointer-events-none ${
          focused || value 
            ? '-translate-y-6 text-sunset-coral scale-90' 
            : 'text-foam-white/50 translate-y-0'
        }`}
      >
        {label}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          name={name}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows="4"
          className="w-full bg-transparent border-b border-twilight-teal/50 py-3 text-foam-white focus:outline-none font-body text-sm resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border-b border-twilight-teal/50 py-3 text-foam-white focus:outline-none font-body text-sm"
        />
      )}

      {/* Focus wave underline animation */}
      <svg 
        className="absolute bottom-0 left-0 w-full h-2 pointer-events-none fill-none stroke-sunset-coral stroke-[2]"
        viewBox="0 0 100 6"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 3 Q 12 0, 25 3 T 50 3 T 75 3 T 100 3"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: focused ? 0 : 100,
            transition: 'stroke-dashoffset 0.5s ease-in-out'
          }}
        />
      </svg>
    </div>
  );
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef(null);
  const headingRef = useRef(null);

  useGSAP(() => {
    // Stagger letter/word wave reveal on heading
    const chars = headingRef.current.querySelectorAll('.char');
    gsap.fromTo(chars,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top bottom-=80',
          toggleActions: 'play none none none'
        }
      }
    );
  }, { scope: containerRef });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful edges submission
    setSubmitted(true);
  };

  const socialLinks = [
    { name: 'GitHub', icon: <GithubIcon className="w-5 h-5 relative z-10" />, url: 'https://github.com/rehanpatel215' },
    { name: 'LinkedIn', icon: <LinkedinIcon className="w-5 h-5 relative z-10" />, url: 'https://www.linkedin.com/in/rehan-patel215' }
  ];

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative bg-gradient-to-b from-twilight-teal to-[#071924] py-24 md:py-32 px-6 md:px-12 overflow-hidden border-t border-twilight-teal/20"
    >
      {/* Glow highlight mimicking sundown colors */}
      <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(255,127,92,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Heading and info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <span className="font-mono text-xs tracking-[0.35em] text-golden-sand uppercase block">
              Get in Touch
            </span>
            <h2 
              ref={headingRef}
              className="font-display text-5xl md:text-6xl font-bold tracking-tight text-foam-white flex flex-wrap leading-tight"
            >
              {"Let's craft something beautiful.".split(' ').map((word, wIdx) => (
                <span key={wIdx} className="mr-3 flex">
                  {word.split('').map((char, cIdx) => (
                    <span key={cIdx} className="char inline-block">
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
          </div>

          <p className="font-body text-sm md:text-base text-foam-white/60 leading-relaxed max-w-md">
            Whether you want to launch a new project, align on a UI layout, or simply chat about beach waves and shaders — drop a line!
          </p>

          <div className="space-y-4 pt-4">
            <a
              href="mailto:rehanpatel2194@gmail.com"
              className="group flex items-center gap-3 text-golden-sand hover:text-sunset-coral font-mono text-xs tracking-widest uppercase transition-colors"
              data-hover
            >
              <Mail className="w-4 h-4 text-sunset-coral" />
              <span>rehanpatel2194@gmail.com</span>
            </a>
          </div>

          {/* Socials with droplet ripples */}
          <div className="flex gap-4 pt-6">
            {socialLinks.map((soc) => (
              <a
                key={soc.name}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 rounded-full bg-deep-sea/40 border border-golden-sand/10 hover:border-sunset-coral transition-colors flex items-center justify-center text-foam-white/70 hover:text-sunset-coral"
                aria-label={soc.name}
                data-hover
              >
                {/* Rippling circle backdrop */}
                <span className="absolute inset-0 rounded-full border border-sunset-coral scale-50 opacity-0 group-hover:scale-150 group-hover:opacity-100 group-hover:animate-ping transition-all duration-1000 pointer-events-none" />
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Contact Form / Success state */}
        <div className="lg:col-span-7 w-full bg-deep-sea/35 border border-twilight-teal/30 p-8 md:p-10 rounded-2xl backdrop-blur-sm relative z-10">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-golden-sand/15 flex items-center justify-center text-golden-sand animate-bounce">
                <CheckCircle className="w-8 h-8 text-golden-sand" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foam-white">
                Message Sent Safely!
              </h3>
              <p className="font-body text-sm text-foam-white/60 max-w-sm">
                Like a message in a bottle floating on the current, it's headed my way. I will respond to your tide as soon as possible.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="font-mono text-xs text-sunset-coral hover:text-golden-sand uppercase tracking-wider underline pt-4"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col">
              <ContactInput label="Your Name" name="name" />
              <ContactInput label="Email Address" type="email" name="email" />
              <ContactInput label="Your Message" type="textarea" name="message" />

              <button
                type="submit"
                className="group w-full md:w-auto self-end flex items-center justify-center gap-2 bg-sunset-coral hover:bg-sunset-coral/95 text-foam-white font-mono text-xs tracking-wider uppercase px-6 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none"
                data-hover
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
