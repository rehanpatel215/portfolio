import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const articles = [
  {
    id: 1,
    num: '01',
    date: 'AUG 20, 2026',
    readTime: '5 MIN READ',
    title: 'The Fluidity of CSS Shaders in Coastal Web Design',
    desc: 'Exploring how mathematical sine waves and WebGL vertex shaders can replicate the natural rhythm of ocean tides in modern web interfaces.'
  },
  {
    id: 2,
    num: '02',
    date: 'JUL 14, 2026',
    readTime: '8 MIN READ',
    title: 'Optimizing WebGL Renderers for High-End Portfolios',
    desc: 'A deep-dive technical guide on rendering complex low-poly 3D models and lighting environments at 60fps in React Three Fiber.'
  },
  {
    id: 3,
    num: '03',
    date: 'JUN 28, 2026',
    readTime: '4 MIN READ',
    title: 'Designing the Golden Hour: HSL Easing & Ambient Gradients',
    desc: 'How to utilize the HSL color model and custom cubic-bezier easing to craft breathing, luminous color transitions that evoke twilight.'
  }
];

export default function Articles() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const listRef = useRef(null);

  useGSAP(() => {
    // Reveal section heading
    gsap.fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top bottom-=80',
          toggleActions: 'play none none none'
        }
      }
    );

    // Staggered reveal of article items
    const items = listRef.current.querySelectorAll('.article-item');
    gsap.fromTo(items,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none none'
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section
      id="articles"
      ref={containerRef}
      className="relative bg-deep-sea text-foam-white py-24 md:py-32 px-6 md:px-16 lg:px-24 overflow-hidden border-t border-twilight-teal/30"
    >
      {/* Decorative Wave lines in background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M -100 150 C 200 50, 400 250, 700 150 C 1000 50, 1200 250, 1600 150" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M -100 300 C 200 200, 400 400, 700 300 C 1000 200, 1200 400, 1600 300" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sunset-coral animate-pulse" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-golden-sand">Writings & Thoughts</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
              Selected Articles.
            </h2>
          </div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-foam-white/40 uppercase hidden md:block">
            03 / Publications
          </div>
        </div>

        {/* Articles List */}
        <div ref={listRef} className="divide-y divide-twilight-teal/30">
          {articles.map((article) => (
            <a
              key={article.id}
              href={`#article-${article.id}`}
              className="article-item group block py-8 md:py-12 transition-all duration-300 relative"
              data-hover
            >
              {/* Wipe-in hover background panel */}
              <div className="absolute inset-x-0 inset-y-0 bg-twilight-teal/10 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 rounded-xl -z-10" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Index number */}
                <div className="md:col-span-1 font-mono text-sm text-golden-sand group-hover:text-sunset-coral transition-colors duration-300">
                  {article.num}
                </div>

                {/* Metadata & Title */}
                <div className="md:col-span-8 space-y-3">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-foam-white/40">
                    <span>{article.date}</span>
                    <span className="w-1 h-1 rounded-full bg-twilight-teal" />
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight group-hover:text-sunset-coral transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-sm text-foam-white/60 leading-relaxed max-w-3xl pt-1">
                    {article.desc}
                  </p>
                </div>

                {/* Read Button / Arrow */}
                <div className="md:col-span-3 flex justify-start md:justify-end items-center pt-2 md:pt-6">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-golden-sand uppercase group-hover:text-sunset-coral transition-colors duration-300">
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
