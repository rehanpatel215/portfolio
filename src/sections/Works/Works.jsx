import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ExternalLink, Waves } from 'lucide-react';

const projects = [
  {
    id: 1,
    num: '01',
    title: 'Lagoon CMS',
    desc: 'A calm, lightweight headless content manager tailored for coastal eco-resorts.',
    tags: ['React', 'GraphQL', 'Tailwind v4'],
    link: 'https://github.com',
    art: (
      <div className="w-full h-full bg-twilight-teal flex flex-col justify-between p-6 relative overflow-hidden select-none">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <div className="w-12 h-2.5 bg-sunset-coral rounded-full opacity-80" />
            <div className="w-20 h-2 bg-foam-white/40 rounded-full" />
          </div>
          <div className="w-8 h-8 rounded-full bg-golden-sand/20 flex items-center justify-center">
            <Waves className="w-4 h-4 text-golden-sand" />
          </div>
        </div>
        <div className="h-24 w-full bg-deep-sea/50 rounded-lg p-3 border border-twilight-teal/50 flex flex-col justify-end">
          <div className="w-full h-2.5 bg-lagoon/60 rounded mb-2" />
          <div className="w-2/3 h-2 bg-shallow-water/40 rounded" />
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-sunset-coral/20 rounded-full blur-xl" />
      </div>
    )
  },
  {
    id: 2,
    num: '02',
    title: 'TideLine UI',
    desc: 'A WebGL-driven animation system and utility library for organic canvas easing.',
    tags: ['Three.js', 'GSAP', 'CSS Shaders'],
    link: 'https://github.com',
    art: (
      <div className="w-full h-full bg-[#16303f] flex items-center justify-center p-6 relative overflow-hidden select-none">
        {/* Wavy vector line designs that evoke water currents */}
        <svg viewBox="0 0 100 100" className="w-full h-full text-shallow-water/30 stroke-current fill-none">
          <path d="M -20 30 C 20 10, 30 70, 70 50 C 90 40, 110 80, 130 60" strokeWidth="2" className="animate-float" />
          <path d="M -20 50 C 20 30, 45 85, 80 60 C 100 50, 110 90, 130 70" strokeWidth="1.5" className="animate-float" style={{ animationDelay: '-2s' }} />
          <path d="M -20 70 C 15 50, 40 95, 75 75 C 95 65, 115 100, 130 80" strokeWidth="1" className="animate-float" style={{ animationDelay: '-4s' }} />
        </svg>
        <div className="absolute top-4 right-4 bg-sunset-coral text-[9px] font-mono tracking-widest text-foam-white px-2 py-0.5 rounded uppercase">
          Shader Mode
        </div>
      </div>
    )
  },
  {
    id: 3,
    num: '03',
    title: 'Coral3D',
    desc: 'Procedural 3D scene engine rendering simulated ocean coral reef ecosystems.',
    tags: ['React Three Fiber', 'Shaders', 'Vite'],
    link: 'https://github.com',
    art: (
      <div className="w-full h-full bg-deep-sea flex items-center justify-center relative overflow-hidden select-none">
        {/* Abstract glowing sun & overlapping ocean rings */}
        <div className="absolute w-36 h-36 bg-[radial-gradient(circle,rgba(244,200,122,0.15)_0%,transparent_70%)]" />
        <div className="w-16 h-16 rounded-full bg-golden-sand relative flex items-center justify-center shadow-[0_0_30px_rgba(244,200,122,0.5)]">
          <div className="absolute inset-[-12px] border border-sunset-coral/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="w-12 h-12 rounded-full border border-deep-sea/45 border-dashed animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <div className="absolute bottom-4 left-4 font-mono text-[9px] text-shallow-water tracking-wider">
          GLSL Easing: Active
        </div>
      </div>
    )
  },
  {
    id: 4,
    num: '04',
    title: 'ShellSync',
    desc: 'Serverless asset distribution platform with edge caching optimized for design heavy portfolios.',
    tags: ['Cloudflare Workers', 'KV Store', 'WASM'],
    link: 'https://github.com',
    art: (
      <div className="w-full h-full bg-gradient-to-br from-twilight-teal to-deep-sea flex flex-col justify-between p-6 relative overflow-hidden select-none">
        <div className="border border-golden-sand/20 rounded-md p-3 bg-deep-sea/35">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-sunset-coral" />
            <span className="font-mono text-[10px] text-foam-white/70">Edge-node-04 (SFO)</span>
          </div>
          <div className="flex gap-1.5">
            <div className="h-6 w-3 bg-shallow-water/30 rounded" />
            <div className="h-6 w-3 bg-shallow-water/50 rounded" />
            <div className="h-6 w-3 bg-golden-sand/70 rounded" />
            <div className="h-6 w-3 bg-sunset-coral/80 rounded" />
          </div>
        </div>
        <div className="flex items-end justify-between mt-4">
          <span className="font-display font-semibold text-2xl text-golden-sand">99.9%</span>
          <span className="font-mono text-[9px] text-foam-white/40">Uptime Guarantee</span>
        </div>
      </div>
    )
  }
];

