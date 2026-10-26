import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ExternalLink, HeartPulse, Sprout } from 'lucide-react';

const projects = [
  {
    id: 1,
    num: '01',
    title: 'Sanchar — RuralCare Connect',
    desc: 'Full-stack rural health platform connecting ASHA workers, PHCs and district hospitals with smart triage routing, referrals, OPD queues and medicine stock tracking.',
    tags: ['React 18', 'Node.js', 'PostgreSQL', 'JWT'],
    demo: null,
    code: 'https://github.com/rehanpatel215/SAN_CHAR',
    art: (
      <div className="w-full h-full bg-twilight-teal flex flex-col justify-between p-6 relative overflow-hidden select-none">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <div className="w-12 h-2.5 bg-sunset-coral rounded-full opacity-80" />
            <div className="w-20 h-2 bg-foam-white/40 rounded-full" />
          </div>
          <div className="w-8 h-8 rounded-full bg-golden-sand/20 flex items-center justify-center">
            <HeartPulse className="w-4 h-4 text-golden-sand" />
          </div>
        </div>

        {/* Referral / triage path */}
        <div className="flex items-center justify-between gap-2 mt-4">
          {['ASHA', 'PHC', 'District'].map((node, index) => (
            <React.Fragment key={node}>
              <span className="font-mono text-[9px] tracking-wider text-foam-white/80 border border-twilight-teal/60 bg-deep-sea/40 rounded-full px-2.5 py-1">
                {node}
              </span>
              {index < 2 && (
                <span className="flex-1 h-px bg-sunset-coral/50 relative">
                  <span className="absolute right-0 -top-[3px] w-1.5 h-1.5 rounded-full bg-sunset-coral" />
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-sunset-coral/20 rounded-full blur-xl" />
      </div>
    )
  },
  {
    id: 2,
    num: '02',
    title: 'CrayonAI — Search Space Visualizer',
    desc: 'Route planner built on real OpenStreetMap data that visualises how Dijkstra, A*, BFS and DFS explore a road network, with live traffic simulation and automatic rerouting.',
    tags: ['Python', 'OSMnx', 'NetworkX', 'React 19'],
    demo: null,
    code: 'https://github.com/rehanpatel215/CrayonAI',
    art: (
      <div className="w-full h-full bg-[#16303f] flex items-center justify-center p-6 relative overflow-hidden select-none">
        {/* Abstract path-search graph */}
        <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
          <g className="text-shallow-water/20" stroke="currentColor" strokeWidth="1">
            <path d="M 15 95 L 55 55 L 100 70 L 145 30 L 185 45" />
            <path d="M 15 95 L 70 95 L 100 70" />
            <path d="M 100 70 L 115 105 L 165 95" />
            <path d="M 55 55 L 75 20 L 145 30" />
          </g>
          <path
            d="M 15 95 L 55 55 L 100 70 L 145 30 L 185 45"
            className="stroke-golden-sand"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {[
            [15, 95],
            [55, 55],
            [100, 70],
            [145, 30],
            [185, 45]
          ].map(([cx, cy], index) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={index === 0 || index === 4 ? 4 : 2.5}
              className={index === 0 || index === 4 ? 'fill-sunset-coral' : 'fill-golden-sand'}
            />
          ))}
        </svg>
        <div className="absolute top-4 right-4 bg-sunset-coral text-[9px] font-mono tracking-widest text-foam-white px-2 py-0.5 rounded uppercase">
          A* · Dijkstra
        </div>
      </div>
    )
  },
  {
    id: 3,
    num: '03',
    title: 'AI Crop Advisory',
    desc: 'Flask app that recommends crops from soil parameters using a Random Forest classifier, with a fertilizer advisory module explained by the Gemini API.',
    tags: ['Flask', 'scikit-learn', 'Pandas', 'Gemini API'],
    demo: null,
    code: 'https://github.com/rehanpatel215/AI-CROP',
    art: (
      <div className="w-full h-full bg-gradient-to-br from-twilight-teal to-deep-sea flex flex-col justify-between p-6 relative overflow-hidden select-none">
        <div className="flex justify-between items-start">
          <span className="font-mono text-[9px] tracking-widest text-shallow-water uppercase">
            Soil input → crop
          </span>
          <div className="w-8 h-8 rounded-full bg-golden-sand/20 flex items-center justify-center">
            <Sprout className="w-4 h-4 text-golden-sand" />
          </div>
        </div>

        {/* Soil parameter bars (N, P, K, pH, rain) */}
        <div className="flex items-end gap-2 h-20 mt-2">
          {[
            { label: 'N', h: 'h-8' },
            { label: 'P', h: 'h-12' },
            { label: 'K', h: 'h-10' },
            { label: 'pH', h: 'h-16' },
            { label: 'Rain', h: 'h-6' }
          ].map((param) => (
            <div key={param.label} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full ${param.h} bg-shallow-water/40 rounded-sm`} />
              <span className="font-mono text-[8px] text-foam-white/50">{param.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between">
          <span className="font-display font-semibold text-xl text-golden-sand">Random Forest</span>
          <span className="font-mono text-[9px] text-foam-white/40">7 features</span>
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
      className="relative bg-deep-sea py-24 md:py-32 px-6 md:pl-32 md:pr-12 border-t border-twilight-teal/20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="font-mono text-xs tracking-[0.35em] text-sunset-coral uppercase block">
              Works & Experiments
            </span>
            <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-foam-white">
              Projects
            </h2>
          </div>
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

              {/* Project Links */}
              <div className="flex flex-wrap items-center gap-5">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-mono text-golden-sand hover:text-sunset-coral tracking-wider uppercase md:self-center transition-colors"
                    aria-label={`${project.title} live demo`}
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={project.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-mono text-golden-sand hover:text-sunset-coral tracking-wider uppercase md:self-center transition-colors"
                  aria-label={`${project.title} source code`}
                >
                  <span>View Code</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

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
