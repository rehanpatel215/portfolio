import React from 'react';

// Badge-only variant (wave-crest swell lines + bowed badge + RP monogram)
// Used in the floating sidebar and mobile header
export function RPLogoBadge({ className = "w-10 h-auto" }) {
  return (
    <svg 
      viewBox="0 0 240 140" 
      className={`${className} transition-all duration-300`}
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5"
    >
      {/* 1. Wave Bars (Background Layer - 5 lines per side curving downward) */}
      <g strokeWidth="4" strokeLinecap="round" opacity="0.85" className="text-foam-white/70 group-hover:text-golden-sand transition-colors duration-300">
        {/* Left Wave Bars */}
        <path d="M 74 70 Q 39.5 81, 5 80" />
        <path d="M 78 77 Q 49.5 94.5, 21 98" />
        <path d="M 82 84 Q 60 106, 38 112" />
        <path d="M 86 91 Q 70.5 115, 55 121" />
        <path d="M 90 98 Q 80.5 122, 71 126" />

        {/* Right Wave Bars */}
        <path d="M 166 70 Q 200.5 81, 235 80" />
        <path d="M 162 77 Q 190.5 94.5, 219 98" />
        <path d="M 158 84 Q 180 106, 202 112" />
        <path d="M 154 91 Q 169.5 115, 185 121" />
        <path d="M 150 98 Q 159.5 122, 169 126" />
      </g>

      {/* 2. Waterline Accent (Shoreline) */}
      <line 
        x1="90" 
        y1="118" 
        x2="150" 
        y2="118" 
        stroke="var(--color-sunset-coral)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        className="group-hover:stroke-golden-sand transition-colors duration-300"
      />

      {/* 3. Badge Shield (Convex top/bottom hexagon) */}
      <path 
        d="M 74 70 L 97 34 Q 120 18, 143 34 L 166 70 L 143 106 Q 120 122, 97 106 Z" 
        fill="var(--color-deep-sea)" 
        stroke="currentColor"
        strokeWidth="3.5" 
        strokeLinejoin="round" 
        className="text-foam-white group-hover:text-golden-sand transition-colors duration-300"
      />

      {/* 4. Monogram (Didone-style font) */}
      <text 
        x="120" 
        y="72" 
        fontFamily="var(--font-display)" 
        fontSize="34" 
        fontWeight="bold" 
        fill="currentColor" 
        textAnchor="middle" 
        dominantBaseline="central" 
        letterSpacing="-0.08em"
        style={{ userSelect: 'none' }}
        className="text-foam-white group-hover:text-golden-sand transition-colors duration-300"
      >
        RP
      </text>
    </svg>
  );
}

// Full lockup variant (wave-crest badge + wordmark + tagline)
// Used in the footer section
export function RPLogoFull({ className = "w-48 h-auto" }) {
  return (
    <svg 
      viewBox="0 0 240 200" 
      className={`${className} transition-all duration-300`}
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5"
    >
      {/* 1. Wave Bars */}
      <g strokeWidth="4" strokeLinecap="round" opacity="0.85" className="text-foam-white/70">
        <path d="M 74 70 Q 39.5 81, 5 80" />
        <path d="M 78 77 Q 49.5 94.5, 21 98" />
        <path d="M 82 84 Q 60 106, 38 112" />
        <path d="M 86 91 Q 70.5 115, 55 121" />
        <path d="M 90 98 Q 80.5 122, 71 126" />

        <path d="M 166 70 Q 200.5 81, 235 80" />
        <path d="M 162 77 Q 190.5 94.5, 219 98" />
        <path d="M 158 84 Q 180 106, 202 112" />
        <path d="M 154 91 Q 169.5 115, 185 121" />
        <path d="M 150 98 Q 159.5 122, 169 126" />
      </g>

      {/* 2. Waterline Accent */}
      <line x1="90" y1="118" x2="150" y2="118" stroke="var(--color-sunset-coral)" strokeWidth="2.5" strokeLinecap="round" />

      {/* 3. Badge Shield */}
      <path 
        d="M 74 70 L 97 34 Q 120 18, 143 34 L 166 70 L 143 106 Q 120 122, 97 106 Z" 
        fill="var(--color-deep-sea)" 
        stroke="currentColor"
        strokeWidth="3.5" 
        strokeLinejoin="round" 
        className="text-foam-white"
      />

      {/* 4. Monogram */}
      <text 
        x="120" 
        y="72" 
        fontFamily="var(--font-display)" 
        fontSize="34" 
        fontWeight="bold" 
        fill="currentColor" 
        textAnchor="middle" 
        dominantBaseline="central" 
        letterSpacing="-0.08em"
        style={{ userSelect: 'none' }}
        className="text-foam-white"
      >
        RP
      </text>

      {/* 5. Wordmark (Wide serif Didone) */}
      <text
        x="120"
        y="155"
        fontFamily="var(--font-display)"
        fontSize="17"
        fontWeight="bold"
        fill="currentColor"
        textAnchor="middle"
        letterSpacing="0.18em"
        style={{ userSelect: 'none' }}
        className="text-golden-sand"
      >
        REHAN PATEL
      </text>

      {/* 6. Tagline (Wide tracking small-caps mono) */}
      <text
        x="120"
        y="178"
        fontFamily="var(--font-mono)"
        fontSize="7"
        fill="currentColor"
        opacity="0.65"
        textAnchor="middle"
        letterSpacing="0.22em"
        style={{ userSelect: 'none' }}
        className="text-foam-white"
      >
        CRAFTING FLUID DIGITAL SHORELINES
      </text>
    </svg>
  );
}