export default function Works() {
  const [activeProject, setActiveProject] = useState(null);
  const containerRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    // Hide mouse follower on touch/mobile
    if (window.innerWidth < 1024) return;

    const preview = previewRef.current;
    
    // QuickTo position binders for lag follower effect
    const xTo = gsap.quickTo(preview, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.45, ease: "power3.out" });

    const handleMouseMove = (e) => {
      // Offset by half width/height to center follow point
      xTo(e.clientX - 160);
      yTo(e.clientY - 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="works"
      ref={containerRef}
      className="relative bg-deep-sea py-24 md:py-32 px-6 md:px-12 border-t border-twilight-teal/20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="font-mono text-xs tracking-[0.35em] text-sunset-coral uppercase block">
              Works & Experiments
            </span>
            <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-foam-white">
              Selected Projects
            </h2>
          </div>
          <p className="font-body text-sm md:text-base text-foam-white/60 max-w-md">
            A curated showcase of applications built with organic animations, immersive 3D, and clean aesthetic layouts.
          </p>
        </div>

        {/* Projects List Container */}
        <div className="border-t border-twilight-teal/30 divide-y divide-twilight-teal/20 relative">
          
          {projects.map((project) => (
            <div
              key={project.id}
              className="group py-8 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer relative z-10 transition-colors"
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
              data-hover
            >
              {/* Project Title and Index */}
              <div className="flex items-start md:items-center gap-6 md:gap-12">
                <span className="font-mono text-sm tracking-widest text-golden-sand pt-1.5 md:pt-0">
                  {project.num}
                </span>
                <div>
                  <h3 className="font-display text-3xl md:text-5xl font-bold text-foam-white group-hover:text-sunset-coral transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="font-body text-sm md:text-base text-foam-white/50 max-w-xl mt-2 transition-colors group-hover:text-foam-white/70">
                    {project.desc}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] tracking-wider text-shallow-water/80 bg-twilight-teal/40 border border-twilight-teal/40 rounded-full px-3 py-1 shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Link */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-golden-sand hover:text-sunset-coral tracking-wider uppercase md:self-center transition-colors"
              >
                <span>View Code</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Mobile Inline Preview (Shown only on screens < 1024px) */}
              <div className="w-full lg:hidden h-52 mt-6 rounded-lg overflow-hidden border border-twilight-teal/30 shadow-md">
                {project.art}
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* Desktop Floating Wave-reveal Preview Card (Hidden < 1024px) */}
      <div
        ref={previewRef}
        className={`fixed top-0 left-0 w-[320px] h-[200px] rounded-lg overflow-hidden border border-golden-sand/20 shadow-[0_15px_40px_rgba(0,0,0,0.4)] pointer-events-none z-30 transition-opacity duration-300 hidden lg:block ${
          activeProject !== null ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
        style={{
          transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              clipPath: activeProject === project.id 
                ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' // Fully visible
                : 'polygon(0% 100%, 100% 80%, 100% 100%, 0% 100%)', // Diagonally wiped out to bottom
              zIndex: activeProject === project.id ? 2 : 1,
              opacity: activeProject === project.id ? 1 : 0
            }}
          >
            {project.art}
          </div>
        ))}
      </div>
      
    </section>
  );
}
